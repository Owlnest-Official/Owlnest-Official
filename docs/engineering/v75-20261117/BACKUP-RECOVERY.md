# Backup and recovery

PASS: private snapshot created and actually extracted into a separate restore-drill directory; checksums passed, restored source index and Nginx config matched originals. Production files/databases were not overwritten.

- Script: `infra/vps/backup.sh`, installed `/home/owlnest/ops/backup.sh` mode700.
- Daily02:17 UTC (10:17 Asia/Taipei); 14-day retention for this script's exact flat archive names only.
- Directory `/home/owlnest/release-backups/automatic`700, archive/checksum600.
- Includes Git HEAD source, Nginx/Caddy/Compose/updater settings, existing Caddy TLS data and existing API mounted secrets. Secret archive streams stay on VPS; no values enter reports or Git.
- Snapshot example: `owlnest-20261117T124619Z.tar.gz`; restore drill `restore-drill-E11wU5`.
- Backup completion timestamp monitored. Partial failures remain private for investigation. Original release backup not part of automatic pruning.

## Rollback

Code baseline `4f25a0670a1924694c08a34c027f56750ecd77eb`; use an intentional revert on main through the existing updater rather than a local-only VPS reset that would be overwritten five minutes later.

Runtime rollback tags and original Compose retained in `/home/owlnest/release-backups/v75-20261117/`. Rollout helper traps failures, restores previous image tags and safe contained Nginx configuration, then recreates existing services with original mounts. Do NOT restore the earlier public-source exposure. Caddy TLS data volumes are retained, never deleted. API runtime-only changes preserve exact server.js.

BLOCKED: independent/offsite encrypted storage destination and credential not supplied. Local snapshots do not protect against total VPS/disk loss. Supabase-managed member/database backup recovery NOT TESTED; no local research DB activated. Recovery drill proves archive restoration, not full-provider disaster recovery.
