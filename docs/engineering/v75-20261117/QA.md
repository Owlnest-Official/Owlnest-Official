# V7.5 QA

## Pre-release results

| Test | Status | Evidence |
|---|---|---|
| Clean HEAD archive + explicit approved overlays | PASS |651files,214,280,528bytes; case-sensitive manifest validation; no dirty typography overlay. |
| CSS regeneration check | PASS |17bundles; idempotent; original cascade retained. |
| Protected source hashes | PASS |Pre-existing dirty files unchanged; seven runtime/business sources unchanged; all34page bodies/inline scripts/canonical unchanged. |
| Browser matrix | PASS after harness correction |34routes ×4widths ×Chromium/Firefox/WebKit =408route cases, plus6reduce/failure cases. |
| Hero | PASS simulated |Forward/reverse target mapping, stationary target, bounded decode cache, reduce toggle/prefers-reduced-motion, static poster under frame-network failure. |
| Navigation / prices | PASS |Five main entries, disclosures/Escape/touch and actual language switching; Single49/Duo89 selectors and visible CTA. |
| Research | PASS inactive |Both Program anchors reachable; actual input and submit controls disabled; no request submitted. |
| Checkout-state tests | PASS mocked |Existing8unit tests; real payment and valid discount redemption NOT TESTED. |
| Visual parity | PASS scoped |24fullpage screenshots: Home/Products/Lume/About/Lab/Program, EN/ZH,393/1440; identical dimensions; see visual-comparison JSON. Other routes checked for overflow/assets at four widths. |
| Isolated Nginx | PASS |63redirects,7privacyguards,6referral cases, canonical200; no loop. |
| Isolated API runtime | PASS |Contact11,analysis4 assertions; networknone/fakekeys; no real email/API/model/data. |
| Backup/monitor | PASS scoped |Real archive extraction and checksum comparison; synthetic monitor failure detected; normal monitor passed. |

### Harness correction transparency

The initial run incorrectly required GTM on Evidence, where it was absent in baseline too; tracking preservation now compares baseline presence. This existing gap is not fixed or disguised by V7.5. Another run reported24Program FAILs because Playwright `isDisabled()` on fieldset does not check its disabled property as intended. The real fieldset.disabled, child-input and submit-disabled checks pass24fresh cases across allbrowsers/widths. Original failed outputs retained; no research code altered to make a test pass.

## Limitations

Browser simulation is not physical iPhone Safari. Firefox launch now succeeds with installed official Playwright runtime. External checkout/valid creator discount, real email, research submission, Supabase recovery and fieldINP NOT TESTED. Thirdparty tracking/data blocked during automated navigation to avoid production pollution. Production post-release checks recorded separately; local results are not substituted for live verification.
