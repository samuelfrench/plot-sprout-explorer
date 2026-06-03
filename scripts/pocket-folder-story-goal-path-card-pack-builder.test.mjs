import { describe, expect, it } from 'vitest'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'

import {
  inspectArtifactFiles,
  validateProductWorldSummaries,
  validatePocketFolderStoryGoalPathCardPackSource,
  validatePocketFolderStoryGoalPathCardPackSourceFiles,
} from './product-artifact-policy.mjs'
import {
  buildPocketFolderStoryGoalPathCardPack,
  renderPocketFolderStoryGoalPathCardPackHtml,
} from './pocket-folder-story-goal-path-card-pack-builder.mjs'

const root = resolve(import.meta.dirname, '..')
const safety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, and no identifying facts.'

const sourceFiles = [
  'content/product-artifacts/lanes/batch57-pocket-folder-goal-path-cards-a.json',
  'content/product-artifacts/lanes/batch57-pocket-folder-goal-path-cards-b.json',
  'content/product-artifacts/lanes/batch57-pocket-folder-goal-path-cards-c.json',
  'content/product-artifacts/lanes/batch57-pocket-folder-goal-path-tools.json',
]

const worldAges = {
  'acorn-avenue-errand-office': '7-9',
  'pocket-park-notice-board': '7-9',
  'mitten-market-lost-ticket': '7-8',
  'penny-path-compass-shop': '7-9',
  'rain-boot-route-rangers': '7-9',
  'greenhouse-gear-garden': '8-10',
  'moss-message-observatory': '8-10',
  'rain-gauge-railway': '8-10',
  'pond-bridge-blueprint-club': '8-10',
  'compost-clock-workshop': '8-10',
  'chapter-gate-greenhouse': '10-11',
  'binding-day-boardwalk': '10-11',
  'blue-pencil-observatory': '10-11',
  'index-card-theater-club': '10-11',
  'compass-craft-academy': '10-11',
  'almost-invention-workshop': '10-11',
}

const worldSlugs = Object.keys(worldAges)

const extraWorldAges = {
  'appendix-archive-lab': '10-11',
  'button-bakery-map-mixup': '7-9',
  'buttonwood-library-train': '7-9',
  'cloudberry-clocktower': '8-10',
  'clue-label-tower-museum': '10-11',
  'margin-note-market': '10-11',
  'moon-muffin-market': '6-8',
  'orchard-pulley-post': '8-10',
  'pantry-measurement-mystery': '8-10',
  'paperclip-plaza-parcel-day': '7-9',
  'revision-river-ferry': '10-11',
  'seed-library-map-room': '8-10',
  'solar-oven-picnic-station': '8-10',
  'spoon-ferry-lunchbox-harbor': '7-9',
  'sticker-station-mail-cart': '7-9',
  'teacup-town-weather-window': '7-8',
  'tidepool-timekeepers-lab': '8-10',
  'tiny-lantern-reef': '8-10',
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
      premise: 'A friendly invented world for an adult-led paper pocket-folder goal path card.',
    },
  ]),
)

const cardKeys = [
  'id',
  'title',
  'worldSlug',
  'ageBand',
  'goalSkill',
  'useCase',
  'adultSetup',
  'kidDirection',
  'wantPrompt',
  'snagPrompt',
  'firstTryPrompt',
  'rethinkPrompt',
  'finishNotePrompt',
  'pocketLabelPrompt',
  'quietOptionLine',
  'takeHomeLine',
]

function readJson(relativePath) {
  return JSON.parse(readFileSync(resolve(root, relativePath), 'utf8'))
}

function titleForSlug(slug) {
  return slug
    .split('-')
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ')
}

function batchWorldSlugs(batchNumber) {
  const byBatch = {
    52: 'content/product-artifacts/spiral-notebook-story-final-copy-card-pack.json',
    53: 'content/product-artifacts/tabbed-folder-story-series-card-pack.json',
    54: 'content/product-artifacts/accordion-folder-story-arc-card-pack.json',
    55: 'content/product-artifacts/expanding-file-story-scene-chain-card-pack.json',
    56: 'content/product-artifacts/manila-folder-story-clue-trail-card-pack.json',
  }
  return readJson(byBatch[batchNumber]).worldSlugs
}

function makeCards() {
  return worldSlugs.map((worldSlug, index) => {
    const number = String(index + 1).padStart(2, '0')
    const title = titleForSlug(worldSlug)
    return {
      id: `pocket-folder-goal-path-card-${number}`,
      title: `${title} Story Goal Path Card`,
      worldSlug,
      ageBand: worldAges[worldSlug],
      goalSkill: `connect the character want, small snag, first try, rethink, finish note, and pocket label for ${title}`,
      useCase: `Adult-led fictional offline paper-only pocket folder goal path card for a made-up ${title} page: ____________________.`,
      adultSetup: `Adult sets out one pocket folder, blank page, pencil, and goal path card for ${title}: ____________________.`,
      kidDirection: `Writer builds a made-up goal path on paper and keeps every detail pretend for ${title}: ____________________.`,
      wantPrompt: `Want: name one pretend thing a character wants in ${title}: ____________________.`,
      snagPrompt: `Snag: add one small made-up snag that blocks the want in ${title}: ____________________.`,
      firstTryPrompt: `First try: write the first calm action the character tries in ${title}: ____________________.`,
      rethinkPrompt: `Rethink: choose one new paper plan after the first try in ${title}: ____________________.`,
      finishNotePrompt: `Finish note: write the calm page note that shows what changed in ${title}: ____________________.`,
      pocketLabelPrompt: `Pocket label: write the broad pretend label for this goal path in ${title}: ____________________.`,
      quietOptionLine: `Quiet option: point to one goal path blank before writing more for ${title}: ____________________.`,
      takeHomeLine: `Take-home line: restart this paper goal path later with one pretend pocket label: ____________________.`,
    }
  })
}

function makeTools() {
  return {
    adultGuide: {
      title: 'Pocket Folder Goal Path Adult Guide',
      bullets: [
        'Set out one pocket folder, blank pages, pencils, and a paper goal path card before the adult-led start: ____________________.',
        'Choose one made-up world and remind the writer that every want, snag, and try stays invented and paper-only: ____________________.',
        'Move through want, snag, first try, rethink, finish note, and pocket label in order: ____________________.',
        'Keep the adult in charge of the folder while the child writes or dictates short page notes: ____________________.',
        'Use pretend characters, places, and actions only; do not ask for real schedules, rooms, names, or personal facts: ____________________.',
        'Close by reading the pocket label and choosing one next-page goal path for a later adult-led paper pass: ____________________.',
      ],
    },
    goalPathRoutines: [
      {
        title: 'Want Start',
        time: 'short first-page setup',
        materials: 'Pocket folder, blank page, pencil, and want card.',
        steps: [
          'The adult opens the pocket folder and points to the want blank: ____________________.',
          'The child chooses one made-up character want: ____________________.',
          'The adult asks why that pretend want matters on the page: ____________________.',
          'The child writes or dictates one want line on paper: ____________________.',
        ],
        adultWrapLine: 'The goal path begins with this pretend want: ____________________.',
      },
      {
        title: 'Small Snag Step',
        time: 'one-page complication',
        materials: 'Pocket folder, current page, snag blank, and pencil.',
        steps: [
          'The adult points from the want to the snag blank: ____________________.',
          'The child chooses one small made-up snag: ____________________.',
          'The adult asks what the snag changes about the want: ____________________.',
          'The child writes one snag line on the page: ____________________.',
        ],
        adultWrapLine: 'The small snag changes the paper goal path with: ____________________.',
      },
      {
        title: 'First Try Pass',
        time: 'calm action note',
        materials: 'Pocket folder, goal card, pencil, and small paper strip.',
        steps: [
          'The adult rereads the want and snag lines: ____________________.',
          'The child invents one first try that could help: ____________________.',
          'The adult asks what the page should notice during the first try: ____________________.',
          'The child writes the first try on a paper strip: ____________________.',
        ],
        adultWrapLine: 'The first try moves the paper goal path with: ____________________.',
      },
      {
        title: 'Rethink Check',
        time: 'connection check',
        materials: 'Pocket folder, two page notes, and rethink blank.',
        steps: [
          'The adult points to the first try and asks what needs a new plan: ____________________.',
          'The child names one made-up rethink for the pretend path: ____________________.',
          'The adult asks how the rethink connects back to the want: ____________________.',
          'The child writes the rethink and one page note: ____________________.',
        ],
        adultWrapLine: 'The rethink now points the paper path toward: ____________________.',
      },
      {
        title: 'Finish Note Loop',
        time: 'continuity finish',
        materials: 'Earlier page, blank page, pencil, and pocket folder.',
        steps: [
          'The adult reopens the want, snag, first try, and rethink notes: ____________________.',
          'The child chooses one finish note that shows a calm change: ____________________.',
          'The adult asks where the finish note belongs on the next page: ____________________.',
          'The child writes one finish note that connects the path: ____________________.',
        ],
        adultWrapLine: 'The finish note connects this pretend piece: ____________________.',
      },
      {
        title: 'Pocket Label Close',
        time: 'paper wrap pass',
        materials: 'Pocket folder, label slip, page stack, and pencil.',
        steps: [
          'The adult lays the goal path pages beside the pocket folder: ____________________.',
          'The child chooses a broad pretend pocket label for the path: ____________________.',
          'The adult reads the label and asks what next-page want it suggests: ____________________.',
          'The child tucks the pocket label slip into the pocket folder: ____________________.',
        ],
        adultWrapLine: 'The pocket label closes this goal path with: ____________________.',
      },
    ],
    takeHomeGoalSlips: [
      'Adult: open the pocket folder and ask for one pretend character want: ____________________.',
      'Child: the want on my paper path is: ____________________.',
      'Adult: point from the want to the small snag blank: ____________________.',
      'Child: the small snag should show: ____________________.',
      'Adult: ask what first try moves the page forward: ____________________.',
      'Child: my first try says: ____________________.',
      'Adult: ask what rethink could help after the first try: ____________________.',
      'Child: the rethink can change the page by: ____________________.',
      'Adult: reread the path and ask what finish note belongs next: ____________________.',
      'Child: the pocket label for this pretend path is: ____________________.',
    ],
    optionalAdultPrompts: [
      'Optional adult-led paper prompt: the character want in the pocket folder is ____________________.',
      'Optional adult-led paper prompt: the small snag changes the path when ____________________.',
      'Optional adult-led paper prompt: the first try moves the page by ____________________.',
      'Optional adult-led paper prompt: the rethink helps because ____________________.',
      'Optional adult-led paper prompt: the finish note shows ____________________.',
      'Optional adult-led paper prompt: the pocket label should say ____________________.',
      'Optional adult-led paper prompt: the next page want could be ____________________.',
      'Optional adult-led paper prompt: the goal path closes with ____________________.',
    ],
  }
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
    'Pocket-Folder-Story-Goal-Path-Card-Pack.pdf',
    'README.txt',
    'source/pocket-folder-story-goal-path-card-pack.html',
    ...source.worldSlugs.map((slug) => `source/assets/${slug}.jpg`),
  ]
}

function validSource(overrides = {}) {
  const tools = makeTools()
  return {
    batchId: '2026-06-03-batch57',
    generatedAt: '2026-06-03',
    productSlug: 'pocket-folder-story-goal-path-card-pack',
    title: 'Pocket Folder Story Goal Path Card Pack',
    pricePoint: '$87',
    audience: 'Families, homeschool groups, tutors, and adult-led writing tables for writers ages 7-11.',
    sessionLength:
      '16 printable pocket folder story goal-path cards plus adult guide tools, goal-path routines, take-home goal slips, and optional adult prompts',
    safetyNote: safety,
    artifact: {
      pdfPath:
        'product-build/pocket-folder-story-goal-path-card-pack/Pocket-Folder-Story-Goal-Path-Card-Pack.pdf',
      zipPath:
        'product-build/pocket-folder-story-goal-path-card-pack/pocket-folder-story-goal-path-card-pack.zip',
      sourceHtmlPath:
        'product-build/pocket-folder-story-goal-path-card-pack/source/pocket-folder-story-goal-path-card-pack.html',
      manifestPath: 'product-build/pocket-folder-story-goal-path-card-pack/manifest.json',
    },
    sourceFiles: [...sourceFiles],
    worldSlugs: [...worldSlugs],
    cover: {
      kicker: 'Printable pocket folder goal path cards',
      headline: 'Pocket Folder Story Goal Path Card Pack',
      subhead:
        'Sixteen pocket folder cards help writers connect a want, small snag, first try, rethink, finish note, and broad pocket label.',
      included: [
        '16 printable pocket folder goal path cards',
        'Adult setup guide',
        'Fictional goal-path safety notes',
        'Character want prompts',
        'Small snag prompts',
        'First try prompts',
        'Rethink prompts',
        'Six adult-led goal-path routines',
        'Ten take-home goal slips',
        'Printable PDF and ZIP artifact',
      ],
    },
    adultGuide: tools.adultGuide,
    goalPathRoutines: tools.goalPathRoutines,
    takeHomeGoalSlips: tools.takeHomeGoalSlips,
    optionalAdultPrompts: tools.optionalAdultPrompts,
    cards: makeCards(),
    ...overrides,
  }
}

function withWorldReplacement(source, batchNumber) {
  const batchSet = new Set(batchWorldSlugs(batchNumber))
  const replaceIndex = source.worldSlugs.findIndex((slug) => batchSet.has(slug))
  const replacement = Object.keys(extraWorldAges).find((slug) => !source.worldSlugs.includes(slug) && !batchSet.has(slug))
  source.worldSlugs[replaceIndex] = replacement
  source.cards[replaceIndex] = {
    ...source.cards[replaceIndex],
    worldSlug: replacement,
    ageBand: knownWorldAges.get(replacement)?.ageBand ?? '8-10',
  }
  return source
}

function productForSource(source) {
  return {
    slug: 'pocket-folder-story-goal-path-card-pack',
    title: 'Pocket Folder Story Goal Path Card Pack',
    pricePoint: '$87',
    status: 'checkout_pending',
    worldSlugs: source.worldSlugs,
    worldSummaries: source.worldSlugs.map((slug) => ({
      slug,
      summary: `A linked fictional world summary for ${slug}.`,
    })),
  }
}

function tempWorldsAndImages(source, { omitWorldImage = null } = {}) {
  const tempRoot = mkdtempSync(join(tmpdir(), 'pocket-folder-goal-path-'))
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
    writeFileSync(resolve(tempRoot, `${slug}.jpg`), Buffer.from(`fake image ${slug}`))
  }
  return { root: tempRoot, worlds: tempWorlds }
}

function writeLaneFiles(tempRoot, source, laneIdOverrides = {}) {
  for (const sourceFile of source.sourceFiles) {
    const target = resolve(tempRoot, sourceFile)
    const laneId = laneIdOverrides[sourceFile] ?? sourceFile.split('/').at(-1)?.replace('.json', '')
    const lane = sourceFile.includes('-tools')
      ? {
          adultGuide: source.adultGuide,
          goalPathRoutines: source.goalPathRoutines,
          takeHomeGoalSlips: source.takeHomeGoalSlips,
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

describe('Pocket Folder Story Goal Path Card Pack policy', () => {
  it('defines the Batch57 validator and builder contract', () => {
    expect(validatePocketFolderStoryGoalPathCardPackSource).toBeTypeOf('function')
    expect(validatePocketFolderStoryGoalPathCardPackSourceFiles).toBeTypeOf('function')
    expect(renderPocketFolderStoryGoalPathCardPackHtml).toBeTypeOf('function')
    expect(buildPocketFolderStoryGoalPathCardPack).toBeTypeOf('function')
  })

  it('accepts a valid source with exact Batch57 product alignment', () => {
    const source = validSource()
    const product = productForSource(source)

    expect(validatePocketFolderStoryGoalPathCardPackSource(source, product, knownWorldAges)).toEqual([])
    expect(validateProductWorldSummaries(product, 'Pocket Folder Story Goal Path Card Pack')).toEqual([])
  })

  it('keeps the exact Batch57 source schema, world order, age bands, and card field order', () => {
    const source = validSource()

    expect(source.sourceFiles).toEqual(sourceFiles)
    expect(source.worldSlugs).toEqual(worldSlugs)
    expect(source.cards.map((entry) => [entry.id, entry.worldSlug, entry.ageBand])).toEqual(
      worldSlugs.map((slug, index) => [
        `pocket-folder-goal-path-card-${String(index + 1).padStart(2, '0')}`,
        slug,
        worldAges[slug],
      ]),
    )
    for (const card of source.cards) expect(Object.keys(card)).toEqual(cardKeys)
    expect(source.adultGuide.bullets).toHaveLength(6)
    expect(source.goalPathRoutines).toHaveLength(6)
    expect(source.goalPathRoutines.every((routine) => routine.steps.length === 4)).toBe(true)
    expect(source.takeHomeGoalSlips).toHaveLength(10)
    expect(source.optionalAdultPrompts).toHaveLength(8)
  })

  it('documents exact overlap guards against existing Batch52 through Batch56 source files', () => {
    for (const batchNumber of [52, 53, 54, 55, 56]) {
      expect(worldSlugs.filter((slug) => batchWorldSlugs(batchNumber).includes(slug))).toHaveLength(7)
    }
  })

  it('rejects changed Batch52, Batch53, Batch54, Batch55, and Batch56 overlap counts', () => {
    for (const batchNumber of [52, 53, 54, 55, 56]) {
      const source = withWorldReplacement(validSource(), batchNumber)
      expect(
        validatePocketFolderStoryGoalPathCardPackSource(source, productForSource(source), knownWorldAges).join('\n'),
      ).toMatch(new RegExp(`overlap exactly 7 Batch ${batchNumber} worlds`))
    }
  })

  it('keeps exact Batch57 artifact paths and rejects copied prior-pack artifact paths', () => {
    const source = validSource()
    expect(source.artifact).toEqual({
      pdfPath:
        'product-build/pocket-folder-story-goal-path-card-pack/Pocket-Folder-Story-Goal-Path-Card-Pack.pdf',
      zipPath:
        'product-build/pocket-folder-story-goal-path-card-pack/pocket-folder-story-goal-path-card-pack.zip',
      sourceHtmlPath:
        'product-build/pocket-folder-story-goal-path-card-pack/source/pocket-folder-story-goal-path-card-pack.html',
      manifestPath: 'product-build/pocket-folder-story-goal-path-card-pack/manifest.json',
    })

    source.artifact.pdfPath =
      'product-build/manila-folder-story-clue-trail-card-pack/Manila-Folder-Story-Clue-Trail-Card-Pack.pdf'
    expect(validatePocketFolderStoryGoalPathCardPackSource(source, productForSource(source), knownWorldAges)).toContain(
      'Pocket Folder Story Goal Path Card Pack artifact.pdfPath must be product-build/pocket-folder-story-goal-path-card-pack/Pocket-Folder-Story-Goal-Path-Card-Pack.pdf.',
    )
  })

  it('rejects a goal-path prompt field without a writable blank', () => {
    const source = validSource()
    source.cards[0].finishNotePrompt = 'Finish note: write the calm page note that shows what changed.'

    expect(validatePocketFolderStoryGoalPathCardPackSource(source, productForSource(source), knownWorldAges)).toContain(
      'cards[0].finishNotePrompt must include a writable blank.',
    )
  })

  it('rejects unsafe goal-path source language including standalone public, address, food, and pressure terms', () => {
    const cases = [
      {
        term: 'public',
        mutate(source) {
          source.cards[0].quietOptionLine = 'Quiet option: public note goes here: ____________________.'
        },
      },
      {
        term: 'address',
        mutate(source) {
          source.cards[1].snagPrompt = 'Snag: write an address on the page: ____________________.'
        },
      },
      {
        term: 'food',
        mutate(source) {
          source.cards[2].finishNotePrompt = 'Finish note: food note returns later: ____________________.'
        },
      },
      {
        term: 'publish',
        mutate(source) {
          source.cards[3].pocketLabelPrompt = 'Pocket label: publish the finished path: ____________________.'
        },
      },
      {
        term: 'showcase',
        mutate(source) {
          source.cards[4].takeHomeLine = 'Take-home line: save this for a showcase: ____________________.'
        },
      },
      {
        term: 'portfolio',
        mutate(source) {
          source.cards[5].rethinkPrompt = 'Rethink: place this in a portfolio: ____________________.'
        },
      },
      {
        term: 'display',
        mutate(source) {
          source.cards[6].firstTryPrompt = 'First try: prepare this for display: ____________________.'
        },
      },
      {
        term: 'perfect',
        mutate(source) {
          source.cards[7].kidDirection = 'Writer makes the goal path perfect before stopping: ____________________.'
        },
      },
      {
        term: 'rubric',
        mutate(source) {
          source.goalPathRoutines[0].steps[0] = 'The adult opens the rubric before the folder: ____________________.'
        },
      },
      {
        term: 'assessment',
        mutate(source) {
          source.adultGuide.bullets[0] = 'Use this assessment to check the first pocket label: ____________________.'
        },
      },
      {
        term: 'episode',
        mutate(source) {
          source.cards[8].pocketLabelPrompt = 'Pocket label: name the next episode: ____________________.'
        },
      },
      {
        term: 'chapter book',
        mutate(source) {
          source.cards[9].takeHomeLine = 'Take-home line: turn this into a chapter book: ____________________.'
        },
      },
      {
        term: 'screenplay',
        mutate(source) {
          source.cards[10].snagPrompt = 'Snag: change this into a screenplay: ____________________.'
        },
      },
      {
        term: 'upload',
        mutate(source) {
          source.cards[11].kidDirection = 'Writer: upload the goal path after writing: ____________________.'
        },
      },
      {
        term: 'recording',
        mutate(source) {
          source.cards[12].adultSetup = 'Adult starts a recording before the paper pass: ____________________.'
        },
      },
      {
        term: 'voice memo',
        mutate(source) {
          source.cards[13].wantPrompt = 'Want: make a voice memo about the pretend character: ____________________.'
        },
      },
      {
        term: 'timer',
        mutate(source) {
          source.goalPathRoutines[1].steps[0] = 'The adult starts a timer before opening the folder: ____________________.'
        },
      },
      {
        term: 'score',
        mutate(source) {
          source.takeHomeGoalSlips[0] = 'Adult: add a score to the pocket folder: ____________________.'
        },
      },
      {
        term: 'private child profile',
        mutate(source) {
          source.adultGuide.bullets[1] = 'Attach a private child profile to the first pocket label: ____________________.'
        },
      },
    ]

    for (const { term, mutate } of cases) {
      const source = validSource()
      mutate(source)
      expect(
        validatePocketFolderStoryGoalPathCardPackSource(source, productForSource(source), knownWorldAges).join('\n'),
      ).toMatch(new RegExp(term, 'i'))
    }
  })

  it('renders all goal-path fields into printable HTML', () => {
    const source = validSource()
    const imageMap = new Map(source.worldSlugs.map((slug) => [slug, `assets/${slug}.jpg`]))
    const html = renderPocketFolderStoryGoalPathCardPackHtml(source, worlds, imageMap)

    expect(html).toContain('Pocket Folder Story Goal Path Card Pack')
    expect(html).toContain('Want')
    expect(html).toContain('Snag')
    expect(html).toContain('First try')
    expect(html).toContain('Rethink')
    expect(html).toContain('Finish note')
    expect(html).toContain('Pocket label')
    expect(html).toContain('assets/pond-bridge-blueprint-club.jpg')
    expect(html).not.toMatch(/clue-trail|scene-chain|story-arc|portfolio/i)
  })

  it('requires a local card-world image before building artifacts', async () => {
    const source = validSource()
    const missingSlug = 'pond-bridge-blueprint-club'
    const { root: tempRoot, worlds: tempWorlds } = tempWorldsAndImages(source, { omitWorldImage: missingSlug })
    const imageSources = new Map(
      source.worldSlugs
        .filter((slug) => slug !== missingSlug)
        .map((slug) => [slug, resolve(tempRoot, `${slug}.jpg`)]),
    )

    try {
      await expect(
        buildPocketFolderStoryGoalPathCardPack({
          source,
          product: productForSource(source),
          worlds: tempWorlds,
          imageSources,
          buildDir: resolve(tempRoot, 'build'),
          recordRoot: tempRoot,
          writePdf: async ({ pdfPath }) => writeFileSync(pdfPath, fakePdf(21)),
        }),
      ).rejects.toThrow(new RegExp(missingSlug))
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('builds deterministic PDF, source, ZIP, and manifest artifacts', async () => {
    const source = validSource()
    const { root: tempRoot, worlds: tempWorlds } = tempWorldsAndImages(source)
    const imageSources = new Map(source.worldSlugs.map((slug) => [slug, resolve(tempRoot, `${slug}.jpg`)]))
    const targetBuildDir = resolve(tempRoot, 'product-build', 'pocket-folder-story-goal-path-card-pack')

    try {
      const output = await buildPocketFolderStoryGoalPathCardPack({
        source,
        product: productForSource(source),
        worlds: tempWorlds,
        imageSources,
        buildDir: targetBuildDir,
        recordRoot: tempRoot,
        writePdf: async ({ pdfPath }) => writeFileSync(pdfPath, fakePdf(21)),
      })
      const htmlPath = join(targetBuildDir, 'source', 'pocket-folder-story-goal-path-card-pack.html')
      const pdfPath = join(targetBuildDir, 'Pocket-Folder-Story-Goal-Path-Card-Pack.pdf')
      const zipPath = join(targetBuildDir, 'pocket-folder-story-goal-path-card-pack.zip')
      const manifestPath = join(targetBuildDir, 'manifest.json')
      const readmePath = join(targetBuildDir, 'README.txt')

      expect(existsSync(htmlPath)).toBe(true)
      expect(existsSync(pdfPath)).toBe(true)
      expect(existsSync(zipPath)).toBe(true)
      expect(existsSync(manifestPath)).toBe(true)
      expect(readFileSync(readmePath, 'utf8')).not.toMatch(/\b(provider|payment|public|real child)\b/i)
      expect(readFileSync(manifestPath, 'utf8')).not.toMatch(/\b(provider|payment|real child)\b/i)
      expect(output.source.productSlug).toBe('pocket-folder-story-goal-path-card-pack')
      expect(output.manifest.productSlug).toBe('pocket-folder-story-goal-path-card-pack')
      expect(output.manifest.files.pdf.sha256).toBe(sha256(pdfPath))
      expect(output.manifest.files.zip.sha256).toBe(sha256(zipPath))
      expect(output.manifest.files.assets).toHaveLength(16)

      const secondOutput = await buildPocketFolderStoryGoalPathCardPack({
        source,
        product: productForSource(source),
        worlds: tempWorlds,
        imageSources,
        buildDir: targetBuildDir,
        recordRoot: tempRoot,
        writePdf: async ({ pdfPath }) => writeFileSync(pdfPath, fakePdf(21)),
      })
      expect(readFileSync(secondOutput.paths.manifestPath, 'utf8')).toBe(readFileSync(output.paths.manifestPath, 'utf8'))

      const artifactStatus = inspectArtifactFiles(tempRoot, source.artifact, {
        expectedPdfPages: 21,
        expectedZipEntries: expectedZipEntries(source),
      })
      expect(artifactStatus.errors).toEqual([])
      expect(artifactStatus.valid).toBe(true)
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('validates exact lane source files reproduce goal-path cards and tools', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-pocket-folder-source-'))
    const source = validSource()

    try {
      writeLaneFiles(tempRoot, source)
      expect(validatePocketFolderStoryGoalPathCardPackSourceFiles(source, tempRoot)).toEqual([])
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('rejects copied source files that point at the wrong Batch57 lanes', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-pocket-folder-source-path-'))
    const source = validSource()

    try {
      source.sourceFiles[0] = 'content/product-artifacts/lanes/copied-pocket-folder-goal-path-cards-a.json'
      writeLaneFiles(tempRoot, source)
      expect(validatePocketFolderStoryGoalPathCardPackSourceFiles(source, tempRoot)).toContain(
        'sourceFiles must list the exact Batch 57 goal-path-card lane and tools files.',
      )
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('rejects a card placed in the wrong goal-path lane range', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-pocket-folder-lane-range-'))
    const source = validSource()

    try {
      writeLaneFiles(tempRoot, source)
      const laneAPath = resolve(
        tempRoot,
        'content/product-artifacts/lanes/batch57-pocket-folder-goal-path-cards-a.json',
      )
      const laneBPath = resolve(
        tempRoot,
        'content/product-artifacts/lanes/batch57-pocket-folder-goal-path-cards-b.json',
      )
      const laneA = JSON.parse(readFileSync(laneAPath, 'utf8'))
      const laneB = JSON.parse(readFileSync(laneBPath, 'utf8'))
      laneA.cards.push(laneB.cards[0])
      writeFileSync(laneAPath, `${JSON.stringify(laneA, null, 2)}\n`)

      expect(validatePocketFolderStoryGoalPathCardPackSourceFiles(source, tempRoot)).toContain(
        'content/product-artifacts/lanes/batch57-pocket-folder-goal-path-cards-a.json must contain only cards 01-06.',
      )
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('will be listed as a checkout-pending mailto product after catalog integration', () => {
    const products = readJson('content/products/batch5-products.json').products
    const productRecord = products.find((candidate) => candidate.slug === 'pocket-folder-story-goal-path-card-pack')

    expect(productRecord).toMatchObject({
      title: 'Pocket Folder Story Goal Path Card Pack',
      pricePoint: '$87',
      status: 'checkout_pending',
      heroImage: 'images/plotsprout/batch57/pocket-folder-story-goal-path-card-pack.jpg',
    })
    expect(productRecord.ctaHref).toMatch(/^mailto:/)
    expect(`${productRecord.checkoutNote}\n${productRecord.safetyNote}`).not.toMatch(
      /\b(provider|payment|public|real child)\b/i,
    )
  })

  it('defines one local-only Batch57 product hero image manifest entry', () => {
    const imageManifest = readJson('content/image-queue/2026-06-03-batch57-images.json')

    expect(imageManifest).toMatchObject({
      batchId: '2026-06-03-batch57-images',
      generatedAt: '2026-06-03',
    })
    expect(imageManifest.images).toHaveLength(1)
    expect(imageManifest.images[0]).toMatchObject({
      slug: 'pocket-folder-story-goal-path-card-pack',
      title: 'Pocket Folder Story Goal Path Card Pack',
      outputJpeg: 'public/images/plotsprout/batch57/pocket-folder-story-goal-path-card-pack.jpg',
      outputWebp: 'public/images/plotsprout/batch57/pocket-folder-story-goal-path-card-pack.webp',
      sidecar: 'content/image-runs/batch57/pocket-folder-story-goal-path-card-pack.json',
    })
    expect(imageManifest.images[0].prompt).toBe(
      'family-friendly top-down close-cropped catalog product photo on seamless white background, blank two-pocket paper folder, blank off-white goal path card stack, blank pocket label slips, quiet printable paper kit mockup, no writing',
    )
    for (const phrase of [
      'text',
      'labels',
      'logo',
      'spiral binding',
      'notebook',
      'school',
      'home',
      'address',
      'route',
      'gps',
      'schedule',
      'screens',
      'devices',
      'public',
      'upload',
      'recording',
      'camera',
      'photo',
      'audio',
      'video',
      'voice memo',
      'rating',
      'score',
      'grade',
      'timer',
      'food',
      'allergy',
      'medical',
      'scary',
      'weapons',
      'bullying',
      'plants',
      'cups',
      'bowls',
      'desk decor',
    ]) {
      expect(imageManifest.images[0].negativePrompt.toLowerCase()).toContain(phrase)
    }
  })
})
