# Redirect and attribution preservation

Nginx is production routing authority; `_redirects` is historical fallback and untouched. Caddy HTTP→HTTPS / www canonical configuration is preserved.

`scripts/generate-vps-nginx.cjs` consumes the existing route contract and explicit existing utility aliases. Original `$request_uri` mapping avoids internal index rewrite loops. `$is_args$args` preserves encoded original query bytes. `absolute_redirect off` prevents TLS-terminated Nginx from sending an HTTP absolute location.

PASS: isolated Nginx1.30.6, all63 contract redirects to expected destinations then200, seven sensitive-path guards, six referral cases; encoded UTM/gclid/fbclid/ttclid, existing `ref` and `discount` preserved. External `next` remains inert query data, never a redirect target.

`/r/<existing slug>` preserves the legacy path-authoritative ref behavior; conflicting single ref removed rather than duplicated. Multiple ambiguous ref keys on this shorthand path return400; standard public routes preserve valid query strings unchanged. Existing QR default UTMs apply only when no query supplied.

Live verification after configuration activation is required and will be appended. No canonical/hreflang/SEO identity, referral JavaScript, discount rules or account routes changed.
