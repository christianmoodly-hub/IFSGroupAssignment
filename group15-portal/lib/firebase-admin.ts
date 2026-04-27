import {
  cert,
  getApps,
  initializeApp,
  type App,
  type ServiceAccount,
} from "firebase-admin/app";

/**
 * Optional server-side Admin SDK. Set FIREBASE_SERVICE_ACCOUNT to the full JSON
 * of a Firebase service account key (single line or escaped in .env.local).
 */
export function getFirebaseAdminApp(): App | null {
  if (getApps().length > 0) {
    return getApps()[0]!;
  }

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw?.trim()) {
    return null;
  }

  try {
    const serviceAccount = JSON.parse(raw) as ServiceAccount;
    return initializeApp({
      credential: cert(serviceAccount),
    });
  } catch {
    return null;
  }
}
