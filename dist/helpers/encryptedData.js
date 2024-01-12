"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decDataString = exports.encryptedDataString = exports.decData = exports.encryptedData = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const secretKey = process.env.SECRET_KEY;
function encryptedData(data) {
    var ciphertext = crypto_js_1.default.AES.encrypt(JSON.stringify(data), secretKey).toString();
    var encodedCiphertext = encodeURIComponent(ciphertext);
    encodedCiphertext = encodedCiphertext.replace(/[^a-zA-Z0-9]/g, '!');
    return encodedCiphertext;
}
exports.encryptedData = encryptedData;
function decData(encryptedDataFromServer) {
    var decodedCiphertext = encryptedDataFromServer.replace(/!/g, '%');
    decodedCiphertext = decodeURIComponent(decodedCiphertext);
    let bytes = crypto_js_1.default.AES.decrypt(decodedCiphertext, secretKey);
    let decryptedData = bytes.toString(crypto_js_1.default.enc.Utf8);
    return JSON.parse(decryptedData);
}
exports.decData = decData;
function encryptedDataString(data) {
    var ciphertext = crypto_js_1.default.AES.encrypt(data, secretKey).toString();
    var encodedCiphertext = encodeURIComponent(ciphertext);
    encodedCiphertext = encodedCiphertext.replace(/[^a-zA-Z0-9]/g, '!');
    return encodedCiphertext;
}
exports.encryptedDataString = encryptedDataString;
function decDataString(encryptedDataFromServer) {
    var decodedCiphertext = encryptedDataFromServer.replace(/!/g, '%');
    decodedCiphertext = decodeURIComponent(decodedCiphertext);
    let bytes = crypto_js_1.default.AES.decrypt(decodedCiphertext, secretKey);
    let decryptedData = bytes.toString(crypto_js_1.default.enc.Utf8);
    return decryptedData;
}
exports.decDataString = decDataString;
