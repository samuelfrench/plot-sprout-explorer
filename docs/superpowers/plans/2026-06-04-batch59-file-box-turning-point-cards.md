# Batch59 File Box Story Turning Point Card Pack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the `$91` File Box Story Turning Point Card Pack as a static checkout-pending Plot Sprout product with source JSON, lane files, local product image, PDF/source/ZIP artifacts, tests, deploy, TODO closeout, and memory update.

**Architecture:** Follow the Batch58 product-pack architecture: three card lane JSON files and one tools lane feed a canonical source JSON file; validators enforce exact schema, safety, lane coverage, world/age alignment, product/catalog alignment, artifact paths, image manifest coverage, and checkout-pending status; a dedicated builder renders deterministic printable HTML/PDF/ZIP artifacts; the existing static renderer publishes the product route from `content/products/batch5-products.json`. Batch59 keeps the product narrow: file-box turning-point cards that help a writer connect one fictional before path to one after path through a paper-only turning signal.

**Tech Stack:** Vite, React, Vitest, Node ESM scripts, Playwright, local RTX4090 SDXL image generation through `scripts/generate_story_images_local.py`.

---

### Task 1: Batch59 Content Contract And Lanes

**Files:**
- Create: `content/product-artifacts/lanes/batch59-file-box-turning-point-cards-a.json`
- Create: `content/product-artifacts/lanes/batch59-file-box-turning-point-cards-b.json`
- Create: `content/product-artifacts/lanes/batch59-file-box-turning-point-cards-c.json`
- Create: `content/product-artifacts/lanes/batch59-file-box-turning-point-tools.json`

- [ ] Write cards 01-06, 07-11, and 12-16.
- [ ] Use fields in this exact order: `id`, `title`, `worldSlug`, `ageBand`, `turningPointSkill`, `useCase`, `adultSetup`, `kidDirection`, `startScenePrompt`, `turnSignalPrompt`, `beforePathPrompt`, `afterPathPrompt`, `characterReactionPrompt`, `nextStepPrompt`, `fileBoxLabelPrompt`, `quietOptionLine`, and `takeHomeLine`.
- [ ] Use this exact world set in this order: `acorn-avenue-errand-office`, `teacup-town-weather-window`, `sticker-station-mail-cart`, `spoon-ferry-lunchbox-harbor`, `pocket-park-notice-board`, `rain-boot-route-rangers`, `tidepool-timekeepers-lab`, `greenhouse-gear-garden`, `solar-oven-picnic-station`, `orchard-pulley-post`, `revision-river-ferry`, `clue-label-tower-museum`, `chapter-gate-greenhouse`, `margin-note-market`, `binding-day-boardwalk`, `index-card-theater-club`.
- [ ] This world set must overlap Batch55, Batch56, Batch57, and Batch58 in exactly 7 worlds each, overlap Batch54 in 8 worlds, and never exceed 8 worlds of overlap with any Batch54-Batch58 pack.
- [ ] Write tools with `adultGuide`, `turningPointRoutines`, `takeHomeTurningSlips`, and `optionalAdultPrompts`.
- [ ] Keep every value ASCII, fictional, adult-led, offline, paper-only, and with writable blanks where applicable.
- [ ] Avoid unsafe terms: no grades, scores, timers, uploads, recording, camera/photo/audio/video/voice-memo flow, public posting, accounts, real school/home identity details, private child profiles, diary-style personal disclosures, spelling grades, food/allergy/medical advice, or real child data.
- [ ] Avoid publishing/display pressure and assessment language: no `publish`, `publication`, `showcase`, `portfolio`, `display`, `perfect`, `rubric`, `assessment`, `share online`, `episode`, `chapter book`, `screenplay`, `cliffhanger`, `plot twist`, `choose your own adventure`, `publishable`, or provider/payment terms. Use `page`, `turning point`, `file box`, and `file-box label` language.
- [ ] Validate JSON parse and field order with this command:

```bash
node --input-type=module -e "import { readFileSync } from 'node:fs'; for (const file of ['content/product-artifacts/lanes/batch59-file-box-turning-point-cards-a.json','content/product-artifacts/lanes/batch59-file-box-turning-point-cards-b.json','content/product-artifacts/lanes/batch59-file-box-turning-point-cards-c.json','content/product-artifacts/lanes/batch59-file-box-turning-point-tools.json']) JSON.parse(readFileSync(file, 'utf8')); console.log('Batch59 lane JSON parsed');"
```

- [ ] Commit lane files with message `Add Batch59 file box turning point lanes`.

### Task 2: RED Tests

**Files:**
- Create: `scripts/file-box-story-turning-point-card-pack-builder.test.mjs`

- [ ] Add failing tests that import nonexistent Batch59 validator and builder exports:
  - `validateFileBoxStoryTurningPointCardPackSource`
  - `validateFileBoxStoryTurningPointCardPackSourceFiles`
  - `buildFileBoxStoryTurningPointCardPack`
  - `renderFileBoxStoryTurningPointCardPackHtml`
- [ ] Assert source schema, exact lane paths, lane range ownership, exact world set, Batch54/55/56/57/58 overlap counts, banned publishing/portfolio/display/grading/upload/recording/private-data terms, standalone `public`/`address`/`food` terms, rendered turning-point fields, artifact path inspection, deterministic builder output, and committed product checkout-pending state.
- [ ] Add a test that requires the product hero image manifest entry and all card-world local images before final artifact validation can pass.
- [ ] Run this command and confirm the expected import/export failure before implementation:

```bash
npx vitest run scripts/file-box-story-turning-point-card-pack-builder.test.mjs --testTimeout 15000
```

- [ ] Commit the RED tests with message `Add Batch59 turning point RED tests`.

### Task 3: Validator And Builder Integration

**Files:**
- Modify: `scripts/product-artifact-policy.mjs`
- Modify: `scripts/validate-content-batch.mjs`
- Modify: `scripts/validate-content-batch.test.mjs`
- Create: `scripts/file-box-story-turning-point-card-pack-builder.mjs`
- Modify: `package.json`

- [ ] Add the Batch59 slug `file-box-story-turning-point-card-pack` and required artifact paths.
- [ ] Add source and lane validators for 16 cards, 6 routines, 10 take-home turning slips, 8 optional prompts, exact world/age mapping, exact lane range split, writable blanks, product alignment, local image presence, product hero manifest presence, and safety constraints.
- [ ] Add overlap guards: `worldSlugs` must overlap Batch55, Batch56, Batch57, and Batch58 in exactly 7 worlds each, overlap Batch54 in 8 worlds, and never exceed 8 with any Batch54-Batch58 pack.
- [ ] Add a Batch59 unsafe-language wrapper that rejects publishing/showcase/portfolio/display/perfect/rubric/assessment/spelling pressure, standalone `public`, singular/plural `address`, singular/plural `food`, and turning-point blocked terms `episode`, `chapter book`, `screenplay`, `cliffhanger`, `plot twist`, `choose your own adventure`, and `publishable`.
- [ ] Add the builder script and package scripts `image:batch59` and `product:file-box-turning-point-pack`.
- [ ] Update content validation counts to expect 79 local world/product images, 52 static product pages, and 52 product artifacts after Batch59 assets are generated.
- [ ] Run focused tests until green:

```bash
npx vitest run scripts/file-box-story-turning-point-card-pack-builder.test.mjs --testTimeout 15000
```

- [ ] Commit integration with message `Add Batch59 file box builder integration`.

### Task 4: Product Source, Catalog, Static Route, And Image Manifest

**Files:**
- Create: `content/product-artifacts/file-box-story-turning-point-card-pack.json`
- Modify: `content/products/batch5-products.json`
- Modify: `src/storyData.ts`
- Modify: `src/storyData.test.ts`
- Modify: `src/App.test.tsx`
- Create: `content/image-queue/2026-06-04-batch59-images.json`

- [ ] Assemble source JSON from the lane files with `batchId` set to `2026-06-04-batch59`.
- [ ] Add the checkout-pending product page entry with `$91`, mailto-only CTA, local product image path, world summaries, bullets, best-use notes, parent steps, and safety notes.
- [ ] Add the product to `productLinks` and route/link tests.
- [ ] Add one local-only image manifest containing the Batch59 product hero image `file-box-story-turning-point-card-pack`.
- [ ] Update content validation so the Batch59 image manifest is counted and the Batch59 source/product/artifacts are inspected.
- [ ] Run these focused checks:

```bash
npx vitest run src/storyData.test.ts src/App.test.tsx scripts/file-box-story-turning-point-card-pack-builder.test.mjs scripts/validate-content-batch.test.mjs --testTimeout 30000
npm run verify:content
```

- [ ] Commit product integration with message `Add Batch59 file box product integration`.

### Task 5: Assets, Artifacts, Verification, Reviews, And Closeout

**Files:**
- Create: `public/images/plotsprout/batch59/file-box-story-turning-point-card-pack.jpg`
- Create: `public/images/plotsprout/batch59/file-box-story-turning-point-card-pack.webp`
- Create: `content/image-runs/batch59/file-box-story-turning-point-card-pack.json`
- Create: `product-build/file-box-story-turning-point-card-pack/*`
- Create: `public/file-box-story-turning-point-card-pack/index.html`
- Modify: `TODO.md`
- Modify: `/home/sam/.codex/memories/MEMORY.md` after deploy/live smoke

- [ ] Generate the local SDXL product image:

```bash
PLOTSPROUT_MODELS_ROOT=/home/sam/claude-workspace/ComfyUI/models PLOTSPROUT_SDXL_VAE=checkpoint npm run image:batch59
```

- [ ] Reject or regenerate any image with pseudo-text, dark unreadable props, food props, distorted children, real brand marks, or off-product composition.
- [ ] Build the PDF/source/ZIP artifacts:

```bash
npm run product:file-box-turning-point-pack
```

- [ ] Run full verification:

```bash
npm run verify
```

- [ ] Run local Playwright desktop/mobile product and homepage checks with browser console/page-error checks.
- [ ] Request content/artifact and code/static reviews before merge.
- [ ] Commit final assets with message `Add Batch59 file box assets`.
- [ ] Push branch, fast-forward `main`, push `main`, watch GitHub Actions deploy, run live desktop/mobile smoke, compare committed and live JPEG bytes, close TODO with `[skip ci]`, update memory, and leave checkout pending.
