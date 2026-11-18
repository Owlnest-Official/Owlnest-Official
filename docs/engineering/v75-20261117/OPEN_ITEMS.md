# Remaining items

| Priority | Status | Required next action |
|---|---|---|
| P0 security closure | BLOCKED |Authenticated sudo session for effective SSH/firewall rules and privileged auth/system journals; preserve logs and examine any indicators. Do not infer clean host from restricted data. |
| P1 kernel / OS maintenance | BLOCKED |Plan maintenance with console recovery and second confirmed SSH session; review installed security packages and reboot-required state. No blind upgrade/reboot performed. |
| P1 external alerts | BLOCKED |Provide approved notification destination/service credentials; local detection already installed. |
| P1 offsite recovery | BLOCKED |Approved encrypted offsite backup destination and retention/data-owner policy. Local restore proven, total VPS loss recovery not. |
| P1 field performance | NOT TESTED |Real-user INP/CWV and physical iPhone Safari; laboratory tests not substitutes. |
| P1 external commerce | NOT TESTED |Live checkout and valid discount redemption not repeated; existing49/89behavior, handlers and mockreturn tests preserved. No Shopify mutation. |
| P2 cloud-init service | OPEN |Investigate old failed cloud-init-hotplugd with root logs; website/API healthy. |
| P2 Evidence tracking parity | OPEN |Evidence pages lacked GTM before V7.5; preserve current tracking scope, separate explicit tracking decision if expansion desired. |
| Existing research activation | NOT TESTED / intentionally inactive |No formal collection/email/database activation; needs original activation checklist and privacy/credential approvals. |
| Supabase recovery | NOT TESTED |External provider/member-data backups not validated or changed. |

None of these statuses means the entire VPS security audit is complete. Release only independently tested changes; any newly found major failure blocks that change or triggers rollback.
