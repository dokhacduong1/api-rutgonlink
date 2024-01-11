"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("firebase/app");
require("firebase/firestore");
const firebase_1 = require("./firebase");
const firestore_1 = require("firebase/firestore");
const app = (0, app_1.initializeApp)(firebase_1.firebaseConfig);
const db = (0, firestore_1.getFirestore)(app);
exports.default = db;
