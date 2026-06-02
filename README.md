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
npm run image:batch10
npm run image:batch11
npm run image:batch13
npm run image:batch14
npm run image:batch15
npm run image:batch16
npm run image:batch17
npm run image:batch18
npm run image:batch19
npm run image:batch20
npm run image:batch21
npm run image:batch22
npm run image:batch23
npm run image:batch24
```

## Build Product Artifacts

Builds provider-upload-ready PDF, source HTML, manifest, and ZIP files. These are local/manual product-build steps and must not be scheduled in GitHub Actions.

```bash
npm run product:rainy-day-pack
npm run product:homeschool-season-bundle
npm run product:classroom-license-pack
npm run product:birthday-party-kit
npm run product:road-trip-pack
npm run product:waiting-room-pack
npm run product:library-story-club-kit
npm run product:substitute-teacher-pack
npm run product:tutoring-center-pack
npm run product:summer-camp-kit
npm run product:after-school-club-kit
npm run product:museum-day-kit
npm run product:family-game-night-deck
npm run product:grandparent-visit-kit
npm run product:thank-you-postcard-pack
npm run product:nature-walk-kit
npm run product:backyard-seed-kit
```

## Safety

- No child accounts.
- No public publishing.
- No unauthenticated mutation endpoints.
- No cloud image generation unless Sam approves it.
