import { FirebaseError } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type Auth,
  type User,
} from "firebase/auth";
import { getFirebaseApp } from "./firebase";

export function getFirebaseAuth(): Auth | null {
  const app = getFirebaseApp();
  if (!app) return null;
  return getAuth(app);
}

export function subscribeAuth(
  callback: (user: User | null) => void,
): () => void {
  const auth = getFirebaseAuth();
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export async function signInWithEmailPassword(
  email: string,
  password: string,
): Promise<void> {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error("Firebase Auth is not configured.");
  }
  await signInWithEmailAndPassword(auth, email, password);
}

export async function signOutUser(): Promise<void> {
  const auth = getFirebaseAuth();
  if (!auth) return;
  await signOut(auth);
}

export function getAuthErrorMessage(code: string): string {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
    case "auth/invalid-email":
    case "auth/missing-password":
      return "Email or password is incorrect. Please try again.";
    case "auth/user-disabled":
      return "This account has been disabled. Contact your group leader.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    case "auth/unauthorized-domain":
      return "This site’s domain is not allowed to sign in. In Firebase Console → Authentication → Settings → Authorized domains, add your domain (e.g. localhost, your Vercel URL like project.vercel.app).";
    case "auth/operation-not-allowed":
      return "Email/password sign-in is turned off. In Firebase Console → Authentication → Sign-in method, enable Email/Password.";
    case "auth/invalid-api-key":
      return "Invalid Firebase API key. Check NEXT_PUBLIC_FIREBASE_API_KEY matches your Firebase project.";
    default:
      return `Something went wrong (${code}). Please try again.`;
  }
}

/** Maps any thrown value from sign-in to a user-visible message. */
export function resolveSignInError(err: unknown): string {
  if (err instanceof FirebaseError) {
    return getAuthErrorMessage(err.code);
  }
  if (err instanceof Error) {
    if (err.message === "Firebase Auth is not configured.") {
      return "Firebase is not configured: add all NEXT_PUBLIC_FIREBASE_* variables to .env.local (local) or Vercel → Project → Settings → Environment Variables (production).";
    }
    return err.message;
  }
  return getAuthErrorMessage("unknown");
}
