# Deployment Guide

## Deploy Frontend to Netlify

### Option 1: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy from project root
netlify deploy --prod --dir=frontend
```

### Option 2: Git-based Deployment

1. Push your code to GitHub/GitLab/Bitbucket
2. Log in to https://app.netlify.com
3. Click **Add new site** → **Import an existing project**
4. Connect your Git repository
5. Configure:
   - **Build command**: `echo 'Static site'`
   - **Publish directory**: `frontend`
6. Click **Deploy site**

### Option 3: Drag & Drop

1. Build the `frontend` folder locally
2. Go to https://app.netlify.com/drop
3. Drag and drop the `frontend` folder

## Environment Variables

Set these in Netlify under **Site settings** → **Environment variables**:

| Variable | Description |
|----------|-------------|
| `N8N_WEBHOOK_URL` | Your n8n webhook URL |
| `SITE_URL` | Your Netlify site URL |

## Custom Domain

1. In Netlify, go to **Site settings** → **Domain management**
2. Click **Add custom domain**
3. Follow the DNS configuration instructions

## Post-Deployment

1. Update `config.js` with your production n8n webhook URL
2. Ensure n8n instance is publicly accessible (or use a tunnel like ngrok for testing)
3. Test the complete flow: Fill form → Webhook → Database → AI → Response

## Production Checklist

- [ ] n8n webhook URL updated in config.js
- [ ] Database connection secured (SSL enforced)
- [ ] HTTPS enabled (Netlify does this automatically)
- [ ] Netlify environment variables set
- [ ] Security headers configured (via netlify.toml)
- [ ] n8n workflow activated and tested
- [ ] Claude API key secured (not exposed in frontend)
- [ ] Form submission tested end-to-end
