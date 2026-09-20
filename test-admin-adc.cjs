const admin = require('firebase-admin');
admin.initializeApp({ projectId: "psyched-dreamer-9dzmz" });
const db = admin.firestore();
db.settings({ databaseId: "ai-studio-codesightai-34166c2c-a900-4af3-ba13-48be3de1bbb6" });
db.collection('test').doc('test').get()
  .then(() => console.log('success'))
  .catch(e => console.error(e));
