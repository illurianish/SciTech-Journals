import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfDLzUng76MSaTBENSqVfzUgFb1z1ihPw",
  authDomain: "ariesview-35b1c.firebaseapp.com",
  projectId: "ariesview-35b1c",
  storageBucket: "ariesview-35b1c.firebasestorage.app",
  messagingSenderId: "1029371399695",
  appId: "1:1029371399695:web:de01b7f0d3f4c05fbf9d7a",
  measurementId: "G-PPDL19MB6Z",
};

// Initialize Firebase only if it hasn't been initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db }; 