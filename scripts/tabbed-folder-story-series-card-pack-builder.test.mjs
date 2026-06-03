import { describe, expect, it } from 'vitest'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'

import {
  inspectArtifactFiles,
  validateProductWorldSummaries,
  validateTabbedFolderStorySeriesCardPackSource,
  validateTabbedFolderStorySeriesCardPackSourceFiles,
} from './product-artifact-policy.mjs'
import {
  buildTabbedFolderStorySeriesCardPack,
  renderTabbedFolderStorySeriesCardPackHtml,
} from './tabbed-folder-story-series-card-pack-builder.mjs'

const safety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles.'

const worldAges = {
  'chapter-gate-greenhouse': '10-11',
  'binding-day-boardwalk': '10-11',
  'index-card-theater-club': '10-11',
  'margin-note-market': '10-11',
  'revision-river-ferry': '10-11',
  'blue-pencil-observatory': '10-11',
  'appendix-archive-lab': '10-11',
  'clue-label-tower-museum': '10-11',
  'compass-craft-academy': '10-11',
  'seed-library-map-room': '8-10',
  'tidepool-timekeepers-lab': '8-10',
  'acorn-avenue-errand-office': '7-9',
  'rain-boot-route-rangers': '7-9',
  'buttonwood-library-train': '7-9',
  'cloudberry-clocktower': '8-10',
  'moon-muffin-market': '6-8',
}

const worldSlugs = Object.keys(worldAges)

const batch50WorldSlugs = [
  'penny-path-compass-shop',
  'sticker-station-mail-cart',
  'mitten-market-lost-ticket',
  'paperclip-plaza-parcel-day',
  'greenhouse-gear-garden',
  'pantry-measurement-mystery',
  'solar-oven-picnic-station',
  'compost-clock-workshop',
  'orchard-pulley-post',
  'pond-bridge-blueprint-club',
  'cloudberry-clocktower',
  'tiny-lantern-reef',
  'almost-invention-workshop',
  'margin-note-market',
  'index-card-theater-club',
  'chapter-gate-greenhouse',
]

const batch51WorldSlugs = [
  'buttonwood-library-train',
  'button-bakery-map-mixup',
  'teacup-town-weather-window',
  'spoon-ferry-lunchbox-harbor',
  'pocket-park-notice-board',
  'rain-gauge-railway',
  'greenhouse-gear-garden',
  'cloudberry-clocktower',
  'moss-message-observatory',
  'orchard-pulley-post',
  'pond-bridge-blueprint-club',
  'revision-river-ferry',
  'chapter-gate-greenhouse',
  'index-card-theater-club',
  'binding-day-boardwalk',
  'margin-note-market',
]

const batch52WorldSlugs = [
  'moon-muffin-market',
  'buttonwood-library-train',
  'button-bakery-map-mixup',
  'teacup-town-weather-window',
  'spoon-ferry-lunchbox-harbor',
  'pocket-park-notice-board',
  'moss-message-observatory',
  'revision-river-ferry',
  'tiny-lantern-reef',
  'mitten-market-lost-ticket',
  'paperclip-plaza-parcel-day',
  'penny-path-compass-shop',
  'pantry-measurement-mystery',
  'compost-clock-workshop',
  'almost-invention-workshop',
  'blue-pencil-observatory',
]

const extraWorldAges = {
  'penny-path-compass-shop': '7-9',
  'sticker-station-mail-cart': '7-9',
  'mitten-market-lost-ticket': '7-8',
  'paperclip-plaza-parcel-day': '7-9',
  'greenhouse-gear-garden': '8-10',
  'pantry-measurement-mystery': '8-10',
  'solar-oven-picnic-station': '8-10',
  'compost-clock-workshop': '8-10',
  'orchard-pulley-post': '8-10',
  'pond-bridge-blueprint-club': '8-10',
  'tiny-lantern-reef': '8-10',
  'almost-invention-workshop': '10-11',
  'button-bakery-map-mixup': '7-9',
  'teacup-town-weather-window': '7-8',
  'spoon-ferry-lunchbox-harbor': '7-9',
  'pocket-park-notice-board': '7-9',
  'rain-gauge-railway': '8-10',
  'moss-message-observatory': '8-10',
}

const seriesSkills = [
  'anchor page one before planning the next story page',
  'bring one returning character detail back on the next page',
  'carry the same setting rule into a second page',
  'move one clue label from page to page',
  'turn the page after one clear story beat',
  'write a private series wrap note for the folder',
  'sort a story page into the right tabbed folder pocket',
  'repeat one clue without starting a new story',
  'use a compass note to keep the same pretend goal',
  'plant a seed detail that can return later',
  'keep time order steady across two pages',
  'send the same character on a short follow-up errand',
  'mark one return path without using a real route',
  'bring a library train detail back calmly',
  'use a clocktower note to remember what changed',
  'finish with one quiet next-page idea',
]

const product = {
  slug: 'tabbed-folder-story-series-card-pack',
  title: 'Tabbed Folder Story Series Card Pack',
  pricePoint: '$79',
  status: 'checkout_pending',
  worldSlugs,
  worldSummaries: worldSlugs.map((slug) => ({
    slug,
    summary: `A linked fictional world summary for ${slug}.`,
  })),
}

const knownWorldAges = new Map(
  Object.entries({ ...extraWorldAges, ...worldAges }).map(([slug, ageBand]) => [slug, { ageBand }]),
)

const worlds = new Map(
  Object.entries(worldAges).map(([worldSlug, ageBand]) => [
    worldSlug,
    {
      slug: worldSlug,
      title: titleForSlug(worldSlug),
      ageBand,
      premise: 'A friendly invented world for an adult-led paper story-series card.',
    },
  ]),
)

function titleForSlug(slug) {
  return slug
    .split('-')
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ')
}

function fakePdf(pageCount) {
  return Buffer.from(
    `%PDF-1.7\n${Array.from({ length: pageCount }, (_, index) => `${index + 1} 0 obj << /Type /Page >> endobj`).join('\n')}\n%%EOF\n`,
  )
}

function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex')
}

function expectedZipEntries(source) {
  return [
    'Tabbed-Folder-Story-Series-Card-Pack.pdf',
    'README.txt',
    'source/tabbed-folder-story-series-card-pack.html',
    ...source.worldSlugs.map((slug) => `source/assets/${slug}.jpg`),
  ]
}

function card(index, worldSlug, ageBand) {
  return {
    id: `tabbed-folder-series-card-${String(index).padStart(2, '0')}`,
    title: `Tabbed Folder Story Series Card ${index}`,
    worldSlug,
    ageBand,
    seriesSkill: seriesSkills[index - 1],
    useCase:
      'Adult-led printable tabbed folder story-series card for keeping a private fictional story going on paper: ____________________.',
    adultSetup:
      'Adult: place one tabbed folder, blank paper, pencil, and the story-series card together before the writer starts: ____________________.',
    kidDirection:
      'Writer: choose one made-up page from the folder and write what can return on the next paper page: ____________________.',
    pageOneAnchorPrompt:
      'Page one anchor: copy one pretend page-one fact that should stay true later in the story series: ____________________.',
    characterReturnPrompt:
      'Character return: bring back the same invented character with one small new choice: ____________________.',
    settingReturnPrompt:
      'Setting return: use one familiar place detail from the same pretend world on the next page: ____________________.',
    clueCarryPrompt:
      'Clue carry: move one made-up clue label from this page to the next paper page: ____________________.',
    pageTurnPrompt:
      'Page turn: stop after one clear story beat and write the next paper-page question: ____________________.',
    seriesWrapPrompt:
      'Series wrap: write one private folder note about what can return later: ____________________.',
    quietOptionLine:
      'Quiet option: fill only the page-one anchor, character return, and page-turn blanks: ____________________.',
    takeHomeLine:
      'Take-home line: keep one pretend story series in a folder and add one next-page note on paper: ____________________.',
  }
}

function validSource(overrides = {}) {
  return {
    batchId: '2026-06-03-batch53',
    generatedAt: '2026-06-03',
    productSlug: 'tabbed-folder-story-series-card-pack',
    title: 'Tabbed Folder Story Series Card Pack',
    pricePoint: '$79',
    audience: 'Families, homeschool groups, tutors, and adult-led writing tables for writers ages 6-11.',
    sessionLength:
      '16 printable tabbed folder story-series cards plus adult guide tools, series routines, take-home series slips, and optional adult prompts',
    safetyNote: safety,
    artifact: {
      pdfPath:
        'product-build/tabbed-folder-story-series-card-pack/Tabbed-Folder-Story-Series-Card-Pack.pdf',
      zipPath:
        'product-build/tabbed-folder-story-series-card-pack/tabbed-folder-story-series-card-pack.zip',
      sourceHtmlPath:
        'product-build/tabbed-folder-story-series-card-pack/source/tabbed-folder-story-series-card-pack.html',
      manifestPath: 'product-build/tabbed-folder-story-series-card-pack/manifest.json',
    },
    sourceFiles: [
      'content/product-artifacts/lanes/batch53-tabbed-folder-story-series-cards-a.json',
      'content/product-artifacts/lanes/batch53-tabbed-folder-story-series-cards-b.json',
      'content/product-artifacts/lanes/batch53-tabbed-folder-story-series-cards-c.json',
      'content/product-artifacts/lanes/batch53-tabbed-folder-story-series-tools.json',
    ],
    worldSlugs: [...worldSlugs],
    cover: {
      kicker: 'Printable tabbed folder story-series cards',
      headline: 'Tabbed Folder Story Series Card Pack',
      subhead:
        'Sixteen tabbed folder cards help writers keep one fictional story series steady across private paper pages by returning to characters, settings, clue labels, and page-turn notes.',
      included: [
        '16 printable tabbed folder story-series cards',
        'Adult setup guide',
        'Fictional story-series safety notes',
        'Tabbed folder continuity moves',
        'Family handoff notes',
        'Pack reset notes',
        'Six adult-led story-series routines',
        'Ten take-home story-series slips',
        'Eight optional adult prompts',
        'Printable PDF and ZIP artifact',
      ],
    },
    adultGuide: {
      title: 'Tabbed Folder Story Series Adult Guide',
      bullets: [
        'Print the tabbed folder story-series cards, blank pages, and guide before the adult-led paper session.',
        'Begin with one broad invented page, then coach page-one anchor, character return, setting return, clue carry, and page turn.',
        'Keep every example made-up, broad, offline, paper-only, and guided by an adult.',
        'Let the writer point, dictate, sketch, or write one word before asking for a longer page note.',
        'Use one card at a time so the story-series folder stays calm and private.',
        'End each activity with one pencil note about what can return on the next paper page.',
      ],
    },
    seriesRoutines: Array.from({ length: 6 }, (_, index) => ({
      id: `story-series-routine-${index + 1}`,
      title: `Story Series Routine ${index + 1}`,
      time: 'quiet folder pass',
      adultSteps: [
        'Adult chooses one pretend page and one tabbed folder story-series card: ____________________.',
        'Writer marks the page-one anchor and one returning character note: ____________________.',
        'Writer carries one setting detail or clue label to the next page: ____________________.',
        'Adult stores the page and next-page note in the folder pocket: ____________________.',
      ],
      familyLine: 'Family adult note: the returning story-series detail was ____________________.',
    })),
    takeHomeSeriesSlips: Array.from({ length: 10 }, (_, index) => ({
      id: `story-series-slip-${index + 1}`,
      title: `Story Series Take-Home Slip ${index + 1}`,
      adultLine: 'Adult: choose one pretend folder page to continue: ____________________.',
      childLine: 'Child: the detail I will bring back is: ____________________.',
      nextStepLine: 'Next page: add one note that keeps the story steady: ____________________.',
    })),
    optionalSharePrompts: Array.from(
      { length: 8 },
      (_, index) =>
        `Optional adult prompt ${index + 1}: point to one private paper detail that can return later: ____________________.`,
    ),
    cards: worldSlugs.map((worldSlug, index) => card(index + 1, worldSlug, worldAges[worldSlug])),
    ...overrides,
  }
}

function withWorldReplacements(source, replacements) {
  for (const [index, worldSlug] of replacements) {
    source.worldSlugs[index] = worldSlug
    source.cards[index] = card(index + 1, worldSlug, knownWorldAges.get(worldSlug)?.ageBand ?? '8-10')
  }
  return source
}

function productForSource(source) {
  return {
    ...product,
    worldSlugs: source.worldSlugs,
    worldSummaries: source.worldSlugs.map((slug) => ({
      slug,
      summary: `A linked fictional world summary for ${slug}.`,
    })),
  }
}

function tempWorldsAndImages(source, { omitAppendixImage = false } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'tabbed-folder-series-'))
  const tempWorlds = new Map(
    source.worldSlugs.map((slug) => [
      slug,
      {
        slug,
        title: titleForSlug(slug),
        ageBand: knownWorldAges.get(slug)?.ageBand ?? '8-10',
      },
    ]),
  )
  for (const slug of source.worldSlugs) {
    if (omitAppendixImage && slug === 'appendix-archive-lab') continue
    writeFileSync(resolve(root, `${slug}.jpg`), Buffer.from(`fake image ${slug}`))
  }
  return { root, worlds: tempWorlds }
}

function writeLaneFiles(tempRoot, source, laneIdOverrides = {}) {
  for (const sourceFile of source.sourceFiles) {
    const target = resolve(tempRoot, sourceFile)
    const laneId = laneIdOverrides[sourceFile] ?? sourceFile.split('/').at(-1)?.replace('.json', '')
    const lane = sourceFile.includes('-tools')
      ? {
          laneId,
          adultGuide: source.adultGuide,
          seriesRoutines: source.seriesRoutines,
          takeHomeSeriesSlips: source.takeHomeSeriesSlips,
          optionalAdultPrompts: source.optionalSharePrompts,
        }
      : {
          laneId,
          cards: source.cards.filter((entry) => {
            const number = Number(entry.id.slice(-2))
            if (sourceFile.includes('-cards-a')) return number <= 6
            if (sourceFile.includes('-cards-b')) return number >= 7 && number <= 11
            return number >= 12
          }),
        }
    mkdirSync(dirname(target), { recursive: true })
    writeFileSync(target, `${JSON.stringify(lane, null, 2)}\n`, { flag: 'wx' })
  }
}

describe('Tabbed Folder Story Series Card Pack policy', () => {
  it('accepts a valid source with exact Batch53 product alignment', () => {
    expect(validateTabbedFolderStorySeriesCardPackSource(validSource(), product, knownWorldAges)).toEqual([])
    expect(validateProductWorldSummaries(product, 'Tabbed Folder Story Series Card Pack')).toEqual([])
  })

  it('keeps the exact Batch53 world set and age-band order', () => {
    const source = validSource()
    expect(source.worldSlugs).toEqual(worldSlugs)
    expect(source.cards.map((entry) => [entry.worldSlug, entry.ageBand])).toEqual(
      worldSlugs.map((slug) => [slug, worldAges[slug]]),
    )
  })

  it('rejects excessive Batch50 world overlap', () => {
    const source = withWorldReplacements(validSource(), [
      [6, 'penny-path-compass-shop'],
      [7, 'sticker-station-mail-cart'],
      [8, 'mitten-market-lost-ticket'],
      [9, 'paperclip-plaza-parcel-day'],
    ])

    expect(validateTabbedFolderStorySeriesCardPackSource(source, productForSource(source), knownWorldAges).join('\n')).toMatch(
      /reuse no more than 7 Batch 50 worlds/,
    )
  })

  it('rejects excessive Batch51 world overlap', () => {
    const source = withWorldReplacements(validSource(), [[6, 'button-bakery-map-mixup']])

    expect(validateTabbedFolderStorySeriesCardPackSource(source, productForSource(source), knownWorldAges).join('\n')).toMatch(
      /reuse no more than 7 Batch 51 worlds/,
    )
  })

  it('rejects excessive Batch52 world overlap', () => {
    const source = withWorldReplacements(validSource(), [
      [6, 'button-bakery-map-mixup'],
      [7, 'teacup-town-weather-window'],
      [8, 'pocket-park-notice-board'],
      [9, 'moss-message-observatory'],
    ])

    expect(validateTabbedFolderStorySeriesCardPackSource(source, productForSource(source), knownWorldAges).join('\n')).toMatch(
      /reuse no more than 7 Batch 52 worlds/,
    )
  })

  it('rejects a story-series prompt field without a writable blank', () => {
    const source = validSource()
    source.cards[0].pageTurnPrompt = 'Page turn: stop after one clear story beat and write the next paper-page question.'

    expect(validateTabbedFolderStorySeriesCardPackSource(source, product, knownWorldAges)).toContain(
      'cards[0].pageTurnPrompt must include a writable blank.',
    )
  })

  it('rejects unsafe terms in story-series source text', () => {
    const cases = [
      {
        term: 'publish',
        mutate(source) {
          source.cards[0].takeHomeLine = 'Take-home line: publish the story series online: ____________________.'
        },
      },
      {
        term: 'portfolio',
        mutate(source) {
          source.cards[1].seriesWrapPrompt = 'Series wrap: add this page to a portfolio: ____________________.'
        },
      },
      {
        term: 'display',
        mutate(source) {
          source.cards[2].kidDirection = 'Writer: display the folder page for everyone: ____________________.'
        },
      },
      {
        term: 'grade',
        mutate(source) {
          source.cards[3].pageOneAnchorPrompt = 'Page one anchor: grade the story-series page: ____________________.'
        },
      },
      {
        term: 'upload',
        mutate(source) {
          source.cards[4].clueCarryPrompt = 'Clue carry: upload the clue label after writing: ____________________.'
        },
      },
      {
        term: 'recording',
        mutate(source) {
          source.cards[5].characterReturnPrompt = 'Character return: make a recording of the pretend voice: ____________________.'
        },
      },
      {
        term: 'private child profile',
        mutate(source) {
          source.cards[6].adultSetup = 'Adult: attach a private child profile to this folder: ____________________.'
        },
      },
      {
        term: 'public',
        mutate(source) {
          source.optionalSharePrompts[0] = 'Optional adult prompt 1: public note goes here: ____________________.'
        },
      },
      {
        term: 'address',
        mutate(source) {
          source.cards[7].settingReturnPrompt = 'Setting return: write an address on the page: ____________________.'
        },
      },
      {
        term: 'food',
        mutate(source) {
          source.cards[8].pageTurnPrompt = 'Page turn: food note returns on the next page: ____________________.'
        },
      },
      {
        term: 'episode',
        mutate(source) {
          source.cards[9].seriesWrapPrompt = 'Series wrap: name the next episode: ____________________.'
        },
      },
      {
        term: 'chapter book',
        mutate(source) {
          source.cards[10].takeHomeLine = 'Take-home line: turn this into a chapter book: ____________________.'
        },
      },
    ]

    for (const { term, mutate } of cases) {
      const source = validSource()
      mutate(source)
      expect(validateTabbedFolderStorySeriesCardPackSource(source, product, knownWorldAges).join('\n')).toMatch(
        new RegExp(term, 'i'),
      )
    }
  })

  it('renders all story-series fields into printable HTML', () => {
    const source = validSource()
    const imageMap = new Map(source.worldSlugs.map((slug) => [slug, `assets/${slug}.jpg`]))
    const html = renderTabbedFolderStorySeriesCardPackHtml(source, worlds, imageMap)

    expect(html).toContain('Tabbed Folder Story Series Card Pack')
    expect(html).toContain('Page one anchor')
    expect(html).toContain('Character return')
    expect(html).toContain('Setting return')
    expect(html).toContain('Clue carry')
    expect(html).toContain('Page turn')
    expect(html).toContain('Series wrap')
    expect(html).toContain('assets/appendix-archive-lab.jpg')
  })

  it('requires a local appendix-archive-lab image before building artifacts', async () => {
    const source = validSource()
    const { root, worlds: tempWorlds } = tempWorldsAndImages(source, { omitAppendixImage: true })
    const imageSources = new Map(
      source.worldSlugs
        .filter((slug) => slug !== 'appendix-archive-lab')
        .map((slug) => [slug, resolve(root, `${slug}.jpg`)]),
    )

    try {
      await expect(
        buildTabbedFolderStorySeriesCardPack({
          source,
          product,
          worlds: tempWorlds,
          imageSources,
          buildDir: resolve(root, 'build'),
          recordRoot: root,
          writePdf: async ({ pdfPath }) => writeFileSync(pdfPath, fakePdf(21)),
        }),
      ).rejects.toThrow(/appendix-archive-lab/)
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  it('builds deterministic PDF, source, ZIP, and manifest artifacts', async () => {
    const source = validSource()
    const { root, worlds: tempWorlds } = tempWorldsAndImages(source)
    const imageSources = new Map(source.worldSlugs.map((slug) => [slug, resolve(root, `${slug}.jpg`)]))
    const targetBuildDir = resolve(root, 'product-build', 'tabbed-folder-story-series-card-pack')

    try {
      const output = await buildTabbedFolderStorySeriesCardPack({
        source,
        product,
        worlds: tempWorlds,
        imageSources,
        buildDir: targetBuildDir,
        recordRoot: root,
        writePdf: async ({ pdfPath }) => writeFileSync(pdfPath, fakePdf(21)),
      })
      const htmlPath = join(targetBuildDir, 'source', 'tabbed-folder-story-series-card-pack.html')
      const pdfPath = join(targetBuildDir, 'Tabbed-Folder-Story-Series-Card-Pack.pdf')
      const zipPath = join(targetBuildDir, 'tabbed-folder-story-series-card-pack.zip')
      const manifestPath = join(targetBuildDir, 'manifest.json')

      expect(existsSync(htmlPath)).toBe(true)
      expect(existsSync(pdfPath)).toBe(true)
      expect(existsSync(zipPath)).toBe(true)
      expect(existsSync(manifestPath)).toBe(true)
      expect(output.source.productSlug).toBe('tabbed-folder-story-series-card-pack')
      expect(output.manifest.productSlug).toBe('tabbed-folder-story-series-card-pack')
      expect(output.manifest.files.pdf.sha256).toBe(sha256(pdfPath))
      expect(output.manifest.files.zip.sha256).toBe(sha256(zipPath))
      expect(output.manifest.files.assets).toHaveLength(16)

      const secondOutput = await buildTabbedFolderStorySeriesCardPack({
        source,
        product,
        worlds: tempWorlds,
        imageSources,
        buildDir: targetBuildDir,
        recordRoot: root,
        writePdf: async ({ pdfPath }) => writeFileSync(pdfPath, fakePdf(21)),
      })
      expect(readFileSync(secondOutput.paths.manifestPath, 'utf8')).toBe(readFileSync(output.paths.manifestPath, 'utf8'))

      const artifactStatus = inspectArtifactFiles(root, source.artifact, {
        expectedPdfPages: 21,
        expectedZipEntries: expectedZipEntries(source),
      })
      expect(artifactStatus.errors).toEqual([])
      expect(artifactStatus.valid).toBe(true)
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  it('validates exact lane source files reproduce story-series cards and tools', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-tabbed-folder-source-'))
    const source = validSource()

    try {
      writeLaneFiles(tempRoot, source)
      expect(validateTabbedFolderStorySeriesCardPackSourceFiles(source, tempRoot)).toEqual([])
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('rejects copied source files that point at the wrong Batch53 lanes', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-tabbed-folder-source-path-'))
    const source = validSource()

    try {
      source.sourceFiles[0] = 'content/product-artifacts/lanes/copied-tabbed-folder-story-series-cards-a.json'
      writeLaneFiles(tempRoot, source)
      expect(validateTabbedFolderStorySeriesCardPackSourceFiles(source, tempRoot)).toContain(
        'sourceFiles must list the exact Batch 53 story-series-card lane and tools files.',
      )
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('rejects a card placed in the wrong story-series lane range', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-tabbed-folder-lane-range-'))
    const source = validSource()

    try {
      writeLaneFiles(tempRoot, source)
      const laneAPath = resolve(
        tempRoot,
        'content/product-artifacts/lanes/batch53-tabbed-folder-story-series-cards-a.json',
      )
      const laneBPath = resolve(
        tempRoot,
        'content/product-artifacts/lanes/batch53-tabbed-folder-story-series-cards-b.json',
      )
      const laneA = JSON.parse(readFileSync(laneAPath, 'utf8'))
      const laneB = JSON.parse(readFileSync(laneBPath, 'utf8'))
      laneA.cards.push(laneB.cards[0])
      writeFileSync(laneAPath, `${JSON.stringify(laneA, null, 2)}\n`)

      expect(validateTabbedFolderStorySeriesCardPackSourceFiles(source, tempRoot)).toContain(
        'content/product-artifacts/lanes/batch53-tabbed-folder-story-series-cards-a.json must contain only cards 01-06.',
      )
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('will be listed as a checkout-pending product after catalog integration', () => {
    const products = JSON.parse(readFileSync(resolve('content/products/batch5-products.json'), 'utf8')).products
    const productRecord = products.find((candidate) => candidate.slug === 'tabbed-folder-story-series-card-pack')

    expect(productRecord).toMatchObject({
      title: 'Tabbed Folder Story Series Card Pack',
      pricePoint: '$79',
      status: 'checkout_pending',
    })
    expect(productRecord.ctaHref).toMatch(/^mailto:/)
  })

  it('documents the intended Batch50, Batch51, and Batch52 overlap counts', () => {
    expect(worldSlugs.filter((slug) => batch50WorldSlugs.includes(slug))).toHaveLength(4)
    expect(worldSlugs.filter((slug) => batch51WorldSlugs.includes(slug))).toHaveLength(7)
    expect(worldSlugs.filter((slug) => batch52WorldSlugs.includes(slug))).toHaveLength(4)
  })
})
