# Batch68 Paper Band Story Compare Card Pack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the `$109` Paper Band Story Compare Card Pack as a static checkout-pending Plot Sprout product with source JSON, lane files, local product image, PDF/source/ZIP artifacts, tests, deploy, project task closeout, and memory update.

**Architecture:** Follow the Batch67 product-pack architecture: three card lane JSON files and one tools lane feed a canonical source JSON file; validators enforce exact schema, safety, lane coverage, world/display-age alignment, recent-batch overlap counts, product/catalog alignment, artifact paths, image manifest coverage, and checkout-pending status; a dedicated builder renders deterministic printable HTML/PDF/ZIP artifacts. Batch68 stays narrow: paper-band story comparison cards that help a writer privately compare two invented story details on paper.

**Tech Stack:** Vite, React, Vitest, Node ESM scripts, Playwright, local RTX4090 SDXL image generation through `scripts/generate_story_images_local.py`.

---

### Task 1: Batch68 Content Contract And Lanes

**Files:**
- Create: `content/product-artifacts/lanes/batch68-paper-band-story-compare-cards-a.json`
- Create: `content/product-artifacts/lanes/batch68-paper-band-story-compare-cards-b.json`
- Create: `content/product-artifacts/lanes/batch68-paper-band-story-compare-cards-c.json`
- Create: `content/product-artifacts/lanes/batch68-paper-band-story-compare-tools.json`

- [ ] Write cards 01-06, 07-11, and 12-16.
- [ ] Use fields in this exact order: `id`, `title`, `worldSlug`, `ageBand`, `compareSkill`, `useCase`, `adultSetup`, `kidDirection`, `firstDetailPrompt`, `secondDetailPrompt`, `samePrompt`, `differentPrompt`, `compareSentencePrompt`, `paperBandCheckPrompt`, `quietOptionLine`, and `takeHomeLine`.
- [ ] Use this exact world set in this order: `mitten-market-lost-ticket`, `moon-muffin-market`, `acorn-avenue-errand-office`, `button-bakery-map-mixup`, `penny-path-compass-shop`, `rain-boot-route-rangers`, `compost-clock-workshop`, `orchard-pulley-post`, `pond-bridge-blueprint-club`, `seed-library-map-room`, `tidepool-timekeepers-lab`, `almost-invention-workshop`, `blue-pencil-observatory`, `chapter-gate-greenhouse`, `pencil-dragon-academy`, `revision-river-ferry`.
- [ ] Use display age bands in this order: `7-8`, `7-8`, `7-9`, `7-9`, `7-9`, `7-9`, `8-10`, `8-10`, `8-10`, `8-10`, `8-10`, `10-11`, `10-11`, `10-11`, `10-11`, `10-11`.
- [ ] Enforce overlap counts of 6 with Batch59, 6 with Batch60, 7 with Batch61, 8 with Batch62, 6 with Batch63, 6 with Batch64, 6 with Batch65, 6 with Batch66, and 6 with Batch67.
- [ ] Write tools with `adultGuide`, `compareRoutines`, `takeHomeCompareSlips`, and `optionalAdultPrompts`.
- [ ] Keep every value ASCII, fictional, adult-led, offline, paper-only, and with writable blanks where applicable.
- [ ] Avoid unsafe terms: no grades, scores, timers, uploads, recording, camera/photo/audio/video/voice-memo flow, public posting, accounts, real school/home identity details, private child profiles, diary-style personal disclosures, spelling grades, food/allergy/medical advice, real book titles, real author names, real library names, library cards, checkout desks, due dates, fines, call numbers, barcode labels, source citations, real quotations, ratings, reviews, sources, or real child data.
- [ ] Avoid publishing/display pressure and assessment language: no `publish`, `publication`, `showcase`, `portfolio`, `display`, `perfect`, `rubric`, `assessment`, `share online`, `episode`, `chapter book`, `screenplay`, `cliffhanger`, `plot twist`, `choose your own adventure`, `publishable`, or provider/payment terms. Use `first detail`, `second detail`, `same`, `different`, `but`, `while`, `compare sentence`, and `paper band check` language.
- [ ] Validate JSON parse and field order with:

```bash
node --input-type=module -e "import { readFileSync } from 'node:fs'; const cardFields=['id','title','worldSlug','ageBand','compareSkill','useCase','adultSetup','kidDirection','firstDetailPrompt','secondDetailPrompt','samePrompt','differentPrompt','compareSentencePrompt','paperBandCheckPrompt','quietOptionLine','takeHomeLine']; for (const file of ['content/product-artifacts/lanes/batch68-paper-band-story-compare-cards-a.json','content/product-artifacts/lanes/batch68-paper-band-story-compare-cards-b.json','content/product-artifacts/lanes/batch68-paper-band-story-compare-cards-c.json','content/product-artifacts/lanes/batch68-paper-band-story-compare-tools.json']) { const parsed=JSON.parse(readFileSync(file, 'utf8')); if (Array.isArray(parsed)) for (const card of parsed) if (JSON.stringify(Object.keys(card)) !== JSON.stringify(cardFields)) throw new Error(file + ' has wrong field order for ' + card.id); } console.log('Batch68 lane JSON parsed with card field order');"
```

- [ ] Commit lane files with message `Add Batch68 paper band compare lanes`.

### Task 2: RED Tests

**Files:**
- Create: `scripts/paper-band-story-compare-card-pack-builder.test.mjs`

- [ ] Add failing tests that import nonexistent Batch68 validator and builder exports: `validatePaperBandStoryCompareCardPackSource`, `validatePaperBandStoryCompareCardPackSourceFiles`, `buildPaperBandStoryCompareCardPack`, and `renderPaperBandStoryCompareCardPackHtml`.
- [ ] Assert source schema, exact lane paths, lane range ownership, exact world set, exact Batch59/60/61/62/63/64/65/66/67 overlap counts, display age constraints, banned publishing/portfolio/display/grading/upload/recording/private-data/real-review/rating/library-service/source-citation/source/quote terms, standalone `public`/`address`/`food`/`review`/`rating`/`quote`/`citation`/`source` terms, rendered compare fields, artifact path inspection, deterministic builder output, and committed product checkout-pending state.
- [ ] Add a test that requires the product hero image manifest entry and all card-world local images before final artifact validation can pass.
- [ ] Run and confirm the expected import/export failure before implementation:

```bash
npx vitest run scripts/paper-band-story-compare-card-pack-builder.test.mjs --testTimeout 15000
```

- [ ] Commit the RED tests with message `Add Batch68 paper band compare RED tests`.

### Task 3: Validator And Builder Integration

**Files:**
- Modify: `scripts/product-artifact-policy.mjs`
- Modify: `scripts/validate-content-batch.mjs`
- Modify: `scripts/validate-content-batch.test.mjs`
- Create: `scripts/paper-band-story-compare-card-pack-builder.mjs`
- Modify: `package.json`

- [ ] Add the Batch68 slug `paper-band-story-compare-card-pack` and required artifact paths.
- [ ] Add source and lane validators for 16 cards, 6 routines, 10 take-home compare slips, 8 optional prompts, exact world/display-age mapping, exact lane range split, writable blanks, product alignment, local image presence, product hero manifest presence, and safety constraints.
- [ ] Add world guards: enforce overlap counts of 6 with Batch59, 6 with Batch60, 7 with Batch61, 8 with Batch62, 6 with Batch63, 6 with Batch64, 6 with Batch65, 6 with Batch66, and 6 with Batch67.
- [ ] Add a Batch68 unsafe-language wrapper that rejects publishing/showcase/portfolio/display/perfect/rubric/assessment/spelling pressure, standalone `public`, singular/plural `address`, singular/plural `food`, singular/plural `review`, singular/plural `rating`, singular/plural `quote`, singular/plural `citation`, singular/plural `source`, real book-title/author/library framing, library cards, checkout desks, due dates, fines, call numbers, barcode labels, source citations, and blocked terms `episode`, `chapter book`, `screenplay`, `cliffhanger`, `plot twist`, `choose your own adventure`, and `publishable`.
- [ ] Add the builder script and package scripts `image:batch68` and `product:paper-band-compare-pack`.
- [ ] Update content validation counts to expect 88 local world/product images, 61 static product pages, and 61 product artifacts after Batch68 assets are generated.
- [ ] Run focused tests until green:

```bash
npx vitest run scripts/paper-band-story-compare-card-pack-builder.test.mjs --testTimeout 15000
```

- [ ] Commit integration with message `Add Batch68 paper band compare builder integration`.

### Task 4: Product Source, Catalog, Static Route, And Image Manifest

**Files:**
- Create: `content/product-artifacts/paper-band-story-compare-card-pack.json`
- Modify: `content/products/batch5-products.json`
- Modify: `src/storyData.ts`
- Modify: `src/storyData.test.ts`
- Modify: `src/App.test.tsx`
- Create: `content/image-queue/2026-06-04-batch68-images.json`

- [ ] Assemble source JSON from the lane files with `batchId` set to `2026-06-04-batch68`.
- [ ] Add the checkout-pending product page entry with `$109`, mailto-only CTA, local product image path, world summaries, bullets, best-use notes, parent steps, and safety notes.
- [ ] Add the product to `productLinks` and route/link tests.
- [ ] Add one local-only image manifest containing the Batch68 product hero image `paper-band-story-compare-card-pack`.
- [ ] Update content validation so the Batch68 image manifest is counted and the Batch68 source/product/artifacts are inspected.
- [ ] Run focused checks:

```bash
npx vitest run src/storyData.test.ts src/App.test.tsx scripts/paper-band-story-compare-card-pack-builder.test.mjs scripts/validate-content-batch.test.mjs --testTimeout 30000
npm run verify:content
```

- [ ] Commit product integration with message `Add Batch68 paper band compare product integration`.

### Task 5: Assets, Artifacts, Verification, Reviews, And Closeout

**Files:**
- Create: `public/images/plotsprout/batch68/paper-band-story-compare-card-pack.jpg`
- Create: `public/images/plotsprout/batch68/paper-band-story-compare-card-pack.webp`
- Create: `content/image-runs/batch68/paper-band-story-compare-card-pack.json`
- Create: `product-build/paper-band-story-compare-card-pack/*`
- Create: `public/paper-band-story-compare-card-pack/index.html`
- Modify: `TODO.md`
- Modify: `/home/sam/.codex/memories/MEMORY.md` after deploy/live smoke

- [ ] Generate the local SDXL product image:

```bash
PLOTSPROUT_MODELS_ROOT=/home/sam/claude-workspace/ComfyUI/models PLOTSPROUT_SDXL_VAE=checkpoint npm run image:batch68
```

- [ ] Reject or regenerate any image with pseudo-text, readable labels, food props, children/faces/hands, real brand marks, real books with readable spines, library checkout desks, due-date cards, call-number labels, barcode labels, or off-product composition.
- [ ] Build the PDF/source/ZIP artifacts:

```bash
npm run product:paper-band-compare-pack
```

- [ ] Run full verification:

```bash
npm run verify
```

- [ ] Run local Playwright desktop/mobile product and homepage checks with browser console/page-error checks.
- [ ] Request content/artifact and code/static reviews before merge.
- [ ] Commit final assets with message `Add Batch68 paper band compare assets`.
- [ ] Push branch, fast-forward `main`, push `main`, watch GitHub Actions deploy, run live desktop/mobile smoke, confirm the live Batch68 page and JPEG, close the project task list with `[skip ci]`, update memory, and leave checkout pending.
