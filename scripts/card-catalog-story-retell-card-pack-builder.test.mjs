import { describe, expect, it } from 'vitest'
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

import {
  inspectArtifactFiles,
  validateCardCatalogStoryRetellCardPackSource,
  validateCardCatalogStoryRetellCardPackSourceFiles,
  validateProductWorldSummaries,
} from './product-artifact-policy.mjs'
import {
  buildCardCatalogStoryRetellCardPack,
  renderCardCatalogStoryRetellCardPackHtml,
} from './card-catalog-story-retell-card-pack-builder.mjs'

const root = resolve(import.meta.dirname, '..')
const safety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, and no identifying facts.'

const sourceFiles = [
  'content/product-artifacts/lanes/batch61-card-catalog-retell-cards-a.json',
  'content/product-artifacts/lanes/batch61-card-catalog-retell-cards-b.json',
  'content/product-artifacts/lanes/batch61-card-catalog-retell-cards-c.json',
  'content/product-artifacts/lanes/batch61-card-catalog-retell-tools.json',
]

const worldAges = {
  'puddle-planet-post-office': '6-8',
  'buttonwood-library-train': '7-9',
  'cloudberry-clocktower': '8-10',
  'tiny-lantern-reef': '8-10',
  'acorn-avenue-errand-office': '7-9',
  'pocket-park-notice-board': '7-9',
  'penny-path-compass-shop': '7-9',
  'orchard-pulley-post': '8-10',
  'pond-bridge-blueprint-club': '8-10',
  'revision-river-ferry': '10-11',
  'chapter-gate-greenhouse': '10-11',
  'margin-note-market': '10-11',
  'blue-pencil-observatory': '10-11',
  'binding-day-boardwalk': '10-11',
  'sticker-station-mail-cart': '7-9',
  'paperclip-plaza-parcel-day': '7-9',
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
      premise: 'A friendly invented world for an adult-led paper card catalog retell card.',
    },
  ]),
)

const cardKeys = [
  'id',
  'title',
  'worldSlug',
  'ageBand',
  'retellSkill',
  'useCase',
  'adultSetup',
  'kidDirection',
  'beginningSnapshotPrompt',
  'middleCluePrompt',
  'turningChoicePrompt',
  'endingAnswerPrompt',
  'favoriteDetailPrompt',
  'nextRetellPrompt',
  'cardCatalogLabelPrompt',
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
    .replace('Post Office', 'Post Office')
}

function batchWorldSlugs(batchNumber) {
  const byBatch = {
    56: 'content/product-artifacts/manila-folder-story-clue-trail-card-pack.json',
    57: 'content/product-artifacts/pocket-folder-story-goal-path-card-pack.json',
    58: 'content/product-artifacts/hanging-file-story-decision-point-card-pack.json',
    59: 'content/product-artifacts/file-box-story-turning-point-card-pack.json',
    60: 'content/product-artifacts/archive-drawer-story-resolution-card-pack.json',
  }
  return readJson(byBatch[batchNumber]).worldSlugs
}

function makeCards() {
  return worldSlugs.map((worldSlug, index) => {
    const number = String(index + 1).padStart(2, '0')
    const title = titleForSlug(worldSlug)
    return {
      id: `card-catalog-retell-card-${number}`,
      title: `${title} Story Retell Card`,
      worldSlug,
      ageBand: worldAges[worldSlug],
      retellSkill: `retell a fictional ${title} page by naming a beginning snapshot, middle clue, turning choice, ending answer, favorite detail, next retell prompt, and card catalog label: ____________________.`,
      useCase: `Adult-led fictional offline paper-only card catalog retell card for a made-up ${title} page: ____________________.`,
      adultSetup: `Adult: set out a blank page, pencil, and pretend card catalog slip for the ${title} retell: ____________________.`,
      kidDirection: `Writer: keep every ${title} detail invented while the retell stays on paper: ____________________.`,
      beginningSnapshotPrompt: `Beginning snapshot: write the first pretend picture the retell should name for ${title}: ____________________.`,
      middleCluePrompt: `Middle clue: write one pretend clue or change from the middle of the page for ${title}: ____________________.`,
      turningChoicePrompt: `Turning choice: write the pretend choice that moved the story toward its answer in ${title}: ____________________.`,
      endingAnswerPrompt: `Ending answer: write the calm pretend answer or settled ending for ${title}: ____________________.`,
      favoriteDetailPrompt: `Favorite detail: write one pretend detail that helps the retell feel specific in ${title}: ____________________.`,
      nextRetellPrompt: `Next retell prompt: write one question an adult can ask during a later paper retell for ${title}: ____________________.`,
      cardCatalogLabelPrompt: `Card catalog label: write a broad pretend label for this ${title} retell card: ____________________.`,
      quietOptionLine: `Quiet option: adult and writer fill only the beginning snapshot, ending answer, and card catalog label first: ____________________.`,
      takeHomeLine: `Take-home line: save this paper retell card for one later adult-led retell: ____________________.`,
    }
  })
}

function makeTools() {
  return {
    adultGuide: {
      title: 'Card Catalog Retell Adult Guide: ____________________.',
      bullets: [
        'Adult-led setup: place the card catalog slips, blank pages, pencils, and one retell card on the table: ____________________.',
        'Adult-led framing: keep the beginning snapshot, middle clue, turning choice, ending answer, favorite detail, next retell prompt, and card catalog label fictional: ____________________.',
        'Adult-led order: move from beginning snapshot to middle clue, turning choice, ending answer, favorite detail, next retell prompt, and card catalog label: ____________________.',
        'Adult-led support: let the writer point, dictate, sketch, or write one short paper line per blank: ____________________.',
        'Adult-led safety: use pretend names, broad made-up places, and invented actions instead of personal facts: ____________________.',
        'Adult-led finish: read the card catalog label and save the next retell prompt for a later paper pass: ____________________.',
      ],
    },
    retellRoutines: [
      {
        title: 'Beginning Snapshot Sort: ____________________.',
        time: 'short paper setup: ____________________.',
        materials: 'Card catalog slip, blank page, and pencil: ____________________.',
        steps: [
          'The adult points to the beginning snapshot blank: ____________________.',
          'The writer names the first pretend picture from the page: ____________________.',
          'The adult asks what the beginning helps the listener remember: ____________________.',
          'The writer writes or dictates one beginning snapshot line: ____________________.',
        ],
        adultWrapLine: 'This retell starts with the beginning snapshot: ____________________.',
      },
      {
        title: 'Middle Clue Link: ____________________.',
        time: 'middle clue pass: ____________________.',
        materials: 'Card catalog slip, middle clue blank, and pencil: ____________________.',
        steps: [
          'The adult rereads the beginning snapshot and points to the middle clue blank: ____________________.',
          'The writer names one pretend clue or change from the middle: ____________________.',
          'The adult asks how that clue moves the page forward: ____________________.',
          'The writer writes the middle clue on paper: ____________________.',
        ],
        adultWrapLine: 'The middle clue keeps the retell moving by: ____________________.',
      },
      {
        title: 'Turning Choice Check: ____________________.',
        time: 'choice retell pass: ____________________.',
        materials: 'Card catalog slip, turning choice blank, and pencil: ____________________.',
        steps: [
          'The adult points from the middle clue to the turning choice blank: ____________________.',
          'The writer names one pretend choice that changed the story direction: ____________________.',
          'The adult asks what happened because of that choice: ____________________.',
          'The writer writes the turning choice line: ____________________.',
        ],
        adultWrapLine: 'The turning choice changes the retell by: ____________________.',
      },
      {
        title: 'Ending Answer Pass: ____________________.',
        time: 'ending answer pass: ____________________.',
        materials: 'Card catalog slip, ending answer blank, and pencil: ____________________.',
        steps: [
          'The adult rereads the turning choice and points to the ending answer blank: ____________________.',
          'The writer names the calm pretend answer or settled ending: ____________________.',
          'The adult asks which earlier clue the ending answers: ____________________.',
          'The writer writes the ending answer on paper: ____________________.',
        ],
        adultWrapLine: 'The ending answer settles the retell by: ____________________.',
      },
      {
        title: 'Favorite Detail Note: ____________________.',
        time: 'detail retell pass: ____________________.',
        materials: 'Card catalog slip, favorite detail blank, and pencil: ____________________.',
        steps: [
          'The adult asks for one pretend detail worth keeping in the retell: ____________________.',
          'The writer chooses a small invented object, action, or sound from the page: ____________________.',
          'The adult asks where that detail belongs in the retell order: ____________________.',
          'The writer writes the favorite detail line: ____________________.',
        ],
        adultWrapLine: 'The favorite detail for this retell is: ____________________.',
      },
      {
        title: 'Card Catalog Label Close: ____________________.',
        time: 'label wrap pass: ____________________.',
        materials: 'Card catalog label slip, retell card, and pencil: ____________________.',
        steps: [
          'The adult rereads the beginning, middle, turning choice, ending, and favorite detail: ____________________.',
          'The writer chooses one next retell prompt for a later paper pass: ____________________.',
          'The adult asks what broad label should help find this retell again: ____________________.',
          'The writer writes the card catalog label and files the slip: ____________________.',
        ],
        adultWrapLine: 'The card catalog label closes this retell as: ____________________.',
      },
    ],
    takeHomeRetellSlips: [
      'Adult: ask for the beginning snapshot from the pretend page: ____________________.',
      'Writer: the beginning snapshot I remember is: ____________________.',
      'Adult: ask for one middle clue or change: ____________________.',
      'Writer: the middle clue is: ____________________.',
      'Adult: ask which turning choice moved the page toward the ending: ____________________.',
      'Writer: the turning choice is: ____________________.',
      'Adult: ask for the ending answer in one paper line: ____________________.',
      'Writer: the ending answer is: ____________________.',
      'Adult: ask for one favorite pretend detail and one next retell prompt: ____________________.',
      'Writer: the card catalog label for this retell is: ____________________.',
    ],
    optionalAdultPrompts: [
      'Optional adult-led paper prompt: the beginning snapshot is ____________________.',
      'Optional adult-led paper prompt: the middle clue is ____________________.',
      'Optional adult-led paper prompt: the turning choice is ____________________.',
      'Optional adult-led paper prompt: the ending answer is ____________________.',
      'Optional adult-led paper prompt: the favorite detail is ____________________.',
      'Optional adult-led paper prompt: the next retell prompt can ask ____________________.',
      'Optional adult-led paper prompt: the card catalog label can say ____________________.',
      'Optional adult-led paper prompt: the later paper retell can start with ____________________.',
    ],
  }
}

function validSource(overrides = {}) {
  const tools = makeTools()
  return {
    batchId: '2026-06-04-batch61',
    generatedAt: '2026-06-04',
    productSlug: 'card-catalog-story-retell-card-pack',
    title: 'Card Catalog Story Retell Card Pack',
    pricePoint: '$95',
    audience: 'Families, homeschool groups, tutors, and adult-led writing tables for writers ages 7-11.',
    sessionLength:
      '16 printable card catalog story retell cards plus adult guide tools, retell routines, take-home retell slips, and optional adult prompts',
    safetyNote: safety,
    artifact: {
      pdfPath:
        'product-build/card-catalog-story-retell-card-pack/Card-Catalog-Story-Retell-Card-Pack.pdf',
      zipPath:
        'product-build/card-catalog-story-retell-card-pack/card-catalog-story-retell-card-pack.zip',
      sourceHtmlPath:
        'product-build/card-catalog-story-retell-card-pack/source/card-catalog-story-retell-card-pack.html',
      manifestPath: 'product-build/card-catalog-story-retell-card-pack/manifest.json',
    },
    sourceFiles: [...sourceFiles],
    worldSlugs: [...worldSlugs],
    cover: {
      kicker: 'Printable card catalog retell cards',
      headline: 'Card Catalog Story Retell Card Pack',
      subhead:
        'Sixteen card-catalog cards help writers retell a beginning snapshot, middle clue, turning choice, ending answer, favorite detail, and next retell prompt.',
      included: [
        '16 printable card catalog retell cards',
        'Adult setup guide',
        'Fictional retell safety notes',
        'Beginning snapshot prompts',
        'Middle clue prompts',
        'Turning choice prompts',
        'Ending answer prompts',
        'Favorite detail prompts',
        'Six adult-led retell routines',
        'Ten take-home retell slips',
        'Printable PDF and ZIP artifact',
      ],
    },
    adultGuide: tools.adultGuide,
    retellRoutines: tools.retellRoutines,
    takeHomeRetellSlips: tools.takeHomeRetellSlips,
    optionalAdultPrompts: tools.optionalAdultPrompts,
    cards: makeCards(),
    ...overrides,
  }
}

function validProduct(overrides = {}) {
  return {
    slug: 'card-catalog-story-retell-card-pack',
    title: 'Card Catalog Story Retell Card Pack',
    pricePoint: '$95',
    status: 'checkout_pending',
    headline: 'A printable retell card pack for restating paper stories without pressure.',
    summary:
      'Sixteen card catalog cards help kids retell fictional stories with beginning snapshots, middle clues, turning choices, ending answers, favorite details, and labels.',
    heroImage: 'images/plotsprout/batch61/card-catalog-story-retell-card-pack.jpg',
    ctaLabel: 'Request card catalog pack launch notice',
    ctaHref: 'mailto:samfrench@gmail.com?subject=Card%20Catalog%20Story%20Retell%20Card%20Pack',
    checkoutNote:
      'Checkout is pending until the payment provider is selected; this static card catalog pack page is ready for hosted checkout wiring but does not accept payment yet.',
    safetyNote: safety,
    worldSlugs: [...worldSlugs],
    includedPages: [
      'Sixteen printable card catalog retell cards',
      'Adult setup guide',
      'Beginning snapshot prompts',
      'Middle clue prompts',
      'Turning choice prompts',
      'Ending answer prompts',
      'Favorite detail prompts',
      'Next retell prompts',
      'Ten take-home retell slips',
      'Provider-ready PDF, source HTML, README, manifest, and ZIP artifact',
    ],
    useCases: [
      'A family paper table for retelling short fictional drafts',
      'A homeschool writing station for beginning-middle-ending retell practice',
      'A tutoring pack for writers who need concrete retell order',
      'An adult-led small group activity with no accounts or online posting',
    ],
    parentSteps: [
      'Print one retell card and set it beside a blank page.',
      'Ask for the beginning snapshot before asking for the middle clue.',
      'Let the child point, dictate, sketch, or write one short line per blank.',
      'Close with a card catalog label and save the next retell prompt for later.',
    ],
    worldSummaries: worldSlugs.map((slug) => ({
      slug,
      title: titleForSlug(slug),
      summary: `A pretend ${titleForSlug(slug)} world for restating one story in card catalog order.`,
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

describe('Card Catalog Story Retell Card Pack policy', () => {
  it('accepts the canonical source contract and product alignment', () => {
    const errors = validateCardCatalogStoryRetellCardPackSource(
      validSource(),
      validProduct(),
      knownWorldAges,
    )

    expect(errors).toEqual([])
  })

  it('requires exact source keys, card keys, world order, lane paths, and artifact paths', () => {
    const badCards = makeCards()
    badCards[0] = { extra: true, ...badCards[0], title: 'Changed Retell Title' }
    const errors = validateCardCatalogStoryRetellCardPackSource(
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

    expect(errors).toMatch(/sourceFiles must list the exact Batch 61 card catalog retell card lane/)
    expect(errors).toMatch(/artifact.pdfPath must be/)
    expect(errors).toMatch(/worldSlugs must match the exact Batch 61 card catalog retell world set/)
    expect(errors).toMatch(/cards\[0\] keys must match/)
    expect(errors).toMatch(/cards\[0\].title must include/)
  })

  it('enforces exact recent batch overlap counts', () => {
    const expected = { 56: 8, 57: 7, 58: 7, 59: 8, 60: 2 }

    for (const [batch, count] of Object.entries(expected)) {
      expect(worldSlugs.filter((slug) => batchWorldSlugs(Number(batch)).includes(slug))).toHaveLength(count)
    }

    const badWorlds = [...worldSlugs]
    badWorlds[0] = 'teacup-town-weather-window'
    const errors = validateCardCatalogStoryRetellCardPackSource(
      validSource({ worldSlugs: badWorlds }),
      validProduct({ worldSlugs: badWorlds }),
      knownWorldAges,
    ).join('\n')

    expect(errors).toMatch(/Batch61 must overlap Batch60 in exactly 2 worlds/)
  })

  it('rejects unsafe, pressure, review, rating, and personal-data terms', () => {
    const unsafeCards = makeCards()
    unsafeCards[0] = {
      ...unsafeCards[0],
      kidDirection:
        'Writer can publish the perfect public portfolio, upload a photo, add a review and rating, and use a real address: ____________________.',
    }
    const errors = validateCardCatalogStoryRetellCardPackSource(
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
    expect(errors).toMatch(/review/)
    expect(errors).toMatch(/rating/)
    expect(errors).toMatch(/chapter book/)
    expect(errors).toMatch(/cliffhanger/)
    expect(errors).toMatch(/plot twist/)
    expect(errors).toMatch(/upload/)
    expect(errors).toMatch(/photo/)
  })

  it('validates committed lane files and flags stale canonical source drift', () => {
    const source = readJson('content/product-artifacts/card-catalog-story-retell-card-pack.json')
    const laneErrors = validateCardCatalogStoryRetellCardPackSourceFiles(source, root)

    if (existsSync(resolve(root, sourceFiles[0]))) {
      expect(laneErrors).toEqual([])
    } else {
      expect(laneErrors.join('\n')).toMatch(/Missing lane file|could not be read as JSON/)
    }

    source.cards[0].kidDirection =
      'Writer keeps every detail pretend while changing the retell order: ____________________.'
    source.adultGuide.bullets[0] =
      'Adult-led setup: place a changed card catalog setup on the table: ____________________.'

    const driftErrors = validateCardCatalogStoryRetellCardPackSourceFiles(source, root).join('\n')

    expect(driftErrors).toMatch(/retell card lanes must reproduce cards exactly/)
    expect(driftErrors).toMatch(/tools lane must reproduce adultGuide exactly/)
  })

  it('renders card catalog retell fields into source HTML', () => {
    const html = renderCardCatalogStoryRetellCardPackHtml(validSource(), worlds)

    expect(html).toContain('Card Catalog Story Retell Card Pack')
    expect(html).toContain('Beginning snapshot')
    expect(html).toContain('Middle clue')
    expect(html).toContain('Turning choice')
    expect(html).toContain('Ending answer')
    expect(html).toContain('Favorite detail')
    expect(html).toContain('Next retell prompt')
    expect(html).toContain('Card catalog label')
    expect(html).toContain('Puddle Planet Post Office')
  })

  it('inspects deterministic builder artifacts and manifest shape', async () => {
    const buildDir = mkdtempSync(join(tmpdir(), 'card-catalog-retell-build-'))

    try {
      const result = await buildCardCatalogStoryRetellCardPack({
        source: readJson('content/product-artifacts/card-catalog-story-retell-card-pack.json'),
        worlds,
        buildDir,
        pdfRenderer: async () => fakePdf(21),
      })
      const expectedZipEntries = [
        'Card-Catalog-Story-Retell-Card-Pack.pdf',
        'README.txt',
        'source/card-catalog-story-retell-card-pack.html',
        ...result.manifest.files.assets.map((asset) => asset.path),
      ]

      const status = inspectArtifactFiles(
        buildDir,
        {
          pdfPath: 'Card-Catalog-Story-Retell-Card-Pack.pdf',
          zipPath: 'card-catalog-story-retell-card-pack.zip',
          sourceHtmlPath: 'source/card-catalog-story-retell-card-pack.html',
          manifestPath: 'manifest.json',
        },
        {
          expectedPdfPages: 21,
          pdfRoot: buildDir,
          expectedZipEntries,
        },
      )

      expect(result.manifest.productSlug).toBe('card-catalog-story-retell-card-pack')
      expect(result.manifest.sourcePageCount).toBe(16)
      expect(result.manifest.files.zip.path).toBe('card-catalog-story-retell-card-pack.zip')
      expect(status.valid).toBe(true)
    } finally {
      rmSync(buildDir, { recursive: true, force: true })
    }
  })

  it('keeps the committed product checkout-pending and world summaries aligned', () => {
    const products = readJson('content/products/batch5-products.json')
    const product = products.products.find((candidate) => candidate.slug === 'card-catalog-story-retell-card-pack')

    expect(product).toMatchObject({
      slug: 'card-catalog-story-retell-card-pack',
      title: 'Card Catalog Story Retell Card Pack',
      pricePoint: '$95',
      status: 'checkout_pending',
      heroImage: 'images/plotsprout/batch61/card-catalog-story-retell-card-pack.jpg',
    })
    expect(validateProductWorldSummaries(product, 'Card Catalog Story Retell Card Pack')).toEqual([])
  })

  it('requires the local product image manifest and generated image sidecar', () => {
    const manifests = readJson('content/image-queue/2026-06-04-batch61-images.json')
    const image = manifests.images.find((entry) => entry.slug === 'card-catalog-story-retell-card-pack')

    expect(image).toMatchObject({
      slug: 'card-catalog-story-retell-card-pack',
      outputJpeg: 'public/images/plotsprout/batch61/card-catalog-story-retell-card-pack.jpg',
      outputWebp: 'public/images/plotsprout/batch61/card-catalog-story-retell-card-pack.webp',
      sidecar: 'content/image-runs/batch61/card-catalog-story-retell-card-pack.json',
    })
    expect(image.prompt).toMatch(/card catalog/i)
    expect(image.negativePrompt).toMatch(/text/i)
  })

  it('documents exact card field order for generated lanes', () => {
    expect(cardKeys).toEqual([
      'id',
      'title',
      'worldSlug',
      'ageBand',
      'retellSkill',
      'useCase',
      'adultSetup',
      'kidDirection',
      'beginningSnapshotPrompt',
      'middleCluePrompt',
      'turningChoicePrompt',
      'endingAnswerPrompt',
      'favoriteDetailPrompt',
      'nextRetellPrompt',
      'cardCatalogLabelPrompt',
      'quietOptionLine',
      'takeHomeLine',
    ])
  })
})
