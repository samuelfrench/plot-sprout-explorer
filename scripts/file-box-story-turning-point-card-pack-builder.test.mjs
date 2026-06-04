import { describe, expect, it } from 'vitest'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'

import {
  inspectArtifactFiles,
  validateFileBoxStoryTurningPointCardPackSource,
  validateFileBoxStoryTurningPointCardPackSourceFiles,
  validateProductWorldSummaries,
} from './product-artifact-policy.mjs'
import {
  buildFileBoxStoryTurningPointCardPack,
  renderFileBoxStoryTurningPointCardPackHtml,
} from './file-box-story-turning-point-card-pack-builder.mjs'

const root = resolve(import.meta.dirname, '..')
const safety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, and no identifying facts.'

const sourceFiles = [
  'content/product-artifacts/lanes/batch59-file-box-turning-point-cards-a.json',
  'content/product-artifacts/lanes/batch59-file-box-turning-point-cards-b.json',
  'content/product-artifacts/lanes/batch59-file-box-turning-point-cards-c.json',
  'content/product-artifacts/lanes/batch59-file-box-turning-point-tools.json',
]

const worldAges = {
  'acorn-avenue-errand-office': '7-9',
  'teacup-town-weather-window': '7-8',
  'sticker-station-mail-cart': '7-9',
  'spoon-ferry-lunchbox-harbor': '7-9',
  'pocket-park-notice-board': '7-9',
  'rain-boot-route-rangers': '7-9',
  'tidepool-timekeepers-lab': '8-10',
  'greenhouse-gear-garden': '8-10',
  'solar-oven-picnic-station': '8-10',
  'orchard-pulley-post': '8-10',
  'revision-river-ferry': '10-11',
  'clue-label-tower-museum': '10-11',
  'chapter-gate-greenhouse': '10-11',
  'margin-note-market': '10-11',
  'binding-day-boardwalk': '10-11',
  'index-card-theater-club': '10-11',
}

const worldSlugs = Object.keys(worldAges)

const extraWorldAges = {
  'almost-invention-workshop': '10-11',
  'appendix-archive-lab': '10-11',
  'blue-pencil-observatory': '10-11',
  'button-bakery-map-mixup': '7-9',
  'buttonwood-library-train': '7-9',
  'cloudberry-clocktower': '8-10',
  'compass-craft-academy': '10-11',
  'compost-clock-workshop': '8-10',
  'mitten-market-lost-ticket': '7-8',
  'moon-muffin-market': '6-8',
  'moss-message-observatory': '8-10',
  'pantry-measurement-mystery': '8-10',
  'paperclip-plaza-parcel-day': '7-9',
  'penny-path-compass-shop': '7-9',
  'pond-bridge-blueprint-club': '8-10',
  'rain-gauge-railway': '8-10',
  'seed-library-map-room': '8-10',
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
      premise: 'A friendly invented world for an adult-led paper file-box turning point card.',
    },
  ]),
)

const cardKeys = [
  'id',
  'title',
  'worldSlug',
  'ageBand',
  'turningPointSkill',
  'useCase',
  'adultSetup',
  'kidDirection',
  'startScenePrompt',
  'turnSignalPrompt',
  'beforePathPrompt',
  'afterPathPrompt',
  'characterReactionPrompt',
  'nextStepPrompt',
  'fileBoxLabelPrompt',
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
    54: 'content/product-artifacts/accordion-folder-story-arc-card-pack.json',
    55: 'content/product-artifacts/expanding-file-story-scene-chain-card-pack.json',
    56: 'content/product-artifacts/manila-folder-story-clue-trail-card-pack.json',
    57: 'content/product-artifacts/pocket-folder-story-goal-path-card-pack.json',
    58: 'content/product-artifacts/hanging-file-story-decision-point-card-pack.json',
  }
  return readJson(byBatch[batchNumber]).worldSlugs
}

function makeCards() {
  return worldSlugs.map((worldSlug, index) => {
    const number = String(index + 1).padStart(2, '0')
    const title = titleForSlug(worldSlug)
    return {
      id: `file-box-turning-point-card-${number}`,
      title: `${title} Story Turning Point Card`,
      worldSlug,
      ageBand: worldAges[worldSlug],
      turningPointSkill: `connect one starting scene, one turn signal, one before path, one after path, one character reaction, one next step, and one file-box label for ${title}`,
      useCase: `Adult-led fictional offline paper-only file box turning point card for a made-up ${title} page: ____________________.`,
      adultSetup: `Adult sets out one file box, blank page, pencil, and turning point card for ${title}: ____________________.`,
      kidDirection: `Writer keeps every detail pretend while connecting the before path and after path for ${title}: ____________________.`,
      startScenePrompt: `Starting scene: name the pretend page moment before the turn in ${title}: ____________________.`,
      turnSignalPrompt: `Turn signal: write one small pretend sign that tells the scene is changing in ${title}: ____________________.`,
      beforePathPrompt: `Before path: write what the character was trying before the turn in ${title}: ____________________.`,
      afterPathPrompt: `After path: write what changes after the turn signal in ${title}: ____________________.`,
      characterReactionPrompt: `Character reaction: write one pretend reaction to the turning point in ${title}: ____________________.`,
      nextStepPrompt: `Next step: write one calm next paper step after the turn in ${title}: ____________________.`,
      fileBoxLabelPrompt: `File-box label: write the broad pretend file-box label for this turning point in ${title}: ____________________.`,
      quietOptionLine: `Quiet option: point to the turn signal and file-box label blanks before writing more for ${title}: ____________________.`,
      takeHomeLine: `Take-home line: restart this paper turning point later with one pretend file-box label: ____________________.`,
    }
  })
}

function makeTools() {
  return {
    adultGuide: {
      title: 'File Box Turning Point Adult Guide',
      bullets: [
        'Set out one file box, blank pages, pencils, and a turning point card before the adult-led start: ____________________.',
        'Choose one made-up world and remind the writer that every scene, signal, path, reaction, and next step stays invented and paper-only: ____________________.',
        'Move through starting scene, turn signal, before path, after path, character reaction, next step, and file-box label in order: ____________________.',
        'Keep the adult in charge of the file box while the child writes or dictates short page notes: ____________________.',
        'Use pretend characters, places, and actions only; do not ask for real schedules, rooms, names, or personal facts: ____________________.',
        'Close by reading the file-box label and choosing one next-page turning point for a later adult-led paper pass: ____________________.',
      ],
    },
    turningPointRoutines: [
      {
        title: 'Starting Scene Start',
        time: 'short first-page setup',
        materials: 'File box, blank page, pencil, and starting scene card.',
        steps: [
          'The adult opens the file box and points to the starting scene blank: ____________________.',
          'The child chooses one made-up page moment before the turn: ____________________.',
          'The adult asks what is steady before the scene changes: ____________________.',
          'The child writes or dictates one starting scene line on paper: ____________________.',
        ],
        adultWrapLine: 'The turning point begins with this pretend starting scene: ____________________.',
      },
      {
        title: 'Turn Signal Note',
        time: 'one-page change signal',
        materials: 'File box, current page, turn signal blank, and pencil.',
        steps: [
          'The adult points from the starting scene to the turn signal blank: ____________________.',
          'The child names one small pretend signal that shows the scene is changing: ____________________.',
          'The adult asks what the signal changes about the page: ____________________.',
          'The child writes the turn signal on the card: ____________________.',
        ],
        adultWrapLine: 'The turn signal changes the paper scene by: ____________________.',
      },
      {
        title: 'Before And After Path',
        time: 'paper comparison pass',
        materials: 'File box, current page, before path blank, after path blank, and pencil.',
        steps: [
          'The adult rereads the starting scene and turn signal lines: ____________________.',
          'The child writes what the character was trying before the turn: ____________________.',
          'The child writes what changes after the turn: ____________________.',
          'The adult repeats both paths before the reaction line: ____________________.',
        ],
        adultWrapLine: 'The before path and after path connect through: ____________________.',
      },
      {
        title: 'Character Reaction Check',
        time: 'reaction note',
        materials: 'File box, turning point card, reaction blank, and pencil.',
        steps: [
          'The adult points to the before path and after path: ____________________.',
          'The child names one pretend character reaction to the turn: ____________________.',
          'The adult asks what the reaction shows about the character: ____________________.',
          'The child writes the reaction line on paper: ____________________.',
        ],
        adultWrapLine: 'The character reaction shows the turning point by: ____________________.',
      },
      {
        title: 'Next Step Link',
        time: 'continuity finish',
        materials: 'Earlier page, blank page, pencil, and file box.',
        steps: [
          'The adult reopens the starting scene, turn signal, path, and reaction notes: ____________________.',
          'The child chooses one calm next step after the turn: ____________________.',
          'The adult asks where the next step belongs on the page: ____________________.',
          'The child writes one next step that connects the turning point: ____________________.',
        ],
        adultWrapLine: 'The next step connects this pretend turn with: ____________________.',
      },
      {
        title: 'File-Box Label Close',
        time: 'paper wrap pass',
        materials: 'File box, label slip, page stack, and pencil.',
        steps: [
          'The adult lays the turning point pages beside the file box: ____________________.',
          'The child chooses a broad pretend file-box label for the turning point: ____________________.',
          'The adult reads the label and asks what next-page turn it suggests: ____________________.',
          'The child tucks the file-box label slip into the file box: ____________________.',
        ],
        adultWrapLine: 'The file-box label closes this turning point with: ____________________.',
      },
    ],
    takeHomeTurningSlips: [
      'Adult: open the file box and ask for one pretend starting scene: ____________________.',
      'Child: the starting scene on my paper turning point is: ____________________.',
      'Adult: point from the starting scene to the turn signal blank: ____________________.',
      'Child: the turn signal could be: ____________________.',
      'Child: the before path could be: ____________________.',
      'Child: the after path could be: ____________________.',
      'Adult: ask what the character does or feels after the turn: ____________________.',
      'Child: the character reaction can be: ____________________.',
      'Adult: ask what next step follows the turn: ____________________.',
      'Child: the file-box label for this pretend turning point is: ____________________.',
    ],
    optionalAdultPrompts: [
      'Optional adult-led paper prompt: the starting scene in the file box is ____________________.',
      'Optional adult-led paper prompt: the turn signal can be ____________________.',
      'Optional adult-led paper prompt: before the turn, the character was trying to ____________________.',
      'Optional adult-led paper prompt: after the turn, the path changes to ____________________.',
      'Optional adult-led paper prompt: the character reaction shows ____________________.',
      'Optional adult-led paper prompt: the next step should be ____________________.',
      'Optional adult-led paper prompt: the file-box label should say ____________________.',
      'Optional adult-led paper prompt: the next turning point can start with ____________________.',
    ],
  }
}

function fakePdf(pageCount) {
  return Buffer.from(
    `%PDF-1.7\n${Array.from({ length: pageCount }, (_, index) => `${index + 1} 0 obj << /Type /Page >> endobj`).join('\n')}\n%%EOF\n`,
  )
}

function validSource(overrides = {}) {
  const tools = makeTools()
  return {
    batchId: '2026-06-04-batch59',
    generatedAt: '2026-06-04',
    productSlug: 'file-box-story-turning-point-card-pack',
    title: 'File Box Story Turning Point Card Pack',
    pricePoint: '$91',
    audience: 'Families, homeschool groups, tutors, and adult-led writing tables for writers ages 7-11.',
    sessionLength:
      '16 printable file box story turning-point cards plus adult guide tools, turning-point routines, take-home turning slips, and optional adult prompts',
    safetyNote: safety,
    artifact: {
      pdfPath: 'product-build/file-box-story-turning-point-card-pack/File-Box-Story-Turning-Point-Card-Pack.pdf',
      zipPath: 'product-build/file-box-story-turning-point-card-pack/file-box-story-turning-point-card-pack.zip',
      sourceHtmlPath:
        'product-build/file-box-story-turning-point-card-pack/source/file-box-story-turning-point-card-pack.html',
      manifestPath: 'product-build/file-box-story-turning-point-card-pack/manifest.json',
    },
    sourceFiles: [...sourceFiles],
    worldSlugs: [...worldSlugs],
    cover: {
      kicker: 'Printable file box turning point cards',
      headline: 'File Box Story Turning Point Card Pack',
      subhead:
        'Sixteen file-box cards help writers connect a starting scene, a turn signal, a before path, an after path, a character reaction, and a next step.',
      included: [
        '16 printable file box turning point cards',
        'Adult setup guide',
        'Fictional turning-point safety notes',
        'Starting scene prompts',
        'Turn signal prompts',
        'Before and after path prompts',
        'Character reaction prompts',
        'Next step prompts',
        'Six adult-led turning-point routines',
        'Ten take-home turning slips',
        'Printable PDF and ZIP artifact',
      ],
    },
    adultGuide: tools.adultGuide,
    turningPointRoutines: tools.turningPointRoutines,
    takeHomeTurningSlips: tools.takeHomeTurningSlips,
    optionalAdultPrompts: tools.optionalAdultPrompts,
    cards: makeCards(),
    ...overrides,
  }
}

function productForSource(source) {
  return {
    slug: 'file-box-story-turning-point-card-pack',
    title: 'File Box Story Turning Point Card Pack',
    pricePoint: '$91',
    status: 'checkout_pending',
    worldSlugs: source.worldSlugs,
    worldSummaries: source.worldSlugs.map((slug) => ({
      slug,
      summary: `A linked fictional world summary for ${slug}.`,
    })),
  }
}

function withWorldReplacement(source, batchNumber) {
  const batchSet = new Set(batchWorldSlugs(batchNumber))
  const replaceIndex = source.worldSlugs.findIndex((slug) => batchSet.has(slug))
  const replacement = Object.keys(extraWorldAges).find(
    (slug) => !source.worldSlugs.includes(slug) && !batchSet.has(slug),
  )
  source.worldSlugs[replaceIndex] = replacement
  source.cards[replaceIndex] = {
    ...source.cards[replaceIndex],
    worldSlug: replacement,
    ageBand: knownWorldAges.get(replacement)?.ageBand ?? '8-10',
  }
  return source
}

function tempWorldsAndImages(source, { omitWorldImage = null } = {}) {
  const tempRoot = mkdtempSync(join(tmpdir(), 'file-box-turning-point-'))
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
          turningPointRoutines: source.turningPointRoutines,
          takeHomeTurningSlips: source.takeHomeTurningSlips,
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

describe('File Box Story Turning Point Card Pack policy', () => {
  it('defines the Batch59 validator and builder contract', () => {
    expect(validateFileBoxStoryTurningPointCardPackSource).toBeTypeOf('function')
    expect(validateFileBoxStoryTurningPointCardPackSourceFiles).toBeTypeOf('function')
    expect(renderFileBoxStoryTurningPointCardPackHtml).toBeTypeOf('function')
    expect(buildFileBoxStoryTurningPointCardPack).toBeTypeOf('function')
  })

  it('accepts a valid source with exact Batch59 product alignment', () => {
    const source = validSource()
    const product = productForSource(source)

    expect(validateFileBoxStoryTurningPointCardPackSource(source, product, knownWorldAges)).toEqual([])
    expect(validateProductWorldSummaries(product, 'File Box Story Turning Point Card Pack')).toEqual([])
  })

  it('keeps the exact Batch59 source schema, world order, age bands, and card field order', () => {
    const source = validSource()

    expect(source.sourceFiles).toEqual(sourceFiles)
    expect(source.worldSlugs).toEqual(worldSlugs)
    expect(source.cards.map((entry) => [entry.id, entry.worldSlug, entry.ageBand])).toEqual(
      worldSlugs.map((slug, index) => [
        `file-box-turning-point-card-${String(index + 1).padStart(2, '0')}`,
        slug,
        worldAges[slug],
      ]),
    )
    for (const card of source.cards) expect(Object.keys(card)).toEqual(cardKeys)
    expect(source.adultGuide.bullets).toHaveLength(6)
    expect(source.turningPointRoutines).toHaveLength(6)
    expect(source.turningPointRoutines.every((routine) => routine.steps.length === 4)).toBe(true)
    expect(source.takeHomeTurningSlips).toHaveLength(10)
    expect(source.optionalAdultPrompts).toHaveLength(8)
  })

  it('documents strict overlap guards against existing Batch54 through Batch58 source files', () => {
    expect(worldSlugs.filter((slug) => batchWorldSlugs(54).includes(slug))).toHaveLength(8)
    for (const batchNumber of [55, 56, 57, 58]) {
      expect(worldSlugs.filter((slug) => batchWorldSlugs(batchNumber).includes(slug))).toHaveLength(7)
    }
  })

  it('rejects changed Batch54, Batch55, Batch56, Batch57, and Batch58 overlap counts', () => {
    const expectations = new Map([
      [54, 'overlap exactly 8 Batch 54 worlds'],
      [55, 'overlap exactly 7 Batch 55 worlds'],
      [56, 'overlap exactly 7 Batch 56 worlds'],
      [57, 'overlap exactly 7 Batch 57 worlds'],
      [58, 'overlap exactly 7 Batch 58 worlds'],
    ])
    for (const batchNumber of [54, 55, 56, 57, 58]) {
      const source = withWorldReplacement(validSource(), batchNumber)
      expect(
        validateFileBoxStoryTurningPointCardPackSource(source, productForSource(source), knownWorldAges).join('\n'),
      ).toMatch(new RegExp(expectations.get(batchNumber)))
    }
  })

  it('keeps exact Batch59 artifact paths and rejects copied prior-pack artifact paths', () => {
    const source = validSource()
    expect(source.artifact).toEqual({
      pdfPath: 'product-build/file-box-story-turning-point-card-pack/File-Box-Story-Turning-Point-Card-Pack.pdf',
      zipPath: 'product-build/file-box-story-turning-point-card-pack/file-box-story-turning-point-card-pack.zip',
      sourceHtmlPath:
        'product-build/file-box-story-turning-point-card-pack/source/file-box-story-turning-point-card-pack.html',
      manifestPath: 'product-build/file-box-story-turning-point-card-pack/manifest.json',
    })

    source.artifact.pdfPath =
      'product-build/hanging-file-story-decision-point-card-pack/Hanging-File-Story-Decision-Point-Card-Pack.pdf'
    expect(validateFileBoxStoryTurningPointCardPackSource(source, productForSource(source), knownWorldAges)).toContain(
      'File Box Story Turning Point Card Pack artifact.pdfPath must be product-build/file-box-story-turning-point-card-pack/File-Box-Story-Turning-Point-Card-Pack.pdf.',
    )
  })

  it('rejects a turning-point prompt field without a writable blank', () => {
    const source = validSource()
    source.cards[0].characterReactionPrompt = 'Character reaction: write one pretend reaction to the turning point.'

    expect(validateFileBoxStoryTurningPointCardPackSource(source, productForSource(source), knownWorldAges)).toContain(
      'cards[0].characterReactionPrompt must include a writable blank.',
    )
  })

  it('rejects unsafe turning-point source language including standalone public, address, food, and pressure terms', () => {
    const cases = [
      ['public', (source) => (source.cards[0].quietOptionLine = 'Quiet option: public note goes here: ____________________.')],
      ['address', (source) => (source.cards[1].beforePathPrompt = 'Before path: write an address on the page: ____________________.')],
      ['food', (source) => (source.cards[2].nextStepPrompt = 'Next step: food note returns later: ____________________.')],
      ['publish', (source) => (source.cards[3].fileBoxLabelPrompt = 'File-box label: publish the finished path: ____________________.')],
      ['showcase', (source) => (source.cards[4].takeHomeLine = 'Take-home line: save this for a showcase: ____________________.')],
      ['portfolio', (source) => (source.cards[5].turnSignalPrompt = 'Turn signal: place this in a portfolio: ____________________.')],
      ['display', (source) => (source.cards[6].afterPathPrompt = 'After path: prepare this for display: ____________________.')],
      ['perfect', (source) => (source.cards[7].kidDirection = 'Writer makes the turning point perfect before stopping: ____________________.')],
      ['rubric', (source) => (source.turningPointRoutines[0].steps[0] = 'The adult opens the rubric before the file box: ____________________.')],
      ['assessment', (source) => (source.adultGuide.bullets[0] = 'Use this assessment to check the first file-box label: ____________________.')],
      ['episode', (source) => (source.cards[8].fileBoxLabelPrompt = 'File-box label: name the next episode: ____________________.')],
      ['chapter book', (source) => (source.cards[9].takeHomeLine = 'Take-home line: turn this into a chapter book: ____________________.')],
      ['screenplay', (source) => (source.cards[10].beforePathPrompt = 'Before path: change this into a screenplay: ____________________.')],
      ['cliffhanger', (source) => (source.cards[11].afterPathPrompt = 'After path: add a cliffhanger ending: ____________________.')],
      ['plot twist', (source) => (source.cards[12].turnSignalPrompt = 'Turn signal: write a plot twist now: ____________________.')],
      ['choose your own adventure', (source) => (source.cover.subhead = 'A choose your own adventure draft system.')],
      ['publishable', (source) => (source.cover.included[0] = 'Publishable turning point pages')],
      ['upload', (source) => (source.cards[13].kidDirection = 'Writer: upload the turning point after writing: ____________________.')],
      ['recording', (source) => (source.cards[14].adultSetup = 'Adult starts a recording before the paper pass: ____________________.')],
      ['voice memo', (source) => (source.cards[15].startScenePrompt = 'Starting scene: make a voice memo about the pretend character: ____________________.')],
      ['timer', (source) => (source.turningPointRoutines[1].steps[0] = 'The adult starts a timer before opening the file box: ____________________.')],
      ['score', (source) => (source.takeHomeTurningSlips[0] = 'Adult: add a score to the file box: ____________________.')],
      ['private child profile', (source) => (source.adultGuide.bullets[1] = 'Attach a private child profile to the first file-box label: ____________________.')],
      ['school name', (source) => (source.cards[0].adultSetup = 'Adult: write the real school name before the turning point starts: ____________________.')],
      ['home address', (source) => (source.cards[1].fileBoxLabelPrompt = 'File-box label: include the home address on the file: ____________________.')],
      ['teacher name', (source) => (source.cards[2].takeHomeLine = 'Take-home line: add the teacher name to the path: ____________________.')],
      ['camera', (source) => (source.cards[3].afterPathPrompt = 'After path: turn on the camera before writing: ____________________.')],
      ['photo', (source) => (source.cards[4].turnSignalPrompt = 'Turn signal: attach a photo to the turning point: ____________________.')],
      ['audio', (source) => (source.cards[5].quietOptionLine = 'Quiet option: save an audio clip first: ____________________.')],
      ['video', (source) => (source.cards[6].startScenePrompt = 'Starting scene: make a video about the pretend choice: ____________________.')],
      ['allergy', (source) => (source.takeHomeTurningSlips[1] = 'Child: write allergy advice on the paper path: ____________________.')],
      ['medical', (source) => (source.optionalAdultPrompts[1] = 'Optional adult-led paper prompt: add medical advice before the turn signal: ____________________.')],
      ['diary', (source) => (source.cards[7].characterReactionPrompt = 'Character reaction: copy this into a private diary: ____________________.')],
      ['student profile', (source) => (source.adultGuide.bullets[2] = 'Add this page to the student profile after the file-box label: ____________________.')],
      ['personal disclosure', (source) => (source.cards[8].kidDirection = 'Writer: add a personal disclosure before inventing the helper: ____________________.')],
      ['provider', (source) => (source.cover.subhead = 'Use this provider handoff after the turning point is complete.')],
      ['payment', (source) => (source.sessionLength = '16 printable cards with payment setup notes for adults.')],
      ['checkout', (source) => (source.cover.included[0] = 'Checkout-ready file box card file')],
      ['Stripe', (source) => (source.cover.included[1] = 'Stripe setup note for the product page')],
    ]

    for (const [term, mutate] of cases) {
      const source = validSource()
      mutate(source)
      expect(
        validateFileBoxStoryTurningPointCardPackSource(source, productForSource(source), knownWorldAges).join('\n'),
      ).toMatch(new RegExp(term, 'i'))
    }
  })

  it('renders all turning-point fields into printable HTML', () => {
    const source = validSource()
    const imageMap = new Map(source.worldSlugs.map((slug) => [slug, `assets/${slug}.jpg`]))
    const html = renderFileBoxStoryTurningPointCardPackHtml(source, worlds, imageMap)

    expect(html).toContain('File Box Story Turning Point Card Pack')
    expect(html).toContain('Starting scene')
    expect(html).toContain('Turn signal')
    expect(html).toContain('Before path')
    expect(html).toContain('After path')
    expect(html).toContain('Character reaction')
    expect(html).toContain('Next step')
    expect(html).toContain('File-box label')
    expect(html).toContain('assets/tidepool-timekeepers-lab.jpg')
    expect(html).not.toMatch(/decision point|goal path|clue-trail|scene-chain|story-arc|portfolio/i)
  })

  it('requires a local card-world image before building artifacts', async () => {
    const source = validSource()
    const { root: imageRoot, worlds: tempWorlds } = tempWorldsAndImages(source, {
      omitWorldImage: 'tidepool-timekeepers-lab',
    })
    const buildDir = mkdtempSync(join(tmpdir(), 'file-box-turning-build-'))

    try {
      await expect(
        buildFileBoxStoryTurningPointCardPack({
          source,
          worlds: tempWorlds,
          outputDir: buildDir,
          imageRoot,
          pdfRenderer: async () => fakePdf(21),
        }),
      ).rejects.toThrow('Missing File Box Story Turning Point Card Pack source image for tidepool-timekeepers-lab')
    } finally {
      rmSync(imageRoot, { recursive: true, force: true })
      rmSync(buildDir, { recursive: true, force: true })
    }
  })

  it('validates exact source lane files and rejects lane range drift', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'file-box-turning-lanes-'))
    const source = validSource()

    try {
      writeLaneFiles(tempRoot, source)
      expect(validateFileBoxStoryTurningPointCardPackSourceFiles(source, tempRoot)).toEqual([])

      rmSync(tempRoot, { recursive: true, force: true })
      const badRoot = mkdtempSync(join(tmpdir(), 'file-box-turning-bad-lanes-'))
      const badSource = validSource()
      badSource.cards[6] = { ...badSource.cards[6], id: 'file-box-turning-point-card-12' }
      writeLaneFiles(badRoot, badSource)
      expect(validateFileBoxStoryTurningPointCardPackSourceFiles(badSource, badRoot).join('\n')).toMatch(
        /cards-b must include card numbers 07-11/,
      )
      rmSync(badRoot, { recursive: true, force: true })
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('builds deterministic artifact files with expected source assets', async () => {
    const source = validSource()
    const { root: imageRoot, worlds: tempWorlds } = tempWorldsAndImages(source)
    const buildDir = mkdtempSync(join(tmpdir(), 'file-box-turning-build-'))

    try {
      const result = await buildFileBoxStoryTurningPointCardPack({
        source,
        worlds: tempWorlds,
        outputDir: buildDir,
        recordRoot: buildDir,
        imageRoot,
        pdfRenderer: async () => fakePdf(21),
      })

      expect(existsSync(result.pdfPath)).toBe(true)
      expect(existsSync(result.zipPath)).toBe(true)
      expect(existsSync(result.htmlPath)).toBe(true)
      expect(existsSync(result.manifestPath)).toBe(true)
      expect(readFileSync(result.htmlPath, 'utf8')).toContain('File Box Story Turning Point Card Pack')

      const inspection = inspectArtifactFiles(
        {
          pdfPath: result.pdfPath,
          zipPath: result.zipPath,
          sourceHtmlPath: result.htmlPath,
          manifestPath: result.manifestPath,
        },
        'File Box Story Turning Point Card Pack',
      )
      expect(inspection).toEqual([])
      const manifest = JSON.parse(readFileSync(result.manifestPath, 'utf8'))
      expect(Array.isArray(manifest.files)).toBe(false)
      expect(Object.keys(manifest.files)).toEqual(['pdf', 'zip', 'sourceHtml', 'readme', 'assets'])
      expect(manifest.files.pdf.path).toBe('File-Box-Story-Turning-Point-Card-Pack.pdf')
      expect(manifest.files.zip.path).toBe('file-box-story-turning-point-card-pack.zip')
      expect(manifest.files.sourceHtml.path).toBe('source/file-box-story-turning-point-card-pack.html')
      expect(manifest.files.readme.path).toBe('README.txt')
      expect(manifest.files.assets.map((asset) => asset.path)).toEqual(
        source.worldSlugs.map((slug) => `source/assets/${slug}.jpg`),
      )
    } finally {
      rmSync(imageRoot, { recursive: true, force: true })
      rmSync(buildDir, { recursive: true, force: true })
    }
  })
})
