import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCQzCpBI5juZ3xe1dwGZ1rOeojjmwwROW8",
  authDomain: "agencia-de-viagens-74854.firebaseapp.com",
  projectId: "agencia-de-viagens-74854",
  storageBucket: "agencia-de-viagens-74854.firebasestorage.app",
  messagingSenderId: "456193613603",
  appId: "1:456193613603:web:3f3658dad0edaff3807696",
  measurementId: "G-D9PHW2E0BB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);