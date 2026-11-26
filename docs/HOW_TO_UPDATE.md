# How to update your portfolio

No rebuilds, no code (mostly). Here's the day-to-day.

## ➕ Add a project (the 3-step process)

1. **Create / pick the repo** on GitHub (`immortalxmachine/<repo>`).
2. **(Optional) add a `portfolio.json`** at the repo root to control how it looks:
   ```json
   {
     "title": "My Project",
     "tagline": "One-line summary",
     "category": "AI/ML",
     "highlights": ["Did X, measured Y", "Built Z"],
     "metrics": [{ "label": "accuracy", "value": "93%" }],
     "demo": "https://my-demo.app",
     "featured": true,
     "order": 1
   }
   ```
   Skip it and the site falls back to the repo description, topics, languages and
   `RESUME_BULLETS.md`.
3. **Add the topic:** `gh repo edit immortalxmachine/<repo> --add-topic portfolio`
   (or on github.com: repo → ⚙ next to "About" → Topics).

With the notify workflow it appears within seconds; otherwise within an hour.

## 🙈 Hide a project

Remove the topic: `gh repo edit immortalxmachine/<repo> --remove-topic portfolio`

## ⭐ Feature a project

Set `"featured": true` in its `portfolio.json` (and a low `"order"` to rank it
first). Featured projects sort before the rest.

## 🔗 Add a live demo

Set `"demo": "https://…"` in the repo's `portfolio.json` (or set the repo's
**Website** field — it's used as a fallback).

## ✍️ Update bio, skills, links

Edit [`content/profile.ts`](../content/profile.ts) in this repo and push. The
skill → topic mappings there drive the "hover a skill to highlight projects"
feature.

## 📄 Update your résumé

Replace `public/Adhithyaa_VP_Resume.pdf` and push.

## 🖼️ Update your photo

Add/replace `public/photo.jpg` and push. If it's missing, the hero shows an "AV"
monogram automatically — no code change needed either way.

## 🎨 Categories

Use one of: `AI/ML`, `Data`, `GenAI`, `Software`. If you don't set one, it's
inferred from the repo's topics/languages.
