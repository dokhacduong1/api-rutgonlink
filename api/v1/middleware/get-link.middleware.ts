import {
  collection,
  getDocs,
  addDoc,
  doc,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { Request, Response } from "express";
import db from "../../../config/database";
import { getPublicIpV6 } from "../../../helpers/getIp";
import {
  decData,
  decDataString,
  encryptedData,
  encryptedDataString,
} from "../../../helpers/encryptedData";

const getIp = async (ipLocal: string, ipCookie: string, req: Request) => {
  if (ipLocal) {
    return decDataString(ipLocal);
  } else if (ipCookie) {
    return decDataString(ipCookie);
  } else {
    return req.headers["x-forwarded-for"];
  }
};

const setExpiryDate = (minutes: number) => {
  const expiryDate = new Date();
  expiryDate.setMinutes(expiryDate.getMinutes() + minutes);
  return expiryDate.toISOString();
};

export const auth = async (
  req: Request,
  res: Response,
  next: any
): Promise<void> => {
  try {
    if (!req.rawHeaders.includes("https://api-namilinklink.vercel.app/home")) {
      res.status(404).json({ code: 404, message: "Not Found!" });
      return;
    }
    const ipLocal = req.body.namiv1;
    const ipCookie = req.body.namiv2;
    const ipCheck = req.headers["x-forwarded-for"];
    //Ban ip nếu ipLocal và ipCookie khác nhau hoặc ipLocal và ipCookie không giống với ipCheck
    const ip = await getIp(ipLocal, ipCookie, req);

    // if (
    //   !ipLocal ||
    //   !ipCookie ||
    //   ipLocal !== ipCookie ||
    //   decDataString(ipLocal) !== ipCheck ||
    //   decDataString(ipCookie) !== ipCheck
    // ) {
    //   const queryCheckBan = await getDocs(
    //     query(collection(db, "ip-check"), where("ip", "==", ipCheck))
    //   );
    //   if (queryCheckBan.empty) {
    //     const data = {
    //       ip: ipCheck,
    //       time: setExpiryDate(72 * 60),
    //     };
    //     await addDoc(collection(db, "ip-check"), data);

       

    //   } else {
    //     const docSnap = queryCheckBan.docs[0];
    //     const docRef = doc(db, "ip-check", docSnap.id);
    //     await updateDoc(docRef, {
    //       time: setExpiryDate(72 * 60),
    //     });
    //   }
    //   res.status(401).json({
    //     code: 401,
    //     message: "Mày Đã Bị Chặn 3 Ngày Vì Thích Nghịch WEB TAO DCMMM!",
    //     ip: encryptedDataString(ip),
    //   });
    //   return;
    // }

    const querySnapshot = await getDocs(
      query(collection(db, "ip-check"), where("ip", "==", ipCheck))
    );
    //Vào đây là chưa có ip trong database
    if (querySnapshot.empty) {
      const data = {
        ip: ipCheck,
        time: setExpiryDate(5),
      };
      await addDoc(collection(db, "ip-check"), data);
    } else {
      const docSnap = querySnapshot.docs[0];
      const docRef = doc(db, "ip-check", docSnap.id);
      const result = docSnap.data();
      const now = new Date();
      const expiryDate = new Date(result.time);
      const diffInMinutes = (expiryDate.getTime() - now.getTime()) / 1000 / 60;
      if (diffInMinutes > 6) {
        res.status(401).json({
          code: 401,
          message: "Bố Đã Bảo Mày Bị Ban 3 Ngày Rồi Mà `DCMM ĐỪNG ẤN NỮA!`",
          ip: encryptedDataString(ip),
        });
        return;
      }
      if (new Date() < expiryDate) {
        const nowTime = new Date();
        const secondsRemaining =
          (expiryDate.getTime() - nowTime.getTime()) / 1000;

        res.status(401).json({
          code: 401,
          message: `Bạn Đã Bị Block Truy Cập Vì Sử Dụng Quá Nhiều Vui Lòng Thử Lại Trong Vòng ${Math.round(
            secondsRemaining
          )} Giây!`,
          ip: encryptedDataString(ip),
        });
        return;
      } else {
        await updateDoc(docRef, {
          time: setExpiryDate(5),
        });
      }
    }
    req["ip-public"] = ipCheck;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Lỗi Server!",
      code: 500,
    });
  }
};
