// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDt8R4oDp479oYTKDwOMICjZEIK_SCU7to",
  authDomain: "to-do-83c15.firebaseapp.com",
  projectId: "to-do-83c15",
  storageBucket: "to-do-83c15.appspot.com",
  messagingSenderId: "892326500454",
  appId: "1:892326500454:web:0e926c5be87b576cabb5a7",
  measurementId: "G-57CP5HCYGE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
 
 export const auth=getAuth(app);
 export const db=getFirestore(app);
