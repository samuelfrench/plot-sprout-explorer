import { describe, expect, it } from 'vitest'
import { createHash } from 'node:crypto'
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromium } from 'playwright'

import { buildProductArtifactManifest } from './rainy-day-pack-builder.mjs'
import {
  validateWritingDeskStoryPromptStripPackSource,
  validateWritingDeskStoryPromptStripPackSourceFiles,
} from './product-artifact-policy.mjs'
import {
  buildWritingDeskStoryPromptStripPack,
  loadWritingDeskStoryPromptStripPackBuildInputs,
  renderWritingDeskStoryPromptStripPackHtml,
} from './writing-desk-story-prompt-strip-pack-builder.mjs'

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

const stripWorldAges = {
  'moon-muffin-market': '6-8',
  'puddle-planet-post-office': '6-8',
  'buttonwood-library-train': '7-9',
  'pencil-dragon-academy': '10-11',
  'teacup-town-weather-window': '7-8',
  'pocket-park-notice-board': '7-9',
  'acorn-avenue-errand-office': '7-9',
  'penny-path-compass-shop': '7-9',
  'seed-library-map-room': '8-10',
  'rain-gauge-railway': '8-10',
  'moss-message-observatory': '8-10',
  'tidepool-timekeepers-lab': '8-10',
  'revision-river-ferry': '10-11',
  'clue-label-tower-museum': '10-11',
  'compass-craft-academy': '10-11',
  'almost-invention-workshop': '10-11',
  'margin-note-market': '10-11',
  'binding-day-boardwalk': '10-11',
}

const stripWorldSlugs = Object.keys(stripWorldAges)

const stripSkills = [
  'setting strip',
  'character strip',
  'object strip',
  'sequence strip',
  'dialogue strip',
  'revision strip',
]

function strip(index, worldSlug, ageBand) {
  const skill = stripSkills[(index - 1) % stripSkills.length]
  return {
    id: `writing-desk-strip-${String(index).padStart(2, '0')}`,
    title: `Writing Desk Story Strip ${index}`,
    worldSlug,
    ageBand,
    stripSkill: skill,
    useCase:
      'An adult-led printable prompt strip for turning one desk clue into a short story start.',
    adultSetup:
      'Print the strip, place it at the writing desk, and keep the writing offline on paper.',
    kidDirection:
      'Choose one pretend desk clue, then use the strip to start a made-up story.',
    stripFrontPrompt: 'Front prompt: The desk clue I notice first is ____________________.',
    stripBackPrompt: 'Back prompt: The clue makes the character wonder ____________________.',
    storySeedPrompt: 'Story seed: A folded strip appears beside ____________________.',
    firstLinePath: 'First line path: I moved ____________________, then I discovered ____________________.',
    revisionNudge: 'Revision nudge: Replace one plain desk word with ____________________.',
    quietOptionLine: 'Quiet option: Sketch one symbol, then label it ____________________.',
    takeHomeLine: 'Take-home line: At home, add one new desk clue: ____________________.',
  }
}

function validWritingDeskStripSource(overrides = {}) {
  return {
    batchId: '2026-06-02-batch27',
    generatedAt: '2026-06-02',
    productSlug: 'writing-desk-story-prompt-strip-pack',
    title: 'Writing Desk Story Prompt Strip Pack',
    pricePoint: '$27',
    audience:
      'Families, homeschool groups, tutors, and adult-led writing tables for writers ages 6-11.',
    sessionLength:
      '18 printable prompt strips plus adult guide tools, strip routines, take-home desk strips, and optional share prompts',
    safetyNote: safety,
    artifact: {
      pdfPath:
        'product-build/writing-desk-story-prompt-strip-pack/Writing-Desk-Story-Prompt-Strip-Pack.pdf',
      zipPath:
        'product-build/writing-desk-story-prompt-strip-pack/writing-desk-story-prompt-strip-pack.zip',
      sourceHtmlPath:
        'product-build/writing-desk-story-prompt-strip-pack/source/writing-desk-story-prompt-strip-pack.html',
      manifestPath: 'product-build/writing-desk-story-prompt-strip-pack/manifest.json',
    },
    sourceFiles: [
      'content/product-artifacts/lanes/batch27-desk-strips-a.json',
      'content/product-artifacts/lanes/batch27-desk-strips-b.json',
      'content/product-artifacts/lanes/batch27-desk-strips-c.json',
      'content/product-artifacts/lanes/batch27-desk-strip-tools.json',
    ],
    worldSlugs: stripWorldSlugs,
    cover: {
      kicker: 'Printable writing desk prompt strips',
      headline: 'Writing Desk Story Prompt Strip Pack',
      subhead:
        'Eighteen paper prompt strips turn pretend desk clues into screen-free story starts.',
      included: [
        '18 printable desk prompt strips',
        'Adult setup guide',
        'Writing desk safety notes',
        'Desk-clue story coaching moves',
        'Privacy and family handoff notes',
        'Pack reset notes',
        'Six adult-led strip routines',
        'Ten take-home desk strips',
        'Eight optional share prompts',
        'Provider-ready PDF and ZIP artifact',
      ],
    },
    adultGuide: {
      beforeSession: [
        'Print the prompt strips, take-home strips, and adult guide before the session.',
        'Say that every desk, drawer, note, and character must be invented.',
        'Choose one strip routine before writers begin.',
        'Keep the session offline, paper-only, and adult-led.',
        'Explain that the strip is a private writing prompt, not a measuring tool.',
      ],
      deskSetup: [
        'Place one strip and one blank page where the adult can see the writing.',
        'Use pretend desk clues instead of personal names, room labels, or group labels.',
        'Let pointing, sketching, dictating, or filling one blank count as progress.',
        'Keep finished strips in an adult folder until they go home.',
        'Use the back of the strip for one clue, one question, or one first line.',
      ],
      stripStoryCoaching: [
        'Ask for one invented desk clue first.',
        'Ask what kind of fictional character would notice the clue.',
        'Ask what the clue changes in the setting.',
        'Ask for a first, next, and finally path if the writer wants structure.',
        'Ask for one revision word that makes the desk clue clearer.',
      ],
      privacyAndSafetyNotes: [
        'Use invented names, role words, or blank labels for every person on the strips.',
        'Use broad place words instead of personal room labels or group labels.',
        'Keep every strip offline with the family adult, tutor, or table host.',
        'Sharing stays optional and limited to one invented word, sketch, or line.',
        'Check every take-home strip for private details before it leaves the adult-led table.',
      ],
      familyHandoff: [
        'Send one finished paper strip and one blank take-home strip with each writer.',
        'Tell family adults that five to nine quiet minutes is enough for one extra story clue.',
        'Invite praise for one clear word, sketch, or sentence.',
        'Ask adults to keep personal names and narrow place labels off the page.',
        'Suggest saving the strip as a starter for a later printable story.',
      ],
      reset: [
        'Collect unused strips and blank pages.',
        'Check finished pages for private details before they go home.',
        'Recycle scrap pages that only hold practice marks.',
        'Restock the adult folder with fresh strip pages.',
      ],
    },
    stripRoutines: Array.from({ length: 6 }, (_, index) => ({
      name: `Strip Routine ${index + 1}`,
      bestFor: 'A calm adult-led paper writing moment with one invented desk clue.',
      steps: [
        'Adult chooses one broad pretend desk idea and reads the paper-only reminder.',
        'Writer chooses one setting, character, object, sequence, dialogue, or revision move.',
        'Adult models how the clue can become an invented story seed.',
        'Writer drafts one short first line on the strip.',
      ],
    })),
    takeHomeDeskStrips: Array.from({ length: 10 }, (_, index) => ({
      title: `Desk Strip ${index + 1}`,
      time: '7 minutes',
      skill: stripSkills[index % stripSkills.length],
      direction: 'Choose one invented desk clue and write it here: ____________________.',
      familyLine: 'A grown-up can ask which detail should stay in the story: ____________________.',
    })),
    optionalSharePrompts: [
      'Read one invented desk clue if you choose: ____________________.',
      'Show one sketched symbol from the strip: ____________________.',
      'Name one made-up desk label without private details: ____________________.',
      'Share one first-line word you want to keep: ____________________.',
      'Point to one revision word that helped the clue: ____________________.',
      'Ask an adult to read your favorite strip line: ____________________.',
      'Circle one clue you want to keep private: ____________________.',
      'Choose one finish step for later: ____________________.',
    ],
    strips: stripWorldSlugs.map((worldSlug, index) => strip(index + 1, worldSlug, stripWorldAges[worldSlug])),
    ...overrides,
  }
}

const product = {
  slug: 'writing-desk-story-prompt-strip-pack',
  title: 'Writing Desk Story Prompt Strip Pack',
  pricePoint: '$27',
  status: 'checkout_pending',
  worldSlugs: stripWorldSlugs,
}

const worldAges = new Map(
  stripWorldSlugs.map((worldSlug) => [worldSlug, { ageBand: stripWorldAges[worldSlug] }]),
)

const worlds = new Map(
  stripWorldSlugs.map((worldSlug) => [
    worldSlug,
    {
      slug: worldSlug,
      title: worldSlug
        .split('-')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' '),
      ageBand: stripWorldAges[worldSlug],
      premise: 'A friendly invented world for a screen-free story strip prompt.',
    },
  ]),
)

describe('Writing Desk Story Prompt Strip Pack policy', () => {
  it('accepts a valid source with eighteen printable story prompt strips', () => {
    expect(validateWritingDeskStoryPromptStripPackSource(validWritingDeskStripSource(), product, worldAges)).toEqual([])
  })

  it('rejects a strip response field without a writable blank', () => {
    const source = validWritingDeskStripSource()
    source.strips[0].stripFrontPrompt = 'My strip has a desk clue.'

    expect(validateWritingDeskStoryPromptStripPackSource(source, product, worldAges)).toContain(
      'strips[0].stripFrontPrompt must include a writable blank.',
    )
  })

  it('rejects accounts, public reviews, ratings, trackers, scoring, uploads, and unsafe language', () => {
    const source = validWritingDeskStripSource()
    source.adultGuide.beforeSession[0] =
      'Create accounts, upload photos, publish public posts, collect child names, grades, scores, ratings, comments, exact addresses, and behavior trackers.'
    source.strips[0].kidDirection =
      'Write a public review with publisher details, bestseller ranking, timer, prize, politics, religion, romance, weapons, violence, doctor, lawyer, therapist, diagnosis, grief, Harry Potter, Disney, Pokemon, Marvel, Star Wars, and Minecraft.'

    expect(validateWritingDeskStoryPromptStripPackSource(source, product, worldAges)).toEqual(
      expect.arrayContaining([
        'Writing Desk Story Prompt Strip Pack source includes account, upload, public-posting, review/rating, exact-place, contact, photo, child-profile, grade, score, roster, attendance, sign-in, behavior-report, tracker, schedule, or private-child-data language.',
        'Writing Desk Story Prompt Strip Pack source includes real book title, author, publisher, franchise, branded/copyrighted, review/rating, medical, legal, therapy, diagnosis, grief, assessment, grade, score, guaranteed-outcome, contest, prize, timer-pressure, gambling, politics, religion, romance, weapon, violence, ad-targeting, or unsafe physical language.',
      ]),
    )
  })

  it('keeps declared source lane files reproducible with the committed writing desk strip source', () => {
    const root = resolve(import.meta.dirname, '..')
    const source = JSON.parse(
      readFileSync(resolve(root, 'content', 'product-artifacts', 'writing-desk-story-prompt-strip-pack.json'), 'utf8'),
    )

    expect(validateWritingDeskStoryPromptStripPackSourceFiles(source, root)).toEqual([])
  })
})

describe('Writing Desk Story Prompt Strip Pack builder', () => {
  it('loads committed writing desk strip source, product, worlds, and local image inputs before writing artifacts', () => {
    const { source, product: committedProduct, worlds: committedWorlds, imageMap } =
      loadWritingDeskStoryPromptStripPackBuildInputs()

    expect(source.productSlug).toBe('writing-desk-story-prompt-strip-pack')
    expect(source.strips).toHaveLength(18)
    expect(committedProduct.status).toBe('checkout_pending')
    expect(imageMap.size).toBe(source.worldSlugs.length)
    for (const slug of source.worldSlugs) {
      expect(committedWorlds.has(slug)).toBe(true)
      expect(imageMap.has(slug)).toBe(true)
    }
  })

  it('exercises the actual build entry point against a temporary artifact directory', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'plot-sprout-writing-desk-strip-build-'))
    const buildDir = join(tempDir, 'writing-desk-story-prompt-strip-pack')
    try {
      const { manifest } = await buildWritingDeskStoryPromptStripPack({
        buildDir,
        recordRoot: tempDir,
        writePdf: async ({ pdfPath }) => {
          writeFileSync(pdfPath, fakePdf(23))
        },
      })

      expect(manifest.productSlug).toBe('writing-desk-story-prompt-strip-pack')
      expect(manifest.sourcePageCount).toBe(18)
      expect(manifest.files.assets.length).toBe(18)
      expect(existsSync(join(buildDir, 'source', 'writing-desk-story-prompt-strip-pack.html'))).toBe(true)
      expect(existsSync(join(buildDir, 'README.txt'))).toBe(true)
      expect(existsSync(join(buildDir, 'manifest.json'))).toBe(true)
      expect(readFileSync(join(buildDir, 'writing-desk-story-prompt-strip-pack.zip')).subarray(0, 2).toString('ascii')).toBe('PK')
      expect(readFileSync(join(buildDir, 'source', 'writing-desk-story-prompt-strip-pack.html'), 'utf8').match(/class="[^"]*strip-page/g)).toHaveLength(18)
    } finally {
      rmSync(tempDir, { recursive: true, force: true })
    }
  }, 15000)

  it('renders printable writing desk strip HTML with adult guide, local images, and no checkout copy', () => {
    const html = renderWritingDeskStoryPromptStripPackHtml(
      validWritingDeskStripSource(),
      worlds,
      new Map(stripWorldSlugs.map((worldSlug) => [worldSlug, `assets/${worldSlug}.jpg`])),
    )

    expect(html).toContain('<!doctype html>')
    expect(html).toContain('@page')
    expect(html).toContain('Writing Desk Story Prompt Strip Pack')
    expect(html).toContain('Desk-clue story coaching')
    expect(html).toContain('Privacy and safety notes')
    expect(html).toContain('Front prompt')
    expect(html.match(/class="[^"]*strip-page/g)).toHaveLength(18)
    expect(html).toContain('assets/seed-library-map-room.jpg')
    expect(html).not.toMatch(/checkout|payment link|buy now|stripe|gumroad|\baccount\b|login|upload|public post|public review|rating|stars|comments|forum|GPS|coordinates|\baddress\b|phone|email|photo|camera|publisher|bestseller|copyright|franchise|Harry Potter|Disney|Pokemon|Marvel|Star Wars|Minecraft|medical|legal|therapy|grief|\bgrade\b|\bscore\b|contest|prize|\btimer\b|tracking|tracker|behavior report|politics|religion|romance|weapon|violence/i)
  })

  it('builds a reusable product artifact manifest for the writing desk strip pack', () => {
    const manifest = buildProductArtifactManifest(validWritingDeskStripSource(), {
      pdf: {
        path: 'product-build/writing-desk-story-prompt-strip-pack/Writing-Desk-Story-Prompt-Strip-Pack.pdf',
        size: 123,
        sha256: 'pdf',
      },
      zip: {
        path: 'product-build/writing-desk-story-prompt-strip-pack/writing-desk-story-prompt-strip-pack.zip',
        size: 234,
        sha256: 'zip',
      },
      sourceHtml: {
        path: 'product-build/writing-desk-story-prompt-strip-pack/source/writing-desk-story-prompt-strip-pack.html',
        size: 345,
        sha256: 'html',
      },
      assets: [],
    })

    expect(manifest.productSlug).toBe('writing-desk-story-prompt-strip-pack')
    expect(manifest.sourcePageCount).toBe(18)
    expect(manifest.files.pdf.sha256).toBe('pdf')
  })

  it('keeps every built writing desk strip artifact page within one sheet after images load', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'plot-sprout-writing-desk-strip-layout-'))
    const buildDir = join(tempDir, 'writing-desk-story-prompt-strip-pack')
    const browser = await chromium.launch({ headless: true })
    try {
      await buildWritingDeskStoryPromptStripPack({
        buildDir,
        recordRoot: tempDir,
        writePdf: async ({ pdfPath }) => {
          writeFileSync(pdfPath, fakePdf(23))
        },
      })
      const page = await browser.newPage({ viewport: { width: 1100, height: 1500 } })
      await page.goto(pathToFileURL(join(buildDir, 'source', 'writing-desk-story-prompt-strip-pack.html')).href, {
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
    const tempDir = mkdtempSync(join(tmpdir(), 'plot-sprout-writing-desk-strip-deterministic-'))
    const firstBuildDir = join(tempDir, 'first')
    const secondBuildDir = join(tempDir, 'second')
    try {
      const first = await buildWritingDeskStoryPromptStripPack({
        buildDir: firstBuildDir,
        recordRoot: firstBuildDir,
      })
      await new Promise((resolve) => setTimeout(resolve, 1100))
      const second = await buildWritingDeskStoryPromptStripPack({
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
