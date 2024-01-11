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
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ip = yield (0, getIp_1.getPublicIp)();
        const now = new Date();
        const expiryDate = new Date();
        expiryDate.setMinutes(now.getMinutes() + 5);
        const querySnapshot = yield (0, firestore_1.getDocs)((0, firestore_1.query)((0, firestore_1.collection)(database_1.default, "ip-check"), (0, firestore_1.where)("ip", "==", ip)));
        if (querySnapshot.empty) {
            const data = {
                ip: ip,
                time: expiryDate.toISOString(),
            };
            const docRef = yield (0, firestore_1.addDoc)((0, firestore_1.collection)(database_1.default, "ip-check"), data);
        }
        else {
            const docSnap = querySnapshot.docs[0];
            const result = docSnap.data();
            const expiryDate = new Date(result.time);
            if (new Date() < expiryDate) {
                res.status(400).json({
                    code: 400,
                    message: "Bạn Đã Bị Block Truy Cập Vì Sử Dụng Quá Nhiều Lần Trong 5 Phút!",
                });
                return;
            }
            else {
                const now1 = new Date();
                const expiryDate1 = new Date();
                expiryDate1.setMinutes(now1.getMinutes() + 5);
                const docRef = (0, firestore_1.doc)(database_1.default, "ip-check", docSnap.id);
                yield (0, firestore_1.updateDoc)(docRef, {
                    time: expiryDate1.toISOString(),
                });
            }
        }
        next();
    }
    catch (error) {
        res.status(500).json({
            message: "Lỗi Server!",
            code: 500
        });
    }
});
exports.auth = auth;
