"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const firestore_1 = require("firebase/firestore");
const database_1 = __importDefault(require("../../../config/database"));
const encryptedData_1 = require("../../../helpers/encryptedData");
const getIp = (ipLocal, ipCookie, req) => __awaiter(void 0, void 0, void 0, function* () {
    if (ipLocal) {
        return (0, encryptedData_1.decDataString)(ipLocal);
    }
    else if (ipCookie) {
        return (0, encryptedData_1.decDataString)(ipCookie);
    }
    else {
        return req.headers["x-forwarded-for"];
    }
});
const setExpiryDate = (minutes) => {
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + minutes);
    return expiryDate.toISOString();
};
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.rawHeaders.includes("https://api-namilinklink.vercel.app/home")) {
            res.status(404).json({ code: 404, message: "Not Found!" });
            return;
        }
        const ipLocal = req.body.ipLocal;
        const ipCookie = req.body.ipCookie;
        const ipCheck = req.headers["x-forwarded-for"];
        const ip = yield getIp(ipLocal, ipCookie, req);
        if (!ipLocal ||
            !ipCookie ||
            ipLocal !== ipCookie ||
            (0, encryptedData_1.decDataString)(ipLocal) !== ipCheck ||
            (0, encryptedData_1.decDataString)(ipCookie) !== ipCheck) {
            const queryCheckBan = yield (0, firestore_1.getDocs)((0, firestore_1.query)((0, firestore_1.collection)(database_1.default, "ip-check"), (0, firestore_1.where)("ip", "==", ipCheck)));
            if (queryCheckBan.empty) {
                const data = {
                    ip: ipCheck,
                    time: setExpiryDate(72 * 60),
                };
                yield (0, firestore_1.addDoc)((0, firestore_1.collection)(database_1.default, "ip-check"), data);
            }
            else {
                const docSnap = queryCheckBan.docs[0];
                const docRef = (0, firestore_1.doc)(database_1.default, "ip-check", docSnap.id);
                yield (0, firestore_1.updateDoc)(docRef, {
                    time: setExpiryDate(72 * 60),
                });
            }
            res.status(401).json({
                code: 401,
                message: "Mày Đã Bị Chặn 3 Ngày Vì Thích Nghịch WEB TAO DCMMM!",
                ip: (0, encryptedData_1.encryptedDataString)(ip),
            });
            return;
        }
        const querySnapshot = yield (0, firestore_1.getDocs)((0, firestore_1.query)((0, firestore_1.collection)(database_1.default, "ip-check"), (0, firestore_1.where)("ip", "==", ip)));
        if (querySnapshot.empty) {
            const data = {
                ip: ip,
                time: setExpiryDate(5),
            };
            yield (0, firestore_1.addDoc)((0, firestore_1.collection)(database_1.default, "ip-check"), data);
        }
        else {
            const docSnap = querySnapshot.docs[0];
            const docRef = (0, firestore_1.doc)(database_1.default, "ip-check", docSnap.id);
            const result = docSnap.data();
            const now = new Date();
            const expiryDate = new Date(result.time);
            const diffInMinutes = (expiryDate.getTime() - now.getTime()) / 1000 / 60;
            if (diffInMinutes > 6) {
                res.status(401).json({
                    code: 401,
                    message: "Bố Đã Bảo Mày Bị Ban 3 Ngày Rồi Mà `DCMM ĐỪNG ẤN NỮA!`",
                    ip: (0, encryptedData_1.encryptedDataString)(ip),
                });
                return;
            }
            if (new Date() < expiryDate) {
                const nowTime = new Date();
                const secondsRemaining = (expiryDate.getTime() - nowTime.getTime()) / 1000;
                res.status(401).json({
                    code: 401,
                    message: `Bạn Đã Bị Block Truy Cập Vì Sử Dụng Quá Nhiều Vui Lòng Thử Lại Trong Vòng ${secondsRemaining} Giây!`,
                    ip: (0, encryptedData_1.encryptedDataString)(ip),
                });
                return;
            }
            else {
                yield (0, firestore_1.updateDoc)(docRef, {
                    time: setExpiryDate(5),
                });
            }
        }
        req["ip-public"] = ip;
        next();
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Lỗi Server!",
            code: 500,
        });
    }
});
exports.auth = auth;
