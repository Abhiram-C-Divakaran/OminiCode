# Development-script audit

Every root-level script was inspected for reads, writes, imports and side effects. No seed, credential probe, patch generator or cloud write was executed. Applied or superseded generators are not runtime dependencies; their current target implementations and route graph are retained. Superseded patches describe earlier UIs, not missing features to reintroduce in Phase 1. Git history retains deleted source.

| Original file | Classification | Disposition | Evidence / reason |
| --- | --- | --- | --- |
| `add_endpoints.cjs` | Obsolete one-off generator/patch | Deleted | Applied: server.ts contains /api/users/me and preferences, permissions, activity-log routes. |
| `fix_account.cjs` | Obsolete one-off generator/patch | Deleted | Obsolete: AccountPage.tsx no longer exists; current account dialog lives in dashboard layout. |
| `fix_account2.cjs` | Obsolete one-off generator/patch | Deleted | Obsolete: removed AccountPage target; would not run in this checkout. |
| `fix_ai_prompt.cjs` | Obsolete one-off generator/patch | Deleted | Applied: strict auditor system prompt exists in /api/ai/review. |
| `fix_app_logout.cjs` | Obsolete one-off generator/patch | Deleted | Applied/superseded: App route graph contains no legacy logout control. |
| `fix_auth.cjs` | Obsolete one-off generator/patch | Deleted | Applied: AuthContext provides the mock profile and no-op auth actions. |
| `fix_bugchecker.cjs` | Obsolete one-off generator/patch | Deleted | Applied: scanner uses h-full and w-full rather than h-screen w-screen. |
| `fix_bugchecker_name.cjs` | Obsolete one-off generator/patch | Deleted | Superseded: current scanner has no BugFinder header; code review lives under /review/scan. |
| `fix_index_css.cjs` | Obsolete one-off generator/patch | Deleted | Applied: base overflow rules already use separate x/y overflow. |
| `fix_landing.cjs` | Obsolete one-off generator/patch | Deleted | Superseded: current OminiCode landing page replaces generated navigation and hero. |
| `fix_landing_buttons.cjs` | Obsolete one-off generator/patch | Deleted | Applied/superseded: landing actions navigate to existing workspace routes, not /register. |
| `fix_lint.cjs` | Obsolete one-off generator/patch | Deleted | Applied: redirect helper and required onNavigate props exist; remaining type errors fixed separately. |
| `fix_server.cjs` | Obsolete one-off generator/patch | Deleted | Applied: sample code and diff strings are valid escaped literals; baseline build passes. |
| `fix_syntax.cjs` | Obsolete one-off generator/patch | Deleted | Applied: apostrophe in finding text is escaped; baseline parser/build succeeds. |
| `fix_workspace_tabs.cjs` | Obsolete one-off generator/patch | Deleted | Obsolete: WorkspacePage.tsx target is absent; current workspace owns its tab state. |
| `generate_bugchecker.cjs` | Obsolete one-off generator/patch | Deleted | Applied/superseded: scanner component imports services and DiffEditor and owns current scan state. |
| `generate_landing.cjs` | Obsolete one-off generator/patch | Deleted | Superseded by current OminiCode landing page; replay would erase user changes. |
| `patch_bugchecker_scan.cjs` | Obsolete one-off generator/patch | Deleted | Superseded: current scanner calls ScanService, replacing previous ReviewContext scan wiring. |
| `patch_commit_dropdown.cjs` | Obsolete one-off generator/patch | Deleted | Superseded: targets old commitModalOpen state absent from current service-backed scanner; not a runtime dependency. |
| `patch_cr_server.cjs` | Obsolete one-off generator/patch | Deleted | Applied: repository, scan, fix and test endpoints exist in server.ts. |
| `patch_devops_server.cjs` | Obsolete one-off generator/patch | Deleted | Applied: /api/devops/pipelines/trigger exists. |
| `patch_devops_server_2.cjs` | Obsolete one-off generator/patch | Deleted | Applied: existing trigger writes pipeline_runs and schedules mock completion. |
| `patch_diff_dropdown.cjs` | Obsolete one-off generator/patch | Deleted | Superseded: current scanner owns diffMode/diffViewMode and DiffEditor rather than old modal state. |
| `patch_diff_editor.cjs` | Obsolete one-off generator/patch | Deleted | Applied: scanner imports and renders DiffEditor. |
| `patch_explain_fix.cjs` | Obsolete one-off generator/patch | Deleted | Superseded: current scanner renders fixExplanation from FixService; old modal anchor absent. |
| `patch_grid_ui.cjs` | Obsolete one-off generator/patch | Deleted | Superseded by current dashboard layout and service-backed scanner; replay overwrites both. |
| `patch_orchestration.cjs` | Obsolete one-off generator/patch | Deleted | Applied: legacy scan start/status/findings routes and orchestrator import exist. |
| `patch_review_context.cjs` | Obsolete one-off generator/patch | Deleted | Applied: ReviewProvider exposes startRepositoryScan and polling. |
| `patch_security.cjs` | Obsolete one-off generator/patch | Deleted | Superseded: SecurityCenterPage now subscribes via SecurityCenterService instead of the patch mock effect. |
| `patch_sorting_filtering.cjs` | Obsolete one-off generator/patch | Deleted | Applied/superseded: scanner has severityFilter, sortMode and editorRef handling. |
| `patch_test_results.cjs` | Obsolete one-off generator/patch | Deleted | Superseded: scanner uses FixService.runTests and fix-state subscription; old modal anchors absent. |
| `patch_toasts.cjs` | Obsolete one-off generator/patch | Deleted | Superseded: patch targets obsolete scanner state and showToast; current scanner retained as-is. |
| `patch_tooltips.cjs` | Obsolete one-off generator/patch | Deleted | Superseded: string replacements target obsolete commit and modal controls. |
| `patch_ui.cjs` | Obsolete one-off generator/patch | Deleted | Superseded: generated whole-file UI replaced by current App and scanner. |
| `patch_view_in_diff.cjs` | Obsolete one-off generator/patch | Deleted | Applied/superseded: current scanner implements handleViewInDiff and editor view state. |
| `rewrite_app.cjs` | Obsolete one-off generator/patch | Deleted | Applied: route guards and login/register page imports are absent in current App. |
| `rewrite_auth.cjs` | Obsolete one-off generator/patch | Deleted | Applied: mock authentication context retained and explicitly labeled. |
| `rewrite_bugchecker.cjs` | Obsolete one-off generator/patch | Deleted | Superseded: current scanner uses codeReviewService; replay would revert service wiring. |
| `setup_architecture.cjs` | Obsolete one-off generator/patch | Deleted | Applied: Finding, ScanJob, LanguageAdapter and ScanOrchestrator files exist. |
| `update_demovideo.cjs` | Obsolete one-off generator/patch | Deleted | Superseded: legacy DemoVideo is not imported by current landing; component preserved and rebranded. |
| `seed_devops_data.cjs` | Explicit seed utility | Moved to scripts/seeds/devops.cjs | Inspected; retained outside the root. Import/config paths updated. |
| `seed_security_data.cjs` | Explicit seed utility | Moved to scripts/seeds/security.cjs | Inspected; retained outside the root. Import/config paths updated. |
| `seed_trends.cjs` | Explicit seed utility | Moved to scripts/seeds/trends.cjs | Inspected; retained outside the root. Import/config paths updated. |
| `get_groq_models.js` | Development diagnostic | Moved to scripts/development/list-groq-models.mjs | Inspected; retained outside the root. Import/config paths updated. |
| `test_post.cjs` | Development diagnostic | Moved to scripts/development/check-ai-review.cjs | Inspected; retained outside the root. Import/config paths updated. |
| `test-client-db.cjs` | Development diagnostic | Moved to scripts/development/check-firestore-client.cjs | Inspected; retained outside the root. Import/config paths updated. |
| `test-admin-adc3.cjs` | Development diagnostic | Moved to scripts/development/check-firestore-admin.cjs | Inspected; retained outside the root. Import/config paths updated. |
| `test-security.ts` | Existing regression test | Moved to tests/workspace-paths.test.ts | Inspected; retained outside the root. Import/config paths updated. |
| `k.py` | Standalone review sample | Moved to tests/fixtures/review-sample.py | Inspected; retained outside the root. Import/config paths updated. |
| `test-admin-adc.cjs` | Temporary diagnostic | Deleted | Redundant Firebase import/project/ADC probe; retained one modular Admin check and one client check. |
| `test-admin-adc2.cjs` | Temporary diagnostic | Deleted | Redundant Firebase import/project/ADC probe; retained one modular Admin check and one client check. |
| `test-admin-auth.ts` | Temporary diagnostic | Deleted | One-off user creation/token-printing probe with embedded demo password; not a test; authentication deferred. |
| `test-admin-db.cjs` | Temporary diagnostic | Deleted | Redundant Firebase import/project/ADC probe; retained one modular Admin check and one client check. |
| `test-admin-db2.cjs` | Temporary diagnostic | Deleted | Redundant Firebase import/project/ADC probe; retained one modular Admin check and one client check. |
| `test-admin-db3.cjs` | Temporary diagnostic | Deleted | Redundant Firebase import/project/ADC probe; retained one modular Admin check and one client check. |
| `test-admin.ts` | Temporary diagnostic | Deleted | Redundant Firebase import/project/ADC probe; retained one modular Admin check and one client check. |
| `test-admin2.ts` | Temporary diagnostic | Deleted | Redundant Firebase import/project/ADC probe; retained one modular Admin check and one client check. |
| `test-admin3.ts` | Temporary diagnostic | Deleted | Redundant Firebase import/project/ADC probe; retained one modular Admin check and one client check. |
| `test-admin4.ts` | Temporary diagnostic | Deleted | Redundant Firebase import/project/ADC probe; retained one modular Admin check and one client check. |
| `test-db.js` | Temporary diagnostic | Deleted | Redundant Firebase import/project/ADC probe; retained one modular Admin check and one client check. |
| `test_models.cjs` | Temporary diagnostic | Deleted | Duplicate of retained list-groq-models utility. |
