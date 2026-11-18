const {fs,repo,remote,save}=require('./common.cjs');
let script='set -eu\numask 077\nmkdir -p /home/owlnest/ops\n';
for(const name of ['backup','monitor']){const b=fs.readFileSync(repo+'/infra/vps/'+name+'.sh').toString('base64');script+=`printf '%s' '${b}' | base64 -d > /home/owlnest/ops/${name}.sh\nchmod 700 /home/owlnest/ops/${name}.sh\nsh -n /home/owlnest/ops/${name}.sh\n`;}
script+=String.raw`
/home/owlnest/ops/backup.sh
root=/home/owlnest/release-backups/automatic
file=$(find "$root" -maxdepth 1 -name 'owlnest-*.tar.gz' -type f | sort | tail -1)
test -n "$file"
drill=$(mktemp -d /home/owlnest/release-backups/restore-drill-XXXXXX)
tar -xzf "$file" -C "$drill"
(cd "$drill" && sha256sum -c SHA256SUMS)
mkdir "$drill/site" "$drill/settings"
tar -xzf "$drill/source.tar.gz" -C "$drill/site"
tar -xzf "$drill/settings.tar.gz" -C "$drill/settings"
cmp "$drill/site/index.html" /srv/owlnest/site/index.html
cmp "$drill/settings/srv/owlnest/nginx/default.conf" /srv/owlnest/nginx/default.conf
printf 'PASS isolated restore drill; production data untouched\n'
stat -c '%a %U:%G %n' "$root" "$file" "$drill"
if /home/owlnest/ops/monitor.sh --self-test; then echo 'Self-test failed to detect synthetic fault'; exit 1; fi
/home/owlnest/ops/monitor.sh
old=$(mktemp /home/owlnest/ops/cron-before-XXXXXX)
crontab -l > "$old" 2>/dev/null || true
if grep -q 'BEGIN OWLNEST V75' "$old"; then echo 'Existing V75 schedule retained'; else
 { cat "$old"; printf '\n# BEGIN OWLNEST V75\n17 2 * * * /home/owlnest/ops/backup.sh >> /home/owlnest/ops/backup.log 2>&1\n*/5 * * * * /home/owlnest/ops/monitor.sh >> /home/owlnest/ops/monitor.log 2>&1\n# END OWLNEST V75\n'; } | crontab -
fi
crontab -l
`;
const result=remote(script);save('backup-monitor-test.txt',result);console.log(result);
