import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (getApps().length === 0) {
  initializeApp({
    projectId: "psyched-dreamer-9dzmz",
  });
}
const db = getFirestore("ai-studio-codesightai-34166c2c-a900-4af3-ba13-48be3de1bbb6");

db.collection('users').limit(1).get()
  .then(snap => {
    console.log("Success:", snap.docs.length);
  })
  .catch(err => {
    console.error("Error:", err);
  });
