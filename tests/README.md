# Existing checks and fixtures

`npm run test:workspace` runs the migrated workspace path-boundary checks. It validates a relative path and rejects traversal/absolute paths. It creates an ignored demonstration workspace under `workspaces/user_9999`. It does not prove authentication, symlink isolation, filesystem sandboxing, or scanner accuracy. Comprehensive automated tests belong to Phase 14.

`fixtures/review-sample.py` preserves the standalone Python sample formerly at the repository root. It is input material for code review, not a dependency of the React/Express app and not a production auth implementation. Do not execute it as part of normal startup/testing. If deliberately run, it writes SQLite data and supports `DATABASE_PATH`, `BACKUP_PATH`, `ENV`, and `OMINICODE_SAMPLE_PASSWORD`; these fixture-only variables are not application settings. Set them to disposable local paths. No example password is embedded.

Root `test-admin*`, `test-db.js`, and duplicate model-list probes were temporary diagnostics, not an automated test suite. The useful read-only diagnostics were retained under scripts/development.
