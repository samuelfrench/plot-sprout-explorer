# Batch61 Card Catalog Story Retell Design

## Standing Approval

The standing Plot Sprout goal asks for indefinite, front-loaded, batch-based content generation without turning the app into an unrelated feature pile. Batch61 follows the existing static product-pack pattern and does not add app mechanics, accounts, public posting, uploads, checkout wiring, or unauthenticated mutation endpoints.

## Product

- Title: `Card Catalog Story Retell Card Pack`
- Slug: `card-catalog-story-retell-card-pack`
- Price: `$95`
- Batch id: `2026-06-04-batch61`
- Route: `/card-catalog-story-retell-card-pack/`
- Checkout state: pending, mailto-only CTA

Batch61 is an adult-led printable pack for private paper writing sessions. The writing skill is fictional retelling: each card helps a writer name one beginning snapshot, middle clue, turning choice, ending answer, favorite detail, next retell prompt, and card catalog label. The pack should feel like a calm paper library aid, not a grade, portfolio, publishing workflow, diary, online sharing flow, or account-based product.

## Selected Approach

Use the established Batch52-Batch60 architecture.

The alternatives considered were:

- Add an interactive retell builder. This would create new app mechanics and increase safety, privacy, and maintenance risk.
- Build a reflection or review pack. This could invite private diary disclosures, real book titles, ratings, or public-review language.
- Build the next premium static card pack. This keeps the product family coherent and lets existing validators, renderers, local image generation, artifact build, review, deploy, and live-smoke patterns carry the work.

The selected approach is the third option.

## Content Contract

Create three card lane files plus one tools lane:

- `content/product-artifacts/lanes/batch61-card-catalog-retell-cards-a.json`
- `content/product-artifacts/lanes/batch61-card-catalog-retell-cards-b.json`
- `content/product-artifacts/lanes/batch61-card-catalog-retell-cards-c.json`
- `content/product-artifacts/lanes/batch61-card-catalog-retell-tools.json`

Cards use this field order:

`id`, `title`, `worldSlug`, `ageBand`, `retellSkill`, `useCase`, `adultSetup`, `kidDirection`, `beginningSnapshotPrompt`, `middleCluePrompt`, `turningChoicePrompt`, `endingAnswerPrompt`, `favoriteDetailPrompt`, `nextRetellPrompt`, `cardCatalogLabelPrompt`, `quietOptionLine`, `takeHomeLine`.

Tools use:

`adultGuide`, `retellRoutines`, `takeHomeRetellSlips`, `optionalAdultPrompts`.

The source file `content/product-artifacts/card-catalog-story-retell-card-pack.json` combines the lanes into 16 cards, 6 routines, 10 take-home retell slips, and 8 optional adult prompts.

## World Set

Use these 16 worlds in this order:

1. `puddle-planet-post-office`
2. `buttonwood-library-train`
3. `cloudberry-clocktower`
4. `tiny-lantern-reef`
5. `acorn-avenue-errand-office`
6. `pocket-park-notice-board`
7. `penny-path-compass-shop`
8. `orchard-pulley-post`
9. `pond-bridge-blueprint-club`
10. `revision-river-ferry`
11. `chapter-gate-greenhouse`
12. `margin-note-market`
13. `blue-pencil-observatory`
14. `binding-day-boardwalk`
15. `sticker-station-mail-cart`
16. `paperclip-plaza-parcel-day`

The finite world pool makes a perfectly fresh 16-world product impossible. Batch61 gives most recent Batch60 worlds a rest while avoiding academy, route, lunchbox, pantry, and picnic/oven world slugs. Validation should enforce overlap counts of 8 with Batch56, 7 with Batch57, 7 with Batch58, 8 with Batch59, and 2 with Batch60.

## Safety Constraints

Batch61 must stay family-friendly and offline:

- No violence, horror, weapons, bullying, romance, politics, religion, gambling, branded characters, or ads targeted to children.
- No real school/home identity details, real addresses, real routes, public posting, accounts, uploads, child profiles, private diary-style disclosures, camera/photo/audio/video/voice-memo flows, or child data collection.
- No grading, scores, timers, rubrics, assessments, spelling grades, perfection pressure, portfolio/showcase/display/publishing pressure, ratings, reviews, real book titles, real author names, or online sharing.
- No food/allergy/medical advice and no standalone `food`, `address`, `public`, `review`, or `rating` terms.
- Avoid provider/payment terms in generated artifacts and review-facing metadata. Checkout remains pending.
- Avoid dramatic-series marketing terms such as `episode`, `chapter book`, `screenplay`, `cliffhanger`, `plot twist`, `choose your own adventure`, and `publishable`.
- Use `retell`, `beginning snapshot`, `middle clue`, `turning choice`, `ending answer`, `favorite detail`, `next retell prompt`, and `card catalog label` language.

## Artifacts And UI

Build the same asset stack as the prior premium packs:

- Local SDXL product image at `public/images/plotsprout/batch61/card-catalog-story-retell-card-pack.jpg`
- WebP companion at `public/images/plotsprout/batch61/card-catalog-story-retell-card-pack.webp`
- Image sidecar at `content/image-runs/batch61/card-catalog-story-retell-card-pack.json`
- Image queue at `content/image-queue/2026-06-04-batch61-images.json`
- Static route at `public/card-catalog-story-retell-card-pack/index.html`
- PDF/source HTML/README/manifest/ZIP under `product-build/card-catalog-story-retell-card-pack/`

The product should appear on the homepage product shelf through `src/storyData.ts`, with tests confirming title, slug, price, and link.

## Verification

Required checks:

- RED focused tests fail before implementation.
- Focused Batch61 tests pass after implementation.
- `npm run verify:content` passes with updated counts.
- Full `npm run verify` passes.
- Local Playwright desktop and mobile smoke checks pass for homepage and Batch61 route, including console/page errors and image loading.
- Content/artifact and code/static reviews approve before merge.
- GitHub Actions Deploy succeeds after pushing `main`.
- Live GitHub Pages desktop/mobile smoke passes, and live Batch61 JPEG bytes match the committed file.
