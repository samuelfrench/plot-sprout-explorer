# Batch58 Hanging File Story Decision Point Card Pack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the `$89` Hanging File Story Decision Point Card Pack as a static checkout-pending Plot Sprout product with source JSON, lane files, local product image, PDF/source/ZIP artifacts, tests, deploy, TODO closeout, and memory update.

**Architecture:** Follow the Batch57 product-pack architecture: three card lane JSON files and one tools lane feed a canonical source JSON file; validators enforce exact schema, safety, lane coverage, world/age alignment, product/catalog alignment, artifact paths, image manifest coverage, and checkout-pending status; a dedicated builder renders deterministic printable HTML/PDF/ZIP artifacts; the existing static renderer publishes the product route from `content/products/batch5-products.json`. Batch58 keeps the product narrow: hanging-file decision-point cards that help a writer compare two fictional paths and choose one paper-only consequence note.

**Tech Stack:** Vite, React, Vitest, Node ESM scripts, Playwright, local RTX4090 SDXL image generation through `scripts/generate_story_images_local.py`.

---

### Task 1: Batch58 Content Contract And Lanes

**Files:**
- Create: `content/product-artifacts/lanes/batch58-hanging-file-decision-point-cards-a.json`
- Create: `content/product-artifacts/lanes/batch58-hanging-file-decision-point-cards-b.json`
- Create: `content/product-artifacts/lanes/batch58-hanging-file-decision-point-cards-c.json`
- Create: `content/product-artifacts/lanes/batch58-hanging-file-decision-point-tools.json`

- [ ] Write cards 01-06, 07-11, and 12-16.
- [ ] Use fields in this exact order: `id`, `title`, `worldSlug`, `ageBand`, `decisionSkill`, `useCase`, `adultSetup`, `kidDirection`, `choicePrompt`, `pathOnePrompt`, `pathTwoPrompt`, `compareCluePrompt`, `chosenPathPrompt`, `consequenceNotePrompt`, `fileLabelPrompt`, `quietOptionLine`, and `takeHomeLine`.
- [ ] Use this exact world set in this order: `acorn-avenue-errand-office`, `button-bakery-map-mixup`, `mitten-market-lost-ticket`, `penny-path-compass-shop`, `spoon-ferry-lunchbox-harbor`, `compost-clock-workshop`, `orchard-pulley-post`, `pantry-measurement-mystery`, `pond-bridge-blueprint-club`, `tidepool-timekeepers-lab`, `almost-invention-workshop`, `appendix-archive-lab`, `blue-pencil-observatory`, `clue-label-tower-museum`, `margin-note-market`, `revision-river-ferry`.
- [ ] This world set must overlap Batch53, Batch54, Batch55, Batch56, and Batch57 in exactly 7 worlds each.
- [ ] Write tools with `adultGuide`, `decisionPointRoutines`, `takeHomeDecisionSlips`, and `optionalAdultPrompts`.
- [ ] Keep every value ASCII, fictional, adult-led, offline, paper-only, and with writable blanks where applicable.
- [ ] Avoid unsafe terms: no grades, scores, timers, uploads, recording, camera/photo/audio/video/voice-memo flow, public posting, accounts, real school/home identity details, private child profiles, diary-style personal disclosures, spelling grades, food/allergy/medical advice, or real child data.
- [ ] Avoid publishing/display pressure and assessment language: no `publish`, `publication`, `showcase`, `portfolio`, `display`, `perfect`, `rubric`, `assessment`, `share online`, `episode`, `chapter book`, `screenplay`, `choose your own adventure`, `publishable`, or provider/payment terms. Use `page`, `decision point`, `hanging file`, and `file label` language.
- [ ] Validate JSON parse and field order with this command:

```bash
node --input-type=module -e "import { readFileSync } from 'node:fs'; for (const file of ['content/product-artifacts/lanes/batch58-hanging-file-decision-point-cards-a.json','content/product-artifacts/lanes/batch58-hanging-file-decision-point-cards-b.json','content/product-artifacts/lanes/batch58-hanging-file-decision-point-cards-c.json','content/product-artifacts/lanes/batch58-hanging-file-decision-point-tools.json']) JSON.parse(readFileSync(file, 'utf8')); console.log('Batch58 lane JSON parsed');"
```

- [ ] Commit lane files with message `Add Batch58 hanging file decision lanes`.

### Task 2: RED Tests

**Files:**
- Create: `scripts/hanging-file-story-decision-point-card-pack-builder.test.mjs`

- [ ] Add failing tests that import nonexistent Batch58 validator and builder exports:
  - `validateHangingFileStoryDecisionPointCardPackSource`
  - `validateHangingFileStoryDecisionPointCardPackSourceFiles`
  - `buildHangingFileStoryDecisionPointCardPack`
  - `renderHangingFileStoryDecisionPointCardPackHtml`
- [ ] Assert source schema, exact lane paths, lane range ownership, exact world set, Batch53/54/55/56/57 overlap counts, banned publishing/portfolio/display/grading/upload/recording/private-data terms, standalone `public`/`address`/`food` terms, rendered decision-point fields, artifact path inspection, deterministic builder output, and committed product checkout-pending state.
- [ ] Add a test that requires the product hero image manifest entry and all card-world local images before final artifact validation can pass.
- [ ] Run this command and confirm the expected import/export failure before implementation:

```bash
npx vitest run scripts/hanging-file-story-decision-point-card-pack-builder.test.mjs --testTimeout 15000
```

- [ ] Commit the RED tests with message `Add Batch58 decision point RED tests`.

### Task 3: Validator And Builder Integration

**Files:**
- Modify: `scripts/product-artifact-policy.mjs`
- Modify: `scripts/validate-content-batch.mjs`
- Modify: `scripts/validate-content-batch.test.mjs`
- Create: `scripts/hanging-file-story-decision-point-card-pack-builder.mjs`
- Modify: `package.json`

- [ ] Add the Batch58 slug `hanging-file-story-decision-point-card-pack` and required artifact paths.
- [ ] Add source and lane validators for 16 cards, 6 routines, 10 take-home decision slips, 8 optional prompts, exact world/age mapping, exact lane range split, writable blanks, product alignment, local image presence, product hero manifest presence, and safety constraints.
- [ ] Add overlap guards: `worldSlugs` must overlap Batch53, Batch54, Batch55, Batch56, and Batch57 in exactly 7 worlds each.
- [ ] Add a Batch58 unsafe-language wrapper that rejects publishing/showcase/portfolio/display/perfect/rubric/assessment/spelling pressure, standalone `public`, singular/plural `address`, singular/plural `food`, and decision-point blocked terms `episode`, `chapter book`, `screenplay`, `choose your own adventure`, and `publishable`.
- [ ] Add the builder script and package scripts `image:batch58` and `product:hanging-file-decision-point-pack`.
- [ ] Update content validation counts to expect 78 local world/product images, 51 static product pages, and 51 product artifacts after Batch58 assets are generated.
- [ ] Run focused tests until green:

```bash
npx vitest run scripts/hanging-file-story-decision-point-card-pack-builder.test.mjs --testTimeout 15000
```

- [ ] Commit integration with message `Add Batch58 hanging file builder integration`.

### Task 4: Product Source, Catalog, Static Route, And Image Manifest

**Files:**
- Create: `content/product-artifacts/hanging-file-story-decision-point-card-pack.json`
- Modify: `content/products/batch5-products.json`
- Modify: `src/storyData.ts`
- Modify: `src/storyData.test.ts`
- Modify: `src/App.test.tsx`
- Create: `content/image-queue/2026-06-03-batch58-images.json`

- [ ] Assemble source JSON from the lane files with `batchId` set to `2026-06-03-batch58`.
- [ ] Add the checkout-pending product page entry with `$89`, mailto-only CTA, local product image path, world summaries, bullets, best-use notes, parent steps, and safety notes.
- [ ] Add the product to `productLinks` and route/link tests.
- [ ] Add one local-only image manifest containing the Batch58 product hero image `hanging-file-story-decision-point-card-pack`.
- [ ] Update content validation so the Batch58 image manifest is counted and the Batch58 source/product/artifacts are inspected.
- [ ] Run these focused checks:

```bash
npx vitest run src/storyData.test.ts src/App.test.tsx scripts/hanging-file-story-decision-point-card-pack-builder.test.mjs scripts/validate-content-batch.test.mjs --testTimeout 30000
npm run verify:content
```

- [ ] Commit product integration with message `Add Batch58 hanging file product integration`.

### Task 5: Assets, Artifacts, Verification, Reviews, And Closeout

**Files:**
- Create: `public/images/plotsprout/batch58/hanging-file-story-decision-point-card-pack.jpg`
- Create: `public/images/plotsprout/batch58/hanging-file-story-decision-point-card-pack.webp`
- Create: `content/image-runs/batch58/hanging-file-story-decision-point-card-pack.json`
- Create: `product-build/hanging-file-story-decision-point-card-pack/*`
- Create: `public/hanging-file-story-decision-point-card-pack/index.html`
- Modify: `TODO.md`
- Modify: `/home/sam/.codex/memories/MEMORY.md` after deploy/live smoke

- [ ] Generate the local SDXL product image:

```bash
PLOTSPROUT_MODELS_ROOT=/home/sam/claude-workspace/ComfyUI/models PLOTSPROUT_SDXL_VAE=checkpoint npm run image:batch58
```

- [ ] Reject or regenerate any image with pseudo-text, dark unreadable props, food props, distorted children, real brand marks, or off-product composition.
- [ ] Build the PDF/source/ZIP artifacts:

```bash
npm run product:hanging-file-decision-point-pack
```

- [ ] Run full verification:

```bash
npm run verify
```

- [ ] Run local Playwright desktop/mobile product and homepage checks with browser console/page-error checks.
- [ ] Request content/artifact and code/static reviews before merge.
- [ ] Commit final assets with message `Add Batch58 hanging file assets`.
- [ ] Push branch, fast-forward `main`, push `main`, watch GitHub Actions deploy, run live desktop/mobile smoke, compare committed and live JPEG bytes, close TODO with `[skip ci]`, update memory, and leave checkout pending.
