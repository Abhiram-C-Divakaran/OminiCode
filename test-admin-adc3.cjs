const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const app = initializeApp({ projectId: "psyched-dreamer-9dzmz" });
const db = getFirestore(app, "ai-studio-codesightai-34166c2c-a900-4af3-ba13-48be3de1bbb6");
db.collection('test').doc('test').get()
  .then(() => console.log('success'))
  .catch(e => console.error('Error:', e.message));
