import { getApps,initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { serverConfig } from '../config';

/** Optional Admin connection. Uses ADC or emulator configuration; never embeds credentials. */
export function getAdminDatabase() {
  const app = getApps()[0] ?? initializeApp();
  return getFirestore(app, serverConfig.firestoreDatabaseId);
}
