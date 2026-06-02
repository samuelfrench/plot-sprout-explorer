# Batch 24 Backyard Story Seed Packet Kit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `$35` Backyard Story Seed Packet Kit as the next monetizable Plot Sprout printable product.

**Architecture:** Follow the established static product artifact pattern from Batch 23. Generate source JSON from three content lanes plus one tools lane, validate the source and artifacts, render a static product page, build a PDF/source/ZIP artifact, and keep checkout as `checkout_pending` with only a `mailto:` CTA.

**Tech Stack:** Vite/React data links, Node ESM builders, Playwright PDF generation, Vitest, static renderer, local SDXL image pipeline on the RTX 4090, GitHub Pages deploy on the self-hosted runner.

---

## Product Spec

- Product: `Backyard Story Seed Packet Kit`
- Slug: `backyard-story-seed-packet-kit`
- Price: `$35`
- Batch ID: `2026-06-02-batch24`
- Image manifest ID: `2026-06-02-batch24-product-images`
- Pages: 14 printable adult-led story seed packet pages, adult guide, world menu, 6 packet formats, 10 take-home seed slips, 8 optional share prompts
- Safety: paper/story seed packets only. No actual planting instructions, collecting seeds, soil handling, tasting plants, foraging, plant identification, animal/insect contact, tools, fertilizer, pesticides, weather-risk instructions, route/GPS/exact-place tracking, accounts, uploads, public publishing, child profiles, grades, scores, timers, contests, politics, religion, romance, weapons, violence, or branded characters.

## Files

- Create `docs/superpowers/plans/2026-06-02-batch24-backyard-story-seed-packet-kit.md`
- Create `scripts/backyard-story-seed-packet-kit-builder.test.mjs`
- Create `scripts/backyard-story-seed-packet-kit-builder.mjs`
- Create `content/product-artifacts/lanes/batch24-seed-packets-a.json`
- Create `content/product-artifacts/lanes/batch24-seed-packets-b.json`
- Create `content/product-artifacts/lanes/batch24-seed-packets-c.json`
- Create `content/product-artifacts/lanes/batch24-seed-tools.json`
- Create `content/product-artifacts/backyard-story-seed-packet-kit.json`
- Create `content/image-queue/2026-06-02-batch24-product-images.json`
- Create `content/image-runs/batch24/backyard-story-seed-packet-kit.json`
- Create `public/images/plotsprout/batch24/backyard-story-seed-packet-kit.{jpg,webp}`
- Create `product-build/backyard-story-seed-packet-kit/*`
- Create `public/backyard-story-seed-packet-kit/index.html`
- Modify `package.json`, `README.md`, `TODO.md`, `content/products/batch5-products.json`, `src/storyData.ts`, `src/storyData.test.ts`
- Modify `scripts/product-artifact-policy.mjs`, `scripts/validate-content-batch.mjs`, `scripts/rainy-day-pack-builder.mjs` if manifest source page count needs the new source shape

## Tasks

- [ ] Dispatch three gpt-5.5/xhigh content lane agents for seed packet pages and one tools lane agent for adult guide assets.
- [ ] Add RED Vitest coverage for the Batch 24 builder, source validator, source-lane reproducibility, artifact manifest, no-checkout HTML, and printable-page overflow.
- [ ] Implement source JSON, builder, product record, homepage product link, package scripts, README command notes, validator imports, source/artifact/image validation, and static rendering.
- [ ] Generate the Batch 24 product image locally with SDXL on the RTX 4090. Inspect it and reject any pseudo-text, real text, logos, devices, people, animals, unsafe tools, or plant-tasting/foraging cues.
- [ ] Run focused tests and full `npm run verify`.
- [ ] Run local production preview with Playwright desktop/mobile smoke for `/`, `/backyard-story-seed-packet-kit/`, and the previous Batch 23 product.
- [ ] Run spec and code-quality review gates with read-only gpt-5.5/xhigh reviewers.
- [ ] Commit and push code/artifacts, watch the self-hosted GitHub Pages deploy, run live desktop/mobile smoke, close subagents, update TODO and memory.

## Self-Review

- No placeholders or provider URLs.
- The product is a printable creative-writing kit, not a real gardening or plant-identification guide.
- The batch extends the existing monetizable product shelf without adding accounts, uploads, public mutation endpoints, or content-generation GitHub Actions.
