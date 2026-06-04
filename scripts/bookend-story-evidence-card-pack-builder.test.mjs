import { describe, expect, it } from 'vitest'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, resolve } from 'node:path'

import {
  inspectArtifactFiles,
  validateBookendStoryEvidenceCardPackSource,
  validateBookendStoryEvidenceCardPackSourceFiles,
  validateProductWorldSummaries,
} from './product-artifact-policy.mjs'
import {
  buildBookendStoryEvidenceCardPack,
  renderBookendStoryEvidenceCardPackHtml,
} from './bookend-story-evidence-card-pack-builder.mjs'

const root = resolve(import.meta.dirname, '..')
const safety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, and no identifying facts.'

const sourceFiles = [
  'content/product-artifacts/lanes/batch64-bookend-evidence-cards-a.json',
  'content/product-artifacts/lanes/batch64-bookend-evidence-cards-b.json',
  'content/product-artifacts/lanes/batch64-bookend-evidence-cards-c.json',
  'content/product-artifacts/lanes/batch64-bookend-evidence-tools.json',
]

const worldAges = {
  'moon-muffin-market': '6-8',
  'puddle-planet-post-office': '6-8',
  'teacup-town-weather-window': '7-8',
  'button-bakery-map-mixup': '7-9',
  'penny-path-compass-shop': '7-9',
  'pocket-park-notice-board': '7-9',
  'greenhouse-gear-garden': '8-10',
  'orchard-pulley-post': '8-10',
  'rain-gauge-railway': '8-10',
  'cloudberry-clocktower': '8-10',
  'tiny-lantern-reef': '8-10',
  'almost-invention-workshop': '10-11',
  'clue-label-tower-museum': '10-11',
  'compass-craft-academy': '10-11',
  'margin-note-market': '10-11',
  'pencil-dragon-academy': '10-11',
}

const worldSlugs = Object.keys(worldAges)
const knownWorldAges = new Map(
  Object.entries(worldAges).map(([slug, ageBand]) => [slug, { ageBand }]),
)
const worlds = new Map(
  Object.entries(worldAges).map(([worldSlug, ageBand]) => [
    worldSlug,
    {
      slug: worldSlug,
      title: titleForSlug(worldSlug),
      ageBand,
      premise: 'A friendly invented world for an adult-led paper story evidence card.',
    },
  ]),
)

const cardKeys = [
  'id',
  'title',
  'worldSlug',
  'ageBand',
  'evidenceSkill',
  'useCase',
  'adultSetup',
  'kidDirection',
  'storyClaimPrompt',
  'firstCluePrompt',
  'secondCluePrompt',
  'becauseLinePrompt',
  'evidenceSentencePrompt',
  'bookendNotePrompt',
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
    56: 'content/product-artifacts/manila-folder-story-clue-trail-card-pack.json',
    57: 'content/product-artifacts/pocket-folder-story-goal-path-card-pack.json',
    58: 'content/product-artifacts/hanging-file-story-decision-point-card-pack.json',
    59: 'content/product-artifacts/file-box-story-turning-point-card-pack.json',
    60: 'content/product-artifacts/archive-drawer-story-resolution-card-pack.json',
    61: 'content/product-artifacts/card-catalog-story-retell-card-pack.json',
    62: 'content/product-artifacts/library-pocket-story-summary-card-pack.json',
    63: 'content/product-artifacts/shelf-marker-story-theme-card-pack.json',
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
      'Adult points to one evidence blank: ____________________.',
      'Writer names one invented clue detail: ____________________.',
      'Adult asks how the clue supports the story claim: ____________________.',
      'Writer writes one short paper evidence sentence: ____________________.',
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
      title: 'Bookend Evidence Adult Guide: ____________________.',
      setupSteps: [
        'Place one evidence card, blank paper, pencil, and two pretend bookends on the table: ____________________.',
        'Choose one fictional world and read the card title aloud: ____________________.',
        'Point to the story claim, first clue, second clue, because line, and evidence sentence blanks: ____________________.',
        'Let the writer point, dictate, sketch, or write short paper lines: ____________________.',
        'Close by reading the evidence sentence and bookend note together: ____________________.',
      ],
      facilitationNotes: [
        'Keep the pace calm and adult-led with one paper blank at a time: ____________________.',
        'Accept short invented phrases before asking for a full evidence sentence: ____________________.',
        'Use the because line to connect clues without asking for personal facts: ____________________.',
        'If the writer stalls, fill only the story claim and first clue first: ____________________.',
        'Save the bookend note as the paper close, not as a real service step: ____________________.',
      ],
      safetyNotes: [
        'Use pretend names, broad made-up places, and invented actions: ____________________.',
        'Do not ask for real school, home, schedule, or identity details: ____________________.',
        'Do not collect child writing, photos, audio, video, or personal profiles: ____________________.',
        'Keep every prompt offline, paper-only, and adult-led: ____________________.',
        'Keep the bookend note fictional and separate from real book or library systems: ____________________.',
      ],
    },
    evidenceRoutines: [
      routine('Story Claim Start', 'Use when the writer needs one small claim.'),
      routine('First Clue Find', 'Use when the writer needs one invented detail.'),
      routine('Second Clue Match', 'Use when the writer needs a second detail that belongs with the first.'),
      routine('Because Line Bridge', 'Use when the writer needs to connect clues to the claim.'),
      routine('Evidence Sentence Draft', 'Use when the writer is ready to write one sentence.'),
      routine('Bookend Note Finish', 'Use when the evidence sentence is ready to close on paper.'),
    ],
    takeHomeEvidenceSlips: [
      slip('Story Claim Slip', 'Story claim from the pretend page: ____________________.'),
      slip('First Clue Slip', 'First clue detail I noticed in the pretend story: ____________________.'),
      slip('Second Clue Slip', 'Second clue detail that belongs with the first: ____________________.'),
      slip('Because Line Slip', 'These clues support the story claim because: ____________________.'),
      slip('Evidence Sentence Slip', 'My short evidence sentence is: ____________________.'),
      slip('Bookend Note Slip', 'Pretend bookend note for this evidence: ____________________.'),
      slip('Claim And Clue Slip', 'The story claim is ____ and the first clue is ____.'),
      slip('Two Clue Slip', 'The two invented clues are ____ and ____.'),
      slip('Because Bridge Slip', 'The because line says: ____________________.'),
      slip('Adult-Led Later Slip', 'Next time, I can add one more invented clue: ____________________.'),
    ],
    optionalAdultPrompts: [
      'Ask which small story claim the writer can support: ____________________.',
      'Ask which invented clue detail belongs beside the first bookend: ____________________.',
      'Ask which second clue detail belongs beside the other bookend: ____________________.',
      'Ask how the two clues support the claim without using real-life facts: ____________________.',
      'Ask for one short evidence sentence, not a correction mark: ____________________.',
      'Ask where the bookend note belongs on the paper card: ____________________.',
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
      id: `bookend-evidence-card-${number}`,
      title: `${title} Story Evidence Card`,
      worldSlug,
      ageBand: worldAges[worldSlug],
      evidenceSkill: `support a fictional ${title} story claim with two invented clue details, a because line, one evidence sentence, and a bookend note: ____________________.`,
      useCase: `Adult-led fictional offline paper-only evidence card for a made-up ${title} story page: ____________________.`,
      adultSetup: `Adult: set out a blank page, pencil, and two pretend bookends before the ${title} clue search begins: ____________________.`,
      kidDirection: `Writer: keep every ${title} idea invented while the evidence stays on paper: ____________________.`,
      storyClaimPrompt: `Story claim: write one small pretend claim about the ${title} story: ____________________.`,
      firstCluePrompt: `First clue: write one invented detail that helps the story claim: ____________________.`,
      secondCluePrompt: `Second clue: write another invented detail that belongs with the first clue: ____________________.`,
      becauseLinePrompt: `Because line: write how the two clues support the story claim: ____________________.`,
      evidenceSentencePrompt: `Evidence sentence: write one sentence that uses the story claim and clues: ____________________.`,
      bookendNotePrompt: `Bookend note: write a broad pretend note that holds the evidence together: ____________________.`,
      quietOptionLine: `Quiet option: adult and writer fill only the story claim, first clue, and because line first: ____________________.`,
      takeHomeLine: `Take-home line: save this paper evidence card for one later adult-led evidence pass: ____________________.`,
    }
  })
}

function makeSource() {
  const tools = makeTools()
  return {
    batchId: '2026-06-04-batch64',
    generatedAt: '2026-06-04',
    productSlug: 'bookend-story-evidence-card-pack',
    title: 'Bookend Story Evidence Card Pack',
    pricePoint: '$101',
    audience: 'Families, homeschool groups, tutors, and adult-led writing tables for writers ages 7-11.',
    sessionLength:
      '16 printable bookend story evidence cards plus adult guide tools, evidence routines, take-home evidence slips, and optional adult prompts',
    safetyNote: safety,
    artifact: {
      pdfPath:
        'product-build/bookend-story-evidence-card-pack/Bookend-Story-Evidence-Card-Pack.pdf',
      zipPath:
        'product-build/bookend-story-evidence-card-pack/bookend-story-evidence-card-pack.zip',
      sourceHtmlPath:
        'product-build/bookend-story-evidence-card-pack/source/bookend-story-evidence-card-pack.html',
      manifestPath: 'product-build/bookend-story-evidence-card-pack/manifest.json',
    },
    sourceFiles: [...sourceFiles],
    worldSlugs: [...worldSlugs],
    cover: {
      kicker: 'Printable bookend evidence cards',
      headline: 'Bookend Story Evidence Card Pack',
      subhead:
        'Sixteen paper bookend cards help writers support small fictional story claims with clue details, because lines, evidence sentences, and bookend notes.',
      included: [
        '16 printable bookend evidence cards',
        'Adult setup guide',
        'Fictional evidence safety notes',
        'Story claim prompts',
        'First clue prompts',
        'Second clue prompts',
        'Because line prompts',
        'Evidence sentence prompts',
        'Six adult-led evidence routines',
        'Ten take-home evidence slips',
        'Printable PDF and ZIP artifact',
      ],
    },
    adultGuide: tools.adultGuide,
    evidenceRoutines: tools.evidenceRoutines,
    takeHomeEvidenceSlips: tools.takeHomeEvidenceSlips,
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
    headline: 'Printable bookend evidence cards for private fictional story claims.',
    summary:
      'Sixteen bookend evidence cards help kids support fictional story claims with clue details, because lines, and short evidence sentences.',
    heroImage: 'images/plotsprout/batch64/bookend-story-evidence-card-pack.jpg',
    ctaLabel: 'Request bookend evidence pack launch notice',
    ctaHref: 'mailto:samfrench@gmail.com?subject=Bookend%20Story%20Evidence%20Card%20Pack',
    checkoutNote:
      'Checkout is pending until the payment provider is selected; this static bookend evidence pack page is ready for hosted checkout wiring but does not accept payment yet.',
    safetyNote: source.safetyNote,
    worldSlugs: [...source.worldSlugs],
    worldSummaries: source.worldSlugs.map((slug) => ({
      slug,
      title: titleForSlug(slug),
      summary: `A pretend ${titleForSlug(slug)} world for supporting one fictional story claim on paper.`,
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
      evidenceRoutines: source.evidenceRoutines,
      takeHomeEvidenceSlips: source.takeHomeEvidenceSlips,
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
  const imageRoot = mkdtempSync(resolve(tmpdir(), 'plotsprout-batch64-images-'))
  for (const slug of source.worldSlugs) {
    writeFileSync(resolve(imageRoot, `${slug}.jpg`), `fake jpeg bytes for ${slug}`)
  }
  return imageRoot
}

describe('Bookend Story Evidence Card Pack', () => {
  it('validates the canonical source shape, safety, lanes, worlds, and artifact paths', () => {
    const source = makeSource()
    const product = makeProduct(source)

    expect(validateBookendStoryEvidenceCardPackSource(source, product, knownWorldAges)).toEqual([])

    expect(source.cards).toHaveLength(16)
    expect(source.evidenceRoutines).toHaveLength(6)
    expect(source.takeHomeEvidenceSlips).toHaveLength(10)
    expect(source.optionalAdultPrompts).toHaveLength(8)
    expect(source.sourceFiles).toEqual(sourceFiles)
    expect(source.worldSlugs).toEqual(worldSlugs)
    for (const [batchNumber, expected] of [
      [56, 5],
      [57, 6],
      [58, 6],
      [59, 6],
      [60, 6],
      [61, 7],
      [62, 7],
      [63, 6],
    ]) {
      expect(overlapCount(source.worldSlugs, batchWorldSlugs(batchNumber))).toBe(expected)
    }
    expect(source.artifact).toEqual({
      pdfPath:
        'product-build/bookend-story-evidence-card-pack/Bookend-Story-Evidence-Card-Pack.pdf',
      zipPath:
        'product-build/bookend-story-evidence-card-pack/bookend-story-evidence-card-pack.zip',
      sourceHtmlPath:
        'product-build/bookend-story-evidence-card-pack/source/bookend-story-evidence-card-pack.html',
      manifestPath: 'product-build/bookend-story-evidence-card-pack/manifest.json',
    })
  })

  it('rejects unsafe evidence content and real-source framing', () => {
    const source = makeSource()
    source.cards[0].evidenceSentencePrompt =
      'Copy a quote from a real book review and cite the source: ____________________.'

    const errors = validateBookendStoryEvidenceCardPackSource(source, makeProduct(source), knownWorldAges)
    expect(errors.join('\n')).toMatch(/quote|review|cite|source|citation/i)
  })

  it('validates committed source files and product metadata when present', () => {
    const source = readJson('content/product-artifacts/bookend-story-evidence-card-pack.json')
    const products = readJson('content/products/batch5-products.json').products
    const product = products.find((candidate) => candidate.slug === source.productSlug)

    expect(validateBookendStoryEvidenceCardPackSource(source, product, knownWorldAges)).toEqual([])
    expect(validateBookendStoryEvidenceCardPackSourceFiles(source, root)).toEqual([])

    expect(product.status).toBe('checkout_pending')
    expect(product.pricePoint).toBe('$101')
    expect(product.ctaHref).toContain('mailto:')
    expect(product.ctaHref).toContain('Bookend%20Story%20Evidence%20Card%20Pack')
    expect(product.heroImage).toBe('images/plotsprout/batch64/bookend-story-evidence-card-pack.jpg')
    expect(validateProductWorldSummaries(product, 'Batch64 product')).toEqual([])
  })

  it('renders the printable evidence fields into deterministic HTML', () => {
    const source = makeSource()
    const imageMap = new Map(worldSlugs.map((slug) => [slug, `assets/${slug}.jpg`]))

    const html = renderBookendStoryEvidenceCardPackHtml(source, worlds, imageMap)

    expect(html).toContain('Bookend Story Evidence Card Pack')
    expect(html).toContain('Story claim:')
    expect(html).toContain('First clue:')
    expect(html).toContain('Second clue:')
    expect(html).toContain('Because line:')
    expect(html).toContain('Evidence sentence:')
    expect(html).toContain('Bookend note:')
    expect(html).toContain('assets/moon-muffin-market.jpg')
    expect(html).not.toMatch(/\b(public|address|rating|review|quote|citation)\b/i)
  })

  it('builds deterministic PDF, source, README, manifest, and ZIP files', async () => {
    const tmpRoot = mkdtempSync(resolve(tmpdir(), 'bookend-evidence-pack-'))
    const tempLanes = mkdtempSync(resolve(tmpdir(), 'bookend-evidence-lanes-'))
    let imageRoot

    try {
      const source = makeSource()
      imageRoot = makeImageRoot(source)
      writeTempLaneFiles(source, tempLanes)

      const first = await buildBookendStoryEvidenceCardPack({
        outputDir: resolve(tmpRoot, 'first'),
        source,
        product: makeProduct(source),
        worlds,
        imageRoot,
        sourceFilesRoot: tempLanes,
        pdfRenderer: () => Buffer.from('%PDF-1.7\n1 0 obj\n<<>>\nendobj\n%%EOF\n'),
      })
      const second = await buildBookendStoryEvidenceCardPack({
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
            'Batch64 temp artifact',
          ),
        ).toEqual([])
        expect(readFileSync(output.htmlPath, 'utf8')).toContain('Bookend Story Evidence Card Pack')
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
