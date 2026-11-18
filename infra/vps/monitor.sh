#!/bin/sh
set -eu
umask 077
root=/home/owlnest/ops/monitor
mkdir -p "$root"
exec 9>"$root/.monitor.lock"
flock -n 9 || exit 0
result=PASS
issues=''
problem() { result=FAIL; issues="$issues $1"; }
for route in / /zh-tw/ /products/lume/ /zh-tw/products/lume/ /lab/ /lab/sleep/21-day-program/; do
 code=$(curl -sS --max-time 15 -o /dev/null -w '%{http_code}' "https://owlnestofficial.com$route" 2>/dev/null || true)
 test "$code" = 200 || problem "route:$route:$code"
done
code=$(curl -sS --max-time 15 -o /dev/null -w '%{http_code}' http://owlnestofficial.com/ 2>/dev/null || true)
case "$code" in 301|308) ;; *) problem http-redirect;; esac
for name in owlnest-web owlnest-caddy owlnest-contact-api owlnest-analysis-api; do
 state=$(docker inspect --format '{{.State.Status}} {{if .State.Health}}{{.State.Health.Status}}{{end}}' "$name" 2>/dev/null || true)
 case "$state" in 'running '*|'running') ;; *) problem "$name:stopped";; esac
 case "$state" in *unhealthy*) problem "$name:unhealthy";; esac
done
disk=$(df -P / | awk 'NR==2 {gsub(/%/,"",$5);print $5}')
test "$disk" -lt 85 || problem disk-high
available=$(awk '/MemAvailable/{print $2}' /proc/meminfo)
test "$available" -gt 200000 || problem memory-low
load=$(cut -d ' ' -f 1 /proc/loadavg)
awk -v n="$load" -v cpus="$(getconf _NPROCESSORS_ONLN)" 'BEGIN{exit !(n<cpus*2)}' || problem cpu-load-high
timeout 15 sh -c 'echo | openssl s_client -connect owlnestofficial.com:443 -servername owlnestofficial.com 2>/dev/null | openssl x509 -checkend 1209600 -noout' >/dev/null 2>&1 || problem tls-less-than-14-days
test -n "$(find /home/owlnest/release-backups/automatic -maxdepth 1 -name last-success -mmin -1560 2>/dev/null)" || problem backup-stale
errors=$(docker logs --since 5m --tail 5000 owlnest-web 2>&1 | grep -Ec '\[(crit|alert|emerg)\]|upstream.*(failed|timed out)' || true)
test "$errors" -eq 0 || problem nginx-critical-errors
if [ "${1:-}" = --self-test ]; then problem synthetic-test; fi
printf '%s %s disk=%s available_kb=%s load=%s issues=%s\n' "$(date -u +%FT%TZ)" "$result" "$disk" "$available" "$load" "$issues" >> "$root/monitor-$(date -u +%Y-%m).log"
printf '%s %s\n' "$result" "$issues" > "$root/last-result"
if [ "$result" != PASS ]; then logger -p user.warning -t owlnest-monitor "$result $issues"; fi
printf '%s %s\n' "$result" "$issues"
test "$result" = PASS
