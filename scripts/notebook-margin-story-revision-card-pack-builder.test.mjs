import { describe, expect, it } from 'vitest'
import { createHash } from 'node:crypto'
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromium } from 'playwright'

import { buildProductArtifactManifest } from './rainy-day-pack-builder.mjs'
import {
  inspectArtifactFiles,
  validateNotebookMarginStoryRevisionCardPackSource,
  validateNotebookMarginStoryRevisionCardPackSourceFiles,
  validateProductWorldSummaries,
} from './product-artifact-policy.mjs'
import {
  buildNotebookMarginStoryRevisionCardPack,
  loadNotebookMarginStoryRevisionCardPackBuildInputs,
  renderNotebookMarginStoryRevisionCardPackHtml,
} from './notebook-margin-story-revision-card-pack-builder.mjs'

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

const revisionWorldAges = {
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

const revisionWorldSlugs = Object.keys(revisionWorldAges)

const revisionSkills = [
  'detail revision',
  'word swap revision',
  'sentence stretch',
  'order revision',
  'question revision',
  'setting revision',
  'character revision',
  'mood revision',
  'object revision',
  'ending revision',
  'beginning revision',
  'sound revision',
]

function card(index, worldSlug, ageBand) {
  const skill = revisionSkills[(index - 1) % revisionSkills.length]
  return {
    id: `notebook-margin-revision-card-${String(index).padStart(2, '0')}`,
    title: `Notebook Margin Story Revision Card ${index}`,
    worldSlug,
    ageBand,
    revisionSkill: skill,
    useCase:
      'Adult-led printable revision move card for turning one pretend notebook-margin cue into a short story start: ____________________.',
    adultSetup:
      'Print the card, name the notebook-margin cue as a fictional paper revision, and keep every idea invented and offline: ____________________.',
    kidDirection:
      'Imagine a pretend notebook-margin revision on the card, then write one clear story cue: ____________________.',
    marginPrompt: 'Margin prompt: The pretend notebook-margin cue first shows ____________________.',
    draftLinePrompt: 'Draft line: Add one setting, character, or object detail to the paper revision: ____________________.',
    revisionMovePrompt: 'Revision move: The cue changes when ____________________ appears.',
    newLinePrompt: 'New line: When the paper cue glowed, I noticed ____________________.',
    checkBackPrompt: 'Check back: Replace one fuzzy revision word with ____________________.',
    quietOptionLine: 'Quiet option: Sketch the cue first, then label ____________________.',
    takeHomeLine: 'Take-home line: Save this revision card and continue with ____________________.',
  }
}

function validNotebookMarginRevisionSource(overrides = {}) {
  return {
    batchId: '2026-06-02-batch32',
    generatedAt: '2026-06-02',
    productSlug: 'notebook-margin-story-revision-card-pack',
    title: 'Notebook Margin Story Revision Card Pack',
    pricePoint: '$37',
    audience:
      'Families, homeschool groups, tutors, and adult-led writing tables for writers ages 6-11.',
    sessionLength:
      '16 printable revision move cards plus adult guide tools, revision routines, take-home revision slips, and optional share prompts',
    safetyNote: safety,
    artifact: {
      pdfPath:
        'product-build/notebook-margin-story-revision-card-pack/Notebook-Margin-Story-Revision-Card-Pack.pdf',
      zipPath:
        'product-build/notebook-margin-story-revision-card-pack/notebook-margin-story-revision-card-pack.zip',
      sourceHtmlPath:
        'product-build/notebook-margin-story-revision-card-pack/source/notebook-margin-story-revision-card-pack.html',
      manifestPath: 'product-build/notebook-margin-story-revision-card-pack/manifest.json',
    },
    sourceFiles: [
      'content/product-artifacts/lanes/batch32-notebook-margin-revision-cards-a.json',
      'content/product-artifacts/lanes/batch32-notebook-margin-revision-cards-b.json',
      'content/product-artifacts/lanes/batch32-notebook-margin-revision-cards-c.json',
      'content/product-artifacts/lanes/batch32-notebook-margin-revision-tools.json',
    ],
    worldSlugs: revisionWorldSlugs,
    cover: {
      kicker: 'Printable paper revision cards',
      headline: 'Notebook Margin Story Revision Card Pack',
      subhead:
        'Sixteen paper revision move cards turn pretend notebook-margin cues into screen-free story starts.',
      included: [
        '16 printable notebook-margin revision cards',
        'Adult setup guide',
        'Fictional revision-card safety notes',
        'Revision move coaching moves',
        'Privacy and family handoff notes',
        'Pack reset notes',
        'Six adult-led revision routines',
        'Ten take-home revision slips',
        'Eight optional share prompts',
        'Provider-ready PDF and ZIP artifact',
      ],
    },
    adultGuide: {
      beforeSession: [
        'Print the revision move cards, take-home slips, and adult guide before the session.',
        'Say that notebook-margin means a fictional paper revision only.',
        'Choose one revision routine before writers begin.',
        'Keep the session offline, paper-only, and adult-led.',
        'Explain that the card is a private writing prompt, not a measuring tool.',
      ],
      paperRevisionSetup: [
        'Place one revision move card and one blank page where the adult can see the writing.',
        'Use broad invented place words instead of private details or named locations.',
        'Let pointing, sketching, dictating, or filling one blank count as progress.',
        'Keep finished cards in an adult folder until they go to the family adult.',
        'Use the back of the card for one cue, one question, or one first line.',
      ],
      revisionCoaching: [
        'Ask for one invented notebook-margin cue first.',
        'Ask what kind of fictional character would notice the revision.',
        'Ask what object, pattern, color, or sound changes the story cue.',
        'Ask for a first, next, and finally paper line if the writer wants structure.',
        'Ask for one revision word that makes the revision clearer.',
      ],
      privacyAndSafetyNotes: [
        'Use invented names, role words, or blank labels for every person on the revision move cards.',
        'Use broad place words instead of private details or named locations.',
        'Keep every revision move card offline with the family adult, tutor, or table host.',
        'Sharing stays optional and limited to one invented word, sketch, or line.',
        'Check every take-home slip for private details before it leaves the adult-led table.',
      ],
      familyHandoff: [
        'Send one finished paper revision move card and one blank take-home slip with each writer.',
        'Tell family adults that five to nine quiet minutes is enough for one extra story cue.',
        'Invite praise for one clear word, sketch, or sentence.',
        'Ask adults to keep personal names and narrow place labels off the page.',
        'Suggest saving the revision move card as a starter for a later printable story.',
      ],
      reset: [
        'Collect unused revision move cards and blank pages.',
        'Check finished pages for private details before they go to family adults.',
        'Recycle scrap pages that only hold practice marks.',
        'Restock the adult folder with fresh revision move cards.',
      ],
    },
    revisionRoutines: Array.from({ length: 6 }, (_, index) => ({
      name: `Revision Routine ${index + 1}`,
      bestFor: 'A calm adult-led paper writing moment with one fictional notebook-margin cue.',
      steps: [
        'Adult chooses one broad invented revision idea and reads the paper-only reminder.',
        'Writer chooses one detail, word, sentence, order, question, setting, character, object, mood, beginning, sound, or ending revision.',
        'Adult models how the cue can become an invented revision move.',
        'Writer drafts one short first line on the card.',
      ],
    })),
    takeHomeRevisionSlips: Array.from({ length: 10 }, (_, index) => ({
      title: `Revision Slip ${index + 1}`,
      time: '7 minutes',
      skill: revisionSkills[index % revisionSkills.length],
      direction: 'Choose one fictional notebook-margin cue and write it here: ____________________.',
      familyLine: 'A grown-up can ask which revision detail should stay in the story: ____________________.',
    })),
    optionalSharePrompts: [
      'Read one invented revision cue if you choose: ____________________.',
      'Show one sketched cue from the card: ____________________.',
      'Name one broad revision word without private details: ____________________.',
      'Share one first-line word you want to keep: ____________________.',
      'Point to one revision word that helped the cue: ____________________.',
      'Ask an adult to read your favorite revision move line: ____________________.',
      'Circle one cue you want to keep private: ____________________.',
      'Choose one finish step for later: ____________________.',
    ],
    cards: revisionWorldSlugs.map((worldSlug, index) => card(index + 1, worldSlug, revisionWorldAges[worldSlug])),
    ...overrides,
  }
}

const product = {
  slug: 'notebook-margin-story-revision-card-pack',
  title: 'Notebook Margin Story Revision Card Pack',
  pricePoint: '$37',
  status: 'checkout_pending',
  worldSlugs: revisionWorldSlugs,
  worldSummaries: revisionWorldSlugs.map((slug) => ({
    slug,
    summary: `A linked fictional world summary for ${slug}.`,
  })),
}

const worldAges = new Map(
  revisionWorldSlugs.map((worldSlug) => [worldSlug, { ageBand: revisionWorldAges[worldSlug] }]),
)

const worlds = new Map(
  revisionWorldSlugs.map((worldSlug) => [
    worldSlug,
    {
      slug: worldSlug,
      title: worldSlug
        .split('-')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' '),
      ageBand: revisionWorldAges[worldSlug],
      premise: 'A friendly invented world for a screen-free revision move card prompt.',
    },
  ]),
)

describe('Notebook Margin Story Revision Card Pack policy', () => {
  it('accepts a valid source with sixteen printable revision move cards', () => {
    expect(validateNotebookMarginStoryRevisionCardPackSource(validNotebookMarginRevisionSource(), product, worldAges)).toEqual([])
  })

  it('rejects a card response field without a writable blank', () => {
    const source = validNotebookMarginRevisionSource()
    source.cards[0].marginPrompt = 'My cue has a warm color.'

    expect(validateNotebookMarginStoryRevisionCardPackSource(source, product, worldAges)).toContain(
      'cards[0].marginPrompt must include a writable blank.',
    )
  })

  it('rejects accounts, real-place, public-review, outdoor, tracker, scoring, upload, and unsafe language', () => {
    const source = validNotebookMarginRevisionSource()
    source.adultGuide.beforeSession[0] =
      'Create accounts, upload photos, publish public posts, collect child names, grades, scores, ratings, comments, exact addresses, GPS routes, real homes, houses, neighbors, streets, windows, outdoor safety instructions, phone numbers, emails, and behavior trackers.'
    source.cards[0].kidDirection =
      'Write a public review with publisher details, bestseller ranking, timer, prize, politics, religion, romance, weapons, violence, doctor, lawyer, therapist, diagnosis, grief, Harry Potter, Disney, Pokemon, Marvel, Star Wars, and Minecraft.'

    expect(validateNotebookMarginStoryRevisionCardPackSource(source, product, worldAges)).toEqual(
      expect.arrayContaining([
        'Notebook Margin Story Revision Card Pack source includes account, upload, public-posting, review/rating, exact-place, real-home, route, outdoor, contact, photo/camera, child-profile, grade, score, tracker, schedule, or private-child-data language.',
        'Notebook Margin Story Revision Card Pack source includes real book title, author, publisher, franchise, branded/copyrighted, review/rating, medical, legal, therapy, diagnosis, grief, assessment, grade, score, guaranteed-outcome, contest, prize, timer-pressure, gambling, politics, religion, romance, weapon, violence, ad-targeting, unsafe physical, window-safety, outdoor-safety, or weather-safety language.',
      ]),
    )
  })

  it('rejects missing, duplicate, or off-link Notebook Margin product world summaries', () => {
    expect(validateProductWorldSummaries(product, 'Notebook Margin Story Revision Card Pack')).toEqual([])

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

    expect(validateProductWorldSummaries(missingSummary, 'Notebook Margin Story Revision Card Pack')).toContain(
      'Notebook Margin Story Revision Card Pack worldSummaries must cover every linked world.',
    )
    expect(validateProductWorldSummaries(duplicateSummary, 'Notebook Margin Story Revision Card Pack')).toContain(
      'Notebook Margin Story Revision Card Pack worldSummaries[1].slug is duplicated.',
    )
    expect(validateProductWorldSummaries(offLinkSummary, 'Notebook Margin Story Revision Card Pack')).toContain(
      'Notebook Margin Story Revision Card Pack worldSummaries[0].slug must match a linked world slug.',
    )
  })

  it('keeps declared source lane files reproducible with the committed notebook-margin revision source', () => {
    const root = resolve(import.meta.dirname, '..')
    const source = JSON.parse(
      readFileSync(resolve(root, 'content', 'product-artifacts', 'notebook-margin-story-revision-card-pack.json'), 'utf8'),
    )

    expect(validateNotebookMarginStoryRevisionCardPackSourceFiles(source, root)).toEqual([])
  })
})

describe('Notebook Margin Story Revision Card Pack builder', () => {
  it('loads committed notebook-margin revision source, product, worlds, and local image inputs before writing artifacts', () => {
    const { source, product: committedProduct, worlds: committedWorlds, imageMap } =
      loadNotebookMarginStoryRevisionCardPackBuildInputs()

    expect(source.productSlug).toBe('notebook-margin-story-revision-card-pack')
    expect(source.cards).toHaveLength(16)
    expect(committedProduct.status).toBe('checkout_pending')
    expect(imageMap.size).toBe(source.worldSlugs.length)
    for (const slug of source.worldSlugs) {
      expect(committedWorlds.has(slug)).toBe(true)
      expect(imageMap.has(slug)).toBe(true)
    }
  })

  it('exercises the actual build entry point against a temporary artifact directory', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'plot-sprout-notebook-margin-revision-build-'))
    const buildDir = join(tempDir, 'notebook-margin-story-revision-card-pack')
    try {
      const { manifest } = await buildNotebookMarginStoryRevisionCardPack({
        buildDir,
        recordRoot: tempDir,
        writePdf: async ({ pdfPath }) => {
          writeFileSync(pdfPath, fakePdf(21))
        },
      })

      expect(manifest.productSlug).toBe('notebook-margin-story-revision-card-pack')
      expect(manifest.sourcePageCount).toBe(16)
      expect(manifest.files.assets.length).toBe(16)
      expect(existsSync(join(buildDir, 'source', 'notebook-margin-story-revision-card-pack.html'))).toBe(true)
      expect(existsSync(join(buildDir, 'README.txt'))).toBe(true)
      expect(existsSync(join(buildDir, 'manifest.json'))).toBe(true)
      expect(readFileSync(join(buildDir, 'notebook-margin-story-revision-card-pack.zip')).subarray(0, 2).toString('ascii')).toBe('PK')
      expect(readFileSync(join(buildDir, 'source', 'notebook-margin-story-revision-card-pack.html'), 'utf8').match(/class="[^"]*story-revision-card-page/g)).toHaveLength(16)
    } finally {
      rmSync(tempDir, { recursive: true, force: true })
    }
  }, 15000)

  it('renders printable notebook-margin revision card HTML with adult guide, local images, and no checkout copy', () => {
    const html = renderNotebookMarginStoryRevisionCardPackHtml(
      validNotebookMarginRevisionSource(),
      worlds,
      new Map(revisionWorldSlugs.map((worldSlug) => [worldSlug, `assets/${worldSlug}.jpg`])),
    )

    expect(html).toContain('<!doctype html>')
    expect(html).toContain('@page')
    expect(html).toContain('Notebook Margin Story Revision Card Pack')
    expect(html).toContain('Revision move coaching')
    expect(html).toContain('Privacy and safety notes')
    expect(html).toContain('Margin prompt')
    expect(html.match(/class="[^"]*story-revision-card-page/g)).toHaveLength(16)
    expect(html).toContain('assets/seed-library-map-room.jpg')
    expect(html).not.toMatch(/checkout|payment link|buy now|stripe|gumroad|\baccount\b|login|upload|public post|public review|rating|stars|comments|forum|GPS|coordinates|\baddress\b|route|real home|house|neighbor|street|outside|outdoor safety|window safety|weather safety|publisher|bestseller|copyright|franchise|Harry Potter|Disney|Pokemon|Marvel|Star Wars|Minecraft|medical|legal|therapy|grief|\bgrade\b|\bscore\b|contest|prize|\btimer\b|tracking|tracker|behavior report|politics|religion|romance|weapon|violence/i)
  })

  it('builds a reusable product artifact manifest for the notebook-margin revision card pack', () => {
    const manifest = buildProductArtifactManifest(validNotebookMarginRevisionSource(), {
      pdf: {
        path: 'product-build/notebook-margin-story-revision-card-pack/Notebook-Margin-Story-Revision-Card-Pack.pdf',
        size: 123,
        sha256: 'pdf',
      },
      zip: {
        path: 'product-build/notebook-margin-story-revision-card-pack/notebook-margin-story-revision-card-pack.zip',
        size: 234,
        sha256: 'zip',
      },
      sourceHtml: {
        path: 'product-build/notebook-margin-story-revision-card-pack/source/notebook-margin-story-revision-card-pack.html',
        size: 345,
        sha256: 'html',
      },
      assets: [],
    })

    expect(manifest.productSlug).toBe('notebook-margin-story-revision-card-pack')
    expect(manifest.sourcePageCount).toBe(16)
    expect(manifest.files.pdf.sha256).toBe('pdf')
  })

  it('inspects notebook-margin revision artifacts against the notebook-specific required paths', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'plot-sprout-notebook-margin-revision-inspect-'))
    const buildDir = join(tempDir, 'product-build', 'notebook-margin-story-revision-card-pack')
    const source = validNotebookMarginRevisionSource()
    try {
      await buildNotebookMarginStoryRevisionCardPack({
        buildDir,
        recordRoot: tempDir,
        writePdf: async ({ pdfPath }) => {
          writeFileSync(pdfPath, fakePdf(21))
        },
      })

      const status = inspectArtifactFiles(tempDir, source.artifact, { expectedPdfPages: 21 })

      expect(status.valid).toBe(true)
      expect(status.errors).toEqual([])
      expect(status.files.pdf.path).toBe(
        'product-build/notebook-margin-story-revision-card-pack/Notebook-Margin-Story-Revision-Card-Pack.pdf',
      )
      expect(status.files.zip.path).toBe(
        'product-build/notebook-margin-story-revision-card-pack/notebook-margin-story-revision-card-pack.zip',
      )
    } finally {
      rmSync(tempDir, { recursive: true, force: true })
    }
  }, 15000)

  it('keeps every built notebook-margin revision card artifact page within one sheet after images load', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'plot-sprout-notebook-margin-revision-layout-'))
    const buildDir = join(tempDir, 'notebook-margin-story-revision-card-pack')
    const browser = await chromium.launch({ headless: true })
    try {
      await buildNotebookMarginStoryRevisionCardPack({
        buildDir,
        recordRoot: tempDir,
        writePdf: async ({ pdfPath }) => {
          writeFileSync(pdfPath, fakePdf(21))
        },
      })
      const page = await browser.newPage({ viewport: { width: 1100, height: 1500 } })
      await page.goto(pathToFileURL(join(buildDir, 'source', 'notebook-margin-story-revision-card-pack.html')).href, {
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
    const tempDir = mkdtempSync(join(tmpdir(), 'plot-sprout-notebook-margin-revision-deterministic-'))
    const firstBuildDir = join(tempDir, 'first')
    const secondBuildDir = join(tempDir, 'second')
    try {
      const first = await buildNotebookMarginStoryRevisionCardPack({
        buildDir: firstBuildDir,
        recordRoot: firstBuildDir,
      })
      await new Promise((resolve) => setTimeout(resolve, 1100))
      const second = await buildNotebookMarginStoryRevisionCardPack({
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
