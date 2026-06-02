import { describe, expect, it } from 'vitest'
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { chromium } from 'playwright'

import { buildProductArtifactManifest } from './rainy-day-pack-builder.mjs'
import { starterWorlds } from './starter-worlds.mjs'
import { validateMuseumDayStoryNotebookKitSource } from './product-artifact-policy.mjs'
import {
  buildMuseumDayStoryNotebookKit,
  loadMuseumDayStoryNotebookBuildInputs,
  renderMuseumDayStoryNotebookKitHtml,
} from './museum-day-story-notebook-kit-builder.mjs'

const safety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles.'

function fakePdf(pageCount) {
  return Buffer.from(
    `%PDF-1.7\n${Array.from({ length: pageCount }, (_, index) => `${index + 1} 0 obj << /Type /Page >> endobj`).join('\n')}\n%%EOF\n`,
  )
}

function page(index, worldSlug, ageBand) {
  return {
    id: `museum-day-page-${index}`,
    title: `Museum Notebook Page ${index}`,
    worldSlug,
    ageBand,
    notebookSkill: 'observation detail',
    visitFit: '20-minute adult-led museum day notebook page for a family or co-op writing table.',
    adultSetup: 'Choose one quiet display detail, set out pencils, and remind writers to use invented names only.',
    kidDirection: 'Find one shape, one color, and one tiny clue, then turn them into a story note.',
    guidePrompt: 'Ask what the object might do in an invented world before asking for a sentence.',
    pageSections: ['Notice', 'Imagine', 'Draft'].map((heading) => ({
      heading,
      lines: [
        `${heading} object detail: ____________________________`,
        `${heading} story choice: ____________________________`,
        `${heading} sentence: ____________________________`,
      ],
    })),
    shareLine: 'One museum-day detail I can share is ____________________________',
    wrapUpLine: 'One story line I want to keep is ____________________________',
    quietOptionLine: 'A quiet sketch-note version is ____________________________',
    takeHomePromptLine: 'Take-home prompt: Add one invented display clue: ____________________________',
  }
}

const notebookWorldAges = {
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
  'compass-craft-academy': '10-11',
  'almost-invention-workshop': '10-11',
  'index-card-theater-club': '10-11',
}

const notebookWorldSlugs = Object.keys(notebookWorldAges)

function validMuseumDaySource(overrides = {}) {
  return {
    batchId: '2026-06-02-batch19',
    generatedAt: '2026-06-02',
    productSlug: 'museum-day-story-notebook-kit',
    title: 'Museum Day Story Notebook Kit',
    pricePoint: '$37',
    audience:
      'Homeschool co-ops, family learning days, museum educators, field-trip organizers, and library or gallery writing tables for ages 7-11.',
    sessionLength: '15 printable observation-to-fiction notebook pages plus adult visit tools',
    safetyNote: safety,
    artifact: {
      pdfPath: 'product-build/museum-day-story-notebook-kit/Museum-Day-Story-Notebook-Kit.pdf',
      zipPath: 'product-build/museum-day-story-notebook-kit/museum-day-story-notebook-kit.zip',
      sourceHtmlPath: 'product-build/museum-day-story-notebook-kit/source/museum-day-story-notebook-kit.html',
      manifestPath: 'product-build/museum-day-story-notebook-kit/manifest.json',
    },
    worldSlugs: notebookWorldSlugs,
    cover: {
      kicker: 'Printable museum day writing notebook',
      headline: 'Museum Day Story Notebook Kit',
      subhead: 'Fifteen observation-to-fiction notebook pages for field trips, co-ops, and family learning days.',
      included: [
        '15 story notebook pages',
        'Before-visit planning guide',
        'Table setup checklist',
        'Observation-to-story prompts',
        'Quiet participation notes',
        'No-data use notes',
        'Family handoff notes',
        'Six museum-day visit formats',
        'Ten take-home observation cards',
        'Eight optional family-share prompts',
        'Provider-ready PDF and ZIP artifact',
      ],
    },
    adultGuide: {
      beforeVisit: ['Choose pages.', 'Print packets.', 'Clip pencils.', 'Pick one visit format.', 'Pack a quiet backup.'],
      tableSetup: ['Place one page.', 'Set pencil tray.', 'Choose a world.', 'Read the goal.', 'Keep extras in a folder.'],
      observationToStory: ['Ask for shape.', 'Ask for color.', 'Ask for pattern.', 'Offer two story uses.', 'Write one line.'],
      quietParticipation: ['Point before writing.', 'Sketch one object.', 'Pass on sharing.', 'Use a quiet table.', 'Save the page offline.'],
      noDataUse: ['Use color folders.', 'Use symbols for sorting.', 'Keep pages offline.', 'Share invented choices only.'],
      familyHandoff: ['Send one card.', 'Invite one home detail.', 'Keep names off pages.', 'Use invented details only.'],
    },
    visitFormats: Array.from({ length: 6 }, (_, index) => ({
      name: `Visit Format ${index + 1}`,
      bestFor: 'Short museum-day writing block.',
      steps: ['Pick one room detail.', 'Name one story use.', 'Write one line.', 'Choose one next step.'],
    })),
    takeHomeObservationCards: Array.from({ length: 10 }, (_, index) => ({
      title: `Observation Card ${index + 1}`,
      time: '6 minutes',
      skill: 'small detail',
      direction: 'Add one invented display detail to a story line: ____________________________',
      familyLine: 'A grown-up can ask about this invented clue: ____________________________',
    })),
    optionalFamilySharePrompts: [
      'Point to one invented display.',
      'Read one kept line.',
      'Name one color clue.',
      'Share one revised word.',
      'Pass and listen.',
      'Choose one page to save.',
      'Show one notebook choice.',
      'Ask an adult to read one line.',
    ],
    pages: notebookWorldSlugs.map((worldSlug, index) => page(index + 1, worldSlug, notebookWorldAges[worldSlug])),
    ...overrides,
  }
}

const product = {
  slug: 'museum-day-story-notebook-kit',
  title: 'Museum Day Story Notebook Kit',
  pricePoint: '$37',
  status: 'checkout_pending',
  worldSlugs: notebookWorldSlugs,
}

const worldAges = new Map(notebookWorldSlugs.map((worldSlug) => [worldSlug, { ageBand: notebookWorldAges[worldSlug] }]))

const worlds = new Map(
  notebookWorldSlugs.map((worldSlug) => [
    worldSlug,
    {
      title: worldSlug
        .split('-')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' '),
      ageBand: notebookWorldAges[worldSlug],
      premise: 'A friendly invented world for a printable museum day notebook.',
    },
  ]),
)

describe('Museum Day Story Notebook Kit policy', () => {
  it('accepts a valid museum day source with fifteen printable notebook pages', () => {
    expect(validateMuseumDayStoryNotebookKitSource(validMuseumDaySource(), product, worldAges)).toEqual([])
  })

  it('rejects a notebook line without a writable blank', () => {
    const source = validMuseumDaySource()
    source.pages[0].pageSections[0].lines[0] = 'The museum detail is ready.'

    expect(validateMuseumDayStoryNotebookKitSource(source, product, worldAges)).toContain(
      'pages[0].pageSections[0].lines[0] must include a writable blank.',
    )
  })

  it('requires every notebook page to include a printable take-home prompt line', () => {
    const source = validMuseumDaySource()
    delete source.pages[0].takeHomePromptLine
    source.pages[1].takeHomePromptLine = 'Take-home prompt: Add one invented display detail.'

    expect(validateMuseumDayStoryNotebookKitSource(source, product, worldAges)).toEqual(
      expect.arrayContaining([
        'pages[0].takeHomePromptLine must be a non-empty string.',
        'pages[1].takeHomePromptLine must include a writable blank.',
      ]),
    )
  })

  it('rejects page worlds that are not listed in the source worldSlugs', () => {
    const source = validMuseumDaySource({ worldSlugs: ['teacup-town-weather-window'] })

    expect(validateMuseumDayStoryNotebookKitSource(source, product, worldAges)).toContain(
      'pages[1].worldSlug must be listed in worldSlugs.',
    )
  })

  it('rejects data, assessment, medical, outcome, and unsafe visit language', () => {
    const source = validMuseumDaySource()
    source.adultGuide.tableSetup[0] = 'Check the roster, record attendance, collect child names, and grade the assessment.'
    source.pages[0].guidePrompt = 'Guaranteed therapy progress happens after the emergency travel diagnosis.'

    expect(validateMuseumDayStoryNotebookKitSource(source, product, worldAges)).toEqual(
      expect.arrayContaining([
        'Museum Day Story Notebook Kit source includes roster, attendance, sign-in, child-name, photo, address, behavior, medical, legal, therapy, diagnosis, assessment, grade, score, or guaranteed-outcome language.',
        'Museum Day Story Notebook Kit source includes unsafe travel, outdoor-risk, or emergency instruction language.',
      ]),
    )
  })

  it('rejects broader family-safety language in museum day source text', () => {
    const source = validMuseumDaySource()
    source.pages[0].guidePrompt = 'Run an election campaign with branded heroes, romance scenes, and violent weapon choices.'

    expect(validateMuseumDayStoryNotebookKitSource(source, product, worldAges)).toContain(
      'Museum Day Story Notebook Kit source includes political, branded, romance, scary, violent, weapon, gambling, ad-targeting, or pressure language.',
    )
  })
})

describe('Museum Day Story Notebook Kit builder', () => {
  it('loads committed museum day source, product, worlds, and local image inputs before writing artifacts', () => {
    const { source, product: committedProduct, worlds: committedWorlds, imageMap } = loadMuseumDayStoryNotebookBuildInputs()

    expect(source.productSlug).toBe('museum-day-story-notebook-kit')
    expect(source.pages).toHaveLength(15)
    expect(committedProduct.status).toBe('checkout_pending')
    expect(imageMap.size).toBe(source.worldSlugs.length)
    for (const slug of source.worldSlugs) {
      expect(committedWorlds.has(slug)).toBe(true)
      expect(imageMap.has(slug)).toBe(true)
    }
  })

  it('exercises the actual build entry point against a temporary artifact directory', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'plot-sprout-museum-day-build-'))
    const buildDir = join(tempDir, 'museum-day-story-notebook-kit')
    try {
      const { manifest } = await buildMuseumDayStoryNotebookKit({
        buildDir,
        recordRoot: tempDir,
        writePdf: async ({ pdfPath }) => {
          writeFileSync(pdfPath, fakePdf(20))
        },
      })

      expect(manifest.productSlug).toBe('museum-day-story-notebook-kit')
      expect(manifest.sourcePageCount).toBe(15)
      expect(manifest.files.assets.length).toBe(15)
      expect(existsSync(join(buildDir, 'source', 'museum-day-story-notebook-kit.html'))).toBe(true)
      expect(existsSync(join(buildDir, 'README.txt'))).toBe(true)
      expect(existsSync(join(buildDir, 'manifest.json'))).toBe(true)
      expect(readFileSync(join(buildDir, 'museum-day-story-notebook-kit.zip')).subarray(0, 2).toString('ascii')).toBe('PK')
      expect(readFileSync(join(buildDir, 'source', 'museum-day-story-notebook-kit.html'), 'utf8').match(/class="[^"]*notebook-page/g)).toHaveLength(15)
    } finally {
      rmSync(tempDir, { recursive: true, force: true })
    }
  }, 15000)

  it('renders printable museum day source HTML with adult guide, notebook pages, local images, and no checkout copy', () => {
    const html = renderMuseumDayStoryNotebookKitHtml(
      validMuseumDaySource(),
      worlds,
      new Map(notebookWorldSlugs.map((worldSlug) => [worldSlug, `assets/${worldSlug}.jpg`])),
    )

    expect(html).toContain('<!doctype html>')
    expect(html).toContain('@page')
    expect(html).toContain('Museum Day Story Notebook Kit')
    expect(html).toContain('Use the notebook day')
    expect(html).toContain('Take-home observation cards')
    expect(html).toContain('Take-home prompt: Add one invented display clue')
    expect(html.match(/class="[^"]*notebook-page/g)).toHaveLength(15)
    expect(html).toContain('assets/teacup-town-weather-window.jpg')
    expect(html).not.toMatch(/checkout|payment link|buy now|stripe|gumroad|upload|public publishing/i)
  })

  it('builds a reusable product artifact manifest for the museum day pack', () => {
    const manifest = buildProductArtifactManifest(validMuseumDaySource(), {
      pdf: {
        path: 'product-build/museum-day-story-notebook-kit/Museum-Day-Story-Notebook-Kit.pdf',
        sha256: 'a'.repeat(64),
        size: 1200,
      },
      zip: {
        path: 'product-build/museum-day-story-notebook-kit/museum-day-story-notebook-kit.zip',
        sha256: 'b'.repeat(64),
        size: 2400,
      },
      sourceHtml: {
        path: 'product-build/museum-day-story-notebook-kit/source/museum-day-story-notebook-kit.html',
        sha256: 'c'.repeat(64),
        size: 3600,
      },
    })

    expect(manifest.productSlug).toBe('museum-day-story-notebook-kit')
    expect(manifest.generatedAt).toBe('2026-06-02')
    expect(manifest.sourcePageCount).toBe(15)
    expect(manifest.files.pdf.sha256).toMatch(/^[a-f0-9]{64}$/)
  })

  it('keeps every committed museum day print page within one sheet', async () => {
    const root = resolve(import.meta.dirname, '..')
    const sourcePath = resolve(root, 'content', 'product-artifacts', 'museum-day-story-notebook-kit.json')
    expect(existsSync(sourcePath)).toBe(true)
    const museumDaySource = JSON.parse(readFileSync(sourcePath, 'utf8'))
    const allWorlds = new Map()
    for (const world of starterWorlds) allWorlds.set(world.slug, world)
    for (const file of readdirSync(resolve(root, 'content', 'worlds')).filter((item) => /^batch1-.+\.json$/.test(item))) {
      const data = JSON.parse(readFileSync(resolve(root, 'content', 'worlds', file), 'utf8'))
      for (const world of data.worlds) allWorlds.set(world.slug, world)
    }

    const imageMap = new Map(museumDaySource.worldSlugs.map((slug) => [slug, `assets/${slug}.jpg`]))
    const html = renderMuseumDayStoryNotebookKitHtml(museumDaySource, allWorlds, imageMap)
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
