const admin = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
admin.initializeApp();
const db = getFirestore();
db.collection('test').get().then(snap => {
  console.log("Success! size:", snap.size);
  process.exit(0);
}).catch(e => {
  console.error("Failed:", e);
  process.exit(1);
});
