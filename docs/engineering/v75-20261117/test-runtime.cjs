const {fs,remote,repo,save}=require('./common.cjs');
const base='/home/owlnest/release-backups/v75-20261117/runtime';
let script=`set -eu\numask 077\nmkdir -p ${base}\n`;
for(const service of ['contact','analysis'])for(const file of ['Dockerfile','package.json','server.js']){const bytes=fs.readFileSync(`${repo}/server/${service}-api/${file}`);script+=`mkdir -p ${base}/${service}\nprintf '%s' '${bytes.toString('base64')}' | base64 -d > ${base}/${service}/${file}\n`;}
script+=String.raw`
for service in contact analysis; do
 docker image tag "owlnest-$service-api" "owlnest-$service-api:rollback-v75-20261117"
 docker build -t "owlnest-$service-api:v75-20261117" "/home/owlnest/release-backups/v75-20261117/runtime/$service"
 docker run -d --name "owlnest-v75-$service-qa" --network none --read-only --tmpfs /tmp --cap-drop ALL --security-opt no-new-privileges -e NODE_ENV=test -e RESEND_API_KEY=TEST_ONLY -e CONTACT_EMAIL_FROM=test@example.invalid -e CONTACT_EMAIL_TO=test@example.invalid -e OPENAI_API_KEY=TEST_ONLY "owlnest-$service-api:v75-20261117" >/dev/null
done
trap 'docker rm -f owlnest-v75-contact-qa owlnest-v75-analysis-qa >/dev/null' EXIT
sleep 1
for service in contact analysis; do
 docker exec -i "owlnest-v75-$service-qa" node --input-type=module - "$service" <<'JS'
import assert from 'node:assert/strict';
const service=process.argv[2],base='http://127.0.0.1:3000';
const paths=service==='contact'?['/api/contact','/api/subscribe-updates','/api/sleep-check-result']:['/api/analyze-sleep-environment'];
let count=0;const health=await fetch(base+'/health');assert.equal(health.status,200);count++;
for(const p of paths){assert.equal((await fetch(base+p)).status,405);count++;const r=await fetch(base+p,{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});assert.equal(r.status,400);assert.equal(r.headers.get('cache-control'),'no-store');count++;}
if(service==='contact')for(const p of paths){const r=await fetch(base+p,{method:'POST',redirect:'manual',headers:{'Content-Type':'application/json'},body:JSON.stringify({'bot-field':'synthetic QA trap'})});assert.equal(r.status,p==='/api/contact'?303:200);count++;}
assert.equal((await fetch(base+'/missing')).status,404);count++;
console.log(JSON.stringify({service,node:process.version,assertions:count,status:'PASS',isolation:'no network, fake credentials, no real email/data/API call',heap:process.memoryUsage().heapUsed}));
JS
done
docker run --rm --network none --mount type=bind,src=/srv/owlnest/caddy/Caddyfile,dst=/etc/caddy/Caddyfile,readonly caddy:2.11.9-alpine caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
`;
const result=remote(script);save('runtime-candidate-test.txt',result);console.log(result);
