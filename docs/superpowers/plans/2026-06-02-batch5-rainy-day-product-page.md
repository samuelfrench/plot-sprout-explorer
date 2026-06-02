# Batch 5 Rainy Day Product Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a static, checkout-ready product landing page for the $9 Rainy Day Story Quest Pack without enabling payment or checkout yet.

**Architecture:** Store product content in committed JSON under `content/products/`, render a deterministic static page under `public/rainy-day-story-quest-pack/`, validate it with the content gate, and add one homepage link. The page can show price, included pages, safety scope, and launch-list mailto CTA, but it must not claim active checkout or create any public mutation endpoint.

**Tech Stack:** React homepage link, Node.js static rendering and validation, committed JSON content, GitHub Pages deployed by push-triggered self-hosted runner.

---

### Task 1: RED Product Contract

**Files:**
- Modify: `scripts/validate-content-batch.mjs`
- Modify: `src/App.test.tsx`

- [ ] **Step 1: Add failing content validation**

Require `content/products/batch5-products.json` with one product:

- slug `rainy-day-story-quest-pack`
- title `Rainy Day Story Quest Pack`
- price `$9`
- status `checkout_pending`
- 3-5 referenced world slugs
- included pages, use cases, safety notes, and provider-pending copy
- no `buy now`, no active checkout, no payment link, no upload/login/publishing language
- generated static page exists at `public/rainy-day-story-quest-pack/index.html`

- [ ] **Step 2: Add failing homepage test**

Expect the homepage to show a `Rainy Day Story Quest Pack` heading and a link to `/rainy-day-story-quest-pack/`.

### Task 2: Product Content and Static Renderer

**Files:**
- Create: `content/products/batch5-products.json`
- Modify: `scripts/render-seo-collections.mjs`
- Generate: `public/rainy-day-story-quest-pack/index.html`

- [ ] **Step 1: Write product JSON**

Use existing worlds/images:

- `puddle-planet-post-office`
- `teacup-town-weather-window`
- `rain-gauge-railway`
- `spoon-ferry-lunchbox-harbor`

Use existing local image assets only. Do not create checkout integration.

- [ ] **Step 2: Render product page**

Render title/meta/canonical, hero image, price, included printable pages, adult guidance, safety notes, referenced worlds, and CTA copy that says checkout is pending.

### Task 3: Homepage Product Entry

**Files:**
- Modify: `src/storyData.ts`
- Modify: `src/App.tsx`
- Modify: `src/App.css`

- [ ] **Step 1: Add product link metadata**

Export one `featuredProductLink` object. Do not import full product JSON into React.

- [ ] **Step 2: Add compact homepage section**

Place one product card after the gallery section, linking to the static page.

### Task 4: Verify, Review, Commit, Push

**Files:**
- Modify: `TODO.md`

- [ ] **Step 1: Run full local verification**

Run: `npm run verify`

- [ ] **Step 2: Browser smoke**

Run preview and verify homepage plus `/rainy-day-story-quest-pack/` load with zero console errors/warnings and no mobile overflow.

- [ ] **Step 3: Review**

Use read-only reviewers for product/checkout safety and code/deploy policy.

- [ ] **Step 4: Commit and deploy**

Commit, push, wait for local runner deploy, and live-smoke the product route.
