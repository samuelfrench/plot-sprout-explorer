import { describe, expect, it } from 'vitest'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, resolve } from 'node:path'

import {
  inspectArtifactFiles,
  validatePageFlagStoryReasonChainCardPackSource,
  validatePageFlagStoryReasonChainCardPackSourceFiles,
  validateProductWorldSummaries,
} from './product-artifact-policy.mjs'
import {
  buildPageFlagStoryReasonChainCardPack,
  renderPageFlagStoryReasonChainCardPackHtml,
} from './page-flag-story-reason-chain-card-pack-builder.mjs'

const root = resolve(import.meta.dirname, '..')
const safety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, and no identifying facts.'

const sourceFiles = [
  'content/product-artifacts/lanes/batch65-page-flag-reason-chain-cards-a.json',
  'content/product-artifacts/lanes/batch65-page-flag-reason-chain-cards-b.json',
  'content/product-artifacts/lanes/batch65-page-flag-reason-chain-cards-c.json',
  'content/product-artifacts/lanes/batch65-page-flag-reason-chain-tools.json',
]

const worldAges = {
  'buttonwood-library-train': '7-9',
  'pencil-dragon-academy': '10-11',
  'compass-craft-academy': '10-11',
  'pantry-measurement-mystery': '8-10',
  'paperclip-plaza-parcel-day': '7-9',
  'pond-bridge-blueprint-club': '8-10',
  'tiny-lantern-reef': '8-10',
  'appendix-archive-lab': '10-11',
  'blue-pencil-observatory': '10-11',
  'chapter-gate-greenhouse': '10-11',
  'moss-message-observatory': '8-10',
  'pocket-park-notice-board': '7-9',
  'rain-boot-route-rangers': '7-9',
  'tidepool-timekeepers-lab': '8-10',
  'clue-label-tower-museum': '10-11',
  'teacup-town-weather-window': '7-8',
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
      premise: 'A friendly invented world for an adult-led paper reason-chain card.',
    },
  ]),
)

const cardKeys = [
  'id',
  'title',
  'worldSlug',
  'ageBand',
  'reasonSkill',
  'useCase',
  'adultSetup',
  'kidDirection',
  'storyIdeaPrompt',
  'firstDetailPrompt',
  'firstReasonPrompt',
  'secondDetailPrompt',
  'becauseBridgePrompt',
  'reasonChainSentencePrompt',
  'pageFlagCheckPrompt',
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
    56: 'content/product-artifacts/manila-folder-story-clue-trail-card-pack.json',
    57: 'content/product-artifacts/pocket-folder-story-goal-path-card-pack.json',
    58: 'content/product-artifacts/hanging-file-story-decision-point-card-pack.json',
    59: 'content/product-artifacts/file-box-story-turning-point-card-pack.json',
    60: 'content/product-artifacts/archive-drawer-story-resolution-card-pack.json',
    61: 'content/product-artifacts/card-catalog-story-retell-card-pack.json',
    62: 'content/product-artifacts/library-pocket-story-summary-card-pack.json',
    63: 'content/product-artifacts/shelf-marker-story-theme-card-pack.json',
    64: 'content/product-artifacts/bookend-story-evidence-card-pack.json',
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
      'Adult points to one reason-chain blank: ____________________.',
      'Writer names one invented story detail: ____________________.',
      'Adult asks why the detail supports the story idea: ____________________.',
      'Writer writes one short paper reason-chain sentence: ____________________.',
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
      title: 'Page Flag Reason Chain Adult Guide: ____________________.',
      setupSteps: [
        'Place one reason-chain card, blank paper, pencil, and two paper page flags on the table: ____________________.',
        'Choose one fictional world and read the card title aloud: ____________________.',
        'Point to the story idea, detail, reason, because bridge, sentence, and page flag check blanks: ____________________.',
        'Let the writer point, dictate, sketch, or write short paper lines: ____________________.',
        'Close by reading the reason-chain sentence and page flag check together: ____________________.',
      ],
      facilitationNotes: [
        'Keep the pace calm and adult-led with one paper blank at a time: ____________________.',
        'Accept short invented phrases before asking for a full reason-chain sentence: ____________________.',
        'Use the because bridge to connect details without asking for personal facts: ____________________.',
        'If the writer stalls, fill only the story idea and first detail first: ____________________.',
        'Use the page flag check as a quiet paper mark, not as a correction mark: ____________________.',
      ],
      safetyNotes: [
        'Use pretend names, broad made-up places, and invented actions: ____________________.',
        'Do not ask for real school, home, schedule, or identity details: ____________________.',
        'Do not collect child writing or identifying facts: ____________________.',
        'Keep every prompt offline, paper-only, and adult-led: ____________________.',
        'Keep page flags fictional and separate from real shelf or online systems: ____________________.',
      ],
    },
    reasonChainRoutines: [
      routine('Story Idea Start', 'Use when the writer needs one small story idea.'),
      routine('First Detail Link', 'Use when the writer needs one invented detail.'),
      routine('First Reason Bridge', 'Use when the writer needs a reason for the detail.'),
      routine('Second Detail Support', 'Use when the writer needs a second support detail.'),
      routine('Because Bridge Draft', 'Use when the writer needs to connect idea and details.'),
      routine('Page Flag Check Finish', 'Use when the sentence is ready to mark on paper.'),
    ],
    takeHomeReasonSlips: [
      slip('Story Idea Slip', 'Story idea from the pretend page: ____________________.'),
      slip('First Detail Slip', 'First detail I noticed in the pretend story: ____________________.'),
      slip('First Reason Slip', 'This detail supports the story idea because: ____________________.'),
      slip('Second Detail Slip', 'Second detail that helps the reason chain: ____________________.'),
      slip('Because Bridge Slip', 'The because bridge says: ____________________.'),
      slip('Reason-Chain Sentence Slip', 'My short reason-chain sentence is: ____________________.'),
      slip('Page Flag Check Slip', 'Paper page flag check for this sentence: ____________________.'),
      slip('Idea And Detail Slip', 'The story idea is ____ and the first detail is ____.'),
      slip('Two Detail Slip', 'The two invented details are ____ and ____.'),
      slip('Adult-Led Later Slip', 'Next time, I can add one more invented reason: ____________________.'),
    ],
    optionalAdultPrompts: [
      'Ask which small story idea the writer can explain: ____________________.',
      'Ask which invented detail belongs beside the first page flag: ____________________.',
      'Ask why that detail supports the story idea without using real-life facts: ____________________.',
      'Ask which second detail keeps the reason chain moving: ____________________.',
      'Ask for one short reason-chain sentence, not a correction mark: ____________________.',
      'Ask where the page flag check belongs on the paper card: ____________________.',
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
      id: `page-flag-reason-chain-card-${number}`,
      title: `${title} Reason Chain Card`,
      worldSlug,
      ageBand: worldAges[worldSlug],
      reasonSkill: `connect a fictional ${title} story idea to two invented details, a because bridge, one reason-chain sentence, and a page flag check: ____________________.`,
      useCase: `Adult-led fictional offline paper-only reason-chain card for a made-up ${title} story page: ____________________.`,
      adultSetup: `Adult: set out a blank page, pencil, and two paper page flags before the ${title} reason chain begins: ____________________.`,
      kidDirection: `Writer: keep every ${title} idea invented while the reason chain stays on paper: ____________________.`,
      storyIdeaPrompt: `Story idea: write one small pretend idea about the ${title} story: ____________________.`,
      firstDetailPrompt: `First detail: write one invented detail that helps the story idea: ____________________.`,
      firstReasonPrompt: `First reason: write why that detail supports the story idea: ____________________.`,
      secondDetailPrompt: `Second detail: write another invented detail that belongs with the first reason: ____________________.`,
      becauseBridgePrompt: `Because bridge: write how the details connect to the story idea: ____________________.`,
      reasonChainSentencePrompt: `Reason-chain sentence: write one sentence that uses the story idea, details, and because bridge: ____________________.`,
      pageFlagCheckPrompt: `Page flag check: mark which paper flag shows the strongest reason: ____________________.`,
      quietOptionLine: `Quiet option: adult and writer fill only the story idea, first detail, and because bridge first: ____________________.`,
      takeHomeLine: `Take-home line: save this paper reason-chain card for one later adult-led reason pass: ____________________.`,
    }
  })
}

function makeSource() {
  const tools = makeTools()
  return {
    batchId: '2026-06-04-batch65',
    generatedAt: '2026-06-04',
    productSlug: 'page-flag-story-reason-chain-card-pack',
    title: 'Page Flag Story Reason Chain Card Pack',
    pricePoint: '$103',
    audience: 'Families, homeschool groups, tutors, and adult-led writing tables for writers ages 7-11.',
    sessionLength:
      '16 printable page flag story reason-chain cards plus adult guide tools, reason routines, take-home reason slips, and optional adult prompts',
    safetyNote: safety,
    artifact: {
      pdfPath:
        'product-build/page-flag-story-reason-chain-card-pack/Page-Flag-Story-Reason-Chain-Card-Pack.pdf',
      zipPath:
        'product-build/page-flag-story-reason-chain-card-pack/page-flag-story-reason-chain-card-pack.zip',
      sourceHtmlPath:
        'product-build/page-flag-story-reason-chain-card-pack/source/page-flag-story-reason-chain-card-pack.html',
      manifestPath: 'product-build/page-flag-story-reason-chain-card-pack/manifest.json',
    },
    sourceFiles: [...sourceFiles],
    worldSlugs: [...worldSlugs],
    cover: {
      kicker: 'Printable page flag reason-chain cards',
      headline: 'Page Flag Story Reason Chain Card Pack',
      subhead:
        'Sixteen paper page flag cards help writers connect small fictional story ideas with details, reasons, because bridges, and one reason-chain sentence.',
      included: [
        '16 printable page flag reason-chain cards',
        'Adult setup guide',
        'Fictional reason-chain safety notes',
        'Story idea prompts',
        'First detail prompts',
        'First reason prompts',
        'Second detail prompts',
        'Because bridge prompts',
        'Reason-chain sentence prompts',
        'Six adult-led reason-chain routines',
        'Ten take-home reason slips',
        'Printable PDF and ZIP artifact',
      ],
    },
    adultGuide: tools.adultGuide,
    reasonChainRoutines: tools.reasonChainRoutines,
    takeHomeReasonSlips: tools.takeHomeReasonSlips,
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
    headline: 'Printable page flag reason-chain cards for private fictional story thinking.',
    summary:
      'Sixteen page flag reason-chain cards help kids connect fictional story ideas with details, because bridges, and short reason-chain sentences.',
    heroImage: 'images/plotsprout/batch65/page-flag-story-reason-chain-card-pack.jpg',
    ctaLabel: 'Request page flag reason chain pack launch notice',
    ctaHref: 'mailto:samfrench@gmail.com?subject=Page%20Flag%20Story%20Reason%20Chain%20Card%20Pack',
    checkoutNote:
      'Checkout is pending until the payment provider is selected; this static page flag reason-chain pack page is ready for hosted checkout wiring but does not accept payment yet.',
    safetyNote: source.safetyNote,
    worldSlugs: [...source.worldSlugs],
    worldSummaries: source.worldSlugs.map((slug) => ({
      slug,
      title: titleForSlug(slug),
      ageBand: source.cards.find((card) => card.worldSlug === slug)?.ageBand,
      summary: `A pretend ${titleForSlug(slug)} world for connecting one fictional story idea to reasons on paper.`,
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
      reasonChainRoutines: source.reasonChainRoutines,
      takeHomeReasonSlips: source.takeHomeReasonSlips,
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
  const imageRoot = mkdtempSync(resolve(tmpdir(), 'plotsprout-batch65-images-'))
  for (const slug of source.worldSlugs) {
    writeFileSync(resolve(imageRoot, `${slug}.jpg`), `fake jpeg bytes for ${slug}`)
  }
  return imageRoot
}

describe('Page Flag Story Reason Chain Card Pack', () => {
  it('validates the canonical source shape, safety, lanes, worlds, and artifact paths', () => {
    const source = makeSource()
    const product = makeProduct(source)

    expect(validatePageFlagStoryReasonChainCardPackSource(source, product, knownWorldAges)).toEqual([])

    expect(source.cards).toHaveLength(16)
    expect(source.reasonChainRoutines).toHaveLength(6)
    expect(source.takeHomeReasonSlips).toHaveLength(10)
    expect(source.optionalAdultPrompts).toHaveLength(8)
    expect(source.sourceFiles).toEqual(sourceFiles)
    expect(source.worldSlugs).toEqual(worldSlugs)
    for (const [batchNumber, expected] of [
      [56, 7],
      [57, 7],
      [58, 6],
      [59, 6],
      [60, 6],
      [61, 7],
      [62, 7],
      [63, 4],
      [64, 6],
    ]) {
      expect(overlapCount(source.worldSlugs, batchWorldSlugs(batchNumber))).toBe(expected)
    }
    expect(source.artifact).toEqual({
      pdfPath:
        'product-build/page-flag-story-reason-chain-card-pack/Page-Flag-Story-Reason-Chain-Card-Pack.pdf',
      zipPath:
        'product-build/page-flag-story-reason-chain-card-pack/page-flag-story-reason-chain-card-pack.zip',
      sourceHtmlPath:
        'product-build/page-flag-story-reason-chain-card-pack/source/page-flag-story-reason-chain-card-pack.html',
      manifestPath: 'product-build/page-flag-story-reason-chain-card-pack/manifest.json',
    })
  })

  it('rejects unsafe reason-chain content and real-source framing', () => {
    const source = makeSource()
    source.cards[0].reasonChainSentencePrompt =
      'Copy a quote from a real book review and cite the source: ____________________.'

    const errors = validatePageFlagStoryReasonChainCardPackSource(source, makeProduct(source), knownWorldAges)
    expect(errors.join('\n')).toMatch(/quote|review|cite|source|citation/i)
  })

  it('validates committed source files and product metadata when present', () => {
    const source = readJson('content/product-artifacts/page-flag-story-reason-chain-card-pack.json')
    const products = readJson('content/products/batch5-products.json').products
    const product = products.find((candidate) => candidate.slug === source.productSlug)

    expect(validatePageFlagStoryReasonChainCardPackSource(source, product, knownWorldAges)).toEqual([])
    expect(validatePageFlagStoryReasonChainCardPackSourceFiles(source, root)).toEqual([])

    expect(product.status).toBe('checkout_pending')
    expect(product.pricePoint).toBe('$103')
    expect(product.ctaHref).toContain('mailto:')
    expect(product.ctaHref).toContain('Page%20Flag%20Story%20Reason%20Chain%20Card%20Pack')
    expect(product.heroImage).toBe('images/plotsprout/batch65/page-flag-story-reason-chain-card-pack.jpg')
    expect(validateProductWorldSummaries(product, 'Batch65 product')).toEqual([])
  })

  it('renders the printable reason-chain fields into deterministic HTML', () => {
    const source = makeSource()
    const imageMap = new Map(worldSlugs.map((slug) => [slug, `assets/${slug}.jpg`]))

    const html = renderPageFlagStoryReasonChainCardPackHtml(source, worlds, imageMap)

    expect(html).toContain('Page Flag Story Reason Chain Card Pack')
    expect(html).toContain('Ages 7-8')
    expect(html).not.toContain('Ages 6-8')
    expect(html).toContain('Story idea:')
    expect(html).toContain('First detail:')
    expect(html).toContain('First reason:')
    expect(html).toContain('Second detail:')
    expect(html).toContain('Because bridge:')
    expect(html).toContain('Reason-chain sentence:')
    expect(html).toContain('Page flag check:')
    expect(html).toContain('assets/buttonwood-library-train.jpg')
    expect(html).not.toMatch(/\b(public|address|rating|review|quote|citation|source)\b/i)
  })

  it('builds deterministic PDF, source, README, manifest, and ZIP files', async () => {
    const tmpRoot = mkdtempSync(resolve(tmpdir(), 'page-flag-reason-chain-pack-'))
    const tempLanes = mkdtempSync(resolve(tmpdir(), 'page-flag-reason-chain-lanes-'))
    let imageRoot

    try {
      const source = makeSource()
      imageRoot = makeImageRoot(source)
      writeTempLaneFiles(source, tempLanes)

      const first = await buildPageFlagStoryReasonChainCardPack({
        outputDir: resolve(tmpRoot, 'first'),
        source,
        product: makeProduct(source),
        worlds,
        imageRoot,
        sourceFilesRoot: tempLanes,
        pdfRenderer: () => Buffer.from('%PDF-1.7\n1 0 obj\n<<>>\nendobj\n%%EOF\n'),
      })
      const second = await buildPageFlagStoryReasonChainCardPack({
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
            'Batch65 temp artifact',
          ),
        ).toEqual([])
        expect(readFileSync(output.htmlPath, 'utf8')).toContain('Page Flag Story Reason Chain Card Pack')
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
