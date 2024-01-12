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

const getIp = async (ipLocal: string, ipCookie: string) => {
  if (ipLocal) {
    return ipLocal;
  } else if (ipCookie) {
    return decodeURIComponent(ipCookie);
  } else {
    return await getPublicIpV6();
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
    const ipLocal = req.body.ipLocal;
    const ipCookie = req.body.ipCookie;

    const ip = await getIp(ipLocal, ipCookie);

    const querySnapshot = await getDocs(
      query(collection(db, "ip-check"), where("ip", "==", ip))
    );

    if (querySnapshot.empty) {
      if (ipLocal) {
        res.status(302).json({
          code: 302,
          message:
            "Đừng Nghịch Lung Tung Hãy Thay Đổi Lại Giá Trị Bạn Đã Nghịch Trước Đó!",
        });
        return;
      }
      const data = {
        ip: ip,
        time: setExpiryDate(5),
      };
      await addDoc(collection(db, "ip-check"), data);
    } else {
      const docSnap = querySnapshot.docs[0];
      const docRef = doc(db, "ip-check", docSnap.id);

      if (!ipLocal || !ipCookie) {
        await updateDoc(docRef, {
          time: setExpiryDate(72 * 60),
        });
        res.status(401).json({
          code: 401,
          message: "Mày Đã Bị Chặn 3 Ngày Vì Thích Nghịch WEB TAO DCMMM!",
          ip: ip,
        });
        return;
      }

      const result = docSnap.data();
      const now = new Date();
      const expiryDate = new Date(result.time);
      const diffInMinutes = (expiryDate.getTime() - now.getTime()) / 1000 / 60;
      if (diffInMinutes > 6) {
        res.status(401).json({
          code: 401,
          message: "Mày Đã Bị Chặn 3 Ngày Vì Thích Nghịch WEB TAO DCMM!",
          ip: ip,
        });
        return;
      }
      if (new Date() < expiryDate) {
        const test = await getPublicIpV6()
        res.status(401).json({
          code: 401,
          message:
            "Bạn Đã Bị Block Truy Cập Vì Sử Dụng Quá Nhiều Lần Trong 5 Phút!",
          ip: test,
        });
        return;
      } else {
        await updateDoc(docRef, {
          time: setExpiryDate(5),
        });
      }
    }
    req["ip-public"] = ip;
    next();
  } catch (error) {
    res.status(500).json({
      message: "Lỗi Server!",
      code: 500,
    });
  }
};
