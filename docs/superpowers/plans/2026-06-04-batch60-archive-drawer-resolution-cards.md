# Batch60 Archive Drawer Story Resolution Card Pack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the `$93` Archive Drawer Story Resolution Card Pack as a static checkout-pending Plot Sprout product with source JSON, lane files, local product image, PDF/source/ZIP artifacts, tests, deploy, TODO closeout, and memory update.

**Architecture:** Follow the Batch59 product-pack architecture: three card lane JSON files and one tools lane feed a canonical source JSON file; validators enforce exact schema, safety, lane coverage, world/age alignment, product/catalog alignment, artifact paths, image manifest coverage, and checkout-pending status; a dedicated builder renders deterministic printable HTML/PDF/ZIP artifacts; the existing static renderer publishes the product route from `content/products/batch5-products.json`. Batch60 keeps the product narrow: archive-drawer resolution cards that help a writer connect loose threads to a calm closing image and next-story seed.

**Tech Stack:** Vite, React, Vitest, Node ESM scripts, Playwright, local RTX4090 SDXL image generation through `scripts/generate_story_images_local.py`.

---

### Task 1: Batch60 Content Contract And Lanes

**Files:**
- Create: `content/product-artifacts/lanes/batch60-archive-drawer-resolution-cards-a.json`
- Create: `content/product-artifacts/lanes/batch60-archive-drawer-resolution-cards-b.json`
- Create: `content/product-artifacts/lanes/batch60-archive-drawer-resolution-cards-c.json`
- Create: `content/product-artifacts/lanes/batch60-archive-drawer-resolution-tools.json`

- [ ] Write cards 01-06, 07-11, and 12-16.
- [ ] Use fields in this exact order: `id`, `title`, `worldSlug`, `ageBand`, `resolutionSkill`, `useCase`, `adultSetup`, `kidDirection`, `looseThreadPrompt`, `lastChoicePrompt`, `changedFeelingPrompt`, `closingImagePrompt`, `leftoverQuestionPrompt`, `nextStorySeedPrompt`, `archiveDrawerLabelPrompt`, `quietOptionLine`, and `takeHomeLine`.
- [ ] Use this exact world set in this order: `teacup-town-weather-window`, `mitten-market-lost-ticket`, `button-bakery-map-mixup`, `paperclip-plaza-parcel-day`, `sticker-station-mail-cart`, `greenhouse-gear-garden`, `moss-message-observatory`, `rain-gauge-railway`, `seed-library-map-room`, `solar-oven-picnic-station`, `tidepool-timekeepers-lab`, `almost-invention-workshop`, `appendix-archive-lab`, `clue-label-tower-museum`, `compost-clock-workshop`, `index-card-theater-club`.
- [ ] This world set must overlap Batch56, Batch57, Batch58, and Batch59 in exactly 7 worlds each, overlap Batch55 in 8 worlds, and never exceed 8 worlds of overlap with any Batch55-Batch59 pack.
- [ ] Write tools with `adultGuide`, `resolutionRoutines`, `takeHomeResolutionSlips`, and `optionalAdultPrompts`.
- [ ] Keep every value ASCII, fictional, adult-led, offline, paper-only, and with writable blanks where applicable.
- [ ] Avoid unsafe terms: no grades, scores, timers, uploads, recording, camera/photo/audio/video/voice-memo flow, public posting, accounts, real school/home identity details, private child profiles, diary-style personal disclosures, spelling grades, food/allergy/medical advice, or real child data.
- [ ] Avoid publishing/display pressure and assessment language: no `publish`, `publication`, `showcase`, `portfolio`, `display`, `perfect`, `rubric`, `assessment`, `share online`, `episode`, `chapter book`, `screenplay`, `cliffhanger`, `plot twist`, `choose your own adventure`, `publishable`, or provider/payment terms. Use `resolution`, `loose thread`, `last choice`, `changed feeling`, `closing image`, `leftover question`, `next-story seed`, and `archive drawer label` language.
- [ ] Validate JSON parse and field order with this command:

```bash
node --input-type=module -e "import { readFileSync } from 'node:fs'; for (const file of ['content/product-artifacts/lanes/batch60-archive-drawer-resolution-cards-a.json','content/product-artifacts/lanes/batch60-archive-drawer-resolution-cards-b.json','content/product-artifacts/lanes/batch60-archive-drawer-resolution-cards-c.json','content/product-artifacts/lanes/batch60-archive-drawer-resolution-tools.json']) JSON.parse(readFileSync(file, 'utf8')); console.log('Batch60 lane JSON parsed');"
```

- [ ] Commit lane files with message `Add Batch60 archive drawer resolution lanes`.

### Task 2: RED Tests

**Files:**
- Create: `scripts/archive-drawer-story-resolution-card-pack-builder.test.mjs`

- [ ] Add failing tests that import nonexistent Batch60 validator and builder exports:
  - `validateArchiveDrawerStoryResolutionCardPackSource`
  - `validateArchiveDrawerStoryResolutionCardPackSourceFiles`
  - `buildArchiveDrawerStoryResolutionCardPack`
  - `renderArchiveDrawerStoryResolutionCardPackHtml`
- [ ] Assert source schema, exact lane paths, lane range ownership, exact world set, Batch55/56/57/58/59 overlap counts, banned publishing/portfolio/display/grading/upload/recording/private-data terms, standalone `public`/`address`/`food` terms, rendered resolution fields, artifact path inspection, deterministic builder output, and committed product checkout-pending state.
- [ ] Add a test that requires the product hero image manifest entry and all card-world local images before final artifact validation can pass.
- [ ] Run this command and confirm the expected import/export failure before implementation:

```bash
npx vitest run scripts/archive-drawer-story-resolution-card-pack-builder.test.mjs --testTimeout 15000
```

- [ ] Commit the RED tests with message `Add Batch60 archive drawer RED tests`.

### Task 3: Validator And Builder Integration

**Files:**
- Modify: `scripts/product-artifact-policy.mjs`
- Modify: `scripts/validate-content-batch.mjs`
- Modify: `scripts/validate-content-batch.test.mjs`
- Create: `scripts/archive-drawer-story-resolution-card-pack-builder.mjs`
- Modify: `package.json`

- [ ] Add the Batch60 slug `archive-drawer-story-resolution-card-pack` and required artifact paths.
- [ ] Add source and lane validators for 16 cards, 6 routines, 10 take-home resolution slips, 8 optional prompts, exact world/age mapping, exact lane range split, writable blanks, product alignment, local image presence, product hero manifest presence, and safety constraints.
- [ ] Add overlap guards: `worldSlugs` must overlap Batch56, Batch57, Batch58, and Batch59 in exactly 7 worlds each, overlap Batch55 in 8 worlds, and never exceed 8 with any Batch55-Batch59 pack.
- [ ] Add a Batch60 unsafe-language wrapper that rejects publishing/showcase/portfolio/display/perfect/rubric/assessment/spelling pressure, standalone `public`, singular/plural `address`, singular/plural `food`, and blocked terms `episode`, `chapter book`, `screenplay`, `cliffhanger`, `plot twist`, `choose your own adventure`, and `publishable`.
- [ ] Add the builder script and package scripts `image:batch60` and `product:archive-drawer-resolution-pack`.
- [ ] Update content validation counts to expect 80 local world/product images, 53 static product pages, and 53 product artifacts after Batch60 assets are generated.
- [ ] Run focused tests until green:

```bash
npx vitest run scripts/archive-drawer-story-resolution-card-pack-builder.test.mjs --testTimeout 15000
```

- [ ] Commit integration with message `Add Batch60 archive drawer builder integration`.

### Task 4: Product Source, Catalog, Static Route, And Image Manifest

**Files:**
- Create: `content/product-artifacts/archive-drawer-story-resolution-card-pack.json`
- Modify: `content/products/batch5-products.json`
- Modify: `src/storyData.ts`
- Modify: `src/storyData.test.ts`
- Modify: `src/App.test.tsx`
- Create: `content/image-queue/2026-06-04-batch60-images.json`

- [ ] Assemble source JSON from the lane files with `batchId` set to `2026-06-04-batch60`.
- [ ] Add the checkout-pending product page entry with `$93`, mailto-only CTA, local product image path, world summaries, bullets, best-use notes, parent steps, and safety notes.
- [ ] Add the product to `productLinks` and route/link tests.
- [ ] Add one local-only image manifest containing the Batch60 product hero image `archive-drawer-story-resolution-card-pack`.
- [ ] Update content validation so the Batch60 image manifest is counted and the Batch60 source/product/artifacts are inspected.
- [ ] Run these focused checks:

```bash
npx vitest run src/storyData.test.ts src/App.test.tsx scripts/archive-drawer-story-resolution-card-pack-builder.test.mjs scripts/validate-content-batch.test.mjs --testTimeout 30000
npm run verify:content
```

- [ ] Commit product integration with message `Add Batch60 archive drawer product integration`.

### Task 5: Assets, Artifacts, Verification, Reviews, And Closeout

**Files:**
- Create: `public/images/plotsprout/batch60/archive-drawer-story-resolution-card-pack.jpg`
- Create: `public/images/plotsprout/batch60/archive-drawer-story-resolution-card-pack.webp`
- Create: `content/image-runs/batch60/archive-drawer-story-resolution-card-pack.json`
- Create: `product-build/archive-drawer-story-resolution-card-pack/*`
- Create: `public/archive-drawer-story-resolution-card-pack/index.html`
- Modify: `TODO.md`
- Modify: `/home/sam/.codex/memories/MEMORY.md` after deploy/live smoke

- [ ] Generate the local SDXL product image:

```bash
PLOTSPROUT_MODELS_ROOT=/home/sam/claude-workspace/ComfyUI/models PLOTSPROUT_SDXL_VAE=checkpoint npm run image:batch60
```

- [ ] Reject or regenerate any image with pseudo-text, dark unreadable props, food props, distorted children, real brand marks, or off-product composition.
- [ ] Build the PDF/source/ZIP artifacts:

```bash
npm run product:archive-drawer-resolution-pack
```

- [ ] Run full verification:

```bash
npm run verify
```

- [ ] Run local Playwright desktop/mobile product and homepage checks with browser console/page-error checks.
- [ ] Request content/artifact and code/static reviews before merge.
- [ ] Commit final assets with message `Add Batch60 archive drawer assets`.
- [ ] Push branch, fast-forward `main`, push `main`, watch GitHub Actions deploy, run live desktop/mobile smoke, compare committed and live JPEG bytes, close TODO with `[skip ci]`, update memory, and leave checkout pending.
