import { describe, expect, it } from 'vitest'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'

import {
  inspectArtifactFiles,
  validateProductWorldSummaries,
  validateManilaFolderStoryClueTrailCardPackSource,
  validateManilaFolderStoryClueTrailCardPackSourceFiles,
} from './product-artifact-policy.mjs'
import {
  buildManilaFolderStoryClueTrailCardPack,
  renderManilaFolderStoryClueTrailCardPackHtml,
} from './manila-folder-story-clue-trail-card-pack-builder.mjs'

const root = resolve(import.meta.dirname, '..')
const safety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, and no identifying facts.'

const sourceFiles = [
  'content/product-artifacts/lanes/batch56-manila-folder-clue-trail-cards-a.json',
  'content/product-artifacts/lanes/batch56-manila-folder-clue-trail-cards-b.json',
  'content/product-artifacts/lanes/batch56-manila-folder-clue-trail-cards-c.json',
  'content/product-artifacts/lanes/batch56-manila-folder-clue-trail-tools.json',
]

const worldAges = {
  'teacup-town-weather-window': '7-8',
  'spoon-ferry-lunchbox-harbor': '7-9',
  'sticker-station-mail-cart': '7-9',
  'chapter-gate-greenhouse': '10-11',
  'paperclip-plaza-parcel-day': '7-9',
  'orchard-pulley-post': '8-10',
  'appendix-archive-lab': '10-11',
  'penny-path-compass-shop': '7-9',
  'pantry-measurement-mystery': '8-10',
  'blue-pencil-observatory': '10-11',
  'rain-gauge-railway': '8-10',
  'binding-day-boardwalk': '10-11',
  'seed-library-map-room': '8-10',
  'mitten-market-lost-ticket': '7-8',
  'cloudberry-clocktower': '8-10',
  'rain-boot-route-rangers': '7-9',
}

const worldSlugs = Object.keys(worldAges)

const extraWorldAges = {
  'acorn-avenue-errand-office': '7-9',
  'button-bakery-map-mixup': '7-9',
  'pocket-park-notice-board': '7-9',
  'solar-oven-picnic-station': '8-10',
  'moss-message-observatory': '8-10',
  'pond-bridge-blueprint-club': '8-10',
  'revision-river-ferry': '10-11',
  'margin-note-market': '10-11',
  'almost-invention-workshop': '10-11',
  'compass-craft-academy': '10-11',
  'tidepool-timekeepers-lab': '8-10',
  'compost-clock-workshop': '8-10',
  'greenhouse-gear-garden': '8-10',
  'tiny-lantern-reef': '8-10',
  'index-card-theater-club': '10-11',
  'buttonwood-library-train': '7-9',
  'moon-muffin-market': '6-8',
  'clue-label-tower-museum': '10-11',
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
      premise: 'A friendly invented world for an adult-led paper manila-folder clue trail card.',
    },
  ]),
)

const cardKeys = [
  'id',
  'title',
  'worldSlug',
  'ageBand',
  'clueSkill',
  'useCase',
  'adultSetup',
  'kidDirection',
  'firstCluePrompt',
  'nextCluePrompt',
  'turningCluePrompt',
  'mismatchPrompt',
  'returnCluePrompt',
  'folderLabelPrompt',
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
    51: 'content/product-artifacts/composition-notebook-story-draft-checklist-card-pack.json',
    52: 'content/product-artifacts/spiral-notebook-story-final-copy-card-pack.json',
    53: 'content/product-artifacts/tabbed-folder-story-series-card-pack.json',
    54: 'content/product-artifacts/accordion-folder-story-arc-card-pack.json',
    55: 'content/product-artifacts/expanding-file-story-scene-chain-card-pack.json',
  }
  return readJson(byBatch[batchNumber]).worldSlugs
}

function makeCards() {
  return worldSlugs.map((worldSlug, index) => {
    const number = String(index + 1).padStart(2, '0')
    const title = titleForSlug(worldSlug)
    return {
      id: `manila-folder-clue-trail-card-${number}`,
      title: `${title} Story Clue Trail Card`,
      worldSlug,
      ageBand: worldAges[worldSlug],
      clueSkill: `connect the first clue, next clue, turning clue, mismatch clue, return clue, and folder label for ${title}`,
      useCase: `Adult-led fictional offline paper-only manila folder clue trail card for a made-up ${title} page: ____________________.`,
      adultSetup: `Adult sets out one manila folder, blank page, pencil, and clue trail card for ${title}: ____________________.`,
      kidDirection: `Writer follows the clue trail on paper and keeps every detail made up for ${title}: ____________________.`,
      firstCluePrompt: `First clue: choose one pretend object, place hint, or small action in ${title}: ____________________.`,
      nextCluePrompt: `Next clue: add the paper clue that follows the first clue in ${title}: ____________________.`,
      turningCluePrompt: `Turning clue: invent the calm page moment that changes what the clue means in ${title}: ____________________.`,
      mismatchPrompt: `Mismatch clue: name one pretend clue that almost fits but needs a new page note in ${title}: ____________________.`,
      returnCluePrompt: `Return clue: bring back one earlier clue so the page feels connected in ${title}: ____________________.`,
      folderLabelPrompt: `Folder label: write the broad pretend label for this manila folder clue trail in ${title}: ____________________.`,
      quietOptionLine: `Quiet option: point to one clue trail blank before writing more for ${title}: ____________________.`,
      takeHomeLine: `Take-home line: restart this paper clue trail later with one pretend folder label: ____________________.`,
    }
  })
}

function makeTools() {
  return {
    adultGuide: {
      title: 'Manila Folder Clue Trail Adult Guide',
      bullets: [
        'Set out one manila folder, blank pages, pencils, and a paper clue trail card before the adult-led start: ____________________.',
        'Choose one made-up world and remind the writer that every clue stays invented, broad, and paper-only: ____________________.',
        'Move through first clue, next clue, turning clue, mismatch clue, return clue, and folder label in order: ____________________.',
        'Keep the adult in charge of the folder while the child writes or dictates short page notes: ____________________.',
        'Use pretend objects, places, and actions only; do not ask for real schedules, rooms, names, or personal facts: ____________________.',
        'Close by reading the folder label and choosing one next-page clue for a later adult-led paper pass: ____________________.',
      ],
    },
    clueTrailRoutines: [
      {
        title: 'First Clue Folder Start',
        time: 'short first-page setup',
        materials: 'Manila folder, blank page, pencil, and first-clue card.',
        steps: [
          'The adult opens the manila folder and points to the first clue blank: ____________________.',
          'The child chooses one made-up object, place hint, or action: ____________________.',
          'The adult asks how that clue starts the pretend page: ____________________.',
          'The child writes or dictates one first clue line on paper: ____________________.',
        ],
        adultWrapLine: 'The clue trail begins with this pretend first clue: ____________________.',
      },
      {
        title: 'Next Clue Step',
        time: 'one-page continuation',
        materials: 'Manila folder, current page, next blank page, and pencil.',
        steps: [
          'The adult points from the first clue to the next clue blank: ____________________.',
          'The child chooses one clue that follows on paper: ____________________.',
          'The adult asks what should stay connected from the first clue: ____________________.',
          'The child writes one next clue line on the page: ____________________.',
        ],
        adultWrapLine: 'The next clue follows because: ____________________.',
      },
      {
        title: 'Turning Clue Pass',
        time: 'gentle clue turn',
        materials: 'Manila folder, clue card, pencil, and small paper strip.',
        steps: [
          'The adult rereads the first two paper clues: ____________________.',
          'The child invents one calm turn that changes the clue trail: ____________________.',
          'The adult asks what the page should notice after the turn: ____________________.',
          'The child writes the turning clue on a paper strip: ____________________.',
        ],
        adultWrapLine: 'The turning clue changes the paper trail with: ____________________.',
      },
      {
        title: 'Mismatch Check',
        time: 'connection check',
        materials: 'Manila folder, two clue notes, and mismatch blank.',
        steps: [
          'The adult points to one clue that almost fits the page: ____________________.',
          'The child names what feels mismatched in the pretend trail: ____________________.',
          'The adult asks how a new paper clue could fix the connection: ____________________.',
          'The child writes the mismatch clue and one repair idea: ____________________.',
        ],
        adultWrapLine: 'The mismatch clue now needs this paper fix: ____________________.',
      },
      {
        title: 'Return Clue Loop',
        time: 'continuity return',
        materials: 'Earlier page, blank page, pencil, and manila folder.',
        steps: [
          'The adult reopens one earlier clue from the folder: ____________________.',
          'The child chooses a pretend clue to bring back: ____________________.',
          'The adult asks where the returning clue belongs on the next page: ____________________.',
          'The child writes one return clue line that connects the trail: ____________________.',
        ],
        adultWrapLine: 'The return clue brings back this pretend piece: ____________________.',
      },
      {
        title: 'Folder Label Close',
        time: 'paper wrap pass',
        materials: 'Manila folder, folder label slip, page stack, and pencil.',
        steps: [
          'The adult lays the clue trail pages beside the manila folder: ____________________.',
          'The child chooses a broad pretend folder label for the trail: ____________________.',
          'The adult reads the label and asks what next-page clue it suggests: ____________________.',
          'The child tucks the folder label slip into the manila folder: ____________________.',
        ],
        adultWrapLine: 'The folder label closes this clue trail with: ____________________.',
      },
    ],
    takeHomeClueSlips: [
      'Adult: open the manila folder and ask for one pretend first clue: ____________________.',
      'Child: the first clue on my paper trail is: ____________________.',
      'Adult: point from the first clue to the next clue blank: ____________________.',
      'Child: the next clue should show: ____________________.',
      'Adult: ask what calm turning clue changes the page: ____________________.',
      'Child: my turning clue says: ____________________.',
      'Adult: ask which clue almost fits but needs a repair note: ____________________.',
      'Child: the mismatch clue can be fixed by: ____________________.',
      'Adult: reread one earlier clue and ask what can return: ____________________.',
      'Child: the folder label for this pretend trail is: ____________________.',
    ],
    optionalAdultPrompts: [
      'Optional adult-led paper prompt: the first clue in the manila folder is ____________________.',
      'Optional adult-led paper prompt: the next clue follows because ____________________.',
      'Optional adult-led paper prompt: the turning clue changes the page when ____________________.',
      'Optional adult-led paper prompt: the mismatch clue needs this repair ____________________.',
      'Optional adult-led paper prompt: the return clue brings back ____________________.',
      'Optional adult-led paper prompt: the folder label should say ____________________.',
      'Optional adult-led paper prompt: the next page clue could be ____________________.',
      'Optional adult-led paper prompt: the clue trail closes with ____________________.',
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
    'Manila-Folder-Story-Clue-Trail-Card-Pack.pdf',
    'README.txt',
    'source/manila-folder-story-clue-trail-card-pack.html',
    ...source.worldSlugs.map((slug) => `source/assets/${slug}.jpg`),
  ]
}

function validSource(overrides = {}) {
  const tools = makeTools()
  return {
    batchId: '2026-06-03-batch56',
    generatedAt: '2026-06-03',
    productSlug: 'manila-folder-story-clue-trail-card-pack',
    title: 'Manila Folder Story Clue Trail Card Pack',
    pricePoint: '$85',
    audience: 'Families, homeschool groups, tutors, and adult-led writing tables for writers ages 7-11.',
    sessionLength:
      '16 printable manila folder story clue-trail cards plus adult guide tools, clue-trail routines, take-home clue slips, and optional adult prompts',
    safetyNote: safety,
    artifact: {
      pdfPath:
        'product-build/manila-folder-story-clue-trail-card-pack/Manila-Folder-Story-Clue-Trail-Card-Pack.pdf',
      zipPath:
        'product-build/manila-folder-story-clue-trail-card-pack/manila-folder-story-clue-trail-card-pack.zip',
      sourceHtmlPath:
        'product-build/manila-folder-story-clue-trail-card-pack/source/manila-folder-story-clue-trail-card-pack.html',
      manifestPath: 'product-build/manila-folder-story-clue-trail-card-pack/manifest.json',
    },
    sourceFiles: [...sourceFiles],
    worldSlugs: [...worldSlugs],
    cover: {
      kicker: 'Printable manila folder clue trail cards',
      headline: 'Manila Folder Story Clue Trail Card Pack',
      subhead:
        'Sixteen manila folder cards help writers connect a first clue, next clue, turning clue, mismatch, return clue, and broad folder label note.',
      included: [
        '16 printable manila folder clue trail cards',
        'Adult setup guide',
        'Fictional clue-trail safety notes',
        'First clue prompts',
        'Next clue prompts',
        'Turning clue prompts',
        'Mismatch and return clue prompts',
        'Six adult-led clue-trail routines',
        'Ten take-home clue slips',
        'Printable PDF and ZIP artifact',
      ],
    },
    adultGuide: tools.adultGuide,
    clueTrailRoutines: tools.clueTrailRoutines,
    takeHomeClueSlips: tools.takeHomeClueSlips,
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
    slug: 'manila-folder-story-clue-trail-card-pack',
    title: 'Manila Folder Story Clue Trail Card Pack',
    pricePoint: '$85',
    status: 'checkout_pending',
    worldSlugs: source.worldSlugs,
    worldSummaries: source.worldSlugs.map((slug) => ({
      slug,
      summary: `A linked fictional world summary for ${slug}.`,
    })),
  }
}

function tempWorldsAndImages(source, { omitWorldImage = null } = {}) {
  const tempRoot = mkdtempSync(join(tmpdir(), 'manila-folder-clue-trail-'))
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
          clueTrailRoutines: source.clueTrailRoutines,
          takeHomeClueSlips: source.takeHomeClueSlips,
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

describe('Manila Folder Story Clue Trail Card Pack policy', () => {
  it('defines the Batch56 validator and builder contract', () => {
    expect(validateManilaFolderStoryClueTrailCardPackSource).toBeTypeOf('function')
    expect(validateManilaFolderStoryClueTrailCardPackSourceFiles).toBeTypeOf('function')
    expect(renderManilaFolderStoryClueTrailCardPackHtml).toBeTypeOf('function')
    expect(buildManilaFolderStoryClueTrailCardPack).toBeTypeOf('function')
  })

  it('accepts a valid source with exact Batch56 product alignment', () => {
    const source = validSource()
    const product = productForSource(source)

    expect(validateManilaFolderStoryClueTrailCardPackSource(source, product, knownWorldAges)).toEqual([])
    expect(validateProductWorldSummaries(product, 'Manila Folder Story Clue Trail Card Pack')).toEqual([])
  })

  it('keeps the exact Batch56 source schema, world order, age bands, and card field order', () => {
    const source = validSource()

    expect(source.sourceFiles).toEqual(sourceFiles)
    expect(source.worldSlugs).toEqual(worldSlugs)
    expect(source.cards.map((entry) => [entry.id, entry.worldSlug, entry.ageBand])).toEqual(
      worldSlugs.map((slug, index) => [
        `manila-folder-clue-trail-card-${String(index + 1).padStart(2, '0')}`,
        slug,
        worldAges[slug],
      ]),
    )
    for (const card of source.cards) expect(Object.keys(card)).toEqual(cardKeys)
    expect(source.adultGuide.bullets).toHaveLength(6)
    expect(source.clueTrailRoutines).toHaveLength(6)
    expect(source.clueTrailRoutines.every((routine) => routine.steps.length === 4)).toBe(true)
    expect(source.takeHomeClueSlips).toHaveLength(10)
    expect(source.optionalAdultPrompts).toHaveLength(8)
  })

  it('documents exact overlap guards against existing Batch51 through Batch55 source files', () => {
    for (const batchNumber of [51, 52, 53, 54, 55]) {
      expect(worldSlugs.filter((slug) => batchWorldSlugs(batchNumber).includes(slug))).toHaveLength(7)
    }
  })

  it('rejects changed Batch51, Batch52, Batch53, Batch54, and Batch55 overlap counts', () => {
    for (const batchNumber of [51, 52, 53, 54, 55]) {
      const source = withWorldReplacement(validSource(), batchNumber)
      expect(
        validateManilaFolderStoryClueTrailCardPackSource(source, productForSource(source), knownWorldAges).join('\n'),
      ).toMatch(new RegExp(`overlap exactly 7 Batch ${batchNumber} worlds`))
    }
  })

  it('rejects a clue-trail prompt field without a writable blank', () => {
    const source = validSource()
    source.cards[0].returnCluePrompt = 'Return clue: bring back the first paper hint.'

    expect(validateManilaFolderStoryClueTrailCardPackSource(source, productForSource(source), knownWorldAges)).toContain(
      'cards[0].returnCluePrompt must include a writable blank.',
    )
  })

  it('rejects unsafe clue-trail source language including standalone public, address, food, and publishing pressure', () => {
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
          source.cards[1].nextCluePrompt = 'Next clue: write an address on the page: ____________________.'
        },
      },
      {
        term: 'food',
        mutate(source) {
          source.cards[2].returnCluePrompt = 'Return clue: food note returns later: ____________________.'
        },
      },
      {
        term: 'episode',
        mutate(source) {
          source.cards[3].folderLabelPrompt = 'Folder label: name the next episode: ____________________.'
        },
      },
      {
        term: 'chapter book',
        mutate(source) {
          source.cards[4].takeHomeLine = 'Take-home line: turn this into a chapter book: ____________________.'
        },
      },
      {
        term: 'screenplay',
        mutate(source) {
          source.cards[5].mismatchPrompt = 'Mismatch clue: change this into a screenplay: ____________________.'
        },
      },
      {
        term: 'upload',
        mutate(source) {
          source.cards[6].kidDirection = 'Writer: upload the clue trail after writing: ____________________.'
        },
      },
      {
        term: 'timer',
        mutate(source) {
          source.clueTrailRoutines[0].steps[0] = 'The adult starts a timer before opening the file: ____________________.'
        },
      },
      {
        term: 'private child profile',
        mutate(source) {
          source.adultGuide.bullets[0] = 'Attach a private child profile to the first folder label: ____________________.'
        },
      },
    ]

    for (const { term, mutate } of cases) {
      const source = validSource()
      mutate(source)
      expect(
        validateManilaFolderStoryClueTrailCardPackSource(source, productForSource(source), knownWorldAges).join('\n'),
      ).toMatch(new RegExp(term, 'i'))
    }
  })

  it('renders all clue-trail fields into printable HTML', () => {
    const source = validSource()
    const imageMap = new Map(source.worldSlugs.map((slug) => [slug, `assets/${slug}.jpg`]))
    const html = renderManilaFolderStoryClueTrailCardPackHtml(source, worlds, imageMap)

    expect(html).toContain('Manila Folder Story Clue Trail Card Pack')
    expect(html).toContain('First clue')
    expect(html).toContain('Next clue')
    expect(html).toContain('Turning clue')
    expect(html).toContain('Mismatch clue')
    expect(html).toContain('Return clue')
    expect(html).toContain('Folder label')
    expect(html).toContain('assets/paperclip-plaza-parcel-day.jpg')
    expect(html).not.toMatch(/scene-chain|story-arc|portfolio/i)
  })

  it('requires a local card-world image before building artifacts', async () => {
    const source = validSource()
    const missingSlug = 'cloudberry-clocktower'
    const { root: tempRoot, worlds: tempWorlds } = tempWorldsAndImages(source, { omitWorldImage: missingSlug })
    const imageSources = new Map(
      source.worldSlugs
        .filter((slug) => slug !== missingSlug)
        .map((slug) => [slug, resolve(tempRoot, `${slug}.jpg`)]),
    )

    try {
      await expect(
        buildManilaFolderStoryClueTrailCardPack({
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
    const targetBuildDir = resolve(tempRoot, 'product-build', 'manila-folder-story-clue-trail-card-pack')

    try {
      const output = await buildManilaFolderStoryClueTrailCardPack({
        source,
        product: productForSource(source),
        worlds: tempWorlds,
        imageSources,
        buildDir: targetBuildDir,
        recordRoot: tempRoot,
        writePdf: async ({ pdfPath }) => writeFileSync(pdfPath, fakePdf(21)),
      })
      const htmlPath = join(targetBuildDir, 'source', 'manila-folder-story-clue-trail-card-pack.html')
      const pdfPath = join(targetBuildDir, 'Manila-Folder-Story-Clue-Trail-Card-Pack.pdf')
      const zipPath = join(targetBuildDir, 'manila-folder-story-clue-trail-card-pack.zip')
      const manifestPath = join(targetBuildDir, 'manifest.json')
      const readmePath = join(targetBuildDir, 'README.txt')

      expect(existsSync(htmlPath)).toBe(true)
      expect(existsSync(pdfPath)).toBe(true)
      expect(existsSync(zipPath)).toBe(true)
      expect(existsSync(manifestPath)).toBe(true)
      expect(readFileSync(readmePath, 'utf8')).not.toMatch(/\b(provider|public|real child)\b/i)
      expect(output.source.productSlug).toBe('manila-folder-story-clue-trail-card-pack')
      expect(output.manifest.productSlug).toBe('manila-folder-story-clue-trail-card-pack')
      expect(output.manifest.files.pdf.sha256).toBe(sha256(pdfPath))
      expect(output.manifest.files.zip.sha256).toBe(sha256(zipPath))
      expect(output.manifest.files.assets).toHaveLength(16)

      const secondOutput = await buildManilaFolderStoryClueTrailCardPack({
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

  it('validates exact lane source files reproduce clue-trail cards and tools', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-manila-folder-source-'))
    const source = validSource()

    try {
      writeLaneFiles(tempRoot, source)
      expect(validateManilaFolderStoryClueTrailCardPackSourceFiles(source, tempRoot)).toEqual([])
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('rejects copied source files that point at the wrong Batch56 lanes', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-manila-folder-source-path-'))
    const source = validSource()

    try {
      source.sourceFiles[0] = 'content/product-artifacts/lanes/copied-manila-folder-clue-trail-cards-a.json'
      writeLaneFiles(tempRoot, source)
      expect(validateManilaFolderStoryClueTrailCardPackSourceFiles(source, tempRoot)).toContain(
        'sourceFiles must list the exact Batch 56 clue-trail-card lane and tools files.',
      )
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('rejects a card placed in the wrong clue-trail lane range', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-manila-folder-lane-range-'))
    const source = validSource()

    try {
      writeLaneFiles(tempRoot, source)
      const laneAPath = resolve(
        tempRoot,
        'content/product-artifacts/lanes/batch56-manila-folder-clue-trail-cards-a.json',
      )
      const laneBPath = resolve(
        tempRoot,
        'content/product-artifacts/lanes/batch56-manila-folder-clue-trail-cards-b.json',
      )
      const laneA = JSON.parse(readFileSync(laneAPath, 'utf8'))
      const laneB = JSON.parse(readFileSync(laneBPath, 'utf8'))
      laneA.cards.push(laneB.cards[0])
      writeFileSync(laneAPath, `${JSON.stringify(laneA, null, 2)}\n`)

      expect(validateManilaFolderStoryClueTrailCardPackSourceFiles(source, tempRoot)).toContain(
        'content/product-artifacts/lanes/batch56-manila-folder-clue-trail-cards-a.json must contain only cards 01-06.',
      )
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('will be listed as a checkout-pending product after catalog integration', () => {
    const products = readJson('content/products/batch5-products.json').products
    const productRecord = products.find((candidate) => candidate.slug === 'manila-folder-story-clue-trail-card-pack')

    expect(productRecord).toMatchObject({
      title: 'Manila Folder Story Clue Trail Card Pack',
      pricePoint: '$85',
      status: 'checkout_pending',
      heroImage: 'images/plotsprout/batch56/manila-folder-story-clue-trail-card-pack.jpg',
    })
    expect(productRecord.ctaHref).toMatch(/^mailto:/)
    expect(`${productRecord.checkoutNote}\n${productRecord.safetyNote}`).not.toMatch(
      /\b(provider|payment|public|real child)\b/i,
    )
  })

  it('defines one local-only Batch56 product hero image manifest entry', () => {
    const imageManifest = readJson('content/image-queue/2026-06-03-batch56-images.json')

    expect(imageManifest).toMatchObject({
      batchId: '2026-06-03-batch56-images',
      generatedAt: '2026-06-03',
    })
    expect(imageManifest.images).toHaveLength(1)
    expect(imageManifest.images[0]).toMatchObject({
      slug: 'manila-folder-story-clue-trail-card-pack',
      title: 'Manila Folder Story Clue Trail Card Pack',
      outputJpeg: 'public/images/plotsprout/batch56/manila-folder-story-clue-trail-card-pack.jpg',
      outputWebp: 'public/images/plotsprout/batch56/manila-folder-story-clue-trail-card-pack.webp',
      sidecar: 'content/image-runs/batch56/manila-folder-story-clue-trail-card-pack.json',
    })
    expect(imageManifest.images[0].prompt).toBe(
      'family-friendly studio product mockup of a manila folder story clue trail card pack, orthographic top-down catalog view, tan manila folder open with blank clue trail cards clipped in a neat stack, small blank folder label tab, paper clue slips, unbranded graphite pencils, quiet printable writing kit, seamless plain white background, clean shadow, only manila folder blank cards clue slips and pencils, no text',
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
