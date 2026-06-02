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
const sourcePath = resolve(root, 'content', 'product-artifacts', 'museum-day-story-notebook-kit.json')
const productsPath = resolve(root, 'content', 'products', 'batch5-products.json')
const worldsDir = resolve(root, 'content', 'worlds')
const buildDir = resolve(root, 'product-build', 'museum-day-story-notebook-kit')

function museumDayBuildPaths(targetBuildDir = buildDir) {
  const sourceDir = resolve(targetBuildDir, 'source')
  return {
    buildDir: targetBuildDir,
    sourceDir,
    assetsDir: resolve(sourceDir, 'assets'),
    pdfPath: resolve(targetBuildDir, 'Museum-Day-Story-Notebook-Kit.pdf'),
    zipPath: resolve(targetBuildDir, 'museum-day-story-notebook-kit.zip'),
    htmlPath: resolve(sourceDir, 'museum-day-story-notebook-kit.html'),
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

function renderWriteLines(lines) {
  return lines.map((line) => `<p class="write-line">${escapeHtml(line)}</p>`).join('\n')
}

function renderWorldIntro(world, imagePath) {
  const image = imagePath
    ? `<img src="${escapeHtml(imagePath)}" alt="${escapeHtml(world.title)} illustration">`
    : '<div class="image-placeholder" aria-hidden="true"></div>'
  return `
    <article class="world-intro">
      ${image}
      <div>
        <span>Ages ${escapeHtml(world.ageBand)}</span>
        <h3>${escapeHtml(world.title)}</h3>
      </div>
    </article>`
}

function renderVisitFormat(format) {
  return `
    <article class="routine-card">
      <h3>${escapeHtml(format.name)}</h3>
      <p><strong>Best for:</strong> ${escapeHtml(format.bestFor)}</p>
      <ol>${renderList(format.steps)}</ol>
    </article>`
}

function renderObservationCard(card) {
  return `
    <article class="slip-card">
      <span>${escapeHtml(card.time)} | ${escapeHtml(card.skill)}</span>
      <h3>${escapeHtml(card.title)}</h3>
      <p>${escapeHtml(card.direction)}</p>
      <p>${escapeHtml(card.familyLine)}</p>
    </article>`
}

function renderNotebookPage(notebookPage, index, worlds, imageMap) {
  const world = worlds.get(notebookPage.worldSlug)
  if (!world) throw new Error(`Unknown Museum Day world slug: ${notebookPage.worldSlug}`)
  const imagePath = imageMap.get(notebookPage.worldSlug)
  if (!imagePath) throw new Error(`Missing Museum Day copied image for ${notebookPage.worldSlug}`)
  const imageBlock = `<figure><img src="${escapeHtml(imagePath)}" alt="${escapeHtml(world.title)} illustration"><figcaption>${escapeHtml(world.title)}</figcaption></figure>`
  const sections = notebookPage.pageSections
    .map(
      (section) => `
        <section class="worksheet-section">
          <h3>${escapeHtml(section.heading)}</h3>
          ${renderWriteLines(section.lines)}
        </section>`,
    )
    .join('\n')

  return `
    <section class="pack-page notebook-page">
      <div class="page-kicker">Notebook ${index + 1} | Ages ${escapeHtml(notebookPage.ageBand)}</div>
      <h2>${escapeHtml(notebookPage.title)}</h2>
      ${imageBlock}
      <p class="kid-direction">${escapeHtml(notebookPage.kidDirection)}</p>
      <p class="adult-note">${escapeHtml(notebookPage.guidePrompt)}</p>
      <div class="quest-meta">
        <span>${escapeHtml(notebookPage.notebookSkill)}</span>
        <span>${escapeHtml(notebookPage.visitFit)}</span>
      </div>
      <p><strong>Adult setup:</strong> ${escapeHtml(notebookPage.adultSetup)}</p>
      <div class="worksheet-sections">${sections}</div>
      <p class="wrap-line">${escapeHtml(notebookPage.shareLine)}</p>
      <p class="wrap-line">${escapeHtml(notebookPage.wrapUpLine)}</p>
      <p class="extension-line">${escapeHtml(notebookPage.quietOptionLine)}</p>
      <p class="take-home-line">${escapeHtml(notebookPage.takeHomePromptLine)}</p>
    </section>`
}

export function renderMuseumDayStoryNotebookKitHtml(source, worlds, imageMap = new Map()) {
  const worldIntros = source.worldSlugs
    .map((slug) => {
      const world = worlds.get(slug)
      if (!world) throw new Error(`Unknown Museum Day source world slug: ${slug}`)
      return renderWorldIntro(world, imageMap.get(slug))
    })
    .join('\n')
  const notebookPages = source.pages
    .map((page, index) => renderNotebookPage(page, index, worlds, imageMap))
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
        --ink: #17343a;
        --muted: #52656b;
        --paper: #fffdf6;
        --line: #b9d1c8;
        --teal: #2c7a78;
        --coral: #e96d3d;
        --gold: #f2c14f;
        --blue: #2b7f92;
        color: var(--ink);
        font-family: Avenir Next, Avenir, Trebuchet MS, Verdana, sans-serif;
        font-size: 10.9px;
        line-height: 1.14;
      }
      * { box-sizing: border-box; }
      body { margin: 0; background: var(--paper); }
      h1, h2, h3, p { margin-top: 0; }
      h1, h2 {
        font-family: Georgia, Times New Roman, serif;
        line-height: 1.02;
      }
      h1 { max-width: 12ch; font-size: 37px; }
      h2 { margin-bottom: 0.05in; font-size: 21px; }
      h3 { margin-bottom: 0.025in; font-size: 11.2px; }
      p, li { color: var(--muted); }
      img { display: block; max-width: 100%; border: 1px solid var(--line); }
      .pack-page {
        height: 9.24in;
        padding: 0.12in;
        overflow: hidden;
        page-break-after: always;
        background:
          linear-gradient(90deg, rgba(44, 122, 120, 0.08) 1px, transparent 1px),
          linear-gradient(180deg, rgba(44, 122, 120, 0.08) 1px, transparent 1px),
          var(--paper);
        background-size: 0.25in 0.25in;
        border: 2px solid var(--ink);
      }
      .cover-page {
        display: grid;
        grid-template-columns: 1fr 2.18in;
        gap: 0.22in;
        border-top: 0.16in solid var(--gold);
      }
      .guide-page {
        border-top: 0.16in solid var(--teal);
        font-size: 8.55px;
      }
      .world-page {
        border-top: 0.16in solid var(--gold);
        font-size: 8.45px;
      }
      .routine-page {
        border-top: 0.16in solid var(--blue);
        font-size: 8.8px;
      }
      .slip-page {
        border-top: 0.16in solid var(--coral);
        font-size: 8.9px;
      }
      .notebook-page {
        font-size: 10px;
      }
      .page-kicker, .kicker, .world-intro span, .slip-card span {
        color: var(--teal);
        font-size: 8.2px;
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
      .cover-page ul, .guide-page ul, .routine-page ul {
        margin: 0;
        padding-left: 0.18in;
      }
      .cover-meta {
        display: grid;
        gap: 0.08in;
        align-content: start;
      }
      .guide-grid, .routine-grid, .slip-grid, .world-grid {
        display: grid;
        gap: 0.07in;
      }
      .guide-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
      .routine-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .slip-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .world-grid {
        grid-template-columns: repeat(5, minmax(0, 1fr));
      }
      .guide-card, .routine-card, .slip-card, .world-intro, .worksheet-section {
        padding: 0.055in;
        background: rgba(255, 255, 255, 0.78);
        border: 1px solid var(--line);
      }
      .world-intro img {
        width: 100%;
        aspect-ratio: 1.42 / 1;
        object-fit: cover;
        margin-bottom: 0.035in;
      }
      .world-page .world-intro {
        padding: 0.045in;
      }
      .world-page .world-intro img {
        aspect-ratio: 1.7 / 1;
      }
      .notebook-page figure {
        float: right;
        width: 1.62in;
        margin: 0 0 0.06in 0.12in;
      }
      .notebook-page figure img {
        width: 100%;
        aspect-ratio: 1.25 / 1;
        object-fit: cover;
      }
      figcaption {
        color: var(--teal);
        font-size: 7.4px;
        font-weight: 900;
      }
      .kid-direction, .adult-note {
        margin-bottom: 0.055in;
        padding: 0.055in;
        background: white;
        border-left: 0.06in solid var(--gold);
      }
      .adult-note {
        border-left-color: var(--teal);
      }
      .quest-meta {
        display: grid;
        grid-template-columns: 0.96in 1fr;
        gap: 0.04in;
        margin-bottom: 0.055in;
        color: var(--ink);
        font-size: 8.2px;
        font-weight: 900;
      }
      .quest-meta span {
        padding: 0.035in;
        background: rgba(242, 193, 79, 0.2);
        border: 1px solid var(--line);
      }
      .worksheet-sections {
        clear: both;
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 0.055in;
      }
      .write-line {
        min-height: 0.21in;
        margin-bottom: 0.025in;
        padding-bottom: 0.02in;
        border-bottom: 1px solid rgba(44, 122, 120, 0.16);
      }
      .wrap-line, .extension-line, .take-home-line {
        margin-bottom: 0.035in;
        padding: 0.045in;
        background: rgba(255, 255, 255, 0.82);
        border: 1px dashed var(--line);
      }
      .extension-line { border-color: var(--blue); }
      .take-home-line { border-color: var(--coral); }
      .share-grid {
        columns: 2;
      }
      .footer-note {
        margin-top: 0.08in;
        font-size: 8.2px;
      }
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
        <p>${escapeHtml(source.safetyNote)}</p>
      </div>
      <div class="cover-meta">
        <span class="badge">${escapeHtml(source.pricePoint)}</span>
        <h2>Included</h2>
        <ul>${renderList(source.cover.included)}</ul>
      </div>
    </section>
    <section class="pack-page guide-page">
      <p class="page-kicker">Adult guide</p>
      <h2>Use the notebook day</h2>
      <div class="guide-grid">
        <article class="guide-card"><h3>Before visit</h3><ul>${renderList(source.adultGuide.beforeVisit)}</ul></article>
        <article class="guide-card"><h3>Table setup</h3><ul>${renderList(source.adultGuide.tableSetup)}</ul></article>
        <article class="guide-card"><h3>Observation to story</h3><ul>${renderList(source.adultGuide.observationToStory)}</ul></article>
        <article class="guide-card"><h3>Quiet participation</h3><ul>${renderList(source.adultGuide.quietParticipation)}</ul></article>
        <article class="guide-card"><h3>No-data use</h3><ul>${renderList(source.adultGuide.noDataUse)}</ul></article>
        <article class="guide-card"><h3>Family handoff</h3><ul>${renderList(source.adultGuide.familyHandoff)}</ul></article>
      </div>
      <p class="footer-note">Use these pages offline for adult-guided museum days. Keep finished pages in folders or send them home.</p>
    </section>
    <section class="pack-page world-page">
      <p class="page-kicker">World menu</p>
      <h2>Image-backed world menu</h2>
      <p>Pick one notebook page at a time. Each page uses one invented world image so observation details become fiction without personal data or online sharing.</p>
      <div class="world-grid">${worldIntros}</div>
    </section>
    <section class="pack-page routine-page">
      <p class="page-kicker">Visit tools</p>
      <h2>Visit formats and optional family-share prompts</h2>
      <div class="routine-grid">${source.visitFormats.map(renderVisitFormat).join('\n')}</div>
      <h3>Optional share prompts</h3>
      <ul class="share-grid">${renderList(source.optionalFamilySharePrompts)}</ul>
    </section>
    <section class="pack-page slip-page">
      <p class="page-kicker">Visit tools</p>
      <h2>Take-home observation cards</h2>
      <div class="slip-grid">${source.takeHomeObservationCards.map(renderObservationCard).join('\n')}</div>
    </section>
${notebookPages}
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
  const batch7Jpeg = resolve(root, 'public', 'images', 'plotsprout', 'batch7', `${slug}.jpg`)
  if (existsSync(batch7Jpeg)) return batch7Jpeg
  const batch4Jpeg = resolve(root, 'public', 'images', 'plotsprout', 'batch4', `${slug}.jpg`)
  if (existsSync(batch4Jpeg)) return batch4Jpeg
  const starterJpeg = resolve(root, 'public', 'images', 'plotsprout', `${slug}.jpg`)
  if (existsSync(starterJpeg)) return starterJpeg
  return null
}

export function loadMuseumDayStoryNotebookBuildInputs() {
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
  for (const page of source.pages) {
    if (!worlds.has(page.worldSlug)) throw new Error(`Missing notebook page world record for ${page.worldSlug}`)
    if (!imageMap.has(page.worldSlug)) throw new Error(`Missing local copied image for notebook page world ${page.worldSlug}`)
  }
  return {
    source,
    product,
    worlds,
    imageMap,
  }
}

function prepareBuildDirectory(paths = museumDayBuildPaths()) {
  rmSync(paths.buildDir, { recursive: true, force: true })
  mkdirSync(paths.assetsDir, { recursive: true })
}

function copyPackAssets(source, paths = museumDayBuildPaths()) {
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

function writeReadme(source, paths = museumDayBuildPaths()) {
  const text = [
    source.title,
    '',
    `Price point: ${source.pricePoint}`,
    `Audience: ${source.audience}`,
    `Format: ${source.sessionLength}`,
    '',
    'Files:',
    '- Museum-Day-Story-Notebook-Kit.pdf',
    '- source/museum-day-story-notebook-kit.html',
    '- source/assets/*.jpg',
    '',
    'Fulfillment note:',
    'Place the ZIP in a hosted product only after Sam chooses the provider.',
    'Do not add a public download URL to the static site.',
    '',
  ].join('\n')
  writeFileSync(paths.readmePath, text)
}

function zipEntries(paths = museumDayBuildPaths()) {
  const entries = [
    {
      name: 'Museum-Day-Story-Notebook-Kit.pdf',
      data: readFileSync(paths.pdfPath),
    },
    {
      name: 'README.txt',
      data: readFileSync(paths.readmePath),
    },
    {
      name: 'source/museum-day-story-notebook-kit.html',
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

export async function buildMuseumDayStoryNotebookKit(options = {}) {
  const { source, product, worlds } = loadMuseumDayStoryNotebookBuildInputs()
  const paths = museumDayBuildPaths(options.buildDir ?? buildDir)
  const recordRoot = options.recordRoot ?? root

  prepareBuildDirectory(paths)
  const imageMap = copyPackAssets(source, paths)
  const html = renderMuseumDayStoryNotebookKitHtml(source, worlds, imageMap)
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
  buildMuseumDayStoryNotebookKit().catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}
