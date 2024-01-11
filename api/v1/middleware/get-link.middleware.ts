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
    const ip = await getPublicIp();
    const now = new Date();
    const expiryDate = new Date();
    expiryDate.setMinutes(now.getMinutes() + 5);
    const querySnapshot = await getDocs(
      query(collection(db, "ip-check"), where("ip", "==", ip))
    );

    if (querySnapshot.empty) {
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
        res.status(400).json({
          code: 400,
          message:
            "Bạn Đã Bị Block Truy Cập Vì Sử Dụng Quá Nhiều Lần Trong 5 Phút!",
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
    next();
  } catch (error) {
    res.status(500).json({
        message:"Lỗi Server!",
        code:500
      });
  }
};

