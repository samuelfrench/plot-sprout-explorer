# Batch46 Sticky Note Story Tone Card Pack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the `$65` Sticky Note Story Tone Card Pack as the next adult-led, offline, fictional printable product.

**Architecture:** Reuse the Batch45 card-pack architecture: three content lanes plus one tools lane feed a combined source JSON, a dedicated builder renders provider-ready PDF/source/ZIP artifacts, content validation enforces product safety and artifact paths, and the static product page remains checkout-pending/mailto-only. Batch46 teaches story tone without any audio or recording surface by asking writers to revise a neutral fictional line through tone word choice, object signal, place cue, character gesture, sentence frame, and final revised line while guarding against real school/home identity details, private child profiles, diary-style personal disclosures, accounts, uploads, reviews, public posting, recording, cameras, photos, audio, video, voice memos, GPS/routes/addresses, grading, scores, timer pressure, scary harm, bullying, fighting, weapons, romance, food tasting/allergy/medical advice, or real child data.

**Tech Stack:** Vite/React data exports, Node artifact builder, Vitest, existing static renderer/content validators, local RTX 4090 SDXL image generation with local ImageMagick cleanup if needed.

---

### Task 1: Content Lanes

**Files:**
- Create: `content/product-artifacts/lanes/batch46-sticky-note-tone-cards-a.json`
- Create: `content/product-artifacts/lanes/batch46-sticky-note-tone-cards-b.json`
- Create: `content/product-artifacts/lanes/batch46-sticky-note-tone-cards-c.json`
- Create: `content/product-artifacts/lanes/batch46-sticky-note-tone-tools.json`

- [ ] Generate three card lanes covering 16 cards across existing story-world slugs.
- [ ] Generate one tools lane with an adult guide, six story-tone routines, ten take-home tone slips, and eight optional adult-led offline prompts.
- [ ] Use the card fields `id`, `title`, `worldSlug`, `ageBand`, `toneSkill`, `useCase`, `adultSetup`, `kidDirection`, `neutralLinePrompt`, `toneChoicePrompt`, `wordChoicePrompt`, `objectSignalPrompt`, `placeCuePrompt`, `gestureTonePrompt`, `sentenceFramePrompt`, `reviseTonePrompt`, `quietOptionLine`, and `takeHomeLine`.
- [ ] Confirm every writer-facing line uses `____________________.` and avoids scary harm, bullying, fighting, weapons, romance, accounts, uploads, public posting, real school/home identity details, private child details, diary-style personal disclosures, camera/photo/audio/video/recording/voice-memo language, GPS/routes/addresses, grades/scores/rubrics, timers, contests, prizes, food tasting, allergy advice, and medical advice.

### Task 2: RED Tests

**Files:**
- Create: `scripts/sticky-note-story-tone-card-pack-builder.test.mjs`

- [ ] Add tests for the new source validator, lane-file validator, artifact path inspection, renderer, deterministic builder, static checkout-pending safety, exact per-lane card ranges, required story-tone fields, writable blanks, and standard source-safety requirement.
- [ ] Run `npx vitest run scripts/sticky-note-story-tone-card-pack-builder.test.mjs --testTimeout 20000`.
- [ ] Confirm RED fails because `validateStickyNoteStoryToneCardPackSource` and `buildStickyNoteStoryToneCardPack` do not exist yet.

### Task 3: Builder And Policy

**Files:**
- Create: `scripts/sticky-note-story-tone-card-pack-builder.mjs`
- Modify: `scripts/product-artifact-policy.mjs`
- Modify: `package.json`

- [ ] Implement story-tone-card-specific source validation, source-file validation, unsafe-language guards, required artifact paths, and artifact inspection support.
- [ ] Implement the builder using the existing deterministic PDF/ZIP manifest pattern.
- [ ] Add `npm run product:sticky-note-tone-pack`.
- [ ] Run `npx vitest run scripts/sticky-note-story-tone-card-pack-builder.test.mjs --testTimeout 20000` until green.

### Task 4: Source, Product, Image, And Static Wiring

**Files:**
- Create: `content/product-artifacts/sticky-note-story-tone-card-pack.json`
- Create: `content/image-queue/2026-06-03-batch46-product-images.json`
- Create: `content/image-runs/batch46/sticky-note-story-tone-card-pack.json`
- Create: `public/images/plotsprout/batch46/sticky-note-story-tone-card-pack.jpg`
- Create: `public/images/plotsprout/batch46/sticky-note-story-tone-card-pack.webp`
- Modify: `content/products/batch5-products.json`
- Modify: `scripts/validate-content-batch.mjs`
- Modify: `src/storyData.ts`
- Modify: `src/storyData.test.ts`

- [ ] Combine lane outputs into the source JSON with 16 story-tone cards and matching source files.
- [ ] Add the checkout-pending product record and homepage/story data link.
- [ ] Add Batch46 image manifest validation and product artifact validation.
- [ ] Generate the local product image, inspect file size/dimensions before viewing, and record the sidecar.
- [ ] Run `npm run product:sticky-note-tone-pack` and `npm run render:seo`.

### Task 5: Verification, Review, Commit, Push, Deploy

**Files:**
- Modify: `TODO.md`
- Modify: `/home/sam/.codex/memories/MEMORY.md`

- [ ] Run focused Vitest, `npm run verify:content`, `npm run verify`, `git diff --check`, PDF/ZIP/image checks, local Playwright desktop/mobile smoke, and read-only content/code reviews.
- [ ] Commit and push Batch46 code/artifacts.
- [ ] Watch the push-triggered Deploy run to success.
- [ ] Smoke live GitHub Pages desktop/mobile and byte-match the live Batch46 image.
- [ ] Update TODO and memory, commit/push the closeout with `[skip ci]`, and keep the indefinite goal active.
