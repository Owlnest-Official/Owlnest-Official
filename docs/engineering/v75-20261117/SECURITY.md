# Security review

## Findings and action

| Area | Status | Evidence / action |
|---|---|---|
| PHP host and four containers | PASS | No installed PHP executable/package/runtime or PHP proxy upstream. dpkg `php-crypt-gpg un` is not installed. No PHP installed or unnecessary php.ini change made. |
| Public internal files | PASS, contained | HEAD previously returned 200 for AGENTS, brand docs, server source, config manifest and build scripts. Early Nginx deny rules now return 404; suffix/location bypass tested. No private key was found in the scoped build scan. |
| Application source / credentials | PASS within scan scope | Current public-manifest text scanned for high-confidence private-key/token signatures; no match. Not an exhaustive Git-history or secret-provider audit. Existing public client identifiers not mistaken for private keys. |
| SSH | PARTIAL | Existing key login works; readable config disables root/password/keyboard-interactive. No SSH changes. Effective `sshd -T` and privileged authentication logs need authenticated sudo. |
| Firewall | BLOCKED | Safe socket inventory shows external 22/80/443 only, API and Caddy admin internal. Effective firewall rules require sudo; not inferred from sockets alone. |
| OS | PARTIAL | Ubuntu 26.04, unattended security updates active. Running kernel 7.0.0-28; newer installed kernel and reboot-required marker. No blind upgrades or reboot. |
| Runtime | TESTED, rollout recorded separately | Node20 EOL replaced in Dockerfiles by pinned Node24.22.3. Nginx1.30.6/Caddy2.11.9 tested against actual config. No application logic changed. |
| Secrets | PASS within readable scope | Existing secret directory 700 root, service secret mounts read-only. Values not printed, committed or rotated. |
| Logs / intrusion assessment | LIMITED | Seven-day bounded logs contain common PHP/sensitive-path probes. Only aggregates retained. No clear compromise demonstrated in accessible service data; insufficient access to exclude intrusion. |
| Recovery | PASS scoped | Services restart unless-stopped; bounded Docker logs; actual archive/extraction checks. Failed cloud-init-hotplugd predates this release and remains open. |

## Authoritative references

- [PHP 2026 announcements](https://www.php.net/archive/2026.php): October CVEs and upload-progress mitigation are not directly applicable without PHP runtime.
- [Node lifecycle](https://nodejs.org/en/about/eol) and [November security release](https://nodejs.org/en/blog/vulnerability/november-2026-security-releases/).
- [Nginx advisories](https://nginx.org/en/security_advisories.html): patch latest stable; not every conditional advisory is claimed exploitable in this topology.
- [Caddy 2.11.9](https://github.com/caddyserver/caddy/releases/tag/v2.11.9) and [proxy header advisory](https://github.com/caddyserver/caddy/security/advisories/GHSA-8qx7-j2v2-x6q5).
- [Ubuntu security notices](https://ubuntu.com/security/notices): remaining package/kernel review requires maintenance access.

No host-root Docker mount, privilege workaround, firewall rewrite, secret rotation, API prompt change or data-collection activation was used. See OPEN_ITEMS.md; P0 must not be marked globally complete.
