
import CryptoJS from "crypto-js"
import dotenv from "dotenv"
dotenv.config()
//Lấy secret key từ file .env
const secretKey = process.env.SECRET_KEY;

//Đây là hàm mã hóa dữ liệu về một  dạng mã hóa đối xứng AES (Advanced Encyption Standard)
export function encryptedData(data: any) : string {
    // Encrypt
    var ciphertext : string = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
    // Encode to URL-safe format
    var encodedCiphertext = encodeURIComponent(ciphertext);
    encodedCiphertext = encodedCiphertext.replace(/[^a-zA-Z0-9]/g, '!');
    return encodedCiphertext;
}

export function decData(encryptedDataFromServer) {
    // Replace non-alphanumeric characters back to their original form
    var decodedCiphertext = encryptedDataFromServer.replace(/!/g, '%');
    // Decode from URL-safe format
    decodedCiphertext = decodeURIComponent(decodedCiphertext);
    // Decrypt
    let bytes = CryptoJS.AES.decrypt(decodedCiphertext, secretKey);
    let decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    // Parse the decrypted data back to its original form
    return JSON.parse(decryptedData);
}

//Đây là hàm mã hóa dữ liệu về một  dạng mã hóa đối xứng AES (Advanced Encyption Standard)
export function encryptedDataString(data: any) : string {
    // Encrypt
    var ciphertext : string = CryptoJS.AES.encrypt(data, secretKey).toString();
    // Encode to URL-safe format
    var encodedCiphertext = encodeURIComponent(ciphertext);
    encodedCiphertext = encodedCiphertext.replace(/[^a-zA-Z0-9]/g, '!');
    return encodedCiphertext;
}


export function decDataString(encryptedDataFromServer) {
    // Replace non-alphanumeric characters back to their original form
    var decodedCiphertext = encryptedDataFromServer.replace(/!/g, '%');
    // Decode from URL-safe format
    decodedCiphertext = decodeURIComponent(decodedCiphertext);
    // Decrypt
    let bytes = CryptoJS.AES.decrypt(decodedCiphertext, secretKey);
    let decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    // Parse the decrypted data back to its original form
    return decryptedData;
}