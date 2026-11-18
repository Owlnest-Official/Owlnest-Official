# OWLNEST V7.5

Work started 2026-11-17; release verification continues 2026-11-18 Asia/Taipei.

## Scope and baseline

Production checkout: `Owlnest-Official-gap-20260903`, branch `main`. Local, origin and VPS baseline were independently verified as `4f25a0670a1924694c08a34c027f56750ecd77eb`, not an older V7.4 SHA. The other local checkout was not edited.

The release contains no brand, price, layout, animation-controller, checkout, consent, tracking or research activation changes. Single US$49 / Duo US$89 / saving US$9 remain unchanged. Existing dirty typography and governance files are excluded from the release.

## Implemented

- Contained publicly reachable internal source/config/document paths on Nginx. Existing APIs and static public pages preserved.
- Reproducible Nginx route rules preserve query strings and remove scheme downgrade/extra canonical redirect hops.
- Tested Nginx 1.30.6, Caddy 2.11.9 and Node 24.22.3 images; rollout and rollback use existing services/mounts.
- Bundled contiguous local CSS requests without changing declarations/order; original sources retained. `typography.css` remains separate.
- Same-logo 64px favicon derivative: 168,241 to 3,987 bytes. All original photographs and 96 WebP frames remain unchanged.
- Private daily backups, isolated restore drill and five-minute local monitoring.

## Release gate

Local clean build and reconciled browser regression passed. See QA.md. Live deployment and post-release performance must be recorded in DEPLOYMENT.md / PERFORMANCE.md; a local PASS is not a live PASS.

VPS P0 is **partially resolved, not fully closed**: PHP-specific applicability is cleared, source exposure contained; effective root firewall/auth log checks and kernel maintenance remain blocked. No claim of an uncompromised host is made.

Raw evidence (public screenshots, traces, sanitized JSON) is retained locally under `evidence/`, excluded from Git to avoid shipping large operational artifacts. Scripts and these reports are versioned; private backups remain only on the VPS.
