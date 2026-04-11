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

// Validation: Check if keys are present and aren't default placeholders
const isConfigured = 
  !!firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== 'your_api_key' &&
  !firebaseConfig.apiKey.startsWith('your_');

// Only initialize if we have a valid configuration to avoid SDK-level crashes
let app = null;
let auth = null;
let db = null;

if (isConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error("[FIREBASE]: Initialization failed. Check your config object.", error);
  }
} else if (typeof window !== 'undefined') {
  console.warn("[AUTH]: Firebase is NOT configured. Cloud features (Auth/Firestore) will be disabled. Set your NEXT_PUBLIC_FIREBASE_* env vars.");
}

const githubProvider = new GithubAuthProvider();

export { auth, db, githubProvider, app, isConfigured };
