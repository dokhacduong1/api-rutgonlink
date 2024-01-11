import { Request, Response } from "express";
import axios from "axios";
import db from "../../../config/database";
import { collection, getDocs, addDoc, doc, getDoc } from "firebase/firestore";
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
