// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDnrav-yAUm7pLtBQWERawuvdG6w0mz7cE",
  authDomain: "chat-app-17fae.firebaseapp.com",
  projectId: "chat-app-17fae",
  storageBucket: "chat-app-17fae.appspot.com",
  messagingSenderId: "812751265711",
  appId: "1:812751265711:web:f99ef22181894c97f5d95a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app);
//IOS BUNDLE ID: 300465958210-8tuioghc0ojvsannd1hot9q3qhivqqde.apps.googleusercontent.com

//Android:  300465958210-g8878nn7586gvt0vf7g3npdcg2k4ev03.apps.googleusercontent.com
