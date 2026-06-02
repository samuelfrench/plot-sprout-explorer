import { describe, expect, it } from 'vitest'
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { chromium } from 'playwright'

import { buildProductArtifactManifest } from './rainy-day-pack-builder.mjs'
import { starterWorlds } from './starter-worlds.mjs'
import { validateSummerCampStoryCircleKitSource } from './product-artifact-policy.mjs'
import {
  buildSummerCampStoryCircleKit,
  loadSummerCampStoryCircleBuildInputs,
  renderSummerCampStoryCircleKitHtml,
} from './summer-camp-story-circle-kit-builder.mjs'

const safety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles.'

function fakePdf(pageCount) {
  return Buffer.from(
    `%PDF-1.7\n${Array.from({ length: pageCount }, (_, index) => `${index + 1} 0 obj << /Type /Page >> endobj`).join('\n')}\n%%EOF\n`,
  )
}

function activity(index, worldSlug, ageBand) {
  return {
    id: `summer-camp-circle-${index}`,
    title: `Summer Camp Circle ${index}`,
    worldSlug,
    ageBand,
    circleSkill: 'setting detail',
    sessionFit: '15-minute adult-led camp story circle for a table group.',
    counselorSetup: 'Print one activity page, set out pencils, and choose one invented world card.',
    kidDirection: 'Pick one camp table detail, write one short line, and circle one keeper word.',
    counselorPrompt: 'Ask for one invented place detail before asking for a sentence.',
    pageSections: ['Gather', 'Circle', 'Finish'].map((heading) => ({
      heading,
      lines: [
        `${heading} detail: ____________________________`,
        `${heading} choice: ____________________________`,
        `${heading} sentence: ____________________________`,
      ],
    })),
    groupTwistLine: 'The group twist is ____________________________',
    wrapUpLine: 'One line I can keep is ____________________________',
    quietOptionLine: 'A quiet version of this idea is ____________________________',
  }
}

const campWorldAges = {
  'teacup-town-weather-window': '7-8',
  'rain-gauge-railway': '8-10',
  'spoon-ferry-lunchbox-harbor': '7-9',
  'rain-boot-route-rangers': '7-9',
  'pocket-park-notice-board': '7-9',
  'acorn-avenue-errand-office': '7-9',
  'button-bakery-map-mixup': '7-9',
  'seed-library-map-room': '8-10',
  'greenhouse-gear-garden': '8-10',
  'index-card-theater-club': '10-11',
  'penny-path-compass-shop': '7-9',
  'margin-note-market': '10-11',
  'clue-label-tower-museum': '10-11',
  'revision-river-ferry': '10-11',
  'compass-craft-academy': '10-11',
  'almost-invention-workshop': '10-11',
}

const campWorldSlugs = Object.keys(campWorldAges)

function validSummerCampSource(overrides = {}) {
  const worldSlugs = campWorldSlugs
  return {
    batchId: '2026-06-02-batch17',
    generatedAt: '2026-06-02',
    productSlug: 'summer-camp-story-circle-kit',
    title: 'Summer Camp Story Circle Kit',
    pricePoint: '$59',
    audience: 'Day camps, summer camps, recreation programs, camp counselors, and homeschool summer co-ops for ages 6-11.',
    sessionLength: '16 printable adult-led camp story circles plus counselor setup tools',
    safetyNote: safety,
    artifact: {
      pdfPath: 'product-build/summer-camp-story-circle-kit/Summer-Camp-Story-Circle-Kit.pdf',
      zipPath: 'product-build/summer-camp-story-circle-kit/summer-camp-story-circle-kit.zip',
      sourceHtmlPath: 'product-build/summer-camp-story-circle-kit/source/summer-camp-story-circle-kit.html',
      manifestPath: 'product-build/summer-camp-story-circle-kit/manifest.json',
    },
    worldSlugs,
    cover: {
      kicker: 'Printable summer camp writing circle kit',
      headline: 'Summer Camp Story Circle Kit',
      subhead: 'Sixteen adult-led story circles for camp tables, recreation programs, and summer co-ops.',
      included: [
        '16 story circle activity pages',
        'Before-camp prep guide',
        'Counselor setup checklist',
        'Running-circle coaching notes',
        'Quiet option notes',
        'No-data use notes',
        'Six circle formats',
        'Ten take-home trail cards',
        'Eight optional share prompts',
        'Provider-ready PDF and ZIP artifact',
      ],
    },
    counselorGuide: {
      beforeCamp: ['Choose pages.', 'Print packets.', 'Clip pencils.', 'Pick one circle format.', 'Prepare a quiet backup.'],
      setup: ['Place one page.', 'Set pencil tray.', 'Choose a world.', 'Read the goal.', 'Keep extras in a folder.'],
      runningCircle: ['Ask for detail.', 'Offer two choices.', 'Read one line back.', 'Circle one word.', 'Stop while it feels light.'],
      quietOptions: ['Point before writing.', 'Write one label.', 'Pass on sharing.', 'Use a quiet table.', 'Save the page offline.'],
      noDataUse: ['Use color folders.', 'Use symbols for sorting.', 'Keep pages offline.', 'Share invented choices only.'],
    },
    circleFormats: Array.from({ length: 6 }, (_, index) => ({
      name: `Circle Format ${index + 1}`,
      bestFor: 'Short camp table writing block.',
      steps: ['Pick one page.', 'Name one goal.', 'Write one line.', 'Choose one next step.'],
    })),
    takeHomeTrailCards: Array.from({ length: 10 }, (_, index) => ({
      title: `Trail Card ${index + 1}`,
      time: '6 minutes',
      skill: 'small detail',
      direction: 'Add one invented detail to the story line: ____________________________',
      familyLine: 'A grown-up can ask about this invented place: ____________________________',
    })),
    optionalSharePrompts: [
      'Point to one invented place.',
      'Read one kept line.',
      'Name one detail.',
      'Share one revised word.',
      'Pass and listen.',
      'Choose one page to save.',
      'Show one circle choice.',
      'Ask the counselor to read one line.',
    ],
    activities: worldSlugs.map((worldSlug, index) => activity(index + 1, worldSlug, campWorldAges[worldSlug])),
    ...overrides,
  }
}

const product = {
  slug: 'summer-camp-story-circle-kit',
  title: 'Summer Camp Story Circle Kit',
  pricePoint: '$59',
  status: 'checkout_pending',
  worldSlugs: campWorldSlugs,
}

const worldAges = new Map(campWorldSlugs.map((worldSlug) => [worldSlug, { ageBand: campWorldAges[worldSlug] }]))

const worlds = new Map(
  campWorldSlugs.map((worldSlug) => [
    worldSlug,
    {
      title: worldSlug
        .split('-')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' '),
      ageBand: campWorldAges[worldSlug],
      premise: 'A friendly invented world for a printable summer camp story circle.',
    },
  ]),
)

describe('Summer Camp Story Circle Kit policy', () => {
  it('accepts a valid summer camp source with sixteen printable activity pages', () => {
    expect(validateSummerCampStoryCircleKitSource(validSummerCampSource(), product, worldAges)).toEqual([])
  })

  it('rejects a camp activity line without a writable blank', () => {
    const source = validSummerCampSource()
    source.activities[0].pageSections[0].lines[0] = 'The camp table detail is ready.'

    expect(validateSummerCampStoryCircleKitSource(source, product, worldAges)).toContain(
      'activities[0].pageSections[0].lines[0] must include a writable blank.',
    )
  })

  it('rejects activity worlds that are not listed in the source worldSlugs', () => {
    const source = validSummerCampSource({ worldSlugs: ['teacup-town-weather-window'] })

    expect(validateSummerCampStoryCircleKitSource(source, product, worldAges)).toContain(
      'activities[1].worldSlug must be listed in worldSlugs.',
    )
  })

  it('rejects camp data, medical, assessment, outcome, and unsafe fire language', () => {
    const source = validSummerCampSource()
    source.counselorGuide.setup[0] = 'Check the roster, record attendance, and write camper names before the campfire assessment.'
    source.activities[0].counselorPrompt = 'Guaranteed therapy progress happens after the campfire diagnosis.'

    expect(validateSummerCampStoryCircleKitSource(source, product, worldAges)).toEqual(
      expect.arrayContaining([
        'Summer Camp Story Circle Kit source includes roster, attendance, sign-in, camper-name, photo, address, behavior, medical, legal, therapy, diagnosis, assessment, or guaranteed-outcome language.',
        'Summer Camp Story Circle Kit source includes unsafe fire, water, or outdoor-risk language.',
      ]),
    )
  })

  it('rejects broader family-safety language in summer camp source text', () => {
    const source = validSummerCampSource()
    source.activities[0].counselorPrompt =
      'Run an election campaign with branded heroes, romance scenes, and violent weapon choices.'

    expect(validateSummerCampStoryCircleKitSource(source, product, worldAges)).toContain(
      'Summer Camp Story Circle Kit source includes political, branded, romance, scary, violent, weapon, gambling, ad-targeting, or pressure language.',
    )
  })
})

describe('Summer Camp Story Circle Kit builder', () => {
  it('loads committed summer camp source, product, worlds, and local image inputs before writing artifacts', () => {
    const { source, product: committedProduct, worlds: committedWorlds, imageMap } = loadSummerCampStoryCircleBuildInputs()

    expect(source.productSlug).toBe('summer-camp-story-circle-kit')
    expect(source.activities).toHaveLength(16)
    expect(committedProduct.status).toBe('checkout_pending')
    expect(imageMap.size).toBe(source.worldSlugs.length)
    for (const slug of source.worldSlugs) {
      expect(committedWorlds.has(slug)).toBe(true)
      expect(imageMap.has(slug)).toBe(true)
    }
  })

  it('exercises the actual build entry point against a temporary artifact directory', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'plot-sprout-summer-camp-build-'))
    const buildDir = join(tempDir, 'summer-camp-story-circle-kit')
    try {
      const { manifest } = await buildSummerCampStoryCircleKit({
        buildDir,
        recordRoot: tempDir,
        writePdf: async ({ pdfPath }) => {
          writeFileSync(pdfPath, fakePdf(20))
        },
      })

      expect(manifest.productSlug).toBe('summer-camp-story-circle-kit')
      expect(manifest.sourcePageCount).toBe(16)
      expect(manifest.files.assets.length).toBe(16)
      expect(existsSync(join(buildDir, 'source', 'summer-camp-story-circle-kit.html'))).toBe(true)
      expect(existsSync(join(buildDir, 'README.txt'))).toBe(true)
      expect(existsSync(join(buildDir, 'manifest.json'))).toBe(true)
      expect(readFileSync(join(buildDir, 'summer-camp-story-circle-kit.zip')).subarray(0, 2).toString('ascii')).toBe('PK')
      expect(readFileSync(join(buildDir, 'source', 'summer-camp-story-circle-kit.html'), 'utf8').match(/class="[^"]*camp-activity-page/g)).toHaveLength(16)
    } finally {
      rmSync(tempDir, { recursive: true, force: true })
    }
  }, 15000)

  it('renders printable summer camp source HTML with counselor tools, activity pages, local images, and no checkout copy', () => {
    const html = renderSummerCampStoryCircleKitHtml(
      validSummerCampSource(),
      worlds,
      new Map(campWorldSlugs.map((worldSlug) => [worldSlug, `assets/${worldSlug}.jpg`])),
    )

    expect(html).toContain('<!doctype html>')
    expect(html).toContain('@page')
    expect(html).toContain('Summer Camp Story Circle Kit')
    expect(html).toContain('Run the story circles')
    expect(html).toContain('Take-home trail cards')
    expect(html.match(/class="[^"]*camp-activity-page/g)).toHaveLength(16)
    expect(html).toContain('assets/teacup-town-weather-window.jpg')
    expect(html).not.toMatch(/checkout|payment link|buy now|stripe|gumroad|upload|public publishing/i)
  })

  it('builds a reusable product artifact manifest for the summer camp pack', () => {
    const manifest = buildProductArtifactManifest(validSummerCampSource(), {
      pdf: {
        path: 'product-build/summer-camp-story-circle-kit/Summer-Camp-Story-Circle-Kit.pdf',
        sha256: 'a'.repeat(64),
        size: 1200,
      },
      zip: {
        path: 'product-build/summer-camp-story-circle-kit/summer-camp-story-circle-kit.zip',
        sha256: 'b'.repeat(64),
        size: 2400,
      },
      sourceHtml: {
        path: 'product-build/summer-camp-story-circle-kit/source/summer-camp-story-circle-kit.html',
        sha256: 'c'.repeat(64),
        size: 3600,
      },
    })

    expect(manifest.productSlug).toBe('summer-camp-story-circle-kit')
    expect(manifest.generatedAt).toBe('2026-06-02')
    expect(manifest.sourcePageCount).toBe(16)
    expect(manifest.files.pdf.sha256).toMatch(/^[a-f0-9]{64}$/)
  })

  it('keeps every committed summer camp activity printable page within one sheet', async () => {
    const root = resolve(import.meta.dirname, '..')
    const sourcePath = resolve(root, 'content', 'product-artifacts', 'summer-camp-story-circle-kit.json')
    expect(existsSync(sourcePath)).toBe(true)
    const summerCampSource = JSON.parse(readFileSync(sourcePath, 'utf8'))
    const allWorlds = new Map()
    for (const world of starterWorlds) allWorlds.set(world.slug, world)
    for (const file of readdirSync(resolve(root, 'content', 'worlds')).filter((item) => /^batch1-.+\.json$/.test(item))) {
      const data = JSON.parse(readFileSync(resolve(root, 'content', 'worlds', file), 'utf8'))
      for (const world of data.worlds) allWorlds.set(world.slug, world)
    }

    const imageMap = new Map(summerCampSource.worldSlugs.map((slug) => [slug, `assets/${slug}.jpg`]))
    const html = renderSummerCampStoryCircleKitHtml(summerCampSource, allWorlds, imageMap)
    const browser = await chromium.launch({ headless: true })
    try {
      const page = await browser.newPage()
      await page.setContent(html, { waitUntil: 'load' })
      const overflows = await page.$$eval('.camp-activity-page', (pages) =>
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
