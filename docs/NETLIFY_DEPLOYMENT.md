# Netlify Deployment

This document describes the Netlify deployment setup for the Lords of Estraven game UI.

## Overview

The game UI is automatically deployed to Netlify through GitHub Actions:

- **Production deployments**: Triggered on push to the `main` branch
- **Preview deployments**: Triggered on pull requests to `main` or `develop` branches

## Setup Requirements

To enable Netlify deployments, the following GitHub repository secrets must be configured:

1. **NETLIFY_AUTH_TOKEN**: Your Netlify personal access token
   - Get this from: Netlify Dashboard → User Settings → Applications → Personal access tokens
   
2. **NETLIFY_SITE_ID**: Your Netlify site ID
   - Get this from: Netlify Dashboard → Site Settings → General → Site details → Site ID

### Setting up GitHub Secrets

1. Go to your GitHub repository
2. Navigate to: Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add both `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID`

## Configuration Files

### netlify.toml

The `netlify.toml` file at the repository root contains:

- Build command: `pnpm install --frozen-lockfile && pnpm nx build game-ui`
- Publish directory: `dist/apps/game-ui`
- Node.js version: 20
- pnpm version: 10
- SPA redirect rules for React Router
- Security headers (X-Frame-Options, X-XSS-Protection, etc.)
- Cache headers for static assets

### .github/workflows/netlify-deploy.yml

The GitHub Actions workflow handles:

- Installing dependencies with pnpm
- Building the game-ui project
- Deploying to Netlify using the `nwtgck/actions-netlify` action
- Creating preview deployments for PRs with unique URLs
- Adding deployment comments to PRs

## Deployment Behavior

### Production Deployments

When code is pushed to the `main` branch:
- Workflow runs automatically
- Game UI is built and deployed to the production Netlify site
- Deployment status is visible in GitHub Actions

### Preview Deployments (PRs)

When a pull request is opened or updated:
- Workflow runs automatically
- Game UI is built and deployed to a unique preview URL
- Preview URL is posted as a comment on the PR
- Each PR gets a consistent preview URL based on its number
- Ideal for testing and reviewing UI changes before merging

## Manual Deployment

If needed, you can manually trigger deployments:

1. From Netlify Dashboard:
   - Select your site
   - Go to Deploys
   - Click "Trigger deploy" → "Deploy site"

2. Using Netlify CLI (if installed):
   ```bash
   pnpm nx build game-ui
   netlify deploy --prod --dir=dist/apps/game-ui
   ```

## Troubleshooting

### Deployment Fails

1. Check GitHub Actions logs for error messages
2. Verify secrets are correctly set in GitHub
3. Ensure build completes successfully locally:
   ```bash
   pnpm install --frozen-lockfile
   pnpm nx build game-ui
   ```

### Site Not Loading

1. Check Netlify deploy logs
2. Verify `netlify.toml` configuration
3. Check browser console for errors
4. Verify SPA redirect rules are working

### Preview Deployment Not Showing

1. Check if PR is targeting `main` or `develop` branch
2. Verify GitHub Actions workflow completed successfully
3. Check for bot comments on the PR with deployment URL

## Local Testing

To test the production build locally:

```bash
# Build the app
pnpm nx build game-ui

# Preview the build (using Vite's preview server)
pnpm nx preview game-ui
```

Or use Netlify CLI:

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Test with Netlify Dev
netlify dev

# Or preview a deploy
pnpm nx build game-ui
netlify deploy --dir=dist/apps/game-ui
```

## Monitoring

- View deployment status in GitHub Actions
- Monitor site performance in Netlify Dashboard
- Check Netlify Analytics for usage metrics (if enabled)

## Further Reading

- [Netlify Documentation](https://docs.netlify.com/)
- [nwtgck/actions-netlify GitHub Action](https://github.com/nwtgck/actions-netlify)
- [Nx Build Documentation](https://nx.dev/recipes/vite/configure-vite)
