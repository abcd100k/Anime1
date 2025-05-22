import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC5QRR7b95LkJXnyZomiSlF-3y7Ytnp0Cw",
  authDomain: "aufftoolin.firebaseapp.com",
  databaseURL: "https://aufftoolin-default-rtdb.firebaseio.com",
  projectId: "aufftoolin",
  storageBucket: "aufftoolin.appspot.com",
  messagingSenderId: "448046871938",
  appId: "1:448046871938:web:a708bdd3208633737a4b9b",
  measurementId: "G-PL8VVC5QQW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Firebase Authentication
const auth = getAuth(app);

export { app, db, auth };