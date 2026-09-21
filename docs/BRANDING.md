# Brand foundation

Use `OminiCodeMark` for icon-only surfaces and `OminiCodeLogo` for the mark plus wordmark. The SVG mark is a circular geometric symbol divided by a slash; no raster crop or legacy symbol is required. Repeated instances use unique gradient IDs. `public/favicon.svg` uses matching geometry and should be updated alongside the mark.

Semantic colors live in `src/styles/tokens.css`. Use `var(--color-background)`, `var(--color-panel)`, `var(--color-panel-elevated)`, `var(--color-border)`, `var(--color-primary)`, `var(--color-primary-indigo)`, `var(--color-accent)`, `var(--color-success)`, `var(--color-warning)`, `var(--color-danger)`, and the three text variables. Brand gradients should use `--brand-gradient`.

Tailwind's inherited `brand-cyan` names remain compatibility aliases, now mapped to restrained brand blue; they are not a separate cyan palette. Legacy base colors shared by existing pages now resolve through semantic variables. Remaining localized illustration/photography colors are not a second application theme. Do not redesign pages merely to replace every decorative color in this phase.

`src/config/product.ts` holds product name, tagline, repository URL and default AI model metadata. Secret settings belong only under server/config and .env.
