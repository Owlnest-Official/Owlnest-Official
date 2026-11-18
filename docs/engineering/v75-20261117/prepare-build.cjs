// Clean HEAD + an explicit V7.5 public-source overlay. Never copies unrelated dirt.
const {fs,path,cp,repo,save,git}=require('./common.cjs');
const stamp=Date.now(),base=path.join(process.env.TEMP,'owlnest-v75-release-'+stamp),src=base+'-source',out=base+'-built';
fs.mkdirSync(src);cp.execFileSync('git',['archive','--format=tar','-o',base+'.tar','HEAD'],{cwd:repo});cp.execFileSync('tar',['-xf',base+'.tar','-C',src]);
const manifest=JSON.parse(fs.readFileSync(repo+'/config/site-source-manifest.json'));
const files=[...manifest.routes.map(r=>r.file),'config/site-source-manifest.json',...manifest.files.filter(f=>f.startsWith('assets/optimized/'))];
for(const file of files){fs.mkdirSync(path.dirname(path.join(src,file)),{recursive:true});fs.copyFileSync(path.join(repo,file),path.join(src,file));}
const result=cp.execFileSync('node',[path.join(src,'scripts/build-site.cjs'),out],{encoding:'utf8'});
save('clean-build.json',{base:git('rev-parse','HEAD'),source:src,output:out,overlay:files,result:JSON.parse(result),preservedTypography:'HEAD version in release artifact; user working-tree typography is untouched'});console.log(result);
