import { Request, Response } from "express";
import { encryptedDataString } from "../../../helpers/encryptedData";
export const index = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    const ip = req.headers["x-forwarded-for"];
    res.render("pages/home/index", {
      pageTitle: "home",
      ip: encryptedDataString(ip),
    });
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.render("pages/errors/404", {
      pageTitle: "404 Not Found",
    });
  }
};

export const homePost = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    const ipLocal = req.body.namiv1;
    const ipCookie = req.body.namiv2;

    if(ipLocal && ipCookie ){
      res.status(200).json({gege: ipLocal});
      return;
    }
    const ip = req.headers["x-forwarded-for"];
    console.log("mama2",ip)
    res.status(200).json({gege: encryptedDataString(ip)});
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.render("pages/errors/404", {
      pageTitle: "404 Not Found",
    });
  }
};
