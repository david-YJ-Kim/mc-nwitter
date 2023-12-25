import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCiBur5eJl8QX3xu_dBRKO0dSMjKqpUOOA",
  authDomain: "sellter-e5dc9.firebaseapp.com",
  projectId: "sellter-e5dc9",
  storageBucket: "sellter-e5dc9.appspot.com",
  messagingSenderId: "484362266395",
  appId: "1:484362266395:web:7475c2f13d8d5af0da95be",
  measurementId: "G-03127VT72S",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);
