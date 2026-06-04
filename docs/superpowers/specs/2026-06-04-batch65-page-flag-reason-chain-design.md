# Batch65 Page Flag Story Reason Chain Design

## Standing Approval

The standing Plot Sprout goal asks for indefinite, front-loaded, batch-based content generation without turning the app into an unrelated feature pile. Batch65 follows the established static product-pack pattern and does not add app mechanics, accounts, public posting, uploads, checkout wiring, scheduled generation, or unauthenticated mutation endpoints.

## Product

- Title: `Page Flag Story Reason Chain Card Pack`
- Slug: `page-flag-story-reason-chain-card-pack`
- Price: `$103`
- Batch id: `2026-06-04-batch65`
- Route: `/page-flag-story-reason-chain-card-pack/`
- Checkout state: pending, mailto-only CTA

Batch65 is an adult-led printable pack for private paper writing sessions. The writing skill is fictional reason-chain writing: each card helps a writer name a small story idea, pick one invented detail, connect it to a reason, add a second support detail, write one reason-chain sentence, and mark a page flag check. The pack should feel like calm paper page flags helping a child connect story thinking, not a real book report, source-citation exercise, grade, review, diary, portfolio, public display, or online sharing flow.

## Selected Approach

Use the established Batch52-Batch64 architecture.

The alternatives considered were:

- Add an interactive reason-chain organizer. This would create new app mechanics and increase safety, privacy, and maintenance risk.
- Build a real-reading response pack. This would invite real titles, real author names, quote extraction, source framing, ratings, reviews, and assessment pressure.
- Build the next premium static card pack. This keeps the product family coherent and lets existing validators, renderers, local image generation, artifact build, review, deploy, and live-smoke patterns carry the work.

The selected approach is the third option.

## Content Contract

Create three card lane files plus one tools lane:

- `content/product-artifacts/lanes/batch65-page-flag-reason-chain-cards-a.json`
- `content/product-artifacts/lanes/batch65-page-flag-reason-chain-cards-b.json`
- `content/product-artifacts/lanes/batch65-page-flag-reason-chain-cards-c.json`
- `content/product-artifacts/lanes/batch65-page-flag-reason-chain-tools.json`

Cards use this field order:

`id`, `title`, `worldSlug`, `ageBand`, `reasonSkill`, `useCase`, `adultSetup`, `kidDirection`, `storyIdeaPrompt`, `firstDetailPrompt`, `firstReasonPrompt`, `secondDetailPrompt`, `becauseBridgePrompt`, `reasonChainSentencePrompt`, `pageFlagCheckPrompt`, `quietOptionLine`, `takeHomeLine`.

Tools use:

`adultGuide`, `reasonChainRoutines`, `takeHomeReasonSlips`, `optionalAdultPrompts`.

The source file `content/product-artifacts/page-flag-story-reason-chain-card-pack.json` combines the lanes into 16 cards, 6 routines, 10 take-home reason slips, and 8 optional adult prompts.

## World Set

Use these 16 worlds in this order:

1. `buttonwood-library-train`
2. `pencil-dragon-academy`
3. `compass-craft-academy`
4. `pantry-measurement-mystery`
5. `paperclip-plaza-parcel-day`
6. `pond-bridge-blueprint-club`
7. `tiny-lantern-reef`
8. `appendix-archive-lab`
9. `blue-pencil-observatory`
10. `chapter-gate-greenhouse`
11. `moss-message-observatory`
12. `pocket-park-notice-board`
13. `rain-boot-route-rangers`
14. `tidepool-timekeepers-lab`
15. `clue-label-tower-museum`
16. `teacup-town-weather-window`

The finite world pool makes a perfectly fresh 16-world product impossible. Batch65 uses a balanced set with product/display ages constrained to 7-11 and validation should enforce overlap counts of 7 with Batch56, 7 with Batch57, 6 with Batch58, 6 with Batch59, 6 with Batch60, 7 with Batch61, 7 with Batch62, 4 with Batch63, and 6 with Batch64.

## Safety Constraints

Batch65 must stay family-friendly and offline:

- No violence, horror, weapons, bullying, romance, politics, religion, gambling, branded characters, or ads targeted to children.
- No real school/home identity details, real addresses, real routes, public posting, accounts, uploads, child profiles, private diary-style disclosures, camera/photo/audio/video/voice-memo flows, or child data collection.
- No grading, scores, timers, rubrics, assessments, spelling grades, perfection pressure, portfolio/showcase/display/publishing pressure, ratings, reviews, real book titles, real author names, real library names, library cards, checkout desks, due dates, fines, call numbers, barcode labels, source citations, quotations from real works, or online sharing.
- No food/allergy/medical advice and no standalone `food`, `address`, `public`, `review`, `rating`, `quote`, `citation`, or `source` terms.
- Avoid provider/payment terms in generated artifacts and review-facing metadata. Checkout remains pending.
- Avoid dramatic-series marketing terms such as `episode`, `chapter book`, `screenplay`, `cliffhanger`, `plot twist`, `choose your own adventure`, and `publishable`.
- Use `story idea`, `first detail`, `first reason`, `second detail`, `because bridge`, `reason-chain sentence`, and `page flag check` language.

## Artifacts And UI

Build the same asset stack as the prior premium packs:

- Local SDXL product image at `public/images/plotsprout/batch65/page-flag-story-reason-chain-card-pack.jpg`
- WebP companion at `public/images/plotsprout/batch65/page-flag-story-reason-chain-card-pack.webp`
- Image sidecar at `content/image-runs/batch65/page-flag-story-reason-chain-card-pack.json`
- Image queue at `content/image-queue/2026-06-04-batch65-images.json`
- Static route at `public/page-flag-story-reason-chain-card-pack/index.html`
- PDF/source HTML/README/manifest/ZIP under `product-build/page-flag-story-reason-chain-card-pack/`

The product should appear on the homepage product shelf through `src/storyData.ts`, with tests confirming title, slug, price, link, and checkout-pending state.

## Verification

Required checks:

- RED focused tests fail before implementation.
- Focused Batch65 tests pass after implementation.
- `npm run verify:content` passes with updated counts.
- Full `npm run verify` passes.
- Local Playwright desktop and mobile smoke checks pass for homepage and Batch65 route, including console/page errors and image loading.
- Content/artifact and code/static reviews approve before merge.
- GitHub Actions Deploy succeeds after pushing `main`.
- Live GitHub Pages desktop/mobile smoke passes, and live Batch65 JPEG bytes match the committed file.
