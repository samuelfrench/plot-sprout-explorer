# Batch61 Card Catalog Story Retell Card Pack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the `$95` Card Catalog Story Retell Card Pack as a static checkout-pending Plot Sprout product with source JSON, lane files, local product image, PDF/source/ZIP artifacts, tests, deploy, TODO closeout, and memory update.

**Architecture:** Follow the Batch60 product-pack architecture: three card lane JSON files and one tools lane feed a canonical source JSON file; validators enforce exact schema, safety, lane coverage, world/age alignment, product/catalog alignment, artifact paths, image manifest coverage, and checkout-pending status; a dedicated builder renders deterministic printable HTML/PDF/ZIP artifacts; the existing static renderer publishes the product route from `content/products/batch5-products.json`. Batch61 keeps the product narrow: card catalog retell cards that help a writer restate a fictional story through beginning, middle, turning choice, ending, favorite detail, next retell prompt, and label.

**Tech Stack:** Vite, React, Vitest, Node ESM scripts, Playwright, local RTX4090 SDXL image generation through `scripts/generate_story_images_local.py`.

---

### Task 1: Batch61 Content Contract And Lanes

**Files:**
- Create: `content/product-artifacts/lanes/batch61-card-catalog-retell-cards-a.json`
- Create: `content/product-artifacts/lanes/batch61-card-catalog-retell-cards-b.json`
- Create: `content/product-artifacts/lanes/batch61-card-catalog-retell-cards-c.json`
- Create: `content/product-artifacts/lanes/batch61-card-catalog-retell-tools.json`

- [ ] Write cards 01-06, 07-11, and 12-16.
- [ ] Use fields in this exact order: `id`, `title`, `worldSlug`, `ageBand`, `retellSkill`, `useCase`, `adultSetup`, `kidDirection`, `beginningSnapshotPrompt`, `middleCluePrompt`, `turningChoicePrompt`, `endingAnswerPrompt`, `favoriteDetailPrompt`, `nextRetellPrompt`, `cardCatalogLabelPrompt`, `quietOptionLine`, and `takeHomeLine`.
- [ ] Use this exact world set in this order: `puddle-planet-post-office`, `buttonwood-library-train`, `cloudberry-clocktower`, `tiny-lantern-reef`, `acorn-avenue-errand-office`, `pocket-park-notice-board`, `penny-path-compass-shop`, `orchard-pulley-post`, `pond-bridge-blueprint-club`, `revision-river-ferry`, `chapter-gate-greenhouse`, `margin-note-market`, `blue-pencil-observatory`, `binding-day-boardwalk`, `sticker-station-mail-cart`, `paperclip-plaza-parcel-day`.
- [ ] Enforce overlap counts of 8 with Batch56, 7 with Batch57, 7 with Batch58, 8 with Batch59, and 2 with Batch60.
- [ ] Write tools with `adultGuide`, `retellRoutines`, `takeHomeRetellSlips`, and `optionalAdultPrompts`.
- [ ] Keep every value ASCII, fictional, adult-led, offline, paper-only, and with writable blanks where applicable.
- [ ] Avoid unsafe terms: no grades, scores, timers, uploads, recording, camera/photo/audio/video/voice-memo flow, public posting, accounts, real school/home identity details, private child profiles, diary-style personal disclosures, spelling grades, food/allergy/medical advice, real book titles, real author names, ratings, reviews, or real child data.
- [ ] Avoid publishing/display pressure and assessment language: no `publish`, `publication`, `showcase`, `portfolio`, `display`, `perfect`, `rubric`, `assessment`, `share online`, `episode`, `chapter book`, `screenplay`, `cliffhanger`, `plot twist`, `choose your own adventure`, `publishable`, or provider/payment terms. Use `retell`, `beginning snapshot`, `middle clue`, `turning choice`, `ending answer`, `favorite detail`, `next retell prompt`, and `card catalog label` language.
- [ ] Validate JSON parse and field order with this command:

```bash
node --input-type=module -e "import { readFileSync } from 'node:fs'; const cardFields=['id','title','worldSlug','ageBand','retellSkill','useCase','adultSetup','kidDirection','beginningSnapshotPrompt','middleCluePrompt','turningChoicePrompt','endingAnswerPrompt','favoriteDetailPrompt','nextRetellPrompt','cardCatalogLabelPrompt','quietOptionLine','takeHomeLine']; for (const file of ['content/product-artifacts/lanes/batch61-card-catalog-retell-cards-a.json','content/product-artifacts/lanes/batch61-card-catalog-retell-cards-b.json','content/product-artifacts/lanes/batch61-card-catalog-retell-cards-c.json','content/product-artifacts/lanes/batch61-card-catalog-retell-tools.json']) { const parsed=JSON.parse(readFileSync(file, 'utf8')); if (Array.isArray(parsed)) for (const card of parsed) if (JSON.stringify(Object.keys(card)) !== JSON.stringify(cardFields)) throw new Error(file + ' has wrong field order for ' + card.id); } console.log('Batch61 lane JSON parsed with card field order');"
```

- [ ] Commit lane files with message `Add Batch61 card catalog retell lanes`.

### Task 2: RED Tests

**Files:**
- Create: `scripts/card-catalog-story-retell-card-pack-builder.test.mjs`

- [ ] Add failing tests that import nonexistent Batch61 validator and builder exports:
  - `validateCardCatalogStoryRetellCardPackSource`
  - `validateCardCatalogStoryRetellCardPackSourceFiles`
  - `buildCardCatalogStoryRetellCardPack`
  - `renderCardCatalogStoryRetellCardPackHtml`
- [ ] Assert source schema, exact lane paths, lane range ownership, exact world set, exact Batch56/57/58/59/60 overlap counts, banned publishing/portfolio/display/grading/upload/recording/private-data/real-review/rating terms, standalone `public`/`address`/`food`/`review`/`rating` terms, rendered retell fields, artifact path inspection, deterministic builder output, and committed product checkout-pending state.
- [ ] Add a test that requires the product hero image manifest entry and all card-world local images before final artifact validation can pass.
- [ ] Run this command and confirm the expected import/export failure before implementation:

```bash
npx vitest run scripts/card-catalog-story-retell-card-pack-builder.test.mjs --testTimeout 15000
```

- [ ] Commit the RED tests with message `Add Batch61 card catalog RED tests`.

### Task 3: Validator And Builder Integration

**Files:**
- Modify: `scripts/product-artifact-policy.mjs`
- Modify: `scripts/validate-content-batch.mjs`
- Modify: `scripts/validate-content-batch.test.mjs`
- Create: `scripts/card-catalog-story-retell-card-pack-builder.mjs`
- Modify: `package.json`

- [ ] Add the Batch61 slug `card-catalog-story-retell-card-pack` and required artifact paths.
- [ ] Add source and lane validators for 16 cards, 6 routines, 10 take-home retell slips, 8 optional prompts, exact world/age mapping, exact lane range split, writable blanks, product alignment, local image presence, product hero manifest presence, and safety constraints.
- [ ] Add world guards: enforce overlap counts of 8 with Batch56, 7 with Batch57, 7 with Batch58, 8 with Batch59, and 2 with Batch60.
- [ ] Add a Batch61 unsafe-language wrapper that rejects publishing/showcase/portfolio/display/perfect/rubric/assessment/spelling pressure, standalone `public`, singular/plural `address`, singular/plural `food`, singular/plural `review`, singular/plural `rating`, real book-title/author framing, and blocked terms `episode`, `chapter book`, `screenplay`, `cliffhanger`, `plot twist`, `choose your own adventure`, and `publishable`.
- [ ] Add the builder script and package scripts `image:batch61` and `product:card-catalog-retell-pack`.
- [ ] Update content validation counts to expect 81 local world/product images, 54 static product pages, and 54 product artifacts after Batch61 assets are generated.
- [ ] Run focused tests until green:

```bash
npx vitest run scripts/card-catalog-story-retell-card-pack-builder.test.mjs --testTimeout 15000
```

- [ ] Commit integration with message `Add Batch61 card catalog builder integration`.

### Task 4: Product Source, Catalog, Static Route, And Image Manifest

**Files:**
- Create: `content/product-artifacts/card-catalog-story-retell-card-pack.json`
- Modify: `content/products/batch5-products.json`
- Modify: `src/storyData.ts`
- Modify: `src/storyData.test.ts`
- Modify: `src/App.test.tsx`
- Create: `content/image-queue/2026-06-04-batch61-images.json`

- [ ] Assemble source JSON from the lane files with `batchId` set to `2026-06-04-batch61`.
- [ ] Add the checkout-pending product page entry with `$95`, mailto-only CTA, local product image path, world summaries, bullets, best-use notes, parent steps, and safety notes.
- [ ] Add the product to `productLinks` and route/link tests.
- [ ] Add one local-only image manifest containing the Batch61 product hero image `card-catalog-story-retell-card-pack`.
- [ ] Update content validation so the Batch61 image manifest is counted and the Batch61 source/product/artifacts are inspected.
- [ ] Run these focused checks:

```bash
npx vitest run src/storyData.test.ts src/App.test.tsx scripts/card-catalog-story-retell-card-pack-builder.test.mjs scripts/validate-content-batch.test.mjs --testTimeout 30000
npm run verify:content
```

- [ ] Commit product integration with message `Add Batch61 card catalog product integration`.

### Task 5: Assets, Artifacts, Verification, Reviews, And Closeout

**Files:**
- Create: `public/images/plotsprout/batch61/card-catalog-story-retell-card-pack.jpg`
- Create: `public/images/plotsprout/batch61/card-catalog-story-retell-card-pack.webp`
- Create: `content/image-runs/batch61/card-catalog-story-retell-card-pack.json`
- Create: `product-build/card-catalog-story-retell-card-pack/*`
- Create: `public/card-catalog-story-retell-card-pack/index.html`
- Modify: `TODO.md`
- Modify: `/home/sam/.codex/memories/MEMORY.md` after deploy/live smoke

- [ ] Generate the local SDXL product image:

```bash
PLOTSPROUT_MODELS_ROOT=/home/sam/claude-workspace/ComfyUI/models PLOTSPROUT_SDXL_VAE=checkpoint npm run image:batch61
```

- [ ] Reject or regenerate any image with pseudo-text, dark unreadable props, food props, distorted children, real brand marks, or off-product composition.
- [ ] Build the PDF/source/ZIP artifacts:

```bash
npm run product:card-catalog-retell-pack
```

- [ ] Run full verification:

```bash
npm run verify
```

- [ ] Run local Playwright desktop/mobile product and homepage checks with browser console/page-error checks.
- [ ] Request content/artifact and code/static reviews before merge.
- [ ] Commit final assets with message `Add Batch61 card catalog assets`.
- [ ] Push branch, fast-forward `main`, push `main`, watch GitHub Actions deploy, run live desktop/mobile smoke, compare committed and live JPEG bytes, close TODO with `[skip ci]`, update memory, and leave checkout pending.
