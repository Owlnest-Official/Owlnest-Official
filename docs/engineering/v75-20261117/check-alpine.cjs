// Read-only installed-package comparison with official branch security records.
const {remote,save}=require('./common.cjs');
const result=remote(String.raw`python3 - <<'PY'
import json,subprocess,urllib.request,shlex,datetime
db={};sources=[]
for repo in ['main','community']:
 url='https://secdb.alpinelinux.org/v3.24/'+repo+'.json'
 with urllib.request.urlopen(url,timeout=30) as r: data=json.load(r)
 sources.append(url)
 for row in data['packages']:db[row['pkg']['name']]=row['pkg'].get('secfixes',{})
rows=[];comparisons={}
for name in ['owlnest-web','owlnest-caddy','owlnest-contact-api','owlnest-analysis-api']:
 text=subprocess.check_output(['docker','exec',name,'cat','/lib/apk/db/installed'],text=True)
 packages=[]
 for block in text.split('\n\n'):
  p=dict(line.split(':',1) for line in block.splitlines() if ':' in line)
  if 'P' in p and 'V' in p:packages.append({'name':p['P'],'version':p['V'],'origin':p.get('o',p['P'])})
 findings=[];known=0
 for p in packages:
  if p['origin'] in db:known+=1
  for fixed,cves in db.get(p['origin'],{}).items():
   if fixed=='0':continue
   key=(p['version'],fixed)
   if key not in comparisons:
    comparisons[key]=subprocess.check_output(['docker','exec','owlnest-web','apk','version','-t',*key],text=True).strip()
   if comparisons[key]=='<':findings.append({'package':p['name'],'installed':p['version'],'fixed':fixed,'advisories':cves})
 rows.append({'container':name,'packages':len(packages),'originsWithSecurityRecords':known,'findings':findings})
print(json.dumps({'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'sources':sources,'scope':'Alpine3.24 installed package origin/version vs published secfixes; not Go/Node bundled module or exhaustive vulnerability scan','rows':rows},indent=2))
PY`);
save('alpine-security-comparison.json',result);console.log(result);
