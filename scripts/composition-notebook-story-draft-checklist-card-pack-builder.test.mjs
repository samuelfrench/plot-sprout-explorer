import { describe, expect, it } from 'vitest'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'

import {
  inspectArtifactFiles,
  validateCompositionNotebookStoryDraftChecklistCardPackSource,
  validateCompositionNotebookStoryDraftChecklistCardPackSourceFiles,
  validateProductWorldSummaries,
} from './product-artifact-policy.mjs'
import {
  buildCompositionNotebookStoryDraftChecklistCardPack,
  renderCompositionNotebookStoryDraftChecklistCardPackHtml,
} from './composition-notebook-story-draft-checklist-card-pack-builder.mjs'

const safety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles.'

const worldAges = {
  'buttonwood-library-train': '7-9',
  'button-bakery-map-mixup': '7-9',
  'teacup-town-weather-window': '7-8',
  'spoon-ferry-lunchbox-harbor': '7-9',
  'pocket-park-notice-board': '7-9',
  'rain-gauge-railway': '8-10',
  'greenhouse-gear-garden': '8-10',
  'cloudberry-clocktower': '8-10',
  'moss-message-observatory': '8-10',
  'orchard-pulley-post': '8-10',
  'pond-bridge-blueprint-club': '8-10',
  'revision-river-ferry': '10-11',
  'chapter-gate-greenhouse': '10-11',
  'index-card-theater-club': '10-11',
  'binding-day-boardwalk': '10-11',
  'margin-note-market': '10-11',
}

const worldSlugs = Object.keys(worldAges)
const batch50WorldSlugs = [
  'penny-path-compass-shop',
  'sticker-station-mail-cart',
  'mitten-market-lost-ticket',
  'paperclip-plaza-parcel-day',
  'greenhouse-gear-garden',
  'pantry-measurement-mystery',
  'solar-oven-picnic-station',
  'compost-clock-workshop',
  'orchard-pulley-post',
  'pond-bridge-blueprint-club',
  'cloudberry-clocktower',
  'tiny-lantern-reef',
  'almost-invention-workshop',
  'margin-note-market',
  'index-card-theater-club',
  'chapter-gate-greenhouse',
]
const draftChecklistSkills = [
  'confirm the main character has one clear job',
  'check that the setting has two usable details',
  'check that the beginning gives a clear first moment',
  'check that the middle action follows the first moment',
  'check that the ending answers the story problem',
  'circle one detail that belongs in the draft',
  'cross out one extra detail that does not belong',
  'add one clear feeling word without overexplaining',
  'check that every sentence helps the story move',
  'find one sentence that needs a clearer subject',
  'replace one vague word with a story-specific word',
  'check that dialogue tags are easy to follow',
  'check that the final sentence feels finished',
  'make one pencil note for the next draft',
  'compare two draft checklist choices',
  'copy one final checklist note before revising',
]

function fakePdf(pageCount) {
  return Buffer.from(
    `%PDF-1.7\n${Array.from({ length: pageCount }, (_, index) => `${index + 1} 0 obj << /Type /Page >> endobj`).join('\n')}\n%%EOF\n`,
  )
}

function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex')
}

function expectedZipEntries(source) {
  return [
    'Composition-Notebook-Story-Draft-Checklist-Card-Pack.pdf',
    'README.txt',
    'source/composition-notebook-story-draft-checklist-card-pack.html',
    ...source.worldSlugs.map((slug) => `source/assets/${slug}.jpg`),
  ]
}

function card(index, worldSlug, ageBand) {
  return {
    id: `composition-notebook-draft-checklist-card-${String(index).padStart(2, '0')}`,
    title: `Composition Notebook Story Draft Checklist Card ${index}`,
    worldSlug,
    ageBand,
    draftChecklistSkill: draftChecklistSkills[index - 1],
    useCase:
      'Adult-led printable composition notebook draft checklist card for checking one fictional story draft on paper: ____________________.',
    adultSetup:
      'Adult: place one composition notebook page beside the card and choose one broad invented story draft: ____________________.',
    kidDirection:
      'Writer: use the checklist to mark what the pretend story draft already has and what needs one pencil note: ____________________.',
    characterCheckPrompt: 'Character check: name the made-up character and one clear job in the draft: ____________________.',
    settingCheckPrompt: 'Setting check: list two invented setting details that help the story: ____________________.',
    sequenceCheckPrompt: 'Sequence check: write the first, next, and final story moments in order: ____________________.',
    detailCheckPrompt: 'Detail check: circle one useful detail and cross out one extra detail: ____________________.',
    sentenceCheckPrompt: 'Sentence check: rewrite one unclear sentence with a clearer subject: ____________________.',
    finalDraftChecklistPrompt: 'Final draft checklist: write one pencil note for the next fictional draft: ____________________.',
    quietOptionLine: 'Quiet option: complete only the character, setting, and final checklist blanks: ____________________.',
    takeHomeLine: 'Take-home line: check one pretend story draft for character, setting, sequence, detail, and one clear sentence: ____________________.',
  }
}

function validSource(overrides = {}) {
  return {
    batchId: '2026-06-03-batch51',
    generatedAt: '2026-06-03',
    productSlug: 'composition-notebook-story-draft-checklist-card-pack',
    title: 'Composition Notebook Story Draft Checklist Card Pack',
    pricePoint: '$75',
    audience:
      'Families, homeschool groups, tutors, and adult-led writing tables for writers ages 6-11.',
    sessionLength:
      '16 printable draft checklist cards plus adult guide tools, draft checklist routines, take-home draft checklist slips, and optional prompts',
    safetyNote: safety,
    artifact: {
      pdfPath:
        'product-build/composition-notebook-story-draft-checklist-card-pack/Composition-Notebook-Story-Draft-Checklist-Card-Pack.pdf',
      zipPath:
        'product-build/composition-notebook-story-draft-checklist-card-pack/composition-notebook-story-draft-checklist-card-pack.zip',
      sourceHtmlPath:
        'product-build/composition-notebook-story-draft-checklist-card-pack/source/composition-notebook-story-draft-checklist-card-pack.html',
      manifestPath: 'product-build/composition-notebook-story-draft-checklist-card-pack/manifest.json',
    },
    sourceFiles: [
      'content/product-artifacts/lanes/batch51-composition-notebook-draft-checklist-cards-a.json',
      'content/product-artifacts/lanes/batch51-composition-notebook-draft-checklist-cards-b.json',
      'content/product-artifacts/lanes/batch51-composition-notebook-draft-checklist-cards-c.json',
      'content/product-artifacts/lanes/batch51-composition-notebook-draft-checklist-tools.json',
    ],
    worldSlugs: [...worldSlugs],
    cover: {
      kicker: 'Printable composition notebook draft checklist cards',
      headline: 'Composition Notebook Story Draft Checklist Card Pack',
      subhead:
        'Sixteen composition notebook cards help writers check one fictional story draft for character, setting, sequence, useful details, clear sentences, and one pencil note for the next draft.',
      included: [
        '16 printable composition notebook draft checklist cards',
        'Adult setup guide',
        'Fictional draft checklist safety notes',
        'Composition notebook story-draft checklist moves',
        'Family handoff notes',
        'Pack reset notes',
        'Six adult-led draft checklist routines',
        'Ten take-home draft checklist slips',
        'Eight optional prompts',
        'Printable PDF and ZIP artifact',
      ],
    },
    adultGuide: {
      title: 'Composition Notebook Story Draft Checklist Adult Guide',
      bullets: [
        'Print the composition notebook draft checklist cards, blank pages, and guide before the adult-led paper session.',
        'Begin with one broad fictional draft, then coach character, setting, sequence, useful details, and one clear sentence.',
        'Keep every example made-up, broad, offline, paper-only, and guided by an adult.',
        'Ask whether each sentence helps the made-up story move before asking for a longer draft.',
        'Write one pencil note before any longer revision work.',
        'End each activity by marking one next-draft note on paper.',
      ],
    },
    draftChecklistRoutines: Array.from({ length: 6 }, (_, index) => ({
      name: `Draft Checklist Routine ${index + 1}`,
      bestFor: 'A calm adult-led composition notebook moment with one fictional story draft to check.',
      steps: [
        'Adult chooses one broad invented story draft and reads the paper-only reminder: ____________________.',
        'Writer checks the made-up character and setting details: ____________________.',
        'Writer checks the story sequence and one useful detail: ____________________.',
        'Writer writes one next-draft pencil note before closing the notebook: ____________________.',
      ],
    })),
    takeHomeDraftChecklistSlips: Array.from({ length: 10 }, (_, index) => ({
      title: `Draft Checklist Slip ${index + 1}`,
      time: `draft checklist slip ${index + 1}`,
      skill: draftChecklistSkills[index],
      direction: 'Choose one pretend story draft and check it on composition notebook paper: ____________________.',
      familyLine: 'A grown-up can ask which checklist note should happen next: ____________________.',
    })),
    optionalSharePrompts: [
      'Optional adult-led offline prompt: my made-up character already has ____________________.',
      'Optional adult-led offline prompt: my setting details include ____________________.',
      'Optional adult-led offline prompt: my first story moment is ____________________.',
      'Optional adult-led offline prompt: one useful detail I circled is ____________________.',
      'Optional adult-led offline prompt: one extra detail I can skip is ____________________.',
      'Optional adult-led offline prompt: one clearer sentence could say ____________________.',
      'Optional adult-led offline prompt: my next-draft pencil note is ____________________.',
      'Optional adult-led offline prompt: an adult can add one broad made-up checklist note here: ____________________.',
    ],
    cards: worldSlugs.map((worldSlug, index) => card(index + 1, worldSlug, worldAges[worldSlug])),
    ...overrides,
  }
}

const product = {
  slug: 'composition-notebook-story-draft-checklist-card-pack',
  title: 'Composition Notebook Story Draft Checklist Card Pack',
  pricePoint: '$75',
  status: 'checkout_pending',
  worldSlugs: [...worldSlugs],
  worldSummaries: worldSlugs.map((slug) => ({
    slug,
    summary: `A linked fictional world summary for ${slug}.`,
  })),
}

const knownWorldAges = new Map(worldSlugs.map((worldSlug) => [worldSlug, { ageBand: worldAges[worldSlug] }]))
const worlds = new Map(
  worldSlugs.map((worldSlug) => [
    worldSlug,
    {
      slug: worldSlug,
      title: worldSlug
        .split('-')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' '),
      ageBand: worldAges[worldSlug],
      premise: 'A friendly invented world for a screen-free draft checklist card prompt.',
    },
  ]),
)

function writeLaneFiles(tempRoot, source, laneIdOverrides = {}) {
  for (const sourceFile of source.sourceFiles) {
    const target = resolve(tempRoot, sourceFile)
    const laneId = laneIdOverrides[sourceFile] ?? sourceFile.split('/').at(-1)?.replace('.json', '')
    const lane =
      sourceFile.includes('-tools')
        ? {
            laneId,
            adultGuide: source.adultGuide,
            draftChecklistRoutines: source.draftChecklistRoutines,
            takeHomeDraftChecklistSlips: source.takeHomeDraftChecklistSlips,
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

describe('Composition Notebook Story Draft Checklist Card Pack policy', () => {
  it('accepts a valid source with sixteen printable draft checklist cards', () => {
    expect(validateCompositionNotebookStoryDraftChecklistCardPackSource(validSource(), product, knownWorldAges)).toEqual([])
  })

  it('rejects a source that exactly reuses the Batch 50 world set', () => {
    const source = validSource()
    source.worldSlugs = [...batch50WorldSlugs]
    source.cards = batch50WorldSlugs.map((worldSlug, index) =>
      card(index + 1, worldSlug, worldAges[worldSlug] ?? '8-10'),
    )
    const productWithBatch50Worlds = {
      ...product,
      worldSlugs: source.worldSlugs,
      worldSummaries: source.worldSlugs.map((slug) => ({
        slug,
        summary: `A linked fictional world summary for ${slug}.`,
      })),
    }
    const knownWorldAgesWithBatch50 = new Map([
      ...knownWorldAges,
      ...batch50WorldSlugs.map((worldSlug) => [worldSlug, { ageBand: worldAges[worldSlug] ?? '8-10' }]),
    ])
    expect(
      validateCompositionNotebookStoryDraftChecklistCardPackSource(
        source,
        productWithBatch50Worlds,
        knownWorldAgesWithBatch50,
      ),
    ).toContain('worldSlugs must not exactly reuse the Batch 50 world set.')
  })

  it('rejects excessive partial reuse of Batch 50 worlds', () => {
    const source = validSource()
    source.worldSlugs[0] = 'paperclip-plaza-parcel-day'
    source.cards[0] = card(1, 'paperclip-plaza-parcel-day', '7-9')
    const productWithExtraOverlap = {
      ...product,
      worldSlugs: source.worldSlugs,
      worldSummaries: source.worldSlugs.map((slug) => ({
        slug,
        summary: `A linked fictional world summary for ${slug}.`,
      })),
    }
    const knownWorldAgesWithExtraOverlap = new Map([
      ...knownWorldAges,
      ['paperclip-plaza-parcel-day', { ageBand: '7-9' }],
    ])
    expect(
      validateCompositionNotebookStoryDraftChecklistCardPackSource(
        source,
        productWithExtraOverlap,
        knownWorldAgesWithExtraOverlap,
      ).join('\n'),
    ).toMatch(/reuse no more than 7 Batch 50 worlds/)
  })

  it('rejects a draft checklist prompt field without a writable blank', () => {
    const source = validSource()
    source.cards[0].characterCheckPrompt = 'Character check: name the made-up character and one clear job in the draft.'
    expect(validateCompositionNotebookStoryDraftChecklistCardPackSource(source, product, knownWorldAges)).toContain(
      'cards[0].characterCheckPrompt must include a writable blank.',
    )
  })

  it('rejects upload and scoring language in draft checklist cards', () => {
    const source = validSource()
    source.cards[0].takeHomeLine = 'Upload this draft for a score: ____________________.'
    expect(validateCompositionNotebookStoryDraftChecklistCardPackSource(source, product, knownWorldAges).join('\n')).toMatch(
      /upload|score/i,
    )
  })

  it('rejects a copied source that points at the wrong lane files', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-draft-checklist-source-path-'))
    const source = validSource()
    try {
      source.sourceFiles[0] = 'content/product-artifacts/lanes/copied-draft-checklist-cards-a.json'
      writeLaneFiles(tempRoot, source)
      expect(validateCompositionNotebookStoryDraftChecklistCardPackSourceFiles(source, tempRoot)).toContain(
        'sourceFiles must list the exact Batch 51 draft checklist-card lane and tools files.',
      )
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('validates source lane files reproduce draft checklist cards and tools exactly', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-draft-checklist-source-'))
    const source = validSource()
    try {
      writeLaneFiles(tempRoot, source)
      expect(validateCompositionNotebookStoryDraftChecklistCardPackSourceFiles(source, tempRoot)).toEqual([])
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('rejects a card placed in the wrong draft checklist lane range', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-draft-checklist-lane-range-'))
    const source = validSource()
    try {
      writeLaneFiles(tempRoot, source)
      const laneAPath = resolve(tempRoot, 'content/product-artifacts/lanes/batch51-composition-notebook-draft-checklist-cards-a.json')
      const laneBPath = resolve(tempRoot, 'content/product-artifacts/lanes/batch51-composition-notebook-draft-checklist-cards-b.json')
      const laneA = JSON.parse(readFileSync(laneAPath, 'utf8'))
      const laneB = JSON.parse(readFileSync(laneBPath, 'utf8'))
      laneA.cards.push(laneB.cards[0])
      writeFileSync(laneAPath, `${JSON.stringify(laneA, null, 2)}\n`)
      expect(validateCompositionNotebookStoryDraftChecklistCardPackSourceFiles(source, tempRoot)).toContain(
        'content/product-artifacts/lanes/batch51-composition-notebook-draft-checklist-cards-a.json must contain only cards 01-06.',
      )
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('inspects composition notebook draft checklist artifacts against the required paths', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-draft-checklist-artifacts-'))
    const source = validSource()
    try {
      const pdfPath = resolve(tempRoot, source.artifact.pdfPath)
      const zipPath = resolve(tempRoot, source.artifact.zipPath)
      const htmlPath = resolve(tempRoot, source.artifact.sourceHtmlPath)
      const manifestPath = resolve(tempRoot, source.artifact.manifestPath)
      const readmePath = resolve(tempRoot, 'product-build/composition-notebook-story-draft-checklist-card-pack/README.txt')
      mkdirSync(dirname(pdfPath), { recursive: true })
      mkdirSync(dirname(htmlPath), { recursive: true })
      writeFileSync(pdfPath, fakePdf(21), { flag: 'wx' })
      writeFileSync(zipPath, Buffer.from('PK composition notebook draft checklist zip'), { flag: 'wx' })
      writeFileSync(htmlPath, '<!doctype html><html><body>composition notebook draft checklist</body></html>', { flag: 'wx' })
      writeFileSync(readmePath, 'README', { flag: 'wx' })
      writeFileSync(
        manifestPath,
        JSON.stringify(
          {
            productSlug: source.productSlug,
            files: {
              pdf: {
                path: source.artifact.pdfPath,
                sha256: sha256(pdfPath),
                size: readFileSync(pdfPath).length,
              },
              zip: {
                path: source.artifact.zipPath,
                sha256: sha256(zipPath),
                size: readFileSync(zipPath).length,
              },
              sourceHtml: {
                path: source.artifact.sourceHtmlPath,
                sha256: sha256(htmlPath),
                size: readFileSync(htmlPath).length,
              },
              readme: {
                path: 'product-build/composition-notebook-story-draft-checklist-card-pack/README.txt',
                sha256: sha256(readmePath),
                size: readFileSync(readmePath).length,
              },
              assets: [],
            },
          },
          null,
          2,
        ),
        { flag: 'wx' },
      )

      const artifactStatus = inspectArtifactFiles(tempRoot, source.artifact, {
        expectedPdfPages: source.cards.length + 5,
        expectedZipEntries: expectedZipEntries(source),
      })
      expect(artifactStatus.valid).toBe(false)
      expect(artifactStatus.errors.join('\n')).toContain('does not have a readable ZIP central directory')
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('renders printable draft checklist card HTML with source cards and local world images', () => {
    const source = validSource()
    const imageMap = new Map(source.worldSlugs.map((slug) => [slug, `assets/${slug}.jpg`]))
    const html = renderCompositionNotebookStoryDraftChecklistCardPackHtml(source, worlds, imageMap)

    expect(html).toContain('Composition Notebook Story Draft Checklist Card Pack')
    expect(html).toContain('Character check')
    expect(html).toContain('Setting check')
    expect(html).toContain('Sentence check')
    expect(html).toContain('Final draft checklist')
    expect(html).toContain('assets/buttonwood-library-train.jpg')
  })

  it('builds deterministic printable draft checklist artifacts', async () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-draft-checklist-build-'))
    const source = validSource()
    try {
      const output = await buildCompositionNotebookStoryDraftChecklistCardPack({
        source,
        product,
        worlds,
        buildDir: join(tempRoot, 'product-build', 'composition-notebook-story-draft-checklist-card-pack'),
        recordRoot: tempRoot,
        writePdf: async ({ pdfPath }) => writeFileSync(pdfPath, fakePdf(21)),
      })
      const manifest = JSON.parse(readFileSync(output.paths.manifestPath, 'utf8'))

      expect(output.source.productSlug).toBe('composition-notebook-story-draft-checklist-card-pack')
      expect(manifest.productSlug).toBe('composition-notebook-story-draft-checklist-card-pack')
      expect(existsSync(output.paths.pdfPath)).toBe(true)
      expect(existsSync(output.paths.zipPath)).toBe(true)

      const secondOutput = await buildCompositionNotebookStoryDraftChecklistCardPack({
        source,
        product,
        worlds,
        buildDir: join(tempRoot, 'product-build', 'composition-notebook-story-draft-checklist-card-pack'),
        recordRoot: tempRoot,
        writePdf: async ({ pdfPath }) => writeFileSync(pdfPath, fakePdf(21)),
      })
      expect(readFileSync(secondOutput.paths.manifestPath, 'utf8')).toBe(
        readFileSync(output.paths.manifestPath, 'utf8'),
      )
      expect(
        inspectArtifactFiles(tempRoot, output.source.artifact, {
          expectedPdfPages: 21,
          expectedZipEntries: expectedZipEntries(output.source),
        }).valid,
      ).toBe(true)
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('validates committed product world summaries stay linked to product worlds', () => {
    expect(validateProductWorldSummaries(product, 'Composition Notebook Story Draft Checklist Card Pack')).toEqual([])
    expect(
      validateProductWorldSummaries(
        {
          ...product,
          worldSummaries: product.worldSummaries.slice(1),
        },
        'Composition Notebook Story Draft Checklist Card Pack',
      ),
    ).toContain('Composition Notebook Story Draft Checklist Card Pack worldSummaries must cover every linked world.')
  })
})
