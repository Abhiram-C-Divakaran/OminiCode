const path = require('node:path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env'), quiet: true });
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Read-only optional ADC diagnostic. No user creation or token logging.
const app = initializeApp();
const db = getFirestore(app, process.env.FIRESTORE_DATABASE_ID || '(default)');
db.collection('test').doc('test').get()
  .then(() => console.log('Admin connection succeeded.'))
  .catch(error => { console.error('Admin connection failed:', error.message); process.exitCode = 1; });
