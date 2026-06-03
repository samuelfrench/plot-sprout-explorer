# Batch57 Pocket Folder Story Goal Path Design

## Standing Approval

The standing Plot Sprout goal asks for indefinite, front-loaded, batch-based content generation without turning the app into an unrelated feature pile. Batch57 follows the existing static product-pack pattern and does not add app mechanics, accounts, public posting, uploads, checkout wiring, or unauthenticated mutation endpoints.

## Product

- Title: `Pocket Folder Story Goal Path Card Pack`
- Slug: `pocket-folder-story-goal-path-card-pack`
- Price: `$87`
- Batch id: `2026-06-03-batch57`
- Route: `/pocket-folder-story-goal-path-card-pack/`
- Checkout state: pending, mailto-only CTA

Batch57 is an adult-led printable pack for private paper writing sessions. The writing skill is goal progression: each card helps a writer name one fictional character want, one small snag, one first try, one rethink, one finish note, and one pocket label. The pack should feel like a paper-folder planning aid, not a game, grade, portfolio, publishing workflow, diary, or account-based product.

## Selected Approach

Use the established Batch52-Batch56 architecture.

The alternatives considered were:

- Add a new interactive goal-path tool. This would add product surface area and increase safety/maintenance risk.
- Build a smaller one-off printable. This would break the premium card-pack sequence and reduce reuse of validators/builders.
- Build the next premium static card pack. This keeps the product family coherent and lets existing validators, renderers, image generation, artifact build, review, deploy, and live-smoke patterns carry the work.

The selected approach is the third option.

## Content Contract

Create three card lane files plus one tools lane:

- `content/product-artifacts/lanes/batch57-pocket-folder-goal-path-cards-a.json`
- `content/product-artifacts/lanes/batch57-pocket-folder-goal-path-cards-b.json`
- `content/product-artifacts/lanes/batch57-pocket-folder-goal-path-cards-c.json`
- `content/product-artifacts/lanes/batch57-pocket-folder-goal-path-tools.json`

Cards use this field order:

`id`, `title`, `worldSlug`, `ageBand`, `goalSkill`, `useCase`, `adultSetup`, `kidDirection`, `wantPrompt`, `snagPrompt`, `firstTryPrompt`, `rethinkPrompt`, `finishNotePrompt`, `pocketLabelPrompt`, `quietOptionLine`, `takeHomeLine`.

Tools use:

`adultGuide`, `goalPathRoutines`, `takeHomeGoalSlips`, `optionalAdultPrompts`.

The source file `content/product-artifacts/pocket-folder-story-goal-path-card-pack.json` combines the lanes into 16 cards, 6 routines, 10 take-home goal slips, and 8 optional adult prompts.

## World Set

Use these 16 worlds in this order:

1. `acorn-avenue-errand-office`
2. `pocket-park-notice-board`
3. `mitten-market-lost-ticket`
4. `penny-path-compass-shop`
5. `rain-boot-route-rangers`
6. `greenhouse-gear-garden`
7. `moss-message-observatory`
8. `rain-gauge-railway`
9. `pond-bridge-blueprint-club`
10. `compost-clock-workshop`
11. `chapter-gate-greenhouse`
12. `binding-day-boardwalk`
13. `blue-pencil-observatory`
14. `index-card-theater-club`
15. `compass-craft-academy`
16. `almost-invention-workshop`

This set overlaps Batch52, Batch53, Batch54, Batch55, and Batch56 in exactly 7 worlds each.

## Safety Constraints

Batch57 must stay family-friendly and offline:

- No violence, horror, weapons, bullying, romance, politics, religion, gambling, branded characters, or ads targeted to children.
- No real school/home identity details, real addresses, real routes, public posting, accounts, uploads, child profiles, private diary-style disclosures, camera/photo/audio/video/voice-memo flows, or child data collection.
- No grading, scores, timers, rubrics, assessments, spelling grades, perfection pressure, portfolio/showcase/display/publishing pressure, or online sharing.
- No food/allergy/medical advice and no standalone `food`, `address`, or `public` terms.
- Avoid provider/payment terms in generated artifacts and review-facing metadata. Checkout remains pending.

## Artifacts And UI

Build the same asset stack as the prior premium packs:

- Local SDXL product image at `public/images/plotsprout/batch57/pocket-folder-story-goal-path-card-pack.jpg`
- WebP companion at `public/images/plotsprout/batch57/pocket-folder-story-goal-path-card-pack.webp`
- Image sidecar at `content/image-runs/batch57/pocket-folder-story-goal-path-card-pack.json`
- Image queue at `content/image-queue/2026-06-03-batch57-images.json`
- Static route at `public/pocket-folder-story-goal-path-card-pack/index.html`
- PDF/source HTML/README/manifest/ZIP under `product-build/pocket-folder-story-goal-path-card-pack/`

The product should appear on the homepage product shelf through `src/storyData.ts`, with tests confirming title, slug, price, and link.

## Verification

Required checks:

- RED focused tests fail before implementation.
- Focused Batch57 tests pass after implementation.
- `npm run verify:content` passes with updated counts.
- Full `npm run verify` passes.
- Local Playwright desktop and mobile smoke checks pass for homepage and Batch57 route, including console/page errors and image loading.
- Content/artifact and code/static reviews approve before merge.
- GitHub Actions Deploy succeeds after pushing `main`.
- Live GitHub Pages desktop/mobile smoke passes, and live Batch57 JPEG bytes match the committed file.
