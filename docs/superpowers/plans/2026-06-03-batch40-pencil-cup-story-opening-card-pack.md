# Batch40 Pencil Cup Story Opening Card Pack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the `$53` Pencil Cup Story Opening Card Pack as the next adult-led, offline, fictional printable product.

**Architecture:** Reuse the Batch39 product architecture: lane JSON files feed a combined source JSON, a dedicated builder renders provider-ready PDF/source/ZIP artifacts, content validation enforces safety/paths/counts, and the static product page remains checkout-pending/mailto-only. Batch40 adds opening-card-specific fields and validators while preserving the same product shelf and deploy workflow.

**Tech Stack:** Vite/React data exports, Node artifact builder, Vitest, existing static renderer/content validators, local RTX 4090 SDXL image generation.

---

### Task 1: Content Lanes

**Files:**
- Create: `content/product-artifacts/lanes/batch40-pencil-cup-opening-cards-a.json`
- Create: `content/product-artifacts/lanes/batch40-pencil-cup-opening-cards-b.json`
- Create: `content/product-artifacts/lanes/batch40-pencil-cup-opening-cards-c.json`
- Create: `content/product-artifacts/lanes/batch40-pencil-cup-opening-tools.json`

- [ ] Generate three card lanes covering 16 cards across existing world slugs.
- [ ] Generate one tools lane with adult guide, six routines, ten take-home slips, and eight optional share prompts.
- [ ] Confirm all writer-facing lines use `____________________.` and avoid accounts, uploads, public posting, real identity, camera/audio/video, GPS/routes/addresses, grades/scores, timers, contests, and prizes.

### Task 2: RED Tests

**Files:**
- Create: `scripts/pencil-cup-story-opening-card-pack-builder.test.mjs`

- [ ] Add tests for the new source validator, lane-file validator, artifact path inspection, renderer, and deterministic builder.
- [ ] Run `npx vitest run scripts/pencil-cup-story-opening-card-pack-builder.test.mjs --testTimeout 20000`.
- [ ] Confirm RED fails because `validatePencilCupStoryOpeningCardPackSource` and `buildPencilCupStoryOpeningCardPack` do not exist yet.

### Task 3: Builder And Policy

**Files:**
- Create: `scripts/pencil-cup-story-opening-card-pack-builder.mjs`
- Modify: `scripts/product-artifact-policy.mjs`
- Modify: `package.json`

- [ ] Implement opening-card-specific source validation, source-file validation, unsafe-language guard, required artifact paths, and artifact inspection support.
- [ ] Implement the builder using the existing stored ZIP/PDF manifest pattern.
- [ ] Add `npm run product:pencil-cup-opening-pack`.
- [ ] Run the focused test until green.

### Task 4: Source, Product, Image, And Static Wiring

**Files:**
- Create: `content/product-artifacts/pencil-cup-story-opening-card-pack.json`
- Create: `content/image-queue/2026-06-03-batch40-product-images.json`
- Create: `content/image-runs/batch40/pencil-cup-story-opening-card-pack.json`
- Create: `public/images/plotsprout/batch40/pencil-cup-story-opening-card-pack.jpg`
- Create: `public/images/plotsprout/batch40/pencil-cup-story-opening-card-pack.webp`
- Modify: `content/products/batch5-products.json`
- Modify: `scripts/validate-content-batch.mjs`
- Modify: `src/storyData.ts`
- Modify: `src/storyData.test.ts`

- [ ] Combine lane outputs into the source JSON with 16 opening cards and matching source files.
- [ ] Add the checkout-pending product record and homepage/story data link.
- [ ] Add Batch40 image manifest validation and product artifact validation.
- [ ] Generate the local product image, inspect it, and record the sidecar.
- [ ] Run `npm run product:pencil-cup-opening-pack` and `npm run render:seo`.

### Task 5: Verification, Review, Commit, Push, Deploy

**Files:**
- Modify: `TODO.md`
- Modify: `/home/sam/.codex/memories/MEMORY.md`

- [ ] Run focused Vitest, `npm run verify:content`, `npm run verify`, `git diff --check`, PDF/ZIP/image checks, local Playwright smoke, and read-only content/code reviews.
- [ ] Commit and push Batch40 code/artifacts.
- [ ] Watch the push-triggered Deploy run to success.
- [ ] Smoke live GitHub Pages desktop/mobile and byte-match the live Batch40 image.
- [ ] Update TODO and memory, commit/push the closeout with `[skip ci]`, and keep the indefinite goal active.
