import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import {
  countPdfPages,
  inspectConfiguredArtifactFiles,
  inspectArtifactFiles,
  validateCheckoutReadiness,
  validateManifestWorldAssets,
  validatePackSource,
  validateSeasonBundleSource,
  writeStoredZip,
} from './product-artifact-policy.mjs'

const safety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles.'

function validSource() {
  return {
    batchId: '2026-06-02-batch7',
    generatedAt: '2026-06-02',
    productSlug: 'rainy-day-story-quest-pack',
    title: 'Rainy Day Story Quest Pack',
    pricePoint: '$9',
    audience: 'Parents, homeschool families, tutors, and elementary teachers working with reluctant writers ages 7-11.',
    sessionLength: '35-45 minutes',
    safetyNote: safety,
    artifact: {
      pdfPath: 'product-build/rainy-day-story-quest-pack/Rainy-Day-Story-Quest-Pack.pdf',
      zipPath: 'product-build/rainy-day-story-quest-pack/rainy-day-story-quest-pack.zip',
      sourceHtmlPath: 'product-build/rainy-day-story-quest-pack/source/rainy-day-story-quest-pack.html',
      manifestPath: 'product-build/rainy-day-story-quest-pack/manifest.json',
    },
    worldSlugs: [
      'teacup-town-weather-window',
      'rain-gauge-railway',
      'spoon-ferry-lunchbox-harbor',
      'rain-boot-route-rangers',
    ],
    cover: {
      kicker: 'Rainy day writing kit',
      headline: 'Four tiny weather errands for one finished story',
      subhead: 'A printable pack for short, parent-guided story writing.',
      included: [
        'Route map',
        'Forecast cards',
        'Reflection sheet',
        'Dialogue page',
        'Sentence builder',
        'Ending cards',
        'Parent guide',
      ],
    },
    adultGuide: {
      setup: ['Print the pack.', 'Pick one world.', 'Set out a pencil.', 'Read the first page aloud.'],
      sessionFlow: [
        { minutes: '5', title: 'Choose', instruction: 'Choose one world and circle a path.' },
        { minutes: '8', title: 'Collect', instruction: 'Collect three details before writing.' },
        { minutes: '10', title: 'Build', instruction: 'Build three useful sentences.' },
        { minutes: '12', title: 'Draft', instruction: 'Write the short story.' },
        { minutes: '5', title: 'Finish', instruction: 'Choose a kind ending.' },
      ],
      supportMoves: ['Point before writing.', 'Offer two choices.', 'Read back one sentence.', 'Pause after each page.', 'Stop while it is still easy.'],
      extensionIdeas: ['Make a cover.', 'Read it aloud.', 'Add a weather log.', 'Write a new errand.'],
    },
    pages: [
      page('cover-overview', 'overview', 'adult-guide'),
      page('adult-session-plan', 'overview', 'adult-guide'),
      page('teacup-route-map', 'teacup-town-weather-window', 'map'),
      page('forecast-card-sort', 'teacup-town-weather-window', 'cards'),
      page('rain-gauge-railway-log', 'rain-gauge-railway', 'worksheet'),
      page('railway-weather-report', 'rain-gauge-railway', 'prompt'),
      page('lunchbox-dialogue-sheet', 'spoon-ferry-lunchbox-harbor', 'worksheet'),
      page('snack-order-revision', 'spoon-ferry-lunchbox-harbor', 'prompt'),
      page('rain-boot-route-map', 'rain-boot-route-rangers', 'map'),
      page('puddle-reflection-ending', 'rain-boot-route-rangers', 'reflection'),
      page('final-story-page', 'overview', 'worksheet'),
    ],
  }
}

function page(id, worldSlug, type) {
  return {
    id,
    title: id.split('-').join(' '),
    worldSlug,
    type,
    kidDirection: 'Circle one detail and write one short sentence.',
    adultNote: 'Keep this page light and let pointing count as planning.',
    sections: [
      {
        heading: 'Write',
        lines: ['First detail: ____________________________', 'Useful sentence: ____________________________'],
      },
    ],
  }
}

function validSeasonBundleSource() {
  const worldSlugs = [
    'moon-muffin-market',
    'puddle-planet-post-office',
    'buttonwood-library-train',
    'cloudberry-clocktower',
    'tiny-lantern-reef',
    'pencil-dragon-academy',
    'teacup-town-weather-window',
    'rain-gauge-railway',
    'spoon-ferry-lunchbox-harbor',
    'rain-boot-route-rangers',
    'seed-library-map-room',
    'greenhouse-gear-garden',
  ]

  return {
    batchId: '2026-06-02-batch8',
    generatedAt: '2026-06-02',
    productSlug: 'homeschool-season-story-bundle',
    title: 'Homeschool Season Story Bundle',
    pricePoint: '$29',
    audience: 'Homeschool families, tutors, and elementary co-ops planning a year of short writing sessions.',
    sessionLength: '12 printable quests across four seasons',
    safetyNote: safety,
    artifact: {
      pdfPath: 'product-build/homeschool-season-story-bundle/Homeschool-Season-Story-Bundle.pdf',
      zipPath: 'product-build/homeschool-season-story-bundle/homeschool-season-story-bundle.zip',
      sourceHtmlPath: 'product-build/homeschool-season-story-bundle/source/homeschool-season-story-bundle.html',
      manifestPath: 'product-build/homeschool-season-story-bundle/manifest.json',
    },
    worldSlugs,
    cover: {
      kicker: 'Printable homeschool writing bundle',
      headline: 'A year of small story quests',
      subhead: 'Twelve seasonal writing sessions for short narrative practice.',
      included: [
        'Twelve quest pages',
        'Four seasonal planning pages',
        'Parent guide',
        'Revision checklist',
        'Story bank tracker',
        'Read-aloud reflection',
        'Portfolio cover',
        'Extension menu',
        'Co-op use notes',
        'Materials checklist',
      ],
    },
    adultGuide: {
      setup: ['Print one season at a time.', 'Pick a weekly rhythm.', 'Keep sessions offline.', 'Save finished pages in a folder.'],
      seasonPlan: [
        { season: 'fall', focus: 'setting and useful details' },
        { season: 'winter', focus: 'sequence and dialogue' },
        { season: 'spring', focus: 'revision and clearer verbs' },
        { season: 'summer', focus: 'finished stories and read-aloud sharing' },
      ],
      supportMoves: ['Point before writing.', 'Offer two choices.', 'Read a strong sentence aloud.', 'Circle one detail.', 'Stop with one clear ending.'],
      extensionIdeas: ['Make a cover.', 'Pair two quests.', 'Read one page aloud.', 'Build a portfolio.', 'Turn one quest into a co-op station.'],
    },
    pages: worldSlugs.map((worldSlug, index) => ({
      id: `season-quest-${index + 1}`,
      title: `Season Quest ${index + 1}`,
      worldSlug,
      season: ['fall', 'winter', 'spring', 'summer'][index % 4],
      type: 'worksheet',
      kidDirection: 'Choose one detail, one helper, and one kind ending before writing.',
      adultNote: 'Keep the page short and let pointing count as planning.',
      sections: [
        {
          heading: 'Plan',
          lines: ['Detail I choose: ____________________________', 'Helper I choose: ____________________________'],
        },
        {
          heading: 'Write',
          lines: ['Beginning: ____________________________', 'Ending choice: ____________________________'],
        },
      ],
    })),
  }
}

describe('product artifact policy', () => {
  it('validates the Rainy Day pack source against the product record and required world coverage', () => {
    const product = {
      slug: 'rainy-day-story-quest-pack',
      title: 'Rainy Day Story Quest Pack',
      pricePoint: '$9',
      status: 'checkout_pending',
      worldSlugs: [
        'teacup-town-weather-window',
        'rain-gauge-railway',
        'spoon-ferry-lunchbox-harbor',
        'rain-boot-route-rangers',
      ],
    }

    expect(validatePackSource(validSource(), product, new Set(product.worldSlugs))).toEqual([])
  })

  it('rejects checkout-ready products when the PDF, ZIP, source HTML, or manifest is missing', () => {
    const artifactStatus = {
      valid: false,
      errors: ['missing PDF artifact'],
    }

    expect(validateCheckoutReadiness({ status: 'checkout_ready' }, artifactStatus)).toContain(
      'checkout_ready cannot be used until the product artifact validates.',
    )
    expect(validateCheckoutReadiness({ status: 'checkout_pending' }, artifactStatus)).toEqual([])
  })

  it('inspects required artifact files and checks PDF and ZIP signatures', () => {
    const root = mkdtempSync(join(tmpdir(), 'plot-sprout-artifact-'))
    try {
      mkdirSync(join(root, 'product-build/rainy-day-story-quest-pack/source'), { recursive: true })
      writeFileSync(join(root, 'product-build/rainy-day-story-quest-pack/Rainy-Day-Story-Quest-Pack.pdf'), '%PDF-1.7\n')
      writeFileSync(join(root, 'product-build/rainy-day-story-quest-pack/source/rainy-day-story-quest-pack.html'), '<!doctype html><h1>Rainy Day Story Quest Pack</h1>')
      writeFileSync(join(root, 'product-build/rainy-day-story-quest-pack/manifest.json'), '{"productSlug":"rainy-day-story-quest-pack"}\n')
      writeStoredZip(join(root, 'product-build/rainy-day-story-quest-pack/rainy-day-story-quest-pack.zip'), [
        {
          name: 'README.txt',
          data: 'Rainy Day Story Quest Pack',
        },
      ])

      const status = inspectArtifactFiles(root, validSource().artifact)

      expect(status.errors).toEqual([])
      expect(status.valid).toBe(true)
      expect(status.files.zip.size).toBeGreaterThan(40)
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  it('counts PDF page objects and rejects unexpected artifact page counts', () => {
    const fakePdf = Buffer.from(
      '%PDF-1.7\n1 0 obj << /Type /Pages /Count 2 >> endobj\n2 0 obj << /Type /Page >> endobj\n3 0 obj << /Type /Page >> endobj\n%%EOF\n',
    )

    expect(countPdfPages(fakePdf)).toBe(2)

    const root = mkdtempSync(join(tmpdir(), 'plot-sprout-artifact-pages-'))
    try {
      mkdirSync(join(root, 'product-build/rainy-day-story-quest-pack/source'), { recursive: true })
      writeFileSync(join(root, 'product-build/rainy-day-story-quest-pack/Rainy-Day-Story-Quest-Pack.pdf'), fakePdf)
      writeFileSync(join(root, 'product-build/rainy-day-story-quest-pack/source/rainy-day-story-quest-pack.html'), '<!doctype html><h1>Rainy Day Story Quest Pack</h1>')
      writeFileSync(join(root, 'product-build/rainy-day-story-quest-pack/manifest.json'), '{"productSlug":"rainy-day-story-quest-pack"}\n')
      writeStoredZip(join(root, 'product-build/rainy-day-story-quest-pack/rainy-day-story-quest-pack.zip'), [
        {
          name: 'README.txt',
          data: 'Rainy Day Story Quest Pack',
        },
      ])

      const status = inspectArtifactFiles(root, validSource().artifact, { expectedPdfPages: 15 })

      expect(status.valid).toBe(false)
      expect(status.errors).toContain('Rainy Day PDF artifact must have exactly 15 pages; found 2.')
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  it('validates the Homeschool Season bundle source with 12 seasonal quests and checkout-pending artifact paths', () => {
    const source = validSeasonBundleSource()
    const product = {
      slug: 'homeschool-season-story-bundle',
      title: 'Homeschool Season Story Bundle',
      pricePoint: '$29',
      status: 'checkout_pending',
      worldSlugs: source.worldSlugs,
    }

    expect(validateSeasonBundleSource(source, product, new Set(source.worldSlugs))).toEqual([])
  })

  it('rejects Homeschool Season adult guide plans that duplicate a season and omit another', () => {
    const source = validSeasonBundleSource()
    source.adultGuide.seasonPlan = [
      { season: 'fall', focus: 'details' },
      { season: 'fall', focus: 'maps' },
      { season: 'winter', focus: 'sequence' },
      { season: 'spring', focus: 'revision' },
    ]
    const product = {
      slug: 'homeschool-season-story-bundle',
      title: 'Homeschool Season Story Bundle',
      pricePoint: '$29',
      status: 'checkout_pending',
      worldSlugs: source.worldSlugs,
    }

    expect(validateSeasonBundleSource(source, product, new Set(source.worldSlugs))).toContain(
      'adultGuide.seasonPlan must cover fall, winter, spring, and summer.',
    )
  })

  it('inspects configured artifact files for product-specific paths', () => {
    const root = mkdtempSync(join(tmpdir(), 'plot-sprout-season-artifact-'))
    const expectedPaths = {
      pdfPath: 'product-build/homeschool-season-story-bundle/Homeschool-Season-Story-Bundle.pdf',
      zipPath: 'product-build/homeschool-season-story-bundle/homeschool-season-story-bundle.zip',
      sourceHtmlPath: 'product-build/homeschool-season-story-bundle/source/homeschool-season-story-bundle.html',
      manifestPath: 'product-build/homeschool-season-story-bundle/manifest.json',
    }
    try {
      mkdirSync(join(root, 'product-build/homeschool-season-story-bundle/source'), { recursive: true })
      writeFileSync(join(root, expectedPaths.pdfPath), '%PDF-1.7\n1 0 obj << /Type /Page >> endobj\n')
      writeFileSync(join(root, expectedPaths.sourceHtmlPath), '<!doctype html><h1>Homeschool Season Story Bundle</h1>')
      writeFileSync(join(root, expectedPaths.manifestPath), '{"productSlug":"homeschool-season-story-bundle"}\n')
      writeStoredZip(join(root, expectedPaths.zipPath), [
        {
          name: 'README.txt',
          data: 'Homeschool Season Story Bundle',
        },
      ])

      const status = inspectConfiguredArtifactFiles(root, expectedPaths, expectedPaths, { expectedPdfPages: 1 })

      expect(status.errors).toEqual([])
      expect(status.valid).toBe(true)
      expect(status.files.pdf.pageCount).toBe(1)
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  it('rejects stale manifest file hashes and sizes when artifact files changed', () => {
    const root = mkdtempSync(join(tmpdir(), 'plot-sprout-season-manifest-'))
    const expectedPaths = {
      pdfPath: 'product-build/homeschool-season-story-bundle/Homeschool-Season-Story-Bundle.pdf',
      zipPath: 'product-build/homeschool-season-story-bundle/homeschool-season-story-bundle.zip',
      sourceHtmlPath: 'product-build/homeschool-season-story-bundle/source/homeschool-season-story-bundle.html',
      manifestPath: 'product-build/homeschool-season-story-bundle/manifest.json',
    }
    try {
      mkdirSync(join(root, 'product-build/homeschool-season-story-bundle/source'), { recursive: true })
      writeFileSync(join(root, expectedPaths.pdfPath), '%PDF-1.7\n1 0 obj << /Type /Page >> endobj\n')
      writeFileSync(join(root, expectedPaths.sourceHtmlPath), '<!doctype html><h1>Homeschool Season Story Bundle</h1>')
      writeStoredZip(join(root, expectedPaths.zipPath), [
        {
          name: 'README.txt',
          data: 'Homeschool Season Story Bundle',
        },
      ])
      writeFileSync(
        join(root, expectedPaths.manifestPath),
        `${JSON.stringify({
          productSlug: 'homeschool-season-story-bundle',
          files: {
            pdf: {
              path: expectedPaths.pdfPath,
              sha256: '0'.repeat(64),
              size: 1,
            },
          },
        })}\n`,
      )

      const status = inspectConfiguredArtifactFiles(root, expectedPaths, expectedPaths, { expectedPdfPages: 1 })

      expect(status.valid).toBe(false)
      expect(status.errors).toContain(
        'manifest files.pdf sha256 does not match product-build/homeschool-season-story-bundle/Homeschool-Season-Story-Bundle.pdf.',
      )
      expect(status.errors).toContain(
        'manifest files.pdf size does not match product-build/homeschool-season-story-bundle/Homeschool-Season-Story-Bundle.pdf.',
      )
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  it('requires one copied manifest image asset for every product world slug', () => {
    const errors = validateManifestWorldAssets(
      {
        title: 'Homeschool Season Story Bundle',
        worldSlugs: ['seed-library-map-room', 'greenhouse-gear-garden'],
      },
      {
        files: {
          assets: [
            {
              path: 'product-build/homeschool-season-story-bundle/source/assets/seed-library-map-room.jpg',
            },
          ],
        },
      },
    )

    expect(errors).toContain('Homeschool Season Story Bundle artifact manifest missing copied image for greenhouse-gear-garden.')
  })
})
