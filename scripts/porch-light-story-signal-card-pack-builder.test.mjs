import { describe, expect, it } from 'vitest'
import { createHash } from 'node:crypto'
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromium } from 'playwright'

import { buildProductArtifactManifest } from './rainy-day-pack-builder.mjs'
import {
  validatePorchLightStorySignalCardPackSource,
  validatePorchLightStorySignalCardPackSourceFiles,
  validateProductWorldSummaries,
} from './product-artifact-policy.mjs'
import {
  buildPorchLightStorySignalCardPack,
  loadPorchLightStorySignalCardPackBuildInputs,
  renderPorchLightStorySignalCardPackHtml,
} from './porch-light-story-signal-card-pack-builder.mjs'

const safety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles.'

function fakePdf(pageCount) {
  return Buffer.from(
    `%PDF-1.7\n${Array.from({ length: pageCount }, (_, index) => `${index + 1} 0 obj << /Type /Page >> endobj`).join('\n')}\n%%EOF\n`,
  )
}

function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex')
}

const signalWorldAges = {
  'moon-muffin-market': '6-8',
  'puddle-planet-post-office': '6-8',
  'buttonwood-library-train': '7-9',
  'button-bakery-map-mixup': '7-9',
  'teacup-town-weather-window': '7-8',
  'pocket-park-notice-board': '7-9',
  'spoon-ferry-lunchbox-harbor': '7-9',
  'acorn-avenue-errand-office': '7-9',
  'seed-library-map-room': '8-10',
  'rain-gauge-railway': '8-10',
  'moss-message-observatory': '8-10',
  'tidepool-timekeepers-lab': '8-10',
  'revision-river-ferry': '10-11',
  'clue-label-tower-museum': '10-11',
  'compass-craft-academy': '10-11',
  'binding-day-boardwalk': '10-11',
}

const signalWorldSlugs = Object.keys(signalWorldAges)

const signalSkills = [
  'color cue',
  'pattern cue',
  'message cue',
  'mood cue',
  'object cue',
  'sequence cue',
  'sound cue',
  'helper cue',
  'setting cue',
  'question cue',
  'revision cue',
  'ending cue',
]

function card(index, worldSlug, ageBand) {
  const skill = signalSkills[(index - 1) % signalSkills.length]
  return {
    id: `porch-signal-card-${String(index).padStart(2, '0')}`,
    title: `Porch-Light Story Signal Card ${index}`,
    worldSlug,
    ageBand,
    signalSkill: skill,
    useCase:
      'Adult-led printable story signal card for turning one pretend porch-light cue into a short story start: ____________________.',
    adultSetup:
      'Print the card, name the porch-light cue as a fictional paper signal, and keep every idea invented and offline: ____________________.',
    kidDirection:
      'Imagine a pretend porch-light signal on the card, then write one clear story cue: ____________________.',
    signalFrontPrompt: 'Signal front: The pretend porch-light cue first shows ____________________.',
    signalBackPrompt: 'Signal back: Add one setting, character, or object detail to the paper signal: ____________________.',
    storySignalPrompt: 'Story signal: The cue changes when ____________________ appears.',
    firstLineSignal: 'First line signal: When the paper cue glowed, I noticed ____________________.',
    revisionNudge: 'Revision nudge: Replace one fuzzy signal word with ____________________.',
    quietOptionLine: 'Quiet option: Sketch the cue first, then label ____________________.',
    takeHomeLine: 'Take-home line: Save this signal card and continue with ____________________.',
  }
}

function validPorchLightSignalSource(overrides = {}) {
  return {
    batchId: '2026-06-02-batch30',
    generatedAt: '2026-06-02',
    productSlug: 'porch-light-story-signal-card-pack',
    title: 'Porch Light Story Signal Card Pack',
    pricePoint: '$33',
    audience:
      'Families, homeschool groups, tutors, and adult-led writing tables for writers ages 6-11.',
    sessionLength:
      '16 printable story signal cards plus adult guide tools, signal routines, take-home signal slips, and optional share prompts',
    safetyNote: safety,
    artifact: {
      pdfPath:
        'product-build/porch-light-story-signal-card-pack/Porch-Light-Story-Signal-Card-Pack.pdf',
      zipPath:
        'product-build/porch-light-story-signal-card-pack/porch-light-story-signal-card-pack.zip',
      sourceHtmlPath:
        'product-build/porch-light-story-signal-card-pack/source/porch-light-story-signal-card-pack.html',
      manifestPath: 'product-build/porch-light-story-signal-card-pack/manifest.json',
    },
    sourceFiles: [
      'content/product-artifacts/lanes/batch30-porch-light-signal-cards-a.json',
      'content/product-artifacts/lanes/batch30-porch-light-signal-cards-b.json',
      'content/product-artifacts/lanes/batch30-porch-light-signal-cards-c.json',
      'content/product-artifacts/lanes/batch30-porch-light-signal-tools.json',
    ],
    worldSlugs: signalWorldSlugs,
    cover: {
      kicker: 'Printable paper signal cards',
      headline: 'Porch Light Story Signal Card Pack',
      subhead:
        'Sixteen paper story signal cards turn pretend porch-light cues into screen-free story starts.',
      included: [
        '16 printable porch-light signal cards',
        'Adult setup guide',
        'Fictional signal-card safety notes',
        'Story signal coaching moves',
        'Privacy and family handoff notes',
        'Pack reset notes',
        'Six adult-led signal routines',
        'Ten take-home signal slips',
        'Eight optional share prompts',
        'Provider-ready PDF and ZIP artifact',
      ],
    },
    adultGuide: {
      beforeSession: [
        'Print the story signal cards, take-home slips, and adult guide before the session.',
        'Say that porch-light means a fictional paper signal only.',
        'Choose one signal routine before writers begin.',
        'Keep the session offline, paper-only, and adult-led.',
        'Explain that the card is a private writing prompt, not a measuring tool.',
      ],
      paperSignalSetup: [
        'Place one story signal card and one blank page where the adult can see the writing.',
        'Use broad invented place words instead of private details or named locations.',
        'Let pointing, sketching, dictating, or filling one blank count as progress.',
        'Keep finished cards in an adult folder until they go to the family adult.',
        'Use the back of the card for one cue, one question, or one first line.',
      ],
      storySignalCoaching: [
        'Ask for one invented porch-light cue first.',
        'Ask what kind of fictional character would notice the signal.',
        'Ask what object, pattern, color, or sound changes the story cue.',
        'Ask for a first, next, and finally paper line if the writer wants structure.',
        'Ask for one revision word that makes the signal clearer.',
      ],
      privacyAndSafetyNotes: [
        'Use invented names, role words, or blank labels for every person on the story signal cards.',
        'Use broad place words instead of private details or named locations.',
        'Keep every story signal card offline with the family adult, tutor, or table host.',
        'Sharing stays optional and limited to one invented word, sketch, or line.',
        'Check every take-home slip for private details before it leaves the adult-led table.',
      ],
      familyHandoff: [
        'Send one finished paper story signal card and one blank take-home slip with each writer.',
        'Tell family adults that five to nine quiet minutes is enough for one extra story cue.',
        'Invite praise for one clear word, sketch, or sentence.',
        'Ask adults to keep personal names and narrow place labels off the page.',
        'Suggest saving the story signal card as a starter for a later printable story.',
      ],
      reset: [
        'Collect unused story signal cards and blank pages.',
        'Check finished pages for private details before they go to family adults.',
        'Recycle scrap pages that only hold practice marks.',
        'Restock the adult folder with fresh story signal cards.',
      ],
    },
    signalRoutines: Array.from({ length: 6 }, (_, index) => ({
      name: `Signal Routine ${index + 1}`,
      bestFor: 'A calm adult-led paper writing moment with one fictional porch-light cue.',
      steps: [
        'Adult chooses one broad invented signal idea and reads the paper-only reminder.',
        'Writer chooses one color, pattern, message, mood, object, or sequence cue.',
        'Adult models how the cue can become an invented story signal.',
        'Writer drafts one short first line on the card.',
      ],
    })),
    takeHomeSignalSlips: Array.from({ length: 10 }, (_, index) => ({
      title: `Signal Slip ${index + 1}`,
      time: '7 minutes',
      skill: signalSkills[index % signalSkills.length],
      direction: 'Choose one fictional porch-light cue and write it here: ____________________.',
      familyLine: 'A grown-up can ask which signal detail should stay in the story: ____________________.',
    })),
    optionalSharePrompts: [
      'Read one invented signal cue if you choose: ____________________.',
      'Show one sketched cue from the card: ____________________.',
      'Name one broad signal word without private details: ____________________.',
      'Share one first-line word you want to keep: ____________________.',
      'Point to one revision word that helped the cue: ____________________.',
      'Ask an adult to read your favorite story signal line: ____________________.',
      'Circle one cue you want to keep private: ____________________.',
      'Choose one finish step for later: ____________________.',
    ],
    cards: signalWorldSlugs.map((worldSlug, index) => card(index + 1, worldSlug, signalWorldAges[worldSlug])),
    ...overrides,
  }
}

const product = {
  slug: 'porch-light-story-signal-card-pack',
  title: 'Porch Light Story Signal Card Pack',
  pricePoint: '$33',
  status: 'checkout_pending',
  worldSlugs: signalWorldSlugs,
  worldSummaries: signalWorldSlugs.map((slug) => ({
    slug,
    summary: `A linked fictional world summary for ${slug}.`,
  })),
}

const worldAges = new Map(
  signalWorldSlugs.map((worldSlug) => [worldSlug, { ageBand: signalWorldAges[worldSlug] }]),
)

const worlds = new Map(
  signalWorldSlugs.map((worldSlug) => [
    worldSlug,
    {
      slug: worldSlug,
      title: worldSlug
        .split('-')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' '),
      ageBand: signalWorldAges[worldSlug],
      premise: 'A friendly invented world for a screen-free story signal card prompt.',
    },
  ]),
)

describe('Porch Light Story Signal Card Pack policy', () => {
  it('accepts a valid source with sixteen printable story signal cards', () => {
    expect(validatePorchLightStorySignalCardPackSource(validPorchLightSignalSource(), product, worldAges)).toEqual([])
  })

  it('rejects a card response field without a writable blank', () => {
    const source = validPorchLightSignalSource()
    source.cards[0].signalFrontPrompt = 'My cue has a warm color.'

    expect(validatePorchLightStorySignalCardPackSource(source, product, worldAges)).toContain(
      'cards[0].signalFrontPrompt must include a writable blank.',
    )
  })

  it('rejects accounts, real-place, public-review, outdoor, tracker, scoring, upload, and unsafe language', () => {
    const source = validPorchLightSignalSource()
    source.adultGuide.beforeSession[0] =
      'Create accounts, upload photos, publish public posts, collect child names, grades, scores, ratings, comments, exact addresses, GPS routes, real homes, houses, neighbors, streets, windows, outdoor safety instructions, phone numbers, emails, and behavior trackers.'
    source.cards[0].kidDirection =
      'Write a public review with publisher details, bestseller ranking, timer, prize, politics, religion, romance, weapons, violence, doctor, lawyer, therapist, diagnosis, grief, Harry Potter, Disney, Pokemon, Marvel, Star Wars, and Minecraft.'

    expect(validatePorchLightStorySignalCardPackSource(source, product, worldAges)).toEqual(
      expect.arrayContaining([
        'Porch Light Story Signal Card Pack source includes account, upload, public-posting, review/rating, exact-place, real-home, route, outdoor, contact, photo/camera, child-profile, grade, score, tracker, schedule, or private-child-data language.',
        'Porch Light Story Signal Card Pack source includes real book title, author, publisher, franchise, branded/copyrighted, review/rating, medical, legal, therapy, diagnosis, grief, assessment, grade, score, guaranteed-outcome, contest, prize, timer-pressure, gambling, politics, religion, romance, weapon, violence, ad-targeting, unsafe physical, window-safety, outdoor-safety, or weather-safety language.',
      ]),
    )
  })

  it('rejects missing, duplicate, or off-link Porch Light product world summaries', () => {
    expect(validateProductWorldSummaries(product, 'Porch Light Story Signal Card Pack')).toEqual([])

    const missingSummary = {
      ...product,
      worldSummaries: product.worldSlugs.slice(1).map((slug) => ({
        slug,
        summary: `Summary for ${slug}.`,
      })),
    }
    const duplicateSummary = {
      ...product,
      worldSummaries: product.worldSlugs.map((slug) => ({
        slug,
        summary: `Summary for ${slug}.`,
      })),
    }
    duplicateSummary.worldSummaries[1] = { ...duplicateSummary.worldSummaries[0] }
    const offLinkSummary = {
      ...product,
      worldSummaries: product.worldSlugs.map((slug) => ({
        slug,
        summary: `Summary for ${slug}.`,
      })),
    }
    offLinkSummary.worldSummaries[0] = {
      slug: 'not-in-this-product',
      summary: 'Summary for an unlinked world.',
    }

    expect(validateProductWorldSummaries(missingSummary, 'Porch Light Story Signal Card Pack')).toContain(
      'Porch Light Story Signal Card Pack worldSummaries must cover every linked world.',
    )
    expect(validateProductWorldSummaries(duplicateSummary, 'Porch Light Story Signal Card Pack')).toContain(
      'Porch Light Story Signal Card Pack worldSummaries[1].slug is duplicated.',
    )
    expect(validateProductWorldSummaries(offLinkSummary, 'Porch Light Story Signal Card Pack')).toContain(
      'Porch Light Story Signal Card Pack worldSummaries[0].slug must match a linked world slug.',
    )
  })

  it('keeps declared source lane files reproducible with the committed porch-light signal source', () => {
    const root = resolve(import.meta.dirname, '..')
    const source = JSON.parse(
      readFileSync(resolve(root, 'content', 'product-artifacts', 'porch-light-story-signal-card-pack.json'), 'utf8'),
    )

    expect(validatePorchLightStorySignalCardPackSourceFiles(source, root)).toEqual([])
  })
})

describe('Porch Light Story Signal Card Pack builder', () => {
  it('loads committed porch-light signal source, product, worlds, and local image inputs before writing artifacts', () => {
    const { source, product: committedProduct, worlds: committedWorlds, imageMap } =
      loadPorchLightStorySignalCardPackBuildInputs()

    expect(source.productSlug).toBe('porch-light-story-signal-card-pack')
    expect(source.cards).toHaveLength(16)
    expect(committedProduct.status).toBe('checkout_pending')
    expect(imageMap.size).toBe(source.worldSlugs.length)
    for (const slug of source.worldSlugs) {
      expect(committedWorlds.has(slug)).toBe(true)
      expect(imageMap.has(slug)).toBe(true)
    }
  })

  it('exercises the actual build entry point against a temporary artifact directory', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'plot-sprout-porch-light-signal-build-'))
    const buildDir = join(tempDir, 'porch-light-story-signal-card-pack')
    try {
      const { manifest } = await buildPorchLightStorySignalCardPack({
        buildDir,
        recordRoot: tempDir,
        writePdf: async ({ pdfPath }) => {
          writeFileSync(pdfPath, fakePdf(21))
        },
      })

      expect(manifest.productSlug).toBe('porch-light-story-signal-card-pack')
      expect(manifest.sourcePageCount).toBe(16)
      expect(manifest.files.assets.length).toBe(16)
      expect(existsSync(join(buildDir, 'source', 'porch-light-story-signal-card-pack.html'))).toBe(true)
      expect(existsSync(join(buildDir, 'README.txt'))).toBe(true)
      expect(existsSync(join(buildDir, 'manifest.json'))).toBe(true)
      expect(readFileSync(join(buildDir, 'porch-light-story-signal-card-pack.zip')).subarray(0, 2).toString('ascii')).toBe('PK')
      expect(readFileSync(join(buildDir, 'source', 'porch-light-story-signal-card-pack.html'), 'utf8').match(/class="[^"]*story-signal-card-page/g)).toHaveLength(16)
    } finally {
      rmSync(tempDir, { recursive: true, force: true })
    }
  }, 15000)

  it('renders printable porch-light signal card HTML with adult guide, local images, and no checkout copy', () => {
    const html = renderPorchLightStorySignalCardPackHtml(
      validPorchLightSignalSource(),
      worlds,
      new Map(signalWorldSlugs.map((worldSlug) => [worldSlug, `assets/${worldSlug}.jpg`])),
    )

    expect(html).toContain('<!doctype html>')
    expect(html).toContain('@page')
    expect(html).toContain('Porch Light Story Signal Card Pack')
    expect(html).toContain('Story signal coaching')
    expect(html).toContain('Privacy and safety notes')
    expect(html).toContain('Signal front')
    expect(html.match(/class="[^"]*story-signal-card-page/g)).toHaveLength(16)
    expect(html).toContain('assets/seed-library-map-room.jpg')
    expect(html).not.toMatch(/checkout|payment link|buy now|stripe|gumroad|\baccount\b|login|upload|public post|public review|rating|stars|comments|forum|GPS|coordinates|\baddress\b|route|real home|house|neighbor|street|outside|outdoor safety|window safety|weather safety|publisher|bestseller|copyright|franchise|Harry Potter|Disney|Pokemon|Marvel|Star Wars|Minecraft|medical|legal|therapy|grief|\bgrade\b|\bscore\b|contest|prize|\btimer\b|tracking|tracker|behavior report|politics|religion|romance|weapon|violence/i)
  })

  it('builds a reusable product artifact manifest for the porch-light signal card pack', () => {
    const manifest = buildProductArtifactManifest(validPorchLightSignalSource(), {
      pdf: {
        path: 'product-build/porch-light-story-signal-card-pack/Porch-Light-Story-Signal-Card-Pack.pdf',
        size: 123,
        sha256: 'pdf',
      },
      zip: {
        path: 'product-build/porch-light-story-signal-card-pack/porch-light-story-signal-card-pack.zip',
        size: 234,
        sha256: 'zip',
      },
      sourceHtml: {
        path: 'product-build/porch-light-story-signal-card-pack/source/porch-light-story-signal-card-pack.html',
        size: 345,
        sha256: 'html',
      },
      assets: [],
    })

    expect(manifest.productSlug).toBe('porch-light-story-signal-card-pack')
    expect(manifest.sourcePageCount).toBe(16)
    expect(manifest.files.pdf.sha256).toBe('pdf')
  })

  it('keeps every built porch-light signal card artifact page within one sheet after images load', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'plot-sprout-porch-light-signal-layout-'))
    const buildDir = join(tempDir, 'porch-light-story-signal-card-pack')
    const browser = await chromium.launch({ headless: true })
    try {
      await buildPorchLightStorySignalCardPack({
        buildDir,
        recordRoot: tempDir,
        writePdf: async ({ pdfPath }) => {
          writeFileSync(pdfPath, fakePdf(21))
        },
      })
      const page = await browser.newPage({ viewport: { width: 1100, height: 1500 } })
      await page.goto(pathToFileURL(join(buildDir, 'source', 'porch-light-story-signal-card-pack.html')).href, {
        waitUntil: 'load',
      })
      await page.waitForFunction(() => [...document.images].every((image) => image.complete && image.naturalWidth > 0))
      const overflowingPages = await page.$$eval('.pack-page', (pages) =>
        pages
          .map((element, index) => ({
            index,
            scrollHeight: element.scrollHeight,
            clientHeight: element.clientHeight,
            heading: element.querySelector('h1, h2')?.textContent ?? '',
          }))
          .filter((entry) => entry.scrollHeight > entry.clientHeight + 1),
      )

      expect(overflowingPages).toEqual([])
    } finally {
      await browser.close()
      rmSync(tempDir, { recursive: true, force: true })
    }
  }, 20000)

  it('keeps real PDF, ZIP, and manifest artifacts byte-stable across rebuilds', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'plot-sprout-porch-light-signal-deterministic-'))
    const firstBuildDir = join(tempDir, 'first')
    const secondBuildDir = join(tempDir, 'second')
    try {
      const first = await buildPorchLightStorySignalCardPack({
        buildDir: firstBuildDir,
        recordRoot: firstBuildDir,
      })
      await new Promise((resolve) => setTimeout(resolve, 1100))
      const second = await buildPorchLightStorySignalCardPack({
        buildDir: secondBuildDir,
        recordRoot: secondBuildDir,
      })

      expect(sha256(first.paths.pdfPath)).toBe(sha256(second.paths.pdfPath))
      expect(sha256(first.paths.zipPath)).toBe(sha256(second.paths.zipPath))
      expect(sha256(first.paths.htmlPath)).toBe(sha256(second.paths.htmlPath))
      expect(sha256(first.paths.manifestPath)).toBe(sha256(second.paths.manifestPath))
    } finally {
      rmSync(tempDir, { recursive: true, force: true })
    }
  }, 30000)
})
