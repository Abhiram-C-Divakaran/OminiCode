import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
initializeApp({ projectId: "psyched-dreamer-9dzmz" });
const auth = getAuth();
async function test() {
  try {
    const user = await auth.createUser({
      email: "test_admin@example.com",
      password: "testpassword123"
    });
    console.log("User created:", user.uid);
    const token = await auth.createCustomToken(user.uid);
    console.log("Custom token:", token);
  } catch(e) {
    console.error(e);
  }
}
test();
