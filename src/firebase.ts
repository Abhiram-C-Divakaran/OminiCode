import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import publicConfig from '../firebase-applet-config.json';

// Public web identifiers only. Access is controlled by Firebase rules, not this config.
// AuthContext is still a mock; importing Firebase Auth does not enable authentication.
const app = initializeApp(publicConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, publicConfig.firestoreDatabaseId);
