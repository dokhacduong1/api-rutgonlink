"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomNumber = exports.generateRandomString = void 0;
function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}
exports.generateRandomString = generateRandomString;
const generateRandomNumber = (length) => {
    let result = "";
    for (let i = 0; i < length; i++) {
        result += Math.floor(Math.random() * 10);
    }
    return result;
};
exports.generateRandomNumber = generateRandomNumber;
