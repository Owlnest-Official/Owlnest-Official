#!/bin/sh
# Service-scoped backup. Never mount the host root or expose private archives.
set -eu
umask 077
root=/home/owlnest/release-backups/automatic
mkdir -p "$root"
test "$(readlink -f "$root")" = "$root"
exec 9>"$root/.backup.lock"
flock -n 9 || exit 0
stamp=$(date -u +%Y%m%dT%H%M%SZ)
work=$(mktemp -d "$root/.work-XXXXXX")
git -C /srv/owlnest/site rev-parse HEAD > "$work/revision.txt"
git -C /srv/owlnest/site archive --format=tar.gz --output="$work/source.tar.gz" HEAD
tar -C / -czf "$work/settings.tar.gz" srv/owlnest/nginx/default.conf srv/owlnest/caddy/Caddyfile srv/owlnest/docker-compose.yml etc/systemd/system/owlnest-update.service etc/systemd/system/owlnest-update.timer
# Named existing service mounts only. Contents stay on the VPS, mode 600.
docker exec owlnest-caddy tar -czf - -C /data . > "$work/tls-data.tar.gz"
docker exec owlnest-contact-api tar -czf - -C /run/secrets . > "$work/contact-secrets.tar.gz"
docker exec owlnest-analysis-api tar -czf - -C /run/secrets . > "$work/analysis-secrets.tar.gz"
for file in "$work"/*.tar.gz; do tar -tzf "$file" >/dev/null; done
(cd "$work" && sha256sum ./*.tar.gz revision.txt > SHA256SUMS && sha256sum -c SHA256SUMS >/dev/null)
tar -C "$work" -czf "$root/owlnest-$stamp.tar.gz.partial" .
tar -tzf "$root/owlnest-$stamp.tar.gz.partial" >/dev/null
mv "$root/owlnest-$stamp.tar.gz.partial" "$root/owlnest-$stamp.tar.gz"
(cd "$root" && sha256sum "owlnest-$stamp.tar.gz" > "owlnest-$stamp.sha256")
printf '%s\n' "$stamp" > "$root/last-success"
logger -t owlnest-backup "PASS snapshot=$stamp"
printf 'PASS snapshot=%s\n' "$stamp"
# Only this run's validated temporary directory. No unrelated backup is removed.
case "$work" in "$root"/.work-*) rm -rf -- "$work";; *) exit 1;; esac
# Explicit app-owned flat files only; keep fourteen days, never touch old releases.
find "$root" -maxdepth 1 -type f -name 'owlnest-20??????T??????Z.tar.gz' -mtime +13 -delete
find "$root" -maxdepth 1 -type f -name 'owlnest-20??????T??????Z.sha256' -mtime +13 -delete
