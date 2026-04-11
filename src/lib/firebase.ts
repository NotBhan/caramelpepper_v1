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

/**
 * Validates if the Firebase configuration is present and structurally valid.
 * Ensures that we don't attempt to initialize with "undefined" strings or placeholders.
 */
const isConfigured = 
  !!firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== 'undefined' &&
  firebaseConfig.apiKey.length > 10 &&
  !firebaseConfig.apiKey.includes('your_') &&
  !!firebaseConfig.authDomain &&
  firebaseConfig.authDomain !== 'undefined' &&
  !firebaseConfig.authDomain.includes('your_') &&
  firebaseConfig.authDomain.includes('.'); // Ensure it's a valid domain format

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
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.info("[OCTAMIND]: Firebase Cloud features are disabled. Running in Local-Only mode.");
  }
}

const githubProvider = new GithubAuthProvider();

export { auth, db, githubProvider, app, isConfigured };
