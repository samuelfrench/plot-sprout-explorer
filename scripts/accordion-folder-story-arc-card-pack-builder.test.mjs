import { describe, expect, it } from 'vitest'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'

import {
  inspectArtifactFiles,
  validateProductWorldSummaries,
  validateAccordionFolderStoryArcCardPackSource,
  validateAccordionFolderStoryArcCardPackSourceFiles,
} from './product-artifact-policy.mjs'
import {
  buildAccordionFolderStoryArcCardPack,
  renderAccordionFolderStoryArcCardPackHtml,
} from './accordion-folder-story-arc-card-pack-builder.mjs'

const safety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles.'

const worldAges = {
  'acorn-avenue-errand-office': '7-9',
  'button-bakery-map-mixup': '7-9',
  'teacup-town-weather-window': '7-8',
  'sticker-station-mail-cart': '7-9',
  'spoon-ferry-lunchbox-harbor': '7-9',
  'solar-oven-picnic-station': '8-10',
  'paperclip-plaza-parcel-day': '7-9',
  'penny-path-compass-shop': '7-9',
  'tidepool-timekeepers-lab': '8-10',
  'rain-gauge-railway': '8-10',
  'compost-clock-workshop': '8-10',
  'seed-library-map-room': '8-10',
  'moss-message-observatory': '8-10',
  'clue-label-tower-museum': '10-11',
  'compass-craft-academy': '10-11',
  'greenhouse-gear-garden': '8-10',
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

const batch53WorldSlugs = [
  'chapter-gate-greenhouse',
  'binding-day-boardwalk',
  'index-card-theater-club',
  'margin-note-market',
  'revision-river-ferry',
  'blue-pencil-observatory',
  'appendix-archive-lab',
  'clue-label-tower-museum',
  'compass-craft-academy',
  'seed-library-map-room',
  'tidepool-timekeepers-lab',
  'acorn-avenue-errand-office',
  'rain-boot-route-rangers',
  'buttonwood-library-train',
  'cloudberry-clocktower',
  'moon-muffin-market',
]

const extraWorldAges = {
  'mitten-market-lost-ticket': '7-8',
  'pantry-measurement-mystery': '8-10',
  'orchard-pulley-post': '8-10',
  'pond-bridge-blueprint-club': '8-10',
  'tiny-lantern-reef': '8-10',
  'almost-invention-workshop': '10-11',
  'pocket-park-notice-board': '7-9',
  'chapter-gate-greenhouse': '10-11',
  'binding-day-boardwalk': '10-11',
  'index-card-theater-club': '10-11',
  'margin-note-market': '10-11',
  'revision-river-ferry': '10-11',
  'blue-pencil-observatory': '10-11',
  'appendix-archive-lab': '10-11',
  'rain-boot-route-rangers': '7-9',
  'buttonwood-library-train': '7-9',
  'cloudberry-clocktower': '8-10',
  'moon-muffin-market': '6-8',
}

const arcSkills = [
  'anchor a clear beginning before the accordion folder opens wider',
  'move from beginning to middle with one small change',
  'bridge a character choice into a gentle consequence',
  'keep one pretend object visible across the story arc',
  'turn a middle problem into a next-page decision',
  'show how one setting detail changes by the end',
  'fold a beginning clue into the ending return',
  'sort arc notes into beginning, middle, and ending pockets',
  'carry one tidepool question through the middle',
  'use a paper gauge note to show what changed',
  'turn one compost-clock mix-up into a calm ending',
  'plant one beginning detail that returns later',
  'keep the middle change connected to the opening',
  'bring a clue-label choice back at the end',
  'use a compass note to keep the arc pointed at one pretend goal',
  'reset the accordion folder with one ending return note',
]

const product = {
  slug: 'accordion-folder-story-arc-card-pack',
  title: 'Accordion Folder Story Arc Card Pack',
  pricePoint: '$81',
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
      premise: 'A friendly invented world for an adult-led paper story-arc card.',
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
    'Accordion-Folder-Story-Arc-Card-Pack.pdf',
    'README.txt',
    'source/accordion-folder-story-arc-card-pack.html',
    ...source.worldSlugs.map((slug) => `source/assets/${slug}.jpg`),
  ]
}

function card(index, worldSlug, ageBand) {
  return {
    id: `accordion-folder-arc-card-${String(index).padStart(2, '0')}`,
    title: `Accordion Folder Story Arc Card ${index}`,
    worldSlug,
    ageBand,
    arcSkill: arcSkills[index - 1],
    useCase:
      'Adult-led printable accordion folder story-arc card for shaping one private fictional beginning, middle, and ending on paper: ____________________.',
    adultSetup:
      'Adult: place one accordion folder, blank paper, pencil, and the story-arc card together before the writer starts: ____________________.',
    kidDirection:
      'Writer: choose one made-up story page and decide what belongs in the beginning, middle, and ending pockets: ____________________.',
    beginningPrompt:
      'Beginning: write the first pretend fact, place, or character note that starts the story arc: ____________________.',
    middleChangePrompt:
      'Middle change: show one small made-up change that makes the story arc move forward: ____________________.',
    choiceBridgePrompt:
      'Choice bridge: let the character choose one paper-safe action that connects middle to ending: ____________________.',
    consequencePrompt:
      'Consequence: write what changes because of the choice without using grades, scores, or real details: ____________________.',
    endingReturnPrompt:
      'Ending return: bring back one beginning detail so the final paper page feels connected: ____________________.',
    arcFolderPrompt:
      'Arc folder note: tuck one beginning, middle, or ending reminder into the accordion folder: ____________________.',
    quietOptionLine:
      'Quiet option: fill only the beginning, middle change, and ending return blanks before pausing: ____________________.',
    takeHomeLine:
      'Take-home line: keep one pretend story arc in an accordion folder and add one paper ending note later: ____________________.',
  }
}

function validSource(overrides = {}) {
  return {
    batchId: '2026-06-03-batch54',
    generatedAt: '2026-06-03',
    productSlug: 'accordion-folder-story-arc-card-pack',
    title: 'Accordion Folder Story Arc Card Pack',
    pricePoint: '$81',
    audience: 'Families, homeschool groups, tutors, and adult-led writing tables for writers ages 6-11.',
    sessionLength:
      '16 printable accordion folder story-arc cards plus adult guide tools, arc routines, take-home arc slips, and optional adult prompts',
    safetyNote: safety,
    artifact: {
      pdfPath:
        'product-build/accordion-folder-story-arc-card-pack/Accordion-Folder-Story-Arc-Card-Pack.pdf',
      zipPath:
        'product-build/accordion-folder-story-arc-card-pack/accordion-folder-story-arc-card-pack.zip',
      sourceHtmlPath:
        'product-build/accordion-folder-story-arc-card-pack/source/accordion-folder-story-arc-card-pack.html',
      manifestPath: 'product-build/accordion-folder-story-arc-card-pack/manifest.json',
    },
    sourceFiles: [
      'content/product-artifacts/lanes/batch54-accordion-folder-story-arc-cards-a.json',
      'content/product-artifacts/lanes/batch54-accordion-folder-story-arc-cards-b.json',
      'content/product-artifacts/lanes/batch54-accordion-folder-story-arc-cards-c.json',
      'content/product-artifacts/lanes/batch54-accordion-folder-story-arc-tools.json',
    ],
    worldSlugs: [...worldSlugs],
    cover: {
      kicker: 'Printable accordion folder story-arc cards',
      headline: 'Accordion Folder Story Arc Card Pack',
      subhead:
        'Sixteen accordion folder cards help writers sort a private fictional story arc into beginning, middle change, choice bridge, consequence, and ending return notes.',
      included: [
        '16 printable accordion folder story-arc cards',
        'Adult setup guide',
        'Fictional story-arc safety notes',
        'Accordion folder arc moves',
        'Family handoff notes',
        'Pack reset notes',
        'Six adult-led story-arc routines',
        'Ten take-home story-arc slips',
        'Eight optional adult prompts',
        'Printable PDF and ZIP artifact',
      ],
    },
    adultGuide: {
      title: 'Accordion Folder Story Arc Adult Guide',
      bullets: [
        'Print the accordion folder story-arc cards, blank pages, and guide before the adult-led paper session.',
        'Begin with one broad invented page, then coach beginning, middle change, choice bridge, consequence, ending return, and folder note.',
        'Keep every example made-up, broad, offline, paper-only, and guided by an adult.',
        'Let the writer point, dictate, sketch, or write one word before asking for a longer page note.',
        'Use one card at a time so the accordion folder stays calm and private.',
        'End each activity with one pencil note about what belongs in the next arc pocket.',
      ],
    },
    arcRoutines: Array.from({ length: 6 }, (_, index) => ({
      id: `story-arc-routine-${index + 1}`,
      title: `Story Arc Routine ${index + 1}`,
      time: 'quiet folder pass',
      adultSteps: [
        'Adult chooses one pretend page and one accordion folder story-arc card: ____________________.',
        'Writer marks the beginning note and one middle change: ____________________.',
        'Writer bridges one choice to a gentle consequence on paper: ____________________.',
        'Adult stores the ending return note in the folder pocket: ____________________.',
      ],
      familyLine: 'Family adult note: the returning story-arc detail was ____________________.',
    })),
    takeHomeArcSlips: Array.from({ length: 10 }, (_, index) => ({
      id: `story-arc-slip-${index + 1}`,
      title: `Story Arc Take-Home Slip ${index + 1}`,
      adultLine: 'Adult: choose one pretend folder page to continue: ____________________.',
      childLine: 'Child: the detail I will bring back is: ____________________.',
      nextStepLine: 'Next page: add one note that keeps the story steady: ____________________.',
    })),
    optionalAdultPrompts: Array.from(
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

function tempWorldsAndImages(source, { omitWorldImage = null } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'accordion-folder-arc-'))
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
    if (omitWorldImage === slug) continue
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
          arcRoutines: source.arcRoutines,
          takeHomeArcSlips: source.takeHomeArcSlips,
          optionalAdultPrompts: source.optionalAdultPrompts,
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

describe('Accordion Folder Story Arc Card Pack policy', () => {
  it('accepts a valid source with exact Batch54 product alignment', () => {
    expect(validateAccordionFolderStoryArcCardPackSource(validSource(), product, knownWorldAges)).toEqual([])
    expect(validateProductWorldSummaries(product, 'Accordion Folder Story Arc Card Pack')).toEqual([])
  })

  it('keeps the exact Batch54 world set and age-band order', () => {
    const source = validSource()
    expect(source.worldSlugs).toEqual(worldSlugs)
    expect(source.cards.map((entry) => [entry.worldSlug, entry.ageBand])).toEqual(
      worldSlugs.map((slug) => [slug, worldAges[slug]]),
    )
  })

  it('rejects excessive Batch50 world overlap', () => {
    const source = withWorldReplacements(validSource(), [[1, 'orchard-pulley-post']])

    expect(validateAccordionFolderStoryArcCardPackSource(source, productForSource(source), knownWorldAges).join('\n')).toMatch(
      /overlap exactly 6 Batch 50 worlds/,
    )
  })

  it('rejects excessive Batch51 world overlap', () => {
    const source = withWorldReplacements(validSource(), [[3, 'pocket-park-notice-board']])

    expect(validateAccordionFolderStoryArcCardPackSource(source, productForSource(source), knownWorldAges).join('\n')).toMatch(
      /overlap exactly 6 Batch 51 worlds/,
    )
  })

  it('rejects excessive Batch52 world overlap', () => {
    const source = withWorldReplacements(validSource(), [[0, 'pocket-park-notice-board']])

    expect(validateAccordionFolderStoryArcCardPackSource(source, productForSource(source), knownWorldAges).join('\n')).toMatch(
      /overlap exactly 7 Batch 52 worlds/,
    )
  })

  it('rejects the wrong Batch53 overlap', () => {
    const source = withWorldReplacements(validSource(), [[1, 'buttonwood-library-train']])

    expect(validateAccordionFolderStoryArcCardPackSource(source, productForSource(source), knownWorldAges).join('\n')).toMatch(
      /overlap exactly 5 Batch 53 worlds/,
    )
  })

  it('rejects a story-arc prompt field without a writable blank', () => {
    const source = validSource()
    source.cards[0].endingReturnPrompt = 'Page turn: stop after one clear story beat and write the next paper-page question.'

    expect(validateAccordionFolderStoryArcCardPackSource(source, product, knownWorldAges)).toContain(
      'cards[0].endingReturnPrompt must include a writable blank.',
    )
  })

  it('rejects unsafe terms in story-arc source text', () => {
    const cases = [
      {
        term: 'publish',
        mutate(source) {
          source.cards[0].takeHomeLine = 'Take-home line: publish the story arc online: ____________________.'
        },
      },
      {
        term: 'portfolio',
        mutate(source) {
          source.cards[1].arcFolderPrompt = 'Series wrap: add this page to a portfolio: ____________________.'
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
          source.cards[3].beginningPrompt = 'Page one anchor: grade the story-arc page: ____________________.'
        },
      },
      {
        term: 'upload',
        mutate(source) {
          source.cards[4].consequencePrompt = 'Clue carry: upload the clue label after writing: ____________________.'
        },
      },
      {
        term: 'recording',
        mutate(source) {
          source.cards[5].middleChangePrompt = 'Character return: make a recording of the pretend voice: ____________________.'
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
          source.optionalAdultPrompts[0] = 'Optional adult prompt 1: public note goes here: ____________________.'
        },
      },
      {
        term: 'address',
        mutate(source) {
          source.cards[7].choiceBridgePrompt = 'Setting return: write an address on the page: ____________________.'
        },
      },
      {
        term: 'food',
        mutate(source) {
          source.cards[8].endingReturnPrompt = 'Page turn: food note returns on the next page: ____________________.'
        },
      },
      {
        term: 'episode',
        mutate(source) {
          source.cards[9].arcFolderPrompt = 'Series wrap: name the next episode: ____________________.'
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
      expect(validateAccordionFolderStoryArcCardPackSource(source, product, knownWorldAges).join('\n')).toMatch(
        new RegExp(term, 'i'),
      )
    }
  })

  it('renders all story-arc fields into printable HTML', () => {
    const source = validSource()
    const imageMap = new Map(source.worldSlugs.map((slug) => [slug, `assets/${slug}.jpg`]))
    const html = renderAccordionFolderStoryArcCardPackHtml(source, worlds, imageMap)

    expect(html).toContain('Accordion Folder Story Arc Card Pack')
    expect(html).toContain('Beginning')
    expect(html).toContain('Middle change')
    expect(html).toContain('Choice bridge')
    expect(html).toContain('Consequence')
    expect(html).toContain('Ending return')
    expect(html).toContain('Arc folder note')
    expect(html).toContain('assets/solar-oven-picnic-station.jpg')
  })

  it('requires a local card-world image before building artifacts', async () => {
    const source = validSource()
    const missingSlug = 'solar-oven-picnic-station'
    const { root, worlds: tempWorlds } = tempWorldsAndImages(source, { omitWorldImage: missingSlug })
    const imageSources = new Map(
      source.worldSlugs
        .filter((slug) => slug !== missingSlug)
        .map((slug) => [slug, resolve(root, `${slug}.jpg`)]),
    )

    try {
      await expect(
        buildAccordionFolderStoryArcCardPack({
          source,
          product,
          worlds: tempWorlds,
          imageSources,
          buildDir: resolve(root, 'build'),
          recordRoot: root,
          writePdf: async ({ pdfPath }) => writeFileSync(pdfPath, fakePdf(21)),
        }),
      ).rejects.toThrow(new RegExp(missingSlug))
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  it('builds deterministic PDF, source, ZIP, and manifest artifacts', async () => {
    const source = validSource()
    const { root, worlds: tempWorlds } = tempWorldsAndImages(source)
    const imageSources = new Map(source.worldSlugs.map((slug) => [slug, resolve(root, `${slug}.jpg`)]))
    const targetBuildDir = resolve(root, 'product-build', 'accordion-folder-story-arc-card-pack')

    try {
      const output = await buildAccordionFolderStoryArcCardPack({
        source,
        product,
        worlds: tempWorlds,
        imageSources,
        buildDir: targetBuildDir,
        recordRoot: root,
        writePdf: async ({ pdfPath }) => writeFileSync(pdfPath, fakePdf(21)),
      })
      const htmlPath = join(targetBuildDir, 'source', 'accordion-folder-story-arc-card-pack.html')
      const pdfPath = join(targetBuildDir, 'Accordion-Folder-Story-Arc-Card-Pack.pdf')
      const zipPath = join(targetBuildDir, 'accordion-folder-story-arc-card-pack.zip')
      const manifestPath = join(targetBuildDir, 'manifest.json')

      expect(existsSync(htmlPath)).toBe(true)
      expect(existsSync(pdfPath)).toBe(true)
      expect(existsSync(zipPath)).toBe(true)
      expect(existsSync(manifestPath)).toBe(true)
      expect(output.source.productSlug).toBe('accordion-folder-story-arc-card-pack')
      expect(output.manifest.productSlug).toBe('accordion-folder-story-arc-card-pack')
      expect(output.manifest.files.pdf.sha256).toBe(sha256(pdfPath))
      expect(output.manifest.files.zip.sha256).toBe(sha256(zipPath))
      expect(output.manifest.files.assets).toHaveLength(16)

      const secondOutput = await buildAccordionFolderStoryArcCardPack({
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

  it('validates exact lane source files reproduce story-arc cards and tools', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-accordion-folder-source-'))
    const source = validSource()

    try {
      writeLaneFiles(tempRoot, source)
      expect(validateAccordionFolderStoryArcCardPackSourceFiles(source, tempRoot)).toEqual([])
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('rejects copied source files that point at the wrong Batch54 lanes', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-accordion-folder-source-path-'))
    const source = validSource()

    try {
      source.sourceFiles[0] = 'content/product-artifacts/lanes/copied-accordion-folder-story-arc-cards-a.json'
      writeLaneFiles(tempRoot, source)
      expect(validateAccordionFolderStoryArcCardPackSourceFiles(source, tempRoot)).toContain(
        'sourceFiles must list the exact Batch 54 story-arc-card lane and tools files.',
      )
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('rejects a card placed in the wrong story-arc lane range', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-accordion-folder-lane-range-'))
    const source = validSource()

    try {
      writeLaneFiles(tempRoot, source)
      const laneAPath = resolve(
        tempRoot,
        'content/product-artifacts/lanes/batch54-accordion-folder-story-arc-cards-a.json',
      )
      const laneBPath = resolve(
        tempRoot,
        'content/product-artifacts/lanes/batch54-accordion-folder-story-arc-cards-b.json',
      )
      const laneA = JSON.parse(readFileSync(laneAPath, 'utf8'))
      const laneB = JSON.parse(readFileSync(laneBPath, 'utf8'))
      laneA.cards.push(laneB.cards[0])
      writeFileSync(laneAPath, `${JSON.stringify(laneA, null, 2)}\n`)

      expect(validateAccordionFolderStoryArcCardPackSourceFiles(source, tempRoot)).toContain(
        'content/product-artifacts/lanes/batch54-accordion-folder-story-arc-cards-a.json must contain only cards 01-06.',
      )
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('will be listed as a checkout-pending product after catalog integration', () => {
    const products = JSON.parse(readFileSync(resolve('content/products/batch5-products.json'), 'utf8')).products
    const productRecord = products.find((candidate) => candidate.slug === 'accordion-folder-story-arc-card-pack')

    expect(productRecord).toMatchObject({
      title: 'Accordion Folder Story Arc Card Pack',
      pricePoint: '$81',
      status: 'checkout_pending',
    })
    expect(productRecord.ctaHref).toMatch(/^mailto:/)
  })

  it('documents the intended Batch50, Batch51, Batch52, and Batch53 overlap counts', () => {
    expect(worldSlugs.filter((slug) => batch50WorldSlugs.includes(slug))).toHaveLength(6)
    expect(worldSlugs.filter((slug) => batch51WorldSlugs.includes(slug))).toHaveLength(6)
    expect(worldSlugs.filter((slug) => batch52WorldSlugs.includes(slug))).toHaveLength(7)
    expect(worldSlugs.filter((slug) => batch53WorldSlugs.includes(slug))).toHaveLength(5)
  })
})
