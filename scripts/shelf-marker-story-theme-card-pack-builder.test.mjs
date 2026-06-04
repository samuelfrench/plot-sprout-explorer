import { describe, expect, it } from 'vitest'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, resolve } from 'node:path'

import {
  inspectArtifactFiles,
  validateProductWorldSummaries,
  validateShelfMarkerStoryThemeCardPackSource,
  validateShelfMarkerStoryThemeCardPackSourceFiles,
} from './product-artifact-policy.mjs'
import {
  buildShelfMarkerStoryThemeCardPack,
  renderShelfMarkerStoryThemeCardPackHtml,
} from './shelf-marker-story-theme-card-pack-builder.mjs'

const root = resolve(import.meta.dirname, '..')
const safety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, and no identifying facts.'

const sourceFiles = [
  'content/product-artifacts/lanes/batch63-shelf-marker-theme-cards-a.json',
  'content/product-artifacts/lanes/batch63-shelf-marker-theme-cards-b.json',
  'content/product-artifacts/lanes/batch63-shelf-marker-theme-cards-c.json',
  'content/product-artifacts/lanes/batch63-shelf-marker-theme-tools.json',
]

const worldAges = {
  'compass-craft-academy': '10-11',
  'tiny-lantern-reef': '8-10',
  'acorn-avenue-errand-office': '7-9',
  'compost-clock-workshop': '8-10',
  'pantry-measurement-mystery': '8-10',
  'button-bakery-map-mixup': '7-9',
  'revision-river-ferry': '10-11',
  'sticker-station-mail-cart': '7-9',
  'moon-muffin-market': '6-8',
  'index-card-theater-club': '10-11',
  'puddle-planet-post-office': '6-8',
  'binding-day-boardwalk': '10-11',
  'seed-library-map-room': '8-10',
  'moss-message-observatory': '8-10',
  'cloudberry-clocktower': '8-10',
  'spoon-ferry-lunchbox-harbor': '7-9',
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
      premise: 'A friendly invented world for an adult-led paper story theme card.',
    },
  ]),
)

const cardKeys = [
  'id',
  'title',
  'worldSlug',
  'ageBand',
  'themeSkill',
  'useCase',
  'adultSetup',
  'kidDirection',
  'storyQuestionPrompt',
  'repeatedCluePrompt',
  'characterChoicePrompt',
  'endingEchoPrompt',
  'themeLinePrompt',
  'shelfMarkerNotePrompt',
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
  }
  return readJson(byBatch[batchNumber]).worldSlugs
}

function overlapCount(left, right) {
  const rightSet = new Set(right)
  return left.filter((item) => rightSet.has(item)).length
}

function makeCards() {
  return worldSlugs.map((worldSlug, index) => {
    const number = String(index + 1).padStart(2, '0')
    const title = titleForSlug(worldSlug)
    return {
      id: `shelf-marker-theme-card-${number}`,
      title: `${title} Story Theme Card`,
      worldSlug,
      ageBand: worldAges[worldSlug],
      themeSkill: `notice a fictional ${title} story theme by naming the story question, repeated clue, character choice, ending echo, theme line, and shelf marker note: ____________________.`,
      useCase: `Adult-led fictional offline paper-only theme card for a made-up ${title} story page: ____________________.`,
      adultSetup: `Adult: set out a blank page, pencil, and pretend shelf marker before the ${title} theme search begins: ____________________.`,
      kidDirection: `Writer: keep every ${title} idea invented while the theme stays on paper: ____________________.`,
      storyQuestionPrompt: `Story question: write the pretend question the ${title} story keeps asking: ____________________.`,
      repeatedCluePrompt: `Repeated clue: write one pretend clue that appears more than once in ${title}: ____________________.`,
      characterChoicePrompt: `Character choice: write one invented choice that shows what matters in ${title}: ____________________.`,
      endingEchoPrompt: `Ending echo: write how the ${title} ending quietly answers the story question: ____________________.`,
      themeLinePrompt: `Theme line: write one short paper line about the idea the invented story keeps returning to: ____________________.`,
      shelfMarkerNotePrompt: `Shelf marker note: write a broad pretend shelf marker note for this ${title} theme card: ____________________.`,
      quietOptionLine: `Quiet option: adult and writer fill only the story question, repeated clue, and theme line first: ____________________.`,
      takeHomeLine: `Take-home line: save this paper theme card for one later adult-led theme pass: ____________________.`,
    }
  })
}

function makeTools() {
  return {
    adultGuide: {
      title: 'Shelf Marker Theme Adult Guide: ____________________.',
      setupSteps: [
        'Place one theme card, blank paper, pencil, and pretend shelf marker on the table: ____________________.',
        'Choose one fictional world and read the card title aloud: ____________________.',
        'Point to the story question, repeated clue, character choice, ending echo, and theme line blanks: ____________________.',
        'Let the writer point, dictate, sketch, or write short paper lines: ____________________.',
        'Close by reading the theme line and shelf marker note together: ____________________.',
      ],
      facilitationNotes: [
        'Keep the pace calm and adult-led with one paper blank at a time: ____________________.',
        'Accept short invented phrases before asking for a full theme line: ____________________.',
        'Use the repeated clue to make the theme specific without adding personal facts: ____________________.',
        'If the writer stalls, fill only the story question and ending echo first: ____________________.',
        'Save the shelf marker note as the paper close, not as a real service step: ____________________.',
      ],
      safetyNotes: [
        'Use pretend names, broad made-up places, and invented actions: ____________________.',
        'Do not ask for real school, home, schedule, or identity details: ____________________.',
        'Do not collect child writing, photos, audio, video, or personal profiles: ____________________.',
        'Keep every prompt offline, paper-only, and adult-led: ____________________.',
        'Keep the shelf marker note fictional and separate from real book or library systems: ____________________.',
      ],
    },
    themeRoutines: [
      routine('Story Question Start', 'Use when the writer needs a first theme anchor.'),
      routine('Repeated Clue Hunt', 'Use when the writer needs one repeated invented clue.'),
      routine('Character Choice Check', 'Use when the writer needs a choice that shows what matters.'),
      routine('Ending Echo Close', 'Use when the writer needs the ending to answer the story question.'),
      routine('Theme Line Draft', 'Use when the writer is ready to say the keeper idea simply.'),
      routine('Shelf Marker Finish', 'Use when the theme line is ready to label on paper.'),
    ],
    takeHomeThemeSlips: [
      slip('Story Question Slip', 'Story question from the pretend page: ____________________.'),
      slip('Repeated Clue Slip', 'Repeated clue I noticed in the pretend story: ____________________.'),
      slip('Character Choice Slip', 'Choice that shows what matters: ____________________.'),
      slip('Ending Echo Slip', 'Ending echo that answers the story question: ____________________.'),
      slip('Theme Line Slip', 'My short theme line is: ____________________.'),
      slip('Shelf Marker Slip', 'Pretend shelf marker note for this theme: ____________________.'),
      slip('Short Theme Slip', 'This pretend story keeps returning to: ____________________.'),
      slip('Choice And Echo Slip', 'The choice is ____ and the ending echo is ____.'),
      slip('Clue And Theme Slip', 'The repeated clue is ____ and the theme line is ____.'),
      slip('Adult-Led Later Slip', 'Next time, I can add one more invented clue: ____________________.'),
    ],
    optionalAdultPrompts: [
      'Ask which invented question the story keeps circling: ____________________.',
      'Ask which clue appears more than once on the paper page: ____________________.',
      'Ask what the character chooses without using real-life facts: ____________________.',
      'Ask how the ending answers the first story question: ____________________.',
      'Ask for one short theme line, not a grade or score: ____________________.',
      'Ask where the shelf marker note belongs on the paper card: ____________________.',
      'Invite a dictated answer before asking for handwriting: ____________________.',
      'Stop after one filled blank if the writer is done: ____________________.',
    ],
  }
}

function routine(title, useWhen) {
  return {
    title: `${title}: ____________________.`,
    useWhen: `${useWhen}: ____________________.`,
    steps: [
      'Adult points to one theme blank: ____________________.',
      'Writer names one invented story idea: ____________________.',
      'Adult asks how that idea returns later: ____________________.',
      'Writer writes one short paper line: ____________________.',
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

function makeSource() {
  const tools = makeTools()
  return {
    batchId: '2026-06-04-batch63',
    generatedAt: '2026-06-04',
    productSlug: 'shelf-marker-story-theme-card-pack',
    title: 'Shelf Marker Story Theme Card Pack',
    pricePoint: '$99',
    audience: 'Families, homeschool groups, tutors, and adult-led writing tables for writers ages 7-11.',
    sessionLength:
      '16 printable shelf marker story theme cards plus adult guide tools, theme routines, take-home theme slips, and optional adult prompts',
    safetyNote: safety,
    artifact: {
      pdfPath:
        'product-build/shelf-marker-story-theme-card-pack/Shelf-Marker-Story-Theme-Card-Pack.pdf',
      zipPath:
        'product-build/shelf-marker-story-theme-card-pack/shelf-marker-story-theme-card-pack.zip',
      sourceHtmlPath:
        'product-build/shelf-marker-story-theme-card-pack/source/shelf-marker-story-theme-card-pack.html',
      manifestPath: 'product-build/shelf-marker-story-theme-card-pack/manifest.json',
    },
    sourceFiles: [...sourceFiles],
    worldSlugs: [...worldSlugs],
    cover: {
      kicker: 'Printable shelf marker theme cards',
      headline: 'Shelf Marker Story Theme Card Pack',
      subhead:
        'Sixteen paper shelf marker cards help writers notice story questions, repeated clues, character choices, ending echoes, theme lines, and shelf marker notes.',
      included: [
        '16 printable shelf marker theme cards',
        'Adult setup guide',
        'Fictional theme safety notes',
        'Story question prompts',
        'Repeated clue prompts',
        'Character choice prompts',
        'Ending echo prompts',
        'Theme line prompts',
        'Six adult-led theme routines',
        'Ten take-home theme slips',
        'Printable PDF and ZIP artifact',
      ],
    },
    adultGuide: tools.adultGuide,
    themeRoutines: tools.themeRoutines,
    takeHomeThemeSlips: tools.takeHomeThemeSlips,
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
    headline: 'Printable shelf marker cards for private fictional story themes.',
    summary:
      'Sixteen shelf marker cards help kids notice fictional story themes through story questions, repeated clues, choices, ending echoes, and theme lines.',
    heroImage: 'images/plotsprout/batch63/shelf-marker-story-theme-card-pack.jpg',
    ctaLabel: 'Request shelf marker pack launch notice',
    ctaHref: 'mailto:samfrench@gmail.com?subject=Shelf%20Marker%20Story%20Theme%20Card%20Pack',
    checkoutNote:
      'Checkout is pending until the payment provider is selected; this static shelf marker pack page is ready for hosted checkout wiring but does not accept payment yet.',
    safetyNote: source.safetyNote,
    worldSlugs: [...source.worldSlugs],
    worldSummaries: source.worldSlugs.map((slug) => ({
      slug,
      title: titleForSlug(slug),
      summary: `A pretend ${titleForSlug(slug)} world for noticing one fictional story theme on paper.`,
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
      themeRoutines: source.themeRoutines,
      takeHomeThemeSlips: source.takeHomeThemeSlips,
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
  const imageRoot = mkdtempSync(resolve(tmpdir(), 'plotsprout-batch63-images-'))
  for (const slug of source.worldSlugs) {
    writeFileSync(resolve(imageRoot, `${slug}.jpg`), `fake jpeg bytes for ${slug}`)
  }
  return imageRoot
}

describe('Shelf Marker Story Theme Card Pack contract', () => {
  it('validates source schema, field order, world set, product alignment, and recent overlap limits', () => {
    const source = makeSource()
    const product = makeProduct(source)

    expect(source.cards).toHaveLength(16)
    expect(source.themeRoutines).toHaveLength(6)
    expect(source.takeHomeThemeSlips).toHaveLength(10)
    expect(source.optionalAdultPrompts).toHaveLength(8)
    expect(source.worldSlugs).toEqual(worldSlugs)
    expect(Object.keys(source.cards[0])).toEqual(cardKeys)
    expect(overlapCount(worldSlugs, batchWorldSlugs(56))).toBe(6)
    expect(overlapCount(worldSlugs, batchWorldSlugs(57))).toBe(6)
    expect(overlapCount(worldSlugs, batchWorldSlugs(58))).toBe(6)
    expect(overlapCount(worldSlugs, batchWorldSlugs(59))).toBe(6)
    expect(overlapCount(worldSlugs, batchWorldSlugs(60))).toBe(6)
    expect(overlapCount(worldSlugs, batchWorldSlugs(61))).toBe(7)
    expect(overlapCount(worldSlugs, batchWorldSlugs(62))).toBe(5)

    expect(validateProductWorldSummaries(product, 'Batch63 product')).toEqual([])
    expect(validateShelfMarkerStoryThemeCardPackSource(source, product, knownWorldAges)).toEqual([])
  })

  it('rejects unsafe publishing, assessment, media, private-data, rating, and real-library-service language', () => {
    const source = makeSource()
    source.cards[0].themeLinePrompt =
      'Publish a perfect public review with a rating, real library card number, barcode label, due date, photo upload, and score: ____________________.'

    const errors = validateShelfMarkerStoryThemeCardPackSource(source, makeProduct(source), knownWorldAges)
    expect(errors.join('\n')).toMatch(/publish|perfect|public|review|rating|library card|barcode|due date|photo|score/i)
  })

  it('validates exact source lane files from a temporary lane root', () => {
    const source = makeSource()
    const tempRoot = mkdtempSync(resolve(tmpdir(), 'plotsprout-batch63-lanes-'))
    try {
      writeTempLaneFiles(source, tempRoot)
      expect(validateShelfMarkerStoryThemeCardPackSourceFiles(source, tempRoot)).toEqual([])
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('renders theme-specific printable fields without checkout or service-flow language', () => {
    const source = makeSource()
    const html = renderShelfMarkerStoryThemeCardPackHtml(source, worlds)

    expect(html).toContain('Story question')
    expect(html).toContain('Repeated clue')
    expect(html).toContain('Character choice')
    expect(html).toContain('Ending echo')
    expect(html).toContain('Theme line')
    expect(html).toContain('Shelf marker note')
    expect(html).not.toMatch(/checkout desk|due date|fine|barcode|call number|rating|review/i)
  })

  it('builds deterministic PDF, ZIP, source HTML, and manifest artifacts in a temporary output directory', async () => {
    const source = makeSource()
    const tempBuild = mkdtempSync(resolve(tmpdir(), 'plotsprout-batch63-build-'))
    const imageRoot = makeImageRoot(source)

    try {
      const first = await buildShelfMarkerStoryThemeCardPack({
        source,
        product: makeProduct(source),
        worlds,
        outputDir: tempBuild,
        imageRoot,
        pdfRenderer: () => Buffer.from('%PDF-1.7\n1 0 obj\n<<>>\nendobj\n%%EOF\n'),
      })
      const firstManifest = readFileSync(first.manifestPath, 'utf8')
      const firstZip = readFileSync(first.zipPath)

      const second = await buildShelfMarkerStoryThemeCardPack({
        source,
        product: makeProduct(source),
        worlds,
        outputDir: tempBuild,
        imageRoot,
        pdfRenderer: () => Buffer.from('%PDF-1.7\n1 0 obj\n<<>>\nendobj\n%%EOF\n'),
      })

      expect(existsSync(second.pdfPath)).toBe(true)
      expect(existsSync(second.zipPath)).toBe(true)
      expect(existsSync(second.htmlPath)).toBe(true)
      expect(readFileSync(second.manifestPath, 'utf8')).toBe(firstManifest)
      expect(readFileSync(second.zipPath)).toEqual(firstZip)
      expect(
        inspectArtifactFiles(
          {
            pdfPath: second.pdfPath,
            zipPath: second.zipPath,
            sourceHtmlPath: second.htmlPath,
            manifestPath: second.manifestPath,
          },
          'Batch63 temp artifact',
        ),
      ).toEqual([])
    } finally {
      rmSync(tempBuild, { recursive: true, force: true })
      rmSync(imageRoot, { recursive: true, force: true })
    }
  })
})
