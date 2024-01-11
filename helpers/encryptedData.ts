
import CryptoJS from "crypto-js"
import dotenv from "dotenv"
dotenv.config()

const secretKey = process.env.SECRET_KEY;

//Đây là hàm mã hóa dữ liệu về một  dạng mã hóa đối xứng AES (Advanced Encyption Standard)
export function encryptedData(data: any) : string {
    // Encrypt
    var ciphertext : string = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
    // Encode to URL-safe format
    var encodedCiphertext = encodeURIComponent(ciphertext);
    // Replace special characters
    encodedCiphertext = encodedCiphertext.replace(/\./g, '_').replace(/\//g, '-').replace(/\+/g, '*');
    return encodedCiphertext;
}

export function decData(encryptedDataFromServer) {
    // Replace non-special characters back to special characters
    encryptedDataFromServer = encryptedDataFromServer.replace(/_/g, '.').replace(/-/g, '/').replace(/\*/g, '+');
    // Decode from URL-safe format
    var decodedData = decodeURIComponent(encryptedDataFromServer);
    // Decrypt
    let bytes = CryptoJS.AES.decrypt(decodedData, secretKey);
    let data = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(data);
}