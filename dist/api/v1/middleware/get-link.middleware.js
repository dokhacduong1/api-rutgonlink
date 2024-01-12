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
const getIp_1 = require("../../../helpers/getIp");
const getIp = (ipLocal, ipCookie) => __awaiter(void 0, void 0, void 0, function* () {
    if (ipLocal) {
        return ipLocal;
    }
    else if (ipCookie) {
        return decodeURIComponent(ipCookie);
    }
    else {
        return yield (0, getIp_1.getPublicIpV6)();
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
        const ip = yield getIp(ipLocal, ipCookie);
        const querySnapshot = yield (0, firestore_1.getDocs)((0, firestore_1.query)((0, firestore_1.collection)(database_1.default, "ip-check"), (0, firestore_1.where)("ip", "==", ip)));
        if (querySnapshot.empty) {
            if (ipLocal) {
                res.status(302).json({
                    code: 302,
                    message: "Đừng Nghịch Lung Tung Hãy Thay Đổi Lại Giá Trị Bạn Đã Nghịch Trước Đó!",
                });
                return;
            }
            const data = {
                ip: ip,
                time: setExpiryDate(5),
            };
            yield (0, firestore_1.addDoc)((0, firestore_1.collection)(database_1.default, "ip-check"), data);
        }
        else {
            const docSnap = querySnapshot.docs[0];
            const docRef = (0, firestore_1.doc)(database_1.default, "ip-check", docSnap.id);
            if (!ipLocal || !ipCookie) {
                yield (0, firestore_1.updateDoc)(docRef, {
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
                const test = yield (0, getIp_1.getPublicIpV6)();
                res.status(401).json({
                    code: 401,
                    message: "Bạn Đã Bị Block Truy Cập Vì Sử Dụng Quá Nhiều Lần Trong 5 Phút!",
                    ip: test,
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
        res.status(500).json({
            message: "Lỗi Server!",
            code: 500,
        });
    }
});
exports.auth = auth;
