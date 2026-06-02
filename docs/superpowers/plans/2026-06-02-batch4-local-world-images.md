# Batch 4 Local World Images Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate and commit 20 local RTX 4090 world images for the strongest Batch 1 worlds, with JPEG/WebP assets, prompt sidecars, and validation.

**Architecture:** Keep Batch 4 as committed source data plus static assets. A manifest under `content/image-queue/` selects the 20 worlds and records output paths; `scripts/generate_story_images_local.py` reads that manifest and writes local SDXL JPEG/WebP files plus run sidecars; `scripts/validate-content-batch.mjs` verifies the manifest, sidecars, image dimensions, and static gallery output.

**Tech Stack:** Node.js validation/rendering, Python 3 local Diffusers SDXL generation, RTX 4090 CUDA, committed JSON content, Vite/GitHub Pages deployed by push-triggered self-hosted runner.

---

### Task 1: RED Batch 4 Contract

**Files:**
- Modify: `scripts/validate-content-batch.mjs`
- Create: `content/image-queue/2026-06-02-batch4-world-images.json`

- [ ] **Step 1: Add failing Batch 4 validation**

Require `content/image-queue/2026-06-02-batch4-world-images.json` with:

- `batchId` equals `2026-06-02-batch4`
- `generatedAt` equals `2026-06-02`
- exactly 20 `images`
- unique slugs
- each slug references a Batch 1 world
- each image records `title`, `ageBand`, `seoLane`, `sourceWorldFile`, `prompt`, `outputJpeg`, `outputWebp`, and `sidecar`
- prompt includes `family-friendly`, `no text`, `no letters`, `no logos`, `no watermark`, `no branded characters`, `no scary harm`, and `no weapons`
- output paths stay under `public/images/plotsprout/batch4/`
- sidecars stay under `content/image-runs/batch4/`
- JPEG and WebP outputs exist, are at least 1344x768, and sidecars record model/settings/output paths

- [ ] **Step 2: Verify RED**

Run: `npm run verify:content`

Expected: FAIL because the Batch 4 manifest and assets do not exist yet.

### Task 2: Select Top Worlds and Manifest

**Files:**
- Create: `content/image-queue/2026-06-02-batch4-world-images.json`

- [ ] **Step 1: Select 20 worlds**

Balance selections across lower/middle/upper age bands and the four SEO lanes. Prefer worlds with clear printable value, visually distinct settings, and useful classroom/homeschool positioning.

- [ ] **Step 2: Write manifest**

For each selected world, copy the approved `imagePrompt` from Batch 1, add deterministic output paths, and keep the prompt family-safe. Do not add cloud-provider references or unsafe visual concepts.

- [ ] **Step 3: Verify manifest-only failure**

Run: `npm run verify:content`

Expected: FAIL only because image files or sidecars are missing.

### Task 3: Local Generator Batch Support

**Files:**
- Modify: `scripts/generate_story_images_local.py`
- Modify: `package.json`

- [ ] **Step 1: Add manifest CLI**

Add `--manifest content/image-queue/2026-06-02-batch4-world-images.json` support while preserving existing starter `--only` and `--all` behavior.

- [ ] **Step 2: Write JPEG and WebP**

For manifest entries, save:

- `public/images/plotsprout/batch4/<slug>.jpg`
- `public/images/plotsprout/batch4/<slug>.webp`
- `content/image-runs/batch4/<slug>.json`

Use SDXL base, CUDA, 1344x768 or larger, 42 steps, JPEG/WebP quality 92, deterministic seeds, and no cloud services.

- [ ] **Step 3: Add npm script**

Add `image:batch4` to run the manifest generation command.

### Task 4: Static Gallery Surface

**Files:**
- Modify: `scripts/render-seo-collections.mjs`
- Modify: `src/storyData.ts`
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`
- Generate: `public/world-gallery/index.html`

- [ ] **Step 1: Add RED homepage test**

Expect the homepage to link to `World art gallery`.

- [ ] **Step 2: Render static gallery**

Read the Batch 4 manifest and render `public/world-gallery/index.html` with 20 images, age/SEO lanes, printable angle, and source world links back to the workbench. Use escaped HTML and base-path-safe image URLs.

- [ ] **Step 3: Add compact homepage entry**

Add one compact section or card that links to `/world-gallery/`. Keep full image data out of the React bundle.

### Task 5: Generate, Verify, Review, Push

**Files:**
- Modify: `TODO.md`
- Generated assets under `public/images/plotsprout/batch4/`
- Generated sidecars under `content/image-runs/batch4/`

- [ ] **Step 1: Generate images locally**

Run: `npm run image:batch4`

Expected: 20 JPEG files, 20 WebP files, and 20 sidecar JSON files are written locally with CUDA.

- [ ] **Step 2: Full local verification**

Run: `npm run verify`

Expected: rendering, workflow policy, content validation, lint, tests, and build all pass.

- [ ] **Step 3: Browser smoke**

Run preview and verify homepage plus `/world-gallery/` load with zero console errors/warnings, images render, and mobile has no horizontal overflow.

- [ ] **Step 4: Subagent reviews**

Use read-only reviewers for image/content safety and code/deploy policy.

- [ ] **Step 5: Commit, push, deploy-check**

Commit and push Batch 4. Verify the local runner deploy succeeds and live Pages serves `/world-gallery/` plus representative JPEG/WebP assets.
