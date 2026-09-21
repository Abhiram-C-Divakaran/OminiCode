# Architecture

## Current implementation

OminiCode is a local development prototype. `src/main.tsx` mounts React; `App.tsx` uses a HashRouter, AuthProvider, and ReviewProvider. The dashboard shell lives under `components/layout/`; page modules remain under `components/pages/`. Brand symbols are reusable SVG components and shared semantic colors live in `src/styles/tokens.css`. `src/config/product.ts` holds non-secret product defaults.

`server.ts` retains the existing Express route order and starts Vite middleware in development. JSON body parsing now precedes API registration, including the existing GitHub proxy. A production build emits `dist/server.cjs` and frontend assets; the start wrapper selects production mode cross-platform. `server/config` loads environment settings and validates the port. AI and Admin SDK construction are small, separate services. Route extraction is intentionally deferred.

```text
React browser
  ├─ same-origin Express API
  │    ├─ Firebase ID-token verification / per-user rate limiters
  │    ├─ local workspace helpers → workspaces/user_<id>/
  │    ├─ Firestore-shaped JSON adapter → data.json
  │    ├─ Groq chat/review (optional real external requests)
  │    ├─ prototype GitHub callback/proxy (optional real external requests)
  │    ├─ demonstration in-memory scan orchestrator
  │    └─ demonstration scan/fix/pipeline writes → optional Admin Firestore
  └─ Firebase client subscriptions → configured Firestore database
```

The JSON adapter and Firebase are **not** a unified persistence layer. Sorting, limits, transactions, and batch semantics in the JSON adapter are incomplete. Browser and Admin SDK database IDs can differ. Current Firestore rules require sign-in for organization collections but do not check organization membership. The real Firebase session supplies identity; organization membership rules still require Phase 3. Cloud views can return permission errors when project configuration is incomplete. Do not weaken the rules as a workaround.

## Existing route inventory

All routes below are retained. None was removed by Phase 1.

| Hash route | Page / behavior |
| --- | --- |
| `/` | Landing page |
| `/review` | Welcome workspace and AI assistant |
| `/review/scan` | Existing repository/scanner/diff UI |
| `/repo` | Prototype GitHub repository integration |
| `/team` | Team collaboration |
| `/security` | Security Center |
| `/standup` | Standup helper |
| `/tasks` | Tasks |
| `/issues` | Issues |
| `/devops` | DevOps Monitor |
| `/docs` | In-app documentation and simulated playground |
| `/utilities` | Developer utilities |
| `/snippets` | Snippets |
| `/dashboard` | Redirects to `/review` |
| unmatched route | Redirects to `/` |

`MeetingNotesPage`, `DemoVideo`, and the physics helpers are currently unmounted modules. They are preserved rather than interpreting absence from the route graph as permission to delete product work. Task, standup, utility, and snippet routes remain reachable through the command palette or direct URL where applicable.

## Existing API boundaries

| Group | Implementation status |
| --- | --- |
| `/api/auth/github/*`, `/api/github/*` | Prototype OAuth and GitHub proxies; state validation, callback origin, token storage and authorization need hardening |
| `/api/files*` | Local workspace read/write/create/rename/delete under UID-derived isolated directories |
| `/api/run` | Execution disabled; response only |
| `/api/sync/*`, `/api/analytics*`, `/api/users/me*` | Local JSON adapter, verified Firebase identity, prototype preferences/activity |
| `/api/ai/chat`, `/api/ai/review` | Real Groq calls when a key is configured; 20/minute/user limiter; returned content requires review |
| `/api/repositories*` | Fixed demo repositories, branches, tree and file contents |
| `/api/scans`, `/api/findings/:id/generate-fix`, `/api/fixes/:fixId/tests` | Timed simulations persisted through Admin Firestore |
| `/api/legacy_scans/start`, `/api/scans/:jobId/status`, `/api/scans/:jobId/findings` | In-memory demonstration queue and example findings |
| `/api/devops/pipelines/trigger` | Writes simulated pipeline state, not a real CI provider run |

Some legacy browser adapters request `/api/scans/start`, while the retained server route is `/api/legacy_scans/start`. Other adapters contain fabricated fallback findings. These pre-existing contract inconsistencies are documented, not disguised as completed scanner functionality. Persistence and scanning phases must reconcile them before security use. Async Firestore callbacks also need error handling/cancellation and robust job ownership.

## Intended system (future phases)

```text
Browser / React
       │
       ▼
Express API
       │
       ├── Authentication
       ├── Repository integrations
       ├── Scanner orchestration
       ├── AI services
       └── Application services
       │
       ▼
Firestore / persistence
```

Firebase identities and token verification are implemented. Organization authorization and hardened repository credentials must still come before public exposure. Authentication lives in AuthContext, server/auth.ts and server/security.ts. Other boundaries should become explicit modules incrementally. This diagram describes the destination, not implemented assurances.

## Intended scanner pipeline

```text
Repository
    ↓
Language detection
    ↓
Static analysis
    ↓
Dependency scanning
    ↓
Secret detection
    ↓
Normalize findings
    ↓
Optional AI explanation/fix
```

Deterministic tools should identify vulnerabilities. AI should augment—not replace—the security engines. Findings should preserve engine provenance, rule identifiers, source locations, severity, confidence, and validation evidence. A model-generated explanation or patch is not proof of a vulnerability or successful remediation. Concrete engines, sandboxed jobs, dependency databases, normalized contracts and fix validation are future phases.

## Configuration and design boundaries

- `server/config/index.ts`: private runtime settings; never import these into browser code.
- `src/config/product.ts`: non-secret product identity and default model metadata shared with the server.
- `firebase-applet-config.json`: public web identifiers consumed by browser/optional seed diagnostics. Do not put private Admin keys here.
- `server/services/firebaseAdmin.ts`: optional modular Admin SDK using ADC/emulator environment.
- `server/services/ai.ts`: lazy Groq client so an unset key does not break local UI startup.
- `src/components/brand/`: independent circular mark and wordmark; favicon uses the same geometry.
- `src/styles/tokens.css`: semantic colors. Existing decorative one-off gradients are retained where replacing them would redesign the page; new work must use tokens.

Existing responsive breakpoints remain. No new fixed-width page or desktop-only container is introduced. Full tablet/mobile editor and navigation work belongs to Phase 13.

## Local verification limitations

A passing typecheck/build and rendering route are foundation checks, not integration/security certification. No cloud seed, OAuth exchange, real scan, repository write, payment, or production deployment is required for Phase 1 verification. Firestore permission failures without real auth are expected technical debt, not successful integrations.

## Phase 2 identity layer

See [AUTHENTICATION.md](AUTHENTICATION.md) for the implemented Firebase flow, all protected API families, public callback exception, persistence, revocation, hashed UID workspaces, emulator setup and validation limitations. All application routes are guarded; landing and auth pages remain public.
