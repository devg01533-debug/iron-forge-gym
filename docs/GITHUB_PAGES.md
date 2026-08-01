# GitHub Pages Deployment

This project deploys to GitHub Pages. No Netlify, no build step.

## Deploy From A Branch (simplest)

1. Create a GitHub repository for this project.

2. Push the project to the `main` branch:

   ```bash
   git init
   git add .
   git commit -m "Iron Forge Gym - Milestone 1"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

3. In the repo: **Settings → Pages** → **Source: Deploy from a branch** →
   Branch: `main` → Folder: `/ (root)` → **Save**.

4. Your site is live at `https://YOUR_USERNAME.github.io/YOUR_REPO/`.

## Custom Domain (optional)

1. Settings → Pages → Custom domain: enter your domain and save.
2. Add a CNAME record at your DNS provider pointing to
   `YOUR_USERNAME.github.io`.
3. GitHub will auto-create a `CNAME` file in the repo.

## Updating The Site

Every push to `main` triggers a new deployment automatically.

## Important Notes

- All asset paths in the HTML are relative (`style.css`, `assets/js/...`),
  so the site works from any subpath or custom domain.
- The site needs internet access for fonts and Three.js CDNs.
- Set the real webhook URL in `config.js` (Milestone 3) before going live.
