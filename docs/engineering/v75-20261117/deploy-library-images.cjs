const {remote,save}=require('./common.cjs');const sha=process.argv[2];if(!/^[a-f0-9]{40}$/.test(sha||''))throw Error('Release SHA required');
const result=remote(String.raw`set -eu
umask 077
base=/home/owlnest/release-backups/v75-20261117/security2
test "$(git -C /srv/owlnest/site rev-parse HEAD)" = EXPECTED
test ! -f "$base/deployed"
cp -p /srv/owlnest/docker-compose.yml "$base/compose-before.yml"
for name in contact-api analysis-api web caddy; do docker tag "$(docker inspect -f '{{.Image}}' owlnest-$name)" "owlnest-$name:pre-library-patch"; done
python3 - <<'PY'
import pathlib,json,subprocess
p=pathlib.Path('/srv/owlnest/docker-compose.yml');s=p.read_text()
for old,new in [('nginx:1.30.6-alpine@sha256:901e593c95dc85f5a729f5765516321366ef4ac401821431d408897e95287d0a','owlnest-web:v75-libraries-20261118'),('caddy:2.11.9-alpine@sha256:003a97808e781aa9f7e75cc2f43d34d461099031faf5e20faefb9f61126836f0','owlnest-caddy:v75-libraries-20261118')]:
 assert s.count(old)==1;s=s.replace(old,new)
q=pathlib.Path('/srv/owlnest/docker-compose.v75-libraries.yml');q.write_text(s)
a=json.loads(subprocess.check_output(['docker','compose','-f',str(p),'config','--format','json']))
b=json.loads(subprocess.check_output(['docker','compose','-f',str(q),'config','--format','json']))
for k in ['web','caddy']:b['services'][k]['image']=a['services'][k]['image']
assert a==b;print('PASS compose differs only in web/caddy image references')
PY
rollback(){ code=$?; if [ "$code" -ne 0 ]; then trap - EXIT; cp -p "$base/compose-before.yml" /srv/owlnest/docker-compose.yml; docker tag owlnest-contact-api:pre-library-patch owlnest-contact-api; docker tag owlnest-analysis-api:pre-library-patch owlnest-analysis-api; docker compose -f /srv/owlnest/docker-compose.yml up -d --no-build --pull never --force-recreate --wait --wait-timeout 90; exit "$code"; fi; }
trap rollback EXIT
cp /srv/owlnest/docker-compose.v75-libraries.yml /srv/owlnest/docker-compose.yml
for svc in contact analysis; do docker tag "owlnest-$svc:v75-libraries-20261118" "owlnest-$svc-api"; docker compose -f /srv/owlnest/docker-compose.yml up -d --no-deps --no-build --pull never --force-recreate --wait --wait-timeout 90 "$svc-api"; done
for svc in web caddy; do docker compose -f /srv/owlnest/docker-compose.yml up -d --no-deps --no-build --pull never --force-recreate --wait --wait-timeout 90 "$svc"; done
curl -fsS --retry 5 --retry-delay 1 --retry-connrefused --resolve owlnestofficial.com:443:127.0.0.1 https://owlnestofficial.com/ -o /dev/null
/home/owlnest/ops/monitor.sh
sha256sum -c /home/owlnest/release-backups/v75-20261117/untouched-runtime.sha256
date -u +%FT%TZ > "$base/deployed"
docker ps --format '{{.Names}} {{.Image}} {{.Status}}'
printf 'PASS targeted library rollout\n'
`.replace('EXPECTED',sha));save('library-deployment.txt',result);console.log(result);
