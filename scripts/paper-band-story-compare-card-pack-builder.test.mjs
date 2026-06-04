import { describe, expect, it } from 'vitest'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, resolve } from 'node:path'

import {
  inspectArtifactFiles,
  validatePaperBandStoryCompareCardPackSource,
  validatePaperBandStoryCompareCardPackSourceFiles,
  validateProductWorldSummaries,
} from './product-artifact-policy.mjs'
import {
  buildPaperBandStoryCompareCardPack,
  renderPaperBandStoryCompareCardPackHtml,
} from './paper-band-story-compare-card-pack-builder.mjs'

const root = resolve(import.meta.dirname, '..')
const safety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, and no identifying facts.'

const sourceFiles = [
  'content/product-artifacts/lanes/batch68-paper-band-story-compare-cards-a.json',
  'content/product-artifacts/lanes/batch68-paper-band-story-compare-cards-b.json',
  'content/product-artifacts/lanes/batch68-paper-band-story-compare-cards-c.json',
  'content/product-artifacts/lanes/batch68-paper-band-story-compare-tools.json',
]

const worldAges = {
  'mitten-market-lost-ticket': '7-8',
  'moon-muffin-market': '7-8',
  'acorn-avenue-errand-office': '7-9',
  'button-bakery-map-mixup': '7-9',
  'penny-path-compass-shop': '7-9',
  'rain-boot-route-rangers': '7-9',
  'compost-clock-workshop': '8-10',
  'orchard-pulley-post': '8-10',
  'pond-bridge-blueprint-club': '8-10',
  'seed-library-map-room': '8-10',
  'tidepool-timekeepers-lab': '8-10',
  'almost-invention-workshop': '10-11',
  'blue-pencil-observatory': '10-11',
  'chapter-gate-greenhouse': '10-11',
  'pencil-dragon-academy': '10-11',
  'revision-river-ferry': '10-11',
}

const actualWorldAges = {
  ...worldAges,
  'moon-muffin-market': '6-8',
}

const worldSlugs = Object.keys(worldAges)
const knownWorldAges = new Map(
  Object.entries(actualWorldAges).map(([slug, ageBand]) => [
    slug,
    {
      ageBand,
    },
  ]),
)
const worlds = new Map(
  Object.entries(actualWorldAges).map(([worldSlug, ageBand]) => [
    worldSlug,
    {
      slug: worldSlug,
      title: titleForSlug(worldSlug),
      ageBand,
      premise: 'A friendly invented world for an adult-led paper compare card.',
    },
  ]),
)

const cardKeys = [
  'id',
  'title',
  'worldSlug',
  'ageBand',
  'compareSkill',
  'useCase',
  'adultSetup',
  'kidDirection',
  'firstDetailPrompt',
  'secondDetailPrompt',
  'samePrompt',
  'differentPrompt',
  'compareSentencePrompt',
  'paperBandCheckPrompt',
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
    .replace('Map Mixup', 'Map Mix-Up')
}

function batchWorldSlugs(batchNumber) {
  const byBatch = {
    59: 'content/product-artifacts/file-box-story-turning-point-card-pack.json',
    60: 'content/product-artifacts/archive-drawer-story-resolution-card-pack.json',
    61: 'content/product-artifacts/card-catalog-story-retell-card-pack.json',
    62: 'content/product-artifacts/library-pocket-story-summary-card-pack.json',
    63: 'content/product-artifacts/shelf-marker-story-theme-card-pack.json',
    64: 'content/product-artifacts/bookend-story-evidence-card-pack.json',
    65: 'content/product-artifacts/page-flag-story-reason-chain-card-pack.json',
    66: 'content/product-artifacts/paper-tab-story-inference-card-pack.json',
    67: 'content/product-artifacts/binder-ring-story-connection-card-pack.json',
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
      'Adult points to two invented detail blanks: ____________________.',
      'Writer names the first detail and second detail: ____________________.',
      'Adult asks what is the same and what is different on paper: ____________________.',
      'Writer writes one compare sentence with but or while: ____________________.',
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
      title: 'Paper Band Compare Adult Guide: ____________________.',
      setupSteps: [
        'Place one compare card, blank paper, pencil, and a pretend paper band on the table: ____________________.',
        'Choose one fictional world and read the card title aloud: ____________________.',
        'Point to the first detail, second detail, same, different, compare sentence, and paper band check blanks: ____________________.',
        'Let the writer point, dictate, sketch, or write short paper lines: ____________________.',
        'Close by reading the compare sentence and paper band check together: ____________________.',
      ],
      facilitationNotes: [
        'Keep the pace calm and adult-led with one paper blank at a time: ____________________.',
        'Accept short invented phrases before asking for a full compare sentence: ____________________.',
        'Use the same and different blanks to compare details without asking for personal facts: ____________________.',
        'If the writer stalls, fill only the two detail blanks first: ____________________.',
        'Use the paper band check as a quiet paper mark, not as a correction mark: ____________________.',
      ],
      safetyNotes: [
        'Use pretend names, broad made-up places, and invented actions: ____________________.',
        'Do not ask for real school, home, schedule, or identity details: ____________________.',
        'Do not collect child writing or identifying facts: ____________________.',
        'Keep every prompt offline, paper-only, and adult-led: ____________________.',
        'Keep paper bands fictional and separate from real shelf or online systems: ____________________.',
      ],
    },
    compareRoutines: [
      routine('First Detail Start', 'Use when the writer needs one pretend detail.'),
      routine('Second Detail Match', 'Use when the writer needs a second invented detail.'),
      routine('Same Line', 'Use when the writer needs to name what both details share.'),
      routine('Different Line', 'Use when the writer needs to name how the details differ.'),
      routine('Compare Sentence Draft', 'Use when the writer needs one compare sentence.'),
      routine('Paper Band Check Finish', 'Use when the sentence is ready to mark on paper.'),
    ],
    takeHomeCompareSlips: [
      slip('First Detail Slip', 'First pretend detail: ____________________.'),
      slip('Second Detail Slip', 'Second pretend detail: ____________________.'),
      slip('Same Slip', 'Both details are the same because: ____________________.'),
      slip('Different Slip', 'The details are different because: ____________________.'),
      slip('But Slip', 'The compare sentence uses but: ____________________.'),
      slip('While Slip', 'The compare sentence uses while: ____________________.'),
      slip('Paper Band Check Slip', 'Paper band check for this sentence: ____________________.'),
      slip('Two Detail Compare Slip', 'The first detail is ____ and the second detail is ____.'),
      slip('Quiet Blank Slip', 'One blank I can finish later: ____________________.'),
      slip('Adult-Led Later Slip', 'Next time, I can compare one more invented detail: ____________________.'),
    ],
    optionalAdultPrompts: [
      'Ask which small pretend detail the writer notices first: ____________________.',
      'Ask which second detail can sit beside it on the paper band: ____________________.',
      'Ask what is the same without using real-life facts: ____________________.',
      'Ask what is different inside the invented story: ____________________.',
      'Ask for one short compare sentence with but or while: ____________________.',
      'Ask where the paper band check belongs on the card: ____________________.',
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
      id: `paper-band-compare-card-${number}`,
      title: `${title} Paper Band Story Compare Card`,
      worldSlug,
      ageBand: worldAges[worldSlug],
      compareSkill: `compare one fictional ${title} detail with a second detail using same, different, but or while, one compare sentence, and a paper band check: ____________________.`,
      useCase: `Adult-led fictional offline paper-only compare card for a made-up ${title} story: ____________________.`,
      adultSetup: `Adult: set out a blank page, pencil, and a pretend paper band before the ${title} compare begins: ____________________.`,
      kidDirection: `Writer: keep every ${title} idea invented while the comparison stays on paper: ____________________.`,
      firstDetailPrompt: `First detail: write one pretend detail from the ${title} story: ____________________.`,
      secondDetailPrompt: `Second detail: write another made-up detail from the same story: ____________________.`,
      samePrompt: `Same: write one way both details are the same inside the pretend story: ____________________.`,
      differentPrompt: `Different: write one way the two details are different inside the pretend story: ____________________.`,
      compareSentencePrompt: `Compare sentence: write one sentence with but or while that compares the two details: ____________________.`,
      paperBandCheckPrompt: `Paper band check: mark which paper band holds the clearest comparison: ____________________.`,
      quietOptionLine: `Quiet option: adult and writer fill only the first detail and second detail blanks first: ____________________.`,
      takeHomeLine: `Take-home line: save this paper compare card for one later adult-led detail pass: ____________________.`,
    }
  })
}

function makeSource() {
  const tools = makeTools()
  return {
    batchId: '2026-06-04-batch68',
    generatedAt: '2026-06-04',
    productSlug: 'paper-band-story-compare-card-pack',
    title: 'Paper Band Story Compare Card Pack',
    pricePoint: '$109',
    audience: 'Families, homeschool groups, tutors, and adult-led writing tables for writers ages 7-11.',
    sessionLength:
      '16 printable paper band story compare cards plus adult guide tools, compare routines, take-home compare slips, and optional adult prompts',
    safetyNote: safety,
    artifact: {
      pdfPath: 'product-build/paper-band-story-compare-card-pack/Paper-Band-Story-Compare-Card-Pack.pdf',
      zipPath: 'product-build/paper-band-story-compare-card-pack/paper-band-story-compare-card-pack.zip',
      sourceHtmlPath:
        'product-build/paper-band-story-compare-card-pack/source/paper-band-story-compare-card-pack.html',
      manifestPath: 'product-build/paper-band-story-compare-card-pack/manifest.json',
    },
    sourceFiles,
    worldSlugs,
    cover: {
      kicker: 'Printable paper band compare cards',
      headline: 'Paper Band Story Compare Card Pack',
      subhead:
        'Sixteen paper band cards help writers compare invented story details with same, different, but, while, and one short compare sentence.',
      included: [
        '16 printable paper band compare cards',
        'Adult setup guide',
        'Fictional compare safety notes',
        'First detail prompts',
        'Second detail prompts',
        'Same prompts',
        'Different prompts',
        'Compare sentence prompts',
        'Paper band check prompts',
        'Six adult-led compare routines',
        'Ten take-home compare slips',
        'Printable PDF and ZIP artifact',
      ],
    },
    adultGuide: tools.adultGuide,
    compareRoutines: tools.compareRoutines,
    takeHomeCompareSlips: tools.takeHomeCompareSlips,
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
    headline: 'Printable paper band compare cards for private fictional story thinking.',
    summary: 'Sixteen paper band compare cards help kids compare two invented story details.',
    heroImage: 'images/plotsprout/batch68/paper-band-story-compare-card-pack.jpg',
    ctaLabel: 'Request paper band compare pack launch notice',
    ctaHref: 'mailto:samfrench@gmail.com?subject=Paper%20Band%20Story%20Compare%20Card%20Pack',
    checkoutNote:
      'Checkout stays pending until Sam chooses a hosted sales path; this static page is ready for later hosted wiring but does not sell yet.',
    safetyNote: safety,
    worldSlugs: source.worldSlugs,
    includedPages: source.cover.included,
    useCases: [
      'A family paper table for comparing two invented story details',
      'A homeschool writing station for same, different, but, and while practice',
      'A tutoring pack for writers who need concrete comparison support',
      'An adult-led small group activity for private paper-only story thinking',
    ],
    parentSteps: [
      'Print one compare card and set it beside a blank page.',
      'Ask for two invented details before asking what is the same.',
      'Let the child point, dictate, sketch, or write one short line per blank.',
      'Close with a paper band check and keep every comparison fictional.',
    ],
    worldSummaries: source.cards.map((card) => ({
      slug: card.worldSlug,
      title: titleForSlug(card.worldSlug),
      ageBand: card.ageBand,
      summary: `A pretend ${titleForSlug(card.worldSlug)} world for comparing invented story details on paper.`,
    })),
  }
}

function fakePdf(pageCount) {
  const pages = Array.from({ length: pageCount }, (_, index) => `${index + 1} 0 obj\n<< /Type /Page >>\nendobj`)
  const kids = Array.from({ length: pageCount }, (_, index) => `${index + 1} 0 R`).join(' ')
  return Buffer.from(`%PDF-1.4\n${pages.join('\n')}\n${pageCount + 1} 0 obj\n<< /Type /Pages /Kids [${kids}] /Count ${pageCount} >>\nendobj\ntrailer\n<<>>\n%%EOF`)
}

function makeImageRoot(source) {
  const imageRoot = mkdtempSync(resolve(tmpdir(), 'paper-band-compare-images-'))
  for (const slug of source.worldSlugs) writeFileSync(resolve(imageRoot, `${slug}.jpg`), `image ${slug}`)
  return imageRoot
}

function writeTempLaneFiles(source, sourceRoot) {
  for (const file of source.sourceFiles) mkdirSync(dirname(resolve(sourceRoot, file)), { recursive: true })
  writeFileSync(resolve(sourceRoot, source.sourceFiles[0]), JSON.stringify(source.cards.slice(0, 6), null, 2))
  writeFileSync(resolve(sourceRoot, source.sourceFiles[1]), JSON.stringify(source.cards.slice(6, 11), null, 2))
  writeFileSync(resolve(sourceRoot, source.sourceFiles[2]), JSON.stringify(source.cards.slice(11), null, 2))
  writeFileSync(
    resolve(sourceRoot, source.sourceFiles[3]),
    JSON.stringify(
      {
        adultGuide: source.adultGuide,
        compareRoutines: source.compareRoutines,
        takeHomeCompareSlips: source.takeHomeCompareSlips,
        optionalAdultPrompts: source.optionalAdultPrompts,
      },
      null,
      2,
    ),
  )
}

describe('Paper Band Story Compare Card Pack', () => {
  it('uses the exact Batch68 world order, display ages, and recent-batch overlap counts', () => {
    expect(worldSlugs).toEqual([
      'mitten-market-lost-ticket',
      'moon-muffin-market',
      'acorn-avenue-errand-office',
      'button-bakery-map-mixup',
      'penny-path-compass-shop',
      'rain-boot-route-rangers',
      'compost-clock-workshop',
      'orchard-pulley-post',
      'pond-bridge-blueprint-club',
      'seed-library-map-room',
      'tidepool-timekeepers-lab',
      'almost-invention-workshop',
      'blue-pencil-observatory',
      'chapter-gate-greenhouse',
      'pencil-dragon-academy',
      'revision-river-ferry',
    ])
    expect(Object.values(worldAges)).toEqual([
      '7-8',
      '7-8',
      '7-9',
      '7-9',
      '7-9',
      '7-9',
      '8-10',
      '8-10',
      '8-10',
      '8-10',
      '8-10',
      '10-11',
      '10-11',
      '10-11',
      '10-11',
      '10-11',
    ])
    expect(overlapCount(worldSlugs, batchWorldSlugs(59))).toBe(6)
    expect(overlapCount(worldSlugs, batchWorldSlugs(60))).toBe(6)
    expect(overlapCount(worldSlugs, batchWorldSlugs(61))).toBe(7)
    expect(overlapCount(worldSlugs, batchWorldSlugs(62))).toBe(8)
    expect(overlapCount(worldSlugs, batchWorldSlugs(63))).toBe(6)
    expect(overlapCount(worldSlugs, batchWorldSlugs(64))).toBe(6)
    expect(overlapCount(worldSlugs, batchWorldSlugs(65))).toBe(6)
    expect(overlapCount(worldSlugs, batchWorldSlugs(66))).toBe(6)
    expect(overlapCount(worldSlugs, batchWorldSlugs(67))).toBe(6)
  })

  it('validates a complete source and checkout-pending product contract', () => {
    const source = makeSource()
    const product = makeProduct(source)

    expect(source.cards).toHaveLength(16)
    expect(source.cards.every((card) => JSON.stringify(Object.keys(card)) === JSON.stringify(cardKeys))).toBe(true)
    expect(validatePaperBandStoryCompareCardPackSource(source, product, knownWorldAges)).toEqual([])
    expect(validateProductWorldSummaries(product, 'Batch68 product')).toEqual([])
    expect(product.status).toBe('checkout_pending')
    expect(product.ctaHref).toContain('mailto:')
    expect(product.ctaHref).toContain('Paper%20Band%20Story%20Compare%20Card%20Pack')
    expect(product.heroImage).toBe('images/plotsprout/batch68/paper-band-story-compare-card-pack.jpg')
  })

  it('rejects stale display ages and unsafe public review/source language', () => {
    const source = makeSource()
    source.cards[1] = {
      ...source.cards[1],
      ageBand: '6-8',
      compareSentencePrompt:
        'Compare sentence: write a public review that cites a source for the real book: ____________________.',
    }

    const errors = validatePaperBandStoryCompareCardPackSource(source, makeProduct(source), knownWorldAges).join('\n')

    expect(errors).toMatch(/cards\\[1\\]\\.ageBand/)
    expect(errors).toMatch(/public|review|source|real book/i)
  })

  it('renders the printable compare fields into deterministic HTML', () => {
    const source = makeSource()
    const imageMap = new Map(worldSlugs.map((slug) => [slug, `assets/${slug}.jpg`]))

    const html = renderPaperBandStoryCompareCardPackHtml(source, worlds, imageMap)

    expect(html).toContain('Paper Band Story Compare Card Pack')
    expect(html).toContain('Ages 7-8')
    expect(html).not.toContain('Ages 6-8')
    expect(html).toContain('First detail')
    expect(html).toContain('Second detail')
    expect(html).toContain('Same')
    expect(html).toContain('Different')
    expect(html).toContain('Compare sentence')
    expect(html).toContain('Paper band check')
    expect(html).toContain('assets/pond-bridge-blueprint-club.jpg')
    expect(html).not.toMatch(/\b(public|address|rating|review|quote|citation|source)\b/i)
  })

  it('builds deterministic PDF, source, README, manifest, and ZIP files', async () => {
    const tmpRoot = mkdtempSync(resolve(tmpdir(), 'paper-band-compare-pack-'))
    const tempLanes = mkdtempSync(resolve(tmpdir(), 'paper-band-compare-lanes-'))
    let imageRoot

    try {
      const source = makeSource()
      imageRoot = makeImageRoot(source)
      writeTempLaneFiles(source, tempLanes)

      const output = await buildPaperBandStoryCompareCardPack({
        outputDir: resolve(tmpRoot, 'artifact'),
        source,
        product: makeProduct(source),
        worlds,
        imageRoot,
        sourceFilesRoot: tempLanes,
        pdfRenderer: async () => fakePdf(21),
      })
      const expectedZipEntries = [
        'Paper-Band-Story-Compare-Card-Pack.pdf',
        'README.txt',
        'source/paper-band-story-compare-card-pack.html',
        ...output.manifest.files.assets.map((asset) => asset.path),
      ]
      const status = inspectArtifactFiles(
        output.buildDir,
        {
          pdfPath: 'Paper-Band-Story-Compare-Card-Pack.pdf',
          zipPath: 'paper-band-story-compare-card-pack.zip',
          sourceHtmlPath: 'source/paper-band-story-compare-card-pack.html',
          manifestPath: 'manifest.json',
        },
        {
          expectedPdfPages: 21,
          expectedZipEntries,
        },
      )

      expect(output.manifest.productSlug).toBe('paper-band-story-compare-card-pack')
      expect(output.manifest.sourcePageCount).toBe(16)
      expect(output.manifest.files.assets).toHaveLength(16)
      expect(readFileSync(output.htmlPath, 'utf8')).toContain('Paper Band Story Compare Card Pack')
      expect(status.valid).toBe(true)
    } finally {
      rmSync(tmpRoot, { recursive: true, force: true })
      rmSync(tempLanes, { recursive: true, force: true })
      if (imageRoot) rmSync(imageRoot, { recursive: true, force: true })
    }
  })

  it('keeps committed source lane files in sync once generated', () => {
    const sourcePath = resolve(root, 'content/product-artifacts/paper-band-story-compare-card-pack.json')
    if (!existsSync(sourcePath)) return

    const source = readJson('content/product-artifacts/paper-band-story-compare-card-pack.json')
    const products = readJson('content/products/batch5-products.json').products
    const product = products.find((candidate) => candidate.slug === source.productSlug)

    expect(validatePaperBandStoryCompareCardPackSource(source, product, knownWorldAges)).toEqual([])
    expect(validatePaperBandStoryCompareCardPackSourceFiles(source, root)).toEqual([])
  })
})
