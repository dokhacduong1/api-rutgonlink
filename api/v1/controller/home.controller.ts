import { Request, Response } from "express";
import { encryptedDataString } from "../../../helpers/encryptedData";
export const index = async function (
    req: Request,
    res: Response
  ): Promise<void> {
    try {
        const ip =  req.headers['x-forwarded-for'];
        res.render("pages/home/index", {
            pageTitle: "home", 
            ip: encryptedDataString(ip)
          });
     
    } catch (error) {
      //Thông báo lỗi 500 đến người dùng server lỗi.
      console.error("Error in API:", error);
      res.render("pages/errors/404", {
        pageTitle: "404 Not Found",
      });
    }
  };