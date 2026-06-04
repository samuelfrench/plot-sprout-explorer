# Batch59 File Box Story Turning Point Design

## Standing Approval

The standing Plot Sprout goal asks for indefinite, front-loaded, batch-based content generation without turning the app into an unrelated feature pile. Batch59 follows the existing static product-pack pattern and does not add app mechanics, accounts, public posting, uploads, checkout wiring, or unauthenticated mutation endpoints.

## Product

- Title: `File Box Story Turning Point Card Pack`
- Slug: `file-box-story-turning-point-card-pack`
- Price: `$91`
- Batch id: `2026-06-04-batch59`
- Route: `/file-box-story-turning-point-card-pack/`
- Checkout state: pending, mailto-only CTA

Batch59 is an adult-led printable pack for private paper writing sessions. The writing skill is turning-point planning: each card helps a writer name one fictional starting scene, one turn signal, one before path, one after path, one character reaction, one next step, and one file-box label. The pack should feel like a paper-file planning aid, not a game, grade, portfolio, publishing workflow, diary, or account-based product.

## Selected Approach

Use the established Batch52-Batch58 architecture.

The alternatives considered were:

- Add an interactive turning-point builder. This would create a new app mechanic and increase safety, privacy, and maintenance risk.
- Build a generic dramatic twist pack. This would invite scary, cliffhanger, episode, and publishing language.
- Build the next premium static card pack. This keeps the product family coherent and lets existing validators, renderers, local image generation, artifact build, review, deploy, and live-smoke patterns carry the work.

The selected approach is the third option.

## Content Contract

Create three card lane files plus one tools lane:

- `content/product-artifacts/lanes/batch59-file-box-turning-point-cards-a.json`
- `content/product-artifacts/lanes/batch59-file-box-turning-point-cards-b.json`
- `content/product-artifacts/lanes/batch59-file-box-turning-point-cards-c.json`
- `content/product-artifacts/lanes/batch59-file-box-turning-point-tools.json`

Cards use this field order:

`id`, `title`, `worldSlug`, `ageBand`, `turningPointSkill`, `useCase`, `adultSetup`, `kidDirection`, `startScenePrompt`, `turnSignalPrompt`, `beforePathPrompt`, `afterPathPrompt`, `characterReactionPrompt`, `nextStepPrompt`, `fileBoxLabelPrompt`, `quietOptionLine`, `takeHomeLine`.

Tools use:

`adultGuide`, `turningPointRoutines`, `takeHomeTurningSlips`, `optionalAdultPrompts`.

The source file `content/product-artifacts/file-box-story-turning-point-card-pack.json` combines the lanes into 16 cards, 6 routines, 10 take-home turning slips, and 8 optional adult prompts.

## World Set

Use these 16 worlds in this order:

1. `acorn-avenue-errand-office`
2. `teacup-town-weather-window`
3. `sticker-station-mail-cart`
4. `spoon-ferry-lunchbox-harbor`
5. `pocket-park-notice-board`
6. `rain-boot-route-rangers`
7. `tidepool-timekeepers-lab`
8. `greenhouse-gear-garden`
9. `solar-oven-picnic-station`
10. `orchard-pulley-post`
11. `revision-river-ferry`
12. `clue-label-tower-museum`
13. `chapter-gate-greenhouse`
14. `margin-note-market`
15. `binding-day-boardwalk`
16. `index-card-theater-club`

The finite 30-world pool makes exact-seven overlap with Batch54-Batch58 impossible. Batch59 therefore uses the nearest strict rule: overlap Batch55, Batch56, Batch57, and Batch58 in exactly 7 worlds each, overlap Batch54 in 8 worlds, and never exceed 8 worlds of overlap with any Batch54-Batch58 pack.

## Safety Constraints

Batch59 must stay family-friendly and offline:

- No violence, horror, weapons, bullying, romance, politics, religion, gambling, branded characters, or ads targeted to children.
- No real school/home identity details, real addresses, real routes, public posting, accounts, uploads, child profiles, private diary-style disclosures, camera/photo/audio/video/voice-memo flows, or child data collection.
- No grading, scores, timers, rubrics, assessments, spelling grades, perfection pressure, portfolio/showcase/display/publishing pressure, or online sharing.
- No food/allergy/medical advice and no standalone `food`, `address`, or `public` terms.
- Avoid provider/payment terms in generated artifacts and review-facing metadata. Checkout remains pending.
- Avoid dramatic-series marketing terms such as `episode`, `chapter book`, `screenplay`, `cliffhanger`, `plot twist`, `choose your own adventure`, and `publishable`.

## Artifacts And UI

Build the same asset stack as the prior premium packs:

- Local SDXL product image at `public/images/plotsprout/batch59/file-box-story-turning-point-card-pack.jpg`
- WebP companion at `public/images/plotsprout/batch59/file-box-story-turning-point-card-pack.webp`
- Image sidecar at `content/image-runs/batch59/file-box-story-turning-point-card-pack.json`
- Image queue at `content/image-queue/2026-06-04-batch59-images.json`
- Static route at `public/file-box-story-turning-point-card-pack/index.html`
- PDF/source HTML/README/manifest/ZIP under `product-build/file-box-story-turning-point-card-pack/`

The product should appear on the homepage product shelf through `src/storyData.ts`, with tests confirming title, slug, price, and link.

## Verification

Required checks:

- RED focused tests fail before implementation.
- Focused Batch59 tests pass after implementation.
- `npm run verify:content` passes with updated counts.
- Full `npm run verify` passes.
- Local Playwright desktop and mobile smoke checks pass for homepage and Batch59 route, including console/page errors and image loading.
- Content/artifact and code/static reviews approve before merge.
- GitHub Actions Deploy succeeds after pushing `main`.
- Live GitHub Pages desktop/mobile smoke passes, and live Batch59 JPEG bytes match the committed file.
