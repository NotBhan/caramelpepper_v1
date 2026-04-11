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

// Robust validation to ensure Firebase only initializes with real credentials
const isConfigured = 
  !!firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== 'undefined' &&
  firebaseConfig.apiKey !== 'your_api_key' &&
  !firebaseConfig.apiKey.startsWith('your_');

let app = null;
let auth = null;
let db = null;

if (isConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error("[FIREBASE]: Initialization failed. This usually means your configuration is incorrect.", error);
  }
} else {
  if (typeof window !== 'undefined') {
    console.warn("[AUTH]: Firebase is NOT configured. Cloud features (GitHub Auth, Remote Vault) are disabled. To enable, update your .env file with valid Firebase credentials.");
  }
}

const githubProvider = new GithubAuthProvider();

export { auth, db, githubProvider, app, isConfigured };
