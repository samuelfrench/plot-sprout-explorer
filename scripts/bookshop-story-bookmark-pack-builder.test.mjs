import { describe, expect, it } from 'vitest'
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromium } from 'playwright'

import { buildProductArtifactManifest } from './rainy-day-pack-builder.mjs'
import {
  validateBookshopStoryBookmarkPackSource,
  validateBookshopStoryBookmarkPackSourceFiles,
} from './product-artifact-policy.mjs'
import {
  buildBookshopStoryBookmarkPack,
  loadBookshopStoryBookmarkPackBuildInputs,
  renderBookshopStoryBookmarkPackHtml,
} from './bookshop-story-bookmark-pack-builder.mjs'

const safety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles.'

function fakePdf(pageCount) {
  return Buffer.from(
    `%PDF-1.7\n${Array.from({ length: pageCount }, (_, index) => `${index + 1} 0 obj << /Type /Page >> endobj`).join('\n')}\n%%EOF\n`,
  )
}

const bookmarkWorldAges = {
  'puddle-planet-post-office': '6-8',
  'buttonwood-library-train': '7-9',
  'teacup-town-weather-window': '7-8',
  'pocket-park-notice-board': '7-9',
  'acorn-avenue-errand-office': '7-9',
  'penny-path-compass-shop': '7-9',
  'seed-library-map-room': '8-10',
  'rain-gauge-railway': '8-10',
  'moss-message-observatory': '8-10',
  'compass-craft-academy': '10-11',
  'almost-invention-workshop': '10-11',
  'margin-note-market': '10-11',
  'binding-day-boardwalk': '10-11',
  'index-card-theater-club': '10-11',
  'clue-label-tower-museum': '10-11',
  'revision-river-ferry': '10-11',
}

const bookmarkWorldSlugs = Object.keys(bookmarkWorldAges)

const bookmarkSkills = [
  'setting bookmark',
  'character bookmark',
  'sensory bookmark',
  'object bookmark',
  'sequence bookmark',
  'revision bookmark',
]

function bookmark(index, worldSlug, ageBand) {
  const skill = bookmarkSkills[(index - 1) % bookmarkSkills.length]
  return {
    id: `bookshop-bookmark-${String(index).padStart(2, '0')}`,
    title: `Bookshop Story Bookmark ${index}`,
    worldSlug,
    ageBand,
    bookmarkSkill: skill,
    useCase:
      'An adult-led printable bookmark prompt for turning one invented shelf clue into a short story start.',
    adultSetup:
      'Print the bookmark, cut or fold it only if an adult chooses, and keep the writing offline on paper.',
    kidDirection:
      'Imagine a pretend bookshop shelf with no real titles, then choose one tiny clue for a made-up story.',
    bookmarkFrontPrompt: 'Front prompt: My pretend shelf clue is ____________________.',
    bookmarkBackPrompt: 'Back prompt: The clue makes the character wonder ____________________.',
    storySeedPrompt: 'Story seed: A bookmark appears beside ____________________.',
    firstLinePath: 'First line path: I noticed ____________________, then I decided ____________________.',
    revisionNudge: 'Revision nudge: Replace one plain bookmark word with ____________________.',
    quietOptionLine: 'Quiet option: Sketch one symbol, then label it ____________________.',
    takeHomeLine: 'Take-home line: At home, add one new shelf clue: ____________________.',
  }
}

function validBookshopBookmarkSource(overrides = {}) {
  return {
    batchId: '2026-06-02-batch26',
    generatedAt: '2026-06-02',
    productSlug: 'bookshop-story-bookmark-pack',
    title: 'Bookshop Story Bookmark Pack',
    pricePoint: '$25',
    audience:
      'Families, homeschool groups, tutors, library tables, and adult-led bookmark writers ages 6-11.',
    sessionLength:
      '16 printable story bookmarks plus adult guide tools, bookmark formats, take-home bookmark slips, and optional share prompts',
    safetyNote: safety,
    artifact: {
      pdfPath: 'product-build/bookshop-story-bookmark-pack/Bookshop-Story-Bookmark-Pack.pdf',
      zipPath: 'product-build/bookshop-story-bookmark-pack/bookshop-story-bookmark-pack.zip',
      sourceHtmlPath:
        'product-build/bookshop-story-bookmark-pack/source/bookshop-story-bookmark-pack.html',
      manifestPath: 'product-build/bookshop-story-bookmark-pack/manifest.json',
    },
    sourceFiles: [
      'content/product-artifacts/lanes/batch26-bookmarks-a.json',
      'content/product-artifacts/lanes/batch26-bookmarks-b.json',
      'content/product-artifacts/lanes/batch26-bookmarks-c.json',
      'content/product-artifacts/lanes/batch26-bookmark-tools.json',
    ],
    worldSlugs: bookmarkWorldSlugs,
    cover: {
      kicker: 'Printable bookshop story bookmarks',
      headline: 'Bookshop Story Bookmark Pack',
      subhead:
        'Sixteen paper bookmark prompts turn invented shelf clues into screen-free story starts.',
      included: [
        '16 printable story bookmarks',
        'Adult setup guide',
        'Bookshop safety notes',
        'Shelf-clue story coaching moves',
        'Privacy and family handoff notes',
        'Pack reset notes',
        'Six adult-led bookmark formats',
        'Ten take-home bookmark slips',
        'Eight optional share prompts',
        'Provider-ready PDF and ZIP artifact',
      ],
    },
    adultGuide: {
      beforeSession: [
        'Print the bookmarks, take-home slips, and adult guide before the session.',
        'Say that every shelf, title, and character must be invented.',
        'Choose one bookmark format before writers begin.',
        'Keep the session offline, paper-only, and adult-led.',
        'Explain that the bookmark is a writing prompt, not a public sharing tool.',
      ],
      bookmarkSetup: [
        'Place one bookmark, one pencil, and one blank slip where the adult can see the page.',
        'Use pretend shelf labels instead of real store, school, or library names.',
        'Let pointing, sketching, dictating, or filling one blank count as progress.',
        'Keep finished bookmarks in an adult folder until they go home.',
        'Use the back of the bookmark for one clue, one question, or one first line.',
      ],
      shelfStoryCoaching: [
        'Ask for one invented shelf clue first.',
        'Ask what kind of fictional character would notice the clue.',
        'Ask what the clue changes in the setting.',
        'Ask for a first, next, and finally path if the writer wants structure.',
        'Ask for one revision word that makes the bookmark clue clearer.',
      ],
      privacyAndSafetyNotes: [
        'Use invented names, role words, or blank labels for every person on the bookmarks.',
        'Use broad place words instead of exact store names, school names, group names, or addresses.',
        'Keep every bookmark offline with the family adult, tutor, or table host.',
        'Sharing stays optional and limited to one invented word, sketch, or line.',
        'Check every take-home slip for private details before it leaves the adult-led table.',
      ],
      familyHandoff: [
        'Send one finished paper bookmark and one blank take-home slip with each writer.',
        'Tell family adults that five to nine quiet minutes is enough for one extra story clue.',
        'Invite praise for one clear word, sketch, or sentence.',
        'Ask adults to keep real book titles, author names, and store names off the page.',
        'Suggest saving the bookmark as a starter for a later printable story.',
      ],
      reset: [
        'Collect unused bookmarks, slips, and pencils.',
        'Review finished pages for private details before they go home.',
        'Recycle scrap pages that only hold practice marks.',
        'Restock the adult folder with fresh bookmark pages.',
      ],
    },
    bookmarkFormats: Array.from({ length: 6 }, (_, index) => ({
      name: `Bookmark Format ${index + 1}`,
      bestFor: 'A calm adult-led paper writing moment with one invented shelf clue.',
      steps: [
        'Adult chooses one broad pretend shelf idea and reads the paper-only reminder.',
        'Writer chooses one setting, character, object, sequence, sensory detail, or revision move.',
        'Adult models how the clue can become an invented story seed.',
        'Writer drafts one short first line on the bookmark.',
      ],
    })),
    takeHomeBookmarkSlips: Array.from({ length: 10 }, (_, index) => ({
      title: `Bookmark Slip ${index + 1}`,
      time: '7 minutes',
      skill: bookmarkSkills[index % bookmarkSkills.length],
      direction: 'Choose one invented shelf clue and write it here: ____________________.',
      familyLine: 'A grown-up can ask which detail should stay in the story: ____________________.',
    })),
    optionalSharePrompts: [
      'Read one invented bookmark clue if you choose: ____________________.',
      'Show one sketched symbol from the bookmark: ____________________.',
      'Name one made-up shelf label without private details: ____________________.',
      'Share one first-line word you want to keep: ____________________.',
      'Point to one revision word that helped the clue: ____________________.',
      'Ask an adult to read your favorite bookmark line: ____________________.',
      'Circle one clue you want to keep private: ____________________.',
      'Choose one finish step for later: ____________________.',
    ],
    bookmarks: bookmarkWorldSlugs.map((worldSlug, index) =>
      bookmark(index + 1, worldSlug, bookmarkWorldAges[worldSlug]),
    ),
    ...overrides,
  }
}

const product = {
  slug: 'bookshop-story-bookmark-pack',
  title: 'Bookshop Story Bookmark Pack',
  pricePoint: '$25',
  status: 'checkout_pending',
  worldSlugs: bookmarkWorldSlugs,
}

const worldAges = new Map(
  bookmarkWorldSlugs.map((worldSlug) => [worldSlug, { ageBand: bookmarkWorldAges[worldSlug] }]),
)

const worlds = new Map(
  bookmarkWorldSlugs.map((worldSlug) => [
    worldSlug,
    {
      slug: worldSlug,
      title: worldSlug
        .split('-')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' '),
      ageBand: bookmarkWorldAges[worldSlug],
      premise: 'A friendly invented world for a screen-free story bookmark prompt.',
    },
  ]),
)

describe('Bookshop Story Bookmark Pack policy', () => {
  it('accepts a valid source with sixteen printable story bookmarks', () => {
    expect(validateBookshopStoryBookmarkPackSource(validBookshopBookmarkSource(), product, worldAges)).toEqual([])
  })

  it('rejects a bookmark response field without a writable blank', () => {
    const source = validBookshopBookmarkSource()
    source.bookmarks[0].bookmarkFrontPrompt = 'My bookmark has a shelf clue.'

    expect(validateBookshopStoryBookmarkPackSource(source, product, worldAges)).toContain(
      'bookmarks[0].bookmarkFrontPrompt must include a writable blank.',
    )
  })

  it('rejects accounts, public reviews, ratings, real books, scoring, uploads, and unsafe language', () => {
    const source = validBookshopBookmarkSource()
    source.adultGuide.beforeSession[0] =
      'Create accounts, upload photos, publish public posts, collect child names, grades, scores, ratings, comments, and exact addresses.'
    source.bookmarks[0].kidDirection =
      'Write a public review of Harry Potter by J.K. Rowling with publisher details, bestseller ranking, timer, prize, politics, religion, romance, weapons, violence, doctor, lawyer, therapist, diagnosis, and grief.'

    expect(validateBookshopStoryBookmarkPackSource(source, product, worldAges)).toEqual(
      expect.arrayContaining([
        'Bookshop Story Bookmark Pack source includes account, upload, public-posting, review/rating, exact-place, contact, photo, child-profile, grade, score, roster, attendance, sign-in, behavior-report, or private-child-data language.',
        'Bookshop Story Bookmark Pack source includes real book title, author, publisher, franchise, branded/copyrighted, reading-review/rating, medical, legal, therapy, diagnosis, grief, assessment, grade, score, guaranteed-outcome, contest, prize, timer-pressure, gambling, politics, religion, romance, weapon, violence, ad-targeting, or unsafe physical language.',
      ]),
    )
  })

  it('keeps declared source lane files reproducible with the committed bookshop bookmark source', () => {
    const root = resolve(import.meta.dirname, '..')
    const source = JSON.parse(
      readFileSync(resolve(root, 'content', 'product-artifacts', 'bookshop-story-bookmark-pack.json'), 'utf8'),
    )

    expect(validateBookshopStoryBookmarkPackSourceFiles(source, root)).toEqual([])
  })
})

describe('Bookshop Story Bookmark Pack builder', () => {
  it('loads committed bookshop bookmark source, product, worlds, and local image inputs before writing artifacts', () => {
    const { source, product: committedProduct, worlds: committedWorlds, imageMap } =
      loadBookshopStoryBookmarkPackBuildInputs()

    expect(source.productSlug).toBe('bookshop-story-bookmark-pack')
    expect(source.bookmarks).toHaveLength(16)
    expect(committedProduct.status).toBe('checkout_pending')
    expect(imageMap.size).toBe(source.worldSlugs.length)
    for (const slug of source.worldSlugs) {
      expect(committedWorlds.has(slug)).toBe(true)
      expect(imageMap.has(slug)).toBe(true)
    }
  })

  it('exercises the actual build entry point against a temporary artifact directory', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'plot-sprout-bookshop-bookmark-build-'))
    const buildDir = join(tempDir, 'bookshop-story-bookmark-pack')
    try {
      const { manifest } = await buildBookshopStoryBookmarkPack({
        buildDir,
        recordRoot: tempDir,
        writePdf: async ({ pdfPath }) => {
          writeFileSync(pdfPath, fakePdf(21))
        },
      })

      expect(manifest.productSlug).toBe('bookshop-story-bookmark-pack')
      expect(manifest.sourcePageCount).toBe(16)
      expect(manifest.files.assets.length).toBe(16)
      expect(existsSync(join(buildDir, 'source', 'bookshop-story-bookmark-pack.html'))).toBe(true)
      expect(existsSync(join(buildDir, 'README.txt'))).toBe(true)
      expect(existsSync(join(buildDir, 'manifest.json'))).toBe(true)
      expect(readFileSync(join(buildDir, 'bookshop-story-bookmark-pack.zip')).subarray(0, 2).toString('ascii')).toBe('PK')
      expect(readFileSync(join(buildDir, 'source', 'bookshop-story-bookmark-pack.html'), 'utf8').match(/class="[^"]*bookmark-page/g)).toHaveLength(16)
    } finally {
      rmSync(tempDir, { recursive: true, force: true })
    }
  }, 15000)

  it('renders printable bookshop bookmark HTML with adult guide, local images, and no checkout copy', () => {
    const html = renderBookshopStoryBookmarkPackHtml(
      validBookshopBookmarkSource(),
      worlds,
      new Map(bookmarkWorldSlugs.map((worldSlug) => [worldSlug, `assets/${worldSlug}.jpg`])),
    )

    expect(html).toContain('<!doctype html>')
    expect(html).toContain('@page')
    expect(html).toContain('Bookshop Story Bookmark Pack')
    expect(html).toContain('Shelf-clue story coaching')
    expect(html).toContain('Privacy and safety notes')
    expect(html).toContain('Front prompt')
    expect(html.match(/class="[^"]*bookmark-page/g)).toHaveLength(16)
    expect(html).toContain('assets/seed-library-map-room.jpg')
    expect(html).not.toMatch(/checkout|payment link|buy now|stripe|gumroad|\baccount\b|login|upload|public post|public review|rating|stars|comments|forum|GPS|coordinates|\baddress\b|phone|email|photo|camera|publisher|bestseller|copyright|franchise|Harry Potter|Disney|Pokemon|Marvel|Star Wars|Minecraft|medical|legal|therapy|grief|\bgrade\b|\bscore\b|contest|prize|\btimer\b|politics|religion|romance|weapon|violence/i)
  })

  it('builds a reusable product artifact manifest for the bookshop bookmark pack', () => {
    const manifest = buildProductArtifactManifest(validBookshopBookmarkSource(), {
      pdf: {
        path: 'product-build/bookshop-story-bookmark-pack/Bookshop-Story-Bookmark-Pack.pdf',
        size: 123,
        sha256: 'pdf',
      },
      zip: {
        path: 'product-build/bookshop-story-bookmark-pack/bookshop-story-bookmark-pack.zip',
        size: 234,
        sha256: 'zip',
      },
      sourceHtml: {
        path: 'product-build/bookshop-story-bookmark-pack/source/bookshop-story-bookmark-pack.html',
        size: 345,
        sha256: 'html',
      },
      assets: [],
    })

    expect(manifest.productSlug).toBe('bookshop-story-bookmark-pack')
    expect(manifest.sourcePageCount).toBe(16)
    expect(manifest.files.pdf.sha256).toBe('pdf')
  })

  it('keeps every built bookshop bookmark artifact page within one sheet after images load', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'plot-sprout-bookshop-bookmark-layout-'))
    const buildDir = join(tempDir, 'bookshop-story-bookmark-pack')
    const browser = await chromium.launch({ headless: true })
    try {
      await buildBookshopStoryBookmarkPack({
        buildDir,
        recordRoot: tempDir,
        writePdf: async ({ pdfPath }) => {
          writeFileSync(pdfPath, fakePdf(21))
        },
      })
      const page = await browser.newPage({ viewport: { width: 1100, height: 1500 } })
      await page.goto(pathToFileURL(join(buildDir, 'source', 'bookshop-story-bookmark-pack.html')).href, {
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
})
