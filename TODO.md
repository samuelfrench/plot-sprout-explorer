# Plot Sprout Explorer TODO

## Active Goal

Build an indefinite Codex-driven explorer app for family creative writing.

## Current Thesis

Plot Sprout Explorer is a family writing adventure app for reluctant writers ages 7-11: parents or teachers pick a whimsical world, kids write a short story from guided prompts, and the site packages the result as printable quest kits. Monetization starts with paid printable bundles and classroom packs before accounts, subscriptions, or user-generated publishing.

## Completed

- [x] 2026-06-02: Created `/home/sam/claude-workspace/plot-sprout-explorer` as a new Vite/React project.
- [x] 2026-06-02: Set active indefinite Codex goal for this project.
- [x] 2026-06-02: Found exact-name conflict for `StoryQuest` and switched app branding to `Plot Sprout Explorer`.
- [x] 2026-06-02: Added starter RED coverage for quest data, prompt safety, and app rendering.
- [x] 2026-06-02: Built the first usable quest workbench with age bands, world picker, writing loop, Codex content flywheel, local GPU image lane, safety framing, and monetization panels.
- [x] 2026-06-02: Added manual content-batch workflow and generated starter batch files under `content/batches/` and `content/image-queue/`.
- [x] 2026-06-02: Added local SDXL image generator and generated 6 starter 1344x768 JPEG world images on the RTX 4090 with prompt sidecars.
- [x] 2026-06-02: Configured push-triggered GitHub Pages deploy workflow for `self-hosted`, `Linux`, `X64` local runners.
- [x] 2026-06-02: Added workflow policy verifier to reject scheduled/cron/image/content-generation GitHub Actions.
- [x] 2026-06-02: Verified app locally with lint, tests, build, dev server, Playwright interaction checks, mobile overflow check, image render check, and zero browser console errors/warnings.
- [x] 2026-06-02: Created public GitHub repo `samuelfrench/plot-sprout-explorer`, enabled GitHub Pages workflow deploys, and pushed initial app scaffold.
- [x] 2026-06-02: Registered local self-hosted runner `sam-local-plot-sprout-1` with labels `self-hosted`, `Linux`, `X64`, `plot-sprout` via user service `actions-runner-plot-sprout-1.service`.
- [x] 2026-06-02: Fixed first deploy failure root cause: Node 24.16/npm 11.13 required regenerated `package-lock.json` entries for `@emnapi/core` and `@emnapi/runtime`.
- [x] 2026-06-02: Fixed GitHub Pages base-path asset bug; live site now serves HTML, JS, favicon, and local world images from `/plot-sprout-explorer/`.
- [x] 2026-06-02: Removed `setup-node` npm caching after it restored a 5.6GB shared local runner cache; workflow verifier now blocks `cache: npm`.
- [x] 2026-06-02: Final no-cache deploy succeeded on local runner at `2026-06-02T04:35:44Z`; live URL `https://samuelfrench.github.io/plot-sprout-explorer/` returned HTTP 200 for HTML, JS, and generated JPEG assets, and Playwright live smoke found zero console warnings/errors.
- [x] 2026-06-02: Batch 1 content expansion generated 30 age-banded worlds, 90 writing prompts, 30 local GPU image prompts, and 10 printable kit outlines across lower/middle/upper lanes.
- [x] 2026-06-02: Added `npm run verify:content` with schema/count/reference/safety/monetization gates for Batch 1 content.
- [x] 2026-06-02: Batch 1 safety/spec and product-quality subagent reviews approved after fixes for age targeting, duplicate mechanics, and validator coverage.
- [x] 2026-06-02: Batch 2 generated four crawlable SEO collection pages for creative writing prompts, story writing worksheets, reluctant writer activities, and homeschool writing prompts.
- [x] 2026-06-02: Added deterministic static SEO renderer plus content validation for Batch 2 collection JSON and generated pages.
- [x] 2026-06-02: Batch 3 generated 10 homeschool/classroom mini-units with lesson flow, teacher notes, assessment notes, printable-kit direction, and no student-account requirements.
- [x] 2026-06-02: Added static `/mini-units/` hub and 10 crawlable mini-unit pages with Batch 3 content validation.
- [x] 2026-06-02: Batch 4 generated 20 local RTX 4090 world images for top Batch 1 worlds, saved JPEG/WebP assets, prompt sidecars, manifest, static `/world-gallery/` page, and validator coverage.
- [x] 2026-06-02: Batch 5 added the static `$9` Rainy Day Story Quest Pack product page with checkout-pending/provider-pending copy, homepage link, renderer output, and content validation.
- [x] 2026-06-02: Batch 6 documented the checkout-provider decision path: hosted checkout links first, recommended order Creem, Dodo Payments, Stripe Payment Links, then Polar Checkout Links, with the product staying `checkout_pending` until Sam chooses a provider and supplies a real hosted checkout URL after the pack artifact exists.
- [x] 2026-06-02: Batch 7 built the actual Rainy Day Story Quest Pack source, PDF, ZIP, manifest, and provider-upload-ready folder, plus one missing local RTX 4090 product image and validation that product artifacts exist before checkout wiring.
- [x] 2026-06-02: Batch 8 built the `$29` Homeschool Season Story Bundle static product page, source JSON, PDF, ZIP, manifest, provider-upload-ready folder, and validation that checkout stays pending.
- [x] 2026-06-02: Batch 9 built the `$79` Classroom Story License Pack static product page, 30-card source JSON from four subagent lanes, 34-page PDF, ZIP, manifest, provider-ready folder, and validation that checkout stays pending.
- [x] 2026-06-02: Batch 10 built the `$19` Birthday Party Story Quest Kit static product page, 8-quest source JSON from three subagent lanes, local RTX 4090 product image, 12-page PDF, ZIP, manifest, provider-ready folder, and validation that checkout stays pending.
- [x] 2026-06-02: Batch 10 deployed via local runner run `26810062955`; live GitHub Pages desktop/mobile smoke passed for `/`, `/birthday-party-story-quest-kit/`, `/classroom-story-license-pack/`, `/homeschool-season-story-bundle/`, and `/rainy-day-story-quest-pack/`.
- [x] 2026-06-02: Batch 11 built the `$17` Road Trip Story Quest Pack static product page, 8-quest source JSON from three subagent lanes, local RTX 4090 product image, 12-page PDF, ZIP, manifest, provider-ready folder, and validation that checkout stays pending.
- [x] 2026-06-02: Batch 11 deployed from commit `e746373` via local runner at `2026-06-02T09:48:45Z`; live GitHub Pages desktop/mobile smoke passed for `/`, `/road-trip-story-quest-pack/`, `/birthday-party-story-quest-kit/`, `/classroom-story-license-pack/`, `/homeschool-season-story-bundle/`, and `/rainy-day-story-quest-pack/`.
- [x] 2026-06-02: Batch 13 built the `$11` Waiting Room Story Quest Pack static product page, 8-quest source JSON from three subagent lanes, local RTX 4090 product image, 12-page PDF, ZIP, manifest, provider-ready folder, full `npm run verify`, desktop/mobile local smoke for all product pages, and spec/code-quality review passes; checkout stays pending.
- [x] 2026-06-02: Batch 13 deployed from commit `420a041` via local runner run `26813534542` / job `79049406273`, completed `2026-06-02T10:21:01Z`; live GitHub Pages desktop/mobile smoke passed for `/waiting-room-story-quest-pack/` with image load, no console warnings/errors, and no horizontal overflow.
- [x] 2026-06-02: Batch 14 built the `$23` Library Story Club Kit static product page, 10-session source JSON from three gpt-5.5/xhigh lanes, local RTX 4090 product image, 14-page PDF, ZIP, manifest, provider-ready folder, full `npm run verify`, and desktop/mobile local smoke for all product pages; checkout stays pending.

## In Progress

- [ ] External checkout gate: wire hosted checkout only after Sam chooses the provider and supplies the real provider-hosted URL.

## Next Content Batches

- [x] Batch 1: Generate 30 age-banded worlds, 90 writing prompts, 30 image prompts, and 10 printable kit outlines.
- [x] Batch 2: Generate SEO collection pages for `creative writing prompts for kids`, `story writing worksheets`, `reluctant writer activities`, and `homeschool writing prompts`.
- [x] Batch 3: Generate 10 homeschool/classroom mini-units with teacher notes and no student-account requirements.
- [x] Batch 4: Generate 20 local GPU images for top worlds, save JPEG/WebP assets, and record prompt sidecars.
- [x] Batch 5: Build the first purchase-ready static product page for a $9 printable quest pack, without enabling checkout until a provider is selected.
- [x] Batch 6: Choose the checkout provider path and define the exact safe wiring steps for the $9 pack.
- [x] Batch 7: Build the Rainy Day Story Quest Pack PDF/source pages/ZIP or provider-upload-ready folder, then add validation that checkout cannot be marked ready without the artifact.
- [x] Batch 8: Build the `$29` Homeschool Season Story Bundle with 12 printable quests, static product page, PDF/source/ZIP artifact, and validation that checkout stays pending.
- [x] Batch 9: Build the `$79` Classroom Story License Pack with 30 prompt cards, rubric, extension activities, static product page, PDF/source/ZIP artifact, and validation that checkout stays pending.
- [x] Batch 10: Build the `$19` Birthday Party Story Quest Kit with 8 party-table quests, adult setup tools, static product page, local product image, PDF/source/ZIP artifact, and validation that checkout stays pending.
- [x] Batch 11: Build the `$17` Road Trip Story Quest Pack with 8 travel-friendly quests, adult setup tools, static product page, local product image, PDF/source/ZIP artifact, and validation that checkout stays pending.
- [x] Batch 13: Build the `$11` Waiting Room Story Quest Pack with 8 quiet waiting quests, adult setup tools, static product page, local product image, PDF/source/ZIP artifact, and validation that checkout stays pending.
- [x] Batch 14: Build the `$23` Library Story Club Kit with 10 adult-led club sessions, facilitator tools, static product page, local product image, PDF/source/ZIP artifact, and validation that checkout stays pending.
- [ ] Batch 12: Add the chosen hosted checkout URL, provider-host allowlist, and CTA copy after Sam chooses the provider; do not add custom checkout/webhook endpoints.

## Product Gates

- [ ] No child accounts before parent/teacher auth and privacy policy exist.
- [ ] No public publishing before moderation and abuse controls exist.
- [ ] No cloud image generation unless Sam explicitly approves paid/cloud use.
- [ ] No checkout URL until the paid product artifact exists and Sam explicitly chooses the provider.
- [ ] No generic broad "AI bedtime story app" positioning; keep the wedge to printable family/classroom writing quests.
- [ ] No automated GitHub Actions content-generation workflows; content generation stays manual/subagent-driven from local Codex.

## Monetization Backlog

- [x] $9 printable "Rainy Day Story Quest Pack" landing page.
- [x] $9 printable "Rainy Day Story Quest Pack" PDF/source/ZIP artifact.
- [x] $29 homeschool season bundle with 12 printable quests.
- [x] $79 classroom license pack with 30 prompts, rubric, and extension activities.
- [x] $19 birthday party story quest kit with 8 printable party-table quests and adult setup tools.
- [x] $17 road trip story quest pack with 8 printable travel quests and adult setup tools.
- [x] $11 waiting room story quest pack with 8 quiet printable waiting quests and adult setup tools.
- [x] $23 library story club kit with 10 adult-led club sessions and facilitator tools.
- [ ] Parent email capture for weekly printable quest drops.
