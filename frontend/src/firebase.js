import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCBtPz5hQqyTu2EbCAKLFSUeKOpBBm7B4M",
  authDomain: "smart-cart-33b90.firebaseapp.com",
  projectId: "smart-cart-33b90",
  storageBucket: "smart-cart-33b90.firebasestorage.app",
  messagingSenderId: "282991791138",
  appId: "1:282991791138:web:dd6157906e54961b26ce7b",
  measurementId: "G-97SY4XLVGK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
