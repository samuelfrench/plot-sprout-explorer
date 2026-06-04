import { describe, expect, it } from 'vitest'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'

import {
  inspectArtifactFiles,
  validateHangingFileStoryDecisionPointCardPackSource,
  validateHangingFileStoryDecisionPointCardPackSourceFiles,
  validateProductWorldSummaries,
} from './product-artifact-policy.mjs'
import {
  buildHangingFileStoryDecisionPointCardPack,
  renderHangingFileStoryDecisionPointCardPackHtml,
} from './hanging-file-story-decision-point-card-pack-builder.mjs'

const root = resolve(import.meta.dirname, '..')
const safety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, and no identifying facts.'

const sourceFiles = [
  'content/product-artifacts/lanes/batch58-hanging-file-decision-point-cards-a.json',
  'content/product-artifacts/lanes/batch58-hanging-file-decision-point-cards-b.json',
  'content/product-artifacts/lanes/batch58-hanging-file-decision-point-cards-c.json',
  'content/product-artifacts/lanes/batch58-hanging-file-decision-point-tools.json',
]

const worldAges = {
  'acorn-avenue-errand-office': '7-9',
  'button-bakery-map-mixup': '7-9',
  'mitten-market-lost-ticket': '7-8',
  'penny-path-compass-shop': '7-9',
  'spoon-ferry-lunchbox-harbor': '7-9',
  'compost-clock-workshop': '8-10',
  'orchard-pulley-post': '8-10',
  'pantry-measurement-mystery': '8-10',
  'pond-bridge-blueprint-club': '8-10',
  'tidepool-timekeepers-lab': '8-10',
  'almost-invention-workshop': '10-11',
  'appendix-archive-lab': '10-11',
  'blue-pencil-observatory': '10-11',
  'clue-label-tower-museum': '10-11',
  'margin-note-market': '10-11',
  'revision-river-ferry': '10-11',
}

const worldSlugs = Object.keys(worldAges)

const extraWorldAges = {
  'binding-day-boardwalk': '10-11',
  'buttonwood-library-train': '7-9',
  'chapter-gate-greenhouse': '10-11',
  'cloudberry-clocktower': '8-10',
  'compass-craft-academy': '10-11',
  'greenhouse-gear-garden': '8-10',
  'index-card-theater-club': '10-11',
  'moon-muffin-market': '6-8',
  'moss-message-observatory': '8-10',
  'paperclip-plaza-parcel-day': '7-9',
  'pocket-park-notice-board': '7-9',
  'rain-boot-route-rangers': '7-9',
  'rain-gauge-railway': '8-10',
  'seed-library-map-room': '8-10',
  'solar-oven-picnic-station': '8-10',
  'sticker-station-mail-cart': '7-9',
  'teacup-town-weather-window': '7-8',
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
      premise: 'A friendly invented world for an adult-led paper hanging-file decision point card.',
    },
  ]),
)

const cardKeys = [
  'id',
  'title',
  'worldSlug',
  'ageBand',
  'decisionSkill',
  'useCase',
  'adultSetup',
  'kidDirection',
  'choicePrompt',
  'pathOnePrompt',
  'pathTwoPrompt',
  'compareCluePrompt',
  'chosenPathPrompt',
  'consequenceNotePrompt',
  'fileLabelPrompt',
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
    53: 'content/product-artifacts/tabbed-folder-story-series-card-pack.json',
    54: 'content/product-artifacts/accordion-folder-story-arc-card-pack.json',
    55: 'content/product-artifacts/expanding-file-story-scene-chain-card-pack.json',
    56: 'content/product-artifacts/manila-folder-story-clue-trail-card-pack.json',
    57: 'content/product-artifacts/pocket-folder-story-goal-path-card-pack.json',
  }
  return readJson(byBatch[batchNumber]).worldSlugs
}

function makeCards() {
  return worldSlugs.map((worldSlug, index) => {
    const number = String(index + 1).padStart(2, '0')
    const title = titleForSlug(worldSlug)
    return {
      id: `hanging-file-decision-point-card-${number}`,
      title: `${title} Story Decision Point Card`,
      worldSlug,
      ageBand: worldAges[worldSlug],
      decisionSkill: `compare two pretend paths, choose one calm path, and label the hanging file for ${title}`,
      useCase: `Adult-led fictional offline paper-only hanging file decision point card for a made-up ${title} page: ____________________.`,
      adultSetup: `Adult sets out one hanging file folder, blank page, pencil, and decision point card for ${title}: ____________________.`,
      kidDirection: `Writer compares two made-up paths on paper and keeps every detail pretend for ${title}: ____________________.`,
      choicePrompt: `Choice: name one pretend choice a character faces in ${title}: ____________________.`,
      pathOnePrompt: `Path one: write the first calm possible path in ${title}: ____________________.`,
      pathTwoPrompt: `Path two: write a different calm possible path in ${title}: ____________________.`,
      compareCluePrompt: `Compare clue: add one paper clue that helps compare the two paths in ${title}: ____________________.`,
      chosenPathPrompt: `Chosen path: circle or write the pretend path the character chooses in ${title}: ____________________.`,
      consequenceNotePrompt: `Consequence note: write one calm made-up result of that choice in ${title}: ____________________.`,
      fileLabelPrompt: `File label: write the broad pretend hanging-file label for this decision point in ${title}: ____________________.`,
      quietOptionLine: `Quiet option: point to one decision blank before writing more for ${title}: ____________________.`,
      takeHomeLine: `Take-home line: restart this paper decision point later with one pretend file label: ____________________.`,
    }
  })
}

function makeTools() {
  return {
    adultGuide: {
      title: 'Hanging File Decision Point Adult Guide',
      bullets: [
        'Set out one hanging file folder, blank pages, pencils, and a paper decision point card before the adult-led start: ____________________.',
        'Choose one made-up world and remind the writer that every choice, path, clue, and result stays invented and paper-only: ____________________.',
        'Move through choice, path one, path two, compare clue, chosen path, consequence note, and file label in order: ____________________.',
        'Keep the adult in charge of the folder while the child writes or dictates short page notes: ____________________.',
        'Use pretend characters, places, and actions only; do not ask for real schedules, rooms, names, or personal facts: ____________________.',
        'Close by reading the file label and choosing one next-page decision point for a later adult-led paper pass: ____________________.',
      ],
    },
    decisionPointRoutines: [
      {
        title: 'Choice Start',
        time: 'short first-page setup',
        materials: 'Hanging file folder, blank page, pencil, and choice card.',
        steps: [
          'The adult opens the hanging file and points to the choice blank: ____________________.',
          'The child chooses one made-up character choice: ____________________.',
          'The adult asks why that pretend choice matters on the page: ____________________.',
          'The child writes or dictates one choice line on paper: ____________________.',
        ],
        adultWrapLine: 'The decision point begins with this pretend choice: ____________________.',
      },
      {
        title: 'Two Path Setup',
        time: 'one-page comparison',
        materials: 'Hanging file folder, current page, two path blanks, and pencil.',
        steps: [
          'The adult points from the choice to the two path blanks: ____________________.',
          'The child names one possible pretend path: ____________________.',
          'The child names a different possible pretend path: ____________________.',
          'The adult repeats both paths before writing continues: ____________________.',
        ],
        adultWrapLine: 'The two paper paths are ready to compare with: ____________________.',
      },
      {
        title: 'Compare Clue Pass',
        time: 'calm clue note',
        materials: 'Hanging file folder, decision card, pencil, and small paper strip.',
        steps: [
          'The adult rereads the choice and both path lines: ____________________.',
          'The child invents one clue that helps compare the paths: ____________________.',
          'The adult asks what the clue changes about the decision point: ____________________.',
          'The child writes the compare clue on a paper strip: ____________________.',
        ],
        adultWrapLine: 'The compare clue points toward: ____________________.',
      },
      {
        title: 'Chosen Path Check',
        time: 'connection check',
        materials: 'Hanging file folder, two path notes, and chosen path blank.',
        steps: [
          'The adult points to both path notes and asks which path the character tries: ____________________.',
          'The child chooses one pretend path for the page: ____________________.',
          'The adult asks how that choice connects back to the first blank: ____________________.',
          'The child writes the chosen path and one page note: ____________________.',
        ],
        adultWrapLine: 'The chosen path now sends the paper decision toward: ____________________.',
      },
      {
        title: 'Consequence Note Loop',
        time: 'continuity finish',
        materials: 'Earlier page, blank page, pencil, and hanging file folder.',
        steps: [
          'The adult reopens the choice, path, clue, and chosen path notes: ____________________.',
          'The child chooses one calm consequence note that shows what changes: ____________________.',
          'The adult asks where the consequence note belongs on the next page: ____________________.',
          'The child writes one consequence note that connects the decision: ____________________.',
        ],
        adultWrapLine: 'The consequence note connects this pretend decision with: ____________________.',
      },
      {
        title: 'File Label Close',
        time: 'paper wrap pass',
        materials: 'Hanging file folder, label slip, page stack, and pencil.',
        steps: [
          'The adult lays the decision point pages beside the hanging file: ____________________.',
          'The child chooses a broad pretend file label for the decision point: ____________________.',
          'The adult reads the label and asks what next-page choice it suggests: ____________________.',
          'The child tucks the file label slip into the hanging file: ____________________.',
        ],
        adultWrapLine: 'The file label closes this decision point with: ____________________.',
      },
    ],
    takeHomeDecisionSlips: [
      'Adult: open the hanging file and ask for one pretend character choice: ____________________.',
      'Child: the choice on my paper decision point is: ____________________.',
      'Adult: point from the choice to the two path blanks: ____________________.',
      'Child: path one could be: ____________________.',
      'Child: path two could be: ____________________.',
      'Adult: ask what clue helps compare both paths: ____________________.',
      'Child: the compare clue can be: ____________________.',
      'Adult: ask which pretend path the character chooses: ____________________.',
      'Child: the consequence note can say: ____________________.',
      'Child: the file label for this pretend decision is: ____________________.',
    ],
    optionalAdultPrompts: [
      'Optional adult-led paper prompt: the character choice in the hanging file is ____________________.',
      'Optional adult-led paper prompt: path one could move the page by ____________________.',
      'Optional adult-led paper prompt: path two could move the page by ____________________.',
      'Optional adult-led paper prompt: the compare clue shows ____________________.',
      'Optional adult-led paper prompt: the chosen path helps because ____________________.',
      'Optional adult-led paper prompt: the consequence note should say ____________________.',
      'Optional adult-led paper prompt: the file label should say ____________________.',
      'Optional adult-led paper prompt: the next page decision could be ____________________.',
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
    batchId: '2026-06-03-batch58',
    generatedAt: '2026-06-03',
    productSlug: 'hanging-file-story-decision-point-card-pack',
    title: 'Hanging File Story Decision Point Card Pack',
    pricePoint: '$89',
    audience: 'Families, homeschool groups, tutors, and adult-led writing tables for writers ages 7-11.',
    sessionLength:
      '16 printable hanging file story decision-point cards plus adult guide tools, decision-point routines, take-home decision slips, and optional adult prompts',
    safetyNote: safety,
    artifact: {
      pdfPath:
        'product-build/hanging-file-story-decision-point-card-pack/Hanging-File-Story-Decision-Point-Card-Pack.pdf',
      zipPath:
        'product-build/hanging-file-story-decision-point-card-pack/hanging-file-story-decision-point-card-pack.zip',
      sourceHtmlPath:
        'product-build/hanging-file-story-decision-point-card-pack/source/hanging-file-story-decision-point-card-pack.html',
      manifestPath: 'product-build/hanging-file-story-decision-point-card-pack/manifest.json',
    },
    sourceFiles: [...sourceFiles],
    worldSlugs: [...worldSlugs],
    cover: {
      kicker: 'Printable hanging file decision point cards',
      headline: 'Hanging File Story Decision Point Card Pack',
      subhead:
        'Sixteen hanging-file cards help writers compare two pretend paths, choose one path, write a consequence note, and add a broad file label.',
      included: [
        '16 printable hanging file decision point cards',
        'Adult setup guide',
        'Fictional decision-point safety notes',
        'Character choice prompts',
        'Two-path comparison prompts',
        'Compare clue prompts',
        'Chosen path prompts',
        'Consequence note prompts',
        'Six adult-led decision-point routines',
        'Ten take-home decision slips',
        'Printable PDF and ZIP artifact',
      ],
    },
    adultGuide: tools.adultGuide,
    decisionPointRoutines: tools.decisionPointRoutines,
    takeHomeDecisionSlips: tools.takeHomeDecisionSlips,
    optionalAdultPrompts: tools.optionalAdultPrompts,
    cards: makeCards(),
    ...overrides,
  }
}

function productForSource(source) {
  return {
    slug: 'hanging-file-story-decision-point-card-pack',
    title: 'Hanging File Story Decision Point Card Pack',
    pricePoint: '$89',
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
  const tempRoot = mkdtempSync(join(tmpdir(), 'hanging-file-decision-point-'))
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
          decisionPointRoutines: source.decisionPointRoutines,
          takeHomeDecisionSlips: source.takeHomeDecisionSlips,
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

describe('Hanging File Story Decision Point Card Pack policy', () => {
  it('defines the Batch58 validator and builder contract', () => {
    expect(validateHangingFileStoryDecisionPointCardPackSource).toBeTypeOf('function')
    expect(validateHangingFileStoryDecisionPointCardPackSourceFiles).toBeTypeOf('function')
    expect(renderHangingFileStoryDecisionPointCardPackHtml).toBeTypeOf('function')
    expect(buildHangingFileStoryDecisionPointCardPack).toBeTypeOf('function')
  })

  it('accepts a valid source with exact Batch58 product alignment', () => {
    const source = validSource()
    const product = productForSource(source)

    expect(validateHangingFileStoryDecisionPointCardPackSource(source, product, knownWorldAges)).toEqual([])
    expect(validateProductWorldSummaries(product, 'Hanging File Story Decision Point Card Pack')).toEqual([])
  })

  it('keeps the exact Batch58 source schema, world order, age bands, and card field order', () => {
    const source = validSource()

    expect(source.sourceFiles).toEqual(sourceFiles)
    expect(source.worldSlugs).toEqual(worldSlugs)
    expect(source.cards.map((entry) => [entry.id, entry.worldSlug, entry.ageBand])).toEqual(
      worldSlugs.map((slug, index) => [
        `hanging-file-decision-point-card-${String(index + 1).padStart(2, '0')}`,
        slug,
        worldAges[slug],
      ]),
    )
    for (const card of source.cards) expect(Object.keys(card)).toEqual(cardKeys)
    expect(source.adultGuide.bullets).toHaveLength(6)
    expect(source.decisionPointRoutines).toHaveLength(6)
    expect(source.decisionPointRoutines.every((routine) => routine.steps.length === 4)).toBe(true)
    expect(source.takeHomeDecisionSlips).toHaveLength(10)
    expect(source.optionalAdultPrompts).toHaveLength(8)
  })

  it('documents exact overlap guards against existing Batch53 through Batch57 source files', () => {
    for (const batchNumber of [53, 54, 55, 56, 57]) {
      expect(worldSlugs.filter((slug) => batchWorldSlugs(batchNumber).includes(slug))).toHaveLength(7)
    }
  })

  it('rejects changed Batch53, Batch54, Batch55, Batch56, and Batch57 overlap counts', () => {
    for (const batchNumber of [53, 54, 55, 56, 57]) {
      const source = withWorldReplacement(validSource(), batchNumber)
      expect(
        validateHangingFileStoryDecisionPointCardPackSource(source, productForSource(source), knownWorldAges).join('\n'),
      ).toMatch(new RegExp(`overlap exactly 7 Batch ${batchNumber} worlds`))
    }
  })

  it('keeps exact Batch58 artifact paths and rejects copied prior-pack artifact paths', () => {
    const source = validSource()
    expect(source.artifact).toEqual({
      pdfPath:
        'product-build/hanging-file-story-decision-point-card-pack/Hanging-File-Story-Decision-Point-Card-Pack.pdf',
      zipPath:
        'product-build/hanging-file-story-decision-point-card-pack/hanging-file-story-decision-point-card-pack.zip',
      sourceHtmlPath:
        'product-build/hanging-file-story-decision-point-card-pack/source/hanging-file-story-decision-point-card-pack.html',
      manifestPath: 'product-build/hanging-file-story-decision-point-card-pack/manifest.json',
    })

    source.artifact.pdfPath =
      'product-build/pocket-folder-story-goal-path-card-pack/Pocket-Folder-Story-Goal-Path-Card-Pack.pdf'
    expect(
      validateHangingFileStoryDecisionPointCardPackSource(source, productForSource(source), knownWorldAges),
    ).toContain(
      'Hanging File Story Decision Point Card Pack artifact.pdfPath must be product-build/hanging-file-story-decision-point-card-pack/Hanging-File-Story-Decision-Point-Card-Pack.pdf.',
    )
  })

  it('rejects a decision-point prompt field without a writable blank', () => {
    const source = validSource()
    source.cards[0].consequenceNotePrompt = 'Consequence note: write one calm made-up result of that choice.'

    expect(
      validateHangingFileStoryDecisionPointCardPackSource(source, productForSource(source), knownWorldAges),
    ).toContain('cards[0].consequenceNotePrompt must include a writable blank.')
  })

  it('rejects unsafe decision-point source language including standalone public, address, food, and pressure terms', () => {
    const cases = [
      ['public', (source) => (source.cards[0].quietOptionLine = 'Quiet option: public note goes here: ____________________.')],
      ['address', (source) => (source.cards[1].pathOnePrompt = 'Path one: write an address on the page: ____________________.')],
      ['food', (source) => (source.cards[2].consequenceNotePrompt = 'Consequence note: food note returns later: ____________________.')],
      ['publish', (source) => (source.cards[3].fileLabelPrompt = 'File label: publish the finished path: ____________________.')],
      ['showcase', (source) => (source.cards[4].takeHomeLine = 'Take-home line: save this for a showcase: ____________________.')],
      ['portfolio', (source) => (source.cards[5].compareCluePrompt = 'Compare clue: place this in a portfolio: ____________________.')],
      ['display', (source) => (source.cards[6].pathTwoPrompt = 'Path two: prepare this for display: ____________________.')],
      ['perfect', (source) => (source.cards[7].kidDirection = 'Writer makes the decision point perfect before stopping: ____________________.')],
      ['rubric', (source) => (source.decisionPointRoutines[0].steps[0] = 'The adult opens the rubric before the file: ____________________.')],
      ['assessment', (source) => (source.adultGuide.bullets[0] = 'Use this assessment to check the first file label: ____________________.')],
      ['episode', (source) => (source.cards[8].fileLabelPrompt = 'File label: name the next episode: ____________________.')],
      ['chapter book', (source) => (source.cards[9].takeHomeLine = 'Take-home line: turn this into a chapter book: ____________________.')],
      ['screenplay', (source) => (source.cards[10].pathOnePrompt = 'Path one: change this into a screenplay: ____________________.')],
      ['choose your own adventure', (source) => (source.cover.subhead = 'A choose your own adventure draft system.')],
      ['publishable', (source) => (source.cover.included[0] = 'Publishable decision point pages')],
      ['upload', (source) => (source.cards[11].kidDirection = 'Writer: upload the decision point after writing: ____________________.')],
      ['recording', (source) => (source.cards[12].adultSetup = 'Adult starts a recording before the paper pass: ____________________.')],
      ['voice memo', (source) => (source.cards[13].choicePrompt = 'Choice: make a voice memo about the pretend character: ____________________.')],
      ['timer', (source) => (source.decisionPointRoutines[1].steps[0] = 'The adult starts a timer before opening the file: ____________________.')],
      ['score', (source) => (source.takeHomeDecisionSlips[0] = 'Adult: add a score to the hanging file: ____________________.')],
      ['private child profile', (source) => (source.adultGuide.bullets[1] = 'Attach a private child profile to the first file label: ____________________.')],
      ['election', (source) => (source.cards[14].choicePrompt = 'Choice: write how the helper wants to win an election: ____________________.')],
      ['prayer', (source) => (source.cards[15].consequenceNotePrompt = 'Consequence note: add a prayer to close the page: ____________________.')],
      ['bet', (source) => (source.decisionPointRoutines[2].adultWrapLine = 'The compare clue includes a bet about the paper decision point: ____________________.')],
      ['Pokemon', (source) => (source.cards[0].kidDirection = 'Writer: make the helper a Pokemon character on paper: ____________________.')],
      ['school name', (source) => (source.cards[1].adultSetup = 'Adult: write the real school name before the decision point starts: ____________________.')],
      ['home address', (source) => (source.cards[2].fileLabelPrompt = 'File label: include the home address on the file: ____________________.')],
      ['teacher name', (source) => (source.cards[3].takeHomeLine = 'Take-home line: add the teacher name to the path: ____________________.')],
      ['camera', (source) => (source.cards[4].pathTwoPrompt = 'Path two: turn on the camera before writing: ____________________.')],
      ['photo', (source) => (source.cards[5].compareCluePrompt = 'Compare clue: attach a photo to the decision point: ____________________.')],
      ['audio', (source) => (source.cards[6].quietOptionLine = 'Quiet option: save an audio clip first: ____________________.')],
      ['video', (source) => (source.cards[7].choicePrompt = 'Choice: make a video about the pretend choice: ____________________.')],
      ['allergy', (source) => (source.takeHomeDecisionSlips[1] = 'Child: write allergy advice on the paper path: ____________________.')],
      ['medical', (source) => (source.optionalAdultPrompts[1] = 'Optional adult-led paper prompt: add medical advice before path one: ____________________.')],
      ['diary', (source) => (source.cards[8].consequenceNotePrompt = 'Consequence note: copy this into a private diary: ____________________.')],
      ['student profile', (source) => (source.adultGuide.bullets[2] = 'Add this page to the student profile after the file label: ____________________.')],
      ['personal disclosure', (source) => (source.cards[9].kidDirection = 'Writer: add a personal disclosure before inventing the helper: ____________________.')],
      ['provider', (source) => (source.cover.subhead = 'Use this provider handoff after the decision point is complete.')],
      ['payment', (source) => (source.sessionLength = '16 printable cards with payment setup notes for adults.')],
      ['checkout', (source) => (source.cover.included[0] = 'Checkout-ready hanging file card file')],
      ['Stripe', (source) => (source.cover.included[1] = 'Stripe setup note for the product page')],
    ]

    for (const [term, mutate] of cases) {
      const source = validSource()
      mutate(source)
      expect(
        validateHangingFileStoryDecisionPointCardPackSource(source, productForSource(source), knownWorldAges).join('\n'),
      ).toMatch(new RegExp(term, 'i'))
    }
  })

  it('renders all decision-point fields into printable HTML', () => {
    const source = validSource()
    const imageMap = new Map(source.worldSlugs.map((slug) => [slug, `assets/${slug}.jpg`]))
    const html = renderHangingFileStoryDecisionPointCardPackHtml(source, worlds, imageMap)

    expect(html).toContain('Hanging File Story Decision Point Card Pack')
    expect(html).toContain('Choice')
    expect(html).toContain('Path one')
    expect(html).toContain('Path two')
    expect(html).toContain('Compare clue')
    expect(html).toContain('Chosen path')
    expect(html).toContain('Consequence note')
    expect(html).toContain('File label')
    expect(html).toContain('assets/pond-bridge-blueprint-club.jpg')
    expect(html).not.toMatch(/goal path|clue-trail|scene-chain|story-arc|portfolio/i)
  })

  it('requires a local card-world image before building artifacts', async () => {
    const source = validSource()
    const { root: imageRoot, worlds: tempWorlds } = tempWorldsAndImages(source, {
      omitWorldImage: 'pond-bridge-blueprint-club',
    })
    const buildDir = mkdtempSync(join(tmpdir(), 'hanging-file-decision-build-'))

    try {
      await expect(
        buildHangingFileStoryDecisionPointCardPack({
          source,
          worlds: tempWorlds,
          outputDir: buildDir,
          imageRoot,
          pdfRenderer: async () => fakePdf(21),
        }),
      ).rejects.toThrow('Missing Hanging File Story Decision Point Card Pack source image for pond-bridge-blueprint-club')
    } finally {
      rmSync(imageRoot, { recursive: true, force: true })
      rmSync(buildDir, { recursive: true, force: true })
    }
  })

  it('validates exact source lane files and rejects lane range drift', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'hanging-file-decision-lanes-'))
    const source = validSource()

    try {
      writeLaneFiles(tempRoot, source)
      expect(validateHangingFileStoryDecisionPointCardPackSourceFiles(source, tempRoot)).toEqual([])

      rmSync(tempRoot, { recursive: true, force: true })
      const badRoot = mkdtempSync(join(tmpdir(), 'hanging-file-decision-bad-lanes-'))
      const badSource = validSource()
      badSource.cards[6] = { ...badSource.cards[6], id: 'hanging-file-decision-point-card-12' }
      writeLaneFiles(badRoot, badSource)
      expect(validateHangingFileStoryDecisionPointCardPackSourceFiles(badSource, badRoot).join('\n')).toMatch(
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
    const buildDir = mkdtempSync(join(tmpdir(), 'hanging-file-decision-build-'))

    try {
      const result = await buildHangingFileStoryDecisionPointCardPack({
        source,
        worlds: tempWorlds,
        outputDir: buildDir,
        imageRoot,
        pdfRenderer: async () => fakePdf(21),
      })

      expect(existsSync(result.pdfPath)).toBe(true)
      expect(existsSync(result.zipPath)).toBe(true)
      expect(existsSync(result.htmlPath)).toBe(true)
      expect(existsSync(result.manifestPath)).toBe(true)
      expect(readFileSync(result.htmlPath, 'utf8')).toContain('Hanging File Story Decision Point Card Pack')

      const inspection = inspectArtifactFiles(
        {
          pdfPath: result.pdfPath,
          zipPath: result.zipPath,
          sourceHtmlPath: result.htmlPath,
          manifestPath: result.manifestPath,
        },
        'Hanging File Story Decision Point Card Pack',
      )
      expect(inspection).toEqual([])
      const manifest = JSON.parse(readFileSync(result.manifestPath, 'utf8'))
      expect(manifest.files.map((file) => file.path)).toEqual([
        'Hanging-File-Story-Decision-Point-Card-Pack.pdf',
        'README.txt',
        'source/hanging-file-story-decision-point-card-pack.html',
        ...source.worldSlugs.map((slug) => `source/assets/${slug}.jpg`),
      ])
    } finally {
      rmSync(imageRoot, { recursive: true, force: true })
      rmSync(buildDir, { recursive: true, force: true })
    }
  })
})
