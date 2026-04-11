import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Comprehensive validation for Firebase initialization
// Requires both API Key and Auth Domain to be properly set
const isConfigured = 
  !!firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== 'undefined' &&
  firebaseConfig.apiKey !== 'your_api_key' &&
  !firebaseConfig.apiKey.startsWith('your_') &&
  !!firebaseConfig.authDomain &&
  firebaseConfig.authDomain !== 'undefined' &&
  !firebaseConfig.authDomain.startsWith('your_');

let app = null;
let auth = null;
let db = null;

if (isConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error("[FIREBASE]: Initialization failed. Check your environment variables.", error);
  }
} else {
  if (typeof window !== 'undefined') {
    console.warn("[AUTH]: Firebase is partially or incorrectly configured. Cloud features are disabled. Ensure NEXT_PUBLIC_FIREBASE_API_KEY and NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN are set in .env.");
  }
}

const githubProvider = new GithubAuthProvider();

export { auth, db, githubProvider, app, isConfigured };
