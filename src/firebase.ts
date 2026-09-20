import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "psyched-dreamer-9dzmz",
  appId: "1:9672972451:web:07f30ee7ca78bd7aff8716",
  apiKey: "AIzaSyCv4uUbc2ZtzEDtOXdeOtDeDkksBAc0PJQ",
  authDomain: "psyched-dreamer-9dzmz.firebaseapp.com",
  storageBucket: "psyched-dreamer-9dzmz.firebasestorage.app",
  messagingSenderId: "9672972451",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-codesightai-34166c2c-a900-4af3-ba13-48be3de1bbb6");
