const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function seed() {
  const orgId = "default";
  
  // Trends
  await setDoc(doc(db, 'organizations', orgId, 'metrics', 'trends'), {
    data: [
      { name: 'Mon', critical: 1, high: 4 },
      { name: 'Tue', critical: 2, high: 3 },
      { name: 'Wed', critical: 0, high: 5 },
      { name: 'Thu', critical: 3, high: 12 },
      { name: 'Fri', critical: 3, high: 12 },
    ]
  });

  console.log("Trends seeded!");
  process.exit(0);
}

seed().catch(e => {
  console.error("Seeding failed", e);
  process.exit(1);
});
