# Batch 22 Thank-You Note Story Postcard Pack Implementation Plan

> **For agentic workers:** Use subagent-driven development for content lanes and review. Keep checkout provider-gated.

**Goal:** Build a `$21` Thank-You Note Story Postcard Pack as a checkout-pending printable product for parents, homeschool families, tutors, and relatives who want kids ages 7-11 to write sincere thank-you notes without starting from a blank page.

**Architecture:** Batch 22 follows the existing static product-artifact pattern. Four gpt-5.5/xhigh lanes create postcard/tool source files. The canonical source JSON feeds a static product page, product record, homepage product link, validation policy, PDF/source/ZIP builder, manifest checks, and local RTX 4090 product image. Checkout remains mailto-only until Sam chooses a hosted provider.

## Tasks

- [ ] Create four lane files under `content/product-artifacts/lanes/`:
  - `batch22-thank-you-postcards-a.json`
  - `batch22-thank-you-postcards-b.json`
  - `batch22-thank-you-postcards-c.json`
  - `batch22-thank-you-tools.json`
- [ ] Create `content/product-artifacts/thank-you-note-story-postcard-pack.json` with 16 printable postcards, adult guide tools, 6 note situations, 10 revision prompts, and 8 optional share prompts.
- [ ] Add product record, homepage link, static rendered page, image manifest/script, validator, builder, tests, and content verification wiring.
- [ ] Generate local RTX 4090 product image only through the manual local image script. No cloud image services and no content/image generation GitHub Actions.
- [ ] Build PDF/source/ZIP/manifest artifacts under `product-build/thank-you-note-story-postcard-pack/`.
- [ ] Run focused checks, `npm run verify`, local desktop/mobile smoke, spec/quality review, commit, push, local-runner deploy, live smoke, TODO closeout, and memory update.

## Safety Gates

- No accounts, uploads, public publishing, public download links, or checkout URLs.
- No address collection, phone/email collection, family records, family photos, real child profiles, gift-price prompts, medical/legal/therapy/grief processing, behavior reports, grades, scores, contests, prizes, timer pressure, politics, religion, romance, scary harm, weapons, gambling, branded characters, or ads targeted to children.
- Every printable response line must include visible blanks.
