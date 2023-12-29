// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB8rllHl2W4KW7QaPHX4bvbZfGQHHJ1gMk",
  authDomain: "nc-nwitter.firebaseapp.com",
  projectId: "nc-nwitter",
  storageBucket: "nc-nwitter.appspot.com",
  messagingSenderId: "482509308778",
  appId: "1:482509308778:web:90edcf8992f34a25331b13",
  measurementId: "G-D9188JQP4K",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);
