import { Request, Response } from "express";
import axios from "axios";
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
} from "firebase/firestore";
import { decData, encryptedData } from "../../../helpers/encryptedData";
import dotenv from "dotenv";
import { generateRandomString } from "../../../helpers/generateToken";
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
    const data = {
      key: generateRandomString(20),
      hwid: "",
      time: "",
    };

    const docRef = await addDoc(collection(db, "get-key"), data);
    //mã hóa id của document
    const encrypted = encryptedData(docRef.id);
    const randomAlias = generateRandomString(10);
    const link = `https://web1s.com/api?token=${API_TOKEN}&url=${URL_MAIL}=${encrypted}&alias=${randomAlias}`;

    const response = await axios.get(link);
    const dataResponse = response.data;
    if (dataResponse.status === "error") {
      res.status(400).json({ error: "Bad Request", code: 400 });
      return;
    }
    res.status(200).json({ link: dataResponse.shortenedUrl, code: 200 });
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.render("pages/errors/404", {
      pageTitle: "404 Not Found",
    });
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
    const docRef = doc(db, "get-key", decId);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();

    //Nếu tồn tại document thì trả về dữ liệu
    res.render("pages/link/index.pug", {
      pageTitle: "Key",
      data: data,
    });
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.render("pages/errors/404", {
      pageTitle: "404 Not Found",
    });
  }
};

// [post] /api/v1/get-link/check
export const checkLink = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { key, hwid, time } = req.body;
    const querySnapshot = await getDocs(
      query(collection(db, "get-key"), where("key", "==", key))
    );

    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      const result = docSnap.data();

      if (result.hwid === "" && result.time === "") {
        const docRef = doc(db, "get-key", docSnap.id);
        await updateDoc(docRef, { hwid, time });
        res.status(200).json({ message: "Key Còn Hạn!", code: 200 });
      } 
      else{
        if (result.hwid === hwid) {
          res.status(200).json({ message: "Key Còn Hạn!", code: 200 });
        }else{
          res.status(401).json({ message: "Bạn Không Phải Người Sở Hữu Key Này!", code: 401 });
        }
      }
    } else {
      res.status(404).json({ message: "Key Không Tồn Tại", code: 404 });
    }
  } catch (error) {
    console.error("Error in API:", error);
    res.status(500).json({ message: "Key Không Tồn Tại", code: 500 });
  }
};

