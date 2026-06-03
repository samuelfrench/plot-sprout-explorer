# Batch 33 Desk Drawer Story Sequence Card Pack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `$39` Desk Drawer Story Sequence Card Pack as the next adult-led printable creative-writing product.

**Architecture:** Follow the Batch 32 product-pack pattern: three card lane JSON files, one tools lane JSON file, one canonical source JSON, product catalog wiring, static page rendering, local product image manifest, deterministic PDF/ZIP builder, and content-policy validation. Keep checkout provider-gated and `mailto:` only.

**Tech Stack:** Vite/React static data, Node/Vitest/Playwright artifact builders, local SDXL image generation on RTX 4090, GitHub Pages deploy through the existing self-hosted runner.

---

### Task 1: Content Lanes

**Files:**
- Create: `content/product-artifacts/lanes/batch33-desk-drawer-sequence-cards-a.json`
- Create: `content/product-artifacts/lanes/batch33-desk-drawer-sequence-cards-b.json`
- Create: `content/product-artifacts/lanes/batch33-desk-drawer-sequence-cards-c.json`
- Create: `content/product-artifacts/lanes/batch33-desk-drawer-sequence-tools.json`

- [ ] Generate 16 adult-led fictional desk-drawer sequence cards across the same 16 image-backed worlds used by Batch 32.
- [ ] Generate adult guide tools, 6 sequence routines, 10 take-home sequence slips, and 8 optional share prompts.
- [ ] Keep all writable prompt fields filled with `____________________`.
- [ ] Reject account/login, grading, scores, reviews, uploads, photos, public posting, real child data, private details, branded/franchise, and unsafe language.

### Task 2: RED Tests

**Files:**
- Create: `scripts/desk-drawer-story-sequence-card-pack-builder.test.mjs`

- [ ] Add policy tests for the Batch 33 source validator.
- [ ] Add builder tests for loading committed source/product/world/image inputs, rendering printable HTML, building temporary artifacts, and deterministic real PDF/ZIP output.
- [ ] Add an artifact path regression test proving `inspectArtifactFiles()` uses the Batch 33 expected paths.
- [ ] Run the focused test and observe RED from the missing Batch 33 builder/validator exports.

### Task 3: Validator And Builder

**Files:**
- Modify: `scripts/product-artifact-policy.mjs`
- Create: `scripts/desk-drawer-story-sequence-card-pack-builder.mjs`
- Modify: `package.json`

- [ ] Add the Batch 33 product slug and required artifact path constants.
- [ ] Add sequence-card source validation with allowed sequence skills and time values.
- [ ] Add source-file reproducibility validation for the three card lanes plus one tools lane.
- [ ] Implement the deterministic builder by following the Batch 32 PDF/ZIP/manifest pattern with desk-drawer sequence naming.
- [ ] Add `npm run product:desk-drawer-sequence-pack`.

### Task 4: Product And Static Wiring

**Files:**
- Create: `content/product-artifacts/desk-drawer-story-sequence-card-pack.json`
- Create: `content/image-queue/2026-06-02-batch33-product-images.json`
- Modify: `content/products/batch5-products.json`
- Modify: `scripts/validate-content-batch.mjs`
- Modify: `src/storyData.ts`
- Modify: `src/storyData.test.ts`

- [ ] Assemble the canonical Batch 33 source JSON from lane files.
- [ ] Add product catalog copy with `checkout_pending`, `mailto:` CTA, local hero path, included pages, use cases, adult steps, and per-world summaries.
- [ ] Extend content validation for the Batch 33 image manifest, source file, product record, rendered page safety scan, artifacts, checkout readiness, and final artifact count.
- [ ] Add the homepage product link and expected product slug/price tests.

### Task 5: Image, Artifact, Verification, Deploy

**Files:**
- Create: `public/images/plotsprout/batch33/desk-drawer-story-sequence-card-pack.jpg`
- Create: `public/images/plotsprout/batch33/desk-drawer-story-sequence-card-pack.webp`
- Create: `content/image-runs/batch33/desk-drawer-story-sequence-card-pack.json`
- Create: `product-build/desk-drawer-story-sequence-card-pack/**`
- Create: `public/desk-drawer-story-sequence-card-pack/index.html`
- Modify: `TODO.md`
- Modify: `/home/sam/.codex/memories/MEMORY.md`

- [ ] Generate the product image locally only, using SDXL with at least 30 steps and no cloud/paid image service.
- [ ] Build deterministic PDF/ZIP artifacts and render static SEO page output.
- [ ] Run focused RED/GREEN evidence, `npm run verify`, browser smoke locally, and two-stage subagent review.
- [ ] Commit, push, watch the self-hosted deploy, run live desktop/mobile Playwright smoke, update `TODO.md`, push `[skip ci]` closeout, and update memory.
