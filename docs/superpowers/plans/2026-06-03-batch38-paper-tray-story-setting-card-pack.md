# Paper Tray Story Setting Card Pack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Batch 38, a `$49` static printable product page and provider-ready artifact for an adult-led fictional Paper Tray Story Setting Card Pack.

**Architecture:** Follow the Batch 37 product-pack pattern: strict JSON source lanes, one consolidated product artifact source, a deterministic HTML/PDF/ZIP builder, product-policy validators, content-batch validators, static SEO rendering, local RTX 4090 product image sidecar, and push-triggered self-hosted deploy. Keep checkout provider-gated and mailto-only.

**Tech Stack:** Vite/React/TypeScript, Node ESM scripts, Vitest, Playwright/Chromium PDF generation, local SDXL image generation through `scripts/generate_story_images_local.py`, GitHub Pages deploy on a self-hosted runner.

---

### Task 1: Source Plan And Content Lanes

**Files:**
- Create: `content/product-artifacts/lanes/batch38-paper-tray-setting-cards-a.json`
- Create: `content/product-artifacts/lanes/batch38-paper-tray-setting-cards-b.json`
- Create: `content/product-artifacts/lanes/batch38-paper-tray-setting-cards-c.json`
- Create: `content/product-artifacts/lanes/batch38-paper-tray-setting-tools.json`
- Create: `content/product-artifacts/paper-tray-story-setting-card-pack.json`

- [ ] Generate three card lanes with 16 total setting cards across the established 16 fictional worlds.
- [ ] Generate one tools lane with adult guide, 6 setting routines, 10 take-home setting slips, and 8 optional share prompts.
- [ ] Consolidate the lanes into the source JSON with `batchId: "2026-06-03-batch38"` and `productSlug: "paper-tray-story-setting-card-pack"`.
- [ ] Use only fictional paper setting practice. Ban real classroom/home/office room details, addresses, school details, routes, GPS, accounts, uploads, public posting, reviews, photos, cameras, recordings, real child data, grading, timers, contests, and branded characters.

### Task 2: RED Tests

**Files:**
- Create: `scripts/paper-tray-story-setting-card-pack-builder.test.mjs`

- [ ] Write tests that import the new builder and validator names before they exist.
- [ ] Cover valid source acceptance, missing writable-blank rejection, unsafe real-room/school/address/route/GPS/account/upload/public-posting/photo/camera language rejection, source lane reproduction, deterministic artifact rebuild, static checkout-pending behavior, page-count expectations, route wiring, image sidecar coverage, and product-summary guardrails.
- [ ] Run `npx vitest run scripts/paper-tray-story-setting-card-pack-builder.test.mjs --testTimeout 15000`.
- [ ] Confirm the first run fails because the Batch 38 builder/validators are missing.

### Task 3: Builder, Validators, Product Data, And Route Wiring

**Files:**
- Create: `scripts/paper-tray-story-setting-card-pack-builder.mjs`
- Modify: `scripts/product-artifact-policy.mjs`
- Modify: `scripts/validate-content-batch.mjs`
- Modify: `package.json`
- Modify: `content/products/batch5-products.json`
- Modify: `src/storyData.ts`
- Modify: `src/storyData.test.ts`

- [ ] Add builder exports named `buildPaperTrayStorySettingCardPack`, `loadPaperTrayStorySettingCardPackBuildInputs`, and `renderPaperTrayStorySettingCardPackHtml`.
- [ ] Add product-policy exports named `validatePaperTrayStorySettingCardPackSource` and `validatePaperTrayStorySettingCardPackSourceFiles`.
- [ ] Add `product:paper-tray-setting-pack` and `image:batch38` scripts.
- [ ] Add the static product record with price `$49`, checkout status `checkout_pending`, mailto CTA, world summaries, and no checkout URL.
- [ ] Add homepage product-link wiring and update the product-slug test.
- [ ] Extend `validate-content-batch` to require the Batch 38 source, product artifact, product image manifest/sidecar, rendered static page, checkout-pending state, and final product/artifact counts.

### Task 4: Local Product Image And Artifacts

**Files:**
- Create: `content/image-queue/2026-06-03-batch38-product-images.json`
- Create: `content/image-runs/batch38/paper-tray-story-setting-card-pack.json`
- Create: `public/images/plotsprout/batch38/paper-tray-story-setting-card-pack.jpg`
- Create: `public/images/plotsprout/batch38/paper-tray-story-setting-card-pack.webp`
- Create: `product-build/paper-tray-story-setting-card-pack/**`
- Create: `public/paper-tray-story-setting-card-pack/index.html`

- [ ] Generate the product image locally on the RTX 4090 with high-quality settings.
- [ ] Reject pseudo-text, readable writing, real classroom/home/office room cues, school labels, address/street/GPS cues, people, hands, phones, cameras, recordings, child faces, public-posting/social-media cues, laptops/screens, plants/cups/containers, and brand marks.
- [ ] Build the PDF/source/ZIP artifact with `npm run product:paper-tray-setting-pack`.
- [ ] Render static SEO pages with `npm run render:seo`.

### Task 5: Verification, Review, Deploy, And Closeout

**Files:**
- Modify: `TODO.md`
- Modify: `/home/sam/.codex/memories/MEMORY.md`

- [ ] Run the focused Batch 38 Vitest file.
- [ ] Run `npm run verify`.
- [ ] Run local browser smoke for `/` and `/paper-tray-story-setting-card-pack/` on desktop and mobile with no console errors and no horizontal overflow.
- [ ] Run two read-only gpt-5.5/xhigh reviews: spec/safety and code/artifact.
- [ ] Commit implementation and artifacts, push to `origin/main`, and watch the self-hosted deploy run to success.
- [ ] Smoke-test the live homepage, Batch 38 route, and Batch 38 image.
- [ ] Record TODO closeout, memory closeout, and keep the active goal open.
