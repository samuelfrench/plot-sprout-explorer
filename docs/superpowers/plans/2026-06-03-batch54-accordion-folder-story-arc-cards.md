# Batch54 Accordion Folder Story Arc Card Pack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the `$81` Accordion Folder Story Arc Card Pack as a static checkout-pending Plot Sprout product with source JSON, lane files, local product image, PDF/source/ZIP artifacts, tests, deploy, TODO closeout, and memory update.

**Architecture:** Follow the Batch53 product-pack architecture: three card lane JSON files and one tools lane feed a canonical source JSON file; validators enforce exact schema, safety, lane coverage, world/age alignment, product/catalog alignment, artifact paths, image manifest coverage, and checkout-pending status; a dedicated builder renders deterministic printable HTML/PDF/ZIP artifacts; the existing static renderer publishes the product route from `content/products/batch5-products.json`. Batch54 extends story-series work into private paper story-arc control: beginning, middle change, choice bridge, consequence, ending return, and folder reset, all adult-led, offline, paper-only, mailto-only, and provider-pending.

**Tech Stack:** Vite, React, Vitest, Node ESM scripts, Playwright, local RTX4090 SDXL image generation through `scripts/generate_story_images_local.py`.

---

### Task 1: Batch54 Content Contract And Lanes

**Files:**
- Create: `content/product-artifacts/lanes/batch54-accordion-folder-story-arc-cards-a.json`
- Create: `content/product-artifacts/lanes/batch54-accordion-folder-story-arc-cards-b.json`
- Create: `content/product-artifacts/lanes/batch54-accordion-folder-story-arc-cards-c.json`
- Create: `content/product-artifacts/lanes/batch54-accordion-folder-story-arc-tools.json`

- [ ] Write cards 01-06, 07-11, and 12-16.
- [ ] Use fields `id`, `title`, `worldSlug`, `ageBand`, `arcSkill`, `useCase`, `adultSetup`, `kidDirection`, `beginningPrompt`, `middleChangePrompt`, `choiceBridgePrompt`, `consequencePrompt`, `endingReturnPrompt`, `arcFolderPrompt`, `quietOptionLine`, and `takeHomeLine`.
- [ ] Use this exact world set in this order: `acorn-avenue-errand-office`, `button-bakery-map-mixup`, `teacup-town-weather-window`, `sticker-station-mail-cart`, `spoon-ferry-lunchbox-harbor`, `solar-oven-picnic-station`, `paperclip-plaza-parcel-day`, `penny-path-compass-shop`, `tidepool-timekeepers-lab`, `rain-gauge-railway`, `compost-clock-workshop`, `seed-library-map-room`, `moss-message-observatory`, `clue-label-tower-museum`, `compass-craft-academy`, `greenhouse-gear-garden`.
- [ ] This world set must overlap Batch50 in exactly 6 worlds, Batch51 in exactly 6 worlds, Batch52 in exactly 7 worlds, and Batch53 in exactly 5 worlds.
- [ ] Write tools with `adultGuide`, `arcRoutines`, `takeHomeArcSlips`, and `optionalAdultPrompts`.
- [ ] Keep every value ASCII, fictional, adult-led, offline, paper-only, and with writable blanks where applicable.
- [ ] Avoid unsafe terms: no grades, scores, timers, uploads, recording, camera/photo/audio/video/voice-memo flow, public posting, accounts, real school/home identity details, private child profiles, diary-style personal disclosures, spelling grades, food/allergy/medical advice, or real child data.
- [ ] Avoid publishing/display pressure and assessment language: no "publish", "publication", "showcase", "portfolio", "display", "perfect", "rubric", "assessment", "share online", "episode", "chapter book", or provider/payment terms. Use "page", "story arc", "accordion folder", and "paper folder" language.

### Task 2: RED Tests

**Files:**
- Create: `scripts/accordion-folder-story-arc-card-pack-builder.test.mjs`

- [ ] Add failing tests that import nonexistent Batch54 validator and builder exports:
  - `validateAccordionFolderStoryArcCardPackSource`
  - `validateAccordionFolderStoryArcCardPackSourceFiles`
  - `buildAccordionFolderStoryArcCardPack`
  - `renderAccordionFolderStoryArcCardPackHtml`
- [ ] Assert source schema, exact lane paths, lane range ownership, exact world set, Batch50/51/52/53 overlap caps, banned publishing/portfolio/display/grading/upload/recording/private-data terms, standalone `public`/`address`/`food` terms, rendered arc fields, artifact path inspection, deterministic builder output, and committed product checkout-pending state.
- [ ] Add a test that requires the product hero image manifest entry and all card-world local images before final artifact validation can pass.
- [ ] Run `npx vitest run scripts/accordion-folder-story-arc-card-pack-builder.test.mjs --testTimeout 15000` and confirm the expected import/export failure before implementation.

### Task 3: Validator And Builder Integration

**Files:**
- Modify: `scripts/product-artifact-policy.mjs`
- Modify: `scripts/validate-content-batch.mjs`
- Modify: `scripts/validate-content-batch.test.mjs`
- Create: `scripts/accordion-folder-story-arc-card-pack-builder.mjs`
- Modify: `package.json`

- [ ] Add the Batch54 slug `accordion-folder-story-arc-card-pack` and required artifact paths.
- [ ] Add source and lane validators for 16 cards, 6 routines, 10 take-home arc slips, 8 optional prompts, exact world/age mapping, exact lane range split, writable blanks, product alignment, local image presence, product hero manifest presence, and safety constraints.
- [ ] Add overlap guards: `worldSlugs` must overlap Batch50 in exactly 6 worlds, Batch51 in exactly 6 worlds, Batch52 in exactly 7 worlds, and Batch53 in exactly 5 worlds.
- [ ] Add a Batch54 unsafe-language wrapper that rejects publishing/showcase/portfolio/display/perfect/rubric/assessment/spelling pressure, standalone `public`, singular/plural `address`, singular/plural `food`, and the arc-specific blocked terms `episode` and `chapter book`.
- [ ] Add the builder script and package scripts `image:batch54` and `product:accordion-folder-arc-pack`.
- [ ] Update content validation counts to expect 74 local world/product images, 47 static product pages, and 47 product artifacts after Batch54 assets are generated.
- [ ] Run the focused Batch54 Vitest file until it is green.

### Task 4: Product Source, Catalog, Static Route, And Image Manifest

**Files:**
- Create: `content/product-artifacts/accordion-folder-story-arc-card-pack.json`
- Modify: `content/products/batch5-products.json`
- Modify: `src/storyData.ts`
- Modify: `src/storyData.test.ts`
- Modify: `src/App.test.tsx`
- Create: `content/image-queue/2026-06-03-batch54-images.json`

- [ ] Assemble source JSON from the lane files with `batchId` set to `2026-06-03-batch54`.
- [ ] Add the checkout-pending product page entry with `$81`, mailto-only CTA, local product image path, world summaries, bullets, best-use notes, parent steps, and safety notes.
- [ ] Add the product to `productLinks` and route/link tests.
- [ ] Add one local-only image manifest containing the Batch54 product hero image `accordion-folder-story-arc-card-pack`.
- [ ] Update content validation so the Batch54 image manifest is counted and so the Batch54 source/product/artifacts are inspected.

### Task 5: Assets, Artifacts, Verification, Reviews, And Closeout

**Files:**
- Create: `public/images/plotsprout/batch54/accordion-folder-story-arc-card-pack.jpg`
- Create: `public/images/plotsprout/batch54/accordion-folder-story-arc-card-pack.webp`
- Create: `content/image-runs/batch54/accordion-folder-story-arc-card-pack.json`
- Create: `product-build/accordion-folder-story-arc-card-pack/*`
- Create: `public/accordion-folder-story-arc-card-pack/index.html`
- Modify: `TODO.md`
- Modify: `/home/sam/.codex/memories/MEMORY.md` after deploy/live smoke

- [ ] Generate the local SDXL product image with `PLOTSPROUT_MODELS_ROOT=/home/sam/claude-workspace/ComfyUI/models npm run image:batch54`.
- [ ] Reject or regenerate any image with pseudo-text, dark unreadable props, food props, distorted children, real brand marks, or off-product composition.
- [ ] Build the PDF/source/ZIP artifacts with `npm run product:accordion-folder-arc-pack`.
- [ ] Run `npm run verify`.
- [ ] Run local Playwright desktop/mobile product and homepage checks with browser console/page/request-error checks.
- [ ] Request content/artifact and UI/static reviews before merge.
- [ ] Commit, push the branch, fast-forward main, push main, watch GitHub Actions deploy, live smoke, close TODO with `[skip ci]`, update memory, and leave checkout pending.
