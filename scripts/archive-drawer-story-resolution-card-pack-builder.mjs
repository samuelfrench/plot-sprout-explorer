import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { createHash } from 'node:crypto'
import { dirname, relative, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

import {
  archiveDrawerStoryResolutionCardPackProductSlug,
  validateArchiveDrawerStoryResolutionCardPackSource,
  validateArchiveDrawerStoryResolutionCardPackSourceFiles,
  writeStoredZip,
} from './product-artifact-policy.mjs'
import { buildProductArtifactManifest } from './rainy-day-pack-builder.mjs'
import { starterWorlds } from './starter-worlds.mjs'

export {
  archiveDrawerStoryResolutionCardPackProductSlug,
  validateArchiveDrawerStoryResolutionCardPackSource,
  validateArchiveDrawerStoryResolutionCardPackSourceFiles,
}

const root = resolve(import.meta.dirname, '..')
const sourcePath = resolve(root, 'content', 'product-artifacts', 'archive-drawer-story-resolution-card-pack.json')
const productsPath = resolve(root, 'content', 'products', 'batch5-products.json')
const worldsDir = resolve(root, 'content', 'worlds')
const buildDir = resolve(root, 'product-build', archiveDrawerStoryResolutionCardPackProductSlug)

const requiredSafety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, and no identifying facts.'

const sourceFiles = [
  'content/product-artifacts/lanes/batch60-archive-drawer-resolution-cards-a.json',
  'content/product-artifacts/lanes/batch60-archive-drawer-resolution-cards-b.json',
  'content/product-artifacts/lanes/batch60-archive-drawer-resolution-cards-c.json',
  'content/product-artifacts/lanes/batch60-archive-drawer-resolution-tools.json',
]

const expectedWorldSlugs = [
  'teacup-town-weather-window',
  'mitten-market-lost-ticket',
  'button-bakery-map-mixup',
  'paperclip-plaza-parcel-day',
  'sticker-station-mail-cart',
  'greenhouse-gear-garden',
  'moss-message-observatory',
  'rain-gauge-railway',
  'seed-library-map-room',
  'solar-oven-picnic-station',
  'tidepool-timekeepers-lab',
  'almost-invention-workshop',
  'appendix-archive-lab',
  'clue-label-tower-museum',
  'compost-clock-workshop',
  'index-card-theater-club',
]

const requiredArtifactPaths = {
  pdfPath:
    'product-build/archive-drawer-story-resolution-card-pack/Archive-Drawer-Story-Resolution-Card-Pack.pdf',
  zipPath:
    'product-build/archive-drawer-story-resolution-card-pack/archive-drawer-story-resolution-card-pack.zip',
  sourceHtmlPath:
    'product-build/archive-drawer-story-resolution-card-pack/source/archive-drawer-story-resolution-card-pack.html',
  manifestPath: 'product-build/archive-drawer-story-resolution-card-pack/manifest.json',
}

const coverIncluded = [
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
]

function archiveDrawerStoryResolutionBuildPaths(targetBuildDir = buildDir) {
  const sourceDir = resolve(targetBuildDir, 'source')
  return {
    buildDir: targetBuildDir,
    sourceDir,
    assetsDir: resolve(sourceDir, 'assets'),
    pdfPath: resolve(targetBuildDir, 'Archive-Drawer-Story-Resolution-Card-Pack.pdf'),
    zipPath: resolve(targetBuildDir, 'archive-drawer-story-resolution-card-pack.zip'),
    htmlPath: resolve(sourceDir, 'archive-drawer-story-resolution-card-pack.html'),
    manifestPath: resolve(targetBuildDir, 'manifest.json'),
    readmePath: resolve(targetBuildDir, 'README.txt'),
  }
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function titleForSlug(slug) {
  return slug
    .split('-')
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ')
    .replace('Map Mixup', 'Map Mix-Up')
}

function fallbackProduct(source) {
  return {
    slug: source.productSlug,
    title: source.title,
    pricePoint: source.pricePoint,
    status: 'checkout_pending',
    worldSlugs: source.worldSlugs,
  }
}

function loadWorlds() {
  const worlds = new Map()
  for (const world of starterWorlds) worlds.set(world.slug, world)
  for (const file of readdirSync(worldsDir).filter((item) => /^batch1-.+\.json$/.test(item))) {
    const data = readJson(resolve(worldsDir, file))
    for (const world of data.worlds) worlds.set(world.slug, world)
  }
  return worlds
}

function worldAgeRecords(worlds) {
  return new Map(
    [...worlds.entries()].map(([slug, world]) => [
      slug,
      {
        ageBand: world.ageBand,
      },
    ]),
  )
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

function assembleSourceFromLanes() {
  const lanes = sourceFiles.map((file) => readJson(resolve(root, file)))
  const cardLanes = lanes.filter(Array.isArray)
  const tools = lanes.find((lane) => isObject(lane) && isObject(lane.adultGuide))
  const cards = cardLanes
    .flat()
    .sort((left, right) => String(left.id).localeCompare(String(right.id)))

  if (cardLanes.length !== 3 || !tools) {
    throw new Error('Batch60 archive drawer source lanes are incomplete.')
  }

  return {
    batchId: '2026-06-04-batch60',
    generatedAt: '2026-06-04',
    productSlug: archiveDrawerStoryResolutionCardPackProductSlug,
    title: 'Archive Drawer Story Resolution Card Pack',
    pricePoint: '$93',
    audience: 'Families, homeschool groups, tutors, and adult-led writing tables for writers ages 7-11.',
    sessionLength:
      '16 printable archive drawer story resolution cards plus adult guide tools, resolution routines, take-home resolution slips, and optional adult prompts',
    safetyNote: requiredSafety,
    artifact: { ...requiredArtifactPaths },
    sourceFiles: [...sourceFiles],
    worldSlugs: [...expectedWorldSlugs],
    cover: {
      kicker: 'Printable archive drawer resolution cards',
      headline: 'Archive Drawer Story Resolution Card Pack',
      subhead:
        'Sixteen archive-drawer cards help writers connect a loose thread, a last choice, a changed feeling, a closing image, a leftover question, and a next-story seed.',
      included: [...coverIncluded],
    },
    adultGuide: tools.adultGuide,
    resolutionRoutines: tools.resolutionRoutines,
    takeHomeResolutionSlips: tools.takeHomeResolutionSlips,
    optionalAdultPrompts: tools.optionalAdultPrompts,
    cards,
  }
}

export function loadArchiveDrawerStoryResolutionCardPackBuildInputs() {
  const source = existsSync(sourcePath) ? readJson(sourcePath) : assembleSourceFromLanes()
  const products = existsSync(productsPath) ? readJson(productsPath).products : []
  const product =
    products.find((candidate) => candidate.slug === source.productSlug) ?? fallbackProduct(source)
  const worlds = loadWorlds()

  for (const slug of source.worldSlugs) {
    if (!worlds.has(slug)) throw new Error(`Missing world record for ${slug}`)
    if (!productImagePath(slug)) throw new Error(`Missing local image for ${slug}`)
  }

  return { source, product, worlds }
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function renderList(items) {
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')
}

function renderGuideCard(title, items) {
  return `<article class="guide-card"><h3>${escapeHtml(title)}</h3><ul>${renderList(items)}</ul></article>`
}

function renderWorldCard(world, imagePath) {
  const image = imagePath
    ? `<img src="${escapeHtml(imagePath)}" alt="${escapeHtml(world.title)} illustration">`
    : '<div class="image-placeholder" aria-hidden="true"></div>'
  return `
    <article class="world-card">
      ${image}
      <p class="card-kicker">Ages ${escapeHtml(world.ageBand)}</p>
      <h3>${escapeHtml(world.title)}</h3>
    </article>`
}

function renderRoutine(routine) {
  return `
    <article class="small-card">
      <p class="card-kicker">${escapeHtml(routine.time)}</p>
      <h3>${escapeHtml(routine.title)}</h3>
      <p>${escapeHtml(routine.materials)}</p>
      <ol>${renderList(routine.steps)}</ol>
      <p>${escapeHtml(routine.adultWrapLine)}</p>
    </article>`
}

function renderSlip(slip, index) {
  return `
    <article class="card-slip">
      <p class="card-kicker">Take-home resolution slip</p>
      <h3>Resolution slip ${index + 1}</h3>
      <p>${escapeHtml(slip)}</p>
    </article>`
}

function renderField(label, value) {
  return `
    <section class="field-block">
      <h3>${escapeHtml(label)}</h3>
      <p>${escapeHtml(value)}</p>
    </section>`
}

function renderCard(card, index, worlds, imageMap) {
  const world = worlds.get(card.worldSlug)
  if (!world) throw new Error(`Unknown Archive Drawer Story Resolution Card world slug: ${card.worldSlug}`)
  const imagePath = imageMap.get(card.worldSlug)
  const image = imagePath
    ? `<img src="${escapeHtml(imagePath)}" alt="${escapeHtml(world.title)} illustration">`
    : '<div class="image-placeholder" aria-hidden="true"></div>'
  const fields = [
    renderField('Loose thread', card.looseThreadPrompt),
    renderField('Last choice', card.lastChoicePrompt),
    renderField('Changed feeling', card.changedFeelingPrompt),
    renderField('Closing image', card.closingImagePrompt),
    renderField('Leftover question', card.leftoverQuestionPrompt),
    renderField('Next-story seed', card.nextStorySeedPrompt),
    renderField('Archive drawer label', card.archiveDrawerLabelPrompt),
  ].join('\n')

  return `
    <section class="pack-page resolution-card-page">
      <div class="page-kicker">Resolution Card ${index + 1} | Ages ${escapeHtml(card.ageBand)} | ${escapeHtml(card.resolutionSkill)}</div>
      <h2>${escapeHtml(card.title)}</h2>
      <figure>
        ${image}
        <figcaption>${escapeHtml(world.title)}</figcaption>
      </figure>
      <p class="adult-note"><strong>Adult setup:</strong> ${escapeHtml(card.adultSetup)}</p>
      <p class="kid-direction">${escapeHtml(card.kidDirection)}</p>
      <div class="field-grid">${fields}</div>
      <p class="take-home-line">${escapeHtml(card.quietOptionLine)} ${escapeHtml(card.takeHomeLine)}</p>
    </section>`
}

export function renderArchiveDrawerStoryResolutionCardPackHtml(source, worlds, imageMap = new Map()) {
  const worldCards = source.worldSlugs
    .map((slug) => {
      const world = worlds.get(slug)
      if (!world) throw new Error(`Unknown Archive Drawer Story Resolution Card source world slug: ${slug}`)
      return renderWorldCard(world, imageMap.get(slug))
    })
    .join('\n')
  const cards = source.cards
    .map((card, index) => renderCard(card, index, worlds, imageMap))
    .join('\n')

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(source.title)}</title>
    <style>
      @page { size: Letter; margin: 0.34in; }
      :root {
        --ink: #263238;
        --muted: #5a6266;
        --paper: #fffdf8;
        --line: #d7cdbc;
        --green: #356f62;
        --red: #a54e48;
        --gold: #d1a64d;
        --blue: #416f92;
        color: var(--ink);
        font-family: Avenir Next, Avenir, Trebuchet MS, Verdana, sans-serif;
        font-size: 8px;
        line-height: 1.08;
      }
      * { box-sizing: border-box; }
      body { margin: 0; background: var(--paper); }
      h1, h2, h3, p { margin-top: 0; }
      h1, h2 { font-family: Georgia, Times New Roman, serif; line-height: 1.02; }
      h1 { max-width: 12ch; font-size: 30px; }
      h2 { margin-bottom: 0.05in; font-size: 17px; }
      h3 { margin-bottom: 0.025in; font-size: 8.45px; }
      p, li { color: var(--muted); }
      img { display: block; max-width: 100%; border: 1px solid var(--line); }
      .image-placeholder { width: 100%; aspect-ratio: 1.28 / 1; border: 1px solid var(--line); background: repeating-linear-gradient(135deg, #fff, #fff 8px, #f3eee4 8px, #f3eee4 16px); }
      .pack-page {
        height: 9.24in;
        padding: 0.11in;
        overflow: hidden;
        page-break-after: always;
        background:
          linear-gradient(90deg, rgba(53, 111, 98, 0.08) 1px, transparent 1px),
          linear-gradient(180deg, rgba(165, 78, 72, 0.07) 1px, transparent 1px),
          var(--paper);
        background-size: 0.25in 0.25in;
        border: 2px solid var(--ink);
      }
      .cover-page { display: grid; grid-template-columns: 1fr 2.05in; gap: 0.2in; border-top: 0.16in solid var(--red); }
      .guide-page { border-top: 0.16in solid var(--green); font-size: 6.7px; }
      .world-page { border-top: 0.16in solid var(--gold); font-size: 6.82px; }
      .routine-page { border-top: 0.16in solid var(--blue); font-size: 6.65px; }
      .slip-page { border-top: 0.16in solid var(--red); font-size: 6.88px; }
      .resolution-card-page { font-size: 7.3px; }
      .page-kicker, .card-kicker, .kicker {
        color: var(--green);
        font-size: 6.55px;
        font-weight: 900;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .badge {
        display: inline-grid;
        min-width: 0.82in;
        min-height: 0.5in;
        place-items: center;
        border: 2px solid var(--ink);
        background: white;
        font-weight: 900;
      }
      ul, ol { margin: 0; padding-left: 0.14in; }
      .cover-meta, .guide-grid, .world-grid, .routine-grid, .slip-grid { display: grid; gap: 0.045in; }
      .guide-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.032in; }
      .world-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.034in; }
      .routine-grid, .slip-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.04in; }
      .guide-card, .small-card, .world-card, .card-slip, .field-block {
        padding: 0.04in;
        background: rgba(255, 255, 255, 0.86);
        border: 1px solid var(--line);
      }
      .world-card img, .world-card .image-placeholder { width: 100%; aspect-ratio: 2.15 / 1; object-fit: cover; margin-bottom: 0.022in; }
      .world-card h3 { font-size: 7.1px; }
      .small-card p, .small-card li, .card-slip p { margin-bottom: 0.02in; }
      .resolution-card-page figure { float: right; width: 1.34in; margin: 0 0 0.05in 0.09in; }
      .resolution-card-page figure img { width: 100%; aspect-ratio: 1.28 / 1; object-fit: cover; }
      figcaption { color: var(--green); font-size: 6.55px; font-weight: 900; }
      .adult-note, .kid-direction {
        margin-bottom: 0.04in;
        padding: 0.04in;
        background: white;
        border-left: 0.055in solid var(--gold);
      }
      .kid-direction { border-left-color: var(--green); }
      .field-grid {
        clear: both;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.032in;
      }
      .field-block p {
        min-height: 0.245in;
        margin-bottom: 0;
        padding-bottom: 0.018in;
        border-bottom: 1px solid rgba(53, 111, 98, 0.18);
      }
      .take-home-line {
        margin-top: 0.047in;
        padding: 0.045in;
        background: rgba(255, 255, 255, 0.86);
        border: 1px dashed var(--red);
        color: var(--ink);
        font-weight: 700;
      }
      .footer-note { margin-top: 0.05in; font-size: 7px; }
    </style>
  </head>
  <body>
    <section class="pack-page cover-page">
      <div>
        <p class="kicker">${escapeHtml(source.cover.kicker)}</p>
        <h1>${escapeHtml(source.cover.headline)}</h1>
        <p>${escapeHtml(source.cover.subhead)}</p>
        <p><strong>Audience:</strong> ${escapeHtml(source.audience)}</p>
        <p><strong>Format:</strong> ${escapeHtml(source.sessionLength)}</p>
        <p>Family-safe printable writing pages for adult-led, offline resolution practice.</p>
      </div>
      <div class="cover-meta">
        <span class="badge">${escapeHtml(source.pricePoint)}</span>
        <h2>Included</h2>
        <ul>${renderList(source.cover.included)}</ul>
      </div>
    </section>
    <section class="pack-page guide-page">
      <p class="page-kicker">Adult guide</p>
      <h2>Resolution coaching</h2>
      <div class="guide-grid">
        ${renderGuideCard(source.adultGuide.title, source.adultGuide.bullets)}
      </div>
      <p class="footer-note">Use one story resolution card at a time. Keep every change broad, invented, paper-only, and guided by an adult.</p>
    </section>
    <section class="pack-page world-page">
      <p class="page-kicker">World menu</p>
      <h2>Sixteen resolution card worlds</h2>
      <p>Pick a world image, then connect what came before, what changed, and what follows next.</p>
      <div class="world-grid">${worldCards}</div>
    </section>
    <section class="pack-page routine-page">
      <p class="page-kicker">Resolution routines</p>
      <h2>Choose the story resolution routine</h2>
      <div class="routine-grid">${source.resolutionRoutines.map(renderRoutine).join('\n')}</div>
    </section>
    <section class="pack-page slip-page">
      <p class="page-kicker">Take-home resolution slips</p>
      <h2>Try one resolution later</h2>
      <div class="slip-grid">${source.takeHomeResolutionSlips.map(renderSlip).join('\n')}</div>
      <h3>Optional adult prompts</h3>
      <ul>${renderList(source.optionalAdultPrompts)}</ul>
    </section>
${cards}
  </body>
</html>
`
}

function sha256File(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex')
}

function fileRecord(path, recordRoot) {
  return {
    path: relative(recordRoot, path),
    sha256: sha256File(path),
    size: readFileSync(path).length,
  }
}

const stablePdfDate = "D:20260604000000+00'00'"

function normalizePdfDateMetadata(pdfPath) {
  const original = readFileSync(pdfPath, 'latin1')
  const normalized = original.replace(
    /\/(CreationDate|ModDate)\s*\(([^)]*)\)/g,
    (_match, label, value) => {
      if (value.length !== stablePdfDate.length) {
        throw new Error(`Cannot normalize PDF ${label}; unexpected date metadata length ${value.length}.`)
      }
      return `/${label} (${stablePdfDate})`
    },
  )
  if (normalized !== original) writeFileSync(pdfPath, Buffer.from(normalized, 'latin1'))
}

function prepareBuildDirectory(paths = archiveDrawerStoryResolutionBuildPaths()) {
  rmSync(paths.buildDir, { recursive: true, force: true })
  mkdirSync(paths.assetsDir, { recursive: true })
}

function sourceImageForSlug(slug, { imageRoot, imageSources } = {}) {
  if (imageSources) return imageSources.get(slug)
  if (imageRoot) {
    const imagePath = resolve(imageRoot, `${slug}.jpg`)
    return existsSync(imagePath) ? imagePath : null
  }
  return productImagePath(slug)
}

function copyPackAssets(source, paths = archiveDrawerStoryResolutionBuildPaths(), options = {}) {
  const imageMap = new Map()
  for (const slug of new Set(source.worldSlugs)) {
    const sourceImage = sourceImageForSlug(slug, options)
    if (!sourceImage) throw new Error(`Missing Archive Drawer Story Resolution Card Pack source image for ${slug}`)
    const targetName = `${slug}.jpg`
    const targetPath = resolve(paths.assetsDir, targetName)
    copyFileSync(sourceImage, targetPath)
    imageMap.set(slug, `assets/${targetName}`)
  }
  return imageMap
}

function writeReadme(source, paths = archiveDrawerStoryResolutionBuildPaths()) {
  const text = [
    source.title,
    '',
    `Price point: ${source.pricePoint}`,
    `Audience: ${source.audience}`,
    `Format: ${source.sessionLength}`,
    '',
    'Files:',
    '- Archive-Drawer-Story-Resolution-Card-Pack.pdf',
    '- source/archive-drawer-story-resolution-card-pack.html',
    '- source/assets/*.jpg',
    '- manifest.json',
    '',
    'Fulfillment note:',
    'Hold the ZIP for Sam until the sales path is chosen.',
    'Do not add a download URL to the site.',
    '',
  ].join('\n')
  writeFileSync(paths.readmePath, text)
}

function zipEntries(paths = archiveDrawerStoryResolutionBuildPaths()) {
  const entries = [
    {
      name: 'Archive-Drawer-Story-Resolution-Card-Pack.pdf',
      data: readFileSync(paths.pdfPath),
    },
    {
      name: 'README.txt',
      data: readFileSync(paths.readmePath),
    },
    {
      name: 'source/archive-drawer-story-resolution-card-pack.html',
      data: readFileSync(paths.htmlPath),
    },
  ]
  for (const file of readdirSync(paths.assetsDir).sort()) {
    entries.push({
      name: `source/assets/${file}`,
      data: readFileSync(resolve(paths.assetsDir, file)),
    })
  }
  return entries
}

async function writePdfWithPlaywright({ htmlPath, pdfPath }) {
  const { chromium } = await import('playwright')
  const browser = await chromium.launch({ headless: true })
  try {
    const page = await browser.newPage({ viewport: { width: 1100, height: 1500 } })
    await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'load' })
    await page.pdf({
      path: pdfPath,
      format: 'Letter',
      printBackground: true,
      margin: {
        top: '0.25in',
        right: '0.25in',
        bottom: '0.25in',
        left: '0.25in',
      },
    })
    normalizePdfDateMetadata(pdfPath)
  } finally {
    await browser.close()
  }
}

async function writePdf({ htmlPath, pdfPath, pdfRenderer }) {
  if (!pdfRenderer) {
    await writePdfWithPlaywright({ htmlPath, pdfPath })
    return
  }
  const rendered = await pdfRenderer({ htmlPath, pdfPath })
  if (Buffer.isBuffer(rendered) || rendered instanceof Uint8Array) {
    writeFileSync(pdfPath, rendered)
    return
  }
  if (!existsSync(pdfPath)) {
    throw new Error('Custom PDF renderer must return PDF bytes or write the PDF file.')
  }
}

function assertValidBuildInput(source, product, worlds) {
  const sourceErrors = validateArchiveDrawerStoryResolutionCardPackSource(
    source,
    product,
    worldAgeRecords(worlds),
  )
  const laneErrors = validateArchiveDrawerStoryResolutionCardPackSourceFiles(source, root)
  const errors = [...sourceErrors, ...laneErrors]
  if (errors.length > 0) {
    throw new Error(`Archive Drawer Story Resolution Card Pack source is invalid:\n${errors.join('\n')}`)
  }
}

export async function buildArchiveDrawerStoryResolutionCardPack(options = {}) {
  const inputs = options.source
    ? {
        source: options.source,
        product: options.product ?? fallbackProduct(options.source),
        worlds: options.worlds ?? loadWorlds(),
      }
    : loadArchiveDrawerStoryResolutionCardPackBuildInputs()
  const { source, product, worlds } = inputs
  const paths = archiveDrawerStoryResolutionBuildPaths(options.outputDir ?? options.buildDir ?? buildDir)
  const recordRoot = options.recordRoot ?? (paths.buildDir === buildDir ? root : paths.buildDir)

  assertValidBuildInput(source, product, worlds)
  prepareBuildDirectory(paths)
  const imageMap = copyPackAssets(source, paths, {
    imageRoot: options.imageRoot,
    imageSources: options.imageSources,
  })
  const html = renderArchiveDrawerStoryResolutionCardPackHtml(source, worlds, imageMap)
  mkdirSync(dirname(paths.htmlPath), { recursive: true })
  writeFileSync(paths.htmlPath, html)
  writeReadme(source, paths)

  await writePdf({
    htmlPath: paths.htmlPath,
    pdfPath: paths.pdfPath,
    pdfRenderer: options.pdfRenderer ?? options.writePdf,
  })

  writeStoredZip(paths.zipPath, zipEntries(paths))
  const manifest = buildProductArtifactManifest(
    source,
    {
      pdf: fileRecord(paths.pdfPath, recordRoot),
      zip: fileRecord(paths.zipPath, recordRoot),
      sourceHtml: fileRecord(paths.htmlPath, recordRoot),
      readme: fileRecord(paths.readmePath, recordRoot),
      assets: source.worldSlugs.map((slug) => fileRecord(resolve(paths.assetsDir, `${slug}.jpg`), recordRoot)),
    },
    {
      fulfillmentNote:
        'Static artifact bundle: PDF plus source HTML and local image assets; sales path stays pending on the site.',
    },
  )
  writeFileSync(paths.manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)

  return {
    product,
    source,
    manifest,
    paths,
    pdfPath: paths.pdfPath,
    zipPath: paths.zipPath,
    htmlPath: paths.htmlPath,
    manifestPath: paths.manifestPath,
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  buildArchiveDrawerStoryResolutionCardPack().catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}
