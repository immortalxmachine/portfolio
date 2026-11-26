# Auto-update: refresh the site the moment you push

The portfolio reads projects live from GitHub with hourly ISR. To make a change
appear **within seconds** instead of waiting up to an hour, each project repo can
ping the portfolio's on-demand revalidation endpoint on every push.

## 1. One-time setup (per project repo)

Add two **repository secrets** (Settings → Secrets and variables → Actions) to
each repo tagged `portfolio`:

| Secret | Value |
| --- | --- |
| `PORTFOLIO_REVALIDATE_URL` | `https://YOUR-SITE.vercel.app/api/revalidate` |
| `REVALIDATE_SECRET` | the same value set as `REVALIDATE_SECRET` in Vercel |

## 2. Add the workflow

Copy [`notify-portfolio.yml`](./notify-portfolio.yml) into the repo at
`.github/workflows/notify-portfolio.yml`:

```yaml
name: Notify portfolio

on:
  push:
    branches: [main]

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Ping portfolio revalidation
        run: |
          if [ -z "${{ secrets.PORTFOLIO_REVALIDATE_URL }}" ] || [ -z "${{ secrets.REVALIDATE_SECRET }}" ]; then
            echo "Secrets not set — skipping."
            exit 0
          fi
          curl -fsS -X POST "${{ secrets.PORTFOLIO_REVALIDATE_URL }}?secret=${{ secrets.REVALIDATE_SECRET }}"
          echo "Portfolio notified."
```

That's it. On every push to `main`, the workflow calls
`POST /api/revalidate?secret=…`, which runs `revalidateTag("projects")` and the
site serves fresh data on the next request.

## Safety net

The portfolio repo itself runs [`revalidate.yml`](../.github/workflows/revalidate.yml)
once a day, so data never goes more than ~24h stale even without the per-repo
workflow. ISR (`revalidate = 3600`) is a second safety net.

## Manual trigger

```bash
curl -X POST "https://YOUR-SITE.vercel.app/api/revalidate?secret=YOUR_SECRET"
# → {"revalidated":true,"tag":"projects","now":...}
```
