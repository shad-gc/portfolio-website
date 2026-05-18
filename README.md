# portfolio-website

personal portfolio site at `rashadhussain.com` and `www.rashadhussain.com`. node/express serving static assets, deployed to cloud run, fronted by cloudflare. cyberpunk-terminal theme.

mostly an infrastructure exercise: keyless ci/cd from github to gcp, edge hardening at cloudflare, real email-spoof defenses on a domain that sends no email.

## live

- https://rashadhussain.com
- https://www.rashadhussain.com (redirects to apex)

## stack

- node 20 / express + helmet
- docker (multi-stage, digest-pinned `node:20-alpine`, non-root)
- cloud run v2 (us-west1)
- artifact registry (docker, regional)
- github actions + workload identity federation (no sa keys)
- cloudflare (dns, proxy, waf, hsts at edge)

## architecture

```
visitor
   │
   ▼
rashadhussain.com / www  (cloudflare dns, proxied)
   │
   ▼
cloudflare edge: tls, waf (default sensitivity), hsts injection, robots.txt intercept
   │
   ▼
cloud run v2 service: portfolio (us-west1)
   │   express + helmet
   │   csp locked to self + google fonts host, no inline scripts/styles
   │   frame-ancestors 'none'
   │
   └── static assets from /public
```

## deploy flow

every push to `main` triggers `.github/workflows/deploy.yml`:

1. checkout
2. authenticate to gcp via wif (`google-github-actions/auth@v2`)
3. `docker buildx` build for `linux/amd64` from digest-pinned base
4. push to artifact registry, tagged with commit sha
5. `gcloud run deploy` with the new image
6. traffic shifts to the new revision

no service account keys anywhere. the deployer service account is bound to wif and scoped by attribute condition to `assertion.repository=='shad-gc/portfolio-website'`.

## security posture

| layer | control |
|---|---|
| express | helmet with custom csp (self + google fonts only, no inline) |
| express | `x-powered-by` disabled |
| express | frame-ancestors 'none' |
| origin | hsts: `max-age=31536000; includeSubDomains; preload` (phase 2) |
| origin | robots.txt blocks llm training crawlers (gptbot, ccbot, claudebot, perplexitybot, etc.) |
| cloudflare | edge tls + waf managed rules at default sensitivity |
| cloudflare | hsts at edge, preload-eligible |
| dns | spf `-all`, dmarc `p=reject`, null mx, dkim wildcard null, caa pinned |
| dns | tls-rpt live |

last pentest: 2026-05-17, passed for intended threat model (public static site, no auth, no api). evidence kept locally.

## local development

```bash
npm install
npm start
# http://localhost:8080
```

## docker (local)

```bash
docker build -t portfolio-site .
docker run -p 8080:8080 portfolio-site
```

## related

- knowledgebase: [shad-gc/runbook](https://github.com/shad-gc/runbook) — adrs, runbooks, dns/gcp/github state
- dns state: [runbook/infrastructure/dns-state.md](https://github.com/shad-gc/runbook/blob/main/infrastructure/dns-state.md)
- generic deploy pattern: [runbook/runbooks/deploy-cloudrun-app.md](https://github.com/shad-gc/runbook/blob/main/runbooks/deploy-cloudrun-app.md)
- companion repos: [shad-gc/trapdoor](https://github.com/shad-gc/trapdoor), [shad-gc/shad-home](https://github.com/shad-gc/shad-home)

## author

rashad h. — cloud / devops / systems
