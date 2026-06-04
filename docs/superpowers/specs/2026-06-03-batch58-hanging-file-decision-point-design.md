# Batch58 Hanging File Story Decision Point Design

## Standing Approval

The standing Plot Sprout goal asks for indefinite, front-loaded, batch-based content generation without turning the app into an unrelated feature pile. Batch58 follows the existing static product-pack pattern and does not add app mechanics, accounts, public posting, uploads, checkout wiring, or unauthenticated mutation endpoints.

## Product

- Title: `Hanging File Story Decision Point Card Pack`
- Slug: `hanging-file-story-decision-point-card-pack`
- Price: `$89`
- Batch id: `2026-06-03-batch58`
- Route: `/hanging-file-story-decision-point-card-pack/`
- Checkout state: pending, mailto-only CTA

Batch58 is an adult-led printable pack for private paper writing sessions. The writing skill is decision-point planning: each card helps a writer name one fictional character choice, two possible paths, one clue to compare, one chosen path, one consequence note, and one hanging-file label. The pack should feel like a paper-file planning aid, not a game, grade, portfolio, publishing workflow, diary, or account-based product.

## Selected Approach

Use the established Batch52-Batch57 architecture.

The alternatives considered were:

- Add a new interactive branching-story tool. This would add product surface area and increase safety/maintenance risk.
- Build a generic "choose your own adventure" pack. This would invite episode/book/publishing language and drift away from offline printable writing.
- Build the next premium static card pack. This keeps the product family coherent and lets existing validators, renderers, image generation, artifact build, review, deploy, and live-smoke patterns carry the work.

The selected approach is the third option.

## Content Contract

Create three card lane files plus one tools lane:

- `content/product-artifacts/lanes/batch58-hanging-file-decision-point-cards-a.json`
- `content/product-artifacts/lanes/batch58-hanging-file-decision-point-cards-b.json`
- `content/product-artifacts/lanes/batch58-hanging-file-decision-point-cards-c.json`
- `content/product-artifacts/lanes/batch58-hanging-file-decision-point-tools.json`

Cards use this field order:

`id`, `title`, `worldSlug`, `ageBand`, `decisionSkill`, `useCase`, `adultSetup`, `kidDirection`, `choicePrompt`, `pathOnePrompt`, `pathTwoPrompt`, `compareCluePrompt`, `chosenPathPrompt`, `consequenceNotePrompt`, `fileLabelPrompt`, `quietOptionLine`, `takeHomeLine`.

Tools use:

`adultGuide`, `decisionPointRoutines`, `takeHomeDecisionSlips`, `optionalAdultPrompts`.

The source file `content/product-artifacts/hanging-file-story-decision-point-card-pack.json` combines the lanes into 16 cards, 6 routines, 10 take-home decision slips, and 8 optional adult prompts.

## World Set

Use these 16 worlds in this order:

1. `acorn-avenue-errand-office`
2. `button-bakery-map-mixup`
3. `mitten-market-lost-ticket`
4. `penny-path-compass-shop`
5. `spoon-ferry-lunchbox-harbor`
6. `compost-clock-workshop`
7. `orchard-pulley-post`
8. `pantry-measurement-mystery`
9. `pond-bridge-blueprint-club`
10. `tidepool-timekeepers-lab`
11. `almost-invention-workshop`
12. `appendix-archive-lab`
13. `blue-pencil-observatory`
14. `clue-label-tower-museum`
15. `margin-note-market`
16. `revision-river-ferry`

This set overlaps Batch53, Batch54, Batch55, Batch56, and Batch57 in exactly 7 worlds each.

## Safety Constraints

Batch58 must stay family-friendly and offline:

- No violence, horror, weapons, bullying, romance, politics, religion, gambling, branded characters, or ads targeted to children.
- No real school/home identity details, real addresses, real routes, public posting, accounts, uploads, child profiles, private diary-style disclosures, camera/photo/audio/video/voice-memo flows, or child data collection.
- No grading, scores, timers, rubrics, assessments, spelling grades, perfection pressure, portfolio/showcase/display/publishing pressure, or online sharing.
- No food/allergy/medical advice and no standalone `food`, `address`, or `public` terms.
- Avoid provider/payment terms in generated artifacts and review-facing metadata. Checkout remains pending.
- Avoid branching-story marketing terms such as `episode`, `chapter book`, `screenplay`, `choose your own adventure`, and `publishable`.

## Artifacts And UI

Build the same asset stack as the prior premium packs:

- Local SDXL product image at `public/images/plotsprout/batch58/hanging-file-story-decision-point-card-pack.jpg`
- WebP companion at `public/images/plotsprout/batch58/hanging-file-story-decision-point-card-pack.webp`
- Image sidecar at `content/image-runs/batch58/hanging-file-story-decision-point-card-pack.json`
- Image queue at `content/image-queue/2026-06-03-batch58-images.json`
- Static route at `public/hanging-file-story-decision-point-card-pack/index.html`
- PDF/source HTML/README/manifest/ZIP under `product-build/hanging-file-story-decision-point-card-pack/`

The product should appear on the homepage product shelf through `src/storyData.ts`, with tests confirming title, slug, price, and link.

## Verification

Required checks:

- RED focused tests fail before implementation.
- Focused Batch58 tests pass after implementation.
- `npm run verify:content` passes with updated counts.
- Full `npm run verify` passes.
- Local Playwright desktop and mobile smoke checks pass for homepage and Batch58 route, including console/page errors and image loading.
- Content/artifact and code/static reviews approve before merge.
- GitHub Actions Deploy succeeds after pushing `main`.
- Live GitHub Pages desktop/mobile smoke passes, and live Batch58 JPEG bytes match the committed file.
