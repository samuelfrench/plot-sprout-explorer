import { describe, expect, it } from 'vitest'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, resolve } from 'node:path'

import {
  inspectArtifactFiles,
  validatePaperTabStoryInferenceCardPackSource,
  validatePaperTabStoryInferenceCardPackSourceFiles,
  validateProductWorldSummaries,
} from './product-artifact-policy.mjs'
import {
  buildPaperTabStoryInferenceCardPack,
  renderPaperTabStoryInferenceCardPackHtml,
} from './paper-tab-story-inference-card-pack-builder.mjs'

const root = resolve(import.meta.dirname, '..')
const safety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, and no identifying facts.'

const sourceFiles = [
  'content/product-artifacts/lanes/batch66-paper-tab-story-inference-cards-a.json',
  'content/product-artifacts/lanes/batch66-paper-tab-story-inference-cards-b.json',
  'content/product-artifacts/lanes/batch66-paper-tab-story-inference-cards-c.json',
  'content/product-artifacts/lanes/batch66-paper-tab-story-inference-tools.json',
]

const worldAges = {
  'puddle-planet-post-office': '7-8',
  'moon-muffin-market': '7-8',
  'teacup-town-weather-window': '7-8',
  'mitten-market-lost-ticket': '7-8',
  'button-bakery-map-mixup': '7-9',
  'penny-path-compass-shop': '7-9',
  'spoon-ferry-lunchbox-harbor': '7-9',
  'buttonwood-library-train': '7-9',
  'rain-boot-route-rangers': '7-9',
  'cloudberry-clocktower': '8-10',
  'rain-gauge-railway': '8-10',
  'pantry-measurement-mystery': '8-10',
  'solar-oven-picnic-station': '8-10',
  'appendix-archive-lab': '10-11',
  'chapter-gate-greenhouse': '10-11',
  'binding-day-boardwalk': '10-11',
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
      premise: 'A friendly invented world for an adult-led paper inference card.',
    },
  ]),
)

const cardKeys = [
  'id',
  'title',
  'worldSlug',
  'ageBand',
  'inferenceSkill',
  'useCase',
  'adultSetup',
  'kidDirection',
  'cluePrompt',
  'suggestsPrompt',
  'whyPrompt',
  'secondCluePrompt',
  'inferenceSentencePrompt',
  'paperTabCheckPrompt',
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
    57: 'content/product-artifacts/pocket-folder-story-goal-path-card-pack.json',
    58: 'content/product-artifacts/hanging-file-story-decision-point-card-pack.json',
    59: 'content/product-artifacts/file-box-story-turning-point-card-pack.json',
    60: 'content/product-artifacts/archive-drawer-story-resolution-card-pack.json',
    61: 'content/product-artifacts/card-catalog-story-retell-card-pack.json',
    62: 'content/product-artifacts/library-pocket-story-summary-card-pack.json',
    63: 'content/product-artifacts/shelf-marker-story-theme-card-pack.json',
    64: 'content/product-artifacts/bookend-story-evidence-card-pack.json',
    65: 'content/product-artifacts/page-flag-story-reason-chain-card-pack.json',
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
      'Adult points to one inference blank: ____________________.',
      'Writer names one invented clue: ____________________.',
      'Adult asks what the clue might suggest inside the pretend story: ____________________.',
      'Writer writes one short paper inference sentence: ____________________.',
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
      title: 'Paper Tab Inference Adult Guide: ____________________.',
      setupSteps: [
        'Place one inference card, blank paper, pencil, and two paper tabs on the table: ____________________.',
        'Choose one fictional world and read the card title aloud: ____________________.',
        'Point to the clue, might suggest, why, second clue, inference sentence, and paper tab check blanks: ____________________.',
        'Let the writer point, dictate, sketch, or write short paper lines: ____________________.',
        'Close by reading the inference sentence and paper tab check together: ____________________.',
      ],
      facilitationNotes: [
        'Keep the pace calm and adult-led with one paper blank at a time: ____________________.',
        'Accept short invented phrases before asking for a full inference sentence: ____________________.',
        'Use the might suggest blank to connect clues without asking for personal facts: ____________________.',
        'If the writer stalls, fill only the first clue and might suggest blank first: ____________________.',
        'Use the paper tab check as a quiet paper mark, not as a correction mark: ____________________.',
      ],
      safetyNotes: [
        'Use pretend names, broad made-up places, and invented actions: ____________________.',
        'Do not ask for real school, home, schedule, or identity details: ____________________.',
        'Do not collect child writing or identifying facts: ____________________.',
        'Keep every prompt offline, paper-only, and adult-led: ____________________.',
        'Keep paper tabs fictional and separate from real shelf or online systems: ____________________.',
      ],
    },
    inferenceRoutines: [
      routine('First Clue Start', 'Use when the writer needs one pretend clue.'),
      routine('Might Suggest Link', 'Use when the writer needs to say what the clue might suggest.'),
      routine('Why It Fits', 'Use when the writer needs a short why line.'),
      routine('Second Clue Support', 'Use when the writer needs a second invented clue.'),
      routine('Inference Sentence Draft', 'Use when the writer needs one inference sentence.'),
      routine('Paper Tab Check Finish', 'Use when the sentence is ready to mark on paper.'),
    ],
    takeHomeInferenceSlips: [
      slip('First Clue Slip', 'First pretend clue: ____________________.'),
      slip('Might Suggest Slip', 'This clue might suggest: ____________________.'),
      slip('Why Slip', 'This fits the pretend story because: ____________________.'),
      slip('Second Clue Slip', 'Second pretend clue: ____________________.'),
      slip('Two Clue Slip', 'The two invented clues are ____ and ____.'),
      slip('Inference Sentence Slip', 'My short inference sentence is: ____________________.'),
      slip('Paper Tab Check Slip', 'Paper tab check for this sentence: ____________________.'),
      slip('Clue And Suggest Slip', 'The clue is ____ and it might suggest ____.'),
      slip('Quiet Blank Slip', 'One blank I can finish later: ____________________.'),
      slip('Adult-Led Later Slip', 'Next time, I can add one more invented clue: ____________________.'),
    ],
    optionalAdultPrompts: [
      'Ask which small pretend clue the writer notices first: ____________________.',
      'Ask what that clue might suggest inside the invented story: ____________________.',
      'Ask why that suggestion fits without using real-life facts: ____________________.',
      'Ask which second clue keeps the inference moving: ____________________.',
      'Ask for one short inference sentence, not a correction mark: ____________________.',
      'Ask where the paper tab check belongs on the paper card: ____________________.',
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
      id: `paper-tab-inference-card-${number}`,
      title: `${title} Inference Card`,
      worldSlug,
      ageBand: worldAges[worldSlug],
      inferenceSkill: `connect a fictional ${title} clue to what it might suggest, a why line, a second clue, one inference sentence, and a paper tab check: ____________________.`,
      useCase: `Adult-led fictional offline paper-only inference card for a made-up ${title} story: ____________________.`,
      adultSetup: `Adult: set out a blank page, pencil, and two paper tabs before the ${title} inference begins: ____________________.`,
      kidDirection: `Writer: keep every ${title} idea invented while the inference stays on paper: ____________________.`,
      cluePrompt: `Clue: write one pretend clue from the ${title} story: ____________________.`,
      suggestsPrompt: `Might suggest: write what that clue might suggest in the story: ____________________.`,
      whyPrompt: `Why: write why that suggestion fits the pretend clue: ____________________.`,
      secondCluePrompt: `Second clue: write another invented clue that fits the same inference: ____________________.`,
      inferenceSentencePrompt: `Inference sentence: write one sentence using the clues and what they might suggest: ____________________.`,
      paperTabCheckPrompt: `Paper tab check: mark which paper tab shows the strongest clue: ____________________.`,
      quietOptionLine: `Quiet option: adult and writer fill only the clue and might suggest blanks first: ____________________.`,
      takeHomeLine: `Take-home line: save this paper inference card for one later adult-led clue pass: ____________________.`,
    }
  })
}

function makeSource() {
  const tools = makeTools()
  return {
    batchId: '2026-06-04-batch66',
    generatedAt: '2026-06-04',
    productSlug: 'paper-tab-story-inference-card-pack',
    title: 'Paper Tab Story Inference Card Pack',
    pricePoint: '$105',
    audience: 'Families, homeschool groups, tutors, and adult-led writing tables for writers ages 7-11.',
    sessionLength:
      '16 printable paper tab story inference cards plus adult guide tools, inference routines, take-home inference slips, and optional adult prompts',
    safetyNote: safety,
    artifact: {
      pdfPath:
        'product-build/paper-tab-story-inference-card-pack/Paper-Tab-Story-Inference-Card-Pack.pdf',
      zipPath:
        'product-build/paper-tab-story-inference-card-pack/paper-tab-story-inference-card-pack.zip',
      sourceHtmlPath:
        'product-build/paper-tab-story-inference-card-pack/source/paper-tab-story-inference-card-pack.html',
      manifestPath: 'product-build/paper-tab-story-inference-card-pack/manifest.json',
    },
    sourceFiles: [...sourceFiles],
    worldSlugs: [...worldSlugs],
    cover: {
      kicker: 'Printable paper tab inference cards',
      headline: 'Paper Tab Story Inference Card Pack',
      subhead:
        'Sixteen paper tab cards help writers connect invented story clues to what they might suggest, why they fit, and one short inference sentence.',
      included: [
        '16 printable paper tab inference cards',
        'Adult setup guide',
        'Fictional inference safety notes',
        'Clue prompts',
        'Might suggest prompts',
        'Why prompts',
        'Second clue prompts',
        'Inference sentence prompts',
        'Paper tab check prompts',
        'Six adult-led inference routines',
        'Ten take-home inference slips',
        'Printable PDF and ZIP artifact',
      ],
    },
    adultGuide: tools.adultGuide,
    inferenceRoutines: tools.inferenceRoutines,
    takeHomeInferenceSlips: tools.takeHomeInferenceSlips,
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
    headline: 'Printable paper tab inference cards for private fictional story thinking.',
    summary:
      'Sixteen paper tab inference cards help kids connect invented story clues with what they might suggest and short inference sentences.',
    heroImage: 'images/plotsprout/batch66/paper-tab-story-inference-card-pack.jpg',
    ctaLabel: 'Request paper tab inference pack launch notice',
    ctaHref: 'mailto:samfrench@gmail.com?subject=Paper%20Tab%20Story%20Inference%20Card%20Pack',
    checkoutNote:
      'Checkout is pending until the payment provider is selected; this static paper tab inference pack page is ready for hosted checkout wiring but does not accept payment yet.',
    safetyNote: source.safetyNote,
    worldSlugs: [...source.worldSlugs],
    worldSummaries: source.worldSlugs.map((slug) => ({
      slug,
      title: titleForSlug(slug),
      ageBand: source.cards.find((card) => card.worldSlug === slug)?.ageBand,
      summary: `A pretend ${titleForSlug(slug)} world for connecting invented story clues to inference sentences on paper.`,
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
      inferenceRoutines: source.inferenceRoutines,
      takeHomeInferenceSlips: source.takeHomeInferenceSlips,
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
  const imageRoot = mkdtempSync(resolve(tmpdir(), 'plotsprout-batch66-images-'))
  for (const slug of source.worldSlugs) {
    writeFileSync(resolve(imageRoot, `${slug}.jpg`), `fake jpeg bytes for ${slug}`)
  }
  return imageRoot
}

describe('Paper Tab Story Inference Card Pack', () => {
  it('validates the canonical source shape, safety, lanes, worlds, and artifact paths', () => {
    const source = makeSource()
    const product = makeProduct(source)

    expect(validatePaperTabStoryInferenceCardPackSource(source, product, knownWorldAges)).toEqual([])

    expect(source.cards).toHaveLength(16)
    expect(source.inferenceRoutines).toHaveLength(6)
    expect(source.takeHomeInferenceSlips).toHaveLength(10)
    expect(source.optionalAdultPrompts).toHaveLength(8)
    expect(source.sourceFiles).toEqual(sourceFiles)
    expect(source.worldSlugs).toEqual(worldSlugs)
    for (const [batchNumber, expected] of [
      [57, 6],
      [58, 6],
      [59, 6],
      [60, 6],
      [61, 6],
      [62, 7],
      [63, 7],
      [64, 7],
      [65, 6],
    ]) {
      expect(overlapCount(source.worldSlugs, batchWorldSlugs(batchNumber))).toBe(expected)
    }
    expect(source.artifact).toEqual({
      pdfPath:
        'product-build/paper-tab-story-inference-card-pack/Paper-Tab-Story-Inference-Card-Pack.pdf',
      zipPath:
        'product-build/paper-tab-story-inference-card-pack/paper-tab-story-inference-card-pack.zip',
      sourceHtmlPath:
        'product-build/paper-tab-story-inference-card-pack/source/paper-tab-story-inference-card-pack.html',
      manifestPath: 'product-build/paper-tab-story-inference-card-pack/manifest.json',
    })
  })

  it('rejects unsafe inference content and real-source framing', () => {
    const source = makeSource()
    source.cards[0].inferenceSentencePrompt =
      'Copy a quote from a real book review and cite the source: ____________________.'

    const errors = validatePaperTabStoryInferenceCardPackSource(source, makeProduct(source), knownWorldAges)
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
      source.cards[0].inferenceSentencePrompt = `inference sentence: make this ${phrase} version of the story: ____________________.`

      const errors = validatePaperTabStoryInferenceCardPackSource(source, makeProduct(source), knownWorldAges)
      expect(errors.join('\n'), phrase).toMatch(
        /showcase|portfolio|display|perfect|episode|chapter book|screenplay|cliffhanger|plot twist|choose your own adventure|publishable|publish/i,
      )
    }
  })

  it('validates committed source files and product metadata when present', () => {
    const source = readJson('content/product-artifacts/paper-tab-story-inference-card-pack.json')
    const products = readJson('content/products/batch5-products.json').products
    const product = products.find((candidate) => candidate.slug === source.productSlug)

    expect(validatePaperTabStoryInferenceCardPackSource(source, product, knownWorldAges)).toEqual([])
    expect(validatePaperTabStoryInferenceCardPackSourceFiles(source, root)).toEqual([])

    expect(product.status).toBe('checkout_pending')
    expect(product.pricePoint).toBe('$105')
    expect(product.ctaHref).toContain('mailto:')
    expect(product.ctaHref).toContain('Paper%20Tab%20Story%20Inference%20Card%20Pack')
    expect(product.heroImage).toBe('images/plotsprout/batch66/paper-tab-story-inference-card-pack.jpg')
    expect(validateProductWorldSummaries(product, 'Batch66 product')).toEqual([])
  })

  it('renders the printable inference fields into deterministic HTML', () => {
    const source = makeSource()
    const imageMap = new Map(worldSlugs.map((slug) => [slug, `assets/${slug}.jpg`]))

    const html = renderPaperTabStoryInferenceCardPackHtml(source, worlds, imageMap)

    expect(html).toContain('Paper Tab Story Inference Card Pack')
    expect(html).toContain('Ages 7-8')
    expect(html).not.toContain('Ages 6-8')
    expect(html).toContain('Clue:')
    expect(html).toContain('Might suggest:')
    expect(html).toContain('Why:')
    expect(html).toContain('Second clue:')
    expect(html).toContain('Inference sentence:')
    expect(html).toContain('Paper tab check:')
    expect(html).toContain('assets/buttonwood-library-train.jpg')
    expect(html).not.toMatch(/\b(public|address|rating|review|quote|citation|source)\b/i)
  })

  it('builds deterministic PDF, source, README, manifest, and ZIP files', async () => {
    const tmpRoot = mkdtempSync(resolve(tmpdir(), 'page-flag-inference-pack-'))
    const tempLanes = mkdtempSync(resolve(tmpdir(), 'page-flag-inference-lanes-'))
    let imageRoot

    try {
      const source = makeSource()
      imageRoot = makeImageRoot(source)
      writeTempLaneFiles(source, tempLanes)

      const first = await buildPaperTabStoryInferenceCardPack({
        outputDir: resolve(tmpRoot, 'first'),
        source,
        product: makeProduct(source),
        worlds,
        imageRoot,
        sourceFilesRoot: tempLanes,
        pdfRenderer: () => Buffer.from('%PDF-1.7\n1 0 obj\n<<>>\nendobj\n%%EOF\n'),
      })
      const second = await buildPaperTabStoryInferenceCardPack({
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
            'Batch66 temp artifact',
          ),
        ).toEqual([])
        expect(readFileSync(output.htmlPath, 'utf8')).toContain('Paper Tab Story Inference Card Pack')
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
