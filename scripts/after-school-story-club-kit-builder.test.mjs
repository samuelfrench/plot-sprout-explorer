import { describe, expect, it } from 'vitest'
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { chromium } from 'playwright'

import { buildProductArtifactManifest } from './rainy-day-pack-builder.mjs'
import { starterWorlds } from './starter-worlds.mjs'
import { validateAfterSchoolStoryClubKitSource } from './product-artifact-policy.mjs'
import {
  buildAfterSchoolStoryClubKit,
  loadAfterSchoolStoryClubBuildInputs,
  renderAfterSchoolStoryClubKitHtml,
} from './after-school-story-club-starter-kit-builder.mjs'

const safety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles.'

function fakePdf(pageCount) {
  return Buffer.from(
    `%PDF-1.7\n${Array.from({ length: pageCount }, (_, index) => `${index + 1} 0 obj << /Type /Page >> endobj`).join('\n')}\n%%EOF\n`,
  )
}

function session(index, worldSlug, ageBand) {
  return {
    id: `after-school-session-${index}`,
    title: `After-School Club Session ${index}`,
    worldSlug,
    ageBand,
    clubSkill: 'setting detail',
    sessionFit: '25-minute adult-led after-school story club for a table group.',
    directorSetup: 'Print one session page, set out pencils, and choose one invented world card.',
    kidDirection: 'Pick one club table detail, write one short line, and mark one keeper word.',
    facilitatorPrompt: 'Ask for one invented place detail before asking for a sentence.',
    pageSections: ['Warm Up', 'Build', 'Finish'].map((heading) => ({
      heading,
      lines: [
        `${heading} detail: ____________________________`,
        `${heading} choice: ____________________________`,
        `${heading} sentence: ____________________________`,
      ],
    })),
    clubShareLine: 'One club share choice is ____________________________',
    wrapUpLine: 'One line I can keep is ____________________________',
    quietOptionLine: 'A quiet version of this idea is ____________________________',
    takeHomePromptLine: 'Take-home prompt: Add one invented detail from this club page: ____________________________',
  }
}

const clubWorldAges = {
  'teacup-town-weather-window': '7-8',
  'spoon-ferry-lunchbox-harbor': '7-9',
  'pocket-park-notice-board': '7-9',
  'acorn-avenue-errand-office': '7-9',
  'button-bakery-map-mixup': '7-9',
  'penny-path-compass-shop': '7-9',
  'tidepool-timekeepers-lab': '8-10',
  'greenhouse-gear-garden': '8-10',
  'pantry-measurement-mystery': '8-10',
  'rain-gauge-railway': '8-10',
  'seed-library-map-room': '8-10',
  'moss-message-observatory': '8-10',
  'revision-river-ferry': '10-11',
  'clue-label-tower-museum': '10-11',
  'compass-craft-academy': '10-11',
  'almost-invention-workshop': '10-11',
  'margin-note-market': '10-11',
  'index-card-theater-club': '10-11',
}

const clubWorldSlugs = Object.keys(clubWorldAges)

function validAfterSchoolSource(overrides = {}) {
  const worldSlugs = clubWorldSlugs
  return {
    batchId: '2026-06-02-batch18',
    generatedAt: '2026-06-02',
    productSlug: 'after-school-story-club-starter-kit',
    title: 'After-School Story Club Starter Kit',
    pricePoint: '$69',
    audience: 'After-school programs, enrichment coordinators, community centers, childcare site leads, and homeschool co-ops for ages 7-11.',
    sessionLength: '18 printable adult-led story club sessions plus director setup tools',
    safetyNote: safety,
    artifact: {
      pdfPath: 'product-build/after-school-story-club-starter-kit/After-School-Story-Club-Starter-Kit.pdf',
      zipPath: 'product-build/after-school-story-club-starter-kit/after-school-story-club-starter-kit.zip',
      sourceHtmlPath: 'product-build/after-school-story-club-starter-kit/source/after-school-story-club-starter-kit.html',
      manifestPath: 'product-build/after-school-story-club-starter-kit/manifest.json',
    },
    worldSlugs,
    cover: {
      kicker: 'Printable after-school writing club kit',
      headline: 'After-School Story Club Starter Kit',
      subhead: 'Eighteen adult-led story club sessions for enrichment tables, community centers, and co-ops.',
      included: [
        '18 story club session pages',
        'Before-club planning guide',
        'Director setup checklist',
        'Running-club coaching notes',
        'Quiet participation notes',
        'No-data use notes',
        'Family handoff notes',
        'Six club formats',
        'Twelve take-home prompt cards',
        'Eight optional family-share prompts',
        'Provider-ready PDF and ZIP artifact',
      ],
    },
    directorGuide: {
      beforeClub: ['Choose pages.', 'Print packets.', 'Clip pencils.', 'Pick one club format.', 'Prepare a quiet backup.'],
      roomSetup: ['Place one page.', 'Set pencil tray.', 'Choose a world.', 'Read the goal.', 'Keep extras in a folder.'],
      runningClub: ['Ask for detail.', 'Offer two choices.', 'Read one line back.', 'Mark one word.', 'Stop while it feels light.'],
      quietParticipation: ['Point before writing.', 'Write one label.', 'Pass on sharing.', 'Use a quiet table.', 'Save the page offline.'],
      noDataUse: ['Use color folders.', 'Use symbols for sorting.', 'Keep pages offline.', 'Share invented choices only.'],
      familyHandoff: ['Send one prompt card.', 'Invite one home detail.', 'Keep names off pages.', 'Use invented details only.'],
    },
    clubFormats: Array.from({ length: 6 }, (_, index) => ({
      name: `Club Format ${index + 1}`,
      bestFor: 'Short club table writing block.',
      steps: ['Pick one page.', 'Name one goal.', 'Write one line.', 'Choose one next step.'],
    })),
    takeHomePromptCards: Array.from({ length: 12 }, (_, index) => ({
      title: `Prompt Card ${index + 1}`,
      time: '6 minutes',
      skill: 'small detail',
      direction: 'Add one invented detail to the story line: ____________________________',
      familyLine: 'A grown-up can ask about this invented place: ____________________________',
    })),
    optionalFamilySharePrompts: [
      'Point to one invented place.',
      'Read one kept line.',
      'Name one detail.',
      'Share one revised word.',
      'Pass and listen.',
      'Choose one page to save.',
      'Show one club choice.',
      'Ask the director to read one line.',
    ],
    sessions: worldSlugs.map((worldSlug, index) => session(index + 1, worldSlug, clubWorldAges[worldSlug])),
    ...overrides,
  }
}

const product = {
  slug: 'after-school-story-club-starter-kit',
  title: 'After-School Story Club Starter Kit',
  pricePoint: '$69',
  status: 'checkout_pending',
  worldSlugs: clubWorldSlugs,
}

const worldAges = new Map(clubWorldSlugs.map((worldSlug) => [worldSlug, { ageBand: clubWorldAges[worldSlug] }]))

const worlds = new Map(
  clubWorldSlugs.map((worldSlug) => [
    worldSlug,
    {
      title: worldSlug
        .split('-')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' '),
      ageBand: clubWorldAges[worldSlug],
      premise: 'A friendly invented world for a printable after-school story club.',
    },
  ]),
)

describe('After-School Story Club Starter Kit policy', () => {
  it('accepts a valid after-school source with eighteen printable session pages', () => {
    expect(validateAfterSchoolStoryClubKitSource(validAfterSchoolSource(), product, worldAges)).toEqual([])
  })

  it('rejects a club session line without a writable blank', () => {
    const source = validAfterSchoolSource()
    source.sessions[0].pageSections[0].lines[0] = 'The club table detail is ready.'

    expect(validateAfterSchoolStoryClubKitSource(source, product, worldAges)).toContain(
      'sessions[0].pageSections[0].lines[0] must include a writable blank.',
    )
  })

  it('requires every after-school club session to include a printable take-home prompt line', () => {
    const source = validAfterSchoolSource()
    delete source.sessions[0].takeHomePromptLine
    source.sessions[1].takeHomePromptLine = 'Take-home prompt: Add one invented detail from the club page.'

    expect(validateAfterSchoolStoryClubKitSource(source, product, worldAges)).toEqual(
      expect.arrayContaining([
        'sessions[0].takeHomePromptLine must be a non-empty string.',
        'sessions[1].takeHomePromptLine must include a writable blank.',
      ]),
    )
  })

  it('rejects session worlds that are not listed in the source worldSlugs', () => {
    const source = validAfterSchoolSource({ worldSlugs: ['teacup-town-weather-window'] })

    expect(validateAfterSchoolStoryClubKitSource(source, product, worldAges)).toContain(
      'sessions[1].worldSlug must be listed in worldSlugs.',
    )
  })

  it('rejects club data, medical, assessment, outcome, and unsafe fire language', () => {
    const source = validAfterSchoolSource()
    source.directorGuide.roomSetup[0] = 'Check the roster, record attendance, and write child names before the fire pit assessment.'
    source.sessions[0].facilitatorPrompt = 'Guaranteed therapy progress happens after the fire pit diagnosis.'

    expect(validateAfterSchoolStoryClubKitSource(source, product, worldAges)).toEqual(
      expect.arrayContaining([
        'After-School Story Club Starter Kit source includes roster, attendance, sign-in, child-name, photo, address, behavior, medical, legal, therapy, diagnosis, assessment, grade, score, or guaranteed-outcome language.',
        'After-School Story Club Starter Kit source includes unsafe fire, water, or outdoor-risk language.',
      ]),
    )
  })

  it('rejects broader family-safety language in after-school source text', () => {
    const source = validAfterSchoolSource()
    source.sessions[0].facilitatorPrompt =
      'Run an election campaign with branded heroes, romance scenes, and violent weapon choices.'

    expect(validateAfterSchoolStoryClubKitSource(source, product, worldAges)).toContain(
      'After-School Story Club Starter Kit source includes political, branded, romance, scary, violent, weapon, gambling, ad-targeting, or pressure language.',
    )
  })

  it('allows ordinary matching language that is not a fire-starting instruction', () => {
    const source = validAfterSchoolSource()
    source.clubFormats[0].steps[0] = 'Adult leader offers one take-home card that matches the marked next step.'

    expect(validateAfterSchoolStoryClubKitSource(source, product, worldAges)).toEqual([])
  })
})

describe('After-School Story Club Starter Kit builder', () => {
  it('loads committed after-school source, product, worlds, and local image inputs before writing artifacts', () => {
    const { source, product: committedProduct, worlds: committedWorlds, imageMap } = loadAfterSchoolStoryClubBuildInputs()

    expect(source.productSlug).toBe('after-school-story-club-starter-kit')
    expect(source.sessions).toHaveLength(18)
    expect(committedProduct.status).toBe('checkout_pending')
    expect(imageMap.size).toBe(source.worldSlugs.length)
    for (const slug of source.worldSlugs) {
      expect(committedWorlds.has(slug)).toBe(true)
      expect(imageMap.has(slug)).toBe(true)
    }
  })

  it('exercises the actual build entry point against a temporary artifact directory', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'plot-sprout-after-school-club-build-'))
    const buildDir = join(tempDir, 'after-school-story-club-starter-kit')
    try {
      const { manifest } = await buildAfterSchoolStoryClubKit({
        buildDir,
        recordRoot: tempDir,
        writePdf: async ({ pdfPath }) => {
          writeFileSync(pdfPath, fakePdf(22))
        },
      })

      expect(manifest.productSlug).toBe('after-school-story-club-starter-kit')
      expect(manifest.sourcePageCount).toBe(18)
      expect(manifest.files.assets.length).toBe(18)
      expect(existsSync(join(buildDir, 'source', 'after-school-story-club-starter-kit.html'))).toBe(true)
      expect(existsSync(join(buildDir, 'README.txt'))).toBe(true)
      expect(existsSync(join(buildDir, 'manifest.json'))).toBe(true)
      expect(readFileSync(join(buildDir, 'after-school-story-club-starter-kit.zip')).subarray(0, 2).toString('ascii')).toBe('PK')
      expect(readFileSync(join(buildDir, 'source', 'after-school-story-club-starter-kit.html'), 'utf8').match(/class="[^"]*club-session-page/g)).toHaveLength(18)
    } finally {
      rmSync(tempDir, { recursive: true, force: true })
    }
  }, 15000)

  it('renders printable after-school source HTML with director tools, session pages, local images, and no checkout copy', () => {
    const html = renderAfterSchoolStoryClubKitHtml(
      validAfterSchoolSource(),
      worlds,
      new Map(clubWorldSlugs.map((worldSlug) => [worldSlug, `assets/${worldSlug}.jpg`])),
    )

    expect(html).toContain('<!doctype html>')
    expect(html).toContain('@page')
    expect(html).toContain('After-School Story Club Starter Kit')
    expect(html).toContain('Run the story club')
    expect(html).toContain('Take-home prompt cards')
    expect(html).toContain('Take-home prompt: Add one invented detail from this club page')
    expect(html.match(/class="[^"]*club-session-page/g)).toHaveLength(18)
    expect(html).toContain('assets/teacup-town-weather-window.jpg')
    expect(html).not.toMatch(/checkout|payment link|buy now|stripe|gumroad|upload|public publishing/i)
  })

  it('builds a reusable product artifact manifest for the after-school pack', () => {
    const manifest = buildProductArtifactManifest(validAfterSchoolSource(), {
      pdf: {
        path: 'product-build/after-school-story-club-starter-kit/After-School-Story-Club-Starter-Kit.pdf',
        sha256: 'a'.repeat(64),
        size: 1200,
      },
      zip: {
        path: 'product-build/after-school-story-club-starter-kit/after-school-story-club-starter-kit.zip',
        sha256: 'b'.repeat(64),
        size: 2400,
      },
      sourceHtml: {
        path: 'product-build/after-school-story-club-starter-kit/source/after-school-story-club-starter-kit.html',
        sha256: 'c'.repeat(64),
        size: 3600,
      },
    })

    expect(manifest.productSlug).toBe('after-school-story-club-starter-kit')
    expect(manifest.generatedAt).toBe('2026-06-02')
    expect(manifest.sourcePageCount).toBe(18)
    expect(manifest.files.pdf.sha256).toMatch(/^[a-f0-9]{64}$/)
  })

  it('keeps every committed after-school session printable page within one sheet', async () => {
    const root = resolve(import.meta.dirname, '..')
    const sourcePath = resolve(root, 'content', 'product-artifacts', 'after-school-story-club-starter-kit.json')
    expect(existsSync(sourcePath)).toBe(true)
    const afterSchoolSource = JSON.parse(readFileSync(sourcePath, 'utf8'))
    const allWorlds = new Map()
    for (const world of starterWorlds) allWorlds.set(world.slug, world)
    for (const file of readdirSync(resolve(root, 'content', 'worlds')).filter((item) => /^batch1-.+\.json$/.test(item))) {
      const data = JSON.parse(readFileSync(resolve(root, 'content', 'worlds', file), 'utf8'))
      for (const world of data.worlds) allWorlds.set(world.slug, world)
    }

    const imageMap = new Map(afterSchoolSource.worldSlugs.map((slug) => [slug, `assets/${slug}.jpg`]))
    const html = renderAfterSchoolStoryClubKitHtml(afterSchoolSource, allWorlds, imageMap)
    const browser = await chromium.launch({ headless: true })
    try {
      const page = await browser.newPage()
      await page.setContent(html, { waitUntil: 'load' })
      const overflows = await page.$$eval('.club-session-page', (pages) =>
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
