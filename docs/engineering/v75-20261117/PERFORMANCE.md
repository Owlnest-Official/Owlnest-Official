# Performance

## Measurement contract

Production HTTPS, Windows workstation, Chrome157, 393x852, CPU4x, 150ms latency, 1.6Mbps down / 750kbps up, empty cache/context, three navigations per EN/ZH route. Saved denied consent; analytics/checkout/data endpoints blocked identically. These are synthetic laboratory numbers, not field CWV/INP. Exact request waterfall, LCP candidate, CLS, long tasks and heap are in `evidence/performance-before.json` and the after file when measured.

Separate Lighthouse13.6.0 default-mobile results and Chrome Performance traces are retained. Compare only `lighthouse-baseline-*` with after; the first `lighthouse-before-en.json` pilot used an incorrect block-list syntax and is excluded.

## Confirmed baseline bottlenecks

- Homepage LCP: `IMG#sequence-poster`, responsive 480px WebP around 11KB. Not a 77MB PNG sequence.
- Workstation cold TTFB around 1s includes DNS/TLS/network; VPS loopback HTTPS TTFB 22-29ms. No evidence of one-second server application processing.
- Multiple sequential render-blocking local CSS requests; ZH additionally loads large Google Fonts CSS/subsets. Brand fonts preserved, not substituted.
- 168KB logo used as favicon; now same artwork 3.99KB.
- Existing background anchor pack approximately272KB; scroll controller and full96-frame visual content unchanged. No request for the original77MB PNG set.

## Changes

Contiguous local CSS bundled in original cascade order. Content-addressed filenames allow one-year immutable caching; unversioned JS/CSS revalidate, versioned JS/CSS/media seven days. HTML no-cache. Caddy keeps existing zstd/gzip. No private response cache. Original CSS preserved with reversible source metadata; `node scripts/bundle-public-css.cjs --check` verifies reproducibility.

## Baseline medians (seconds)

| Route | EN | ZH |
|---|---:|---:|
| Home | 2.588 | 3.248 |
| Products | 2.992 | 3.160 |
| Lume | 3.036 | 3.808 |
| About | 3.112 | 3.784 |
| Lab | 2.556 | 2.956 |
| Program | 2.524 | 2.632 |

After-release measurements pending at the pre-commit gate. No improvement percentage claimed yet. Field INP and physical iPhone Safari are NOT TESTED. Good [CWV thresholds](https://web.dev/articles/vitals) remain targets, not an asserted certification.
