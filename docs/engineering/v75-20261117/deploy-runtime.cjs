// Applies only already-tested images/configuration to existing services.
// Requires the expected main commit to have reached the VPS first.
const {remote,save}=require('./common.cjs');
const expected=process.argv[2];if(!/^[a-f0-9]{40}$/.test(expected||''))throw Error('Expected release SHA required');
const script=String.raw`set -eu
umask 077
base=/home/owlnest/release-backups/v75-20261117
test "$(git -C /srv/owlnest/site rev-parse HEAD)" = EXPECTED
test -z "$(git -C /srv/owlnest/site status --porcelain)"
test ! -f "$base/runtime-deployed"
cp -p /srv/owlnest/docker-compose.yml "$base/compose-before-runtime.yml"
cp -p /srv/owlnest/nginx/default.conf "$base/nginx-before-runtime.conf"
docker image tag "$(docker inspect -f '{{.Image}}' owlnest-web)" owlnest-web:rollback-v75-20261117
docker image tag "$(docker inspect -f '{{.Image}}' owlnest-caddy)" owlnest-caddy:rollback-v75-20261117
sha256sum /srv/owlnest/caddy/Caddyfile /etc/systemd/system/owlnest-update.service /etc/systemd/system/owlnest-update.timer > "$base/untouched-runtime.sha256"
docker compose -f /srv/owlnest/docker-compose.yml config --format json > "$base/compose-normalized-before.json"
python3 - <<'PY'
import pathlib,re,json,subprocess
p=pathlib.Path('/srv/owlnest/docker-compose.yml');s=p.read_text()
for old,new in [
 ('nginx:stable-alpine','nginx:1.30.6-alpine@sha256:901e593c95dc85f5a729f5765516321366ef4ac401821431d408897e95287d0a'),
 ('caddy:2.11.4-alpine','caddy:2.11.9-alpine@sha256:003a97808e781aa9f7e75cc2f43d34d461099031faf5e20faefb9f61126836f0')]:
 assert s.count(old)==1, 'Unexpected compose image field';s=s.replace(old,new)
candidate=pathlib.Path('/srv/owlnest/docker-compose.v75-candidate.yml');candidate.write_text(s)
before=json.loads(subprocess.check_output(['docker','compose','-f',str(p),'config','--format','json']))
after=json.loads(subprocess.check_output(['docker','compose','-f',str(candidate),'config','--format','json']))
for k in ['web','caddy']:after['services'][k]['image']=before['services'][k]['image']
assert before==after,'Unexpected compose semantic change; abort'
print('PASS only two image fields changed; ports, mounts, environment, networks and services preserved')
PY
rollback() {
  code=$?
  if [ "$code" -ne 0 ]; then
    trap - EXIT
    printf 'FAIL runtime rollout; restoring safe configuration and previous images\n'
    cp -p "$base/compose-before-runtime.yml" /srv/owlnest/docker-compose.yml
    cp -p "$base/nginx-before-runtime.conf" /srv/owlnest/nginx/default.conf
    docker tag owlnest-web:rollback-v75-20261117 nginx:stable-alpine
    docker tag owlnest-caddy:rollback-v75-20261117 caddy:2.11.4-alpine
    docker tag owlnest-contact-api:rollback-v75-20261117 owlnest-contact-api
    docker tag owlnest-analysis-api:rollback-v75-20261117 owlnest-analysis-api
    docker compose -f /srv/owlnest/docker-compose.yml up -d --no-build --pull never --force-recreate --wait --wait-timeout 90
    exit "$code"
  fi
}
trap rollback EXIT
cp /srv/owlnest/docker-compose.v75-candidate.yml /srv/owlnest/docker-compose.yml
cp "$base/nginx-v75.conf" /srv/owlnest/nginx/default.conf
for service in contact analysis; do
 docker tag "owlnest-$service-api:v75-20261117" "owlnest-$service-api"
 docker compose -f /srv/owlnest/docker-compose.yml up -d --no-deps --no-build --pull never --force-recreate --wait --wait-timeout 90 "$service-api"
 docker exec "owlnest-$service-api" node -e "fetch('http://127.0.0.1:3000/health').then(r=>{if(!r.ok)process.exit(1);console.log('PASS API health',process.version)})"
done
docker compose -f /srv/owlnest/docker-compose.yml up -d --no-deps --no-build --pull never --force-recreate --wait --wait-timeout 90 web
docker exec owlnest-web nginx -t
curl -fsS --resolve owlnestofficial.com:443:127.0.0.1 https://owlnestofficial.com/ -o /dev/null
docker compose -f /srv/owlnest/docker-compose.yml up -d --no-deps --no-build --pull never --force-recreate --wait --wait-timeout 90 caddy
for p in / /zh-tw/ /products/lume/ /lab/; do
 curl -fsS --retry 5 --retry-delay 1 --retry-connrefused --resolve owlnestofficial.com:443:127.0.0.1 "https://owlnestofficial.com$p" -o /dev/null
done
sha256sum -c "$base/untouched-runtime.sha256"
/home/owlnest/ops/monitor.sh
date -u +%FT%TZ > "$base/runtime-deployed"
docker ps --format '{{.Names}} {{.Image}} {{.Status}}'
printf 'PASS runtime rollout; rollback preserved\n'
`;
try{const result=remote(script.replace('EXPECTED',expected));save('runtime-deployment.txt',result);console.log(result);}catch(e){save('runtime-deployment-error.txt',String(e.stdout||'')+'\n'+String(e.stderr||'')+'\n'+e.message);throw e;}
