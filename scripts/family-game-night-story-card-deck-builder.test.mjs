import { describe, expect, it } from 'vitest'
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { chromium } from 'playwright'

import { buildProductArtifactManifest } from './rainy-day-pack-builder.mjs'
import { starterWorlds } from './starter-worlds.mjs'
import { validateFamilyGameNightStoryCardDeckSource } from './product-artifact-policy.mjs'
import {
  buildFamilyGameNightStoryCardDeck,
  loadFamilyGameNightStoryCardDeckBuildInputs,
  renderFamilyGameNightStoryCardDeckHtml,
} from './family-game-night-story-card-deck-builder.mjs'

const safety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles.'

function fakePdf(pageCount) {
  return Buffer.from(
    `%PDF-1.7\n${Array.from({ length: pageCount }, (_, index) => `${index + 1} 0 obj << /Type /Page >> endobj`).join('\n')}\n%%EOF\n`,
  )
}

function card(index, worldSlug, ageBand) {
  return {
    id: `family-game-night-card-${String(index).padStart(2, '0')}`,
    title: `Family Story Card ${index}`,
    worldSlug,
    ageBand,
    cardSkill: 'setting detail',
    tableFit: '10-minute cooperative family game night card for a screen-free table.',
    adultSetup: 'Place one card in the middle of the table and keep every choice invented.',
    kidDirection: 'Choose one setting clue, one helper, and one tiny mix-up for the shared story.',
    hostPrompt: 'Ask the table for one quiet detail before anyone writes a sentence.',
    pageSections: ['Choose', 'Build', 'Write'].map((heading) => ({
      heading,
      lines: [
        `${heading} one invented detail: ____________________________`,
        `${heading} one table choice: ____________________________`,
        `${heading} one short sentence: ____________________________`,
      ],
    })),
    tableTalkLine: 'One table idea we can use is ____________________________',
    tinyDraftLine: 'My tiny draft line is ____________________________',
    roundWrapLine: 'The round ends with this kind choice: ____________________________',
    quietOptionLine: 'A quiet sketch or pointed choice is ____________________________',
    takeHomeStoryLine: 'Take-home story starter: Add one new helper clue: ____________________________',
  }
}

const deckWorldAges = {
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

const deckWorldSlugs = Object.keys(deckWorldAges)

function validFamilyGameNightSource(overrides = {}) {
  return {
    batchId: '2026-06-02-batch20',
    generatedAt: '2026-06-02',
    productSlug: 'family-game-night-story-card-deck',
    title: 'Family Game Night Story Card Deck',
    pricePoint: '$27',
    audience:
      'Families, homeschool co-ops, library family nights, and classroom celebration tables for ages 7-11.',
    sessionLength: '15 printable cooperative story cards plus host guide tools',
    safetyNote: safety,
    artifact: {
      pdfPath: 'product-build/family-game-night-story-card-deck/Family-Game-Night-Story-Card-Deck.pdf',
      zipPath: 'product-build/family-game-night-story-card-deck/family-game-night-story-card-deck.zip',
      sourceHtmlPath: 'product-build/family-game-night-story-card-deck/source/family-game-night-story-card-deck.html',
      manifestPath: 'product-build/family-game-night-story-card-deck/manifest.json',
    },
    worldSlugs: deckWorldSlugs,
    cover: {
      kicker: 'Printable family game night story cards',
      headline: 'Family Game Night Story Card Deck',
      subhead: 'Fifteen cooperative table cards for screen-free story rounds.',
      included: [
        '15 cooperative story card pages',
        'Host setup guide',
        'Round hosting notes',
        'Quiet participation notes',
        'No-data use notes',
        'Family handoff notes',
        'Pack reset notes',
        'Six cooperative round formats',
        'Ten take-home story starters',
        'Eight optional family-share prompts',
        'Provider-ready PDF and ZIP artifact',
      ],
    },
    hostGuide: {
      tableSetup: ['Print cards.', 'Choose one card.', 'Set pencils.', 'Keep choices invented.', 'Use one table stack.'],
      roundHosting: ['Read one card.', 'Invite one detail.', 'Write one line.', 'Share only if wanted.', 'Reset the table.'],
      quietParticipation: ['Point to a choice.', 'Sketch one idea.', 'Pass during sharing.', 'Write privately.', 'Save the card.'],
      noDataUse: ['Use invented roles.', 'Keep pages offline.', 'Skip names.', 'Sort with blank folders.'],
      familyHandoff: ['Send one starter.', 'Mark one next step.', 'Keep sharing optional.', 'Use invented details.'],
      packReset: ['Collect pencils.', 'Stack used cards.', 'File blank extras.', 'Pick one next card.'],
    },
    roundFormats: Array.from({ length: 6 }, (_, index) => ({
      name: `Cooperative Round ${index + 1}`,
      bestFor: 'A short screen-free family table story round.',
      steps: ['Place one card.', 'Choose one detail.', 'Write one line.', 'End with one kind choice.'],
    })),
    takeHomeStoryStarters: Array.from({ length: 10 }, (_, index) => ({
      title: `Take-Home Starter ${index + 1}`,
      time: '6 minutes',
      skill: 'story detail',
      direction: 'Add one invented table detail to a story line: ____________________________',
      familyLine: 'A grown-up can ask about this invented choice: ____________________________',
    })),
    optionalFamilySharePrompts: [
      'Show one invented detail.',
      'Read one tiny draft line.',
      'Point to one card choice.',
      'Name one clear setting word.',
      'Pass and listen.',
      'Choose one card to save.',
      'Ask an adult to read one line.',
      'Share one kind ending choice.',
    ],
    cards: deckWorldSlugs.map((worldSlug, index) => card(index + 1, worldSlug, deckWorldAges[worldSlug])),
    ...overrides,
  }
}

const product = {
  slug: 'family-game-night-story-card-deck',
  title: 'Family Game Night Story Card Deck',
  pricePoint: '$27',
  status: 'checkout_pending',
  worldSlugs: deckWorldSlugs,
}

const worldAges = new Map(deckWorldSlugs.map((worldSlug) => [worldSlug, { ageBand: deckWorldAges[worldSlug] }]))

const worlds = new Map(
  deckWorldSlugs.map((worldSlug) => [
    worldSlug,
    {
      title: worldSlug
        .split('-')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' '),
      ageBand: deckWorldAges[worldSlug],
      premise: 'A friendly invented world for a cooperative printable family game night card.',
    },
  ]),
)

describe('Family Game Night Story Card Deck policy', () => {
  it('accepts a valid family game night source with fifteen printable story cards', () => {
    expect(validateFamilyGameNightStoryCardDeckSource(validFamilyGameNightSource(), product, worldAges)).toEqual([])
  })

  it('rejects a card line without a writable blank', () => {
    const source = validFamilyGameNightSource()
    source.cards[0].pageSections[0].lines[0] = 'The table detail is ready.'

    expect(validateFamilyGameNightStoryCardDeckSource(source, product, worldAges)).toContain(
      'cards[0].pageSections[0].lines[0] must include a writable blank.',
    )
  })

  it('requires every card to include a printable take-home story line', () => {
    const source = validFamilyGameNightSource()
    delete source.cards[0].takeHomeStoryLine
    source.cards[1].takeHomeStoryLine = 'Take-home story starter: Add one new helper clue.'

    expect(validateFamilyGameNightStoryCardDeckSource(source, product, worldAges)).toEqual(
      expect.arrayContaining([
        'cards[0].takeHomeStoryLine must be a non-empty string.',
        'cards[1].takeHomeStoryLine must include a writable blank.',
      ]),
    )
  })

  it('rejects card worlds that are not listed in the source worldSlugs', () => {
    const source = validFamilyGameNightSource({ worldSlugs: ['teacup-town-weather-window'] })

    expect(validateFamilyGameNightStoryCardDeckSource(source, product, worldAges)).toContain(
      'cards[1].worldSlug must be listed in worldSlugs.',
    )
  })

  it('rejects scoring, pressure, child-data, and unsafe game-night language', () => {
    const source = validFamilyGameNightSource()
    source.hostGuide.tableSetup[0] =
      'Record the roster, track attendance, collect child names, award prizes, and post the winner.'
    source.cards[0].hostPrompt =
      'Use the timer, score the team, make a dare, and guarantee assessment progress after therapy diagnosis.'

    expect(validateFamilyGameNightStoryCardDeckSource(source, product, worldAges)).toEqual(
      expect.arrayContaining([
        'Family Game Night Story Card Deck source includes scoring, winner, team, gambling, betting, dare, prize, leaderboard, timer-pressure, or competition language.',
        'Family Game Night Story Card Deck source includes roster, attendance, sign-in, child-name, photo, address, behavior, medical, legal, therapy, diagnosis, assessment, grade, score, or guaranteed-outcome language.',
      ]),
    )
  })

  it('rejects broader family-safety language in family game night source text', () => {
    const source = validFamilyGameNightSource()
    source.cards[0].hostPrompt = 'Run an election campaign with branded heroes, romance scenes, and violent weapon choices.'

    expect(validateFamilyGameNightStoryCardDeckSource(source, product, worldAges)).toContain(
      'Family Game Night Story Card Deck source includes political, branded, romance, scary, violent, weapon, gambling, ad-targeting, or pressure language.',
    )
  })
})

describe('Family Game Night Story Card Deck builder', () => {
  it('loads committed family game night source, product, worlds, and local image inputs before writing artifacts', () => {
    const { source, product: committedProduct, worlds: committedWorlds, imageMap } =
      loadFamilyGameNightStoryCardDeckBuildInputs()

    expect(source.productSlug).toBe('family-game-night-story-card-deck')
    expect(source.cards).toHaveLength(15)
    expect(committedProduct.status).toBe('checkout_pending')
    expect(imageMap.size).toBe(source.worldSlugs.length)
    for (const slug of source.worldSlugs) {
      expect(committedWorlds.has(slug)).toBe(true)
      expect(imageMap.has(slug)).toBe(true)
    }
  })

  it('exercises the actual build entry point against a temporary artifact directory', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'plot-sprout-family-game-night-build-'))
    const buildDir = join(tempDir, 'family-game-night-story-card-deck')
    try {
      const { manifest } = await buildFamilyGameNightStoryCardDeck({
        buildDir,
        recordRoot: tempDir,
        writePdf: async ({ pdfPath }) => {
          writeFileSync(pdfPath, fakePdf(20))
        },
      })

      expect(manifest.productSlug).toBe('family-game-night-story-card-deck')
      expect(manifest.sourcePageCount).toBe(15)
      expect(manifest.files.assets.length).toBe(15)
      expect(existsSync(join(buildDir, 'source', 'family-game-night-story-card-deck.html'))).toBe(true)
      expect(existsSync(join(buildDir, 'README.txt'))).toBe(true)
      expect(existsSync(join(buildDir, 'manifest.json'))).toBe(true)
      expect(readFileSync(join(buildDir, 'family-game-night-story-card-deck.zip')).subarray(0, 2).toString('ascii')).toBe('PK')
      expect(readFileSync(join(buildDir, 'source', 'family-game-night-story-card-deck.html'), 'utf8').match(/class="[^"]*game-card-page/g)).toHaveLength(15)
    } finally {
      rmSync(tempDir, { recursive: true, force: true })
    }
  }, 15000)

  it('renders printable family game night source HTML with host guide, story cards, local images, and no checkout copy', () => {
    const html = renderFamilyGameNightStoryCardDeckHtml(
      validFamilyGameNightSource(),
      worlds,
      new Map(deckWorldSlugs.map((worldSlug) => [worldSlug, `assets/${worldSlug}.jpg`])),
    )

    expect(html).toContain('<!doctype html>')
    expect(html).toContain('@page')
    expect(html).toContain('Family Game Night Story Card Deck')
    expect(html).toContain('Start the story round')
    expect(html).toContain('Take-home story starters')
    expect(html).toContain('Take-home story starter: Add one new helper clue')
    expect(html.match(/class="[^"]*game-card-page/g)).toHaveLength(15)
    expect(html).toContain('assets/teacup-town-weather-window.jpg')
    expect(html).not.toMatch(/checkout|payment link|buy now|stripe|gumroad|upload|public publishing|winner|gambling|casino/i)
  })

  it('builds a reusable product artifact manifest for the family game night deck', () => {
    const manifest = buildProductArtifactManifest(validFamilyGameNightSource(), {
      pdf: {
        path: 'product-build/family-game-night-story-card-deck/Family-Game-Night-Story-Card-Deck.pdf',
        sha256: 'a'.repeat(64),
        size: 1200,
      },
      zip: {
        path: 'product-build/family-game-night-story-card-deck/family-game-night-story-card-deck.zip',
        sha256: 'b'.repeat(64),
        size: 2400,
      },
      sourceHtml: {
        path: 'product-build/family-game-night-story-card-deck/source/family-game-night-story-card-deck.html',
        sha256: 'c'.repeat(64),
        size: 3600,
      },
    })

    expect(manifest.productSlug).toBe('family-game-night-story-card-deck')
    expect(manifest.generatedAt).toBe('2026-06-02')
    expect(manifest.sourcePageCount).toBe(15)
    expect(manifest.files.pdf.sha256).toMatch(/^[a-f0-9]{64}$/)
  })

  it('keeps every committed family game night print page within one sheet', async () => {
    const root = resolve(import.meta.dirname, '..')
    const sourcePath = resolve(root, 'content', 'product-artifacts', 'family-game-night-story-card-deck.json')
    expect(existsSync(sourcePath)).toBe(true)
    const gameNightSource = JSON.parse(readFileSync(sourcePath, 'utf8'))
    const allWorlds = new Map()
    for (const world of starterWorlds) allWorlds.set(world.slug, world)
    for (const file of readdirSync(resolve(root, 'content', 'worlds')).filter((item) => /^batch1-.+\.json$/.test(item))) {
      const data = JSON.parse(readFileSync(resolve(root, 'content', 'worlds', file), 'utf8'))
      for (const world of data.worlds) allWorlds.set(world.slug, world)
    }

    const imageMap = new Map(gameNightSource.worldSlugs.map((slug) => [slug, `assets/${slug}.jpg`]))
    const html = renderFamilyGameNightStoryCardDeckHtml(gameNightSource, allWorlds, imageMap)
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
