# Optional development scripts

Run from the repository root. These utilities are not application startup hooks and are not comprehensive tests. Obsolete one-off patches were audited in [SCRIPT_AUDIT.md](../docs/SCRIPT_AUDIT.md), then removed; do not replay older generators from Git history.

## Maintenance

- `npm run clean`: removes only generated `dist/` and legacy `server.js`, resolving paths against the project root. It never accepts a user-supplied deletion target.

## Development diagnostics

- `node scripts/development/list-groq-models.mjs`: reads model metadata using server-side `GROQ_API_KEY`; sends a provider request, does not log the key.
- `node scripts/development/check-ai-review.cjs`: submits a hardcoded sample snippet to the local `/api/ai/review` endpoint. This can invoke Groq and use provider quota; opt in manually.
- `node scripts/development/check-firestore-client.cjs`: read-only client SDK access check using public project identifiers and existing rules.
- `node scripts/development/check-firestore-admin.cjs`: read-only Admin ADC/emulator check using `FIRESTORE_DATABASE_ID`. No user creation or token printing.
- `start-production.mjs`: implementation behind `npm start`; sets production mode portably.

No Firebase credential/login/seed operation was executed during Phase 1.

## Demonstration seeds

`seeds/security.cjs`, `seeds/devops.cjs`, and `seeds/trends.cjs` write fixed example documents under organization `default`. They overwrite fixture IDs and contain illustrative metrics, not real scanner or provider results. Existing client-SDK access rules still apply; they may fail without a valid Firebase context. Do not relax rules or use production data to make them run.

Review `firebase-applet-config.json`, select a disposable project, and explicitly set `OMINICODE_SEED_PROJECT` to that file's `projectId` before running, for example `node scripts/seeds/trends.cjs`. Leave the variable unset for normal development. The helper loads `.env` relative to the project and requires the opt-in to match. Admin `FIRESTORE_EMULATOR_HOST` does not automatically redirect these client-SDK scripts.

No migrations are required by Phase 1. Add a migrations directory only when a real, versioned data migration exists.
