import { getApps,initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { serverConfig } from '../config';

/** Optional Admin connection. Uses ADC or emulator configuration; never embeds credentials. */
function getAdminApp() { return getApps()[0] ?? initializeApp(); }
export function getAdminAuth() { return getAuth(getAdminApp()); }
export function getAdminDatabase() {
  const app = getAdminApp();
  return getFirestore(app, serverConfig.firestoreDatabaseId);
}
