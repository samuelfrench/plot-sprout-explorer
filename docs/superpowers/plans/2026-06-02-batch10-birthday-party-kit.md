# Batch 10 Birthday Party Story Quest Kit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a provider-independent `$19` Birthday Party Story Quest Kit with committed source content, a static product page, a PDF, a ZIP, a manifest, validation gates, and no checkout endpoint.

**Architecture:** Three subagent-generated lane files feed one assembled product source JSON. A dedicated builder renders printable HTML, creates the PDF/ZIP/manifest under `product-build/birthday-party-story-quest-kit/`, and existing render/validation scripts expose a static product page while preserving checkout-pending copy.

**Tech Stack:** Node ESM scripts, React/Vite static product links, Playwright PDF generation, Vitest tests, GitHub Pages deploy on self-hosted runner.

---

### Task 1: Content Lanes

**Files:**
- Create: `content/product-artifacts/lanes/batch10-birthday-quests-a.json`
- Create: `content/product-artifacts/lanes/batch10-birthday-quests-b.json`
- Create: `content/product-artifacts/lanes/batch10-birthday-party-tools.json`

- [x] Generate two quest lanes with four printable birthday party quest records each.
- [x] Generate one adult-facing tools lane with setup guide, five routines, eight extensions, and six group-share cards.
- [x] Validate JSON parses and has no checkout, account, upload, public publishing, unsafe, brand, or banned-topic language.

### Task 2: Product Source, Product Page, And Image Manifest

**Files:**
- Create: `content/product-artifacts/birthday-party-story-quest-kit.json`
- Create: `content/image-queue/2026-06-02-batch10-product-images.json`
- Modify: `content/products/batch5-products.json`
- Modify: `src/storyData.ts`
- Modify: `scripts/render-seo-collections.mjs`

- [x] Assemble eight quest records plus adult party tools into the product source.
- [x] Add a `$19` checkout-pending product record with a mailto CTA and local hero image path.
- [x] Add a homepage product shelf link.
- [x] Render a static `/birthday-party-story-quest-kit/` product page.

### Task 3: Local Image

**Files:**
- Create: `public/images/plotsprout/batch10/birthday-party-story-quest-kit.jpg`
- Create: `public/images/plotsprout/batch10/birthday-party-story-quest-kit.webp`
- Create: `content/image-runs/batch10/birthday-party-story-quest-kit.json`

- [x] Generate one local SDXL image at 1344x768 or larger, 30+ steps, JPEG quality 90+.
- [x] Save the prompt sidecar with seed, model, dimensions, steps, and output paths.
- [x] Validate dimensions and sidecar metadata through `npm run verify:content`.

### Task 4: Builder And Artifact Validation

**Files:**
- Create: `scripts/birthday-party-kit-builder.mjs`
- Create: `scripts/birthday-party-kit-builder.test.mjs`
- Modify: `scripts/product-artifact-policy.mjs`
- Modify: `scripts/validate-content-batch.mjs`
- Modify: `package.json`
- Create: `product-build/birthday-party-story-quest-kit/*`

- [x] Add a builder that loads product/source/world/image inputs, copies local assets, renders source HTML, writes PDF, manifest, README, and ZIP.
- [x] Add tests for the build entry point, HTML safety, manifest, artifact records, and printable page overflow.
- [x] Extend validation for the product record, source JSON, image manifest, artifact files, manifest hashes, ZIP entries, and checkout-pending status.
- [x] Add `npm run product:birthday-party-kit`.

### Task 5: Verify, Commit, Push, And Deploy

**Files:**
- Modify: `README.md`
- Modify: `TODO.md`
- Modify: `/home/sam/.codex/memories/MEMORY.md`

- [x] Run `npm run product:birthday-party-kit`.
- [x] Run `npm run verify`.
- [x] Run local browser smoke for root and all product pages.
- [x] Commit and push the batch.
- [x] Confirm local self-hosted runner deploy succeeds and live Pages smoke passes.
- [ ] Update TODO and memory with terse evidence.
