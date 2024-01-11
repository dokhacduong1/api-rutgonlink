
import { Request, Response } from "express";
export const getLinkValidate = (req: Request, res: Response, next: any) : void => {
    
    const key: string = req.body.key;
    const hwid: string = req.body.hwid;
    
    
    //Nếu dữ liệu người dùng gửi lên là rỗng thì báo lỗi chưa có dữ liệu
    if (!key || !hwid ) {
         res.status(400).json({ error: "Chưa Có Dữ Liệu!" });
         return;
    }
   
    next();
}