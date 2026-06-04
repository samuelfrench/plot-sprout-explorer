# Batch62 Library Pocket Story Summary Card Pack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the `$97` Library Pocket Story Summary Card Pack as a static checkout-pending Plot Sprout product with source JSON, lane files, local product image, PDF/source/ZIP artifacts, tests, deploy, TODO closeout, and memory update.

**Architecture:** Follow the Batch61 product-pack architecture: three card lane JSON files and one tools lane feed a canonical source JSON file; validators enforce exact schema, safety, lane coverage, world/age alignment, product/catalog alignment, artifact paths, image manifest coverage, and checkout-pending status; a dedicated builder renders deterministic printable HTML/PDF/ZIP artifacts; the existing static renderer publishes the product route from `content/products/batch5-products.json`. Batch62 keeps the product narrow: library pocket summary cards that help a writer privately summarize a fictional story through story start, main action, important change, ending result, keeper detail, summary sentence, and pocket label.

**Tech Stack:** Vite, React, Vitest, Node ESM scripts, Playwright, local RTX4090 SDXL image generation through `scripts/generate_story_images_local.py`.

---

### Task 1: Batch62 Content Contract And Lanes

**Files:**
- Create: `content/product-artifacts/lanes/batch62-library-pocket-summary-cards-a.json`
- Create: `content/product-artifacts/lanes/batch62-library-pocket-summary-cards-b.json`
- Create: `content/product-artifacts/lanes/batch62-library-pocket-summary-cards-c.json`
- Create: `content/product-artifacts/lanes/batch62-library-pocket-summary-tools.json`

- [ ] Write cards 01-06, 07-11, and 12-16.
- [ ] Use fields in this exact order: `id`, `title`, `worldSlug`, `ageBand`, `summarySkill`, `useCase`, `adultSetup`, `kidDirection`, `storyStartPrompt`, `mainActionPrompt`, `importantChangePrompt`, `endingResultPrompt`, `keeperDetailPrompt`, `summarySentencePrompt`, `libraryPocketLabelPrompt`, `quietOptionLine`, and `takeHomeLine`.
- [ ] Use this exact world set in this order: `moon-muffin-market`, `pencil-dragon-academy`, `teacup-town-weather-window`, `mitten-market-lost-ticket`, `rain-boot-route-rangers`, `greenhouse-gear-garden`, `moss-message-observatory`, `rain-gauge-railway`, `compost-clock-workshop`, `seed-library-map-room`, `solar-oven-picnic-station`, `tidepool-timekeepers-lab`, `almost-invention-workshop`, `appendix-archive-lab`, `clue-label-tower-museum`, `index-card-theater-club`.
- [ ] Enforce overlap counts of 6 with Batch56, 8 with Batch57, 6 with Batch58, 7 with Batch59, 13 with Batch60, and 0 with Batch61.
- [ ] Write tools with `adultGuide`, `summaryRoutines`, `takeHomeSummarySlips`, and `optionalAdultPrompts`.
- [ ] Keep every value ASCII, fictional, adult-led, offline, paper-only, and with writable blanks where applicable.
- [ ] Avoid unsafe terms: no grades, scores, timers, uploads, recording, camera/photo/audio/video/voice-memo flow, public posting, accounts, real school/home identity details, private child profiles, diary-style personal disclosures, spelling grades, food/allergy/medical advice, real book titles, real author names, real library names, library cards, checkout desks, due dates, fines, ratings, reviews, or real child data.
- [ ] Avoid publishing/display pressure and assessment language: no `publish`, `publication`, `showcase`, `portfolio`, `display`, `perfect`, `rubric`, `assessment`, `share online`, `episode`, `chapter book`, `screenplay`, `cliffhanger`, `plot twist`, `choose your own adventure`, `publishable`, or provider/payment terms. Use `summary`, `story start`, `main action`, `important change`, `ending result`, `keeper detail`, `summary sentence`, and `library pocket label` language.
- [ ] Validate JSON parse and field order with this command:

```bash
node --input-type=module -e "import { readFileSync } from 'node:fs'; const cardFields=['id','title','worldSlug','ageBand','summarySkill','useCase','adultSetup','kidDirection','storyStartPrompt','mainActionPrompt','importantChangePrompt','endingResultPrompt','keeperDetailPrompt','summarySentencePrompt','libraryPocketLabelPrompt','quietOptionLine','takeHomeLine']; for (const file of ['content/product-artifacts/lanes/batch62-library-pocket-summary-cards-a.json','content/product-artifacts/lanes/batch62-library-pocket-summary-cards-b.json','content/product-artifacts/lanes/batch62-library-pocket-summary-cards-c.json','content/product-artifacts/lanes/batch62-library-pocket-summary-tools.json']) { const parsed=JSON.parse(readFileSync(file, 'utf8')); if (Array.isArray(parsed)) for (const card of parsed) if (JSON.stringify(Object.keys(card)) !== JSON.stringify(cardFields)) throw new Error(file + ' has wrong field order for ' + card.id); } console.log('Batch62 lane JSON parsed with card field order');"
```

- [ ] Commit lane files with message `Add Batch62 library pocket summary lanes`.

### Task 2: RED Tests

**Files:**
- Create: `scripts/library-pocket-story-summary-card-pack-builder.test.mjs`

- [ ] Add failing tests that import nonexistent Batch62 validator and builder exports:
  - `validateLibraryPocketStorySummaryCardPackSource`
  - `validateLibraryPocketStorySummaryCardPackSourceFiles`
  - `buildLibraryPocketStorySummaryCardPack`
  - `renderLibraryPocketStorySummaryCardPackHtml`
- [ ] Assert source schema, exact lane paths, lane range ownership, exact world set, exact Batch56/57/58/59/60/61 overlap counts, banned publishing/portfolio/display/grading/upload/recording/private-data/real-review/rating/library-service terms, standalone `public`/`address`/`food`/`review`/`rating` terms, rendered summary fields, artifact path inspection, deterministic builder output, and committed product checkout-pending state.
- [ ] Add a test that requires the product hero image manifest entry and all card-world local images before final artifact validation can pass.
- [ ] Run this command and confirm the expected import/export failure before implementation:

```bash
npx vitest run scripts/library-pocket-story-summary-card-pack-builder.test.mjs --testTimeout 15000
```

- [ ] Commit the RED tests with message `Add Batch62 library pocket RED tests`.

### Task 3: Validator And Builder Integration

**Files:**
- Modify: `scripts/product-artifact-policy.mjs`
- Modify: `scripts/validate-content-batch.mjs`
- Modify: `scripts/validate-content-batch.test.mjs`
- Create: `scripts/library-pocket-story-summary-card-pack-builder.mjs`
- Modify: `package.json`

- [ ] Add the Batch62 slug `library-pocket-story-summary-card-pack` and required artifact paths.
- [ ] Add source and lane validators for 16 cards, 6 routines, 10 take-home summary slips, 8 optional prompts, exact world/age mapping, exact lane range split, writable blanks, product alignment, local image presence, product hero manifest presence, and safety constraints.
- [ ] Add world guards: enforce overlap counts of 6 with Batch56, 8 with Batch57, 6 with Batch58, 7 with Batch59, 13 with Batch60, and 0 with Batch61.
- [ ] Add a Batch62 unsafe-language wrapper that rejects publishing/showcase/portfolio/display/perfect/rubric/assessment/spelling pressure, standalone `public`, singular/plural `address`, singular/plural `food`, singular/plural `review`, singular/plural `rating`, real book-title/author/library framing, library cards, checkout desks, due dates, fines, and blocked terms `episode`, `chapter book`, `screenplay`, `cliffhanger`, `plot twist`, `choose your own adventure`, and `publishable`.
- [ ] Add the builder script and package scripts `image:batch62` and `product:library-pocket-summary-pack`.
- [ ] Update content validation counts to expect 82 local world/product images, 55 static product pages, and 55 product artifacts after Batch62 assets are generated.
- [ ] Run focused tests until green:

```bash
npx vitest run scripts/library-pocket-story-summary-card-pack-builder.test.mjs --testTimeout 15000
```

- [ ] Commit integration with message `Add Batch62 library pocket builder integration`.

### Task 4: Product Source, Catalog, Static Route, And Image Manifest

**Files:**
- Create: `content/product-artifacts/library-pocket-story-summary-card-pack.json`
- Modify: `content/products/batch5-products.json`
- Modify: `src/storyData.ts`
- Modify: `src/storyData.test.ts`
- Modify: `src/App.test.tsx`
- Create: `content/image-queue/2026-06-04-batch62-images.json`

- [ ] Assemble source JSON from the lane files with `batchId` set to `2026-06-04-batch62`.
- [ ] Add the checkout-pending product page entry with `$97`, mailto-only CTA, local product image path, world summaries, bullets, best-use notes, parent steps, and safety notes.
- [ ] Add the product to `productLinks` and route/link tests.
- [ ] Add one local-only image manifest containing the Batch62 product hero image `library-pocket-story-summary-card-pack`.
- [ ] Update content validation so the Batch62 image manifest is counted and the Batch62 source/product/artifacts are inspected.
- [ ] Run these focused checks:

```bash
npx vitest run src/storyData.test.ts src/App.test.tsx scripts/library-pocket-story-summary-card-pack-builder.test.mjs scripts/validate-content-batch.test.mjs --testTimeout 30000
npm run verify:content
```

- [ ] Commit product integration with message `Add Batch62 library pocket product integration`.

### Task 5: Assets, Artifacts, Verification, Reviews, And Closeout

**Files:**
- Create: `public/images/plotsprout/batch62/library-pocket-story-summary-card-pack.jpg`
- Create: `public/images/plotsprout/batch62/library-pocket-story-summary-card-pack.webp`
- Create: `content/image-runs/batch62/library-pocket-story-summary-card-pack.json`
- Create: `product-build/library-pocket-story-summary-card-pack/*`
- Create: `public/library-pocket-story-summary-card-pack/index.html`
- Modify: `TODO.md`
- Modify: `/home/sam/.codex/memories/MEMORY.md` after deploy/live smoke

- [ ] Generate the local SDXL product image:

```bash
PLOTSPROUT_MODELS_ROOT=/home/sam/claude-workspace/ComfyUI/models PLOTSPROUT_SDXL_VAE=checkpoint npm run image:batch62
```

- [ ] Reject or regenerate any image with pseudo-text, readable labels, food props, children/faces/hands, real brand marks, library checkout desks, due-date cards, or off-product composition.
- [ ] Build the PDF/source/ZIP artifacts:

```bash
npm run product:library-pocket-summary-pack
```

- [ ] Run full verification:

```bash
npm run verify
```

- [ ] Run local Playwright desktop/mobile product and homepage checks with browser console/page-error checks.
- [ ] Request content/artifact and code/static reviews before merge.
- [ ] Commit final assets with message `Add Batch62 library pocket assets`.
- [ ] Push branch, fast-forward `main`, push `main`, watch GitHub Actions deploy, run live desktop/mobile smoke, compare committed and live JPEG bytes, close TODO with `[skip ci]`, update memory, and leave checkout pending.
