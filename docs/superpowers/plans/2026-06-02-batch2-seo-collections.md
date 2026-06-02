# Batch 2 SEO Collections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add four crawlable SEO collection pages for parent/teacher search lanes while keeping Plot Sprout Explorer family-safe, static, and monetizable through printable kits.

**Architecture:** Store collection copy as committed JSON under `content/seo-collections/`, validate it with the existing content gate, generate deterministic static HTML into `public/<collection-slug>/index.html`, and link the four pages from the React workbench. The renderer is a build-time transformation of committed content, not an automated content-generation workflow.

**Tech Stack:** React, TypeScript, Vite, Vitest, Node.js static renderer, committed JSON content, GitHub Pages deployed by push-triggered local runner.

---

### Task 1: RED Coverage and Content Contract

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `scripts/validate-content-batch.mjs`
- Create: `content/seo-collections/batch2-collections.json`

- [ ] **Step 1: Write failing homepage-link test**

Add an App test that renders `<App />` and expects a `Writing lanes` section with four links:

```ts
expect(screen.getByRole('heading', { name: /Writing lanes/i })).toBeInTheDocument()
expect(screen.getByRole('link', { name: /Creative writing prompts for kids/i })).toHaveAttribute(
  'href',
  expect.stringContaining('creative-writing-prompts-for-kids'),
)
expect(screen.getByRole('link', { name: /Story writing worksheets/i })).toHaveAttribute(
  'href',
  expect.stringContaining('story-writing-worksheets'),
)
expect(screen.getByRole('link', { name: /Reluctant writer activities/i })).toHaveAttribute(
  'href',
  expect.stringContaining('reluctant-writer-activities'),
)
expect(screen.getByRole('link', { name: /Homeschool writing prompts/i })).toHaveAttribute(
  'href',
  expect.stringContaining('homeschool-writing-prompts'),
)
```

- [ ] **Step 2: Verify RED**

Run: `npm run test -- src/App.test.tsx`

Expected: FAIL because the `Writing lanes` section does not exist yet.

- [ ] **Step 3: Extend content validator contract**

Update `scripts/validate-content-batch.mjs` so it validates `content/seo-collections/batch2-collections.json`:

- batchId must be `2026-06-02-batch2`
- exactly four collection records
- slugs must be the four target lanes
- each record must include `keyword`, `title`, `metaDescription`, `audience`, `intro`, `whyItWorks`, `featuredWorldSlugs`, `sections`, `printableOffer`, `safetyNote`, and `cta`
- each collection must reference at least three Batch 1 world slugs
- no banned terms except required negative safety phrasing
- no manipulative purchase language
- all static output pages must exist after rendering

- [ ] **Step 4: Verify content RED**

Run: `npm run verify:content`

Expected: FAIL because `content/seo-collections/batch2-collections.json` and generated pages do not exist yet.

### Task 2: Four Independent Collection Content Lanes

**Files:**
- Create: `content/seo-collections/batch2-collections.json`

- [ ] **Step 1: Generate four records in parallel**

Use one worker per lane:

- `creative-writing-prompts-for-kids`
- `story-writing-worksheets`
- `reluctant-writer-activities`
- `homeschool-writing-prompts`

Each worker writes one complete record with concrete parent/teacher copy, 3-5 Batch 1 world references, 3 content sections, one printable-kit monetization angle, and family-safety language.

- [ ] **Step 2: Merge records into one JSON file**

Create a single batch file:

```json
{
  "batchId": "2026-06-02-batch2",
  "generatedAt": "2026-06-02",
  "collections": []
}
```

- [ ] **Step 3: Validate copy manually**

Check for generic AI-story-generator positioning, child account assumptions, branded characters, politics, scary harm, romance, public publishing, or claims that the product is already purchasable.

### Task 3: Static Renderer

**Files:**
- Create: `scripts/render-seo-collections.mjs`
- Modify: `package.json`
- Generate: `public/creative-writing-prompts-for-kids/index.html`
- Generate: `public/story-writing-worksheets/index.html`
- Generate: `public/reluctant-writer-activities/index.html`
- Generate: `public/homeschool-writing-prompts/index.html`

- [ ] **Step 1: Implement deterministic renderer**

Read `content/seo-collections/batch2-collections.json` and write one static HTML page per collection under `public/<slug>/index.html`. Each page includes title, meta description, canonical URL, intro, sections, featured worlds, printable offer, safety note, and links back to the app root.

- [ ] **Step 2: Add render script**

Add `render:seo` to `package.json` and run it before Vite build:

```json
"build": "npm run render:seo && tsc -b && vite build",
"render:seo": "node scripts/render-seo-collections.mjs"
```

- [ ] **Step 3: Verify generated files**

Run: `npm run render:seo`

Expected: four `public/<slug>/index.html` files are created with non-empty HTML.

### Task 4: Homepage Links and Visual Integration

**Files:**
- Modify: `src/storyData.ts`
- Modify: `src/App.tsx`
- Modify: `src/App.css`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Export collection link data**

Add a small typed `seoCollections` export with the four labels, slugs, and descriptions for homepage linking. Keep it separate from the full JSON body so the browser bundle stays small.

- [ ] **Step 2: Render `Writing lanes` section**

Add a concise section after the workbench with four link cards. Use normal anchors with `href` values built from `import.meta.env.BASE_URL` so GitHub Pages base paths work.

- [ ] **Step 3: Verify GREEN**

Run: `npm run test -- src/App.test.tsx`

Expected: PASS.

### Task 5: Full Verification, Commit, Push, Deploy

**Files:**
- Modify: `TODO.md`

- [ ] **Step 1: Run full local verification**

Run: `npm run verify`

Expected: workflow policy, content validation, lint, tests, and build all pass.

- [ ] **Step 2: Browser smoke**

Run the app or preview server and use Playwright to verify:

- homepage loads with zero console errors/warnings
- four writing-lane links are present
- at least one generated static page returns HTTP 200 and includes its expected heading

- [ ] **Step 3: Update TODO**

Move Batch 2 from `In Progress` to `Completed`, leave Batch 3 as the next in-progress item, and note that Batch 2 generated four crawlable SEO collection pages.

- [ ] **Step 4: Commit and push**

Commit all repo changes and push `main`. Deployment must happen through the existing push-triggered local runner workflow. Do not add any scheduled or content-generation GitHub Actions.

- [ ] **Step 5: Deploy check**

Use local runner logs and live HTTP checks to verify the pushed Pages deploy completed and live pages return HTTP 200.
