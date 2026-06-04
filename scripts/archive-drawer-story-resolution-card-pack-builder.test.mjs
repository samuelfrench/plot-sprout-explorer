import { describe, expect, it } from 'vitest'
import { readFileSync, mkdtempSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'

import {
  inspectArtifactFiles,
  validateArchiveDrawerStoryResolutionCardPackSource,
  validateArchiveDrawerStoryResolutionCardPackSourceFiles,
  validateProductWorldSummaries,
} from './product-artifact-policy.mjs'
import {
  buildArchiveDrawerStoryResolutionCardPack,
  renderArchiveDrawerStoryResolutionCardPackHtml,
} from './archive-drawer-story-resolution-card-pack-builder.mjs'

const root = resolve(import.meta.dirname, '..')
const safety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, and no identifying facts.'

const sourceFiles = [
  'content/product-artifacts/lanes/batch60-archive-drawer-resolution-cards-a.json',
  'content/product-artifacts/lanes/batch60-archive-drawer-resolution-cards-b.json',
  'content/product-artifacts/lanes/batch60-archive-drawer-resolution-cards-c.json',
  'content/product-artifacts/lanes/batch60-archive-drawer-resolution-tools.json',
]

const worldAges = {
  'teacup-town-weather-window': '7-8',
  'mitten-market-lost-ticket': '7-8',
  'button-bakery-map-mixup': '7-9',
  'paperclip-plaza-parcel-day': '7-9',
  'spoon-ferry-lunchbox-harbor': '7-9',
  'greenhouse-gear-garden': '8-10',
  'moss-message-observatory': '8-10',
  'rain-gauge-railway': '8-10',
  'seed-library-map-room': '8-10',
  'solar-oven-picnic-station': '8-10',
  'tidepool-timekeepers-lab': '8-10',
  'almost-invention-workshop': '10-11',
  'appendix-archive-lab': '10-11',
  'clue-label-tower-museum': '10-11',
  'compass-craft-academy': '10-11',
  'index-card-theater-club': '10-11',
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
      premise: 'A friendly invented world for an adult-led paper archive drawer resolution card.',
    },
  ]),
)

const cardKeys = [
  'id',
  'title',
  'worldSlug',
  'ageBand',
  'resolutionSkill',
  'useCase',
  'adultSetup',
  'kidDirection',
  'looseThreadPrompt',
  'lastChoicePrompt',
  'changedFeelingPrompt',
  'closingImagePrompt',
  'leftoverQuestionPrompt',
  'nextStorySeedPrompt',
  'archiveDrawerLabelPrompt',
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
    .replace('Mix Up', 'Mix-Up')
}

function batchWorldSlugs(batchNumber) {
  const byBatch = {
    55: 'content/product-artifacts/expanding-file-story-scene-chain-card-pack.json',
    56: 'content/product-artifacts/manila-folder-story-clue-trail-card-pack.json',
    57: 'content/product-artifacts/pocket-folder-story-goal-path-card-pack.json',
    58: 'content/product-artifacts/hanging-file-story-decision-point-card-pack.json',
    59: 'content/product-artifacts/file-box-story-turning-point-card-pack.json',
  }
  return readJson(byBatch[batchNumber]).worldSlugs
}

function makeCards() {
  return worldSlugs.map((worldSlug, index) => {
    const number = String(index + 1).padStart(2, '0')
    const title = titleForSlug(worldSlug)
    return {
      id: `archive-drawer-resolution-card-${number}`,
      title: `${title} Story Resolution Card`,
      worldSlug,
      ageBand: worldAges[worldSlug],
      resolutionSkill: `connect one loose thread, one last choice, one changed feeling, one closing image, one leftover question, one next-story seed, and one archive drawer label for ${title}`,
      useCase: `Adult-led fictional offline paper-only archive drawer resolution card for a made-up ${title} page: ____________________.`,
      adultSetup: `Adult sets out one archive drawer, blank page, pencil, and resolution card for ${title}: ____________________.`,
      kidDirection: `Writer keeps every detail pretend while closing the loose thread and choosing the next-story seed for ${title}: ____________________.`,
      looseThreadPrompt: `Loose thread: name the pretend page detail that still needs a calm answer in ${title}: ____________________.`,
      lastChoicePrompt: `Last choice: write one pretend choice that helps settle the loose thread in ${title}: ____________________.`,
      changedFeelingPrompt: `Changed feeling: write how the pretend character feels different after the last choice in ${title}: ____________________.`,
      closingImagePrompt: `Closing image: write one pretend picture the page can rest on in ${title}: ____________________.`,
      leftoverQuestionPrompt: `Leftover question: write one small pretend question that can wait in the archive drawer for ${title}: ____________________.`,
      nextStorySeedPrompt: `Next-story seed: write one pretend seed for a later paper page in ${title}: ____________________.`,
      archiveDrawerLabelPrompt: `Archive drawer label: write the broad pretend archive drawer label for this resolution in ${title}: ____________________.`,
      quietOptionLine: `Quiet option: point to the loose thread and closing image blanks before writing more for ${title}: ____________________.`,
      takeHomeLine: `Take-home line: reopen this paper resolution later with one pretend archive drawer label: ____________________.`,
    }
  })
}

function makeTools() {
  return {
    adultGuide: {
      title: 'Archive Drawer Resolution Adult Guide',
      bullets: [
        'Set out one archive drawer, blank pages, pencils, and a resolution card before the adult-led start: ____________________.',
        'Choose one made-up world and remind the writer that every loose thread, last choice, changed feeling, and closing image stays invented and paper-only: ____________________.',
        'Move through loose thread, last choice, changed feeling, closing image, leftover question, next-story seed, and archive drawer label in order: ____________________.',
        'Keep the adult in charge of the archive drawer while the child writes or dictates short page notes: ____________________.',
        'Use pretend characters, places, and actions only; do not ask for real names or personal facts: ____________________.',
        'Close by reading the archive drawer label and saving one next-story seed for a later adult-led paper pass: ____________________.',
      ],
    },
    resolutionRoutines: [
      {
        title: 'Loose Thread Sort',
        time: 'short page sort',
        materials: 'Archive drawer, blank page, pencil, and loose thread card.',
        steps: [
          'The adult opens the archive drawer and points to the loose thread blank: ____________________.',
          'The child chooses one made-up page detail that still needs an answer: ____________________.',
          'The adult asks what the page already showed about that detail: ____________________.',
          'The child writes or dictates one loose thread line on paper: ____________________.',
        ],
        adultWrapLine: 'The resolution begins with this pretend loose thread: ____________________.',
      },
      {
        title: 'Last Choice Link',
        time: 'one-page choice pass',
        materials: 'Archive drawer, current page, last choice blank, and pencil.',
        steps: [
          'The adult points from the loose thread to the last choice blank: ____________________.',
          'The child names one pretend choice that helps settle the thread: ____________________.',
          'The adult asks what changes because of that choice: ____________________.',
          'The child writes the last choice on the card: ____________________.',
        ],
        adultWrapLine: 'The last choice settles the loose thread by: ____________________.',
      },
      {
        title: 'Changed Feeling Check',
        time: 'feeling note',
        materials: 'Archive drawer, current page, changed feeling blank, and pencil.',
        steps: [
          'The adult rereads the loose thread and last choice: ____________________.',
          'The child names how the pretend character feels different after the choice: ____________________.',
          'The adult asks what line on the page shows that change: ____________________.',
          'The child writes the changed feeling on paper: ____________________.',
        ],
        adultWrapLine: 'The changed feeling shows the resolution by: ____________________.',
      },
      {
        title: 'Closing Image Pass',
        time: 'paper picture close',
        materials: 'Archive drawer, current page, closing image blank, and pencil.',
        steps: [
          'The adult points to the changed feeling and asks for one closing image: ____________________.',
          'The child chooses a pretend picture the page can rest on: ____________________.',
          'The adult asks which detail should stay in the reader mind: ____________________.',
          'The child writes the closing image line on paper: ____________________.',
        ],
        adultWrapLine: 'The closing image lets the page rest on: ____________________.',
      },
      {
        title: 'Leftover Question Note',
        time: 'future-page seed',
        materials: 'Archive drawer, label slip, leftover question blank, and pencil.',
        steps: [
          'The adult reads the closing image and points to the leftover question blank: ____________________.',
          'The child names one small pretend question that can wait: ____________________.',
          'The adult asks whether the question belongs now or later: ____________________.',
          'The child writes the leftover question and next-story seed: ____________________.',
        ],
        adultWrapLine: 'The leftover question waits beside this next-story seed: ____________________.',
      },
      {
        title: 'Archive Drawer Label Close',
        time: 'paper wrap pass',
        materials: 'Archive drawer, label slip, page stack, and pencil.',
        steps: [
          'The adult lays the resolution pages beside the archive drawer: ____________________.',
          'The child chooses a broad pretend archive drawer label for the resolution: ____________________.',
          'The adult reads the label and asks what next-story seed it suggests: ____________________.',
          'The child tucks the archive drawer label slip into the drawer: ____________________.',
        ],
        adultWrapLine: 'The archive drawer label closes this resolution with: ____________________.',
      },
    ],
    takeHomeResolutionSlips: [
      'Adult: open the archive drawer and ask for one pretend loose thread: ____________________.',
      'Child: the loose thread on my paper resolution is: ____________________.',
      'Adult: point from the loose thread to the last choice blank: ____________________.',
      'Child: the last choice could be: ____________________.',
      'Child: the changed feeling could be: ____________________.',
      'Child: the closing image could be: ____________________.',
      'Adult: ask what small question can wait for later: ____________________.',
      'Child: the leftover question can be: ____________________.',
      'Adult: ask what next-story seed follows the resolution: ____________________.',
      'Child: the archive drawer label for this pretend resolution is: ____________________.',
    ],
    optionalAdultPrompts: [
      'Optional adult-led paper prompt: the loose thread in the archive drawer is ____________________.',
      'Optional adult-led paper prompt: the last choice can be ____________________.',
      'Optional adult-led paper prompt: after the last choice, the changed feeling is ____________________.',
      'Optional adult-led paper prompt: the closing image can show ____________________.',
      'Optional adult-led paper prompt: the leftover question can wait because ____________________.',
      'Optional adult-led paper prompt: the next-story seed should be ____________________.',
      'Optional adult-led paper prompt: the archive drawer label should say ____________________.',
      'Optional adult-led paper prompt: the later paper page can start with ____________________.',
    ],
  }
}

function validSource(overrides = {}) {
  const tools = makeTools()
  return {
    batchId: '2026-06-04-batch60',
    generatedAt: '2026-06-04',
    productSlug: 'archive-drawer-story-resolution-card-pack',
    title: 'Archive Drawer Story Resolution Card Pack',
    pricePoint: '$93',
    audience: 'Families, homeschool groups, tutors, and adult-led writing tables for writers ages 7-11.',
    sessionLength:
      '16 printable archive drawer story resolution cards plus adult guide tools, resolution routines, take-home resolution slips, and optional adult prompts',
    safetyNote: safety,
    artifact: {
      pdfPath:
        'product-build/archive-drawer-story-resolution-card-pack/Archive-Drawer-Story-Resolution-Card-Pack.pdf',
      zipPath:
        'product-build/archive-drawer-story-resolution-card-pack/archive-drawer-story-resolution-card-pack.zip',
      sourceHtmlPath:
        'product-build/archive-drawer-story-resolution-card-pack/source/archive-drawer-story-resolution-card-pack.html',
      manifestPath: 'product-build/archive-drawer-story-resolution-card-pack/manifest.json',
    },
    sourceFiles: [...sourceFiles],
    worldSlugs: [...worldSlugs],
    cover: {
      kicker: 'Printable archive drawer resolution cards',
      headline: 'Archive Drawer Story Resolution Card Pack',
      subhead:
        'Sixteen archive-drawer cards help writers connect a loose thread, a last choice, a changed feeling, a closing image, a leftover question, and a next-story seed.',
      included: [
        '16 printable archive drawer resolution cards',
        'Adult setup guide',
        'Fictional resolution safety notes',
        'Loose thread prompts',
        'Last choice prompts',
        'Changed feeling prompts',
        'Closing image prompts',
        'Leftover question prompts',
        'Six adult-led resolution routines',
        'Ten take-home resolution slips',
        'Printable PDF and ZIP artifact',
      ],
    },
    adultGuide: tools.adultGuide,
    resolutionRoutines: tools.resolutionRoutines,
    takeHomeResolutionSlips: tools.takeHomeResolutionSlips,
    optionalAdultPrompts: tools.optionalAdultPrompts,
    cards: makeCards(),
    ...overrides,
  }
}

function validProduct(overrides = {}) {
  return {
    slug: 'archive-drawer-story-resolution-card-pack',
    title: 'Archive Drawer Story Resolution Card Pack',
    pricePoint: '$93',
    status: 'checkout_pending',
    headline: 'A printable resolution card pack for closing paper stories without pressure.',
    summary:
      'Sixteen adult-led archive drawer cards help kids connect a loose thread, a last choice, a changed feeling, a closing image, a leftover question, a next-story seed, and an archive drawer label.',
    heroImage: 'images/plotsprout/batch60/archive-drawer-story-resolution-card-pack.jpg',
    ctaLabel: 'Request archive drawer pack launch notice',
    ctaHref: 'mailto:samfrench@gmail.com?subject=Archive%20Drawer%20Story%20Resolution%20Card%20Pack',
    checkoutNote:
      'Checkout is pending until the payment provider is selected; this static archive drawer pack page is ready for hosted checkout wiring but does not accept payment yet.',
    safetyNote: safety,
    worldSlugs: [...worldSlugs],
    includedPages: [
      'Sixteen printable archive drawer resolution cards',
      'Adult setup guide',
      'Loose thread prompts',
      'Last choice prompts',
      'Changed feeling prompts',
      'Closing image prompts',
      'Leftover question prompts',
      'Next-story seed prompts',
      'Ten take-home resolution slips',
      'Provider-ready PDF, source HTML, README, manifest, and ZIP artifact',
    ],
    useCases: [
      'A family paper table for ending short fictional drafts',
      'A homeschool writing station for resolution planning',
      'A tutoring pack for writers who need concrete ending choices',
      'An adult-led small group activity with no accounts or online posting',
    ],
    parentSteps: [
      'Print one resolution card and set it beside a blank page.',
      'Ask for a loose thread before asking for the last choice.',
      'Let the child point, dictate, sketch, or write one short line per blank.',
      'Close with an archive drawer label and save the next-story seed for later.',
    ],
    worldSummaries: worldSlugs.map((slug) => ({
      slug,
      title: titleForSlug(slug),
      summary: `A pretend ${titleForSlug(slug)} world for closing one loose thread and saving one next-story seed.`,
    })),
    ...overrides,
  }
}

describe('Archive Drawer Story Resolution Card Pack policy', () => {
  it('accepts the canonical source contract and product alignment', () => {
    const errors = validateArchiveDrawerStoryResolutionCardPackSource(
      validSource(),
      validProduct(),
      knownWorldAges,
    )

    expect(errors).toEqual([])
  })

  it('requires exact source keys, card keys, world order, lane paths, and artifact paths', () => {
    const source = validSource({
      sourceFiles: sourceFiles.slice(0, 3),
      artifact: {
        pdfPath: 'wrong.pdf',
        zipPath: 'wrong.zip',
        sourceHtmlPath: 'wrong.html',
        manifestPath: 'wrong.json',
      },
      worldSlugs: [...worldSlugs].reverse(),
      cards: makeCards().map((card, index) =>
        index === 0 ? { extra: true, ...card, title: 'Changed title' } : card,
      ),
    })

    const errors = validateArchiveDrawerStoryResolutionCardPackSource(
      source,
      validProduct(),
      knownWorldAges,
    ).join('\n')

    expect(errors).toMatch(/sourceFiles must list the exact Batch 60 archive drawer resolution card lane/)
    expect(errors).toMatch(/artifact.pdfPath must be/)
    expect(errors).toMatch(/worldSlugs must match the exact Batch 60 archive drawer resolution world set/)
    expect(errors).toMatch(/cards\\[0\\] keys must match/)
    expect(errors).toMatch(/cards\\[0\\].title must include/)
  })

  it('enforces recent batch overlap counts', () => {
    const sourceWorlds = new Set(worldSlugs)

    expect([...sourceWorlds].filter((slug) => batchWorldSlugs(55).includes(slug))).toHaveLength(8)
    for (const batch of [56, 57, 58, 59]) {
      expect([...sourceWorlds].filter((slug) => batchWorldSlugs(batch).includes(slug))).toHaveLength(7)
    }

    const badWorlds = [...worldSlugs]
    badWorlds[0] = 'penny-path-compass-shop'
    const errors = validateArchiveDrawerStoryResolutionCardPackSource(
      validSource({ worldSlugs: badWorlds }),
      validProduct({ worldSlugs: badWorlds }),
      knownWorldAges,
    ).join('\n')

    expect(errors).toMatch(/Batch60 must overlap Batch56 in exactly 7 worlds/)
  })

  it('rejects unsafe and pressure-language terms', () => {
    const unsafeCards = makeCards()
    unsafeCards[0] = {
      ...unsafeCards[0],
      kidDirection:
        'Writer can publish the perfect public portfolio and upload a photo from a real address: ____________________.',
    }
    const errors = validateArchiveDrawerStoryResolutionCardPackSource(
      validSource({
        cover: {
          ...validSource().cover,
          subhead: 'A cliffhanger episode with a plot twist for a chapter book.',
        },
        cards: unsafeCards,
      }),
      validProduct(),
      knownWorldAges,
    ).join('\n')

    expect(errors).toMatch(/public/)
    expect(errors).toMatch(/address/)
    expect(errors).toMatch(/publishing/)
    expect(errors).toMatch(/chapter book/)
    expect(errors).toMatch(/cliffhanger/)
    expect(errors).toMatch(/plot twist/)
    expect(errors).toMatch(/upload/)
    expect(errors).toMatch(/photo/)
  })

  it('validates committed lane files when source files exist', () => {
    const source = validSource()
    const errors = validateArchiveDrawerStoryResolutionCardPackSourceFiles(source, root)

    if (existsSync(resolve(root, sourceFiles[0]))) {
      expect(errors).toEqual([])
    } else {
      expect(errors.join('\n')).toMatch(/Missing lane file/)
    }
  })

  it('renders archive drawer resolution fields into source HTML', () => {
    const html = renderArchiveDrawerStoryResolutionCardPackHtml(validSource(), worlds)

    expect(html).toContain('Archive Drawer Story Resolution Card Pack')
    expect(html).toContain('Loose thread')
    expect(html).toContain('Last choice')
    expect(html).toContain('Changed feeling')
    expect(html).toContain('Closing image')
    expect(html).toContain('Leftover question')
    expect(html).toContain('Next-story seed')
    expect(html).toContain('Archive drawer label')
    expect(html).toContain('Teacup Town Weather Window')
  })

  it('inspects deterministic builder artifacts and manifest shape', async () => {
    const buildDir = mkdtempSync(join(tmpdir(), 'archive-drawer-resolution-build-'))

    try {
      const result = await buildArchiveDrawerStoryResolutionCardPack({
        source: validSource(),
        worlds,
        buildDir,
        pdfRenderer: async () => Buffer.from('%PDF-1.7\n1 0 obj << /Type /Page >> endobj\n%%EOF\n'),
      })

      const status = inspectArtifactFiles(
        buildDir,
        {
          pdfPath: 'Archive-Drawer-Story-Resolution-Card-Pack.pdf',
          zipPath: 'archive-drawer-story-resolution-card-pack.zip',
          sourceHtmlPath: 'source/archive-drawer-story-resolution-card-pack.html',
          manifestPath: 'manifest.json',
        },
        {
          expectedPdfPages: 21,
          pdfRoot: buildDir,
          requiredZipEntries: [
            'Archive-Drawer-Story-Resolution-Card-Pack.pdf',
            'README.txt',
            'manifest.json',
            'source/archive-drawer-story-resolution-card-pack.html',
          ],
        },
      )

      expect(result.manifest.productSlug).toBe('archive-drawer-story-resolution-card-pack')
      expect(result.manifest.sourcePageCount).toBe(16)
      expect(result.manifest.files.zip.path).toBe('archive-drawer-story-resolution-card-pack.zip')
      expect(status.valid).toBe(true)
    } finally {
      rmSync(buildDir, { recursive: true, force: true })
    }
  })

  it('keeps the committed product checkout-pending and world summaries aligned', () => {
    const products = readJson('content/products/batch5-products.json')
    const product = products.products.find(
      (candidate) => candidate.slug === 'archive-drawer-story-resolution-card-pack',
    )

    if (!product) {
      expect(product).toBeDefined()
      return
    }

    expect(product.status).toBe('checkout_pending')
    expect(product.pricePoint).toBe('$93')
    expect(product.ctaHref).toContain('mailto:')
    expect(product.heroImage).toBe('images/plotsprout/batch60/archive-drawer-story-resolution-card-pack.jpg')
    expect(validateProductWorldSummaries(product, worldSlugs, new Map())).toEqual([])
  })
})
