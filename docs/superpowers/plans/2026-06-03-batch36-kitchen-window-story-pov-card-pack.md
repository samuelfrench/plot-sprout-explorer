# Kitchen Window Story Point-of-View Card Pack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Batch 36, a `$45` static printable product page and provider-ready artifact for an adult-led fictional Kitchen Window Story Point-of-View Card Pack.

**Architecture:** Follow the Batch 35 product-pack pattern: strict JSON source lanes, one consolidated product artifact source, a deterministic HTML/PDF/ZIP builder, product-policy validators, content-batch validators, static SEO rendering, local RTX 4090 product image sidecar, and push-triggered self-hosted deploy. Keep checkout provider-gated and mailto-only.

**Tech Stack:** Vite/React/TypeScript, Node ESM scripts, Vitest, Playwright/Chromium PDF generation, local SDXL image generation through `scripts/generate_story_images_local.py`, GitHub Pages deploy on a self-hosted runner.

---

### Task 1: Source Plan And Content Lanes

**Files:**
- Create: `content/product-artifacts/lanes/batch36-kitchen-window-pov-cards-a.json`
- Create: `content/product-artifacts/lanes/batch36-kitchen-window-pov-cards-b.json`
- Create: `content/product-artifacts/lanes/batch36-kitchen-window-pov-cards-c.json`
- Create: `content/product-artifacts/lanes/batch36-kitchen-window-pov-tools.json`
- Create: `content/product-artifacts/kitchen-window-story-pov-card-pack.json`

- [ ] Generate three card lanes with 16 total point-of-view cards across the established 16 fictional worlds.
- [ ] Generate one tools lane with adult guide, 6 point-of-view routines, 10 take-home POV slips, and 8 optional share prompts.
- [ ] Consolidate the lanes into the source JSON with `batchId: "2026-06-03-batch36"` and `productSlug: "kitchen-window-story-pov-card-pack"`.
- [ ] Use only fictional paper viewpoint practice. Ban real home details, real windows, addresses, GPS, routes, outdoor safety instructions, accounts, uploads, public posting, reviews, photos, cameras, recordings, real child data, grading, timers, contests, and branded characters.

### Task 2: RED Tests

**Files:**
- Create: `scripts/kitchen-window-story-pov-card-pack-builder.test.mjs`

- [ ] Write tests that import the new builder and validator names before they exist.
- [ ] Cover valid source acceptance, missing writable-blank rejection, unsafe real-home/window/location/account/upload/public-posting/photo/camera language rejection, source lane reproduction, deterministic artifact rebuild, static checkout-pending behavior, page-count expectations, route wiring, image sidecar coverage, and product-summary guardrails.
- [ ] Run `npx vitest run scripts/kitchen-window-story-pov-card-pack-builder.test.mjs --testTimeout 15000`.
- [ ] Confirm the first run fails because the Batch 36 builder/validators are missing.

### Task 3: Builder, Validators, Product Data, And Route Wiring

**Files:**
- Create: `scripts/kitchen-window-story-pov-card-pack-builder.mjs`
- Modify: `scripts/product-artifact-policy.mjs`
- Modify: `scripts/validate-content-batch.mjs`
- Modify: `package.json`
- Modify: `content/products/batch5-products.json`
- Modify: `src/storyData.ts`
- Modify: `src/storyData.test.ts`

- [ ] Add builder exports named `buildKitchenWindowStoryPovCardPack`, `loadKitchenWindowStoryPovCardPackBuildInputs`, and `renderKitchenWindowStoryPovCardPackHtml`.
- [ ] Add product-policy exports named `validateKitchenWindowStoryPovCardPackSource` and `validateKitchenWindowStoryPovCardPackSourceFiles`.
- [ ] Add `product:kitchen-window-pov-pack` and `image:batch36` scripts.
- [ ] Add the static product record with price `$45`, checkout status `checkout_pending`, mailto CTA, world summaries, and no checkout URL.
- [ ] Add homepage product-link wiring and update the product-slug test.
- [ ] Extend `validate-content-batch` to require the Batch 36 source, product artifact, product image manifest/sidecar, rendered static page, checkout-pending state, and final product/artifact counts.

### Task 4: Local Product Image And Artifacts

**Files:**
- Create: `content/image-queue/2026-06-03-batch36-product-images.json`
- Create: `content/image-runs/batch36/kitchen-window-story-pov-card-pack.json`
- Create: `public/images/plotsprout/batch36/kitchen-window-story-pov-card-pack.jpg`
- Create: `public/images/plotsprout/batch36/kitchen-window-story-pov-card-pack.webp`
- Create: `product-build/kitchen-window-story-pov-card-pack/**`
- Create: `public/kitchen-window-story-pov-card-pack/index.html`

- [ ] Generate the product image locally on the RTX 4090 with high-quality settings.
- [ ] Reject pseudo-text, readable writing, real books, phones, cameras, recordings, child faces, address/home/street/GPS cues, public-posting/social-media cues, and brand marks.
- [ ] Build the PDF/source/ZIP artifact with `npm run product:kitchen-window-pov-pack`.
- [ ] Render static SEO pages with `npm run render:seo`.

### Task 5: Verification, Review, Deploy, And Closeout

**Files:**
- Modify: `TODO.md`
- Modify: `/home/sam/.codex/memories/MEMORY.md`

- [ ] Run the focused Batch 36 Vitest file.
- [ ] Run `npm run verify`.
- [ ] Run local browser smoke for `/` and `/kitchen-window-story-pov-card-pack/` on desktop and mobile with no console errors and no horizontal overflow.
- [ ] Run two read-only gpt-5.5/xhigh reviews: spec/safety and code/artifact.
- [ ] Commit implementation and artifacts, push to `origin/main`, and watch the self-hosted deploy run to success.
- [ ] Smoke-test the live homepage, Batch 36 route, and Batch 36 image.
- [ ] Record TODO closeout, memory closeout, and keep the active goal open.
