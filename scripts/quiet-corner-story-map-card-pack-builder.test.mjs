import { describe, expect, it } from 'vitest'
import { createHash } from 'node:crypto'
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromium } from 'playwright'

import { buildProductArtifactManifest } from './rainy-day-pack-builder.mjs'
import {
  validateProductWorldSummaries,
  validateQuietCornerStoryMapCardPackSource,
  validateQuietCornerStoryMapCardPackSourceFiles,
} from './product-artifact-policy.mjs'
import {
  buildQuietCornerStoryMapCardPack,
  loadQuietCornerStoryMapCardPackBuildInputs,
  renderQuietCornerStoryMapCardPackHtml,
} from './quiet-corner-story-map-card-pack-builder.mjs'

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

const mapWorldAges = {
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

const mapWorldSlugs = Object.keys(mapWorldAges)

const mapSkills = [
  'setting map',
  'message map',
  'sequence map',
  'mix-up map',
  'sensory map',
  'notice map',
  'object map',
  'helper map',
  'clue map',
  'pattern map',
  'time map',
  'revision map',
  'label map',
  'choice map',
  'order map',
]

function card(index, worldSlug, ageBand) {
  const skill = mapSkills[(index - 1) % mapSkills.length]
  return {
    id: `quiet-map-card-${String(index).padStart(2, '0')}`,
    title: `Quiet Corner Story Map Card ${index}`,
    worldSlug,
    ageBand,
    mapSkill: skill,
    useCase:
      'Adult-led printable story map card for turning one fictional quiet-corner map into a short story start: ____________________.',
    adultSetup:
      'Print the card, draw a paper story map box, and keep every idea invented and offline: ____________________.',
    kidDirection:
      'Imagine a fictional quiet-corner map, then write one clear story map clue: ____________________.',
    mapFrontPrompt: 'Map front: In the pretend corner map, I first notice ____________________.',
    mapBackPrompt: 'Map back: Add one setting, character, or object detail to the paper map: ____________________.',
    storyShapePrompt: 'Story shape: The corner map changes when ____________________ appears.',
    firstLineBridge: 'First line bridge: From the quiet corner, I saw ____________________, then ____________________.',
    revisionNudge: 'Revision nudge: Replace one fuzzy story map word with ____________________.',
    quietOptionLine: 'Quiet option: Sketch the frame first, then label ____________________.',
    takeHomeLine: 'Take-home line: Save this story map card and continue with ____________________.',
  }
}

function validQuietCornerMapSource(overrides = {}) {
  return {
    batchId: '2026-06-02-batch29',
    generatedAt: '2026-06-02',
    productSlug: 'quiet-corner-story-map-card-pack',
    title: 'Quiet Corner Story Map Card Pack',
    pricePoint: '$31',
    audience:
      'Families, homeschool groups, tutors, and adult-led writing tables for writers ages 6-11.',
    sessionLength:
      '16 printable story map cards plus adult guide tools, map routines, take-home map slips, and optional share prompts',
    safetyNote: safety,
    artifact: {
      pdfPath:
        'product-build/quiet-corner-story-map-card-pack/Quiet-Corner-Story-Map-Card-Pack.pdf',
      zipPath:
        'product-build/quiet-corner-story-map-card-pack/quiet-corner-story-map-card-pack.zip',
      sourceHtmlPath:
        'product-build/quiet-corner-story-map-card-pack/source/quiet-corner-story-map-card-pack.html',
      manifestPath: 'product-build/quiet-corner-story-map-card-pack/manifest.json',
    },
    sourceFiles: [
      'content/product-artifacts/lanes/batch29-quiet-corner-map-cards-a.json',
      'content/product-artifacts/lanes/batch29-quiet-corner-map-cards-b.json',
      'content/product-artifacts/lanes/batch29-quiet-corner-map-cards-c.json',
      'content/product-artifacts/lanes/batch29-quiet-corner-map-tools.json',
    ],
    worldSlugs: mapWorldSlugs,
    cover: {
      kicker: 'Printable quiet-corner map cards',
      headline: 'Quiet Corner Story Map Card Pack',
      subhead:
        'Sixteen paper story map cards turn fictional quiet-corner maps into screen-free story starts.',
      included: [
        '16 printable quiet-corner map cards',
        'Adult setup guide',
        'Fictional story-map safety notes',
        'Story map coaching moves',
        'Privacy and family handoff notes',
        'Pack reset notes',
        'Six adult-led map routines',
        'Ten take-home map slips',
        'Eight optional share prompts',
        'Provider-ready PDF and ZIP artifact',
      ],
    },
    adultGuide: {
      beforeSession: [
        'Print the story map cards, take-home slips, and adult guide before the session.',
        'Say that quiet-corner means a fictional paper story map only.',
        'Choose one map routine before writers begin.',
        'Keep the session offline, paper-only, and adult-led.',
        'Explain that the card is a private writing prompt, not a measuring tool.',
      ],
      quietCornerSetup: [
        'Place one story map card and one blank page where the adult can see the writing.',
        'Use broad invented place words instead of private details or named locations.',
        'Let pointing, sketching, dictating, or filling one blank count as progress.',
        'Keep finished cards in an adult folder until they go home.',
        'Use the back of the card for one clue, one question, or one first line.',
      ],
      storyMapCoaching: [
        'Ask for one invented corner map first.',
        'Ask what kind of fictional character would notice the map clue.',
        'Ask what object, label, pattern, or sound changes the story shape.',
        'Ask for a first, next, and finally paper line if the writer wants structure.',
        'Ask for one revision word that makes the map clue clearer.',
      ],
      privacyAndSafetyNotes: [
        'Use invented names, role words, or blank labels for every person on the story map cards.',
        'Use broad place words instead of private details or named locations.',
        'Keep every story map card offline with the family adult, tutor, or table host.',
        'Sharing stays optional and limited to one invented word, sketch, or line.',
        'Check every take-home slip for private details before it leaves the adult-led table.',
      ],
      familyHandoff: [
        'Send one finished paper story map card and one blank take-home slip with each writer.',
        'Tell family adults that five to nine quiet minutes is enough for one extra story map clue.',
        'Invite praise for one clear word, sketch, or sentence.',
        'Ask adults to keep personal names and narrow place labels off the page.',
        'Suggest saving the story map card as a starter for a later printable story.',
      ],
      reset: [
        'Collect unused story map cards and blank pages.',
        'Check finished pages for private details before they go home.',
        'Recycle scrap pages that only hold practice marks.',
        'Restock the adult folder with fresh story map cards.',
      ],
    },
    mapRoutines: Array.from({ length: 6 }, (_, index) => ({
      name: `Map Routine ${index + 1}`,
      bestFor: 'A calm adult-led paper writing moment with one fictional story map.',
      steps: [
        'Adult chooses one broad invented map idea and reads the paper-only reminder.',
        'Writer chooses one setting, character, object, sequence, sensory, or revision move.',
        'Adult models how the map can become an invented story shape.',
        'Writer drafts one short first line on the card.',
      ],
    })),
    takeHomeMapSlips: Array.from({ length: 10 }, (_, index) => ({
      title: `Map Slip ${index + 1}`,
      time: '7 minutes',
      skill: mapSkills[index % mapSkills.length],
      direction: 'Choose one fictional corner map detail and write it here: ____________________.',
      familyLine: 'A grown-up can ask which detail should stay in the story: ____________________.',
    })),
    optionalSharePrompts: [
      'Read one invented view clue if you choose: ____________________.',
      'Show one sketched frame from the card: ____________________.',
      'Name one broad view word without private details: ____________________.',
      'Share one first-line word you want to keep: ____________________.',
      'Point to one revision word that helped the scene: ____________________.',
      'Ask an adult to read your favorite story map line: ____________________.',
      'Circle one clue you want to keep private: ____________________.',
      'Choose one finish step for later: ____________________.',
    ],
    cards: mapWorldSlugs.map((worldSlug, index) => card(index + 1, worldSlug, mapWorldAges[worldSlug])),
    ...overrides,
  }
}

const product = {
  slug: 'quiet-corner-story-map-card-pack',
  title: 'Quiet Corner Story Map Card Pack',
  pricePoint: '$31',
  status: 'checkout_pending',
  worldSlugs: mapWorldSlugs,
  worldSummaries: mapWorldSlugs.map((slug) => ({
    slug,
    summary: `A linked fictional world summary for ${slug}.`,
  })),
}

const worldAges = new Map(
  mapWorldSlugs.map((worldSlug) => [worldSlug, { ageBand: mapWorldAges[worldSlug] }]),
)

const worlds = new Map(
  mapWorldSlugs.map((worldSlug) => [
    worldSlug,
    {
      slug: worldSlug,
      title: worldSlug
        .split('-')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' '),
      ageBand: mapWorldAges[worldSlug],
      premise: 'A friendly invented world for a screen-free story map card prompt.',
    },
  ]),
)

describe('Quiet Corner Story Map Card Pack policy', () => {
  it('accepts a valid source with sixteen printable story map cards', () => {
    expect(validateQuietCornerStoryMapCardPackSource(validQuietCornerMapSource(), product, worldAges)).toEqual([])
  })

  it('rejects a card response field without a writable blank', () => {
    const source = validQuietCornerMapSource()
    source.cards[0].mapFrontPrompt = 'My scene has a framed view.'

    expect(validateQuietCornerStoryMapCardPackSource(source, product, worldAges)).toContain(
      'cards[0].mapFrontPrompt must include a writable blank.',
    )
  })

  it('rejects accounts, real-place, public-review, tracker, scoring, upload, and unsafe language', () => {
    const source = validQuietCornerMapSource()
    source.adultGuide.beforeSession[0] =
      'Create accounts, upload photos, publish public posts, collect child names, grades, scores, ratings, comments, exact addresses, GPS routes, real homes, phone numbers, emails, and behavior trackers.'
    source.cards[0].kidDirection =
      'Write a public review with publisher details, bestseller ranking, timer, prize, politics, religion, romance, weapons, violence, doctor, lawyer, therapist, diagnosis, grief, Harry Potter, Disney, Pokemon, Marvel, Star Wars, and Minecraft.'

    expect(validateQuietCornerStoryMapCardPackSource(source, product, worldAges)).toEqual(
      expect.arrayContaining([
        'Quiet Corner Story Map Card Pack source includes account, upload, public-posting, review/rating, exact-place, real-home, route, contact, photo/camera, child-profile, grade, score, tracker, schedule, or private-child-data language.',
        'Quiet Corner Story Map Card Pack source includes real book title, author, publisher, franchise, branded/copyrighted, review/rating, medical, legal, therapy, diagnosis, grief, assessment, grade, score, guaranteed-outcome, contest, prize, timer-pressure, gambling, politics, religion, romance, weapon, violence, ad-targeting, unsafe physical, window-safety, or weather-safety language.',
      ]),
    )
  })

  it('rejects missing, duplicate, or off-link Quiet Corner product world summaries', () => {
    expect(validateProductWorldSummaries(product, 'Quiet Corner Story Map Card Pack')).toEqual([])

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

    expect(validateProductWorldSummaries(missingSummary, 'Quiet Corner Story Map Card Pack')).toContain(
      'Quiet Corner Story Map Card Pack worldSummaries must cover every linked world.',
    )
    expect(validateProductWorldSummaries(duplicateSummary, 'Quiet Corner Story Map Card Pack')).toContain(
      'Quiet Corner Story Map Card Pack worldSummaries[1].slug is duplicated.',
    )
    expect(validateProductWorldSummaries(offLinkSummary, 'Quiet Corner Story Map Card Pack')).toContain(
      'Quiet Corner Story Map Card Pack worldSummaries[0].slug must match a linked world slug.',
    )
  })

  it('keeps declared source lane files reproducible with the committed quiet-corner map source', () => {
    const root = resolve(import.meta.dirname, '..')
    const source = JSON.parse(
      readFileSync(resolve(root, 'content', 'product-artifacts', 'quiet-corner-story-map-card-pack.json'), 'utf8'),
    )

    expect(validateQuietCornerStoryMapCardPackSourceFiles(source, root)).toEqual([])
  })
})

describe('Quiet Corner Story Map Card Pack builder', () => {
  it('loads committed quiet-corner map source, product, worlds, and local image inputs before writing artifacts', () => {
    const { source, product: committedProduct, worlds: committedWorlds, imageMap } =
      loadQuietCornerStoryMapCardPackBuildInputs()

    expect(source.productSlug).toBe('quiet-corner-story-map-card-pack')
    expect(source.cards).toHaveLength(16)
    expect(committedProduct.status).toBe('checkout_pending')
    expect(imageMap.size).toBe(source.worldSlugs.length)
    for (const slug of source.worldSlugs) {
      expect(committedWorlds.has(slug)).toBe(true)
      expect(imageMap.has(slug)).toBe(true)
    }
  })

  it('exercises the actual build entry point against a temporary artifact directory', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'plot-sprout-quiet-corner-map-build-'))
    const buildDir = join(tempDir, 'quiet-corner-story-map-card-pack')
    try {
      const { manifest } = await buildQuietCornerStoryMapCardPack({
        buildDir,
        recordRoot: tempDir,
        writePdf: async ({ pdfPath }) => {
          writeFileSync(pdfPath, fakePdf(21))
        },
      })

      expect(manifest.productSlug).toBe('quiet-corner-story-map-card-pack')
      expect(manifest.sourcePageCount).toBe(16)
      expect(manifest.files.assets.length).toBe(16)
      expect(existsSync(join(buildDir, 'source', 'quiet-corner-story-map-card-pack.html'))).toBe(true)
      expect(existsSync(join(buildDir, 'README.txt'))).toBe(true)
      expect(existsSync(join(buildDir, 'manifest.json'))).toBe(true)
      expect(readFileSync(join(buildDir, 'quiet-corner-story-map-card-pack.zip')).subarray(0, 2).toString('ascii')).toBe('PK')
      expect(readFileSync(join(buildDir, 'source', 'quiet-corner-story-map-card-pack.html'), 'utf8').match(/class="[^"]*story-map-card-page/g)).toHaveLength(16)
    } finally {
      rmSync(tempDir, { recursive: true, force: true })
    }
  }, 15000)

  it('renders printable quiet-corner map card HTML with adult guide, local images, and no checkout copy', () => {
    const html = renderQuietCornerStoryMapCardPackHtml(
      validQuietCornerMapSource(),
      worlds,
      new Map(mapWorldSlugs.map((worldSlug) => [worldSlug, `assets/${worldSlug}.jpg`])),
    )

    expect(html).toContain('<!doctype html>')
    expect(html).toContain('@page')
    expect(html).toContain('Quiet Corner Story Map Card Pack')
    expect(html).toContain('Story map coaching')
    expect(html).toContain('Privacy and safety notes')
    expect(html).toContain('Map front')
    expect(html.match(/class="[^"]*story-map-card-page/g)).toHaveLength(16)
    expect(html).toContain('assets/seed-library-map-room.jpg')
    expect(html).not.toMatch(/checkout|payment link|buy now|stripe|gumroad|\baccount\b|login|upload|public post|public review|rating|stars|comments|forum|GPS|coordinates|\baddress\b|route|real home|phone|email|photo|camera|window safety|weather safety|publisher|bestseller|copyright|franchise|Harry Potter|Disney|Pokemon|Marvel|Star Wars|Minecraft|medical|legal|therapy|grief|\bgrade\b|\bscore\b|contest|prize|\btimer\b|tracking|tracker|behavior report|politics|religion|romance|weapon|violence/i)
  })

  it('builds a reusable product artifact manifest for the quiet-corner map card pack', () => {
    const manifest = buildProductArtifactManifest(validQuietCornerMapSource(), {
      pdf: {
        path: 'product-build/quiet-corner-story-map-card-pack/Quiet-Corner-Story-Map-Card-Pack.pdf',
        size: 123,
        sha256: 'pdf',
      },
      zip: {
        path: 'product-build/quiet-corner-story-map-card-pack/quiet-corner-story-map-card-pack.zip',
        size: 234,
        sha256: 'zip',
      },
      sourceHtml: {
        path: 'product-build/quiet-corner-story-map-card-pack/source/quiet-corner-story-map-card-pack.html',
        size: 345,
        sha256: 'html',
      },
      assets: [],
    })

    expect(manifest.productSlug).toBe('quiet-corner-story-map-card-pack')
    expect(manifest.sourcePageCount).toBe(16)
    expect(manifest.files.pdf.sha256).toBe('pdf')
  })

  it('keeps every built quiet-corner map card artifact page within one sheet after images load', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'plot-sprout-quiet-corner-map-layout-'))
    const buildDir = join(tempDir, 'quiet-corner-story-map-card-pack')
    const browser = await chromium.launch({ headless: true })
    try {
      await buildQuietCornerStoryMapCardPack({
        buildDir,
        recordRoot: tempDir,
        writePdf: async ({ pdfPath }) => {
          writeFileSync(pdfPath, fakePdf(21))
        },
      })
      const page = await browser.newPage({ viewport: { width: 1100, height: 1500 } })
      await page.goto(pathToFileURL(join(buildDir, 'source', 'quiet-corner-story-map-card-pack.html')).href, {
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
    const tempDir = mkdtempSync(join(tmpdir(), 'plot-sprout-quiet-corner-map-deterministic-'))
    const firstBuildDir = join(tempDir, 'first')
    const secondBuildDir = join(tempDir, 'second')
    try {
      const first = await buildQuietCornerStoryMapCardPack({
        buildDir: firstBuildDir,
        recordRoot: firstBuildDir,
      })
      await new Promise((resolve) => setTimeout(resolve, 1100))
      const second = await buildQuietCornerStoryMapCardPack({
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
