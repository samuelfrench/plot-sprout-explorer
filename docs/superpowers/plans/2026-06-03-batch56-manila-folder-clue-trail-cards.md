# Batch56 Manila Folder Story Clue Trail Card Pack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the `$85` Manila Folder Story Clue Trail Card Pack as a static checkout-pending Plot Sprout product with source JSON, lane files, local product image, PDF/source/ZIP artifacts, tests, deploy, TODO closeout, and memory update.

**Architecture:** Follow the Batch55 product-pack architecture: three card lane JSON files and one tools lane feed a canonical source JSON file; validators enforce exact schema, safety, lane coverage, world/age alignment, product/catalog alignment, artifact paths, image manifest coverage, and checkout-pending status; a dedicated builder renders deterministic printable HTML/PDF/ZIP artifacts; the existing static renderer publishes the product route from `content/products/batch5-products.json`. Batch56 keeps the product narrow: manila-folder clue-trail continuity cards that help a writer connect first clue, next clue, turning clue, mismatch, return clue, and folder label note in fictional paper-only scenes.

**Tech Stack:** Vite, React, Vitest, Node ESM scripts, Playwright, local RTX4090 SDXL image generation through `scripts/generate_story_images_local.py`.

---

### Task 1: Batch56 Content Contract And Lanes

**Files:**
- Create: `content/product-artifacts/lanes/batch56-manila-folder-clue-trail-cards-a.json`
- Create: `content/product-artifacts/lanes/batch56-manila-folder-clue-trail-cards-b.json`
- Create: `content/product-artifacts/lanes/batch56-manila-folder-clue-trail-cards-c.json`
- Create: `content/product-artifacts/lanes/batch56-manila-folder-clue-trail-tools.json`

- [ ] Write cards 01-06, 07-11, and 12-16.
- [ ] Use fields in this exact order: `id`, `title`, `worldSlug`, `ageBand`, `clueSkill`, `useCase`, `adultSetup`, `kidDirection`, `firstCluePrompt`, `nextCluePrompt`, `turningCluePrompt`, `mismatchPrompt`, `returnCluePrompt`, `folderLabelPrompt`, `quietOptionLine`, and `takeHomeLine`.
- [ ] Use this exact world set in this order: `teacup-town-weather-window`, `spoon-ferry-lunchbox-harbor`, `sticker-station-mail-cart`, `chapter-gate-greenhouse`, `paperclip-plaza-parcel-day`, `orchard-pulley-post`, `appendix-archive-lab`, `penny-path-compass-shop`, `pantry-measurement-mystery`, `blue-pencil-observatory`, `rain-gauge-railway`, `binding-day-boardwalk`, `seed-library-map-room`, `mitten-market-lost-ticket`, `cloudberry-clocktower`, `rain-boot-route-rangers`.
- [ ] This world set must overlap Batch51 in exactly 7 worlds, Batch52 in exactly 7 worlds, Batch53 in exactly 7 worlds, Batch54 in exactly 7 worlds, and Batch55 in exactly 7 worlds.
- [ ] Write tools with `adultGuide`, `clueTrailRoutines`, `takeHomeClueSlips`, and `optionalAdultPrompts`.
- [ ] Keep every value ASCII, fictional, adult-led, offline, paper-only, and with writable blanks where applicable.
- [ ] Avoid unsafe terms: no grades, scores, timers, uploads, recording, camera/photo/audio/video/voice-memo flow, public posting, accounts, real school/home identity details, private child profiles, diary-style personal disclosures, spelling grades, food/allergy/medical advice, or real child data.
- [ ] Avoid publishing/display pressure and assessment language: no "publish", "publication", "showcase", "portfolio", "display", "perfect", "rubric", "assessment", "share online", "episode", "chapter book", "screenplay", or provider/payment terms. Use "page", "clue trail", "manila folder", and "folder label" language.

### Task 2: RED Tests

**Files:**
- Create: `scripts/manila-folder-story-clue-trail-card-pack-builder.test.mjs`

- [ ] Add failing tests that import nonexistent Batch56 validator and builder exports:
  - `validateManilaFolderStoryClueTrailCardPackSource`
  - `validateManilaFolderStoryClueTrailCardPackSourceFiles`
  - `buildManilaFolderStoryClueTrailCardPack`
  - `renderManilaFolderStoryClueTrailCardPackHtml`
- [ ] Assert source schema, exact lane paths, lane range ownership, exact world set, Batch51/52/53/54/55 overlap counts, banned publishing/portfolio/display/grading/upload/recording/private-data terms, standalone `public`/`address`/`food` terms, rendered clue-trail fields, artifact path inspection, deterministic builder output, and committed product checkout-pending state.
- [ ] Add a test that requires the product hero image manifest entry and all card-world local images before final artifact validation can pass.
- [ ] Run `npx vitest run scripts/manila-folder-story-clue-trail-card-pack-builder.test.mjs --testTimeout 15000` and confirm the expected import/export failure before implementation.

### Task 3: Validator And Builder Integration

**Files:**
- Modify: `scripts/product-artifact-policy.mjs`
- Modify: `scripts/validate-content-batch.mjs`
- Modify: `scripts/validate-content-batch.test.mjs`
- Create: `scripts/manila-folder-story-clue-trail-card-pack-builder.mjs`
- Modify: `package.json`

- [ ] Add the Batch56 slug `manila-folder-story-clue-trail-card-pack` and required artifact paths.
- [ ] Add source and lane validators for 16 cards, 6 routines, 10 take-home clue slips, 8 optional prompts, exact world/age mapping, exact lane range split, writable blanks, product alignment, local image presence, product hero manifest presence, and safety constraints.
- [ ] Add overlap guards: `worldSlugs` must overlap Batch51, Batch52, Batch53, Batch54, and Batch55 in exactly 7 worlds each.
- [ ] Add a Batch56 unsafe-language wrapper that rejects publishing/showcase/portfolio/display/perfect/rubric/assessment/spelling pressure, standalone `public`, singular/plural `address`, singular/plural `food`, and clue-trail blocked terms `episode`, `chapter book`, and `screenplay`.
- [ ] Add the builder script and package scripts `image:batch56` and `product:manila-folder-clue-trail-pack`.
- [ ] Update content validation counts to expect 76 local world/product images, 49 static product pages, and 49 product artifacts after Batch56 assets are generated.
- [ ] Run the focused Batch56 Vitest file until it is green.

### Task 4: Product Source, Catalog, Static Route, And Image Manifest

**Files:**
- Create: `content/product-artifacts/manila-folder-story-clue-trail-card-pack.json`
- Modify: `content/products/batch5-products.json`
- Modify: `src/storyData.ts`
- Modify: `src/storyData.test.ts`
- Modify: `src/App.test.tsx`
- Create: `content/image-queue/2026-06-03-batch56-images.json`

- [ ] Assemble source JSON from the lane files with `batchId` set to `2026-06-03-batch56`.
- [ ] Add the checkout-pending product page entry with `$85`, mailto-only CTA, local product image path, world summaries, bullets, best-use notes, parent steps, and safety notes.
- [ ] Add the product to `productLinks` and route/link tests.
- [ ] Add one local-only image manifest containing the Batch56 product hero image `manila-folder-story-clue-trail-card-pack`.
- [ ] Update content validation so the Batch56 image manifest is counted and so the Batch56 source/product/artifacts are inspected.

### Task 5: Assets, Artifacts, Verification, Reviews, And Closeout

**Files:**
- Create: `public/images/plotsprout/batch56/manila-folder-story-clue-trail-card-pack.jpg`
- Create: `public/images/plotsprout/batch56/manila-folder-story-clue-trail-card-pack.webp`
- Create: `content/image-runs/batch56/manila-folder-story-clue-trail-card-pack.json`
- Create: `product-build/manila-folder-story-clue-trail-card-pack/*`
- Create: `public/manila-folder-story-clue-trail-card-pack/index.html`
- Modify: `TODO.md`
- Modify: `/home/sam/.codex/memories/MEMORY.md` after deploy/live smoke

- [ ] Generate the local SDXL product image with `PLOTSPROUT_MODELS_ROOT=/home/sam/claude-workspace/ComfyUI/models PLOTSPROUT_SDXL_VAE=checkpoint npm run image:batch56`.
- [ ] Reject or regenerate any image with pseudo-text, dark unreadable props, food props, distorted children, real brand marks, or off-product composition.
- [ ] Build the PDF/source/ZIP artifacts with `npm run product:manila-folder-clue-trail-pack`.
- [ ] Run `npm run verify`.
- [ ] Run local Playwright desktop/mobile product and homepage checks with browser console/page-error checks.
- [ ] Request content/artifact and UI/static reviews before merge.
- [ ] Commit, push the branch, fast-forward main, push main, watch GitHub Actions deploy, live smoke, close TODO with `[skip ci]`, update memory, and leave checkout pending.
