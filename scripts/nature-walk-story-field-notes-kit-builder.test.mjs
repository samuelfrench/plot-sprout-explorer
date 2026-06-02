import { describe, expect, it } from 'vitest'
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromium } from 'playwright'

import { buildProductArtifactManifest } from './rainy-day-pack-builder.mjs'
import {
  validateNatureWalkStoryFieldNotesKitSource,
  validateNatureWalkStoryFieldNotesKitSourceFiles,
} from './product-artifact-policy.mjs'
import {
  buildNatureWalkStoryFieldNotesKit,
  loadNatureWalkStoryFieldNotesKitBuildInputs,
  renderNatureWalkStoryFieldNotesKitHtml,
} from './nature-walk-story-field-notes-kit-builder.mjs'

const safety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles.'

function fakePdf(pageCount) {
  return Buffer.from(
    `%PDF-1.7\n${Array.from({ length: pageCount }, (_, index) => `${index + 1} 0 obj << /Type /Page >> endobj`).join('\n')}\n%%EOF\n`,
  )
}

const natureWorldAges = {
  'teacup-town-weather-window': '7-8',
  'acorn-avenue-errand-office': '7-9',
  'pocket-park-notice-board': '7-9',
  'button-bakery-map-mixup': '7-9',
  'spoon-ferry-lunchbox-harbor': '7-9',
  'penny-path-compass-shop': '7-9',
  'greenhouse-gear-garden': '8-10',
  'rain-gauge-railway': '8-10',
  'seed-library-map-room': '8-10',
  'moss-message-observatory': '8-10',
  'solar-oven-picnic-station': '8-10',
  'compass-craft-academy': '10-11',
}

const natureWorldSlugs = Object.keys(natureWorldAges)

function fieldNote(index, worldSlug, ageBand) {
  return {
    id: `nature-field-note-${String(index).padStart(2, '0')}`,
    title: `Nature Field Note ${index}`,
    worldSlug,
    ageBand,
    fieldNoteSkill: 'safe observation',
    useCase: 'A screen-free field note page that turns one broad outdoor detail into make-believe story practice.',
    adultSetup: 'Choose a calm adult-approved observation spot, set out pencils, and name one broad place label before writing starts.',
    kidDirection: 'Notice one safe detail, turn it into a tiny invented story clue, and write one short field-note sentence.',
    noticePrompt: 'A color, shape, sound, shadow, or texture I notice from my spot is: ____________________',
    detailBankPrompt: 'Three words that could help a story scene are: ____________________',
    storySeed: 'In my pretend story, this detail becomes a friendly clue or helper object: ____________________',
    sentencePath: 'First, next, and last, my tiny story path goes: ____________________',
    revisionNudge: 'One word I can make clearer before I finish is: ____________________',
    quietOptionLine: 'A quiet writer can point, sketch, dictate, or write one private line here: ____________________',
    takeHomeLine: 'Take-home finish step: add a title or one invented detail here: ____________________',
  }
}

function validNatureSource(overrides = {}) {
  return {
    batchId: '2026-06-02-batch23',
    generatedAt: '2026-06-02',
    productSlug: 'nature-walk-story-field-notes-kit',
    title: 'Nature Walk Story Field Notes Kit',
    pricePoint: '$33',
    audience: 'Families, homeschool groups, tutors, co-ops, library tables, and calm field-day groups guiding ages 7-11.',
    sessionLength: '12 printable nature-walk field notes plus adult guide tools, walk formats, and take-home field cards',
    safetyNote: safety,
    artifact: {
      pdfPath: 'product-build/nature-walk-story-field-notes-kit/Nature-Walk-Story-Field-Notes-Kit.pdf',
      zipPath: 'product-build/nature-walk-story-field-notes-kit/nature-walk-story-field-notes-kit.zip',
      sourceHtmlPath:
        'product-build/nature-walk-story-field-notes-kit/source/nature-walk-story-field-notes-kit.html',
      manifestPath: 'product-build/nature-walk-story-field-notes-kit/manifest.json',
    },
    sourceFiles: [
      'content/product-artifacts/lanes/batch23-nature-field-notes-a.json',
      'content/product-artifacts/lanes/batch23-nature-field-notes-b.json',
      'content/product-artifacts/lanes/batch23-nature-field-notes-c.json',
      'content/product-artifacts/lanes/batch23-nature-tools.json',
    ],
    worldSlugs: natureWorldSlugs,
    cover: {
      kicker: 'Printable nature walk story field notes',
      headline: 'Nature Walk Story Field Notes Kit',
      subhead: 'Twelve printable field-note pages that turn safe outdoor observations into tiny story scenes.',
      included: [
        '12 printable story field-note pages',
        'Adult setup guide',
        'Field table setup notes',
        'Observation-to-story coaching moves',
        'Privacy and site-rule notes',
        'Family handoff notes',
        'Six adult-led walk formats',
        'Ten take-home field cards',
        'Eight optional share prompts',
        'Provider-ready PDF and ZIP artifact',
      ],
    },
    adultGuide: {
      beforeWalk: [
        'Print one active field note for each writer and keep extra pages in an adult folder.',
        'Choose a calm observation spot approved by the adult leader and the site rules.',
        'Name a broad place label such as yard, park, garden, porch, trail, or window view.',
        'Set out pencils, clipboards, plain folders, and one quiet choice bank before writing starts.',
        'Model how one visible detail can become an invented clue without collecting personal facts.',
      ],
      fieldTableSetup: [
        'Place only the active field note, pencil, and one choice strip at each seat.',
        'Keep extra cards, spare pages, and folders in an adult supply stack until needed.',
        'Use color tabs, symbols, or blank folders for simple sorting.',
        'Offer a quiet table option where writers can sketch, point, dictate, or write one line.',
        'Leave open space for clipboards so the writing page can work outdoors or at a table.',
      ],
      observationToStory: [
        'Start with one visible detail such as color, shape, texture, shadow, weather clue, or repeated pattern.',
        'Ask writers to turn the detail into an invented setting, helper object, small mix-up, or friendly clue.',
        'Offer two adult-created options when a writer is stuck, and keep every story detail make-believe.',
        'Move in small steps: notice, choose, imagine, write, and revise one word.',
        'Use neutral invented roles such as guide, helper, keeper, messenger, builder, or collector.',
      ],
      privacyAndSiteNotes: [
        'Use broad place labels and invented details instead of exact place details.',
        'Keep pages offline, printable, and handled by the adult leader, writer, or family.',
        'Organize pages with symbols, color tabs, or plain folders instead of private identifiers.',
        'Follow adult and site rules first; the story task is only a seated or still observation activity.',
        'Keep sharing optional and focused on a printed page, sketch, title, object clue, or invented setting.',
      ],
      familyHandoff: [
        'Send home the field note, one optional field card, and a note that story details are invented.',
        'Mark one simple next step such as add a title, add one detail, or finish the ending.',
        'Tell families the card can be completed by pointing, sketching, dictating, or writing one short line.',
        'Keep any sharing optional and focused on the printed page or one invented story clue.',
        'Store no copies in the kit after pages are handed to the family.',
      ],
      reset: ['Stack extra pages.', 'Refresh pencils.', 'Sort choice strips.', 'Keep sample details generic.'],
    },
    walkFormats: Array.from({ length: 6 }, (_, index) => ({
      name: `Walk Format ${index + 1}`,
      bestFor: 'A calm adult-led nature writing moment with a printed field note.',
      steps: [
        'Adult leader chooses one approved observation spot and names the broad focus.',
        'Writers notice one safe detail from where they are standing or seated.',
        'Adult leader models how the detail can become an invented story clue.',
        'Writers draft one short story field note before the page goes into a folder.',
      ],
    })),
    takeHomeFieldCards: Array.from({ length: 10 }, (_, index) => ({
      title: `Field Card ${index + 1}`,
      time: '7 minutes',
      skill: 'setting detail',
      direction: 'Choose one broad nature detail and turn it into an invented setting: ____________________',
      familyLine: 'A grown-up can ask which word makes the scene easier to picture: ____________________',
    })),
    optionalSharePrompts: [
      'Read one invented setting detail if you want: ____________________',
      'Show one sketched clue from the page: ____________________',
      'Point to one word you revised: ____________________',
      'Name one broad place label from your story: ____________________',
      'Ask an adult to read your favorite field-note line: ____________________',
      'Share one make-believe helper object: ____________________',
      'Circle one detail you want to keep private: ____________________',
      'Choose one finish step for later: ____________________',
    ],
    fieldNotes: natureWorldSlugs.map((worldSlug, index) =>
      fieldNote(index + 1, worldSlug, natureWorldAges[worldSlug]),
    ),
    ...overrides,
  }
}

const product = {
  slug: 'nature-walk-story-field-notes-kit',
  title: 'Nature Walk Story Field Notes Kit',
  pricePoint: '$33',
  status: 'checkout_pending',
  worldSlugs: natureWorldSlugs,
}

const worldAges = new Map(natureWorldSlugs.map((worldSlug) => [worldSlug, { ageBand: natureWorldAges[worldSlug] }]))

const worlds = new Map(
  natureWorldSlugs.map((worldSlug) => [
    worldSlug,
    {
      title: worldSlug
        .split('-')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' '),
      ageBand: natureWorldAges[worldSlug],
      premise: 'A friendly invented world for a screen-free nature walk story field note.',
    },
  ]),
)

describe('Nature Walk Story Field Notes Kit policy', () => {
  it('accepts a valid source with twelve printable field notes', () => {
    expect(validateNatureWalkStoryFieldNotesKitSource(validNatureSource(), product, worldAges)).toEqual([])
  })

  it('rejects a field-note response field without a writable blank', () => {
    const source = validNatureSource()
    source.fieldNotes[0].noticePrompt = 'I noticed one safe detail.'

    expect(validateNatureWalkStoryFieldNotesKitSource(source, product, worldAges)).toContain(
      'fieldNotes[0].noticePrompt must include a writable blank.',
    )
  })

  it('rejects location tracking, outdoor-risk, publishing, scoring, and unsafe pressure language', () => {
    const source = validNatureSource()
    source.adultGuide.beforeWalk[0] =
      'Record GPS coordinates, exact address, photos, child names, grades, scores, and upload the route for public publishing.'
    source.fieldNotes[0].kidDirection =
      'Win a prize by using a timer, crossing streets, climbing, running, feeding animals, tasting plants, politics, romance, and weapons.'

    expect(validateNatureWalkStoryFieldNotesKitSource(source, product, worldAges)).toEqual(
      expect.arrayContaining([
        'Nature Walk Story Field Notes Kit source includes account, upload, public-publishing, location-tracking, exact-place, contact, photo, child-profile, roster, attendance, sign-in, or behavior-report language.',
        'Nature Walk Story Field Notes Kit source includes medical, legal, therapy, diagnosis, grief, assessment, grade, score, guaranteed-outcome, contest, prize, timer-pressure, gambling, politics, religion, romance, weapon, violence, branded, ad-targeting, animal-contact, foraging, tasting, street-crossing, water-entry, weather-risk, or unsafe physical language.',
      ]),
    )
  })

  it('keeps declared source lane files reproducible with the committed nature source', () => {
    const root = resolve(import.meta.dirname, '..')
    const source = JSON.parse(
      readFileSync(resolve(root, 'content', 'product-artifacts', 'nature-walk-story-field-notes-kit.json'), 'utf8'),
    )

    expect(validateNatureWalkStoryFieldNotesKitSourceFiles(source, root)).toEqual([])
  })
})

describe('Nature Walk Story Field Notes Kit builder', () => {
  it('loads committed nature source, product, worlds, and local image inputs before writing artifacts', () => {
    const { source, product: committedProduct, worlds: committedWorlds, imageMap } =
      loadNatureWalkStoryFieldNotesKitBuildInputs()

    expect(source.productSlug).toBe('nature-walk-story-field-notes-kit')
    expect(source.fieldNotes).toHaveLength(12)
    expect(committedProduct.status).toBe('checkout_pending')
    expect(imageMap.size).toBe(source.worldSlugs.length)
    for (const slug of source.worldSlugs) {
      expect(committedWorlds.has(slug)).toBe(true)
      expect(imageMap.has(slug)).toBe(true)
    }
  })

  it('exercises the actual build entry point against a temporary artifact directory', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'plot-sprout-nature-walk-build-'))
    const buildDir = join(tempDir, 'nature-walk-story-field-notes-kit')
    try {
      const { manifest } = await buildNatureWalkStoryFieldNotesKit({
        buildDir,
        recordRoot: tempDir,
        writePdf: async ({ pdfPath }) => {
          writeFileSync(pdfPath, fakePdf(17))
        },
      })

      expect(manifest.productSlug).toBe('nature-walk-story-field-notes-kit')
      expect(manifest.sourcePageCount).toBe(12)
      expect(manifest.files.assets.length).toBe(12)
      expect(existsSync(join(buildDir, 'source', 'nature-walk-story-field-notes-kit.html'))).toBe(true)
      expect(existsSync(join(buildDir, 'README.txt'))).toBe(true)
      expect(existsSync(join(buildDir, 'manifest.json'))).toBe(true)
      expect(readFileSync(join(buildDir, 'nature-walk-story-field-notes-kit.zip')).subarray(0, 2).toString('ascii')).toBe('PK')
      expect(readFileSync(join(buildDir, 'source', 'nature-walk-story-field-notes-kit.html'), 'utf8').match(/class="[^"]*field-note-page/g)).toHaveLength(12)
    } finally {
      rmSync(tempDir, { recursive: true, force: true })
    }
  }, 15000)

  it('renders printable nature field-note HTML with adult guide, field notes, local images, and no checkout copy', () => {
    const html = renderNatureWalkStoryFieldNotesKitHtml(
      validNatureSource(),
      worlds,
      new Map(natureWorldSlugs.map((worldSlug) => [worldSlug, `assets/${worldSlug}.jpg`])),
    )

    expect(html).toContain('<!doctype html>')
    expect(html).toContain('@page')
    expect(html).toContain('Nature Walk Story Field Notes Kit')
    expect(html).toContain('Observation-to-story')
    expect(html).toContain('Privacy and site notes')
    expect(html).toContain('A color, shape, sound, shadow, or texture')
    expect(html.match(/class="[^"]*field-note-page/g)).toHaveLength(12)
    expect(html).toContain('assets/teacup-town-weather-window.jpg')
    expect(html).not.toMatch(/checkout|payment link|buy now|stripe|gumroad|account|login|upload|public publishing|GPS|coordinates|address|phone|email|photo|camera|medical|legal|therapy|grief|grade|score|contest|prize|timer|politics|religion|romance|weapon|violence|feed animals|tasting plants|crossing streets/i)
  })

  it('builds a reusable product artifact manifest for the nature field notes kit', () => {
    const manifest = buildProductArtifactManifest(validNatureSource(), {
      pdf: {
        path: 'product-build/nature-walk-story-field-notes-kit/Nature-Walk-Story-Field-Notes-Kit.pdf',
        size: 123,
        sha256: 'pdf',
      },
      zip: {
        path: 'product-build/nature-walk-story-field-notes-kit/nature-walk-story-field-notes-kit.zip',
        size: 234,
        sha256: 'zip',
      },
      sourceHtml: {
        path: 'product-build/nature-walk-story-field-notes-kit/source/nature-walk-story-field-notes-kit.html',
        size: 345,
        sha256: 'html',
      },
      assets: [],
    })

    expect(manifest.productSlug).toBe('nature-walk-story-field-notes-kit')
    expect(manifest.sourcePageCount).toBe(12)
    expect(manifest.files.pdf.sha256).toBe('pdf')
  })

  it('keeps every built nature field-note artifact page within one sheet after images load', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'plot-sprout-nature-walk-layout-'))
    const buildDir = join(tempDir, 'nature-walk-story-field-notes-kit')
    const browser = await chromium.launch({ headless: true })
    try {
      await buildNatureWalkStoryFieldNotesKit({
        buildDir,
        recordRoot: tempDir,
        writePdf: async ({ pdfPath }) => {
          writeFileSync(pdfPath, fakePdf(17))
        },
      })
      const page = await browser.newPage({ viewport: { width: 1100, height: 1500 } })
      await page.goto(pathToFileURL(join(buildDir, 'source', 'nature-walk-story-field-notes-kit.html')).href, {
        waitUntil: 'load',
      })
      await page.waitForFunction(() => [...document.images].every((image) => image.complete && image.naturalWidth > 0))
      const overflowingPages = await page.$$eval('.pack-page', (pages) =>
        pages
          .map((element, index) => ({
            index,
            scrollHeight: element.scrollHeight,
            clientHeight: element.clientHeight,
            heading: element.querySelector('h1, h2')?.textContent ?? '',
          }))
          .filter((entry) => entry.scrollHeight > entry.clientHeight + 1),
      )

      expect(overflowingPages).toEqual([])
    } finally {
      await browser.close()
      rmSync(tempDir, { recursive: true, force: true })
    }
  }, 20000)
})
