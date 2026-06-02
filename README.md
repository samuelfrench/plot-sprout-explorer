# Plot Sprout Explorer

Family-friendly creative-writing explorer app for reluctant writers ages 7-11. The wedge is printable story quest kits for parents, homeschool families, and elementary teachers.

## Run

```bash
npm install
npm run dev
```

## Verify

```bash
npm run verify
```

## Deployment

Deployment is configured as a push-triggered GitHub Pages workflow in `.github/workflows/deploy.yml`.

- Runner: `self-hosted`, `Linux`, `X64`
- Trigger: `push` to `main`
- No scheduled workflows
- No GitHub Actions content generation workflows

## Generate Batch Brief

This is manual by design. Do not schedule it in GitHub Actions.

```bash
npm run content:batch
```

## Generate Local Images

Uses local SDXL on the RTX 4090. No cloud image service.

```bash
npm run image:starter -- --only moon-muffin-market
npm run image:batch7
```

## Build Product Artifact

Builds the provider-upload-ready Rainy Day Story Quest Pack PDF, source HTML, manifest, and ZIP. This is a local/manual product-build step and must not be scheduled in GitHub Actions.

```bash
npm run product:rainy-day-pack
```

## Safety

- No child accounts.
- No public publishing.
- No unauthenticated mutation endpoints.
- No cloud image generation unless Sam approves it.
