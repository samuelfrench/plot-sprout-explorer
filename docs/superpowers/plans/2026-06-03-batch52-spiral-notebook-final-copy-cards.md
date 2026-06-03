# Batch52 Spiral Notebook Story Final Copy Card Pack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the `$77` Spiral Notebook Story Final Copy Card Pack as a static checkout-pending Plot Sprout product with source JSON, lane files, one new local world image, local product image, PDF/source/ZIP artifacts, tests, deploy, TODO closeout, and memory update.

**Architecture:** Follow the Batch51 product-pack architecture: three card lane JSON files and one tools lane feed a canonical source JSON file; validators enforce exact schema, safety, lane coverage, world/age alignment, product/catalog alignment, artifact paths, and checkout-pending status; a dedicated builder renders deterministic printable HTML/PDF/ZIP artifacts; the existing static renderer publishes the product route from `content/products/batch5-products.json`. Batch52 adds one new local RTX4090 world image for the existing safe world `blue-pencil-observatory` so the pack can cap overlap with both Batch50 and Batch51.

**Tech Stack:** Vite, React, Vitest, Node ESM scripts, Playwright, local RTX4090 SDXL image generation through `scripts/generate_story_images_local.py`.

---

### Task 1: Batch52 Content Contract And Lanes

**Files:**
- Create: `content/product-artifacts/lanes/batch52-spiral-notebook-final-copy-cards-a.json`
- Create: `content/product-artifacts/lanes/batch52-spiral-notebook-final-copy-cards-b.json`
- Create: `content/product-artifacts/lanes/batch52-spiral-notebook-final-copy-cards-c.json`
- Create: `content/product-artifacts/lanes/batch52-spiral-notebook-final-copy-tools.json`

- [ ] Write cards 01-06, 07-11, and 12-16.
- [ ] Use fields `id`, `title`, `worldSlug`, `ageBand`, `finalCopySkill`, `useCase`, `adultSetup`, `kidDirection`, `openingCopyPrompt`, `neatCopyPrompt`, `detailTransferPrompt`, `sentenceBoundaryPrompt`, `dialogueCopyPrompt`, `finalCopyCheckPrompt`, `quietOptionLine`, and `takeHomeLine`.
- [ ] Use this exact world set: `moon-muffin-market`, `buttonwood-library-train`, `button-bakery-map-mixup`, `teacup-town-weather-window`, `spoon-ferry-lunchbox-harbor`, `pocket-park-notice-board`, `moss-message-observatory`, `revision-river-ferry`, `tiny-lantern-reef`, `mitten-market-lost-ticket`, `paperclip-plaza-parcel-day`, `penny-path-compass-shop`, `pantry-measurement-mystery`, `compost-clock-workshop`, `almost-invention-workshop`, `blue-pencil-observatory`.
- [ ] Write tools with `adultGuide`, `finalCopyRoutines`, `takeHomeFinalCopySlips`, and `optionalAdultPrompts`.
- [ ] Keep every value ASCII, fictional, adult-led, offline, paper-only, and with writable blanks where applicable.
- [ ] Avoid unsafe terms: no grades, scores, timers, uploads, recording, camera/photo/audio/video/voice-memo flow, public posting, accounts, real school/home identity details, private child profiles, diary-style personal disclosures, spelling grades, food/allergy/medical advice, or real child data.
- [ ] Avoid "publish", "publication", "showcase", "portfolio", "display", "perfect", "rubric", "assessment", "share online", and provider/payment terms.

### Task 2: RED Tests

**Files:**
- Create: `scripts/spiral-notebook-story-final-copy-card-pack-builder.test.mjs`

- [ ] Add failing tests that import nonexistent Batch52 validator and builder exports:
  - `validateSpiralNotebookStoryFinalCopyCardPackSource`
  - `validateSpiralNotebookStoryFinalCopyCardPackSourceFiles`
  - `buildSpiralNotebookStoryFinalCopyCardPack`
  - `renderSpiralNotebookStoryFinalCopyCardPackHtml`
- [ ] Assert source schema, exact lane paths, lane range ownership, banned grading/upload/recording/private-data terms, rendered final-copy fields, artifact path inspection, deterministic builder output, and committed product checkout-pending state.
- [ ] Add tests that reject more than seven overlapping world slugs with either Batch50 or Batch51.
- [ ] Add a test that requires `blue-pencil-observatory` to have a local image before final artifact validation can pass.
- [ ] Run `npx vitest run scripts/spiral-notebook-story-final-copy-card-pack-builder.test.mjs --testTimeout 15000` and confirm the expected import/export failure before implementation.

### Task 3: Validator And Builder Integration

**Files:**
- Modify: `scripts/product-artifact-policy.mjs`
- Modify: `scripts/validate-content-batch.mjs`
- Create: `scripts/spiral-notebook-story-final-copy-card-pack-builder.mjs`
- Modify: `package.json`

- [ ] Add the Batch52 slug `spiral-notebook-story-final-copy-card-pack` and required artifact paths.
- [ ] Add source and lane validators for 16 cards, 6 routines, 10 take-home final-copy slips, 8 optional prompts, exact world/age mapping, exact lane range split, writable blanks, product alignment, local image presence, and safety constraints.
- [ ] Add overlap guards: `worldSlugs` must reuse no more than 7 Batch50 worlds and no more than 7 Batch51 worlds.
- [ ] Add the builder script and package scripts `image:batch52` and `product:spiral-notebook-final-copy-pack`.
- [ ] Run the focused Batch52 Vitest file until it is green.

### Task 4: Product Source, Catalog, Static Route, And Image Manifests

**Files:**
- Create: `content/product-artifacts/spiral-notebook-story-final-copy-card-pack.json`
- Modify: `content/products/batch5-products.json`
- Modify: `src/storyData.ts`
- Modify: `src/storyData.test.ts`
- Modify: `src/App.test.tsx`
- Create: `content/image-queue/2026-06-03-batch52-images.json`

- [ ] Assemble source JSON from the lane files.
- [ ] Add the checkout-pending product page entry with `$77`, mailto-only CTA, local product image path, world summaries, bullets, and safety notes.
- [ ] Add the product to `productLinks` and route/link tests.
- [ ] Add one local-only image manifest containing both `blue-pencil-observatory` and the Batch52 product hero image.
- [ ] Update content validation so the Batch52 image manifest is counted and so the Batch52 source/product/artifacts are inspected.

### Task 5: Assets, Artifacts, Verification, And Closeout

**Files:**
- Create: `public/images/plotsprout/batch52-worlds/blue-pencil-observatory.jpg`
- Create: `public/images/plotsprout/batch52-worlds/blue-pencil-observatory.webp`
- Create: `public/images/plotsprout/batch52/spiral-notebook-story-final-copy-card-pack.jpg`
- Create: `public/images/plotsprout/batch52/spiral-notebook-story-final-copy-card-pack.webp`
- Create: `content/image-runs/batch52/blue-pencil-observatory.json`
- Create: `content/image-runs/batch52/spiral-notebook-story-final-copy-card-pack.json`
- Create: `product-build/spiral-notebook-story-final-copy-card-pack/*`
- Create: `public/spiral-notebook-story-final-copy-card-pack/index.html`
- Modify: `TODO.md`
- Modify: `/home/sam/.codex/memories/MEMORY.md` after deploy/live smoke

- [ ] Generate local SDXL images with `PLOTSPROUT_MODELS_ROOT=/home/sam/claude-workspace/ComfyUI/models npm run image:batch52`.
- [ ] Build the PDF/source/ZIP artifacts with `npm run product:spiral-notebook-final-copy-pack`.
- [ ] Run `npm run verify`.
- [ ] Run local Playwright desktop/mobile product and homepage checks with browser console checks.
- [ ] Request content/artifact and UI/static reviews before merge.
- [ ] Commit, push the branch, fast-forward main, push main, watch GitHub Actions deploy, live smoke, close TODO with `[skip ci]`, update memory, and leave checkout pending.
