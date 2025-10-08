// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTg6AO5t935QsGoyzPrvMR0aNJJIxNzjA",
  authDomain: "carepoint-b3a64.firebaseapp.com",
  projectId: "carepoint-b3a64",
  storageBucket: "carepoint-b3a64.firebasestorage.app",
  messagingSenderId: "52799264455",
  appId: "1:52799264455:web:39b72ae66b0ccd9e75d0e2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export { app };