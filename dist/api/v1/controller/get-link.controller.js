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
exports.success = exports.getLink = void 0;
const axios_1 = __importDefault(require("axios"));
const database_1 = __importDefault(require("../../../config/database"));
const firestore_1 = require("firebase/firestore");
const encryptedData_1 = require("../../../helpers/encryptedData");
const dotenv_1 = __importDefault(require("dotenv"));
const generateToken_1 = require("../../../helpers/generateToken");
dotenv_1.default.config();
const API_TOKEN = process.env.TOKEN_WEB1S;
const URL_MAIL = "https://api-rutgonlink.vercel.app/api/v1/get-link/success?key";
const getLink = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = {
                key: (0, generateToken_1.generateRandomString)(20),
            };
            const docRef = yield (0, firestore_1.addDoc)((0, firestore_1.collection)(database_1.default, "get-key"), data);
            const encrypted = (0, encryptedData_1.encryptedData)(docRef.id);
            const randomAlias = (0, generateToken_1.generateRandomString)(10);
            const link = `https://web1s.com/api?token=${API_TOKEN}&url=${URL_MAIL}=${encrypted}&alias=${randomAlias}`;
            const response = yield axios_1.default.get(link);
            const dataResponse = response.data;
            if (dataResponse.status === "error") {
                res.status(400).json({ error: "Bad Request", code: 400 });
                return;
            }
            res.status(200).json({ link: dataResponse.shortenedUrl, code: 200 });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.getLink = getLink;
const success = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.query.key;
            if (!id) {
                res.status(400).json({ error: "Bad Request", code: 400 });
                return;
            }
            const decId = (0, encryptedData_1.decData)(id);
            const docRef = (0, firestore_1.doc)(database_1.default, "get-key", decId);
            const docSnap = yield (0, firestore_1.getDoc)(docRef);
            if (docSnap.exists()) {
                res.status(200).json({ data: docSnap.data(), code: 200 });
            }
            else {
                res.status(400).json({ error: "Bad Request", code: 400 });
            }
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.success = success;
