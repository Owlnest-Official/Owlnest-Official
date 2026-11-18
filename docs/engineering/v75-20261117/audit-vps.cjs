const {remote,save}=require('./common.cjs');
const containers=['owlnest-web','owlnest-caddy','owlnest-contact-api','owlnest-analysis-api'];
// Never save or print Docker environment values, raw application logs or request URLs.
const result=JSON.parse(remote('docker inspect '+containers.join(' '))).map(c=>({name:c.Name,image:c.Config.Image,imageId:c.Image,user:c.Config.User,restart:c.HostConfig.RestartPolicy,readOnly:c.HostConfig.ReadonlyRootfs,privileged:c.HostConfig.Privileged,capDrop:c.HostConfig.CapDrop,securityOpt:c.HostConfig.SecurityOpt,ports:c.NetworkSettings.Ports,mounts:c.Mounts.map(m=>({type:m.Type,source:m.Source,destination:m.Destination,rw:m.RW})),logConfig:c.HostConfig.LogConfig,state:{status:c.State.Status,started:c.State.StartedAt,restarts:c.RestartCount,health:c.State.Health?.Status},environmentNames:(c.Config.Env||[]).map(e=>e.split('=')[0])}));save('container-audit.json',result);console.log(JSON.stringify(result,null,2));
save('host-audit.txt',remote(String.raw`date -u
printf '\nPHP package records\n'; dpkg-query -W -f='${'$'}{binary:Package} ${'$'}{Version} ${'$'}{db:Status-Abbrev}\n' '*php*' 2>/dev/null || true
printf '\nPHP runtimes in containers\n'
for c in owlnest-web owlnest-caddy owlnest-contact-api owlnest-analysis-api; do
 echo "$c"; docker exec "$c" sh -c 'command -v php php-fpm php-cgi || true; ps | grep -E "[p]hp|[a]pache" || true; cat /etc/alpine-release; apk info | grep -E "^php|^apache" || true';
done
printf '\nReadable SSH includes (effective root verification still required)\n'
grep -E '^[[:space:]]*(Include|PermitRootLogin|PasswordAuthentication|PubkeyAuthentication|KbdInteractiveAuthentication|AuthenticationMethods|AllowUsers|AllowGroups|Port)' /etc/ssh/sshd_config /etc/ssh/sshd_config.d/*.conf 2>/dev/null
printf '\nFirewall read access\n'; sudo -n ufw status 2>&1 || true
printf '\nOwn user services\n'; systemctl --user list-timers --all --no-pager
printf '\nLogin linger\n'; loginctl show-user owlnest -p Linger
printf '\nKernel reboot status\n'; uname -r; test ! -f /var/run/reboot-required || cat /var/run/reboot-required; test ! -f /var/run/reboot-required.pkgs || cat /var/run/reboot-required.pkgs
printf '\nPackage security origins\n'; grep -E 'Allowed-Origins|security|updates|Automatic-Reboot' /etc/apt/apt.conf.d/50unattended-upgrades | head -30
printf '\nAuth journal access count only\n'; journalctl -u ssh --since '7 days ago' --no-pager -q 2>/dev/null | wc -l
printf '\nApplication health status (no raw logs)\n'; docker stats --no-stream --format '{{.Name}} CPU={{.CPUPerc}} memory={{.MemUsage}}'
printf '\nLog sizes\n'; docker inspect --format '{{.Name}} {{.HostConfig.LogConfig.Type}} {{json .HostConfig.LogConfig.Config}}' owlnest-web owlnest-caddy owlnest-contact-api owlnest-analysis-api
printf '\nService settings permissions\n'; stat -c '%a %U:%G %n' /srv/owlnest/secrets /srv/owlnest/nginx/default.conf /srv/owlnest/caddy/Caddyfile /srv/owlnest/docker-compose.yml
`));
const logs=[];for(const c of containers){const raw=remote(`docker logs --since 168h --tail 20000 ${c} 2>&1`);logs.push({container:c,sampledLines:raw.split('\n').length,errors:(raw.match(/\b(error|fatal|panic|alert|emerg)\b/gi)||[]).length,phpProbeLines:raw.split('\n').filter(l=>/\.php[ ?"/]|phpunit|eval-stdin/.test(l)).length,sensitiveProbeLines:raw.split('\n').filter(l=>/\.env[ ?"]|\.git\/|wp-admin/.test(l)).length,note:'Aggregates only; no IPs, tokens, paths with personal query strings or raw application data exported. Not proof of absence of compromise.'});}save('log-review.json',logs);console.log(logs);
