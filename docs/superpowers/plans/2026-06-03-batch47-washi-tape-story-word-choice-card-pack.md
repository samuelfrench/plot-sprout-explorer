# Batch47 Washi Tape Story Word Choice Card Pack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Batch47 as the `$67` Washi Tape Story Word Choice Card Pack with source JSON, lane evidence, local RTX product image, provider-ready PDF/ZIP artifacts, static product page, validation, deploy, TODO closeout, and memory.

**Architecture:** Reuse the Batch46 card-pack architecture: three card lanes plus one tools lane feed a combined source JSON, a dedicated builder renders a deterministic PDF/source HTML/ZIP artifact, content validation enforces product safety and artifact paths, and the public product page stays checkout-pending/mailto-only. Batch47 teaches word choice through paper-only fictional prompts: writers replace bland words with precise nouns, clear verbs, useful describing words, sentence swaps, and final revised lines while avoiding spelling grades, score pressure, uploads, accounts, public posting, recording, camera/photo/audio/video/voice-memo flows, real identity details, diary-style personal disclosure, and food/allergy/medical advice.

**Tech Stack:** Vite/React/TypeScript static app, Node ESM artifact builders, Vitest, Playwright, local SDXL RTX 4090 image generator, GitHub Pages deploy on push-triggered self-hosted Actions.

---

### Task 1: Plan, RED Contracts, And Batch47 Content Lanes

**Files:**
- Create: `scripts/washi-tape-story-word-choice-card-pack-builder.test.mjs`
- Create: `content/product-artifacts/lanes/batch47-washi-tape-word-choice-cards-a.json`
- Create: `content/product-artifacts/lanes/batch47-washi-tape-word-choice-cards-b.json`
- Create: `content/product-artifacts/lanes/batch47-washi-tape-word-choice-cards-c.json`
- Create: `content/product-artifacts/lanes/batch47-washi-tape-word-choice-tools.json`
- Modify: `TODO.md`

- [ ] **Step 1: Add the failing Batch47 artifact-policy test**

Create `scripts/washi-tape-story-word-choice-card-pack-builder.test.mjs` by following the Batch46 test shape, but with these Batch47 constants:

```js
const source = {
  batchId: '2026-06-03-batch47',
  generatedAt: '2026-06-03',
  productSlug: 'washi-tape-story-word-choice-card-pack',
  title: 'Washi Tape Story Word Choice Card Pack',
  pricePoint: '$67',
  sourceFiles: [
    'content/product-artifacts/lanes/batch47-washi-tape-word-choice-cards-a.json',
    'content/product-artifacts/lanes/batch47-washi-tape-word-choice-cards-b.json',
    'content/product-artifacts/lanes/batch47-washi-tape-word-choice-cards-c.json',
    'content/product-artifacts/lanes/batch47-washi-tape-word-choice-tools.json',
  ],
  artifact: {
    pdfPath: 'product-build/washi-tape-story-word-choice-card-pack/Washi-Tape-Story-Word-Choice-Card-Pack.pdf',
    zipPath: 'product-build/washi-tape-story-word-choice-card-pack/washi-tape-story-word-choice-card-pack.zip',
    sourceHtmlPath: 'product-build/washi-tape-story-word-choice-card-pack/source/washi-tape-story-word-choice-card-pack.html',
    manifestPath: 'product-build/washi-tape-story-word-choice-card-pack/manifest.json',
  },
}
```

The test must initially import missing `validateWashiTapeStoryWordChoiceCardPackSource`, `validateWashiTapeStoryWordChoiceCardPackSourceFiles`, `buildWashiTapeStoryWordChoiceCardPack`, and `renderWashiTapeStoryWordChoiceCardPackHtml` so RED fails for missing implementation.

- [ ] **Step 2: Run RED**

Run: `npx vitest run scripts/washi-tape-story-word-choice-card-pack-builder.test.mjs --testTimeout 20000`

Expected: FAIL because `scripts/washi-tape-story-word-choice-card-pack-builder.mjs` or Batch47 policy exports do not exist yet.

- [ ] **Step 3: Generate lane content**

Use three card lanes and one tools lane:

- Cards A: `washi-tape-word-choice-card-01` through `...-06`
- Cards B: `...-07` through `...-11`
- Cards C: `...-12` through `...-16`
- Tools lane: `adultGuide`, `wordChoiceRoutines`, `takeHomeWordSlips`, `optionalAdultPrompts`

Each card must include writable blanks and these fields:

```json
{
  "id": "washi-tape-word-choice-card-01",
  "title": "Specific fictional card title",
  "worldSlug": "existing-world-slug",
  "ageBand": "world age band",
  "wordChoiceSkill": "specific word-choice skill",
  "useCase": "Adult-led printable washi tape word-choice card for revising one fictional sentence: ____________________.",
  "adultSetup": "Adult: place blank paper beside the printable card and keep every example fictional: ____________________.",
  "kidDirection": "Writer: choose one bland word, then replace it with a clearer story word: ____________________.",
  "plainWordPrompt": "Plain word: write the bland word or phrase here: ____________________.",
  "preciseNounPrompt": "Precise noun: choose one invented object, place, or role word: ____________________.",
  "clearVerbPrompt": "Clear verb: choose one action word the reader can picture: ____________________.",
  "describerPrompt": "Useful describer: add one describing word that changes the picture: ____________________.",
  "sentenceSwapPrompt": "Sentence swap: rewrite the sentence with the stronger word choice: ____________________.",
  "soundShapePrompt": "Sound and shape check: mark the word that fits the sentence rhythm on paper: ____________________.",
  "finalLinePrompt": "Final line: copy the revised fictional sentence here: ____________________.",
  "quietOptionLine": "Quiet option: circle one stronger word and fill one blank: ____________________.",
  "takeHomeLine": "Take-home line: replace one plain fictional word with a clearer choice: ____________________."
}
```

Content must not include real school/home identity details, public posting, uploads, grades, scores, timers, recording, cameras, photos, audio, video, voice memos, food tasting, allergy, medical advice, frightening harm, bullying, romance, weapons, brands, or real child profiles.

- [ ] **Step 4: Validate lane JSON locally**

Run focused JSON checks:

```bash
node -e "const fs=require('fs'); for (const f of ['content/product-artifacts/lanes/batch47-washi-tape-word-choice-cards-a.json','content/product-artifacts/lanes/batch47-washi-tape-word-choice-cards-b.json','content/product-artifacts/lanes/batch47-washi-tape-word-choice-cards-c.json','content/product-artifacts/lanes/batch47-washi-tape-word-choice-tools.json']) { const j=JSON.parse(fs.readFileSync(f,'utf8')); if (!j.laneId) throw new Error(f+' missing laneId'); }"
git diff --check
```

- [ ] **Step 5: Commit plan and lane evidence**

Run:

```bash
git add docs/superpowers/plans/2026-06-03-batch47-washi-tape-story-word-choice-card-pack.md scripts/washi-tape-story-word-choice-card-pack-builder.test.mjs content/product-artifacts/lanes/batch47-washi-tape-word-choice-*.json TODO.md
git commit -m "Plan Batch47 washi tape word choice pack [skip ci]"
git push
```

### Task 2: Batch47 Builder, Policy, Product Record, And Static Integration

**Files:**
- Create: `scripts/washi-tape-story-word-choice-card-pack-builder.mjs`
- Create: `content/product-artifacts/washi-tape-story-word-choice-card-pack.json`
- Create: `content/image-queue/2026-06-03-batch47-product-images.json`
- Modify: `scripts/product-artifact-policy.mjs`
- Modify: `scripts/validate-content-batch.mjs`
- Modify: `package.json`
- Modify: `content/products/batch5-products.json`
- Modify: `src/storyData.ts`
- Modify: `src/storyData.test.ts`

- [ ] **Step 1: Implement product-specific policy**

Add `washiTapeStoryWordChoiceCardPackProductSlug`, required artifact paths, `validateWashiTapeStoryWordChoiceCardPackSource`, `validateWashiTapeStoryWordChoiceCardPackSourceFiles`, and artifact inspection support. Require exactly 16 cards, 6 routines, 10 take-home slips, 8 optional prompts, 4 exact lane files, exact Batch47 artifact paths, source/product match, unique worlds, world age-band match, writable blanks, and banned-language checks.

- [ ] **Step 2: Implement builder**

Create the builder by reusing the Batch46 rendering pattern with Batch47 labels, fields, and output paths. The builder must:

- Copy each referenced local world image into `product-build/washi-tape-story-word-choice-card-pack/source/assets/`
- Render cover, guide, world, routine, slip, and 16 card pages
- Generate `Washi-Tape-Story-Word-Choice-Card-Pack.pdf`
- Generate source HTML and README
- Generate `manifest.json`
- Generate `washi-tape-story-word-choice-card-pack.zip`
- Export `renderWashiTapeStoryWordChoiceCardPackHtml` and `buildWashiTapeStoryWordChoiceCardPack`

- [ ] **Step 3: Wire source, product, static data, image manifest, and scripts**

Add:

- `content/product-artifacts/washi-tape-story-word-choice-card-pack.json`
- Product record in `content/products/batch5-products.json` with `status: "checkout_pending"`, `pricePoint: "$67"`, mailto CTA, local hero image path `images/plotsprout/batch47/washi-tape-story-word-choice-card-pack.jpg`, and no active checkout URL
- Product shelf entry in `src/storyData.ts`
- Story data test expectation in `src/storyData.test.ts`
- `product:washi-tape-word-choice-pack` in `package.json`
- Batch47 image manifest with local SDXL prompt for a flat lay of blank washi tape strips/cards and unbranded pencils, no readable text

- [ ] **Step 4: Run GREEN**

Run:

```bash
npm run product:washi-tape-word-choice-pack
npm run render:seo
npx vitest run scripts/washi-tape-story-word-choice-card-pack-builder.test.mjs src/storyData.test.ts scripts/validate-content-batch.test.mjs --testTimeout 20000
```

Expected: PASS with Batch47 source/artifact/static validations green.

### Task 3: Local RTX Image, Full Verification, Review, Deploy, And Closeout

**Files:**
- Create: `content/image-runs/batch47/washi-tape-story-word-choice-card-pack.json`
- Create: `public/images/plotsprout/batch47/washi-tape-story-word-choice-card-pack.jpg`
- Create: `public/images/plotsprout/batch47/washi-tape-story-word-choice-card-pack.webp`
- Create: `product-build/washi-tape-story-word-choice-card-pack/**`
- Create: `public/washi-tape-story-word-choice-card-pack/index.html`
- Modify: `TODO.md`
- Modify: `/home/sam/.codex/memories/MEMORY.md`

- [ ] **Step 1: Generate local product image**

Run:

```bash
npm run image:batch47
```

Use only the local RTX 4090 pipeline. Reject images with readable text, letters, logos, school/home/office scenes, people, or child data.

- [ ] **Step 2: Build artifacts and static route**

Run:

```bash
npm run product:washi-tape-word-choice-pack
npm run render:seo
```

- [ ] **Step 3: Verify locally**

Run:

```bash
npm run verify
git diff --check
```

Start preview and verify:

```bash
npm run preview -- --host 127.0.0.1 --port 4176
```

Use Playwright for `/plot-sprout-explorer/washi-tape-story-word-choice-card-pack/` at desktop and mobile widths. Confirm title/H1, image loaded, no horizontal overflow, no active checkout-provider links, and zero console warnings/errors.

- [ ] **Step 4: Request reviews**

Dispatch read-only reviewers:

- Content/safety review: Batch47 source/lane/product/static copy against family-safety and privacy constraints.
- Code/artifact review: builder, validators, artifact manifest, static page, package scripts, and verification coverage.

Fix Critical and Important findings. Push back on false positives with code/test evidence.

- [ ] **Step 5: Commit, push, deploy, and live smoke**

Run:

```bash
git add -A
git commit -m "Ship Batch47 washi tape word choice pack"
git push
gh run watch <new-run-id> --exit-status
```

After deploy success, live smoke:

- `https://samuelfrench.github.io/plot-sprout-explorer/`
- `https://samuelfrench.github.io/plot-sprout-explorer/washi-tape-story-word-choice-card-pack/`
- Live Batch47 JPEG bytes must match the committed SHA.

- [ ] **Step 6: Close TODO and memory**

Mark Batch47 and the `$67` backlog item complete, queue Batch48 with the next narrow printable writing-skill product, commit with `[skip ci]`, push, and add a terse memory line with commits, deploy run/job, verification, image SHA, checkout status, and no new paid/cloud services.
