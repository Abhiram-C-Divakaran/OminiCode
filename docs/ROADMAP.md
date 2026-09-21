# Roadmap

Phases are gated by review. Work in a later phase must not be inferred from an earlier cleanup.

| Phase | Scope | Status |
| --- | --- | --- |
| 1 | Foundation & repository cleanup | Complete; awaiting review (see PHASE1_REPORT.md) |
| 2 | Authentication | Not started |
| 3 | Organizations & authorization | Not started |
| 4 | Secure GitHub integration | Not started |
| 5 | Persistence/data architecture | Not started |
| 6 | Real scanning engine | Not started |
| 7 | Findings normalization | Not started |
| 8 | AI assistance | Prototype present; production work not started |
| 9 | Fix/diff/validation workflow | Demonstration present; production work not started |
| 10 | Security Center | Prototype present; production work not started |
| 11 | DevOps integration | Simulation present; real providers not started |
| 12 | Collaboration features | Prototype present; persistence/permissions not started |
| 13 | Responsive/mobile UX | Partial layouts present; dedicated editor work not started |
| 14 | Automated testing | Existing path checks only; comprehensive suite not started |
| 15 | CI/CD | Not started |
| 16 | Production hardening | Not started |

## Phase 1 exit gate

Require successful installation, typecheck, build, launch, and route rendering; reviewed branding cleanup; reusable mark/wordmark and color tokens; audited script removal/organization; correct package/environment identity; accurate README and architecture; no new paid dependency; no intentionally removed feature; and a complete file-level change report.

Only mark Phase 1 complete after every gate passes. Simulated/cloud-dependent behavior must be documented. Baseline technical debt does not become a production guarantee because the foundation builds.

## Next review

After Phase 1 acceptance, stop. Phase 2 should focus exclusively on real authentication and session security. It requires a separate reviewed implementation request. RBAC, secure GitHub credential storage, scanner engines, payments, subscriptions, provider integrations, containers, CI/CD and deployment remain out of Phase 1 scope.

