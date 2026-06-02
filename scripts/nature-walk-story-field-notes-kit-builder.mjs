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

import { writeStoredZip } from './product-artifact-policy.mjs'
import { buildProductArtifactManifest } from './rainy-day-pack-builder.mjs'
import { starterWorlds } from './starter-worlds.mjs'

const root = resolve(import.meta.dirname, '..')
const sourcePath = resolve(root, 'content', 'product-artifacts', 'nature-walk-story-field-notes-kit.json')
const productsPath = resolve(root, 'content', 'products', 'batch5-products.json')
const worldsDir = resolve(root, 'content', 'worlds')
const buildDir = resolve(root, 'product-build', 'nature-walk-story-field-notes-kit')

function natureWalkBuildPaths(targetBuildDir = buildDir) {
  const sourceDir = resolve(targetBuildDir, 'source')
  return {
    buildDir: targetBuildDir,
    sourceDir,
    assetsDir: resolve(sourceDir, 'assets'),
    pdfPath: resolve(targetBuildDir, 'Nature-Walk-Story-Field-Notes-Kit.pdf'),
    zipPath: resolve(targetBuildDir, 'nature-walk-story-field-notes-kit.zip'),
    htmlPath: resolve(sourceDir, 'nature-walk-story-field-notes-kit.html'),
    manifestPath: resolve(targetBuildDir, 'manifest.json'),
    readmePath: resolve(targetBuildDir, 'README.txt'),
  }
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function renderList(items) {
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join('\n')
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

function renderWalkFormat(format) {
  return `
    <article class="small-card">
      <h3>${escapeHtml(format.name)}</h3>
      <p>${escapeHtml(format.bestFor)}</p>
      <ol>${renderList(format.steps)}</ol>
    </article>`
}

function renderFieldCard(card) {
  return `
    <article class="field-card">
      <p class="card-kicker">${escapeHtml(card.time)} | ${escapeHtml(card.skill)}</p>
      <h3>${escapeHtml(card.title)}</h3>
      <p>${escapeHtml(card.direction)}</p>
      <p>${escapeHtml(card.familyLine)}</p>
    </article>`
}

function renderField(label, value) {
  return `
    <section class="field-block">
      <h3>${escapeHtml(label)}</h3>
      <p>${escapeHtml(value)}</p>
    </section>`
}

function renderFieldNote(note, index, worlds, imageMap) {
  const world = worlds.get(note.worldSlug)
  if (!world) throw new Error(`Unknown Nature Walk world slug: ${note.worldSlug}`)
  const imagePath = imageMap.get(note.worldSlug)
  if (!imagePath) throw new Error(`Missing Nature Walk copied image for ${note.worldSlug}`)
  const fieldBlocks = [
    renderField('Notice', note.noticePrompt),
    renderField('Detail bank', note.detailBankPrompt),
    renderField('Story seed', note.storySeed),
    renderField('Sentence path', note.sentencePath),
    renderField('Revision nudge', note.revisionNudge),
    renderField('Quiet option', note.quietOptionLine),
  ].join('\n')

  return `
    <section class="pack-page field-note-page">
      <div class="page-kicker">Field Note ${index + 1} | Ages ${escapeHtml(note.ageBand)} | ${escapeHtml(note.fieldNoteSkill)}</div>
      <h2>${escapeHtml(note.title)}</h2>
      <figure>
        <img src="${escapeHtml(imagePath)}" alt="${escapeHtml(world.title)} illustration">
        <figcaption>${escapeHtml(world.title)}</figcaption>
      </figure>
      <p class="adult-note"><strong>Adult setup:</strong> ${escapeHtml(note.adultSetup)}</p>
      <p class="kid-direction">${escapeHtml(note.kidDirection)}</p>
      <div class="field-grid">${fieldBlocks}</div>
      <p class="take-home-line">${escapeHtml(note.takeHomeLine)}</p>
    </section>`
}

export function renderNatureWalkStoryFieldNotesKitHtml(source, worlds, imageMap = new Map()) {
  const worldCards = source.worldSlugs
    .map((slug) => {
      const world = worlds.get(slug)
      if (!world) throw new Error(`Unknown Nature Walk source world slug: ${slug}`)
      return renderWorldCard(world, imageMap.get(slug))
    })
    .join('\n')
  const fieldNotes = source.fieldNotes
    .map((note, index) => renderFieldNote(note, index, worlds, imageMap))
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
        --ink: #243135;
        --muted: #59666a;
        --paper: #fffdf8;
        --line: #c9d9ce;
        --leaf: #39735c;
        --gold: #e2b84a;
        --blue: #327889;
        --berry: #a9445b;
        color: var(--ink);
        font-family: Avenir Next, Avenir, Trebuchet MS, Verdana, sans-serif;
        font-size: 9px;
        line-height: 1.1;
      }
      * { box-sizing: border-box; }
      body { margin: 0; background: var(--paper); }
      h1, h2, h3, p { margin-top: 0; }
      h1, h2 { font-family: Georgia, Times New Roman, serif; line-height: 1.02; }
      h1 { max-width: 11ch; font-size: 34px; }
      h2 { margin-bottom: 0.05in; font-size: 19px; }
      h3 { margin-bottom: 0.025in; font-size: 9.2px; }
      p, li { color: var(--muted); }
      img { display: block; max-width: 100%; border: 1px solid var(--line); }
      .pack-page {
        height: 9.24in;
        padding: 0.12in;
        overflow: hidden;
        page-break-after: always;
        background:
          linear-gradient(90deg, rgba(57, 115, 92, 0.08) 1px, transparent 1px),
          linear-gradient(180deg, rgba(57, 115, 92, 0.08) 1px, transparent 1px),
          var(--paper);
        background-size: 0.25in 0.25in;
        border: 2px solid var(--ink);
      }
      .cover-page { display: grid; grid-template-columns: 1fr 2.1in; gap: 0.2in; border-top: 0.16in solid var(--gold); }
      .guide-page { border-top: 0.16in solid var(--leaf); font-size: 7.2px; }
      .world-page { border-top: 0.16in solid var(--gold); font-size: 7.35px; }
      .walk-page { border-top: 0.16in solid var(--blue); font-size: 7.55px; }
      .card-page { border-top: 0.16in solid var(--berry); font-size: 7.4px; }
      .field-note-page { font-size: 8.55px; }
      .page-kicker, .card-kicker, .kicker {
        color: var(--leaf);
        font-size: 7.1px;
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
      ul, ol { margin: 0; padding-left: 0.15in; }
      .cover-meta, .guide-grid, .world-grid, .walk-grid, .card-grid { display: grid; gap: 0.05in; }
      .guide-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.038in; }
      .world-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.038in; }
      .walk-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.045in; }
      .card-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.04in; }
      .guide-card, .small-card, .world-card, .field-card, .field-block {
        padding: 0.044in;
        background: rgba(255, 255, 255, 0.84);
        border: 1px solid var(--line);
      }
      .world-card img { width: 100%; aspect-ratio: 2.15 / 1; object-fit: cover; margin-bottom: 0.025in; }
      .world-card h3 { font-size: 7.35px; }
      .small-card p, .small-card li, .field-card p { margin-bottom: 0.025in; }
      .field-note-page figure { float: right; width: 1.5in; margin: 0 0 0.055in 0.1in; }
      .field-note-page figure img { width: 100%; aspect-ratio: 1.28 / 1; object-fit: cover; }
      figcaption { color: var(--leaf); font-size: 7px; font-weight: 900; }
      .adult-note, .kid-direction {
        margin-bottom: 0.045in;
        padding: 0.045in;
        background: white;
        border-left: 0.06in solid var(--gold);
      }
      .kid-direction { border-left-color: var(--leaf); }
      .field-grid {
        clear: both;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.04in;
      }
      .field-block p {
        min-height: 0.31in;
        margin-bottom: 0;
        padding-bottom: 0.02in;
        border-bottom: 1px solid rgba(57, 115, 92, 0.18);
      }
      .take-home-line {
        margin-top: 0.052in;
        padding: 0.05in;
        background: rgba(255, 255, 255, 0.86);
        border: 1px dashed var(--berry);
        color: var(--ink);
        font-weight: 700;
      }
      .footer-note { margin-top: 0.06in; font-size: 7.6px; }
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
        <p>Family-safe printable writing pages for adult-led, offline story practice.</p>
      </div>
      <div class="cover-meta">
        <span class="badge">${escapeHtml(source.pricePoint)}</span>
        <h2>Included</h2>
        <ul>${renderList(source.cover.included)}</ul>
      </div>
    </section>
    <section class="pack-page guide-page">
      <p class="page-kicker">Adult guide</p>
      <h2>Observation-to-story setup</h2>
      <div class="guide-grid">
        ${renderGuideCard('Before the walk', source.adultGuide.beforeWalk)}
        ${renderGuideCard('Field table setup', source.adultGuide.fieldTableSetup)}
        ${renderGuideCard('Observation-to-story', source.adultGuide.observationToStory)}
        ${renderGuideCard('Privacy and site notes', source.adultGuide.privacyAndSiteNotes)}
        ${renderGuideCard('Family handoff', source.adultGuide.familyHandoff)}
        ${renderGuideCard('Reset', source.adultGuide.reset)}
      </div>
      <p class="footer-note">Use one field note at a time. Keep every story detail broad, invented, and screen-free.</p>
    </section>
    <section class="pack-page world-page">
      <p class="page-kicker">World menu</p>
      <h2>Twelve field-note worlds</h2>
      <p>Pick a world image, then turn one calm outdoor detail into a fictional story clue.</p>
      <div class="world-grid">${worldCards}</div>
    </section>
    <section class="pack-page walk-page">
      <p class="page-kicker">Walk formats</p>
      <h2>Choose the observation rhythm</h2>
      <div class="walk-grid">${source.walkFormats.map(renderWalkFormat).join('\n')}</div>
    </section>
    <section class="pack-page card-page">
      <p class="page-kicker">Take-home field cards</p>
      <h2>Finish one field detail later</h2>
      <div class="card-grid">${source.takeHomeFieldCards.map(renderFieldCard).join('\n')}</div>
      <h3>Optional share prompts</h3>
      <ul>${renderList(source.optionalSharePrompts)}</ul>
    </section>
${fieldNotes}
  </body>
</html>
`
}

function sha256File(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex')
}

function fileRecord(path, recordRoot = root) {
  return {
    path: relative(recordRoot, path),
    sha256: sha256File(path),
    size: readFileSync(path).length,
  }
}

function loadWorlds() {
  const worlds = new Map()
  for (const world of starterWorlds) {
    worlds.set(world.slug, world)
  }
  for (const file of readdirSync(worldsDir).filter((item) => /^batch1-.+\.json$/.test(item))) {
    const data = readJson(resolve(worldsDir, file))
    for (const world of data.worlds) {
      worlds.set(world.slug, world)
    }
  }
  return worlds
}

function productImagePath(slug) {
  const batch4Jpeg = resolve(root, 'public', 'images', 'plotsprout', 'batch4', `${slug}.jpg`)
  if (existsSync(batch4Jpeg)) return batch4Jpeg
  const starterJpeg = resolve(root, 'public', 'images', 'plotsprout', `${slug}.jpg`)
  if (existsSync(starterJpeg)) return starterJpeg
  return null
}

export function loadNatureWalkStoryFieldNotesKitBuildInputs() {
  const source = readJson(sourcePath)
  const product = readJson(productsPath).products.find((candidate) => candidate.slug === source.productSlug)
  if (!product) throw new Error(`Missing product record for ${source.productSlug}`)
  const worlds = loadWorlds()
  const imageMap = new Map()
  for (const slug of new Set(source.worldSlugs)) {
    if (!worlds.has(slug)) throw new Error(`Missing world record for ${slug}`)
    if (!productImagePath(slug)) throw new Error(`Missing local image for ${slug}`)
    imageMap.set(slug, `assets/${slug}.jpg`)
  }
  for (const note of source.fieldNotes) {
    if (!worlds.has(note.worldSlug)) throw new Error(`Missing field-note world record for ${note.worldSlug}`)
    if (!imageMap.has(note.worldSlug)) throw new Error(`Missing local copied image for field-note world ${note.worldSlug}`)
  }
  return {
    source,
    product,
    worlds,
    imageMap,
  }
}

function prepareBuildDirectory(paths = natureWalkBuildPaths()) {
  rmSync(paths.buildDir, { recursive: true, force: true })
  mkdirSync(paths.assetsDir, { recursive: true })
}

function copyPackAssets(source, paths = natureWalkBuildPaths()) {
  const imageMap = new Map()
  for (const slug of new Set(source.worldSlugs)) {
    const sourceImage = productImagePath(slug)
    if (!sourceImage) throw new Error(`Missing local image for ${slug}`)
    const targetName = `${slug}.jpg`
    const targetPath = resolve(paths.assetsDir, targetName)
    copyFileSync(sourceImage, targetPath)
    imageMap.set(slug, `assets/${targetName}`)
  }
  return imageMap
}

function writeReadme(source, paths = natureWalkBuildPaths()) {
  const text = [
    source.title,
    '',
    `Price point: ${source.pricePoint}`,
    `Audience: ${source.audience}`,
    `Format: ${source.sessionLength}`,
    '',
    'Files:',
    '- Nature-Walk-Story-Field-Notes-Kit.pdf',
    '- source/nature-walk-story-field-notes-kit.html',
    '- source/assets/*.jpg',
    '',
    'Fulfillment note:',
    'Place the ZIP in a hosted product only after Sam chooses the provider.',
    'Do not add a public download URL to the static site.',
    '',
  ].join('\n')
  writeFileSync(paths.readmePath, text)
}

function zipEntries(paths = natureWalkBuildPaths()) {
  const entries = [
    {
      name: 'Nature-Walk-Story-Field-Notes-Kit.pdf',
      data: readFileSync(paths.pdfPath),
    },
    {
      name: 'README.txt',
      data: readFileSync(paths.readmePath),
    },
    {
      name: 'source/nature-walk-story-field-notes-kit.html',
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

async function writePdfWithPlaywright({ htmlPath: sourceHtmlPath, pdfPath: targetPdfPath }) {
  const { chromium } = await import('playwright')
  const browser = await chromium.launch({ headless: true })
  try {
    const page = await browser.newPage({ viewport: { width: 1100, height: 1500 } })
    await page.goto(pathToFileURL(sourceHtmlPath).href, { waitUntil: 'load' })
    await page.pdf({
      path: targetPdfPath,
      format: 'Letter',
      printBackground: true,
      margin: {
        top: '0.25in',
        right: '0.25in',
        bottom: '0.25in',
        left: '0.25in',
      },
    })
  } finally {
    await browser.close()
  }
}

export async function buildNatureWalkStoryFieldNotesKit(options = {}) {
  const { source, product, worlds } = loadNatureWalkStoryFieldNotesKitBuildInputs()
  const paths = natureWalkBuildPaths(options.buildDir ?? buildDir)
  const recordRoot = options.recordRoot ?? root

  prepareBuildDirectory(paths)
  const imageMap = copyPackAssets(source, paths)
  const html = renderNatureWalkStoryFieldNotesKitHtml(source, worlds, imageMap)
  mkdirSync(dirname(paths.htmlPath), { recursive: true })
  writeFileSync(paths.htmlPath, html)
  writeReadme(source, paths)

  await (options.writePdf ?? writePdfWithPlaywright)({
    htmlPath: paths.htmlPath,
    pdfPath: paths.pdfPath,
  })

  writeStoredZip(paths.zipPath, zipEntries(paths))
  const manifest = buildProductArtifactManifest(source, {
    pdf: fileRecord(paths.pdfPath, recordRoot),
    zip: fileRecord(paths.zipPath, recordRoot),
    sourceHtml: fileRecord(paths.htmlPath, recordRoot),
    readme: fileRecord(paths.readmePath, recordRoot),
    assets: readdirSync(paths.assetsDir)
      .sort()
      .map((file) => fileRecord(resolve(paths.assetsDir, file), recordRoot)),
  })
  writeFileSync(paths.manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)

  return {
    product,
    source,
    manifest,
    paths,
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  buildNatureWalkStoryFieldNotesKit().catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}
