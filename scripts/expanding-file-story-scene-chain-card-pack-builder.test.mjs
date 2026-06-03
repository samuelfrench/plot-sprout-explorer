import { describe, expect, it } from 'vitest'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'

import {
  inspectArtifactFiles,
  validateProductWorldSummaries,
  validateExpandingFileStorySceneChainCardPackSource,
  validateExpandingFileStorySceneChainCardPackSourceFiles,
} from './product-artifact-policy.mjs'
import {
  buildExpandingFileStorySceneChainCardPack,
  renderExpandingFileStorySceneChainCardPackHtml,
} from './expanding-file-story-scene-chain-card-pack-builder.mjs'

const root = resolve(import.meta.dirname, '..')
const safety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, and no identifying facts.'

const sourceFiles = [
  'content/product-artifacts/lanes/batch55-expanding-file-scene-chain-cards-a.json',
  'content/product-artifacts/lanes/batch55-expanding-file-scene-chain-cards-b.json',
  'content/product-artifacts/lanes/batch55-expanding-file-scene-chain-cards-c.json',
  'content/product-artifacts/lanes/batch55-expanding-file-scene-chain-tools.json',
]

const worldAges = {
  'button-bakery-map-mixup': '7-9',
  'sticker-station-mail-cart': '7-9',
  'pocket-park-notice-board': '7-9',
  'rain-boot-route-rangers': '7-9',
  'paperclip-plaza-parcel-day': '7-9',
  'solar-oven-picnic-station': '8-10',
  'moss-message-observatory': '8-10',
  'pantry-measurement-mystery': '8-10',
  'seed-library-map-room': '8-10',
  'pond-bridge-blueprint-club': '8-10',
  'revision-river-ferry': '10-11',
  'binding-day-boardwalk': '10-11',
  'margin-note-market': '10-11',
  'almost-invention-workshop': '10-11',
  'appendix-archive-lab': '10-11',
  'compass-craft-academy': '10-11',
}

const worldSlugs = Object.keys(worldAges)

const extraWorldAges = {
  'acorn-avenue-errand-office': '7-9',
  'teacup-town-weather-window': '7-8',
  'spoon-ferry-lunchbox-harbor': '7-9',
  'penny-path-compass-shop': '7-9',
  'tidepool-timekeepers-lab': '8-10',
  'rain-gauge-railway': '8-10',
  'compost-clock-workshop': '8-10',
  'greenhouse-gear-garden': '8-10',
  'mitten-market-lost-ticket': '7-8',
  'orchard-pulley-post': '8-10',
  'cloudberry-clocktower': '8-10',
  'tiny-lantern-reef': '8-10',
  'index-card-theater-club': '10-11',
  'chapter-gate-greenhouse': '10-11',
  'buttonwood-library-train': '7-9',
  'moon-muffin-market': '6-8',
  'blue-pencil-observatory': '10-11',
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
      premise: 'A friendly invented world for an adult-led paper scene-chain card.',
    },
  ]),
)

const cardKeys = [
  'id',
  'title',
  'worldSlug',
  'ageBand',
  'chainSkill',
  'useCase',
  'adultSetup',
  'kidDirection',
  'startScenePrompt',
  'nextScenePrompt',
  'bridgeDetailPrompt',
  'changeMarkerPrompt',
  'returnDetailPrompt',
  'filePocketPrompt',
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

function loadCardsFromLanes() {
  return sourceFiles
    .filter((sourceFile) => sourceFile.includes('-cards-'))
    .flatMap((sourceFile) => readJson(sourceFile).cards)
    .sort((left, right) => left.id.localeCompare(right.id))
}

function loadToolsLane() {
  return readJson('content/product-artifacts/lanes/batch55-expanding-file-scene-chain-tools.json')
}

function batchWorldSlugs(batchNumber) {
  const byBatch = {
    50: 'content/product-artifacts/lined-paper-story-paragraph-revision-card-pack.json',
    51: 'content/product-artifacts/composition-notebook-story-draft-checklist-card-pack.json',
    52: 'content/product-artifacts/spiral-notebook-story-final-copy-card-pack.json',
    53: 'content/product-artifacts/tabbed-folder-story-series-card-pack.json',
    54: 'content/product-artifacts/accordion-folder-story-arc-card-pack.json',
  }
  return readJson(byBatch[batchNumber]).worldSlugs
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
    'Expanding-File-Story-Scene-Chain-Card-Pack.pdf',
    'README.txt',
    'source/expanding-file-story-scene-chain-card-pack.html',
    ...source.worldSlugs.map((slug) => `source/assets/${slug}.jpg`),
  ]
}

function validSource(overrides = {}) {
  const tools = loadToolsLane()
  return {
    batchId: '2026-06-03-batch55',
    generatedAt: '2026-06-03',
    productSlug: 'expanding-file-story-scene-chain-card-pack',
    title: 'Expanding File Story Scene Chain Card Pack',
    pricePoint: '$83',
    audience: 'Families, homeschool groups, tutors, and adult-led writing tables for writers ages 7-11.',
    sessionLength:
      '16 printable expanding file story scene-chain cards plus adult guide tools, scene-chain routines, take-home scene slips, and optional adult prompts',
    safetyNote: safety,
    artifact: {
      pdfPath:
        'product-build/expanding-file-story-scene-chain-card-pack/Expanding-File-Story-Scene-Chain-Card-Pack.pdf',
      zipPath:
        'product-build/expanding-file-story-scene-chain-card-pack/expanding-file-story-scene-chain-card-pack.zip',
      sourceHtmlPath:
        'product-build/expanding-file-story-scene-chain-card-pack/source/expanding-file-story-scene-chain-card-pack.html',
      manifestPath: 'product-build/expanding-file-story-scene-chain-card-pack/manifest.json',
    },
    sourceFiles: [...sourceFiles],
    worldSlugs: [...worldSlugs],
    cover: {
      kicker: 'Printable expanding file scene-chain cards',
      headline: 'Expanding File Story Scene Chain Card Pack',
      subhead:
        'Sixteen expanding file cards help writers connect a fictional start scene, next scene, bridge detail, change marker, return detail, and paper pocket note.',
      included: [
        '16 printable expanding file scene-chain cards',
        'Adult setup guide',
        'Fictional scene-chain safety notes',
        'Start scene prompts',
        'Next scene prompts',
        'Bridge detail prompts',
        'Change marker and return detail prompts',
        'Six adult-led scene-chain routines',
        'Ten take-home scene slips',
        'Printable PDF and ZIP artifact',
      ],
    },
    adultGuide: tools.adultGuide,
    sceneChainRoutines: tools.sceneChainRoutines,
    takeHomeSceneSlips: tools.takeHomeSceneSlips,
    optionalAdultPrompts: tools.optionalAdultPrompts,
    cards: loadCardsFromLanes(),
    ...overrides,
  }
}

function withWorldReplacement(source, index, worldSlug) {
  source.worldSlugs[index] = worldSlug
  source.cards[index] = {
    ...source.cards[index],
    worldSlug,
    ageBand: knownWorldAges.get(worldSlug)?.ageBand ?? '8-10',
  }
  return source
}

function productForSource(source) {
  return {
    slug: 'expanding-file-story-scene-chain-card-pack',
    title: 'Expanding File Story Scene Chain Card Pack',
    pricePoint: '$83',
    status: 'checkout_pending',
    worldSlugs: source.worldSlugs,
    worldSummaries: source.worldSlugs.map((slug) => ({
      slug,
      summary: `A linked fictional world summary for ${slug}.`,
    })),
  }
}

function tempWorldsAndImages(source, { omitWorldImage = null } = {}) {
  const tempRoot = mkdtempSync(join(tmpdir(), 'expanding-file-scene-chain-'))
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
          sceneChainRoutines: source.sceneChainRoutines,
          takeHomeSceneSlips: source.takeHomeSceneSlips,
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

describe('Expanding File Story Scene Chain Card Pack policy', () => {
  it('defines the Batch55 validator and builder contract', () => {
    expect(validateExpandingFileStorySceneChainCardPackSource).toBeTypeOf('function')
    expect(validateExpandingFileStorySceneChainCardPackSourceFiles).toBeTypeOf('function')
    expect(renderExpandingFileStorySceneChainCardPackHtml).toBeTypeOf('function')
    expect(buildExpandingFileStorySceneChainCardPack).toBeTypeOf('function')
  })

  it('accepts a valid source with exact Batch55 product alignment', () => {
    const source = validSource()
    const product = productForSource(source)

    expect(validateExpandingFileStorySceneChainCardPackSource(source, product, knownWorldAges)).toEqual([])
    expect(validateProductWorldSummaries(product, 'Expanding File Story Scene Chain Card Pack')).toEqual([])
  })

  it('keeps the exact Batch55 source schema, world order, age bands, and card field order', () => {
    const source = validSource()

    expect(source.sourceFiles).toEqual(sourceFiles)
    expect(source.worldSlugs).toEqual(worldSlugs)
    expect(source.cards.map((entry) => [entry.id, entry.worldSlug, entry.ageBand])).toEqual(
      worldSlugs.map((slug, index) => [
        `expanding-file-scene-chain-card-${String(index + 1).padStart(2, '0')}`,
        slug,
        worldAges[slug],
      ]),
    )
    for (const card of source.cards) expect(Object.keys(card)).toEqual(cardKeys)
    expect(source.adultGuide.bullets).toHaveLength(6)
    expect(source.sceneChainRoutines).toHaveLength(6)
    expect(source.sceneChainRoutines.every((routine) => routine.steps.length === 4)).toBe(true)
    expect(source.takeHomeSceneSlips).toHaveLength(10)
    expect(source.optionalAdultPrompts).toHaveLength(8)
  })

  it('documents exact overlap guards against existing Batch50 through Batch54 source files', () => {
    for (const batchNumber of [50, 51, 52, 53, 54]) {
      expect(worldSlugs.filter((slug) => batchWorldSlugs(batchNumber).includes(slug))).toHaveLength(7)
    }
  })

  it('rejects changed Batch50, Batch51, Batch52, Batch53, and Batch54 overlap counts', () => {
    const cases = [
      { batchNumber: 50, index: 0, replacement: 'penny-path-compass-shop' },
      { batchNumber: 51, index: 1, replacement: 'buttonwood-library-train' },
      { batchNumber: 52, index: 1, replacement: 'moon-muffin-market' },
      { batchNumber: 53, index: 0, replacement: 'chapter-gate-greenhouse' },
      { batchNumber: 54, index: 2, replacement: 'acorn-avenue-errand-office' },
    ]

    for (const { batchNumber, index, replacement } of cases) {
      const source = withWorldReplacement(validSource(), index, replacement)
      expect(
        validateExpandingFileStorySceneChainCardPackSource(
          source,
          productForSource(source),
          knownWorldAges,
        ).join('\n'),
      ).toMatch(new RegExp(`overlap exactly 7 Batch ${batchNumber} worlds`))
    }
  })

  it('rejects a scene-chain prompt field without a writable blank', () => {
    const source = validSource()
    source.cards[0].returnDetailPrompt = 'Return detail: bring back the first button marker.'

    expect(validateExpandingFileStorySceneChainCardPackSource(source, productForSource(source), knownWorldAges)).toContain(
      'cards[0].returnDetailPrompt must include a writable blank.',
    )
  })

  it('rejects unsafe scene-chain source language including standalone public, address, and food', () => {
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
          source.cards[1].bridgeDetailPrompt = 'Bridge detail: write an address on the page: ____________________.'
        },
      },
      {
        term: 'food',
        mutate(source) {
          source.cards[2].returnDetailPrompt = 'Return detail: food note returns later: ____________________.'
        },
      },
      {
        term: 'episode',
        mutate(source) {
          source.cards[3].filePocketPrompt = 'File pocket note: name the next episode: ____________________.'
        },
      },
      {
        term: 'chapter book',
        mutate(source) {
          source.cards[4].takeHomeLine = 'Take-home line: turn this into a chapter book: ____________________.'
        },
      },
      {
        term: 'upload',
        mutate(source) {
          source.cards[5].kidDirection = 'Writer: upload the scene chain after writing: ____________________.'
        },
      },
      {
        term: 'timer',
        mutate(source) {
          source.sceneChainRoutines[0].steps[0] = 'The adult starts a timer before opening the file: ____________________.'
        },
      },
      {
        term: 'private child profile',
        mutate(source) {
          source.adultGuide.bullets[0] = 'Attach a private child profile to the first paper pocket: ____________________.'
        },
      },
    ]

    for (const { term, mutate } of cases) {
      const source = validSource()
      mutate(source)
      expect(
        validateExpandingFileStorySceneChainCardPackSource(source, productForSource(source), knownWorldAges).join('\n'),
      ).toMatch(new RegExp(term, 'i'))
    }
  })

  it('renders all scene-chain fields into printable HTML', () => {
    const source = validSource()
    const imageMap = new Map(source.worldSlugs.map((slug) => [slug, `assets/${slug}.jpg`]))
    const html = renderExpandingFileStorySceneChainCardPackHtml(source, worlds, imageMap)

    expect(html).toContain('Expanding File Story Scene Chain Card Pack')
    expect(html).toContain('Start scene')
    expect(html).toContain('Next scene')
    expect(html).toContain('Bridge detail')
    expect(html).toContain('Change marker')
    expect(html).toContain('Return detail')
    expect(html).toContain('File pocket note')
    expect(html).toContain('assets/paperclip-plaza-parcel-day.jpg')
    expect(html).not.toMatch(/story-arc/i)
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
        buildExpandingFileStorySceneChainCardPack({
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
    const targetBuildDir = resolve(tempRoot, 'product-build', 'expanding-file-story-scene-chain-card-pack')

    try {
      const output = await buildExpandingFileStorySceneChainCardPack({
        source,
        product: productForSource(source),
        worlds: tempWorlds,
        imageSources,
        buildDir: targetBuildDir,
        recordRoot: tempRoot,
        writePdf: async ({ pdfPath }) => writeFileSync(pdfPath, fakePdf(21)),
      })
      const htmlPath = join(targetBuildDir, 'source', 'expanding-file-story-scene-chain-card-pack.html')
      const pdfPath = join(targetBuildDir, 'Expanding-File-Story-Scene-Chain-Card-Pack.pdf')
      const zipPath = join(targetBuildDir, 'expanding-file-story-scene-chain-card-pack.zip')
      const manifestPath = join(targetBuildDir, 'manifest.json')
      const readmePath = join(targetBuildDir, 'README.txt')

      expect(existsSync(htmlPath)).toBe(true)
      expect(existsSync(pdfPath)).toBe(true)
      expect(existsSync(zipPath)).toBe(true)
      expect(existsSync(manifestPath)).toBe(true)
      expect(readFileSync(readmePath, 'utf8')).not.toMatch(/\b(provider|public|real child)\b/i)
      expect(output.source.productSlug).toBe('expanding-file-story-scene-chain-card-pack')
      expect(output.manifest.productSlug).toBe('expanding-file-story-scene-chain-card-pack')
      expect(output.manifest.files.pdf.sha256).toBe(sha256(pdfPath))
      expect(output.manifest.files.zip.sha256).toBe(sha256(zipPath))
      expect(output.manifest.files.assets).toHaveLength(16)

      const secondOutput = await buildExpandingFileStorySceneChainCardPack({
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

  it('validates exact lane source files reproduce scene-chain cards and tools', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-expanding-file-source-'))
    const source = validSource()

    try {
      writeLaneFiles(tempRoot, source)
      expect(validateExpandingFileStorySceneChainCardPackSourceFiles(source, tempRoot)).toEqual([])
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('rejects copied source files that point at the wrong Batch55 lanes', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-expanding-file-source-path-'))
    const source = validSource()

    try {
      source.sourceFiles[0] = 'content/product-artifacts/lanes/copied-expanding-file-scene-chain-cards-a.json'
      writeLaneFiles(tempRoot, source)
      expect(validateExpandingFileStorySceneChainCardPackSourceFiles(source, tempRoot)).toContain(
        'sourceFiles must list the exact Batch 55 scene-chain-card lane and tools files.',
      )
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('rejects a card placed in the wrong scene-chain lane range', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-expanding-file-lane-range-'))
    const source = validSource()

    try {
      writeLaneFiles(tempRoot, source)
      const laneAPath = resolve(
        tempRoot,
        'content/product-artifacts/lanes/batch55-expanding-file-scene-chain-cards-a.json',
      )
      const laneBPath = resolve(
        tempRoot,
        'content/product-artifacts/lanes/batch55-expanding-file-scene-chain-cards-b.json',
      )
      const laneA = JSON.parse(readFileSync(laneAPath, 'utf8'))
      const laneB = JSON.parse(readFileSync(laneBPath, 'utf8'))
      laneA.cards.push(laneB.cards[0])
      writeFileSync(laneAPath, `${JSON.stringify(laneA, null, 2)}\n`)

      expect(validateExpandingFileStorySceneChainCardPackSourceFiles(source, tempRoot)).toContain(
        'content/product-artifacts/lanes/batch55-expanding-file-scene-chain-cards-a.json must contain only cards 01-06.',
      )
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('will be listed as a checkout-pending product after catalog integration', () => {
    const products = readJson('content/products/batch5-products.json').products
    const productRecord = products.find((candidate) => candidate.slug === 'expanding-file-story-scene-chain-card-pack')

    expect(productRecord).toMatchObject({
      title: 'Expanding File Story Scene Chain Card Pack',
      pricePoint: '$83',
      status: 'checkout_pending',
      heroImage: 'images/plotsprout/batch55/expanding-file-story-scene-chain-card-pack.jpg',
    })
    expect(productRecord.ctaHref).toMatch(/^mailto:/)
    expect(`${productRecord.checkoutNote}\n${productRecord.safetyNote}`).not.toMatch(
      /\b(provider|payment|public|real child)\b/i,
    )
  })

  it('defines one local-only Batch55 product hero image manifest entry', () => {
    const imageManifest = readJson('content/image-queue/2026-06-03-batch55-images.json')

    expect(imageManifest).toMatchObject({
      batchId: '2026-06-03-batch55-images',
      generatedAt: '2026-06-03',
    })
    expect(imageManifest.images).toHaveLength(1)
    expect(imageManifest.images[0]).toMatchObject({
      slug: 'expanding-file-story-scene-chain-card-pack',
      title: 'Expanding File Story Scene Chain Card Pack',
      outputJpeg: 'public/images/plotsprout/batch55/expanding-file-story-scene-chain-card-pack.jpg',
      outputWebp: 'public/images/plotsprout/batch55/expanding-file-story-scene-chain-card-pack.webp',
      sidecar: 'content/image-runs/batch55/expanding-file-story-scene-chain-card-pack.json',
    })
    expect(imageManifest.images[0].prompt).toBe(
      'family-friendly studio product mockup of expanding file story scene chain card pack, orthographic top-down view, open blank expanding file with blank divider pockets, blank scene-chain cards tucked into pockets, empty writing areas, unbranded pencils, quiet printable writing kit, seamless plain white background, clean shadow, only paper folders cards and pencils, no text',
    )
    for (const phrase of [
      'text',
      'labels',
      'logo',
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
