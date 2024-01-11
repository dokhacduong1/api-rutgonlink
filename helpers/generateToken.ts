
import crypto from "crypto"
export function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}


export const generateRandomNumber = (length : number) : string => {
  let result : string = "";
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10); // Số ngẫu nhiên từ 0 đến 9
  }
  return result;
};