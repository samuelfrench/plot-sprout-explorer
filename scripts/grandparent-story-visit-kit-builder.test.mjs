import { describe, expect, it } from 'vitest'
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { chromium } from 'playwright'

import { buildProductArtifactManifest } from './rainy-day-pack-builder.mjs'
import { starterWorlds } from './starter-worlds.mjs'
import {
  validateGrandparentStoryVisitKitSource,
  validateGrandparentStoryVisitKitSourceFiles,
} from './product-artifact-policy.mjs'
import {
  buildGrandparentStoryVisitKit,
  loadGrandparentStoryVisitKitBuildInputs,
  renderGrandparentStoryVisitKitHtml,
} from './grandparent-story-visit-kit-builder.mjs'

const safety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles.'

function fakePdf(pageCount) {
  return Buffer.from(
    `%PDF-1.7\n${Array.from({ length: pageCount }, (_, index) => `${index + 1} 0 obj << /Type /Page >> endobj`).join('\n')}\n%%EOF\n`,
  )
}

const visitWorldAges = {
  'teacup-town-weather-window': '7-8',
  'spoon-ferry-lunchbox-harbor': '7-9',
  'pocket-park-notice-board': '7-9',
  'button-bakery-map-mixup': '7-9',
  'penny-path-compass-shop': '7-9',
  'tidepool-timekeepers-lab': '8-10',
  'greenhouse-gear-garden': '8-10',
  'pantry-measurement-mystery': '8-10',
  'rain-gauge-railway': '8-10',
  'seed-library-map-room': '8-10',
  'revision-river-ferry': '10-11',
  'clue-label-tower-museum': '10-11',
}

const visitWorldSlugs = Object.keys(visitWorldAges)

function visitQuest(index, worldSlug, ageBand) {
  return {
    id: `grandparent-visit-quest-${String(index).padStart(2, '0')}`,
    title: `Visit Story Quest ${index}`,
    worldSlug,
    ageBand,
    visitSkill: 'conversation-to-fiction detail',
    visitFit: 'A screen-free adult-led visit quest using invented story choices and no personal records.',
    adultSetup: 'Place one printed page, pencils, and blank cards on the table before the visit starts.',
    kidDirection: 'Choose one invented place, one ordinary object, and one helper for a short story.',
    hostPrompt: 'Invite one pretend detail and keep every answer optional, invented, and printable.',
    pageSections: ['Visit story seed', 'Talk-to-story choice', 'Tiny draft', 'Visit wrap'].map((heading) => ({
      heading,
      lines: [
        `${heading} invented place: ____________________________`,
        `${heading} ordinary object: ____________________________`,
        `${heading} short story line: ____________________________`,
      ],
    })),
    quietOption: 'A quiet writer can point, sketch, or fill one blank here: ____________________________',
    takeHomeLine: 'Take-home postcard idea from this visit quest: ____________________________',
  }
}

function validGrandparentSource(overrides = {}) {
  return {
    batchId: '2026-06-02-batch21',
    generatedAt: '2026-06-02',
    productSlug: 'grandparent-story-visit-kit',
    title: 'Grandparent Story Visit Kit',
    pricePoint: '$31',
    audience:
      'Grandparents, relatives, neighbor helpers, library family visit tables, and homeschool co-op family days.',
    sessionLength: '12 printable visit quests plus host guide tools',
    safetyNote: safety,
    artifact: {
      pdfPath: 'product-build/grandparent-story-visit-kit/Grandparent-Story-Visit-Kit.pdf',
      zipPath: 'product-build/grandparent-story-visit-kit/grandparent-story-visit-kit.zip',
      sourceHtmlPath: 'product-build/grandparent-story-visit-kit/source/grandparent-story-visit-kit.html',
      manifestPath: 'product-build/grandparent-story-visit-kit/manifest.json',
    },
    worldSlugs: visitWorldSlugs,
    cover: {
      kicker: 'Printable grandparent visit story kit',
      headline: 'Grandparent Story Visit Kit',
      subhead: 'Twelve adult-led visit quests for screen-free invented stories and take-home postcards.',
      included: [
        '12 printable visit quest pages',
        'Visit setup guide',
        'Story hosting notes',
        'Quiet participation notes',
        'No-data use notes',
        'Take-home handoff notes',
        'Pack reset notes',
        'Six repeatable visit formats',
        'Twelve take-home story postcards',
        'Eight optional family-share prompts',
        'Provider-ready PDF and ZIP artifact',
      ],
    },
    hostGuide: {
      visitSetup: ['Print one quest.', 'Set out pencils.', 'Use invented places.', 'Keep choices optional.', 'Keep pages offline.'],
      storyHosting: ['Read one page.', 'Name one blank.', 'Offer one sample.', 'Invite a short choice.', 'Keep sharing optional.'],
      quietParticipation: ['Point to a choice.', 'Sketch privately.', 'Dictate one phrase.', 'Pass on sharing.', 'Save one card.'],
      noDataUse: ['Use invented helpers.', 'Skip real names.', 'Skip dates.', 'Keep pages offline.'],
      takeHomeHandoff: ['Send one postcard.', 'Choose one next blank.', 'Keep sharing optional.', 'Use invented details.'],
      packReset: ['Collect pencils.', 'Stack pages.', 'Refill blanks.', 'Choose the next quest.'],
    },
    visitFormats: Array.from({ length: 6 }, (_, index) => ({
      name: `Visit Format ${index + 1}`,
      bestFor: 'A calm screen-free family visit story round.',
      steps: [
        'Choose one invented place: ____________________________',
        'Pick one ordinary object: ____________________________',
        'Write one tiny story line: ____________________________',
        'Circle one take-home idea: ____________________________',
      ],
    })),
    takeHomePostcards: Array.from({ length: 12 }, (_, index) => ({
      title: `Postcard Starter ${index + 1}`,
      time: '6 minutes',
      skill: 'story detail',
      direction: 'Add one invented postcard detail here: ____________________________',
      familyLine: 'A grown-up can ask about this pretend choice: ____________________________',
    })),
    optionalFamilySharePrompts: [
      'Show one invented place detail: ____________________________',
      'Read one tiny draft line: ____________________________',
      'Point to one ordinary object clue: ____________________________',
      'Share one title idea: ____________________________',
      'Ask an adult to read one line: ____________________________',
      'Pass and mark one finished detail: ____________________________',
      'Choose one postcard starter to save: ____________________________',
      'Name one kind ending choice: ____________________________',
    ],
    visitQuests: visitWorldSlugs.map((worldSlug, index) =>
      visitQuest(index + 1, worldSlug, visitWorldAges[worldSlug]),
    ),
    ...overrides,
  }
}

const product = {
  slug: 'grandparent-story-visit-kit',
  title: 'Grandparent Story Visit Kit',
  pricePoint: '$31',
  status: 'checkout_pending',
  worldSlugs: visitWorldSlugs,
}

const worldAges = new Map(visitWorldSlugs.map((worldSlug) => [worldSlug, { ageBand: visitWorldAges[worldSlug] }]))

const worlds = new Map(
  visitWorldSlugs.map((worldSlug) => [
    worldSlug,
    {
      title: worldSlug
        .split('-')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' '),
      ageBand: visitWorldAges[worldSlug],
      premise: 'A friendly invented world for a screen-free family visit story quest.',
    },
  ]),
)

describe('Grandparent Story Visit Kit policy', () => {
  it('accepts a valid grandparent visit source with twelve printable visit quests', () => {
    expect(validateGrandparentStoryVisitKitSource(validGrandparentSource(), product, worldAges)).toEqual([])
  })

  it('rejects a visit quest line without a writable blank', () => {
    const source = validGrandparentSource()
    source.visitQuests[0].pageSections[0].lines[0] = 'The visit detail is ready.'

    expect(validateGrandparentStoryVisitKitSource(source, product, worldAges)).toContain(
      'visitQuests[0].pageSections[0].lines[0] must include a writable blank.',
    )
  })

  it('rejects personal family records, private data, and unsafe visit language', () => {
    const source = validGrandparentSource()
    source.hostGuide.visitSetup[0] =
      'Make a family tree, collect genealogy dates, child names, addresses, phone numbers, photos, recordings, and sign-in attendance.'
    source.visitQuests[0].hostPrompt =
      'Upload the story, post public publishing, guarantee assessment scores, award a prize, and use therapy diagnosis for grief counseling.'

    expect(validateGrandparentStoryVisitKitSource(source, product, worldAges)).toEqual(
      expect.arrayContaining([
        'Grandparent Story Visit Kit source includes family-tree, genealogy, family-name, child-name, photo, address, phone, recording, account, upload, public-publishing, roster, attendance, sign-in, or behavior-report language.',
        'Grandparent Story Visit Kit source includes medical, legal, therapy, diagnosis, grief-counseling, family-conflict, assessment, grade, score, guaranteed-outcome, contest, prize, timer-pressure, gambling, or unsafe physical language.',
      ]),
    )
  })

  it('rejects broader family-safety language in grandparent visit source text', () => {
    const source = validGrandparentSource()
    source.visitQuests[0].hostPrompt = 'Run an election campaign with branded heroes, romance scenes, and violent weapon choices.'

    expect(validateGrandparentStoryVisitKitSource(source, product, worldAges)).toContain(
      'Grandparent Story Visit Kit source includes political, branded, romance, scary, violent, weapon, gambling, ad-targeting, or pressure language.',
    )
  })

  it('keeps declared source lane files reproducible with the committed grandparent visit source', () => {
    const root = resolve(import.meta.dirname, '..')
    const source = JSON.parse(
      readFileSync(resolve(root, 'content', 'product-artifacts', 'grandparent-story-visit-kit.json'), 'utf8'),
    )

    expect(validateGrandparentStoryVisitKitSourceFiles(source, root)).toEqual([])
  })
})

describe('Grandparent Story Visit Kit builder', () => {
  it('loads committed grandparent visit source, product, worlds, and local image inputs before writing artifacts', () => {
    const { source, product: committedProduct, worlds: committedWorlds, imageMap } =
      loadGrandparentStoryVisitKitBuildInputs()

    expect(source.productSlug).toBe('grandparent-story-visit-kit')
    expect(source.visitQuests).toHaveLength(12)
    expect(committedProduct.status).toBe('checkout_pending')
    expect(imageMap.size).toBe(source.worldSlugs.length)
    for (const slug of source.worldSlugs) {
      expect(committedWorlds.has(slug)).toBe(true)
      expect(imageMap.has(slug)).toBe(true)
    }
  })

  it('exercises the actual build entry point against a temporary artifact directory', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'plot-sprout-grandparent-visit-build-'))
    const buildDir = join(tempDir, 'grandparent-story-visit-kit')
    try {
      const { manifest } = await buildGrandparentStoryVisitKit({
        buildDir,
        recordRoot: tempDir,
        writePdf: async ({ pdfPath }) => {
          writeFileSync(pdfPath, fakePdf(17))
        },
      })

      expect(manifest.productSlug).toBe('grandparent-story-visit-kit')
      expect(manifest.sourcePageCount).toBe(12)
      expect(manifest.files.assets.length).toBe(12)
      expect(existsSync(join(buildDir, 'source', 'grandparent-story-visit-kit.html'))).toBe(true)
      expect(existsSync(join(buildDir, 'README.txt'))).toBe(true)
      expect(existsSync(join(buildDir, 'manifest.json'))).toBe(true)
      expect(readFileSync(join(buildDir, 'grandparent-story-visit-kit.zip')).subarray(0, 2).toString('ascii')).toBe('PK')
      expect(readFileSync(join(buildDir, 'source', 'grandparent-story-visit-kit.html'), 'utf8').match(/class="[^"]*visit-quest-page/g)).toHaveLength(12)
    } finally {
      rmSync(tempDir, { recursive: true, force: true })
    }
  }, 15000)

  it('renders printable grandparent visit source HTML with host guide, visit quests, local images, and no checkout copy', () => {
    const html = renderGrandparentStoryVisitKitHtml(
      validGrandparentSource(),
      worlds,
      new Map(visitWorldSlugs.map((worldSlug) => [worldSlug, `assets/${worldSlug}.jpg`])),
    )

    expect(html).toContain('<!doctype html>')
    expect(html).toContain('@page')
    expect(html).toContain('Grandparent Story Visit Kit')
    expect(html).toContain('Start the visit story')
    expect(html).toContain('Take-home story postcards')
    expect(html).toContain('Take-home postcard idea from this visit quest')
    expect(html.match(/class="[^"]*visit-quest-page/g)).toHaveLength(12)
    expect(html).toContain('assets/teacup-town-weather-window.jpg')
    expect(html).not.toMatch(/checkout|payment link|buy now|stripe|gumroad|upload|public publishing|family tree|genealogy|medical|therapy|grief|contest|prize/i)
  })

  it('builds a reusable product artifact manifest for the grandparent visit kit', () => {
    const manifest = buildProductArtifactManifest(validGrandparentSource(), {
      pdf: {
        path: 'product-build/grandparent-story-visit-kit/Grandparent-Story-Visit-Kit.pdf',
        sha256: 'a'.repeat(64),
        size: 1200,
      },
      zip: {
        path: 'product-build/grandparent-story-visit-kit/grandparent-story-visit-kit.zip',
        sha256: 'b'.repeat(64),
        size: 2400,
      },
      sourceHtml: {
        path: 'product-build/grandparent-story-visit-kit/source/grandparent-story-visit-kit.html',
        sha256: 'c'.repeat(64),
        size: 3600,
      },
    })

    expect(manifest.productSlug).toBe('grandparent-story-visit-kit')
    expect(manifest.generatedAt).toBe('2026-06-02')
    expect(manifest.sourcePageCount).toBe(12)
    expect(manifest.files.pdf.sha256).toMatch(/^[a-f0-9]{64}$/)
  })

  it('keeps every committed grandparent visit print page within one sheet', async () => {
    const root = resolve(import.meta.dirname, '..')
    const sourcePath = resolve(root, 'content', 'product-artifacts', 'grandparent-story-visit-kit.json')
    expect(existsSync(sourcePath)).toBe(true)
    const visitSource = JSON.parse(readFileSync(sourcePath, 'utf8'))
    const allWorlds = new Map()
    for (const world of starterWorlds) allWorlds.set(world.slug, world)
    for (const file of readdirSync(resolve(root, 'content', 'worlds')).filter((item) => /^batch1-.+\.json$/.test(item))) {
      const data = JSON.parse(readFileSync(resolve(root, 'content', 'worlds', file), 'utf8'))
      for (const world of data.worlds) allWorlds.set(world.slug, world)
    }

    const imageMap = new Map(visitSource.worldSlugs.map((slug) => [slug, `assets/${slug}.jpg`]))
    const html = renderGrandparentStoryVisitKitHtml(visitSource, allWorlds, imageMap)
    const browser = await chromium.launch({ headless: true })
    try {
      const page = await browser.newPage()
      await page.setContent(html, { waitUntil: 'load' })
      const overflows = await page.$$eval('.pack-page', (pages) =>
        pages.map((element, index) => ({
          index: index + 1,
          title: element.querySelector('h2')?.textContent ?? '',
          scrollHeight: element.scrollHeight,
          clientHeight: element.clientHeight,
        })).filter((page) => page.scrollHeight > page.clientHeight + 2),
      )
      expect(overflows).toEqual([])
    } finally {
      await browser.close()
    }
  }, 15000)
})
