// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import 'firebase/firestore';

import { firebaseConfig } from "./firebase";
import { getFirestore } from "firebase/firestore";

// Initialize Firebase
 const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
 export default db;
