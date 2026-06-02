# Writing Desk Story Prompt Strip Pack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Batch 27, the `$27` Writing Desk Story Prompt Strip Pack, as a checkout-pending static product page plus PDF/source/ZIP artifact.

**Architecture:** Follow the Batch 26 product pattern: three prompt-strip lane JSON files plus one tools lane feed one canonical source JSON, one product-artifact policy validator, one builder that writes source HTML/PDF/ZIP/manifest, one product page rendered by `scripts/render-seo-collections.mjs`, and one local RTX 4090 product image manifest. The product is an adult-led paper writing-desk prompt strip pack; it must not become a productivity tracker, account flow, public posting/review product, grading system, timer challenge, or child-data collection surface.

**Tech Stack:** Node ESM scripts, Vitest, Playwright/Chromium PDF generation, static HTML under `public/`, local SDXL image generation via `scripts/generate_story_images_local.py`, GitHub Pages deploy on push.

---

### Task 1: Content Lanes

**Files:**
- Create: `content/product-artifacts/lanes/batch27-desk-strips-a.json`
- Create: `content/product-artifacts/lanes/batch27-desk-strips-b.json`
- Create: `content/product-artifacts/lanes/batch27-desk-strips-c.json`
- Create: `content/product-artifacts/lanes/batch27-desk-strip-tools.json`

- [ ] Write three prompt-strip lanes covering 18 total printable desk prompt strips.
- [ ] Write one tools lane with adult guide, 6 strip routines, 10 take-home desk strips, and 8 optional share prompts.
- [ ] Keep every item adult-led, paper-only, offline, and creative-writing focused.
- [ ] Run JSON parse checks on all four lane files.
- [ ] Run safety scan for account/login/upload/public post/review/rating/score/grade/contest/prize/timer/address/GPS/photo/camera/medical/legal/therapy/grief/politics/religion/romance/weapon/violence/branded-franchise language.

### Task 2: RED Builder And Policy Tests

**Files:**
- Create: `scripts/writing-desk-story-prompt-strip-pack-builder.test.mjs`

- [ ] Add a Vitest file that imports `validateWritingDeskStoryPromptStripPackSource`, `validateWritingDeskStoryPromptStripPackSourceFiles`, `buildWritingDeskStoryPromptStripPack`, `loadWritingDeskStoryPromptStripPackBuildInputs`, and `renderWritingDeskStoryPromptStripPackHtml`.
- [ ] Fixture contract: product slug `writing-desk-story-prompt-strip-pack`, title `Writing Desk Story Prompt Strip Pack`, price `$27`, batch `2026-06-02-batch27`, 18 strip records, 6 routines, 10 take-home strips, 8 share prompts.
- [ ] Add safety regression blocking account/upload/public posting/review/rating, grade/score/timer/prize/contest, exact address/photo/contact/private child data, productivity-tracker claims, medical/legal/therapy claims, politics, religion, romance, weapon, violence, and branded/franchise language.
- [ ] Add builder test: temporary build writes `Writing-Desk-Story-Prompt-Strip-Pack.pdf`, source HTML, README, manifest, ZIP, and 18 copied local image assets.
- [ ] Add render test: HTML contains 18 `strip-page` pages, no checkout/payment copy, no account/public-posting/review/rating/tracker copy, and no artifact page overflow after images load.
- [ ] Run: `npx vitest run scripts/writing-desk-story-prompt-strip-pack-builder.test.mjs --testTimeout 30000`
- [ ] Expected RED: imports fail because the Batch 27 validator and builder do not exist yet.

### Task 3: Product Policy

**Files:**
- Modify: `scripts/product-artifact-policy.mjs`

- [ ] Export `writingDeskStoryPromptStripPackProductSlug`.
- [ ] Add required artifact paths for the Batch 27 PDF, ZIP, source HTML, and manifest.
- [ ] Add `validateWritingDeskStoryPromptStripPackSource` with exact count checks, writable blank checks, world age-band matching, checkout-pending source alignment, source-file coverage, and safety regexes.
- [ ] Add `validateWritingDeskStoryPromptStripPackSourceFiles` to require exactly three strip lane files and one tools lane, and to compare lane content byte-for-byte after ID sort.
- [ ] Route `inspectArtifactFiles` to the Batch 27 expected artifact paths.

### Task 4: Builder And Source

**Files:**
- Create: `content/product-artifacts/writing-desk-story-prompt-strip-pack.json`
- Create: `scripts/writing-desk-story-prompt-strip-pack-builder.mjs`
- Modify: `scripts/rainy-day-pack-builder.mjs`
- Modify: `package.json`

- [ ] Merge the four lane files into canonical Batch 27 source JSON.
- [ ] Add a builder modeled on `scripts/bookshop-story-bookmark-pack-builder.mjs` with 18 strip pages, adult guide page, world menu, routine page, take-home strip page, README, manifest, and ZIP.
- [ ] Update `buildProductArtifactManifest` so Batch 27 reports `sourcePageCount` from `source.strips?.length`.
- [ ] Add `product:writing-desk-strip-pack` script.

### Task 5: Product Page, App Link, Image Manifest

**Files:**
- Modify: `content/products/batch5-products.json`
- Modify: `src/storyData.ts`
- Modify: `src/storyData.test.ts`
- Modify: `scripts/validate-content-batch.mjs`
- Create: `content/image-queue/2026-06-02-batch27-product-images.json`

- [ ] Add the `$27` checkout-pending product record with `mailto:` CTA, local hero image path, included pages, use cases, parent steps, 18 world slugs, and product-specific safe world summaries.
- [ ] Add homepage product link and update `storyData.test.ts` expected slugs/prices.
- [ ] Add Batch 27 image manifest and `image:batch27` script.
- [ ] Extend `validate-content-batch.mjs` to require the product page, source file, image manifest, artifact, and checkout-pending state.
- [ ] Render pages with `npm run render:seo`.

### Task 6: Local Image And Artifact Generation

**Files:**
- Create: `public/images/plotsprout/batch27/writing-desk-story-prompt-strip-pack.jpg`
- Create: `public/images/plotsprout/batch27/writing-desk-story-prompt-strip-pack.webp`
- Create: `content/image-runs/batch27/writing-desk-story-prompt-strip-pack.json`
- Create: `product-build/writing-desk-story-prompt-strip-pack/**`
- Create: `public/writing-desk-story-prompt-strip-pack/index.html`

- [ ] Generate the product image locally on the RTX 4090 only. Reject outputs with readable/pseudo text, logos, devices, public-review/rating signals, people/faces, child data, calendars, clocks, timers, scores, or branded/copyrighted material.
- [ ] Run: `npm run product:writing-desk-strip-pack`.
- [ ] Run: `npm run render:seo`.
- [ ] Inspect PDF page count with `pdfinfo product-build/writing-desk-story-prompt-strip-pack/Writing-Desk-Story-Prompt-Strip-Pack.pdf`; expected 23 pages.
- [ ] Run: `npm run verify`.

### Task 7: Review, Deploy, Closeout

**Files:**
- Modify: `TODO.md`
- Modify: `/home/sam/.codex/memories/MEMORY.md`

- [ ] Run local Playwright smoke for `/`, `/writing-desk-story-prompt-strip-pack/`, and `/bookshop-story-bookmark-pack/` on desktop and mobile.
- [ ] Dispatch read-only spec and quality reviewers.
- [ ] Commit and push Batch 27 code/artifacts.
- [ ] Watch the push-triggered `Deploy` GitHub Actions run on the self-hosted runner.
- [ ] Run live Playwright smoke for `/`, `/writing-desk-story-prompt-strip-pack/`, and `/bookshop-story-bookmark-pack/`.
- [ ] Update `TODO.md` to mark Batch 27 shipped and set the next batch.
- [ ] Commit/push TODO closeout with `[skip ci]`.
- [ ] Update memory with shipped commits, run ID, tests, image path, billable-service state, and checkout status.
