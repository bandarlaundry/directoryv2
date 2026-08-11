import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAY2JOM_GK_c8MIKOOROjG61XtC-VxF3Gc",
  authDomain: "laundry-directory-1915d.firebaseapp.com",
  projectId: "laundry-directory-1915d",
  storageBucket: "laundry-directory-1915d.appspot.com",
  messagingSenderId: "336437234560",
  appId: "1:336437234560:web:69dc7cbb36704c9f614f65"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
