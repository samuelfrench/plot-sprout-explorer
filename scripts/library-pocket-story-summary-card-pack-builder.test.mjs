import { describe, expect, it } from 'vitest'
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

import {
  inspectArtifactFiles,
  validateLibraryPocketStorySummaryCardPackSource,
  validateLibraryPocketStorySummaryCardPackSourceFiles,
  validateProductWorldSummaries,
} from './product-artifact-policy.mjs'
import {
  buildLibraryPocketStorySummaryCardPack,
  renderLibraryPocketStorySummaryCardPackHtml,
} from './library-pocket-story-summary-card-pack-builder.mjs'

const root = resolve(import.meta.dirname, '..')
const safety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, and no identifying facts.'

const sourceFiles = [
  'content/product-artifacts/lanes/batch62-library-pocket-summary-cards-a.json',
  'content/product-artifacts/lanes/batch62-library-pocket-summary-cards-b.json',
  'content/product-artifacts/lanes/batch62-library-pocket-summary-cards-c.json',
  'content/product-artifacts/lanes/batch62-library-pocket-summary-tools.json',
]

const worldAges = {
  'moon-muffin-market': '6-8',
  'pencil-dragon-academy': '10-11',
  'teacup-town-weather-window': '7-8',
  'mitten-market-lost-ticket': '7-8',
  'rain-boot-route-rangers': '7-9',
  'greenhouse-gear-garden': '8-10',
  'moss-message-observatory': '8-10',
  'rain-gauge-railway': '8-10',
  'compost-clock-workshop': '8-10',
  'seed-library-map-room': '8-10',
  'solar-oven-picnic-station': '8-10',
  'tidepool-timekeepers-lab': '8-10',
  'almost-invention-workshop': '10-11',
  'appendix-archive-lab': '10-11',
  'clue-label-tower-museum': '10-11',
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
      premise: 'A friendly invented world for an adult-led paper story summary card.',
    },
  ]),
)

const cardKeys = [
  'id',
  'title',
  'worldSlug',
  'ageBand',
  'summarySkill',
  'useCase',
  'adultSetup',
  'kidDirection',
  'storyStartPrompt',
  'mainActionPrompt',
  'importantChangePrompt',
  'endingResultPrompt',
  'keeperDetailPrompt',
  'summarySentencePrompt',
  'libraryPocketLabelPrompt',
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
    56: 'content/product-artifacts/manila-folder-story-clue-trail-card-pack.json',
    57: 'content/product-artifacts/pocket-folder-story-goal-path-card-pack.json',
    58: 'content/product-artifacts/hanging-file-story-decision-point-card-pack.json',
    59: 'content/product-artifacts/file-box-story-turning-point-card-pack.json',
    60: 'content/product-artifacts/archive-drawer-story-resolution-card-pack.json',
    61: 'content/product-artifacts/card-catalog-story-retell-card-pack.json',
  }
  return readJson(byBatch[batchNumber]).worldSlugs
}

function productImagePath(slug) {
  for (const relativeDir of [
    ['public', 'images', 'plotsprout', 'batch4'],
    ['public', 'images', 'plotsprout', 'batch50-worlds'],
    ['public', 'images', 'plotsprout', 'batch51-worlds'],
    ['public', 'images', 'plotsprout', 'batch52-worlds'],
    ['public', 'images', 'plotsprout', 'batch53-worlds'],
    ['public', 'images', 'plotsprout', 'batch7'],
    ['public', 'images', 'plotsprout'],
  ]) {
    const imagePath = resolve(root, ...relativeDir, `${slug}.jpg`)
    if (existsSync(imagePath)) return imagePath
  }
  return null
}

function makeCards() {
  return worldSlugs.map((worldSlug, index) => {
    const number = String(index + 1).padStart(2, '0')
    const title = titleForSlug(worldSlug)
    return {
      id: `library-pocket-summary-card-${number}`,
      title: `${title} Story Summary Card`,
      worldSlug,
      ageBand: worldAges[worldSlug],
      summarySkill: `summarize a fictional ${title} story by naming the story start, main action, important change, ending result, keeper detail, summary sentence, and library pocket label: ____________________.`,
      useCase: `Adult-led fictional offline paper-only summary card for a made-up ${title} story page: ____________________.`,
      adultSetup: `Adult: set out a blank page, pencil, and pretend library pocket slip before the ${title} summary begins: ____________________.`,
      kidDirection: `Writer: keep every ${title} detail invented while the summary stays on paper: ____________________.`,
      storyStartPrompt: `Story start: write the first pretend moment the summary should name for ${title}: ____________________.`,
      mainActionPrompt: `Main action: write the main pretend action that keeps the ${title} story moving: ____________________.`,
      importantChangePrompt: `Important change: write the pretend change that matters most in the ${title} story: ____________________.`,
      endingResultPrompt: `Ending result: write the calm pretend result at the end of ${title}: ____________________.`,
      keeperDetailPrompt: `Keeper detail: write one invented detail that belongs in the ${title} summary: ____________________.`,
      summarySentencePrompt: `Summary sentence: combine the start, action, change, and result in one short paper sentence: ____________________.`,
      libraryPocketLabelPrompt: `Library pocket label: write a broad pretend label for this ${title} summary card: ____________________.`,
      quietOptionLine: `Quiet option: adult and writer fill only the story start, ending result, and library pocket label first: ____________________.`,
      takeHomeLine: `Take-home line: save this paper summary card for one later adult-led summary pass: ____________________.`,
    }
  })
}

function makeTools() {
  return {
    adultGuide: {
      title: 'Library Pocket Summary Adult Guide: ____________________.',
      setupSteps: [
        'Place one summary card, blank paper, pencil, and pretend pocket slip on the table: ____________________.',
        'Choose one fictional world and read the card title aloud: ____________________.',
        'Point to the story start, main action, important change, and ending result blanks: ____________________.',
        'Let the writer point, dictate, sketch, or write short paper lines: ____________________.',
        'Close by reading the summary sentence and library pocket label together: ____________________.',
      ],
      facilitationNotes: [
        'Keep the pace calm and adult-led with one paper blank at a time: ____________________.',
        'Accept short invented phrases before asking for a full summary sentence: ____________________.',
        'Use the keeper detail to make the summary specific without adding personal facts: ____________________.',
        'If the writer stalls, fill only the story start and ending result first: ____________________.',
        'Save the pocket label as the paper close, not as a real service step: ____________________.',
      ],
      safetyNotes: [
        'Use pretend names, broad made-up places, and invented actions: ____________________.',
        'Do not ask for real school, home, schedule, or identity details: ____________________.',
        'Do not collect child writing, photos, audio, video, or personal profiles: ____________________.',
        'Keep every prompt offline, paper-only, and adult-led: ____________________.',
        'Keep the pocket label fictional and separate from real book or library systems: ____________________.',
      ],
    },
    summaryRoutines: [
      {
        title: 'Story Start Sort: ____________________.',
        useWhen: 'Use when the writer needs a first anchor for the summary: ____________________.',
        steps: [
          'Adult points to the story start blank: ____________________.',
          'Writer names the first invented moment: ____________________.',
          'Adult asks what must be remembered from that start: ____________________.',
          'Writer writes one short story start phrase: ____________________.',
        ],
      },
      {
        title: 'Main Action Pick: ____________________.',
        useWhen: 'Use when the summary needs one action instead of every event: ____________________.',
        steps: [
          'Adult rereads the story start: ____________________.',
          'Writer chooses the main invented action: ____________________.',
          'Adult asks why that action matters to the summary: ____________________.',
          'Writer writes one main action phrase: ____________________.',
        ],
      },
      {
        title: 'Important Change Check: ____________________.',
        useWhen: 'Use when the writer needs to name what shifted: ____________________.',
        steps: [
          'Adult places the main action beside the important change blank: ____________________.',
          'Writer names the invented change that matters most: ____________________.',
          'Adult asks how the change moves the story toward the ending: ____________________.',
          'Writer writes one important change line: ____________________.',
        ],
      },
      {
        title: 'Ending Result Close: ____________________.',
        useWhen: 'Use when the summary needs a clear ending result: ____________________.',
        steps: [
          'Adult rereads the start, action, and change: ____________________.',
          'Writer names the calm invented result: ____________________.',
          'Adult asks what the result answers from earlier: ____________________.',
          'Writer writes one ending result line: ____________________.',
        ],
      },
      {
        title: 'Keeper Detail Note: ____________________.',
        useWhen: 'Use when the summary feels too plain: ____________________.',
        steps: [
          'Adult asks for one invented detail worth keeping: ____________________.',
          'Writer chooses a small object, place, or action from the fictional world: ____________________.',
          'Adult asks where that detail belongs in the summary sentence: ____________________.',
          'Writer writes the keeper detail on paper: ____________________.',
        ],
      },
      {
        title: 'Pocket Label Finish: ____________________.',
        useWhen: 'Use when the summary sentence is ready to label: ____________________.',
        steps: [
          'Adult rereads every filled summary blank: ____________________.',
          'Writer combines the start, action, change, and result into one sentence: ____________________.',
          'Adult asks for a broad pretend library pocket label: ____________________.',
          'Writer writes the summary sentence and label on the card: ____________________.',
        ],
      },
    ],
    takeHomeSummarySlips: [
      {
        title: 'Story Start Slip',
        prompt: 'Story start I remember from the pretend page: ____________________.',
        adultNote: 'Ask for one invented opening moment only.',
      },
      {
        title: 'Main Action Slip',
        prompt: 'Main action that keeps the pretend story moving: ____________________.',
        adultNote: 'Help the writer choose one action instead of listing every event.',
      },
      {
        title: 'Important Change Slip',
        prompt: 'Important change in the pretend story: ____________________.',
        adultNote: 'Ask what shifted after the main action.',
      },
      {
        title: 'Ending Result Slip',
        prompt: 'Ending result from the pretend story: ____________________.',
        adultNote: 'Keep the ending calm, invented, and paper-only.',
      },
      {
        title: 'Keeper Detail Slip',
        prompt: 'Keeper detail that makes the summary specific: ____________________.',
        adultNote: 'Choose one fictional detail, not a personal fact.',
      },
      {
        title: 'Summary Sentence Slip',
        prompt: 'My one-sentence summary is: ____________________.',
        adultNote: 'Let the writer dictate if writing the whole sentence feels long.',
      },
      {
        title: 'Pocket Label Slip',
        prompt: 'Library pocket label for this pretend summary: ____________________.',
        adultNote: 'Use a broad fictional label only.',
      },
      {
        title: 'Short Summary Slip',
        prompt: 'The pretend story starts with ____ and ends with ____.',
        adultNote: 'Use this when the full card is too much.',
      },
      {
        title: 'Change And Result Slip',
        prompt: 'The important change is ____ and the ending result is ____.',
        adultNote: 'Use this for a quick adult-led review of the summary order.',
      },
      {
        title: 'Later Summary Slip',
        prompt: 'Next time I can summarize the pretend story by remembering ____.',
        adultNote: 'Save one memory hook for a later paper pass.',
      },
    ],
    optionalAdultPrompts: [
      'Optional adult-led paper prompt: the story start is ____________________.',
      'Optional adult-led paper prompt: the main action is ____________________.',
      'Optional adult-led paper prompt: the important change is ____________________.',
      'Optional adult-led paper prompt: the ending result is ____________________.',
      'Optional adult-led paper prompt: the keeper detail is ____________________.',
      'Optional adult-led paper prompt: the summary sentence can begin with ____________________.',
      'Optional adult-led paper prompt: the library pocket label can say ____________________.',
      'Optional adult-led paper prompt: a later summary can remember ____________________.',
    ],
  }
}

function validSource(overrides = {}) {
  const tools = makeTools()
  return {
    batchId: '2026-06-04-batch62',
    generatedAt: '2026-06-04',
    productSlug: 'library-pocket-story-summary-card-pack',
    title: 'Library Pocket Story Summary Card Pack',
    pricePoint: '$97',
    audience: 'Families, homeschool groups, tutors, and adult-led writing tables for writers ages 7-11.',
    sessionLength:
      '16 printable library pocket story summary cards plus adult guide tools, summary routines, take-home summary slips, and optional adult prompts',
    safetyNote: safety,
    artifact: {
      pdfPath:
        'product-build/library-pocket-story-summary-card-pack/Library-Pocket-Story-Summary-Card-Pack.pdf',
      zipPath:
        'product-build/library-pocket-story-summary-card-pack/library-pocket-story-summary-card-pack.zip',
      sourceHtmlPath:
        'product-build/library-pocket-story-summary-card-pack/source/library-pocket-story-summary-card-pack.html',
      manifestPath: 'product-build/library-pocket-story-summary-card-pack/manifest.json',
    },
    sourceFiles: [...sourceFiles],
    worldSlugs: [...worldSlugs],
    cover: {
      kicker: 'Printable library pocket summary cards',
      headline: 'Library Pocket Story Summary Card Pack',
      subhead:
        'Sixteen paper pocket cards help writers summarize a story start, main action, important change, ending result, keeper detail, summary sentence, and library pocket label.',
      included: [
        '16 printable library pocket summary cards',
        'Adult setup guide',
        'Fictional summary safety notes',
        'Story start prompts',
        'Main action prompts',
        'Important change prompts',
        'Ending result prompts',
        'Keeper detail prompts',
        'Six adult-led summary routines',
        'Ten take-home summary slips',
        'Printable PDF and ZIP artifact',
      ],
    },
    adultGuide: tools.adultGuide,
    summaryRoutines: tools.summaryRoutines,
    takeHomeSummarySlips: tools.takeHomeSummarySlips,
    optionalAdultPrompts: tools.optionalAdultPrompts,
    cards: makeCards(),
    ...overrides,
  }
}

function validProduct(overrides = {}) {
  return {
    slug: 'library-pocket-story-summary-card-pack',
    title: 'Library Pocket Story Summary Card Pack',
    pricePoint: '$97',
    status: 'checkout_pending',
    headline: 'Printable library pocket cards for private fictional story summaries.',
    summary:
      'Sixteen library pocket cards help kids summarize fictional stories with story starts, main actions, important changes, ending results, keeper details, short summary sentences, and labels.',
    heroImage: 'images/plotsprout/batch62/library-pocket-story-summary-card-pack.jpg',
    ctaLabel: 'Request library pocket pack launch notice',
    ctaHref:
      'mailto:samfrench@gmail.com?subject=Library%20Pocket%20Story%20Summary%20Card%20Pack',
    checkoutNote:
      'Checkout is pending until the payment provider is selected; this static library pocket pack page is ready for hosted checkout wiring but does not accept payment yet.',
    safetyNote: safety,
    worldSlugs: [...worldSlugs],
    includedPages: [
      'Sixteen printable library pocket summary cards',
      'Adult setup guide',
      'Story start prompts',
      'Main action prompts',
      'Important change prompts',
      'Ending result prompts',
      'Keeper detail prompts',
      'Ten take-home summary slips',
      'Provider-ready PDF, source HTML, README, manifest, and ZIP artifact',
    ],
    useCases: [
      'A family paper table for summarizing short fictional drafts',
      'A homeschool writing station for story-start-to-ending summary practice',
      'A tutoring pack for writers who need concrete summary order',
      'An adult-led small group activity with no accounts or online posting',
    ],
    parentSteps: [
      'Print one summary card and set it beside a blank page.',
      'Ask for the story start before asking for the main action.',
      'Let the child point, dictate, sketch, or write one short line per blank.',
      'Close with a library pocket label and save the summary sentence for later.',
    ],
    worldSummaries: worldSlugs.map((slug) => ({
      slug,
      title: titleForSlug(slug),
      summary: `A pretend ${titleForSlug(slug)} world for summarizing one fictional story in library pocket order.`,
    })),
    ...overrides,
  }
}

function fakePdf(pageCount) {
  const pages = Array.from(
    { length: pageCount },
    (_unused, index) => `${index + 1} 0 obj << /Type /Page >> endobj`,
  )
  return Buffer.from(`%PDF-1.7\n${pages.join('\n')}\n%%EOF\n`)
}

describe('Library Pocket Story Summary Card Pack policy', () => {
  it('accepts the canonical source contract and product alignment', () => {
    const errors = validateLibraryPocketStorySummaryCardPackSource(
      validSource(),
      validProduct(),
      knownWorldAges,
    )

    expect(errors).toEqual([])
  })

  it('requires exact source keys, card keys, world order, lane paths, and artifact paths', () => {
    const badCards = makeCards()
    badCards[0] = { extra: true, ...badCards[0], title: 'Changed Summary Title' }
    const errors = validateLibraryPocketStorySummaryCardPackSource(
      validSource({
        sourceFiles: sourceFiles.slice(0, 3),
        artifact: {
          pdfPath: 'wrong.pdf',
          zipPath: 'wrong.zip',
          sourceHtmlPath: 'wrong.html',
          manifestPath: 'wrong.json',
        },
        worldSlugs: [...worldSlugs].reverse(),
        cards: badCards,
      }),
      validProduct(),
      knownWorldAges,
    ).join('\n')

    expect(errors).toMatch(/sourceFiles must list the exact Batch 62 library pocket summary card lane/)
    expect(errors).toMatch(/artifact.pdfPath must be/)
    expect(errors).toMatch(/worldSlugs must match the exact Batch 62 library pocket summary world set/)
    expect(errors).toMatch(/cards\[0\] keys must match/)
    expect(errors).toMatch(/cards\[0\].title must include/)
  })

  it('enforces exact recent batch overlap counts', () => {
    const expected = { 56: 6, 57: 8, 58: 6, 59: 7, 60: 13, 61: 0 }

    for (const [batch, count] of Object.entries(expected)) {
      expect(worldSlugs.filter((slug) => batchWorldSlugs(Number(batch)).includes(slug))).toHaveLength(count)
    }

    const badWorlds = [...worldSlugs]
    badWorlds[0] = 'puddle-planet-post-office'
    const errors = validateLibraryPocketStorySummaryCardPackSource(
      validSource({ worldSlugs: badWorlds }),
      validProduct({ worldSlugs: badWorlds }),
      knownWorldAges,
    ).join('\n')

    expect(errors).toMatch(/Batch62 must overlap Batch61 in exactly 0 worlds/)
  })

  it('rejects unsafe, pressure, service, review, rating, and personal-data terms', () => {
    const unsafeCards = makeCards()
    unsafeCards[0] = {
      ...unsafeCards[0],
      kidDirection:
        'Writer can publish the perfect public portfolio, upload a photo, add a review and rating, use a real address, and copy the due date from the library card: ____________________.',
    }
    const errors = validateLibraryPocketStorySummaryCardPackSource(
      validSource({
        cover: {
          ...validSource().cover,
          subhead: 'A cliffhanger episode with a plot twist for a chapter book screenplay.',
        },
        cards: unsafeCards,
      }),
      validProduct(),
      knownWorldAges,
    ).join('\n')

    expect(errors).toMatch(/public/)
    expect(errors).toMatch(/address/)
    expect(errors).toMatch(/publish/)
    expect(errors).toMatch(/portfolio/)
    expect(errors).toMatch(/review/)
    expect(errors).toMatch(/rating/)
    expect(errors).toMatch(/due date/)
    expect(errors).toMatch(/library card/)
    expect(errors).toMatch(/chapter book/)
    expect(errors).toMatch(/screenplay/)
    expect(errors).toMatch(/cliffhanger/)
    expect(errors).toMatch(/plot twist/)
    expect(errors).toMatch(/upload/)
    expect(errors).toMatch(/photo/)
  })

  it('validates committed lane files and flags stale canonical source drift', () => {
    const source = readJson('content/product-artifacts/library-pocket-story-summary-card-pack.json')
    const laneErrors = validateLibraryPocketStorySummaryCardPackSourceFiles(source, root)

    if (existsSync(resolve(root, sourceFiles[0]))) {
      expect(laneErrors).toEqual([])
    } else {
      expect(laneErrors.join('\n')).toMatch(/Missing lane file|could not be read as JSON/)
    }

    source.cards[0].kidDirection =
      'Writer keeps every detail pretend while changing the summary order: ____________________.'
    source.adultGuide.setupSteps[0] =
      'Place a changed library pocket setup on the table: ____________________.'

    const driftErrors = validateLibraryPocketStorySummaryCardPackSourceFiles(source, root).join('\n')

    expect(driftErrors).toMatch(/summary card lanes must reproduce cards exactly/)
    expect(driftErrors).toMatch(/tools lane must reproduce adultGuide exactly/)
  })

  it('renders library pocket summary fields into source HTML', () => {
    const html = renderLibraryPocketStorySummaryCardPackHtml(validSource(), worlds)

    expect(html).toContain('Library Pocket Story Summary Card Pack')
    expect(html).toContain('Story start')
    expect(html).toContain('Main action')
    expect(html).toContain('Important change')
    expect(html).toContain('Ending result')
    expect(html).toContain('Keeper detail')
    expect(html).toContain('Summary sentence')
    expect(html).toContain('Library pocket label')
    expect(html).toContain('Moon Muffin Market')
  })

  it('inspects deterministic builder artifacts and manifest shape', async () => {
    const buildDir = mkdtempSync(join(tmpdir(), 'library-pocket-summary-build-'))
    const fixtureImage = resolve(root, 'public/images/plotsprout/batch61/card-catalog-story-retell-card-pack.jpg')
    const imageSources = new Map(worldSlugs.map((slug) => [slug, fixtureImage]))

    try {
      const result = await buildLibraryPocketStorySummaryCardPack({
        source: readJson('content/product-artifacts/library-pocket-story-summary-card-pack.json'),
        worlds,
        buildDir,
        imageSources,
        pdfRenderer: async () => fakePdf(21),
      })
      const expectedZipEntries = [
        'Library-Pocket-Story-Summary-Card-Pack.pdf',
        'README.txt',
        'source/library-pocket-story-summary-card-pack.html',
        ...result.manifest.files.assets.map((asset) => asset.path),
      ]

      const status = inspectArtifactFiles(
        buildDir,
        {
          pdfPath: 'Library-Pocket-Story-Summary-Card-Pack.pdf',
          zipPath: 'library-pocket-story-summary-card-pack.zip',
          sourceHtmlPath: 'source/library-pocket-story-summary-card-pack.html',
          manifestPath: 'manifest.json',
        },
        {
          expectedPdfPages: 21,
          pdfRoot: buildDir,
          expectedZipEntries,
        },
      )

      expect(result.manifest.productSlug).toBe('library-pocket-story-summary-card-pack')
      expect(result.manifest.sourcePageCount).toBe(16)
      expect(result.manifest.files.zip.path).toBe('library-pocket-story-summary-card-pack.zip')
      expect(status.valid).toBe(true)
    } finally {
      rmSync(buildDir, { recursive: true, force: true })
    }
  })

  it('keeps the committed product checkout-pending and world summaries aligned', () => {
    const products = readJson('content/products/batch5-products.json')
    const product = products.products.find(
      (candidate) => candidate.slug === 'library-pocket-story-summary-card-pack',
    )

    expect(product).toMatchObject({
      slug: 'library-pocket-story-summary-card-pack',
      title: 'Library Pocket Story Summary Card Pack',
      pricePoint: '$97',
      status: 'checkout_pending',
      heroImage: 'images/plotsprout/batch62/library-pocket-story-summary-card-pack.jpg',
    })
    expect(validateProductWorldSummaries(product, 'Library Pocket Story Summary Card Pack')).toEqual([])
  })

  it('requires the local product image manifest and all card-world images', () => {
    const manifests = readJson('content/image-queue/2026-06-04-batch62-images.json')
    const image = manifests.images.find((entry) => entry.slug === 'library-pocket-story-summary-card-pack')

    expect(image).toMatchObject({
      slug: 'library-pocket-story-summary-card-pack',
      outputJpeg: 'public/images/plotsprout/batch62/library-pocket-story-summary-card-pack.jpg',
      outputWebp: 'public/images/plotsprout/batch62/library-pocket-story-summary-card-pack.webp',
      sidecar: 'content/image-runs/batch62/library-pocket-story-summary-card-pack.json',
    })
    expect(image.prompt).toMatch(/library pocket/i)
    expect(image.negativePrompt).toMatch(/text/i)
    expect(worldSlugs.map((slug) => [slug, productImagePath(slug)]).filter(([, imagePath]) => !imagePath)).toEqual([])
  })

  it('documents exact card field order for generated lanes', () => {
    expect(cardKeys).toEqual([
      'id',
      'title',
      'worldSlug',
      'ageBand',
      'summarySkill',
      'useCase',
      'adultSetup',
      'kidDirection',
      'storyStartPrompt',
      'mainActionPrompt',
      'importantChangePrompt',
      'endingResultPrompt',
      'keeperDetailPrompt',
      'summarySentencePrompt',
      'libraryPocketLabelPrompt',
      'quietOptionLine',
      'takeHomeLine',
    ])
  })
})
