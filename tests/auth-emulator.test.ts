/** Optional integration suite: only a loopback Auth emulator and demo project are permitted. */
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { initializeApp, deleteApp } from "firebase/app";
import {
  connectAuthEmulator,
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  confirmPasswordReset,
} from "firebase/auth";
import { getAdminAuth } from "../server/services/firebaseAdmin";
const host = process.env.FIREBASE_AUTH_EMULATOR_HOST;
const project = process.env.GCLOUD_PROJECT;
assert.equal(host, "127.0.0.1:9099");
assert.equal(project, "demo-ominicode");
const base = process.env.AUTH_TEST_API_URL || "http://127.0.0.1:3001";
assert.match(base, /^http:\/\/(127\.0\.0\.1|localhost):\d+$/);
const app = initializeApp(
  { projectId: project, apiKey: "emulator-only" },
  "auth-integration",
);
const auth = getAuth(app);
connectAuthEmulator(auth, "http://" + host, { disableWarnings: true });
const email = "sdk-" + randomUUID() + "@example.test",
  password = randomUUID() + "aA1!";
try {
  const a = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(a.user, { displayName: "Emulator Test" });
  const uid = a.user.uid;
  assert.equal(a.user.displayName, "Emulator Test");
  const tokenA = await a.user.getIdToken();
  const api = (path: string, token?: string, init: RequestInit = {}) =>
    fetch(base + path, {
      ...init,
      headers: {
        ...init.headers,
        ...(token ? { Authorization: "Bearer " + token } : {}),
      },
    });
  assert.equal((await api("/api/files")).status, 401);
  assert.equal((await api("/api/files", "invalid")).status, 401);
  const identity = await api("/api/users/me", tokenA);
  assert.equal(identity.status, 200);
  assert.equal((await identity.json()).uid, uid);
  assert.equal(
    (
      await api("/api/files/write", tokenA, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: "private-check.txt",
          content: "isolated account A",
        }),
      })
    ).status,
    200,
  );
  await signOut(auth);
  assert.equal(auth.currentUser, null);
  await signInWithEmailAndPassword(auth, email, password);
  assert.equal(auth.currentUser!.uid, uid);
  await assert.rejects(
    signInWithEmailAndPassword(auth, email, "wrong-test-password"),
  );
  await signOut(auth);
  const b = await createUserWithEmailAndPassword(
    auth,
    "sdk-" + randomUUID() + "@example.test",
    password,
  );
  const tokenB = await b.user.getIdToken();
  assert.notEqual(uid, b.user.uid);
  assert.equal(
    (await api("/api/files/content?path=private-check.txt", tokenB)).status,
    404,
  );
  assert.equal(
    (await api("/api/files/content?path=../../server.ts", tokenA)).status,
    403,
  );
  await sendPasswordResetEmail(auth, email);
  const codes = await (
    await fetch(
      "http://" + host + "/emulator/v1/projects/" + project + "/oobCodes",
    )
  ).json();
  const reset = codes.oobCodes.find(
    (x: { email: string; requestType: string }) =>
      x.email === email && x.requestType === "PASSWORD_RESET",
  );
  assert.ok(reset);
  const newPassword = randomUUID() + "aA1!";
  await confirmPasswordReset(auth, reset.oobCode, newPassword);
  await signInWithEmailAndPassword(auth, email, newPassword);
  assert.equal(auth.currentUser!.uid, uid);
  // Disable via Admin to verify the real SDK's checkRevoked=true path rejects the existing token.
  await getAdminAuth().updateUser(uid, { disabled: true });
  assert.equal((await api("/api/files", tokenA)).status, 401);
  console.log(
    "PASS: emulator registration, profile, login, logout, reset, Admin verification, invalid/disabled tokens, and two-user API workspace isolation.",
  );
} finally {
  await signOut(auth);
  await deleteApp(app);
}
