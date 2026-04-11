
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

// Check if keys are valid and not placeholders
const isConfigured = 
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== 'your_api_key' &&
  !firebaseConfig.apiKey.startsWith('your_');

// Only initialize if we have a valid API Key
const app = (getApps().length > 0) 
  ? getApp() 
  : (isConfigured ? initializeApp(firebaseConfig) : null);

const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;
const githubProvider = new GithubAuthProvider();

if (!isConfigured && typeof window !== 'undefined') {
  console.warn("[AUTH]: Firebase is not configured. Please add valid NEXT_PUBLIC_FIREBASE_* keys to your .env file to enable Cloud features.");
}

export { auth, db, githubProvider, app, isConfigured };
