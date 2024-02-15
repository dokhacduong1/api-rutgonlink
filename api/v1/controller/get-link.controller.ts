import { Request, Response } from "express";
import axios from "axios";
import firebase from "firebase/app";
import db from "../../../config/database";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  query,
  where,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { decData, encryptedData, encryptedDataString } from "../../../helpers/encryptedData";
import dotenv from "dotenv";
import { generateRandomString } from "../../../helpers/generateToken";
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
dotenv.config();
const API_TOKEN = process.env.TOKEN_WEB1S;
const URL_MAIL =
  "https://api-namilinklink.vercel.app/api/v1/get-link/success?key";
// [POST] /api/v1/get-link/
export const getLink = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    const now = new Date();
    const expiryDate = new Date();
    expiryDate.setHours(now.getHours() + 24);
    const data = {
      key: "Free_" + generateRandomString(10),
      hwid: "",
      time: expiryDate.toISOString(),
      free: "",
    };
   
    const docRef = await addDoc(collection(db, "get-key"), data);
  
    //mã hóa id của document
    const encrypted = encryptedData(docRef.id);
    const randomAlias = generateRandomString(10);
    const link = `https://web1s.com/api?token=0968ea6f-6d4d-4af8-950d-8163ddcc319d&url=${URL_MAIL}=${encrypted}&alias=${randomAlias}`;


 
    const response  = await  fetch(link)

    res.status(200).json({data:response})
    return
    const dataResponse = await response.json();

    if (dataResponse.status === "error") {
      res.status(400).json({ error: "Bad Request", code: 400 });
      return;
    }

    const randomAlias2 = generateRandomString(10);
    const link2 = `https://web1s.com/api?token=0968ea6f-6d4d-4af8-950d-8163ddcc319d&url=${dataResponse.shortenedUrl}&alias=${randomAlias2}`;
    const response2 = await fetch(link2);
    const dataResponse2 = await response2.json();
    if (dataResponse2.status === "error") {
      res.status(400).json({ error: "Bad Request", code: 400 });
      return;
    }
  
    res.status(200).json({ link: dataResponse2.shortenedUrl, code: 200,ip: encryptedDataString(req["ip-public"]) });
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    // console.error("Error in API:", error);
    res.status(500).json({ code: 500,error: error });
    // res.render("pages/errors/404", {
    //   pageTitle: "404 Not Found",
    // });
  }
};

// [GET] /api/v1/get-link/success?key=${key}
export const success = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = req.query.key;

    const decId = decData(id);
    console.log(decId);
    const docRef = doc(db, "get-key", decId);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    if(!data){
      data.key ="Key Không Tồn Tại!"
    }
    console.log(data);
    //Nếu tồn tại document thì trả về dữ liệu
    res.render("pages/link/index.pug", {
      pageTitle: "Key",
      data: data,
    });
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
   
    res.render("pages/errors/404", {
      pageTitle: "404 Not Found",
    });
  }
};

// [post] /api/v1/get-link/check
// [post] /api/v1/get-link/check
export const checkLink = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    //Lấy dữ liệu người dùng gửi lên
    const { key, hwid } = req.body;
//
    const querySnapshot = await getDocs(
      query(collection(db, "get-key"), where("key", "==", key))
    );
    //Nếu dữ liệu người dùng gửi lên là rỗng thì báo lỗi chưa có dữ liệu
    if (querySnapshot.empty) {
      res.status(404).json({
        message: "Key Không Tồn Tại!",
        code: 404,
      });
      return;
    }
    //Lấy dữ liệu của document đầu tiên
    const docSnap = querySnapshot.docs[0];
    //Lấy dữ liệu của document
    const result = docSnap.data();
    //Nếu tồn tại key miễn phí thì trả về dữ liệu
    if (result.free === "true") {
      sendResponse(res, 200, "Đăng Nhập Thành Công!");
      return;
    }
    //Nếu hwid là rỗng thì cập nhật hwid
    if (result.hwid === "") {
      const docRef = doc(db, "get-key", docSnap.id);
      await updateDoc(docRef, { hwid });
      sendResponse(res, 200, "Đăng Nhập Thành Công!");
      return;
    }

    //Nếu hwid không trùng khớp với hwid đã lưu thì báo lỗi
    if (result.hwid !== hwid) {
      sendResponse(res, 401, "Bạn Không Phải Người Sở Hữu Key Này!");
      return;
    }
    
    //Nếu key đã hết hạn thì báo lỗi
    const expiryDate = new Date(result.time);
    if (new Date() > expiryDate) {
      //Xóa document
      const docRef = doc(db, "get-key", docSnap.id);
      await deleteDoc(docRef);
      sendResponse(res, 400, "Key Đã Hết Hạn!");
      return;
    }
    //Nếu không có lỗi nào xảy ra thì trả về dữ liệu
    sendResponse(res, 200, "Đăng Nhập Thành Công!");
    return;
  } catch (error) {
    sendResponse(res, 500, "Lỗi Server!");
    return;
  }
};

function sendResponse(res: Response, code: number, message: string) {
  return res.status(code).json({
    message,
    code,
  });
}
