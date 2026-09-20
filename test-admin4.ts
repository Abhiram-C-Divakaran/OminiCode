import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
initializeApp({ projectId: "psyched-dreamer-9dzmz" });
const db = getFirestore("ai-studio-codesightai-34166c2c-a900-4af3-ba13-48be3de1bbb6");
console.log(db.collection('test').id);
