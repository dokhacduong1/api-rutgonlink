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
exports.checkLink = exports.success = exports.getLink = void 0;
const axios_1 = __importDefault(require("axios"));
const database_1 = __importDefault(require("../../../config/database"));
const firestore_1 = require("firebase/firestore");
const encryptedData_1 = require("../../../helpers/encryptedData");
const dotenv_1 = __importDefault(require("dotenv"));
const generateToken_1 = require("../../../helpers/generateToken");
dotenv_1.default.config();
const API_TOKEN = process.env.TOKEN_WEB1S;
const URL_MAIL = "https://api-namilinklink.vercel.app/api/v1/get-link/success?key";
const getLink = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const now = new Date();
            const expiryDate = new Date();
            expiryDate.setHours(now.getHours() + 24);
            const data = {
                key: "Free_" + (0, generateToken_1.generateRandomString)(10),
                hwid: "",
                time: expiryDate.toISOString(),
                free: "",
            };
            const docRef = yield (0, firestore_1.addDoc)((0, firestore_1.collection)(database_1.default, "get-key"), data);
            const encrypted = (0, encryptedData_1.encryptedData)(docRef.id);
            const randomAlias = (0, generateToken_1.generateRandomString)(10);
            const link = `https://web1s.com/api?token=${API_TOKEN}&url=${URL_MAIL}=${encrypted}&alias=${randomAlias}`;
            const response = yield axios_1.default.get(link);
            const dataResponse = response.data;
            console.log(dataResponse);
            if (dataResponse.status === "error") {
                res.status(400).json({ error: "Bad Request", code: 400 });
                return;
            }
            const randomAlias2 = (0, generateToken_1.generateRandomString)(10);
            const link2 = `https://web1s.com/api?token=${API_TOKEN}&url=${dataResponse.shortenedUrl}&alias=${randomAlias2}`;
            const response2 = yield axios_1.default.get(link2);
            const dataResponse2 = response2.data;
            if (dataResponse2.status === "error") {
                res.status(400).json({ error: "Bad Request", code: 400 });
                return;
            }
            res.status(200).json({ link: dataResponse2.shortenedUrl, code: 200, ip: (0, encryptedData_1.encryptedDataString)(req["ip-public"]) });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.render("pages/errors/404", {
                pageTitle: "404 Not Found",
            });
        }
    });
};
exports.getLink = getLink;
const success = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.query.key;
            const decId = (0, encryptedData_1.decData)(id);
            console.log(decId);
            const docRef = (0, firestore_1.doc)(database_1.default, "get-key", decId);
            const docSnap = yield (0, firestore_1.getDoc)(docRef);
            const data = docSnap.data();
            if (!data) {
                data.key = "Key Không Tồn Tại!";
            }
            console.log(data);
            res.render("pages/link/index.pug", {
                pageTitle: "Key",
                data: data,
            });
        }
        catch (error) {
            res.render("pages/errors/404", {
                pageTitle: "404 Not Found",
            });
        }
    });
};
exports.success = success;
const checkLink = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { key, hwid } = req.body;
            const querySnapshot = yield (0, firestore_1.getDocs)((0, firestore_1.query)((0, firestore_1.collection)(database_1.default, "get-key"), (0, firestore_1.where)("key", "==", key)));
            if (querySnapshot.empty) {
                res.status(404).json({
                    message: "Key Không Tồn Tại!",
                    code: 404,
                });
                return;
            }
            const docSnap = querySnapshot.docs[0];
            const result = docSnap.data();
            if (result.free === "true") {
                sendResponse(res, 200, "Đăng Nhập Thành Công!");
                return;
            }
            if (result.hwid === "") {
                const docRef = (0, firestore_1.doc)(database_1.default, "get-key", docSnap.id);
                yield (0, firestore_1.updateDoc)(docRef, { hwid });
                sendResponse(res, 200, "Đăng Nhập Thành Công!");
                return;
            }
            if (result.hwid !== hwid) {
                sendResponse(res, 401, "Bạn Không Phải Người Sở Hữu Key Này!");
                return;
            }
            const expiryDate = new Date(result.time);
            if (new Date() > expiryDate) {
                const docRef = (0, firestore_1.doc)(database_1.default, "get-key", docSnap.id);
                yield (0, firestore_1.deleteDoc)(docRef);
                sendResponse(res, 400, "Key Đã Hết Hạn!");
                return;
            }
            sendResponse(res, 200, "Đăng Nhập Thành Công!");
            return;
        }
        catch (error) {
            sendResponse(res, 500, "Lỗi Server!");
            return;
        }
    });
};
exports.checkLink = checkLink;
function sendResponse(res, code, message) {
    return res.status(code).json({
        message,
        code,
    });
}
