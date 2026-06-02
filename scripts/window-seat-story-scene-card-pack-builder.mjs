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
const sourcePath = resolve(root, 'content', 'product-artifacts', 'window-seat-story-scene-card-pack.json')
const productsPath = resolve(root, 'content', 'products', 'batch5-products.json')
const worldsDir = resolve(root, 'content', 'worlds')
const buildDir = resolve(root, 'product-build', 'window-seat-story-scene-card-pack')

function windowSeatSceneBuildPaths(targetBuildDir = buildDir) {
  const sourceDir = resolve(targetBuildDir, 'source')
  return {
    buildDir: targetBuildDir,
    sourceDir,
    assetsDir: resolve(sourceDir, 'assets'),
    pdfPath: resolve(targetBuildDir, 'Window-Seat-Story-Scene-Card-Pack.pdf'),
    zipPath: resolve(targetBuildDir, 'window-seat-story-scene-card-pack.zip'),
    htmlPath: resolve(sourceDir, 'window-seat-story-scene-card-pack.html'),
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

function renderCardFormat(format) {
  return `
    <article class="small-card">
      <h3>${escapeHtml(format.name)}</h3>
      <p>${escapeHtml(format.bestFor)}</p>
      <ol>${renderList(format.steps)}</ol>
    </article>`
}

function renderCardSlip(slip) {
  return `
    <article class="card-slip">
      <p class="card-kicker">${escapeHtml(slip.time)} | ${escapeHtml(slip.skill)}</p>
      <h3>${escapeHtml(slip.title)}</h3>
      <p>${escapeHtml(slip.direction)}</p>
      <p>${escapeHtml(slip.familyLine)}</p>
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
  if (!world) throw new Error(`Unknown Window Seat Story Scene Card world slug: ${card.worldSlug}`)
  const imagePath = imageMap.get(card.worldSlug)
  if (!imagePath) throw new Error(`Missing Window Seat Story Scene Card copied image for ${card.worldSlug}`)
  const fields = [
    renderField('Scene front', card.sceneFrontPrompt),
    renderField('Scene back', card.sceneBackPrompt),
    renderField('Story seed', card.storySeedPrompt),
    renderField('First line path', card.firstLinePath),
    renderField('Revision nudge', card.revisionNudge),
    renderField('Quiet option', card.quietOptionLine),
  ].join('\n')

  return `
    <section class="pack-page scene-card-page">
      <div class="page-kicker">Scene Card ${index + 1} | Ages ${escapeHtml(card.ageBand)} | ${escapeHtml(card.sceneSkill)}</div>
      <h2>${escapeHtml(card.title)}</h2>
      <figure>
        <img src="${escapeHtml(imagePath)}" alt="${escapeHtml(world.title)} illustration">
        <figcaption>${escapeHtml(world.title)}</figcaption>
      </figure>
      <p class="adult-note"><strong>Adult setup:</strong> ${escapeHtml(card.adultSetup)}</p>
      <p class="kid-direction">${escapeHtml(card.kidDirection)}</p>
      <div class="field-grid">${fields}</div>
      <p class="take-home-line">${escapeHtml(card.takeHomeLine)}</p>
    </section>`
}

export function renderWindowSeatStorySceneCardPackHtml(source, worlds, imageMap = new Map()) {
  const worldCards = source.worldSlugs
    .map((slug) => {
      const world = worlds.get(slug)
      if (!world) throw new Error(`Unknown Window Seat Story Scene Card source world slug: ${slug}`)
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
        --ink: #25313a;
        --muted: #59636a;
        --paper: #fffdf8;
        --line: #d9cfbc;
        --plum: #7d496c;
        --green: #3f715f;
        --gold: #d2a84a;
        --blue: #3f6f93;
        color: var(--ink);
        font-family: Avenir Next, Avenir, Trebuchet MS, Verdana, sans-serif;
        font-size: 8.03px;
        line-height: 1.08;
      }
      * { box-sizing: border-box; }
      body { margin: 0; background: var(--paper); }
      h1, h2, h3, p { margin-top: 0; }
      h1, h2 { font-family: Georgia, Times New Roman, serif; line-height: 1.02; }
      h1 { max-width: 12ch; font-size: 32px; }
      h2 { margin-bottom: 0.05in; font-size: 17.4px; }
      h3 { margin-bottom: 0.025in; font-size: 8.55px; }
      p, li { color: var(--muted); }
      img { display: block; max-width: 100%; border: 1px solid var(--line); }
      .pack-page {
        height: 9.24in;
        padding: 0.11in;
        overflow: hidden;
        page-break-after: always;
        background:
          linear-gradient(90deg, rgba(63, 113, 95, 0.08) 1px, transparent 1px),
          linear-gradient(180deg, rgba(125, 73, 108, 0.07) 1px, transparent 1px),
          var(--paper);
        background-size: 0.25in 0.25in;
        border: 2px solid var(--ink);
      }
      .cover-page { display: grid; grid-template-columns: 1fr 2.05in; gap: 0.2in; border-top: 0.16in solid var(--plum); }
      .guide-page { border-top: 0.16in solid var(--green); font-size: 6.72px; }
      .world-page { border-top: 0.16in solid var(--gold); font-size: 6.82px; }
      .format-page { border-top: 0.16in solid var(--blue); font-size: 7.05px; }
      .slip-page { border-top: 0.16in solid var(--plum); font-size: 6.9px; }
      .scene-card-page { font-size: 7.52px; }
      .page-kicker, .card-kicker, .kicker {
        color: var(--green);
        font-size: 6.62px;
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
      .cover-meta, .guide-grid, .world-grid, .format-grid, .slip-grid { display: grid; gap: 0.045in; }
      .guide-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.032in; }
      .world-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.034in; }
      .format-grid, .slip-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.04in; }
      .guide-card, .small-card, .world-card, .card-slip, .field-block {
        padding: 0.04in;
        background: rgba(255, 255, 255, 0.86);
        border: 1px solid var(--line);
      }
      .world-card img { width: 100%; aspect-ratio: 2.15 / 1; object-fit: cover; margin-bottom: 0.022in; }
      .world-card h3 { font-size: 7.1px; }
      .small-card p, .small-card li, .card-slip p { margin-bottom: 0.022in; }
      .scene-card-page figure { float: right; width: 1.34in; margin: 0 0 0.05in 0.09in; }
      .scene-card-page figure img { width: 100%; aspect-ratio: 1.28 / 1; object-fit: cover; }
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
        min-height: 0.285in;
        margin-bottom: 0;
        padding-bottom: 0.018in;
        border-bottom: 1px solid rgba(63, 113, 95, 0.18);
      }
      .take-home-line {
        margin-top: 0.047in;
        padding: 0.045in;
        background: rgba(255, 255, 255, 0.86);
        border: 1px dashed var(--plum);
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
      <h2>Scene story coaching</h2>
      <div class="guide-grid">
        ${renderGuideCard('Before the session', source.adultGuide.beforeSession)}
        ${renderGuideCard('Window-seat setup', source.adultGuide.windowSeatSetup)}
        ${renderGuideCard('Scene story coaching', source.adultGuide.sceneStoryCoaching)}
        ${renderGuideCard('Privacy and safety notes', source.adultGuide.privacyAndSafetyNotes)}
        ${renderGuideCard('Family handoff', source.adultGuide.familyHandoff)}
        ${renderGuideCard('Reset', source.adultGuide.reset)}
      </div>
      <p class="footer-note">Use one paper card at a time. Keep every choice broad, invented, and screen-free.</p>
    </section>
    <section class="pack-page world-page">
      <p class="page-kicker">World menu</p>
      <h2>Sixteen scene-card worlds</h2>
      <p>Pick a world image, then turn one invented scene clue into a story start.</p>
      <div class="world-grid">${worldCards}</div>
    </section>
    <section class="pack-page format-page">
      <p class="page-kicker">Scene routines</p>
      <h2>Choose the paper scene rhythm</h2>
      <div class="format-grid">${source.sceneRoutines.map(renderCardFormat).join('\n')}</div>
    </section>
    <section class="pack-page slip-page">
      <p class="page-kicker">Take-home scene slips</p>
      <h2>Finish one story clue later</h2>
      <div class="slip-grid">${source.takeHomeSceneSlips.map(renderCardSlip).join('\n')}</div>
      <h3>Optional share prompts</h3>
      <ul>${renderList(source.optionalSharePrompts)}</ul>
    </section>
${cards}
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

const stablePdfDate = "D:20260602000000+00'00'"

function normalizePdfDateMetadata(pdfPath) {
  const original = readFileSync(pdfPath, 'latin1')
  const normalized = original.replaceAll(
    /\/(CreationDate|ModDate)\s*\(([^)]*)\)/g,
    (_match, label, value) => {
      if (value.length !== stablePdfDate.length) {
        throw new Error(`Cannot normalize PDF ${label}; unexpected date metadata length ${value.length}.`)
      }
      return `/${label} (${stablePdfDate})`
    },
  )
  if (normalized !== original) {
    writeFileSync(pdfPath, Buffer.from(normalized, 'latin1'))
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

export function loadWindowSeatStorySceneCardPackBuildInputs() {
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
  for (const card of source.cards) {
    if (!worlds.has(card.worldSlug)) throw new Error(`Missing card world record for ${card.worldSlug}`)
    if (!imageMap.has(card.worldSlug)) throw new Error(`Missing local copied image for card world ${card.worldSlug}`)
  }
  return {
    source,
    product,
    worlds,
    imageMap,
  }
}

function prepareBuildDirectory(paths = windowSeatSceneBuildPaths()) {
  rmSync(paths.buildDir, { recursive: true, force: true })
  mkdirSync(paths.assetsDir, { recursive: true })
}

function copyPackAssets(source, paths = windowSeatSceneBuildPaths()) {
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

function writeReadme(source, paths = windowSeatSceneBuildPaths()) {
  const text = [
    source.title,
    '',
    `Price point: ${source.pricePoint}`,
    `Audience: ${source.audience}`,
    `Format: ${source.sessionLength}`,
    '',
    'Files:',
    '- Window-Seat-Story-Scene-Card-Pack.pdf',
    '- source/window-seat-story-scene-card-pack.html',
    '- source/assets/*.jpg',
    '',
    'Fulfillment note:',
    'Place the ZIP in a hosted product only after Sam chooses the provider.',
    'Do not add a public download URL to the static site.',
    '',
  ].join('\n')
  writeFileSync(paths.readmePath, text)
}

function zipEntries(paths = windowSeatSceneBuildPaths()) {
  const entries = [
    {
      name: 'Window-Seat-Story-Scene-Card-Pack.pdf',
      data: readFileSync(paths.pdfPath),
    },
    {
      name: 'README.txt',
      data: readFileSync(paths.readmePath),
    },
    {
      name: 'source/window-seat-story-scene-card-pack.html',
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
    normalizePdfDateMetadata(targetPdfPath)
  } finally {
    await browser.close()
  }
}

export async function buildWindowSeatStorySceneCardPack(options = {}) {
  const { source, product, worlds } = loadWindowSeatStorySceneCardPackBuildInputs()
  const paths = windowSeatSceneBuildPaths(options.buildDir ?? buildDir)
  const recordRoot = options.recordRoot ?? root

  prepareBuildDirectory(paths)
  const imageMap = copyPackAssets(source, paths)
  const html = renderWindowSeatStorySceneCardPackHtml(source, worlds, imageMap)
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

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  buildWindowSeatStorySceneCardPack().catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}
