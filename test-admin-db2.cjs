const admin = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
admin.initializeApp({ projectId: "ai-studio-codesightai-34166c2c-a900-4af3-ba13-48be3de1bbb6" });
const db = getFirestore();
db.collection('test').get().then(snap => {
  console.log("Success! size:", snap.size);
  process.exit(0);
}).catch(e => {
  console.error("Failed:", e);
  process.exit(1);
});
