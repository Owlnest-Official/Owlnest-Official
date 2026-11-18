# Change scope

- 34 canonical public EN/ZH HTML files listed in `config/site-source-manifest.json`: head stylesheet packaging and favicon reference only; body, inline business scripts, metadata/canonical parity verified.
- `config/site-source-manifest.json`:17 content-addressed CSS bundles and one favicon added to public asset list.
- `assets/optimized/css/*.css`: generated original declarations in original order.
- `assets/optimized/favicon-64.png`: same existing logo resized for browser tab.
- `scripts/bundle-public-css.cjs`, `scripts/optimize-favicon.cjs`, `scripts/generate-vps-nginx.cjs`: reproducible transforms/config generator.
- `server/contact-api/Dockerfile`, `server/analysis-api/Dockerfile`: base-image pin only. No API code changes.
- `infra/vps/nginx/default.conf`, `infra/vps/backup.sh`, `infra/vps/monitor.sh`.
- This engineering folder's reports and reproducible QA/rollout helpers. Raw evidence excluded from Git.

Live operational changes: safe Nginx boundary, scheduled private backup/monitoring, then tested runtime/redirect/cache activation as recorded in DEPLOYMENT.md.

Preserved: dirty `assets/css/typography.css`, six pre-existing governance-document edits, unrelated untracked history/previews, account/auth, checkout/referral/discount logic, GTM/GA/consent, research state, photos and96frame/controller. `_incoming/` never staged. Exact staged list must be reviewed before commit; see QA report.
