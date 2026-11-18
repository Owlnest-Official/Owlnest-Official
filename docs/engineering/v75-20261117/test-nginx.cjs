const {fs,repo,remote,save}=require('./common.cjs');
const b64=Buffer.from(fs.readFileSync(repo+'/infra/vps/nginx/default.conf')).toString('base64');
const result=remote(`set -eu
umask 077
target=/home/owlnest/release-backups/v75-20261117/nginx-v75.conf
printf '%s' '${b64}' | base64 -d > "$target"
docker run --rm --network none --read-only --tmpfs /var/cache/nginx --tmpfs /var/run --mount type=bind,src="$target",dst=/etc/nginx/conf.d/default.conf,readonly nginx:1.30.6-alpine nginx -t
docker run -d --name owlnest-v75-nginx-qa --read-only --tmpfs /var/cache/nginx --tmpfs /var/run -p 127.0.0.1:18075:80 --mount type=bind,src="$target",dst=/etc/nginx/conf.d/default.conf,readonly --mount type=bind,src=/srv/owlnest/site,dst=/usr/share/nginx/html,readonly nginx:1.30.6-alpine >/dev/null
trap 'docker rm -f owlnest-v75-nginx-qa >/dev/null' EXIT
sleep 1
python3 - <<'PY'
import json, urllib.request, urllib.error, urllib.parse
class NoRedirect(urllib.request.HTTPRedirectHandler):
 def redirect_request(self,*args): return None
op=urllib.request.build_opener(NoRedirect)
def get(p):
 try: r=op.open('http://127.0.0.1:18075'+p)
 except urllib.error.HTTPError as e: r=e
 return r.code,r.headers.get('Location'),r.headers.get('Cache-Control')
routes=json.load(open('/srv/owlnest/site/config/site-routes.json'))['redirects']
q='?utm_source=v75&utm_medium=qa&utm_campaign=a%20b&utm_content=x%2By&utm_term=night&gclid=g&fbclid=f&ttclid=t&ref=qa&discount=TEST&next=https%3A%2F%2Fevil.invalid'
for src,dst in routes.items():
 code,loc,cache=get(src+q)
 assert code==301 and loc==dst+q,(src,code,loc)
 code,loc,cache=get(dst+q)
 assert code==200,(dst,code,loc)
for p in ['/docs/OWLNEST_BRAND_TRUTH.md','/server/contact-api/server.js','/.git/config','/AGENTS.md','/config/site-source-manifest.json','/scripts/build-site.cjs','/.netlify/images?url=/server/contact-api/server.js']:
 assert get(p)[0]==404,p
for p in ['/','/zh-tw/','/account/','/assets/v7/scroll.js','/assets/v7/anchors.json']:
 assert get(p)[0]==200,p
for qx,expected in [('?utm_source=x','?ref=demo&utm_source=x'),('?ref=other&utm_source=x','?ref=demo&utm_source=x'),('?a=1&ref=other&b=2','?ref=demo&a=1&b=2'),('?a=1&ref=other','?ref=demo&a=1'),('?ref=other','?ref=demo')]:
 assert get('/r/demo'+qx)[1]=='/products/'+expected,(qx,get('/r/demo'+qx))
assert get('/r/demo?ref=a&ref=b')[0]==400
assert get('/assets/v7/scroll.js')[2]=='public, max-age=0, must-revalidate'
assert get('/')[2]=='no-cache'
print(json.dumps({'routes':len(routes),'status':'PASS','queries':'exact encoded preservation','privacyGuards':7,'referralCases':6,'canonicalTargets':'all 200; no loops','test':'isolated loopback Nginx 1.30.6 container; no production switch'}))
PY
`);save('nginx-candidate-test.txt',result);console.log(result);
