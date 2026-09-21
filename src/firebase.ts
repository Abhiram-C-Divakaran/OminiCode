import { getApps, initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import publicConfig from '../firebase-applet-config.json';

// Public web identifiers only. Access is controlled by Firebase rules, not this config.
// Firebase owns auth persistence and token refresh; Admin credentials never enter this module.
const app = getApps()[0] ?? initializeApp({ ...publicConfig, ...(import.meta.env.VITE_FIREBASE_PROJECT_ID ? { projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID } : {}) });
export const auth = getAuth(app);
export const db = getFirestore(app, publicConfig.firestoreDatabaseId);

if (import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_URL) {
  connectAuthEmulator(auth, import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_URL);
}
