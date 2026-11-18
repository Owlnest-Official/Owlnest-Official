# Deployment

Baseline local/main/origin/VPS: `4f25a0670a1924694c08a34c027f56750ecd77eb`.

Source deployment uses existing origin/main synchronization every5minutes. No Netlify deployment, DNS, new branch or forced local checkout. A push is production-affecting.

Pre-release: private backup and isolated restore test complete. Internal-source exposure containment and private monitoring/backup were applied as targeted operational fixes; full redirect/cache/runtime candidate validated in isolation but pending activation at this report revision.

Runtime helper `deploy-runtime.cjs <expectedSHA>` refuses SHA drift, verifies clean server tree, compares normalized Compose (only two image fields may differ), then updates existing APIs/web/Caddy one at a time. Health failure triggers restoration to retained oldimages/safeconfig. Caddy config, updater, mountpoints, ports and environment are preserved.

Release SHA, live verification and measured after-performance will be appended after actual execution; no deployment success is claimed before that evidence.
