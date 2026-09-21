const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');


const config = require('../../firebase-applet-config.json');
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

getDocs(collection(db, 'test')).then(snap => {
  console.log("Success client SDK! size:", snap.size);
  process.exit(0);
}).catch(e => {
  console.error("Failed:", e);
  process.exit(1);
});
