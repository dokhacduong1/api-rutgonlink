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
import { Request, Response } from "express";
import db from "../../../config/database";
import { getPublicIp } from "../../../helpers/getIp";
export const auth = async (
  req: Request,
  res: Response,
  next: any
): Promise<void> => {
  try {
    const ipLocal = req.body.ipLocal;
    const ipCookie = req.body.ipCookie;
    let ip = "";
    console.log(req.rawHeaders.includes("http://localhost:2709/home"))
    if (ipLocal !== undefined) {
      ip = ipLocal;
    } else if (ipCookie !== undefined) {
      ip = ipCookie;
    } else {
      ip = await getPublicIp();
    }
    const now = new Date();
    const expiryDate = new Date();
    expiryDate.setMinutes(now.getMinutes() + 5);

    const querySnapshot = await getDocs(
      query(collection(db, "ip-check"), where("ip", "==", ip))
    );

    if (querySnapshot.empty) {
      if (ipLocal !== undefined) {
        res.status(302).json({
          code: 302,
          message:
            "Đừng Nghịch Lung Tung Hãy Thay Đổi Lại Giá Trị Bạn Đã Nghịch Trước Đó!",
        });
        return;
      }
      const data = {
        ip: ip,
        time: expiryDate.toISOString(),
      };
      const docRef = await addDoc(collection(db, "ip-check"), data);
    } else {
      //Lấy dữ liệu của document đầu tiên
      const docSnap = querySnapshot.docs[0];
      //Lấy dữ liệu của document
      const result = docSnap.data();
      //Nếu key đã hết hạn thì báo lỗi
      const expiryDate = new Date(result.time);

      if (new Date() < expiryDate) {
        res.cookie('nami-ip-nodejs', ip, { maxAge: 9000000000, httpOnly: true });
        res.status(401).json({
          code: 401,
          message:
            "Bạn Đã Bị Block Truy Cập Vì Sử Dụng Quá Nhiều Lần Trong 5 Phút!",
          ip: ip,
          raw:req.rawHeaders
        });
        return;
      } else {
        const now1 = new Date();
        const expiryDate1 = new Date();
        expiryDate1.setMinutes(now1.getMinutes() + 5);
        //update time lại thành 5 phút sau
        const docRef = doc(db, "ip-check", docSnap.id);
        await updateDoc(docRef, {
          time: expiryDate1.toISOString(),
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
