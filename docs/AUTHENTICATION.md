# Authentication

## Flow

Browser → Firebase Authentication → Firebase ID token → same-origin Express API → Firebase Admin verifyIdToken(token, true) → req.user.

Firebase issues and refreshes tokens. There is no custom JWT or session-signing system. Email/password registration and login, Google popup login, sign-out, and password reset use the Firebase client SDK. The account profile contains only uid, email, displayName and photoURL; it is not an organization profile.

## Frontend responsibilities

- src/firebase.ts initializes the browser app once. Public web configuration stays in firebase-applet-config.json. No Admin key is bundled.
- AuthContext observes onIdTokenChanged, keeps an initialization loading state, and uses Firebase-managed local persistence. Token refresh does not reset the workspace.
- ProtectedRoute guards all application pages. Only /, /login, /register and /forgot-password are public. It preserves a validated local destination through login/registration; no external return URL is accepted.
- src/services/api.ts is the authenticated API boundary; authenticatedFetch.ts contains its testable transport. It waits for initialization, obtains the current token per request, overrides caller Authorization, and restricts destinations to same-origin /api/ paths. It never stores ID tokens manually.
- A 401 invalidates the Firebase client session and displays a sign-in message. There is no automatic replay of writes or infinite refresh loop. Logout/account switches abort pending requests and discard stale responses. The dashboard/review subtree remounts when the UID changes.
- Local sign-out removes the Firebase session and clears prototype GitHub browser credentials. Account UI displays the actual name/email and makes no role claim.

## Backend responsibilities

Every /api request is authenticated at one boundary before body parsing or handlers, except GET /api/auth/github/callback. Missing, malformed, expired, invalid, disabled-user and revoked credentials return 401 with a generic message. No fallback identity exists. Admin checks revocation with verifyIdToken(token, true); that requires working Admin credentials/permissions in live mode. Provider outages fail closed.

req.user contains only verified uid (as id) and optional email. /api/users/me returns this identity when no legacy profile record exists. Client-supplied UID, email or permissions never authenticate a request. Legacy stored permissions are inert prototype metadata, not RBAC.

Protected families include /api/files*, /api/run, /api/sync/*, /api/analytics*, /api/users/me*, /api/ai/*, /api/repositories*, /api/scans*, /api/legacy_scans/*, /api/findings/*, /api/fixes/*, /api/devops/*, /api/github/* and /api/auth/github/url. Future /api routes inherit the guard. Public static assets and the landing page remain accessible.

Workspace directories use user_ plus the SHA-256 of the exact Firebase UID. Hashing prevents path characters and Windows case-insensitivity from colliding or escaping the root. This changes the previous demo directory naming; old demo files are not automatically migrated into real accounts. Lexical file traversal checks remain. Symlink/OS execution isolation is not supplied by this layer.

## Token lifecycle and logout

Firebase maintains refresh credentials in its own persistence. Application code requests ID tokens on demand. A standard Firebase client signOut does not revoke all previously issued tokens on every device: an independently copied ID token can remain valid until expiration unless an administrator revokes it. This implementation stops this browser's protected requests and checks revocation server-side; it does not claim global logout or instantaneous cancellation of an already executing server operation.

## Provider setup

In the intended Firebase project, enable Authentication → Email/Password and Google. Configure the Google support email and authorized domains (including localhost for local testing). Keep the public client project, server GCLOUD_PROJECT and Admin credential project aligned. Use Application Default Credentials or a service-account file outside the repository. Never commit keys or expose them through VITE_ variables.

Provider enablement is console configuration, not performed by installing this repository. Live provider status and a real Google popup sign-in must be verified by the maintainer before Phase 2 acceptance. The in-app browser used for local checks did not expose/complete the Google popup; normal desktop browsers must be checked. Mobile redirect fallback, MFA and enterprise identity features are not implemented.

## Password reset

The form calls sendPasswordResetEmail and shows the same confirmation for existing and unknown accounts. Firebase's hosted action handler performs the password change. Enable Firebase email enumeration protection in the live project and configure its email templates/action domains; application messages alone cannot hide all provider-side signals. Emulator mail links are local test artifacts, not email delivery proof.

## Local emulator development

Install dependencies normally. No paid infrastructure or Admin key is needed for the demo Auth emulator. The optional official CLI is downloaded on demand, not added as a production dependency:

~~~sh
npx --yes firebase-tools@15.30.2 emulators:start --only auth --project demo-ominicode --config firebase.auth-emulator.json
~~~

In a separate terminal set these values (or use a local ignored .env):

~~~dotenv
FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099
GCLOUD_PROJECT=demo-ominicode
VITE_FIREBASE_AUTH_EMULATOR_URL=http://127.0.0.1:9099
VITE_FIREBASE_PROJECT_ID=demo-ominicode
~~~

Then run npm run dev. VITE_ settings are build-time inputs: for npm start, first rebuild with those inputs. The client displays Firebase's emulator warning. Never use real credentials with the emulator and never deploy an emulator-configured bundle/server. Leave these optional emulator values unset in live mode. Other demo cloud services are not emulated and can report unavailable/permission states under the demo project.

## Rate limits and headers

AI chat/review share 20 requests per minute per verified UID; GitHub OAuth initiation allows 10 per minute per UID. Fixed-window configuration lives in server/auth.ts. Storage is bounded and process-local, resets on restart, and is not horizontally scalable. Firebase controls its own sign-in/password-reset abuse protection. No proxy IP header is trusted automatically.

Responses set nosniff, strict-origin-when-cross-origin referrer policy and DENY frame protection. Private API responses are no-store. No wildcard CORS is introduced; browser and Express stay same-origin. Production CSP/HSTS, shared rate limiting and deployment/proxy policy remain hardening work.

## Tests

~~~sh
npm run typecheck
npm test
npm run build
npm start
~~~

npm test runs Node's test runner through the existing tsx dependency, mocking only the Admin verifier boundary, plus existing workspace checks. The optional npm run test:auth:emulator needs the running demo emulator, the two server environment values above, and an emulator-configured server at localhost:3001 (or AUTH_TEST_API_URL). It refuses non-demo/non-loopback targets, creates disposable accounts and test workspaces, and checks the real SDK, password-reset actions, Admin verification and disabled-token rejection. It does not print tokens or passwords. Emulator state is transient; generated local workspaces are ignored.

## Authorization boundary and limitations

**Authentication proves identity. Organization/resource authorization is implemented in Phase 3.** Existing organization Firestore rules, scan IDs and global demo fixtures are not a production authorization model. Do not expose this prototype to untrusted users yet. GitHub repository OAuth remains distinct and its state/origin/token-storage design still requires Phase 4. Scanner workers, billing, CI/CD, production deployment and full mobile editor design remain out of scope.

Reference: [Firebase sessions and revocation](https://firebase.google.com/docs/auth/admin/manage-sessions), [Auth emulator](https://firebase.google.com/docs/emulator-suite/connect_auth), [client Auth API](https://firebase.google.com/docs/reference/js/auth).
