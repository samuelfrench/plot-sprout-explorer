# Batch43 Binder Clip Story Transition Card Pack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the `$59` Binder Clip Story Transition Card Pack as the next adult-led, offline, fictional printable product.

**Architecture:** Reuse the Batch42 card-pack architecture: lane JSON files feed a combined source JSON, a dedicated builder renders provider-ready PDF/source/ZIP artifacts, content validation enforces product safety and artifact paths, and the static product page remains checkout-pending/mailto-only. Batch43 adds transition-card-specific fields for connecting one invented story moment to the next while guarding against real school/home identity details, private child profiles, accounts, uploads, reviews, public posting, grading, scores, timer pressure, scary harm, bullying, or real child data.

**Tech Stack:** Vite/React data exports, Node artifact builder, Vitest, existing static renderer/content validators, local RTX 4090 SDXL image generation with local ImageMagick cleanup if needed.

---

### Task 1: Content Lanes

**Files:**
- Create: `content/product-artifacts/lanes/batch43-binder-clip-transition-cards-a.json`
- Create: `content/product-artifacts/lanes/batch43-binder-clip-transition-cards-b.json`
- Create: `content/product-artifacts/lanes/batch43-binder-clip-transition-cards-c.json`
- Create: `content/product-artifacts/lanes/batch43-binder-clip-transition-tools.json`

- [ ] Generate three card lanes covering 16 cards across existing story-world slugs.
- [ ] Generate one tools lane with an adult guide, six transition-card routines, ten take-home transition slips, and eight optional adult-led offline prompts.
- [ ] Confirm every writer-facing line uses `____________________.` and avoids scary harm, bullying, fighting, accounts, uploads, public posting, real school/home identity details, private child details, camera/audio/video, GPS/routes/addresses, grades/scores/rubrics, timers, contests, and prizes.

### Task 2: RED Tests

**Files:**
- Create: `scripts/binder-clip-story-transition-card-pack-builder.test.mjs`

- [ ] Add tests for the new source validator, lane-file validator, artifact path inspection, renderer, deterministic builder, and standard source-safety requirement.
- [ ] Run `npx vitest run scripts/binder-clip-story-transition-card-pack-builder.test.mjs --testTimeout 20000`.
- [ ] Confirm RED fails because `validateBinderClipStoryTransitionCardPackSource` and `buildBinderClipStoryTransitionCardPack` do not exist yet.

### Task 3: Builder And Policy

**Files:**
- Create: `scripts/binder-clip-story-transition-card-pack-builder.mjs`
- Modify: `scripts/product-artifact-policy.mjs`
- Modify: `package.json`

- [ ] Implement transition-card-specific source validation, source-file validation, unsafe-language guards, required artifact paths, and artifact inspection support.
- [ ] Implement the builder using the existing deterministic PDF/ZIP manifest pattern.
- [ ] Add `npm run product:binder-clip-transition-pack`.
- [ ] Run the focused test until green.

### Task 4: Source, Product, Image, And Static Wiring

**Files:**
- Create: `content/product-artifacts/binder-clip-story-transition-card-pack.json`
- Create: `content/image-queue/2026-06-03-batch43-product-images.json`
- Create: `content/image-runs/batch43/binder-clip-story-transition-card-pack.json`
- Create: `public/images/plotsprout/batch43/binder-clip-story-transition-card-pack.jpg`
- Create: `public/images/plotsprout/batch43/binder-clip-story-transition-card-pack.webp`
- Modify: `content/products/batch5-products.json`
- Modify: `scripts/validate-content-batch.mjs`
- Modify: `src/storyData.ts`
- Modify: `src/storyData.test.ts`

- [ ] Combine lane outputs into the source JSON with 16 transition cards and matching source files.
- [ ] Add the checkout-pending product record and homepage/story data link.
- [ ] Add Batch43 image manifest validation and product artifact validation.
- [ ] Generate the local product image, inspect size/dimensions before viewing, and record the sidecar.
- [ ] Run `npm run product:binder-clip-transition-pack` and `npm run render:seo`.

### Task 5: Verification, Review, Commit, Push, Deploy

**Files:**
- Modify: `TODO.md`
- Modify: `/home/sam/.codex/memories/MEMORY.md`

- [ ] Run focused Vitest, `npm run verify:content`, `npm run verify`, `git diff --check`, PDF/ZIP/image checks, local Playwright desktop/mobile smoke, and read-only content/code reviews.
- [ ] Commit and push Batch43 code/artifacts.
- [ ] Watch the push-triggered Deploy run to success.
- [ ] Smoke live GitHub Pages desktop/mobile and byte-match the live Batch43 image.
- [ ] Update TODO and memory, commit/push the closeout with `[skip ci]`, and keep the indefinite goal active.
