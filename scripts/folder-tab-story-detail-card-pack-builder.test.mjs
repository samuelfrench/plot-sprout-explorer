import { describe, expect, it } from 'vitest'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'

import {
  inspectArtifactFiles,
  validateFolderTabStoryDetailCardPackSource,
  validateFolderTabStoryDetailCardPackSourceFiles,
  validateProductWorldSummaries,
} from './product-artifact-policy.mjs'
import {
  buildFolderTabStoryDetailCardPack,
  renderFolderTabStoryDetailCardPackHtml,
} from './folder-tab-story-detail-card-pack-builder.mjs'

const standardSafety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles.'
const safety = standardSafety

const detailWorldAges = {
  'moon-muffin-market': '6-8',
  'puddle-planet-post-office': '6-8',
  'buttonwood-library-train': '7-9',
  'button-bakery-map-mixup': '7-9',
  'teacup-town-weather-window': '7-8',
  'pocket-park-notice-board': '7-9',
  'spoon-ferry-lunchbox-harbor': '7-9',
  'acorn-avenue-errand-office': '7-9',
  'seed-library-map-room': '8-10',
  'rain-gauge-railway': '8-10',
  'moss-message-observatory': '8-10',
  'tidepool-timekeepers-lab': '8-10',
  'revision-river-ferry': '10-11',
  'clue-label-tower-museum': '10-11',
  'compass-craft-academy': '10-11',
  'binding-day-boardwalk': '10-11',
}

const detailWorldSlugs = Object.keys(detailWorldAges)
const detailSkills = [
  'choosing a small detail step',
  'noticing a missing clue',
  'matching need to action',
  'asking the detail question',
  'tiny weather mismatch',
  'clear first try',
  'setting pressure',
  'task mix-up',
  'map mismatch',
  'signal mismatch',
  'message gap',
  'sequence detail',
  'revision target',
  'label clue detail',
  'choice obstacle',
  'promise detail',
]
const detailSlipLabels = [
  'first-line slip',
  'character slip',
  'place slip',
  'object slip',
  'question slip',
  'next-move slip',
  'sound slip',
  'detail slip',
  'voice slip',
  'revision slip',
]

function fakePdf(pageCount) {
  return Buffer.from(
    `%PDF-1.7\n${Array.from({ length: pageCount }, (_, index) => `${index + 1} 0 obj << /Type /Page >> endobj`).join('\n')}\n%%EOF\n`,
  )
}

function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex')
}

function card(index, worldSlug, ageBand) {
  return {
    id: `folder-tab-detail-card-${String(index).padStart(2, '0')}`,
    title: `Folder Tab Detail Card ${index}`,
    worldSlug,
    ageBand,
    detailSkill: detailSkills[index - 1],
    useCase:
      'Adult-led printable folder tab detail card for shaping one fictional story detail from a gentle first choice: ____________________.',
    adultSetup:
      'Adult: place one blank detail card beside the pretend folder tab and keep every choice fictional: ____________________.',
    kidDirection:
      'Spot one make-believe story detail, then write the small clue it adds: ____________________.',
    focusDetailPrompt: 'Focus detail: write the one invented detail this tab should hold: ____________________.',
    objectTraitPrompt: 'Object trait: add one harmless pretend object trait for the folder tab: ____________________.',
    placeDetailPrompt: 'Place detail: choose one broad invented place clue from a pretend setting: ____________________.',
    characterActionPrompt: 'Character move: add one gentle action that carries the character forward: ____________________.',
    moodSignalPrompt: 'Mood signal: show the invented mood with one paper-safe story clue: ____________________.',
    sentenceFramePrompt: 'Sentence frame: file the detail into one clear story sentence: ____________________.',
    detailQuestionPrompt: 'Detail question: ask which detail helps the reader picture the moment: ____________________.',
    reviseDetailPrompt: 'Revise detail: make the answer smaller, clearer, or more useful to the story: ____________________.',
    quietOptionLine: 'Quiet option: circle one detail clue and fill one blank: ____________________.',
    takeHomeLine: 'Take-home line: invent one more folder tab detail for later: ____________________.',
  }
}

function validFolderTabDetailSource(overrides = {}) {
  return {
    batchId: '2026-06-03-batch44',
    generatedAt: '2026-06-03',
    productSlug: 'folder-tab-story-detail-card-pack',
    title: 'Folder Tab Story Detail Card Pack',
    pricePoint: '$61',
    audience:
      'Families, homeschool groups, tutors, and adult-led writing tables for writers ages 7-11.',
    sessionLength:
      '16 printable detail cards plus adult guide tools, detail routines, take-home detail slips, and optional share prompts',
    safetyNote: safety,
    artifact: {
      pdfPath:
        'product-build/folder-tab-story-detail-card-pack/Folder-Tab-Story-Detail-Card-Pack.pdf',
      zipPath:
        'product-build/folder-tab-story-detail-card-pack/folder-tab-story-detail-card-pack.zip',
      sourceHtmlPath:
        'product-build/folder-tab-story-detail-card-pack/source/folder-tab-story-detail-card-pack.html',
      manifestPath: 'product-build/folder-tab-story-detail-card-pack/manifest.json',
    },
    sourceFiles: [
      'content/product-artifacts/lanes/batch44-folder-tab-detail-cards-a.json',
      'content/product-artifacts/lanes/batch44-folder-tab-detail-cards-b.json',
      'content/product-artifacts/lanes/batch44-folder-tab-detail-cards-c.json',
      'content/product-artifacts/lanes/batch44-folder-tab-detail-tools.json',
    ],
    worldSlugs: detailWorldSlugs,
    cover: {
      kicker: 'Printable folder tab detail cards',
      headline: 'Folder Tab Story Detail Card Pack',
      subhead:
        'Sixteen paper cards help writers begin fictional stories with first lines, character arrivals, place doorways, object invitations, and detail questions.',
      included: [
        '16 printable folder tab detail cards',
        'Adult setup guide',
        'Fictional detail safety notes',
        'Folder tab detail coaching moves',
        'Privacy and family handoff notes',
        'Pack reset notes',
        'Six adult-led detail routines',
        'Ten take-home detail slips',
        'Eight optional share prompts',
        'Provider-ready PDF and ZIP artifact',
      ],
    },
    adultGuide: {
      title: 'Folder Tab Detail Card Adult Guide',
      bullets: [
        'Print the detail cards, blank slips, and guide before the adult-led paper session.',
        'Use folder tabs only as paper props for labeling, sorting, pointing to, or revising invented story details.',
        'Keep every story detail fictional, broad, offline, and guided by an adult.',
        'Choose one focus detail, object trait, place clue, action, or mood signal so the folder tab has one clear job.',
        'Replace any personal place, schedule, group name, or child detail with a made-up story label.',
        'Send along only blank slips or invented examples with no identity details.',
      ],
    },
    detailRoutines: Array.from({ length: 6 }, (_, index) => ({
      name: `Detail Routine ${index + 1}`,
      bestFor: 'A calm adult-led paper writing moment with two fictional detail choices.',
      steps: [
        'Adult chooses one broad invented story start and reads the paper-only reminder.',
        'Writer chooses whether to fill the before moment or after moment first.',
        'Adult models how a focus detail, object trait, place clue, action, mood signal, and sentence frame can fit one moment.',
        'Writer drafts one short focus detail, object trait, place clue, action, mood signal, sentence frame, question, or revision on the card.',
      ],
    })),
    takeHomeDetailSlips: Array.from({ length: 10 }, (_, index) => ({
      title: `Detail Slip ${index + 1}`,
      time: detailSlipLabels[index],
      skill: detailSkills[index],
      direction: 'Choose one fictional detail clue and one pretend folder tab label: ____________________.',
      familyLine: 'A grown-up can ask what the character notices first: ____________________.',
    })),
    optionalSharePrompts: [
      'Read one invented detail step if you choose: ____________________.',
      'Show one sketched folder tab detail from the card: ____________________.',
      'Name one character need without narrow real-world facts: ____________________.',
      'Share one harmless story object that makes the detail clearer: ____________________.',
      'Point to one detail question that helped the start: ____________________.',
      'Ask an adult to read your favorite fictional detail clue: ____________________.',
      'Circle one story detail you want to keep broad: ____________________.',
      'Choose one folder tab detail for later: ____________________.',
    ],
    cards: detailWorldSlugs.map((worldSlug, index) => card(index + 1, worldSlug, detailWorldAges[worldSlug])),
    ...overrides,
  }
}

const product = {
  slug: 'folder-tab-story-detail-card-pack',
  title: 'Folder Tab Story Detail Card Pack',
  pricePoint: '$61',
  status: 'checkout_pending',
  worldSlugs: detailWorldSlugs,
  worldSummaries: detailWorldSlugs.map((slug) => ({
    slug,
    summary: `A linked fictional world summary for ${slug}.`,
  })),
}

const worldAges = new Map(detailWorldSlugs.map((worldSlug) => [worldSlug, { ageBand: detailWorldAges[worldSlug] }]))

const worlds = new Map(
  detailWorldSlugs.map((worldSlug) => [
    worldSlug,
    {
      slug: worldSlug,
      title: worldSlug
        .split('-')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' '),
      ageBand: detailWorldAges[worldSlug],
      premise: 'A friendly invented world for a screen-free detail card prompt.',
    },
  ]),
)

function writeValidFolderTabDetailLaneFiles(tempRoot, source, laneIdOverrides = {}) {
  for (const sourceFile of source.sourceFiles) {
    const target = resolve(tempRoot, sourceFile)
    const laneId = laneIdOverrides[sourceFile] ?? sourceFile.split('/').at(-1)?.replace('.json', '')
    const lane =
      sourceFile.includes('-tools')
        ? {
            laneId,
            adultGuide: source.adultGuide,
            detailRoutines: source.detailRoutines,
            takeHomeDetailSlips: source.takeHomeDetailSlips,
            optionalAdultPrompts: source.optionalSharePrompts,
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

describe('Folder Tab Story Detail Card Pack policy', () => {
  it('accepts a valid source with sixteen printable detail cards', () => {
    expect(validateFolderTabStoryDetailCardPackSource(validFolderTabDetailSource(), product, worldAges)).toEqual([])
  })

  it('rejects a detail prompt field without a writable blank', () => {
    const source = validFolderTabDetailSource()
    source.cards[0].focusDetailPrompt = 'Before moment: write what the invented scene was doing first.'
    expect(validateFolderTabStoryDetailCardPackSource(source, product, worldAges)).toContain(
      'cards[0].focusDetailPrompt must include a writable blank.',
    )
  })

  it('rejects unsafe private identity, school, route, account, upload, and camera language', () => {
    const source = validFolderTabDetailSource()
    source.cards[0].kidDirection =
      'Upload a photo to your school profile with your real name and GPS route: ____________________.'
    expect(validateFolderTabStoryDetailCardPackSource(source, product, worldAges).join('\n')).toMatch(
      /account|upload|school|route|GPS|profile|photo|camera|private-child-data/i,
    )
  })

  it('rejects scoring language in detail cards', () => {
    const source = validFolderTabDetailSource()
    source.cards[0].kidDirection = 'Use a scoring pass to rank this detail: ____________________.'
    expect(validateFolderTabStoryDetailCardPackSource(source, product, worldAges).join('\n')).toMatch(
      /score|scoring/i,
    )
  })

  it('requires the standard product safety sentence in the source safety note', () => {
    const source = validFolderTabDetailSource({
      safetyNote:
        'Family-safe fictional details only; paper-only adult-led work with broad invented labels and no narrow personal facts.',
    })
    expect(validateFolderTabStoryDetailCardPackSource(source, product, worldAges)).toContain(
      `safetyNote must include ${standardSafety}`,
    )
  })

  it('rejects timed take-home slip labels', () => {
    const source = validFolderTabDetailSource()
    source.takeHomeDetailSlips[0].time = '7 minutes'
    expect(validateFolderTabStoryDetailCardPackSource(source, product, worldAges)).toContain(
      'takeHomeDetailSlips[0].time must use a non-timed take-home slip label.',
    )
  })

  it('requires product world summaries for every linked world', () => {
    expect(validateProductWorldSummaries(product, 'Folder Tab Story Detail Card Pack')).toEqual([])
    expect(
      validateProductWorldSummaries(
        { ...product, worldSummaries: product.worldSummaries.slice(0, 15) },
        'Folder Tab Story Detail Card Pack',
      ),
    ).toContain('Folder Tab Story Detail Card Pack worldSummaries must cover every linked world.')
  })

  it('validates source lane files reproduce detail cards and tools exactly', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-folder-tab-detail-source-'))
    const source = validFolderTabDetailSource()
    try {
      writeValidFolderTabDetailLaneFiles(tempRoot, source)
      expect(validateFolderTabStoryDetailCardPackSourceFiles(source, tempRoot)).toEqual([])
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('rejects missing expected Batch 44 source lane paths', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-folder-tab-detail-source-path-'))
    const source = validFolderTabDetailSource()
    source.sourceFiles[0] = 'content/product-artifacts/lanes/copied-folder-tab-detail-cards-a.json'
    try {
      writeValidFolderTabDetailLaneFiles(tempRoot, source)
      expect(validateFolderTabStoryDetailCardPackSourceFiles(source, tempRoot)).toContain(
        'sourceFiles must list the exact Batch 44 detail-card lane and tools files.',
      )
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('rejects cards assigned to the wrong Batch 44 lane file', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-folder-tab-detail-lane-range-'))
    const source = validFolderTabDetailSource()
    try {
      writeValidFolderTabDetailLaneFiles(tempRoot, source)
      const laneAPath = resolve(tempRoot, 'content/product-artifacts/lanes/batch44-folder-tab-detail-cards-a.json')
      const laneBPath = resolve(tempRoot, 'content/product-artifacts/lanes/batch44-folder-tab-detail-cards-b.json')
      const laneA = JSON.parse(readFileSync(laneAPath, 'utf8'))
      const laneB = JSON.parse(readFileSync(laneBPath, 'utf8'))
      laneA.cards[0] = source.cards[6]
      laneB.cards[0] = source.cards[0]
      writeFileSync(laneAPath, `${JSON.stringify(laneA, null, 2)}\n`)
      writeFileSync(laneBPath, `${JSON.stringify(laneB, null, 2)}\n`)
      expect(validateFolderTabStoryDetailCardPackSourceFiles(source, tempRoot)).toContain(
        'content/product-artifacts/lanes/batch44-folder-tab-detail-cards-a.json must contain only cards 01-06.',
      )
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('inspects folder tab detail artifacts against the required paths', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-folder-tab-detail-artifacts-'))
    const source = validFolderTabDetailSource()
    try {
      const pdfPath = resolve(tempRoot, source.artifact.pdfPath)
      const zipPath = resolve(tempRoot, source.artifact.zipPath)
      const sourceHtmlPath = resolve(tempRoot, source.artifact.sourceHtmlPath)
      const manifestPath = resolve(tempRoot, source.artifact.manifestPath)
      const readmePath = resolve(tempRoot, 'product-build/folder-tab-story-detail-card-pack/README.txt')
      mkdirSync(dirname(pdfPath), { recursive: true })
      mkdirSync(dirname(sourceHtmlPath), { recursive: true })
      writeFileSync(pdfPath, fakePdf(21), { flag: 'wx' })
      writeFileSync(zipPath, Buffer.from('PK folder tab detail zip'), { flag: 'wx' })
      writeFileSync(sourceHtmlPath, '<!doctype html><title>Folder Tab Story Detail Card Pack</title>', {
        flag: 'wx',
      })
      writeFileSync(readmePath, 'Folder Tab Story Detail Card Pack\n', { flag: 'wx' })
      writeFileSync(
        manifestPath,
        `${JSON.stringify({
          productSlug: source.productSlug,
          sourcePageCount: 16,
          files: {
            pdf: {
              path: source.artifact.pdfPath,
              size: readFileSync(pdfPath).length,
              sha256: sha256(pdfPath),
              pageCount: 21,
            },
            zip: { path: source.artifact.zipPath, size: readFileSync(zipPath).length, sha256: sha256(zipPath) },
            sourceHtml: {
              path: source.artifact.sourceHtmlPath,
              size: readFileSync(sourceHtmlPath).length,
              sha256: sha256(sourceHtmlPath),
            },
            readme: {
              path: 'product-build/folder-tab-story-detail-card-pack/README.txt',
              size: readFileSync(readmePath).length,
              sha256: sha256(readmePath),
            },
            assets: [],
          },
        })}\n`,
        { flag: 'wx' },
      )
      expect(inspectArtifactFiles(tempRoot, source.artifact, { expectedPdfPages: source.cards.length + 5 }).valid).toBe(
        true,
      )
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })
})
describe('Folder Tab Story Detail Card Pack builder', () => {
  it('renders the printable detail card HTML with source cards and local world images', () => {
    const source = validFolderTabDetailSource()
    const imageMap = new Map(source.worldSlugs.map((slug) => [slug, `assets/${slug}.jpg`]))
    const html = renderFolderTabStoryDetailCardPackHtml(source, worlds, imageMap)

    expect(html).toContain('Folder Tab Story Detail Card Pack')
    expect(html).toContain('Detail Card 1')
    expect(html).toContain('Focus detail')
    expect(html).toContain('Take-home detail slips')
    expect(html).toContain('assets/moon-muffin-market.jpg')
  })

  it('builds deterministic provider-ready artifacts from the source', async () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-folder-tab-detail-build-'))
    try {
      const output = await buildFolderTabStoryDetailCardPack({
        buildDir: join(tempRoot, 'product-build', 'folder-tab-story-detail-card-pack'),
        recordRoot: tempRoot,
        writePdf: ({ pdfPath }) => writeFileSync(pdfPath, fakePdf(21)),
      })
      const manifest = output.manifest

      expect(output.source.productSlug).toBe('folder-tab-story-detail-card-pack')
      expect(manifest.productSlug).toBe('folder-tab-story-detail-card-pack')
      expect(manifest.sourcePageCount).toBe(16)
      expect(manifest.files.assets).toHaveLength(16)
      expect(existsSync(output.paths.pdfPath)).toBe(true)
      expect(existsSync(output.paths.zipPath)).toBe(true)
      expect(existsSync(output.paths.htmlPath)).toBe(true)

      const firstZipHash = sha256(output.paths.zipPath)
      const secondOutput = await buildFolderTabStoryDetailCardPack({
        buildDir: join(tempRoot, 'product-build', 'folder-tab-story-detail-card-pack'),
        recordRoot: tempRoot,
        writePdf: ({ pdfPath }) => writeFileSync(pdfPath, fakePdf(21)),
      })
      expect(sha256(secondOutput.paths.zipPath)).toBe(firstZipHash)
      expect(inspectArtifactFiles(tempRoot, output.source.artifact, { expectedPdfPages: 21 }).valid).toBe(true)
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })
})
