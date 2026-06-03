# Batch53 Tabbed Folder Story Series Card Pack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the `$79` Tabbed Folder Story Series Card Pack as a static checkout-pending Plot Sprout product with source JSON, lane files, one new local world image, local product image, PDF/source/ZIP artifacts, tests, deploy, TODO closeout, and memory update.

**Architecture:** Follow the Batch52 product-pack architecture: three card lane JSON files and one tools lane feed a canonical source JSON file; validators enforce exact schema, safety, lane coverage, world/age alignment, product/catalog alignment, artifact paths, image manifest coverage, and checkout-pending status; a dedicated builder renders deterministic printable HTML/PDF/ZIP artifacts; the existing static renderer publishes the product route from `content/products/batch5-products.json`. Batch53 extends the writing sequence from final copy into private multi-page story-series continuity while keeping everything adult-led, offline, paper-only, mailto-only, and provider-pending.

**Tech Stack:** Vite, React, Vitest, Node ESM scripts, Playwright, local RTX4090 SDXL image generation through `scripts/generate_story_images_local.py`.

---

### Task 1: Batch53 Content Contract And Lanes

**Files:**
- Create: `content/product-artifacts/lanes/batch53-tabbed-folder-story-series-cards-a.json`
- Create: `content/product-artifacts/lanes/batch53-tabbed-folder-story-series-cards-b.json`
- Create: `content/product-artifacts/lanes/batch53-tabbed-folder-story-series-cards-c.json`
- Create: `content/product-artifacts/lanes/batch53-tabbed-folder-story-series-tools.json`

- [ ] Write cards 01-06, 07-11, and 12-16.
- [ ] Use fields `id`, `title`, `worldSlug`, `ageBand`, `seriesSkill`, `useCase`, `adultSetup`, `kidDirection`, `pageOneAnchorPrompt`, `characterReturnPrompt`, `settingReturnPrompt`, `clueCarryPrompt`, `pageTurnPrompt`, `seriesWrapPrompt`, `quietOptionLine`, and `takeHomeLine`.
- [ ] Use this exact world set in this order: `chapter-gate-greenhouse`, `binding-day-boardwalk`, `index-card-theater-club`, `margin-note-market`, `revision-river-ferry`, `blue-pencil-observatory`, `appendix-archive-lab`, `clue-label-tower-museum`, `compass-craft-academy`, `seed-library-map-room`, `tidepool-timekeepers-lab`, `acorn-avenue-errand-office`, `rain-boot-route-rangers`, `buttonwood-library-train`, `cloudberry-clocktower`, `moon-muffin-market`.
- [ ] This world set must overlap Batch50 in exactly 4 worlds, Batch51 in exactly 7 worlds, and Batch52 in exactly 4 worlds.
- [ ] Write tools with `adultGuide`, `seriesRoutines`, `takeHomeSeriesSlips`, and `optionalAdultPrompts`.
- [ ] Keep every value ASCII, fictional, adult-led, offline, paper-only, and with writable blanks where applicable.
- [ ] Avoid unsafe terms: no grades, scores, timers, uploads, recording, camera/photo/audio/video/voice-memo flow, public posting, accounts, real school/home identity details, private child profiles, diary-style personal disclosures, spelling grades, food/allergy/medical advice, or real child data.
- [ ] Avoid "publish", "publication", "showcase", "portfolio", "display", "perfect", "rubric", "assessment", "share online", "episode", "chapter book", and provider/payment terms. Use "page", "next page", and "story series" instead of publishing or portfolio language.

### Task 2: RED Tests

**Files:**
- Create: `scripts/tabbed-folder-story-series-card-pack-builder.test.mjs`

- [ ] Add failing tests that import nonexistent Batch53 validator and builder exports:
  - `validateTabbedFolderStorySeriesCardPackSource`
  - `validateTabbedFolderStorySeriesCardPackSourceFiles`
  - `buildTabbedFolderStorySeriesCardPack`
  - `renderTabbedFolderStorySeriesCardPackHtml`
- [ ] Assert source schema, exact lane paths, lane range ownership, exact world set, Batch50/51/52 overlap caps, banned publishing/portfolio/display/grading/upload/recording/private-data terms, standalone `public`/`address`/`food` terms, rendered series fields, artifact path inspection, deterministic builder output, and committed product checkout-pending state.
- [ ] Add a test that requires `appendix-archive-lab` to have a local image before final artifact validation can pass.
- [ ] Run `npx vitest run scripts/tabbed-folder-story-series-card-pack-builder.test.mjs --testTimeout 15000` and confirm the expected import/export failure before implementation.

### Task 3: Validator And Builder Integration

**Files:**
- Modify: `scripts/product-artifact-policy.mjs`
- Modify: `scripts/validate-content-batch.mjs`
- Modify: `scripts/validate-content-batch.test.mjs`
- Create: `scripts/tabbed-folder-story-series-card-pack-builder.mjs`
- Modify: `package.json`

- [ ] Add the Batch53 slug `tabbed-folder-story-series-card-pack` and required artifact paths.
- [ ] Add source and lane validators for 16 cards, 6 routines, 10 take-home series slips, 8 optional prompts, exact world/age mapping, exact lane range split, writable blanks, product alignment, local image presence, and safety constraints.
- [ ] Add overlap guards: `worldSlugs` must reuse no more than 7 Batch50 worlds, no more than 7 Batch51 worlds, and no more than 7 Batch52 worlds.
- [ ] Add a Batch53 unsafe-language wrapper that rejects publishing/showcase/portfolio/display/perfect/rubric/assessment/spelling pressure, standalone `public`, singular/plural `address`, singular/plural `food`, and the series-specific blocked terms `episode` and `chapter book`.
- [ ] Add the builder script and package scripts `image:batch53` and `product:tabbed-folder-series-pack`.
- [ ] Update content validation counts to expect 73 local world/product images, 46 static product pages, and 46 product artifacts after Batch53 assets are generated.
- [ ] Run the focused Batch53 Vitest file until it is green.

### Task 4: Product Source, Catalog, Static Route, And Image Manifest

**Files:**
- Create: `content/product-artifacts/tabbed-folder-story-series-card-pack.json`
- Modify: `content/products/batch5-products.json`
- Modify: `src/storyData.ts`
- Modify: `src/storyData.test.ts`
- Modify: `src/App.test.tsx`
- Create: `content/image-queue/2026-06-03-batch53-images.json`

- [ ] Assemble source JSON from the lane files with `batchId` set to `2026-06-03-batch53`.
- [ ] Add the checkout-pending product page entry with `$79`, mailto-only CTA, local product image path, world summaries, bullets, best-use notes, parent steps, and safety notes.
- [ ] Add the product to `productLinks` and route/link tests.
- [ ] Add one local-only image manifest containing both `appendix-archive-lab` and the Batch53 product hero image.
- [ ] Update content validation so the Batch53 image manifest is counted and so the Batch53 source/product/artifacts are inspected.

### Task 5: Assets, Artifacts, Verification, Reviews, And Closeout

**Files:**
- Create: `public/images/plotsprout/batch53-worlds/appendix-archive-lab.jpg`
- Create: `public/images/plotsprout/batch53-worlds/appendix-archive-lab.webp`
- Create: `public/images/plotsprout/batch53/tabbed-folder-story-series-card-pack.jpg`
- Create: `public/images/plotsprout/batch53/tabbed-folder-story-series-card-pack.webp`
- Create: `content/image-runs/batch53-worlds/appendix-archive-lab.json`
- Create: `content/image-runs/batch53/tabbed-folder-story-series-card-pack.json`
- Create: `product-build/tabbed-folder-story-series-card-pack/*`
- Create: `public/tabbed-folder-story-series-card-pack/index.html`
- Modify: `TODO.md`
- Modify: `/home/sam/.codex/memories/MEMORY.md` after deploy/live smoke

- [ ] Generate local SDXL images with `PLOTSPROUT_MODELS_ROOT=/home/sam/claude-workspace/ComfyUI/models npm run image:batch53`.
- [ ] Reject or regenerate any image with pseudo-text, dark unreadable props, food/plant props that imply unsafe topics, distorted children, real brand marks, or off-product composition.
- [ ] Build the PDF/source/ZIP artifacts with `npm run product:tabbed-folder-series-pack`.
- [ ] Run `npm run verify`.
- [ ] Run local Playwright desktop/mobile product and homepage checks with browser console/page/request-error checks.
- [ ] Request content/artifact and UI/static reviews before merge.
- [ ] Commit, push the branch, fast-forward main, push main, watch GitHub Actions deploy, live smoke, close TODO with `[skip ci]`, update memory, and leave checkout pending.
