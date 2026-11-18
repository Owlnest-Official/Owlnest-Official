const {fs,repo,remote,save}=require('./common.cjs');
const base='/home/owlnest/release-backups/v75-20261117/security2';let script=`set -eu\numask 077\nmkdir -p ${base}\n`;
for(const service of ['contact','analysis','web','caddy']){const dir=service==='web'?'infra/vps/nginx':service==='caddy'?'infra/vps/caddy':`server/${service}-api`;for(const file of service==='web'||service==='caddy'?['Dockerfile']:['Dockerfile','package.json','server.js'])script+=`mkdir -p ${base}/${service}\nprintf '%s' '${fs.readFileSync(repo+'/'+dir+'/'+file).toString('base64')}' | base64 -d > ${base}/${service}/${file}\n`;}
script+=String.raw`
for svc in contact analysis web caddy; do
 image="owlnest-$svc:v75-libraries-20261118"
 docker build -t "$image" "/home/owlnest/release-backups/v75-20261117/security2/$svc"
 docker run --rm --network none --entrypoint sh "$image" -c 'apk info -v zlib libxslt 2>/dev/null || true'
done
for svc in contact analysis; do
 docker run -d --name "v75-libraries-$svc-qa" --network none --read-only --tmpfs /tmp --cap-drop ALL --security-opt no-new-privileges -e NODE_ENV=test -e RESEND_API_KEY=TEST_ONLY -e CONTACT_EMAIL_FROM=test@example.invalid -e CONTACT_EMAIL_TO=test@example.invalid -e OPENAI_API_KEY=TEST_ONLY "owlnest-$svc:v75-libraries-20261118" >/dev/null
done
trap 'docker rm -f v75-libraries-contact-qa v75-libraries-analysis-qa >/dev/null' EXIT
sleep 1
for svc in contact analysis; do
 docker exec -i "v75-libraries-$svc-qa" node --input-type=module - "$svc" <<'JS'
import assert from 'node:assert/strict';
const paths=process.argv[2]==='contact'?['/api/contact','/api/subscribe-updates','/api/sleep-check-result']:['/api/analyze-sleep-environment'];
assert.equal((await fetch('http://127.0.0.1:3000/health')).status,200);
for(const p of paths){assert.equal((await fetch('http://127.0.0.1:3000'+p)).status,405);const r=await fetch('http://127.0.0.1:3000'+p,{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});assert.equal(r.status,400);assert.equal(r.headers.get('cache-control'),'no-store');}
console.log('PASS isolated API validation; no network or real credentials',process.argv[2]);
JS
done
docker run --rm --network none --read-only --tmpfs /var/cache/nginx --tmpfs /var/run --mount type=bind,src=/srv/owlnest/nginx/default.conf,dst=/etc/nginx/conf.d/default.conf,readonly owlnest-web:v75-libraries-20261118 nginx -t
docker run --rm --network none --mount type=bind,src=/srv/owlnest/caddy/Caddyfile,dst=/etc/caddy/Caddyfile,readonly owlnest-caddy:v75-libraries-20261118 caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
`;
const out=remote(script);save('library-images-test.txt',out);console.log(out);
