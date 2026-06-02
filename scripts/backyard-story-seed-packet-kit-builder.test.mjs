import { describe, expect, it } from 'vitest'
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromium } from 'playwright'

import { buildProductArtifactManifest } from './rainy-day-pack-builder.mjs'
import {
  validateBackyardStorySeedPacketKitSource,
  validateBackyardStorySeedPacketKitSourceFiles,
} from './product-artifact-policy.mjs'
import {
  buildBackyardStorySeedPacketKit,
  loadBackyardStorySeedPacketKitBuildInputs,
  renderBackyardStorySeedPacketKitHtml,
} from './backyard-story-seed-packet-kit-builder.mjs'

const safety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles.'

function fakePdf(pageCount) {
  return Buffer.from(
    `%PDF-1.7\n${Array.from({ length: pageCount }, (_, index) => `${index + 1} 0 obj << /Type /Page >> endobj`).join('\n')}\n%%EOF\n`,
  )
}

const seedWorldAges = {
  'teacup-town-weather-window': '7-8',
  'acorn-avenue-errand-office': '7-9',
  'pocket-park-notice-board': '7-9',
  'button-bakery-map-mixup': '7-9',
  'greenhouse-gear-garden': '8-10',
  'rain-gauge-railway': '8-10',
  'seed-library-map-room': '8-10',
  'moss-message-observatory': '8-10',
  'pantry-measurement-mystery': '8-10',
  'compass-craft-academy': '10-11',
  'almost-invention-workshop': '10-11',
  'margin-note-market': '10-11',
  'binding-day-boardwalk': '10-11',
  'index-card-theater-club': '10-11',
}

const seedWorldSlugs = Object.keys(seedWorldAges)

function seedPacket(index, worldSlug, ageBand) {
  return {
    id: `backyard-seed-packet-${String(index).padStart(2, '0')}`,
    title: `Backyard Story Seed Packet ${index}`,
    worldSlug,
    ageBand,
    seedPacketSkill: 'setting seed',
    useCase: 'A screen-free paper seed packet page that turns one broad yard detail into make-believe story practice.',
    adultSetup: 'Choose a calm adult-approved observation view, place the paper packet on a table, and keep every detail invented.',
    kidDirection: 'Look, listen, point, sketch, or imagine one safe detail from the adult-approved view, then turn it into a story seed.',
    packetLabelPrompt: 'My paper packet label says this story seed is about: ____________________',
    detailSeedsPrompt: 'Three detail seeds for the scene are color ____________________, shape ____________________, and sound ____________________.',
    storySeedPrompt: 'This invented story seed could grow into a friendly clue about ____________________.',
    sproutSentencePath: 'First ____________________, next ____________________, and last ____________________.',
    revisionNudge: 'Make one plain word clearer with a color, shape, or sound: ____________________.',
    quietOptionLine: 'Quiet option: point, sketch, dictate, or write one private seed word: ____________________.',
    takeHomeLine: 'At home, add one invented title or ending detail here: ____________________.',
  }
}

function validBackyardSource(overrides = {}) {
  return {
    batchId: '2026-06-02-batch24',
    generatedAt: '2026-06-02',
    productSlug: 'backyard-story-seed-packet-kit',
    title: 'Backyard Story Seed Packet Kit',
    pricePoint: '$35',
    audience: 'Families, homeschool groups, tutors, co-ops, library tables, and yard-view writers ages 7-11.',
    sessionLength: '14 printable story seed packet pages plus adult guide tools, packet formats, and take-home seed slips',
    safetyNote: safety,
    artifact: {
      pdfPath: 'product-build/backyard-story-seed-packet-kit/Backyard-Story-Seed-Packet-Kit.pdf',
      zipPath: 'product-build/backyard-story-seed-packet-kit/backyard-story-seed-packet-kit.zip',
      sourceHtmlPath:
        'product-build/backyard-story-seed-packet-kit/source/backyard-story-seed-packet-kit.html',
      manifestPath: 'product-build/backyard-story-seed-packet-kit/manifest.json',
    },
    sourceFiles: [
      'content/product-artifacts/lanes/batch24-seed-packets-a.json',
      'content/product-artifacts/lanes/batch24-seed-packets-b.json',
      'content/product-artifacts/lanes/batch24-seed-packets-c.json',
      'content/product-artifacts/lanes/batch24-seed-tools.json',
    ],
    worldSlugs: seedWorldSlugs,
    cover: {
      kicker: 'Printable backyard story seed packets',
      headline: 'Backyard Story Seed Packet Kit',
      subhead: 'Fourteen paper seed-packet pages that turn broad yard-view details into tiny story starts.',
      included: [
        '14 printable story seed packet pages',
        'Adult setup guide',
        'Packet table setup notes',
        'Observation-to-story-seed coaching moves',
        'Privacy and site-rule notes',
        'Family handoff notes',
        'Six adult-led packet formats',
        'Ten take-home seed slips',
        'Eight optional share prompts',
        'Provider-ready PDF and ZIP artifact',
      ],
    },
    adultGuide: {
      beforeSession: [
        'Choose one calm adult-approved view such as yard, garden view, porch view, window view, table, or park edge.',
        'Print one packet page per writer and keep extra paper packets in an adult folder.',
        'Name the activity as paper story seeds so no one treats the page as real garden directions.',
        'Set the look, listen, point, sketch, or imagine rule before writing starts.',
        'Model one broad detail becoming one invented story seed.',
      ],
      packetTableSetup: [
        'Place only the active paper packet, pencil, and one choice strip at each seat.',
        'Keep extra pages, folders, and sample packets in an adult supply stack.',
        'Offer a quiet table option where writers can point, sketch, dictate, or write one line.',
        'Use symbols, color tabs, or plain folders for simple sorting.',
        'Leave enough space for the paper packet page and one take-home seed slip.',
      ],
      observationToStorySeeds: [
        'Start with one broad visible detail such as color, shape, texture, shadow, pattern, or gentle sound.',
        'Turn the detail into an invented setting, helper object, character clue, sequence step, or revision seed.',
        'Offer two adult-created choices when a writer needs a smaller start.',
        'Move in small steps: notice, label, imagine, write, and revise one word.',
        'Keep the final sentence make-believe and offline.',
      ],
      privacyAndSiteNotes: [
        'Use broad place labels and invented details instead of exact place details.',
        'Keep packet pages offline, printable, and handled by the adult leader, writer, or family.',
        'Organize pages with symbols, color tabs, or plain folders instead of private identifiers.',
        'Follow adult and site rules first; the story task is a still observation and writing activity.',
        'Keep sharing optional and focused on one printed packet, sketch, title, or invented detail.',
      ],
      familyHandoff: [
        'Send home the paper seed packet page, one optional seed slip, and a note that details are invented.',
        'Mark one simple next step such as add a title, add one detail, or finish the last sentence.',
        'Tell families the slip can be completed by pointing, sketching, dictating, or writing one short line.',
        'Keep any sharing optional and focused on the printed packet or one invented story seed.',
        'Store no copies in the kit after pages are handed to the family.',
      ],
      reset: ['Stack extra pages.', 'Refresh pencils.', 'Sort choice strips.', 'Keep sample details generic.'],
    },
    packetFormats: Array.from({ length: 6 }, (_, index) => ({
      name: `Packet Format ${index + 1}`,
      bestFor: 'A calm adult-led paper seed packet writing moment with one broad observation.',
      steps: [
        'Adult leader chooses one approved observation view and names the broad focus.',
        'Writers notice one safe detail from where they are standing or seated.',
        'Adult leader models how the detail can become an invented story seed.',
        'Writers draft one short paper packet line before the page goes into a folder.',
      ],
    })),
    takeHomeSeedSlips: Array.from({ length: 10 }, (_, index) => ({
      title: `Seed Slip ${index + 1}`,
      time: '7 minutes',
      skill: 'setting seed',
      direction: 'Choose one broad detail and turn it into an invented setting seed: ____________________',
      familyLine: 'A grown-up can ask which word makes the scene easier to picture: ____________________',
    })),
    optionalSharePrompts: [
      'Read one invented packet label if you want: ____________________',
      'Show one sketched story seed from the page: ____________________',
      'Point to one word you revised: ____________________',
      'Name one broad place label from your story: ____________________',
      'Ask an adult to read your favorite packet line: ____________________',
      'Share one make-believe helper object: ____________________',
      'Circle one detail you want to keep private: ____________________',
      'Choose one finish step for later: ____________________',
    ],
    seedPackets: seedWorldSlugs.map((worldSlug, index) =>
      seedPacket(index + 1, worldSlug, seedWorldAges[worldSlug]),
    ),
    ...overrides,
  }
}

const product = {
  slug: 'backyard-story-seed-packet-kit',
  title: 'Backyard Story Seed Packet Kit',
  pricePoint: '$35',
  status: 'checkout_pending',
  worldSlugs: seedWorldSlugs,
}

const worldAges = new Map(seedWorldSlugs.map((worldSlug) => [worldSlug, { ageBand: seedWorldAges[worldSlug] }]))

const worlds = new Map(
  seedWorldSlugs.map((worldSlug) => [
    worldSlug,
    {
      title: worldSlug
        .split('-')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' '),
      ageBand: seedWorldAges[worldSlug],
      premise: 'A friendly invented world for a screen-free backyard story seed packet.',
    },
  ]),
)

describe('Backyard Story Seed Packet Kit policy', () => {
  it('accepts a valid source with fourteen printable story seed packets', () => {
    expect(validateBackyardStorySeedPacketKitSource(validBackyardSource(), product, worldAges)).toEqual([])
  })

  it('rejects a seed packet response field without a writable blank', () => {
    const source = validBackyardSource()
    source.seedPackets[0].packetLabelPrompt = 'My packet has a label.'

    expect(validateBackyardStorySeedPacketKitSource(source, product, worldAges)).toContain(
      'seedPackets[0].packetLabelPrompt must include a writable blank.',
    )
  })

  it('rejects location tracking, public publishing, actual gardening, scoring, and unsafe pressure language', () => {
    const source = validBackyardSource()
    source.adultGuide.beforeSession[0] =
      'Record GPS coordinates, exact address, photos, child names, grades, scores, and upload the route for public publishing.'
    source.seedPackets[0].kidDirection =
      'Win a prize by using a timer, planting seeds, watering plants, touching soil, using garden tools, adding fertilizer, spraying pesticide, foraging, tasting plants, crossing streets, climbing, politics, romance, and weapons.'

    expect(validateBackyardStorySeedPacketKitSource(source, product, worldAges)).toEqual(
      expect.arrayContaining([
        'Backyard Story Seed Packet Kit source includes account, upload, public-publishing, location-tracking, exact-place, contact, photo, child-profile, roster, attendance, sign-in, or behavior-report language.',
        'Backyard Story Seed Packet Kit source includes medical, legal, therapy, diagnosis, grief, assessment, grade, score, guaranteed-outcome, contest, prize, timer-pressure, gambling, politics, religion, romance, weapon, violence, branded, ad-targeting, animal-contact, foraging, tasting, plant-identification, real-gardening, street-crossing, water-entry, weather-risk, or unsafe physical language.',
      ]),
    )
  })

  it('rejects solar oven and warm-snack experiment language in seed packet content', () => {
    const source = validBackyardSource()
    source.seedPackets[0].kidDirection =
      'Sketch a solar oven that warms snacks, then imagine the test result here: ____________________.'

    expect(validateBackyardStorySeedPacketKitSource(source, product, worldAges)).toContain(
      'Backyard Story Seed Packet Kit source includes medical, legal, therapy, diagnosis, grief, assessment, grade, score, guaranteed-outcome, contest, prize, timer-pressure, gambling, politics, religion, romance, weapon, violence, branded, ad-targeting, animal-contact, foraging, tasting, plant-identification, real-gardening, street-crossing, water-entry, weather-risk, or unsafe physical language.',
    )
  })

  it('keeps declared source lane files reproducible with the committed backyard seed source', () => {
    const root = resolve(import.meta.dirname, '..')
    const source = JSON.parse(
      readFileSync(resolve(root, 'content', 'product-artifacts', 'backyard-story-seed-packet-kit.json'), 'utf8'),
    )

    expect(validateBackyardStorySeedPacketKitSourceFiles(source, root)).toEqual([])
  })
})

describe('Backyard Story Seed Packet Kit builder', () => {
  it('loads committed backyard source, product, worlds, and local image inputs before writing artifacts', () => {
    const { source, product: committedProduct, worlds: committedWorlds, imageMap } =
      loadBackyardStorySeedPacketKitBuildInputs()

    expect(source.productSlug).toBe('backyard-story-seed-packet-kit')
    expect(source.seedPackets).toHaveLength(14)
    expect(committedProduct.status).toBe('checkout_pending')
    expect(imageMap.size).toBe(source.worldSlugs.length)
    for (const slug of source.worldSlugs) {
      expect(committedWorlds.has(slug)).toBe(true)
      expect(imageMap.has(slug)).toBe(true)
    }
  })

  it('exercises the actual build entry point against a temporary artifact directory', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'plot-sprout-backyard-seed-build-'))
    const buildDir = join(tempDir, 'backyard-story-seed-packet-kit')
    try {
      const { manifest } = await buildBackyardStorySeedPacketKit({
        buildDir,
        recordRoot: tempDir,
        writePdf: async ({ pdfPath }) => {
          writeFileSync(pdfPath, fakePdf(19))
        },
      })

      expect(manifest.productSlug).toBe('backyard-story-seed-packet-kit')
      expect(manifest.sourcePageCount).toBe(14)
      expect(manifest.files.assets.length).toBe(14)
      expect(existsSync(join(buildDir, 'source', 'backyard-story-seed-packet-kit.html'))).toBe(true)
      expect(existsSync(join(buildDir, 'README.txt'))).toBe(true)
      expect(existsSync(join(buildDir, 'manifest.json'))).toBe(true)
      expect(readFileSync(join(buildDir, 'backyard-story-seed-packet-kit.zip')).subarray(0, 2).toString('ascii')).toBe('PK')
      expect(readFileSync(join(buildDir, 'source', 'backyard-story-seed-packet-kit.html'), 'utf8').match(/class="[^"]*seed-packet-page/g)).toHaveLength(14)
    } finally {
      rmSync(tempDir, { recursive: true, force: true })
    }
  }, 15000)

  it('renders printable backyard seed packet HTML with adult guide, local images, and no checkout copy', () => {
    const html = renderBackyardStorySeedPacketKitHtml(
      validBackyardSource(),
      worlds,
      new Map(seedWorldSlugs.map((worldSlug) => [worldSlug, `assets/${worldSlug}.jpg`])),
    )

    expect(html).toContain('<!doctype html>')
    expect(html).toContain('@page')
    expect(html).toContain('Backyard Story Seed Packet Kit')
    expect(html).toContain('Observation-to-story seeds')
    expect(html).toContain('Privacy and site notes')
    expect(html).toContain('My paper packet label says')
    expect(html.match(/class="[^"]*seed-packet-page/g)).toHaveLength(14)
    expect(html).toContain('assets/seed-library-map-room.jpg')
    expect(html).not.toMatch(/checkout|payment link|buy now|stripe|gumroad|account|login|upload|public publishing|GPS|coordinates|address|phone|email|photo|camera|medical|legal|therapy|grief|grade|score|contest|prize|timer|politics|religion|romance|weapon|violence|foraging|tasting plants|plant identification|planting seeds|watering plants|soil|garden tools|fertilizer|pesticide|solar oven|warm snacks|crossing streets/i)
  })

  it('builds a reusable product artifact manifest for the backyard seed packet kit', () => {
    const manifest = buildProductArtifactManifest(validBackyardSource(), {
      pdf: {
        path: 'product-build/backyard-story-seed-packet-kit/Backyard-Story-Seed-Packet-Kit.pdf',
        size: 123,
        sha256: 'pdf',
      },
      zip: {
        path: 'product-build/backyard-story-seed-packet-kit/backyard-story-seed-packet-kit.zip',
        size: 234,
        sha256: 'zip',
      },
      sourceHtml: {
        path: 'product-build/backyard-story-seed-packet-kit/source/backyard-story-seed-packet-kit.html',
        size: 345,
        sha256: 'html',
      },
      assets: [],
    })

    expect(manifest.productSlug).toBe('backyard-story-seed-packet-kit')
    expect(manifest.sourcePageCount).toBe(14)
    expect(manifest.files.pdf.sha256).toBe('pdf')
  })

  it('keeps every built backyard seed packet artifact page within one sheet after images load', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'plot-sprout-backyard-seed-layout-'))
    const buildDir = join(tempDir, 'backyard-story-seed-packet-kit')
    const browser = await chromium.launch({ headless: true })
    try {
      await buildBackyardStorySeedPacketKit({
        buildDir,
        recordRoot: tempDir,
        writePdf: async ({ pdfPath }) => {
          writeFileSync(pdfPath, fakePdf(19))
        },
      })
      const page = await browser.newPage({ viewport: { width: 1100, height: 1500 } })
      await page.goto(pathToFileURL(join(buildDir, 'source', 'backyard-story-seed-packet-kit.html')).href, {
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
