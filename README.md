# keagan.ai

Personal portfolio site. Built with [Astro](https://astro.build), hosted on Cloudflare Pages.

## Stack

- Astro 6 (static output)
- Vanilla CSS (no framework)
- GitHub Actions for CI/CD

## Development

```sh
npm install
npm run dev       # localhost:4321
npm run build     # outputs to ./dist
npm run preview   # preview the build
```

## Deployment

Deployed automatically on push to `main` via GitHub Actions → Cloudflare Pages.

### First-time setup

Add these secrets to the GitHub repo (Settings → Secrets → Actions):

- `CLOUDFLARE_API_TOKEN` — needs Pages:Edit permission
- `CLOUDFLARE_ACCOUNT_ID` — your CF account ID

Then create the Pages project in Cloudflare dashboard or via `wrangler pages project create keagan-ai`.

### Custom domain

Once the Pages project is created, point `keagan.ai` → the `keagan-ai.pages.dev` subdomain via a CNAME record in Cloudflare DNS.
