import { describe, expect, it } from 'vitest'
import { createHash } from 'node:crypto'
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromium } from 'playwright'

import { buildProductArtifactManifest } from './rainy-day-pack-builder.mjs'
import {
  validateWindowSeatStorySceneCardPackSource,
  validateWindowSeatStorySceneCardPackSourceFiles,
} from './product-artifact-policy.mjs'
import {
  buildWindowSeatStorySceneCardPack,
  loadWindowSeatStorySceneCardPackBuildInputs,
  renderWindowSeatStorySceneCardPackHtml,
} from './window-seat-story-scene-card-pack-builder.mjs'

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

const sceneWorldAges = {
  'moon-muffin-market': '6-8',
  'puddle-planet-post-office': '6-8',
  'buttonwood-library-train': '7-9',
  'teacup-town-weather-window': '7-8',
  'pocket-park-notice-board': '7-9',
  'spoon-ferry-lunchbox-harbor': '7-9',
  'acorn-avenue-errand-office': '7-9',
  'penny-path-compass-shop': '7-9',
  'seed-library-map-room': '8-10',
  'rain-gauge-railway': '8-10',
  'moss-message-observatory': '8-10',
  'tidepool-timekeepers-lab': '8-10',
  'revision-river-ferry': '10-11',
  'clue-label-tower-museum': '10-11',
  'almost-invention-workshop': '10-11',
  'binding-day-boardwalk': '10-11',
}

const sceneWorldSlugs = Object.keys(sceneWorldAges)

const sceneSkills = [
  'setting scene',
  'character scene',
  'object scene',
  'choice scene',
  'sequence scene',
  'sensory scene',
  'revision scene',
  'label scene',
  'clarity scene',
  'pattern scene',
]

function card(index, worldSlug, ageBand) {
  const skill = sceneSkills[(index - 1) % sceneSkills.length]
  return {
    id: `window-scene-card-${String(index).padStart(2, '0')}`,
    title: `Window Seat Scene Card ${index}`,
    worldSlug,
    ageBand,
    sceneSkill: skill,
    useCase:
      'Adult-led printable scene card for turning one pretend framed view into a short story start: ____________________.',
    adultSetup:
      'Print the card, draw a paper window frame, and keep every idea invented and offline: ____________________.',
    kidDirection:
      'Imagine a pretend view through the frame, then write one clear scene clue: ____________________.',
    sceneFrontPrompt: 'Scene front: Through the pretend frame, I first notice ____________________.',
    sceneBackPrompt: 'Scene back: Add one setting, character, or object detail: ____________________.',
    storySeedPrompt: 'Story seed: The framed view changes when ____________________ appears.',
    firstLinePath: 'First line path: From the window seat, I saw ____________________, then ____________________.',
    revisionNudge: 'Revision nudge: Replace one fuzzy scene word with ____________________.',
    quietOptionLine: 'Quiet option: Sketch the frame first, then label ____________________.',
    takeHomeLine: 'Take-home line: Save this scene card and continue with ____________________.',
  }
}

function validWindowSeatSceneSource(overrides = {}) {
  return {
    batchId: '2026-06-02-batch28',
    generatedAt: '2026-06-02',
    productSlug: 'window-seat-story-scene-card-pack',
    title: 'Window Seat Story Scene Card Pack',
    pricePoint: '$29',
    audience:
      'Families, homeschool groups, tutors, and adult-led writing tables for writers ages 6-11.',
    sessionLength:
      '16 printable scene cards plus adult guide tools, scene routines, take-home scene slips, and optional share prompts',
    safetyNote: safety,
    artifact: {
      pdfPath:
        'product-build/window-seat-story-scene-card-pack/Window-Seat-Story-Scene-Card-Pack.pdf',
      zipPath:
        'product-build/window-seat-story-scene-card-pack/window-seat-story-scene-card-pack.zip',
      sourceHtmlPath:
        'product-build/window-seat-story-scene-card-pack/source/window-seat-story-scene-card-pack.html',
      manifestPath: 'product-build/window-seat-story-scene-card-pack/manifest.json',
    },
    sourceFiles: [
      'content/product-artifacts/lanes/batch28-window-scene-cards-a.json',
      'content/product-artifacts/lanes/batch28-window-scene-cards-b.json',
      'content/product-artifacts/lanes/batch28-window-scene-cards-c.json',
      'content/product-artifacts/lanes/batch28-window-scene-tools.json',
    ],
    worldSlugs: sceneWorldSlugs,
    cover: {
      kicker: 'Printable window-seat scene cards',
      headline: 'Window Seat Story Scene Card Pack',
      subhead:
        'Sixteen paper scene cards turn pretend framed views into screen-free story starts.',
      included: [
        '16 printable window-seat scene cards',
        'Adult setup guide',
        'Pretend framed-view safety notes',
        'Scene story coaching moves',
        'Privacy and family handoff notes',
        'Pack reset notes',
        'Six adult-led scene routines',
        'Ten take-home scene slips',
        'Eight optional share prompts',
        'Provider-ready PDF and ZIP artifact',
      ],
    },
    adultGuide: {
      beforeSession: [
        'Print the scene cards, take-home slips, and adult guide before the session.',
        'Say that window-seat means a pretend framed view or imagined window view only.',
        'Choose one scene routine before writers begin.',
        'Keep the session offline, paper-only, and adult-led.',
        'Explain that the card is a private writing prompt, not a measuring tool.',
      ],
      windowSeatSetup: [
        'Place one scene card and one blank page where the adult can see the writing.',
        'Use broad view words instead of personal names, narrow places, or routines.',
        'Let pointing, sketching, dictating, or filling one blank count as progress.',
        'Keep finished cards in an adult folder until they go home.',
        'Use the back of the card for one clue, one question, or one first line.',
      ],
      sceneStoryCoaching: [
        'Ask for one invented framed view first.',
        'Ask what kind of fictional character would notice the view.',
        'Ask what object, label, pattern, or sound changes the scene.',
        'Ask for a first, next, and finally path if the writer wants structure.',
        'Ask for one revision word that makes the view clearer.',
      ],
      privacyAndSafetyNotes: [
        'Use invented names, role words, or blank labels for every person on the scene cards.',
        'Use broad place words instead of private details or named locations.',
        'Keep every scene card offline with the family adult, tutor, or table host.',
        'Sharing stays optional and limited to one invented word, sketch, or line.',
        'Check every take-home slip for private details before it leaves the adult-led table.',
      ],
      familyHandoff: [
        'Send one finished paper scene card and one blank take-home slip with each writer.',
        'Tell family adults that five to nine quiet minutes is enough for one extra scene clue.',
        'Invite praise for one clear word, sketch, or sentence.',
        'Ask adults to keep personal names and narrow place labels off the page.',
        'Suggest saving the scene card as a starter for a later printable story.',
      ],
      reset: [
        'Collect unused scene cards and blank pages.',
        'Check finished pages for private details before they go home.',
        'Recycle scrap pages that only hold practice marks.',
        'Restock the adult folder with fresh scene cards.',
      ],
    },
    sceneRoutines: Array.from({ length: 6 }, (_, index) => ({
      name: `Scene Routine ${index + 1}`,
      bestFor: 'A calm adult-led paper writing moment with one invented framed view.',
      steps: [
        'Adult chooses one broad pretend view idea and reads the paper-only reminder.',
        'Writer chooses one setting, character, object, sequence, sensory, or revision move.',
        'Adult models how the view can become an invented story seed.',
        'Writer drafts one short first line on the card.',
      ],
    })),
    takeHomeSceneSlips: Array.from({ length: 10 }, (_, index) => ({
      title: `Scene Slip ${index + 1}`,
      time: '7 minutes',
      skill: sceneSkills[index % sceneSkills.length],
      direction: 'Choose one invented framed view and write it here: ____________________.',
      familyLine: 'A grown-up can ask which detail should stay in the story: ____________________.',
    })),
    optionalSharePrompts: [
      'Read one invented view clue if you choose: ____________________.',
      'Show one sketched frame from the card: ____________________.',
      'Name one broad view word without private details: ____________________.',
      'Share one first-line word you want to keep: ____________________.',
      'Point to one revision word that helped the scene: ____________________.',
      'Ask an adult to read your favorite scene line: ____________________.',
      'Circle one clue you want to keep private: ____________________.',
      'Choose one finish step for later: ____________________.',
    ],
    cards: sceneWorldSlugs.map((worldSlug, index) => card(index + 1, worldSlug, sceneWorldAges[worldSlug])),
    ...overrides,
  }
}

const product = {
  slug: 'window-seat-story-scene-card-pack',
  title: 'Window Seat Story Scene Card Pack',
  pricePoint: '$29',
  status: 'checkout_pending',
  worldSlugs: sceneWorldSlugs,
}

const worldAges = new Map(
  sceneWorldSlugs.map((worldSlug) => [worldSlug, { ageBand: sceneWorldAges[worldSlug] }]),
)

const worlds = new Map(
  sceneWorldSlugs.map((worldSlug) => [
    worldSlug,
    {
      slug: worldSlug,
      title: worldSlug
        .split('-')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' '),
      ageBand: sceneWorldAges[worldSlug],
      premise: 'A friendly invented world for a screen-free scene card prompt.',
    },
  ]),
)

describe('Window Seat Story Scene Card Pack policy', () => {
  it('accepts a valid source with sixteen printable story scene cards', () => {
    expect(validateWindowSeatStorySceneCardPackSource(validWindowSeatSceneSource(), product, worldAges)).toEqual([])
  })

  it('rejects a card response field without a writable blank', () => {
    const source = validWindowSeatSceneSource()
    source.cards[0].sceneFrontPrompt = 'My scene has a framed view.'

    expect(validateWindowSeatStorySceneCardPackSource(source, product, worldAges)).toContain(
      'cards[0].sceneFrontPrompt must include a writable blank.',
    )
  })

  it('rejects accounts, real-place, public-review, tracker, scoring, upload, and unsafe language', () => {
    const source = validWindowSeatSceneSource()
    source.adultGuide.beforeSession[0] =
      'Create accounts, upload photos, publish public posts, collect child names, grades, scores, ratings, comments, exact addresses, GPS routes, real homes, phone numbers, emails, and behavior trackers.'
    source.cards[0].kidDirection =
      'Write a public review with publisher details, bestseller ranking, timer, prize, politics, religion, romance, weapons, violence, doctor, lawyer, therapist, diagnosis, grief, Harry Potter, Disney, Pokemon, Marvel, Star Wars, and Minecraft.'

    expect(validateWindowSeatStorySceneCardPackSource(source, product, worldAges)).toEqual(
      expect.arrayContaining([
        'Window Seat Story Scene Card Pack source includes account, upload, public-posting, review/rating, exact-place, real-home, route, contact, photo/camera, child-profile, grade, score, tracker, schedule, or private-child-data language.',
        'Window Seat Story Scene Card Pack source includes real book title, author, publisher, franchise, branded/copyrighted, review/rating, medical, legal, therapy, diagnosis, grief, assessment, grade, score, guaranteed-outcome, contest, prize, timer-pressure, gambling, politics, religion, romance, weapon, violence, ad-targeting, unsafe physical, window-safety, or weather-safety language.',
      ]),
    )
  })

  it('keeps declared source lane files reproducible with the committed window-seat scene source', () => {
    const root = resolve(import.meta.dirname, '..')
    const source = JSON.parse(
      readFileSync(resolve(root, 'content', 'product-artifacts', 'window-seat-story-scene-card-pack.json'), 'utf8'),
    )

    expect(validateWindowSeatStorySceneCardPackSourceFiles(source, root)).toEqual([])
  })
})

describe('Window Seat Story Scene Card Pack builder', () => {
  it('loads committed window-seat scene source, product, worlds, and local image inputs before writing artifacts', () => {
    const { source, product: committedProduct, worlds: committedWorlds, imageMap } =
      loadWindowSeatStorySceneCardPackBuildInputs()

    expect(source.productSlug).toBe('window-seat-story-scene-card-pack')
    expect(source.cards).toHaveLength(16)
    expect(committedProduct.status).toBe('checkout_pending')
    expect(imageMap.size).toBe(source.worldSlugs.length)
    for (const slug of source.worldSlugs) {
      expect(committedWorlds.has(slug)).toBe(true)
      expect(imageMap.has(slug)).toBe(true)
    }
  })

  it('exercises the actual build entry point against a temporary artifact directory', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'plot-sprout-window-seat-scene-build-'))
    const buildDir = join(tempDir, 'window-seat-story-scene-card-pack')
    try {
      const { manifest } = await buildWindowSeatStorySceneCardPack({
        buildDir,
        recordRoot: tempDir,
        writePdf: async ({ pdfPath }) => {
          writeFileSync(pdfPath, fakePdf(21))
        },
      })

      expect(manifest.productSlug).toBe('window-seat-story-scene-card-pack')
      expect(manifest.sourcePageCount).toBe(16)
      expect(manifest.files.assets.length).toBe(16)
      expect(existsSync(join(buildDir, 'source', 'window-seat-story-scene-card-pack.html'))).toBe(true)
      expect(existsSync(join(buildDir, 'README.txt'))).toBe(true)
      expect(existsSync(join(buildDir, 'manifest.json'))).toBe(true)
      expect(readFileSync(join(buildDir, 'window-seat-story-scene-card-pack.zip')).subarray(0, 2).toString('ascii')).toBe('PK')
      expect(readFileSync(join(buildDir, 'source', 'window-seat-story-scene-card-pack.html'), 'utf8').match(/class="[^"]*scene-card-page/g)).toHaveLength(16)
    } finally {
      rmSync(tempDir, { recursive: true, force: true })
    }
  }, 15000)

  it('renders printable window-seat scene card HTML with adult guide, local images, and no checkout copy', () => {
    const html = renderWindowSeatStorySceneCardPackHtml(
      validWindowSeatSceneSource(),
      worlds,
      new Map(sceneWorldSlugs.map((worldSlug) => [worldSlug, `assets/${worldSlug}.jpg`])),
    )

    expect(html).toContain('<!doctype html>')
    expect(html).toContain('@page')
    expect(html).toContain('Window Seat Story Scene Card Pack')
    expect(html).toContain('Scene story coaching')
    expect(html).toContain('Privacy and safety notes')
    expect(html).toContain('Scene front')
    expect(html.match(/class="[^"]*scene-card-page/g)).toHaveLength(16)
    expect(html).toContain('assets/seed-library-map-room.jpg')
    expect(html).not.toMatch(/checkout|payment link|buy now|stripe|gumroad|\baccount\b|login|upload|public post|public review|rating|stars|comments|forum|GPS|coordinates|\baddress\b|route|real home|phone|email|photo|camera|window safety|weather safety|publisher|bestseller|copyright|franchise|Harry Potter|Disney|Pokemon|Marvel|Star Wars|Minecraft|medical|legal|therapy|grief|\bgrade\b|\bscore\b|contest|prize|\btimer\b|tracking|tracker|behavior report|politics|religion|romance|weapon|violence/i)
  })

  it('builds a reusable product artifact manifest for the window-seat scene card pack', () => {
    const manifest = buildProductArtifactManifest(validWindowSeatSceneSource(), {
      pdf: {
        path: 'product-build/window-seat-story-scene-card-pack/Window-Seat-Story-Scene-Card-Pack.pdf',
        size: 123,
        sha256: 'pdf',
      },
      zip: {
        path: 'product-build/window-seat-story-scene-card-pack/window-seat-story-scene-card-pack.zip',
        size: 234,
        sha256: 'zip',
      },
      sourceHtml: {
        path: 'product-build/window-seat-story-scene-card-pack/source/window-seat-story-scene-card-pack.html',
        size: 345,
        sha256: 'html',
      },
      assets: [],
    })

    expect(manifest.productSlug).toBe('window-seat-story-scene-card-pack')
    expect(manifest.sourcePageCount).toBe(16)
    expect(manifest.files.pdf.sha256).toBe('pdf')
  })

  it('keeps every built window-seat scene card artifact page within one sheet after images load', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'plot-sprout-window-seat-scene-layout-'))
    const buildDir = join(tempDir, 'window-seat-story-scene-card-pack')
    const browser = await chromium.launch({ headless: true })
    try {
      await buildWindowSeatStorySceneCardPack({
        buildDir,
        recordRoot: tempDir,
        writePdf: async ({ pdfPath }) => {
          writeFileSync(pdfPath, fakePdf(21))
        },
      })
      const page = await browser.newPage({ viewport: { width: 1100, height: 1500 } })
      await page.goto(pathToFileURL(join(buildDir, 'source', 'window-seat-story-scene-card-pack.html')).href, {
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
    const tempDir = mkdtempSync(join(tmpdir(), 'plot-sprout-window-seat-scene-deterministic-'))
    const firstBuildDir = join(tempDir, 'first')
    const secondBuildDir = join(tempDir, 'second')
    try {
      const first = await buildWindowSeatStorySceneCardPack({
        buildDir: firstBuildDir,
        recordRoot: firstBuildDir,
      })
      await new Promise((resolve) => setTimeout(resolve, 1100))
      const second = await buildWindowSeatStorySceneCardPack({
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
