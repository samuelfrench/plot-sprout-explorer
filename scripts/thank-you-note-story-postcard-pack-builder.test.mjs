import { describe, expect, it } from 'vitest'
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromium } from 'playwright'

import { buildProductArtifactManifest } from './rainy-day-pack-builder.mjs'
import {
  validateThankYouNoteStoryPostcardPackSource,
  validateThankYouNoteStoryPostcardPackSourceFiles,
} from './product-artifact-policy.mjs'
import {
  buildThankYouNoteStoryPostcardPack,
  loadThankYouNoteStoryPostcardPackBuildInputs,
  renderThankYouNoteStoryPostcardPackHtml,
} from './thank-you-note-story-postcard-pack-builder.mjs'

const safety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles.'

function fakePdf(pageCount) {
  return Buffer.from(
    `%PDF-1.7\n${Array.from({ length: pageCount }, (_, index) => `${index + 1} 0 obj << /Type /Page >> endobj`).join('\n')}\n%%EOF\n`,
  )
}

const postcardWorldAges = {
  'teacup-town-weather-window': '7-8',
  'button-bakery-map-mixup': '7-9',
  'pocket-park-notice-board': '7-9',
  'spoon-ferry-lunchbox-harbor': '7-9',
  'penny-path-compass-shop': '7-9',
  'rain-gauge-railway': '8-10',
  'seed-library-map-room': '8-10',
  'greenhouse-gear-garden': '8-10',
  'pantry-measurement-mystery': '8-10',
  'tidepool-timekeepers-lab': '8-10',
  'margin-note-market': '10-11',
  'index-card-theater-club': '10-11',
  'revision-river-ferry': '10-11',
  'clue-label-tower-museum': '10-11',
  'binding-day-boardwalk': '10-11',
  'compass-craft-academy': '10-11',
}

const postcardWorldSlugs = Object.keys(postcardWorldAges)

function postcard(index, worldSlug, ageBand) {
  return {
    id: `thank-you-postcard-${String(index).padStart(2, '0')}`,
    title: `Thank-You Story Postcard ${index}`,
    worldSlug,
    ageBand,
    thankYouSkill: 'specific thank-you detail',
    useCase: 'A screen-free thank-you note starter with an invented story detail and no personal data collection.',
    adultSetup: 'Print one postcard, set out pencils, and choose one ordinary object before writing starts.',
    kidDirection: 'Write one kind thank-you sentence, add one tiny invented story detail, and choose a polite close.',
    noteStarter: 'Thank you for the kind thing you gave or did: ____________________________',
    storyBridge: 'In my pretend story, that kindness becomes this helpful object: ____________________________',
    politeClose: 'A warm closing sentence I can use is: ____________________________',
    drawingPrompt: 'Draw or label one tiny story object here: ____________________________',
    revisionNudge: 'Make one word clearer before the postcard is finished: ____________________________',
    quietOption: 'A quiet writer can point, sketch, dictate, or fill one blank here: ____________________________',
    takeHomeLine: 'Take-home finish step: add one detail or title here: ____________________________',
  }
}

function validThankYouSource(overrides = {}) {
  return {
    batchId: '2026-06-02-batch22',
    generatedAt: '2026-06-02',
    productSlug: 'thank-you-note-story-postcard-pack',
    title: 'Thank-You Note Story Postcard Pack',
    pricePoint: '$21',
    audience: 'Parents, homeschool families, tutors, relatives, and co-op groups helping kids write thank-you notes.',
    sessionLength: '16 printable thank-you story postcards plus adult guide tools and revision prompts',
    safetyNote: safety,
    artifact: {
      pdfPath: 'product-build/thank-you-note-story-postcard-pack/Thank-You-Note-Story-Postcard-Pack.pdf',
      zipPath: 'product-build/thank-you-note-story-postcard-pack/thank-you-note-story-postcard-pack.zip',
      sourceHtmlPath:
        'product-build/thank-you-note-story-postcard-pack/source/thank-you-note-story-postcard-pack.html',
      manifestPath: 'product-build/thank-you-note-story-postcard-pack/manifest.json',
    },
    sourceFiles: [
      'content/product-artifacts/lanes/batch22-thank-you-postcards-a.json',
      'content/product-artifacts/lanes/batch22-thank-you-postcards-b.json',
      'content/product-artifacts/lanes/batch22-thank-you-postcards-c.json',
      'content/product-artifacts/lanes/batch22-thank-you-tools.json',
    ],
    worldSlugs: postcardWorldSlugs,
    cover: {
      kicker: 'Printable thank-you note story pack',
      headline: 'Thank-You Note Story Postcard Pack',
      subhead: 'Sixteen printable postcards that turn gratitude into a tiny story detail.',
      included: [
        '16 printable thank-you story postcards',
        'Adult setup guide',
        'Coaching moves',
        'Privacy notes',
        'Handoff notes',
        'Pack reset notes',
        'Six note situations',
        'Ten revision prompts',
        'Eight optional share prompts',
        'Provider-ready PDF and ZIP artifact',
      ],
    },
    adultGuide: {
      setup: ['Print postcards.', 'Choose pencils.', 'Keep addresses separate.', 'Use ordinary objects.', 'Keep sharing optional.', 'Save extras.'],
      coachingMoves: ['Model one sentence.', 'Offer two choices.', 'Ask for one detail.', 'Praise specificity.', 'Invite revision.', 'End kindly.'],
      privacyNotes: ['Do not collect addresses.', 'Do not write full names.', 'Skip gift prices.', 'Keep pages offline.', 'Share only by choice.'],
      handoff: ['Send one postcard home.', 'Mark one finish step.', 'Keep envelopes separate.', 'Let adults handle delivery.', 'Store no copies.'],
      reset: ['Stack extras.', 'Sharpen pencils.', 'Refresh object slips.', 'Keep samples generic.'],
    },
    noteSituations: Array.from({ length: 6 }, (_, index) => ({
      name: `Thank-You Situation ${index + 1}`,
      bestFor: 'A short screen-free thank-you note moment.',
      steps: [
        'Name the kindness without private labels: ____________________________',
        'Choose one ordinary object for the story bridge: ____________________________',
        'Write one kind detail sentence: ____________________________',
        'Choose one polite close: ____________________________',
      ],
    })),
    revisionPrompts: Array.from({ length: 10 }, (_, index) => ({
      title: `Revision Prompt ${index + 1}`,
      skill: 'revision polish',
      direction: 'Swap one plain word for a clearer thank-you word: ____________________________',
      adultLine: 'A grown-up can ask which word sounds most specific: ____________________________',
    })),
    optionalSharePrompts: [
      'Read one thank-you sentence aloud if you want: ____________________________',
      'Show one invented story object: ____________________________',
      'Point to one clearer word: ____________________________',
      'Share one polite close: ____________________________',
      'Ask an adult to read your favorite line: ____________________________',
      'Circle the detail you want to keep private: ____________________________',
      'Name one ordinary object from the story bridge: ____________________________',
      'Choose one finish step for later: ____________________________',
    ],
    postcards: postcardWorldSlugs.map((worldSlug, index) =>
      postcard(index + 1, worldSlug, postcardWorldAges[worldSlug]),
    ),
    ...overrides,
  }
}

const product = {
  slug: 'thank-you-note-story-postcard-pack',
  title: 'Thank-You Note Story Postcard Pack',
  pricePoint: '$21',
  status: 'checkout_pending',
  worldSlugs: postcardWorldSlugs,
}

const worldAges = new Map(
  postcardWorldSlugs.map((worldSlug) => [worldSlug, { ageBand: postcardWorldAges[worldSlug] }]),
)

const worlds = new Map(
  postcardWorldSlugs.map((worldSlug) => [
    worldSlug,
    {
      title: worldSlug
        .split('-')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' '),
      ageBand: postcardWorldAges[worldSlug],
      premise: 'A friendly invented world for a screen-free thank-you story postcard.',
    },
  ]),
)

describe('Thank-You Note Story Postcard Pack policy', () => {
  it('accepts a valid source with sixteen printable thank-you postcards', () => {
    expect(validateThankYouNoteStoryPostcardPackSource(validThankYouSource(), product, worldAges)).toEqual([])
  })

  it('rejects a postcard response field without a writable blank', () => {
    const source = validThankYouSource()
    source.postcards[0].noteStarter = 'Thank you for the kind thing.'

    expect(validateThankYouNoteStoryPostcardPackSource(source, product, worldAges)).toContain(
      'postcards[0].noteStarter must include a writable blank.',
    )
  })

  it('rejects address collection, publishing, pricing, and unsafe pressure language', () => {
    const source = validThankYouSource()
    source.adultGuide.setup[0] =
      'Collect addresses, phone numbers, emails, full names, photos, gift prices, and upload every note for public publishing.'
    source.postcards[0].kidDirection =
      'Win a prize by using a timer, scoring grief therapy details, legal advice, branded characters, romance, weapons, and politics.'

    expect(validateThankYouNoteStoryPostcardPackSource(source, product, worldAges)).toEqual(
      expect.arrayContaining([
        'Thank-You Note Story Postcard Pack source includes address, full-name, child-name, phone, email, photo, gift-price, family-record, upload, public-publishing, account, roster, attendance, sign-in, or behavior-report language.',
        'Thank-You Note Story Postcard Pack source includes medical, legal, therapy, diagnosis, grief, family-conflict, assessment, grade, score, guaranteed-outcome, contest, prize, timer-pressure, gambling, politics, religion, romance, weapon, violence, branded, ad-targeting, or unsafe physical language.',
      ]),
    )
  })

  it('keeps declared source lane files reproducible with the committed thank-you source', () => {
    const root = resolve(import.meta.dirname, '..')
    const source = JSON.parse(
      readFileSync(resolve(root, 'content', 'product-artifacts', 'thank-you-note-story-postcard-pack.json'), 'utf8'),
    )

    expect(validateThankYouNoteStoryPostcardPackSourceFiles(source, root)).toEqual([])
  })
})

describe('Thank-You Note Story Postcard Pack builder', () => {
  it('loads committed thank-you source, product, worlds, and local image inputs before writing artifacts', () => {
    const { source, product: committedProduct, worlds: committedWorlds, imageMap } =
      loadThankYouNoteStoryPostcardPackBuildInputs()

    expect(source.productSlug).toBe('thank-you-note-story-postcard-pack')
    expect(source.postcards).toHaveLength(16)
    expect(committedProduct.status).toBe('checkout_pending')
    expect(imageMap.size).toBe(source.worldSlugs.length)
    for (const slug of source.worldSlugs) {
      expect(committedWorlds.has(slug)).toBe(true)
      expect(imageMap.has(slug)).toBe(true)
    }
  })

  it('exercises the actual build entry point against a temporary artifact directory', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'plot-sprout-thank-you-build-'))
    const buildDir = join(tempDir, 'thank-you-note-story-postcard-pack')
    try {
      const { manifest } = await buildThankYouNoteStoryPostcardPack({
        buildDir,
        recordRoot: tempDir,
        writePdf: async ({ pdfPath }) => {
          writeFileSync(pdfPath, fakePdf(21))
        },
      })

      expect(manifest.productSlug).toBe('thank-you-note-story-postcard-pack')
      expect(manifest.sourcePageCount).toBe(16)
      expect(manifest.files.assets.length).toBe(16)
      expect(existsSync(join(buildDir, 'source', 'thank-you-note-story-postcard-pack.html'))).toBe(true)
      expect(existsSync(join(buildDir, 'README.txt'))).toBe(true)
      expect(existsSync(join(buildDir, 'manifest.json'))).toBe(true)
      expect(readFileSync(join(buildDir, 'thank-you-note-story-postcard-pack.zip')).subarray(0, 2).toString('ascii')).toBe('PK')
      expect(readFileSync(join(buildDir, 'source', 'thank-you-note-story-postcard-pack.html'), 'utf8').match(/class="[^"]*postcard-page/g)).toHaveLength(16)
    } finally {
      rmSync(tempDir, { recursive: true, force: true })
    }
  }, 15000)

  it('renders printable thank-you source HTML with adult guide, postcards, local images, and no checkout copy', () => {
    const html = renderThankYouNoteStoryPostcardPackHtml(
      validThankYouSource(),
      worlds,
      new Map(postcardWorldSlugs.map((worldSlug) => [worldSlug, `assets/${worldSlug}.jpg`])),
    )

    expect(html).toContain('<!doctype html>')
    expect(html).toContain('@page')
    expect(html).toContain('Thank-You Note Story Postcard Pack')
    expect(html).toContain('Start the thank-you note')
    expect(html).toContain('Polish the thank-you note')
    expect(html).toContain('Privacy notes')
    expect(html).toContain('Family handoff notes')
    expect(html).toContain('Keep pages offline')
    expect(html).toContain('Send one postcard home')
    expect(html).toContain('Take-home finish step')
    expect(html.match(/class="[^"]*postcard-page/g)).toHaveLength(16)
    expect(html).toContain('assets/teacup-town-weather-window.jpg')
    expect(html).not.toMatch(/checkout|payment link|buy now|stripe|gumroad|upload|public publishing|address|phone|email|photo|gift price|medical|legal|therapy|grief|contest|prize|timer/i)
  })

  it('builds a reusable product artifact manifest for the thank-you pack', () => {
    const manifest = buildProductArtifactManifest(validThankYouSource(), {
      pdf: {
        path: 'product-build/thank-you-note-story-postcard-pack/Thank-You-Note-Story-Postcard-Pack.pdf',
        size: 123,
        sha256: 'pdf',
      },
      zip: {
        path: 'product-build/thank-you-note-story-postcard-pack/thank-you-note-story-postcard-pack.zip',
        size: 234,
        sha256: 'zip',
      },
      sourceHtml: {
        path: 'product-build/thank-you-note-story-postcard-pack/source/thank-you-note-story-postcard-pack.html',
        size: 345,
        sha256: 'html',
      },
      assets: [],
    })

    expect(manifest.productSlug).toBe('thank-you-note-story-postcard-pack')
    expect(manifest.sourcePageCount).toBe(16)
    expect(manifest.files.pdf.sha256).toBe('pdf')
  })

  it('keeps every built thank-you postcard artifact page within one sheet after images load', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'plot-sprout-thank-you-layout-'))
    const buildDir = join(tempDir, 'thank-you-note-story-postcard-pack')
    const browser = await chromium.launch({ headless: true })
    try {
      const { paths } = await buildThankYouNoteStoryPostcardPack({
        buildDir,
        recordRoot: tempDir,
        writePdf: async ({ pdfPath }) => {
          writeFileSync(pdfPath, fakePdf(21))
        },
      })
      const page = await browser.newPage({ viewport: { width: 900, height: 1200 } })
      await page.goto(pathToFileURL(paths.htmlPath).href, { waitUntil: 'load' })
      await page.waitForFunction(() =>
        [...document.images].every((image) => image.complete && image.naturalWidth > 0),
      )
      const bodyText = await page.locator('body').innerText()
      expect(bodyText).toContain('Keep finished notes with the household')
      expect(bodyText).toContain('Send each writer home with the finished postcard draft')
      const overflowing = await page.evaluate(() =>
        [...document.querySelectorAll('.pack-page')].map((element, index) => ({
          index,
          scrollHeight: element.scrollHeight,
          clientHeight: element.clientHeight,
          text: element.querySelector('h2')?.textContent ?? element.querySelector('h1')?.textContent ?? '',
        })).filter((pageInfo) => pageInfo.scrollHeight > pageInfo.clientHeight + 2),
      )

      expect(overflowing).toEqual([])
    } finally {
      await browser.close()
      rmSync(tempDir, { recursive: true, force: true })
    }
  }, 15000)
})
