const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
// Explicitly invoked demonstration fixtures; never run on application startup.

const config = require('./config.cjs');
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
