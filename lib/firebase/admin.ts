import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';

if (!getApps().length) {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    
    // Only initialize if we have credentials (prevents build errors in Vercel before env vars are set)
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && privateKey) {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey,
        }),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
    }
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

// We wrap these in try-catch or getters to avoid errors if initializeApp was skipped
const getAdminDb = () => {
  try { return getFirestore(); } catch { return null; }
};
const getAdminAuth = () => {
  try { return getAuth(); } catch { return null; }
};
const getAdminStorage = () => {
  try { return getStorage(); } catch { return null; }
};

export const adminDb = getAdminDb();
export const adminAuth = getAdminAuth();
export const adminStorage = getAdminStorage();
