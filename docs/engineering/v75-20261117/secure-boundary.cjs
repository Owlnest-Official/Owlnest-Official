// Minimal containment using the existing unprivileged deployment account.
// No application, SSH, firewall, Caddy, credential or data changes.
const {remote,save}=require('./common.cjs');
const script=String.raw`set -eu
umask 077
base=/home/owlnest/release-backups/v75-20261117
test ! -e "$base"
mkdir -p "$base"
git -C /srv/owlnest/site rev-parse HEAD > "$base/rollback-sha.txt"
git -C /srv/owlnest/site archive --format=tar.gz --output="$base/website-source.tar.gz" HEAD
tar -C / -czf "$base/service-settings.tar.gz" srv/owlnest/nginx srv/owlnest/caddy srv/owlnest/docker-compose.yml etc/systemd/system/owlnest-update.service etc/systemd/system/owlnest-update.timer
cp /srv/owlnest/nginx/default.conf "$base/nginx-original.conf"
sha256sum /srv/owlnest/caddy/Caddyfile /srv/owlnest/docker-compose.yml /etc/systemd/system/owlnest-update.service /etc/systemd/system/owlnest-update.timer > "$base/protected-settings.sha256"
tar -tzf "$base/website-source.tar.gz" >/dev/null
tar -tzf "$base/service-settings.tar.gz" >/dev/null
(cd "$base" && sha256sum website-source.tar.gz service-settings.tar.gz > SHA256SUMS && sha256sum -c SHA256SUMS)
`;
const deny=`
    # V7.5: source repository is mounted here; only public resources may be served.
    # These guards precede the static-extension regex, including internal rewrites.
    location ~* ^/(docs|server|scripts|config|infra|netlify|supabase|_incoming|node_modules|tests)(/|$) { return 404; }
    location ~ /\\.(?!well-known(?:/|$)) { return 404; }
    location ~* \\.(?:md|cjs|map|env|ini|log|sql|sqlite|sqlite3|bak|backup|pem|key|yml|yaml|toml|lock)(?:$|/) { return 404; }
    location = /package.json { return 404; }
    location = /package-lock.json { return 404; }
`;
const encoded=Buffer.from(deny).toString('base64');
const result=remote(script+String.raw`
original="$base/nginx-original.conf"
candidate="$base/nginx-contained.conf"
{ sed '/    location ~\* \\.(css/,$d' "$original"; printf '%s' '`+encoded+String.raw`' | base64 -d; sed -n '/    location ~\* \\.(css/,$p' "$original"; } > "$candidate"
test "$(grep -c 'server {' "$candidate")" = 1
docker run --rm --network none --read-only --tmpfs /tmp --tmpfs /var/cache/nginx --tmpfs /var/run --mount type=bind,src="$candidate",dst=/etc/nginx/conf.d/default.conf,readonly nginx:stable-alpine nginx -t
cp "$candidate" /srv/owlnest/nginx/default.conf
if ! docker exec owlnest-web nginx -t; then cp "$original" /srv/owlnest/nginx/default.conf; exit 1; fi
if ! docker exec owlnest-web nginx -s reload; then cp "$original" /srv/owlnest/nginx/default.conf; docker exec owlnest-web nginx -s reload; exit 1; fi
sha256sum -c "$base/protected-settings.sha256"
printf 'Boundary containment applied; rollback config: %s\n' "$original"
`);save('boundary-containment.txt',result);console.log(result);
