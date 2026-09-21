# OminiCode

OminiCode is an AI-assisted code review and application-security platform designed to help developers analyze repositories, detect vulnerabilities, understand findings, generate fixes, and ship safer software.

## Overview

A React developer workspace and Express API provide the foundation for repository review, AI assistance, and security workflows. The current release is a local development prototype. The product direction is broader than what is implemented today.

## Current Status

**Under active development; not suitable for production or untrusted multi-user use.** Authentication and rate limiting are bypasses. Repository listings, scanning, fix validation, pipeline runs, and several collaboration interactions are demonstrations or incomplete. A successful simulated scan is not evidence that code is secure.

Phase 1 standardizes branding, repository organization, configuration, and documentation. See [the Phase 1 report](docs/PHASE1_REPORT.md) for acceptance results and a complete change inventory. Later phases are not implemented by this cleanup.

## Features

- Developer welcome workspace, editable local drafts, downloads, and assistant prompt shortcuts.
- AI chat and code review through a configured Groq API key. Results require developer review.
- Repository browser and prototype GitHub OAuth/API integration; token handling is not hardened.
- Code-review UI with example scan/finding/diff workflows.
- Security Center and DevOps views backed by optional Firestore subscriptions; provider actions are simulated.
- Team, issues, tasks, standups, snippets, utilities, and local documentation pages.
- Responsive landing page with reusable OminiCode branding. Full mobile editor work is a later phase.

## Architecture

The browser calls the same-origin Express API. Express runs Vite middleware in development and serves `dist/` for the production-build smoke check. Some APIs use a synchronous local JSON adapter (`data.json`); some views use Firebase directly. This is a transitional architecture, not a production persistence design.

See [ARCHITECTURE.md](docs/ARCHITECTURE.md), including current versus intended flows and the complete route inventory.

## Technology Stack

React 19, TypeScript 5, Vite 6, Tailwind CSS 4, Express 4, Firebase client/Admin SDKs, Groq SDK, Monaco, Lucide, Motion, and Recharts. Existing dependency ranges are retained. No new paid service or dependency is required to launch the local UI.

## Local Development

Use Node.js 22.12+ (validated with Node 24) and npm. Run commands from the repository root:

```sh
npm install
# Copy .env.example to .env using your shell or editor.
npm run dev
```

PowerShell copy command: `Copy-Item .env.example .env`. On macOS/Linux: `cp .env.example .env`. Preserve an existing `.env` rather than overwriting it.

Open [localhost:3000](http://localhost:3000). The app uses hash routes, for example `/#/review`. AI requests require `GROQ_API_KEY`; the UI starts without it. Firestore-backed views require a configured Firebase project and appropriate access; they may show empty states or permission errors in an unconfigured checkout. No seed or cloud write runs during installation/startup.

To check the production build locally:

```sh
npm run build
npm start
```

Stop the development server first, or set `PORT` to a different unused port. `npm start` sets `NODE_ENV=production` portably. This is a local smoke check, not a production deployment recipe.

## Environment Variables

[.env.example](.env.example) is the canonical list. Server settings include `PORT`, `APP_URL`, `NODE_ENV`, and `DISABLE_HMR`; AI uses `GROQ_API_KEY` and optional `GROQ_MODEL`; prototype GitHub OAuth uses `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`.

Optional Admin Firestore APIs use Application Default Credentials (`GOOGLE_APPLICATION_CREDENTIALS` or an existing ADC setup), `GCLOUD_PROJECT`, and `FIRESTORE_DATABASE_ID`. `FIRESTORE_EMULATOR_HOST` applies to the Admin SDK only. The default Admin database and checked-in client database may differ; explicitly align them when configuring your own project. The assistant UI label represents the default model; custom server model overrides are not discovered dynamically yet.

`firebase-applet-config.json` contains **public web identifiers**, not an Admin key. The client SDK imports this single configuration file. Project IDs/API keys identify the Firebase app; Firestore rules and authentication control access. Do not relax rules to make demonstration seeds work. `.env`, credentials, local data, and build output are ignored by Git.

## Project Structure

```text
src/
  components/brand/        Reusable vector mark and wordmark
  components/layout/       Dashboard shell and navigation
  components/pages/        Existing application pages
  config/                  Shared, non-secret product defaults
  context/                 Temporary auth and review providers
  services/                Browser API / Firestore adapters
  styles/                  Semantic design tokens
  types/                   Finding and scan contracts
server/
  config/                  Validated environment defaults
  services/                Lazy AI and optional Admin SDK clients
  engines/                 Future deterministic-engine interfaces
  models/                  Finding and job types
  orchestrator/            Demonstration scan lifecycle
  auth.ts                  Explicit development bypass
  database.ts              Local JSON adapter
  workspace.ts             Local file helpers
scripts/                   Opt-in seeds, diagnostics, maintenance
 tests/                    Existing path checks and sample fixture
 docs/                     Architecture, roadmap, audit, phase report
server.ts                  Express entry point; route extraction deferred
```

Future auth, middleware, route, and application-service directories should be introduced when those modules exist, rather than populated with empty scaffolding now.

## Development Commands

| Command | Purpose |
| --- | --- |
| `npm install` | Install the existing locked dependency graph |
| `npm run dev` | Express + Vite development server |
| `npm run typecheck` | TypeScript `tsc --noEmit` |
| `npm run build` | Vite frontend + bundled Express entry point |
| `npm start` | Serve the built app locally in production mode |
| `npm run test:workspace` | Existing lexical workspace-path regression checks |
| `npm run clean` | Remove only generated `dist/` and legacy `server.js` |

There is no ESLint setup yet; TypeScript checking is not called linting. Comprehensive testing and CI are later phases. npm is the verified package manager; the existing Bun lockfile is retained for provenance, with its root identity aligned. See [scripts/README.md](scripts/README.md) before running optional utilities.

## Security Notes

- Never deploy this development bypass to a public environment. The server currently listens on all interfaces; restrict access locally.
- `requireAuth` supplies one mock identity and rate limiters do nothing. No RBAC/session security is claimed.
- GitHub tokens currently pass through browser storage and prototype callbacks; OAuth state, origin checks, and secure token storage need Phase 4.
- JSON persistence is not transactional or safe for concurrent production writers. Existing Firebase rules do not enforce organization membership.
- Scan/test/pipeline states can be simulated. Deterministic engines and real validation are future work.
- AI submissions send code to the configured provider. Do not submit secrets or code you are not authorized to share.
- Workspace checks are lexical path checks, not OS sandboxing; symlink isolation and execution safety need hardening.
- Keep service-account files outside the repository. No passwords, private keys, or live tokens belong in source.

## Roadmap

See [ROADMAP.md](docs/ROADMAP.md) for the sixteen staged phases. Phase 2 is limited to authentication/session security and begins only after review.

## Contributing

Keep changes incremental, preserve existing routes, use shared brand components and `src/styles/tokens.css`, and clearly mark simulated behavior. Run typecheck, build, and relevant existing tests. Do not replay old generators or check in local credentials/data. Propose large migrations separately.

## License

Some inherited files carry Apache-2.0 SPDX headers. No repository-wide LICENSE file or explicit licensing decision is present. Preserve those notices; a maintainer must confirm and add the project's license before distribution. This cleanup does not assign a new license.
