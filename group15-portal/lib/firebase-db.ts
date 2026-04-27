/**
 * Firebase Console checklist (one-time):
 * 1. Enable Email/Password Auth in Firebase Console → Authentication → Sign-in method.
 * 2. Create a Firestore database in production mode, then deploy firestore.rules from this repo.
 * 3. Enable Firebase Storage and deploy storage.rules from this repo.
 * 4. Manually create user accounts for all 7 team members in Authentication → Users
 *    (display names should match the names in lib/team.ts).
 */

import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getFirebaseApp } from "./firebase";

export function getFirebaseFirestore(): Firestore | null {
  const app = getFirebaseApp();
  if (!app) return null;
  return getFirestore(app);
}

export function getFirebaseStorage(): FirebaseStorage | null {
  const app = getFirebaseApp();
  if (!app) return null;
  return getStorage(app);
}
