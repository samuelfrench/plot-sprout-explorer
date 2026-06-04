# Batch60 Archive Drawer Story Resolution Design

## Standing Approval

The standing Plot Sprout goal asks for indefinite, front-loaded, batch-based content generation without turning the app into an unrelated feature pile. Batch60 follows the existing static product-pack pattern and does not add app mechanics, accounts, public posting, uploads, checkout wiring, or unauthenticated mutation endpoints.

## Product

- Title: `Archive Drawer Story Resolution Card Pack`
- Slug: `archive-drawer-story-resolution-card-pack`
- Price: `$93`
- Batch id: `2026-06-04-batch60`
- Route: `/archive-drawer-story-resolution-card-pack/`
- Checkout state: pending, mailto-only CTA

Batch60 is an adult-led printable pack for private paper writing sessions. The writing skill is resolution planning: each card helps a writer connect one fictional loose thread, one last choice, one changed feeling, one closing image, one leftover question, one next-story seed, and one archive drawer label. The pack should feel like a calm paper archive aid, not a grade, portfolio, publishing workflow, diary, online sharing flow, or account-based product.

## Selected Approach

Use the established Batch52-Batch59 architecture.

The alternatives considered were:

- Add an interactive resolution builder. This would create new app mechanics and increase safety, privacy, and maintenance risk.
- Build a dramatic ending-twist pack. This would invite cliffhanger, episode, twist, and serial language that prior validators intentionally avoid.
- Build the next premium static card pack. This keeps the product family coherent and lets existing validators, renderers, local image generation, artifact build, review, deploy, and live-smoke patterns carry the work.

The selected approach is the third option.

## Content Contract

Create three card lane files plus one tools lane:

- `content/product-artifacts/lanes/batch60-archive-drawer-resolution-cards-a.json`
- `content/product-artifacts/lanes/batch60-archive-drawer-resolution-cards-b.json`
- `content/product-artifacts/lanes/batch60-archive-drawer-resolution-cards-c.json`
- `content/product-artifacts/lanes/batch60-archive-drawer-resolution-tools.json`

Cards use this field order:

`id`, `title`, `worldSlug`, `ageBand`, `resolutionSkill`, `useCase`, `adultSetup`, `kidDirection`, `looseThreadPrompt`, `lastChoicePrompt`, `changedFeelingPrompt`, `closingImagePrompt`, `leftoverQuestionPrompt`, `nextStorySeedPrompt`, `archiveDrawerLabelPrompt`, `quietOptionLine`, `takeHomeLine`.

Tools use:

`adultGuide`, `resolutionRoutines`, `takeHomeResolutionSlips`, `optionalAdultPrompts`.

The source file `content/product-artifacts/archive-drawer-story-resolution-card-pack.json` combines the lanes into 16 cards, 6 routines, 10 take-home resolution slips, and 8 optional adult prompts.

## World Set

Use these 16 worlds in this order:

1. `teacup-town-weather-window`
2. `mitten-market-lost-ticket`
3. `button-bakery-map-mixup`
4. `paperclip-plaza-parcel-day`
5. `sticker-station-mail-cart`
6. `greenhouse-gear-garden`
7. `moss-message-observatory`
8. `rain-gauge-railway`
9. `seed-library-map-room`
10. `solar-oven-picnic-station`
11. `tidepool-timekeepers-lab`
12. `almost-invention-workshop`
13. `appendix-archive-lab`
14. `clue-label-tower-museum`
15. `compost-clock-workshop`
16. `index-card-theater-club`

The finite world pool makes a perfectly fresh 16-world product impossible. Batch60 therefore uses the nearest strict rule: overlap Batch56, Batch57, Batch58, and Batch59 in exactly 7 worlds each, overlap Batch55 in 8 worlds, and never exceed 8 worlds of overlap with any Batch55-Batch59 pack.

## Safety Constraints

Batch60 must stay family-friendly and offline:

- No violence, horror, weapons, bullying, romance, politics, religion, gambling, branded characters, or ads targeted to children.
- No real school/home identity details, real addresses, real routes, public posting, accounts, uploads, child profiles, private diary-style disclosures, camera/photo/audio/video/voice-memo flows, or child data collection.
- No grading, scores, timers, rubrics, assessments, spelling grades, perfection pressure, portfolio/showcase/display/publishing pressure, or online sharing.
- No food/allergy/medical advice and no standalone `food`, `address`, or `public` terms.
- Avoid provider/payment terms in generated artifacts and review-facing metadata. Checkout remains pending.
- Avoid dramatic-series marketing terms such as `episode`, `chapter book`, `screenplay`, `cliffhanger`, `plot twist`, `choose your own adventure`, and `publishable`.
- Use `resolution`, `loose thread`, `last choice`, `changed feeling`, `closing image`, `leftover question`, `next-story seed`, and `archive drawer label` language.

## Artifacts And UI

Build the same asset stack as the prior premium packs:

- Local SDXL product image at `public/images/plotsprout/batch60/archive-drawer-story-resolution-card-pack.jpg`
- WebP companion at `public/images/plotsprout/batch60/archive-drawer-story-resolution-card-pack.webp`
- Image sidecar at `content/image-runs/batch60/archive-drawer-story-resolution-card-pack.json`
- Image queue at `content/image-queue/2026-06-04-batch60-images.json`
- Static route at `public/archive-drawer-story-resolution-card-pack/index.html`
- PDF/source HTML/README/manifest/ZIP under `product-build/archive-drawer-story-resolution-card-pack/`

The product should appear on the homepage product shelf through `src/storyData.ts`, with tests confirming title, slug, price, and link.

## Verification

Required checks:

- RED focused tests fail before implementation.
- Focused Batch60 tests pass after implementation.
- `npm run verify:content` passes with updated counts.
- Full `npm run verify` passes.
- Local Playwright desktop and mobile smoke checks pass for homepage and Batch60 route, including console/page errors and image loading.
- Content/artifact and code/static reviews approve before merge.
- GitHub Actions Deploy succeeds after pushing `main`.
- Live GitHub Pages desktop/mobile smoke passes, and live Batch60 JPEG bytes match the committed file.
