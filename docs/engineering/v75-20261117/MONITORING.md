# Monitoring

Installed `infra/vps/monitor.sh` as `/home/owlnest/ops/monitor.sh`, own-user cron every5minutes. Existing root updater and other schedules unchanged. No status endpoint exposed.

Checks: public EN/ZH routes, HTTP canonical redirect, four existing containers and API health, disk85%, available memory200MB, load versus CPU count, TLS expiry14days, backup freshness26hours, recent critical Nginx errors.

PASS: synthetic fault causes FAIL; normal run PASS; scheduler entry confirmed. Events are local private log plus system logger warning. Existing Docker logging already bounded10MB×3/container.

BLOCKED: external email/webhook alert recipient and credentials not supplied. This is local detection, not a claim of 24/7 attended external notification. Root-only auth/firewall monitoring and pre-existing cloud-init service failure remain separate follow-up. No paid subscription created.
