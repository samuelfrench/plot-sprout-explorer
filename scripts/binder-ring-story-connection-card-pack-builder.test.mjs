import { describe, expect, it } from 'vitest'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, resolve } from 'node:path'

import {
  inspectArtifactFiles,
  validateBinderRingStoryConnectionCardPackSource,
  validateBinderRingStoryConnectionCardPackSourceFiles,
  validateProductWorldSummaries,
} from './product-artifact-policy.mjs'
import {
  buildBinderRingStoryConnectionCardPack,
  renderBinderRingStoryConnectionCardPackHtml,
} from './binder-ring-story-connection-card-pack-builder.mjs'

const root = resolve(import.meta.dirname, '..')
const safety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, and no identifying facts.'

const sourceFiles = [
  'content/product-artifacts/lanes/batch67-binder-ring-story-connection-cards-a.json',
  'content/product-artifacts/lanes/batch67-binder-ring-story-connection-cards-b.json',
  'content/product-artifacts/lanes/batch67-binder-ring-story-connection-cards-c.json',
  'content/product-artifacts/lanes/batch67-binder-ring-story-connection-tools.json',
]

const worldAges = {
  'mitten-market-lost-ticket': '7-8',
  'sticker-station-mail-cart': '7-9',
  'spoon-ferry-lunchbox-harbor': '7-9',
  'penny-path-compass-shop': '7-9',
  'buttonwood-library-train': '7-9',
  'paperclip-plaza-parcel-day': '7-9',
  'pond-bridge-blueprint-club': '8-10',
  'cloudberry-clocktower': '8-10',
  'solar-oven-picnic-station': '8-10',
  'greenhouse-gear-garden': '8-10',
  'seed-library-map-room': '8-10',
  'compass-craft-academy': '10-11',
  'pencil-dragon-academy': '10-11',
  'blue-pencil-observatory': '10-11',
  'margin-note-market': '10-11',
  'index-card-theater-club': '10-11',
}

const worldSlugs = Object.keys(worldAges)
const knownWorldAges = new Map(
  Object.entries(worldAges).map(([slug, ageBand]) => [
    slug,
    {
      ageBand,
    },
  ]),
)
const worlds = new Map(
  Object.entries(worldAges).map(([worldSlug, ageBand]) => [
    worldSlug,
    {
      slug: worldSlug,
      title: titleForSlug(worldSlug),
      ageBand,
      premise: 'A friendly invented world for an adult-led paper connection card.',
    },
  ]),
)

const cardKeys = [
  'id',
  'title',
  'worldSlug',
  'ageBand',
  'connectionSkill',
  'useCase',
  'adultSetup',
  'kidDirection',
  'firstDetailPrompt',
  'connectionPrompt',
  'becausePrompt',
  'secondDetailPrompt',
  'bridgeSentencePrompt',
  'binderRingCheckPrompt',
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
    .replace('Blueprint Club', 'Blueprint Club')
}

function batchWorldSlugs(batchNumber) {
  const byBatch = {
    58: 'content/product-artifacts/hanging-file-story-decision-point-card-pack.json',
    59: 'content/product-artifacts/file-box-story-turning-point-card-pack.json',
    60: 'content/product-artifacts/archive-drawer-story-resolution-card-pack.json',
    61: 'content/product-artifacts/card-catalog-story-retell-card-pack.json',
    62: 'content/product-artifacts/library-pocket-story-summary-card-pack.json',
    63: 'content/product-artifacts/shelf-marker-story-theme-card-pack.json',
    64: 'content/product-artifacts/bookend-story-evidence-card-pack.json',
    65: 'content/product-artifacts/page-flag-story-reason-chain-card-pack.json',
    66: 'content/product-artifacts/paper-tab-story-inference-card-pack.json',
  }
  return readJson(byBatch[batchNumber]).worldSlugs
}

function overlapCount(left, right) {
  const rightSet = new Set(right)
  return left.filter((item) => rightSet.has(item)).length
}

function routine(title, useWhen) {
  return {
    title: `${title}: ____________________.`,
    useWhen: `${useWhen}: ____________________.`,
    steps: [
      'Adult points to one connection blank: ____________________.',
      'Writer names one invented detail: ____________________.',
      'Adult asks which second detail connects to it inside the pretend story: ____________________.',
      'Writer writes one short paper bridge sentence: ____________________.',
    ],
  }
}

function slip(title, prompt) {
  return {
    title,
    prompt,
    adultNote: 'Keep this adult-led, invented, offline, and paper-only.',
  }
}

function makeTools() {
  return {
    adultGuide: {
      title: 'Binder Ring Connection Adult Guide: ____________________.',
      setupSteps: [
        'Place one connection card, blank paper, pencil, and two binder rings on the table: ____________________.',
        'Choose one fictional world and read the card title aloud: ____________________.',
        'Point to the first detail, connection, because, second detail, bridge sentence, and binder ring check blanks: ____________________.',
        'Let the writer point, dictate, sketch, or write short paper lines: ____________________.',
        'Close by reading the bridge sentence and binder ring check together: ____________________.',
      ],
      facilitationNotes: [
        'Keep the pace calm and adult-led with one paper blank at a time: ____________________.',
        'Accept short invented phrases before asking for a full bridge sentence: ____________________.',
        'Use the connection blank to connect details without asking for personal facts: ____________________.',
        'If the writer stalls, fill only the first detail and connection blanks first: ____________________.',
        'Use the binder ring check as a quiet paper mark, not as a correction mark: ____________________.',
      ],
      safetyNotes: [
        'Use pretend names, broad made-up places, and invented actions: ____________________.',
        'Do not ask for real school, home, schedule, or identity details: ____________________.',
        'Do not collect child writing or identifying facts: ____________________.',
        'Keep every prompt offline, paper-only, and adult-led: ____________________.',
        'Keep binder rings fictional and separate from real shelf or online systems: ____________________.',
      ],
    },
    connectionRoutines: [
      routine('First Detail Start', 'Use when the writer needs one pretend detail.'),
      routine('Connection Line', 'Use when the writer needs to say how two details connect.'),
      routine('Because It Fits', 'Use when the writer needs a short because line.'),
      routine('Second Detail Support', 'Use when the writer needs a second invented detail.'),
      routine('Bridge Sentence Draft', 'Use when the writer needs one bridge sentence.'),
      routine('Binder Ring Check Finish', 'Use when the sentence is ready to mark on paper.'),
    ],
    takeHomeConnectionSlips: [
      slip('First Detail Slip', 'First pretend detail: ____________________.'),
      slip('Connection Slip', 'This detail connects to ____________________.'),
      slip('Because Slip', 'This fits the pretend story because: ____________________.'),
      slip('Second Detail Slip', 'Second pretend detail: ____________________.'),
      slip('Two Detail Slip', 'The two invented details are ____ and ____.'),
      slip('Bridge Sentence Slip', 'My short bridge sentence is: ____________________.'),
      slip('Binder Ring Check Slip', 'Binder ring check for this sentence: ____________________.'),
      slip('Detail And Connection Slip', 'The detail is ____ and it connects to ____.'),
      slip('Quiet Blank Slip', 'One blank I can finish later: ____________________.'),
      slip('Adult-Led Later Slip', 'Next time, I can add one more invented detail: ____________________.'),
    ],
    optionalAdultPrompts: [
      'Ask which small pretend detail the writer notices first: ____________________.',
      'Ask what second detail connects to it inside the invented story: ____________________.',
      'Ask because why the connection fits without using real-life facts: ____________________.',
      'Ask which second detail keeps the connection moving: ____________________.',
      'Ask for one short bridge sentence, not a correction mark: ____________________.',
      'Ask where the binder ring check belongs on the paper card: ____________________.',
      'Invite a dictated answer before asking for handwriting: ____________________.',
      'Stop after one filled blank if the writer is done: ____________________.',
    ],
  }
}

function makeCards() {
  return worldSlugs.map((worldSlug, index) => {
    const number = String(index + 1).padStart(2, '0')
    const title = titleForSlug(worldSlug)
    return {
      id: `binder-ring-connection-card-${number}`,
      title: `${title} Connection Card`,
      worldSlug,
      ageBand: worldAges[worldSlug],
      connectionSkill: `connect one fictional ${title} detail to a second detail with a because line, one bridge sentence, and a binder ring check: ____________________.`,
      useCase: `Adult-led fictional offline paper-only connection card for a made-up ${title} story: ____________________.`,
      adultSetup: `Adult: set out a blank page, pencil, and two binder rings before the ${title} connection begins: ____________________.`,
      kidDirection: `Writer: keep every ${title} idea invented while the connection stays on paper: ____________________.`,
      firstDetailPrompt: `First detail: write one pretend detail from the ${title} story: ____________________.`,
      connectionPrompt: `Connection: write how that detail connects to another made-up detail in the story: ____________________.`,
      becausePrompt: `Because: write because why the two details fit together in the pretend story: ____________________.`,
      secondDetailPrompt: `Second detail: write another invented detail that fits the same connection: ____________________.`,
      bridgeSentencePrompt: `Bridge sentence: write one sentence connecting the two details with because language: ____________________.`,
      binderRingCheckPrompt: `Binder ring check: mark which paper ring holds the strongest connection: ____________________.`,
      quietOptionLine: `Quiet option: adult and writer fill only the first detail and connection blanks first: ____________________.`,
      takeHomeLine: `Take-home line: save this paper connection card for one later adult-led detail pass: ____________________.`,
    }
  })
}

function makeSource() {
  const tools = makeTools()
  return {
    batchId: '2026-06-04-batch67',
    generatedAt: '2026-06-04',
    productSlug: 'binder-ring-story-connection-card-pack',
    title: 'Binder Ring Story Connection Card Pack',
    pricePoint: '$107',
    audience: 'Families, homeschool groups, tutors, and adult-led writing tables for writers ages 7-11.',
    sessionLength:
      '16 printable binder ring story connection cards plus adult guide tools, connection routines, take-home connection slips, and optional adult prompts',
    safetyNote: safety,
    artifact: {
      pdfPath:
        'product-build/binder-ring-story-connection-card-pack/Binder-Ring-Story-Connection-Card-Pack.pdf',
      zipPath:
        'product-build/binder-ring-story-connection-card-pack/binder-ring-story-connection-card-pack.zip',
      sourceHtmlPath:
        'product-build/binder-ring-story-connection-card-pack/source/binder-ring-story-connection-card-pack.html',
      manifestPath: 'product-build/binder-ring-story-connection-card-pack/manifest.json',
    },
    sourceFiles: [...sourceFiles],
    worldSlugs: [...worldSlugs],
    cover: {
      kicker: 'Printable binder ring connection cards',
      headline: 'Binder Ring Story Connection Card Pack',
      subhead:
        'Sixteen binder ring cards help writers connect invented story details with because lines, second details, and one short bridge sentence.',
      included: [
        '16 printable binder ring connection cards',
        'Adult setup guide',
        'Fictional connection safety notes',
        'First detail prompts',
        'Connection prompts',
        'Because prompts',
        'Second detail prompts',
        'Bridge sentence prompts',
        'Binder ring check prompts',
        'Six adult-led connection routines',
        'Ten take-home connection slips',
        'Printable PDF and ZIP artifact',
      ],
    },
    adultGuide: tools.adultGuide,
    connectionRoutines: tools.connectionRoutines,
    takeHomeConnectionSlips: tools.takeHomeConnectionSlips,
    optionalAdultPrompts: tools.optionalAdultPrompts,
    cards: makeCards(),
  }
}

function makeProduct(source = makeSource()) {
  return {
    slug: source.productSlug,
    title: source.title,
    pricePoint: source.pricePoint,
    status: 'checkout_pending',
    headline: 'Printable binder ring connection cards for private fictional story thinking.',
    summary:
      'Sixteen binder ring connection cards help kids connect invented story details with because lines and short bridge sentences.',
    heroImage: 'images/plotsprout/batch67/binder-ring-story-connection-card-pack.jpg',
    ctaLabel: 'Request binder ring connection pack launch notice',
    ctaHref: 'mailto:samfrench@gmail.com?subject=Binder%20Ring%20Story%20Connection%20Card%20Pack',
    checkoutNote:
      'Checkout is pending until the payment provider is selected; this static binder ring connection pack page is ready for hosted checkout wiring but does not accept payment yet.',
    safetyNote: source.safetyNote,
    worldSlugs: [...source.worldSlugs],
    worldSummaries: source.worldSlugs.map((slug) => ({
      slug,
      title: titleForSlug(slug),
      ageBand: source.cards.find((card) => card.worldSlug === slug)?.ageBand,
      summary: `A pretend ${titleForSlug(slug)} world for connecting invented story details to bridge sentences on paper.`,
    })),
  }
}

function writeTempLaneFiles(source, tempRoot) {
  const fileContents = {
    [sourceFiles[0]]: source.cards.slice(0, 6),
    [sourceFiles[1]]: source.cards.slice(6, 11),
    [sourceFiles[2]]: source.cards.slice(11, 16),
    [sourceFiles[3]]: {
      adultGuide: source.adultGuide,
      connectionRoutines: source.connectionRoutines,
      takeHomeConnectionSlips: source.takeHomeConnectionSlips,
      optionalAdultPrompts: source.optionalAdultPrompts,
    },
  }
  for (const [relativePath, data] of Object.entries(fileContents)) {
    const targetPath = resolve(tempRoot, relativePath)
    mkdirSync(dirname(targetPath), { recursive: true })
    writeFileSync(targetPath, `${JSON.stringify(data, null, 2)}\n`)
  }
}

function makeImageRoot(source) {
  const imageRoot = mkdtempSync(resolve(tmpdir(), 'plotsprout-batch67-images-'))
  for (const slug of source.worldSlugs) {
    writeFileSync(resolve(imageRoot, `${slug}.jpg`), `fake jpeg bytes for ${slug}`)
  }
  return imageRoot
}

describe('Binder Ring Story Connection Card Pack', () => {
  it('validates the canonical source shape, safety, lanes, worlds, and artifact paths', () => {
    const source = makeSource()
    const product = makeProduct(source)

    expect(validateBinderRingStoryConnectionCardPackSource(source, product, knownWorldAges)).toEqual([])

    expect(source.cards).toHaveLength(16)
    expect(source.connectionRoutines).toHaveLength(6)
    expect(source.takeHomeConnectionSlips).toHaveLength(10)
    expect(source.optionalAdultPrompts).toHaveLength(8)
    expect(source.sourceFiles).toEqual(sourceFiles)
    expect(source.worldSlugs).toEqual(worldSlugs)
    for (const [batchNumber, expected] of [
      [58, 6],
      [59, 6],
      [60, 7],
      [61, 8],
      [62, 6],
      [63, 6],
      [64, 6],
      [65, 6],
      [66, 6],
    ]) {
      expect(overlapCount(source.worldSlugs, batchWorldSlugs(batchNumber))).toBe(expected)
    }
    expect(source.artifact).toEqual({
      pdfPath:
        'product-build/binder-ring-story-connection-card-pack/Binder-Ring-Story-Connection-Card-Pack.pdf',
      zipPath:
        'product-build/binder-ring-story-connection-card-pack/binder-ring-story-connection-card-pack.zip',
      sourceHtmlPath:
        'product-build/binder-ring-story-connection-card-pack/source/binder-ring-story-connection-card-pack.html',
      manifestPath: 'product-build/binder-ring-story-connection-card-pack/manifest.json',
    })
  })

  it('rejects unsafe connection content and real-source framing', () => {
    const source = makeSource()
    source.cards[0].bridgeSentencePrompt =
      'Copy a quote from a real book review and cite the source: ____________________.'

    const errors = validateBinderRingStoryConnectionCardPackSource(source, makeProduct(source), knownWorldAges)
    expect(errors.join('\n')).toMatch(/quote|review|cite|source|citation/i)
  })

  it('rejects public-performance and publishing-pressure framing', () => {
    const forbiddenPhrases = [
      'showcase',
      'portfolio',
      'display',
      'perfect',
      'episode',
      'chapter book',
      'screenplay',
      'cliffhanger',
      'plot twist',
      'choose your own adventure',
      'publishable',
    ]

    for (const phrase of forbiddenPhrases) {
      const source = makeSource()
      source.cards[0].bridgeSentencePrompt = `bridge sentence: make this ${phrase} version of the story: ____________________.`

      const errors = validateBinderRingStoryConnectionCardPackSource(source, makeProduct(source), knownWorldAges)
      expect(errors.join('\n'), phrase).toMatch(
        /showcase|portfolio|display|perfect|episode|chapter book|screenplay|cliffhanger|plot twist|choose your own adventure|publishable|publish/i,
      )
    }
  })

  it('validates committed source files and product metadata when present', () => {
    const source = readJson('content/product-artifacts/binder-ring-story-connection-card-pack.json')
    const products = readJson('content/products/batch5-products.json').products
    const product = products.find((candidate) => candidate.slug === source.productSlug)

    expect(validateBinderRingStoryConnectionCardPackSource(source, product, knownWorldAges)).toEqual([])
    expect(validateBinderRingStoryConnectionCardPackSourceFiles(source, root)).toEqual([])

    expect(product.status).toBe('checkout_pending')
    expect(product.pricePoint).toBe('$107')
    expect(product.ctaHref).toContain('mailto:')
    expect(product.ctaHref).toContain('Binder%20Ring%20Story%20Connection%20Card%20Pack')
    expect(product.heroImage).toBe('images/plotsprout/batch67/binder-ring-story-connection-card-pack.jpg')
    expect(validateProductWorldSummaries(product, 'Batch67 product')).toEqual([])
  })

  it('renders the printable connection fields into deterministic HTML', () => {
    const source = makeSource()
    const imageMap = new Map(worldSlugs.map((slug) => [slug, `assets/${slug}.jpg`]))

    const html = renderBinderRingStoryConnectionCardPackHtml(source, worlds, imageMap)

    expect(html).toContain('Binder Ring Story Connection Card Pack')
    expect(html).toContain('Ages 7-8')
    expect(html).not.toContain('Ages 6-8')
    expect(html).toContain('First detail:')
    expect(html).toContain('Connection:')
    expect(html).toContain('Because:')
    expect(html).toContain('Second detail:')
    expect(html).toContain('Bridge sentence:')
    expect(html).toContain('Binder ring check:')
    expect(html).toContain('assets/buttonwood-library-train.jpg')
    expect(html).not.toMatch(/\b(public|address|rating|review|quote|citation|source)\b/i)
  })

  it('builds deterministic PDF, source, README, manifest, and ZIP files', async () => {
    const tmpRoot = mkdtempSync(resolve(tmpdir(), 'binder-ring-connection-pack-'))
    const tempLanes = mkdtempSync(resolve(tmpdir(), 'binder-ring-connection-lanes-'))
    let imageRoot

    try {
      const source = makeSource()
      imageRoot = makeImageRoot(source)
      writeTempLaneFiles(source, tempLanes)

      const first = await buildBinderRingStoryConnectionCardPack({
        outputDir: resolve(tmpRoot, 'first'),
        source,
        product: makeProduct(source),
        worlds,
        imageRoot,
        sourceFilesRoot: tempLanes,
        pdfRenderer: () => Buffer.from('%PDF-1.7\n1 0 obj\n<<>>\nendobj\n%%EOF\n'),
      })
      const second = await buildBinderRingStoryConnectionCardPack({
        outputDir: resolve(tmpRoot, 'second'),
        source,
        product: makeProduct(source),
        worlds,
        imageRoot,
        sourceFilesRoot: tempLanes,
        pdfRenderer: () => Buffer.from('%PDF-1.7\n1 0 obj\n<<>>\nendobj\n%%EOF\n'),
      })

      for (const output of [first, second]) {
        expect(existsSync(output.pdfPath)).toBe(true)
        expect(existsSync(output.zipPath)).toBe(true)
        expect(existsSync(output.htmlPath)).toBe(true)
        expect(existsSync(output.manifestPath)).toBe(true)
        expect(existsSync(output.readmePath)).toBe(true)
        expect(
          inspectArtifactFiles(
            {
              pdfPath: output.pdfPath,
              zipPath: output.zipPath,
              sourceHtmlPath: output.htmlPath,
              manifestPath: output.manifestPath,
            },
            'Batch67 temp artifact',
          ),
        ).toEqual([])
        expect(readFileSync(output.htmlPath, 'utf8')).toContain('Binder Ring Story Connection Card Pack')
      }

      expect(readFileSync(first.pdfPath)).toEqual(readFileSync(second.pdfPath))
      expect(readFileSync(first.zipPath)).toEqual(readFileSync(second.zipPath))
    } finally {
      rmSync(tmpRoot, { recursive: true, force: true })
      rmSync(tempLanes, { recursive: true, force: true })
      if (imageRoot) rmSync(imageRoot, { recursive: true, force: true })
    }
  })
})
