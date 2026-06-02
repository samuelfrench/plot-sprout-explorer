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
import { basename, dirname, relative, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

import { writeStoredZip } from './product-artifact-policy.mjs'

const root = resolve(import.meta.dirname, '..')
const sourcePath = resolve(root, 'content', 'product-artifacts', 'rainy-day-story-quest-pack.json')
const productsPath = resolve(root, 'content', 'products', 'batch5-products.json')
const worldsDir = resolve(root, 'content', 'worlds')
const buildDir = resolve(root, 'product-build', 'rainy-day-story-quest-pack')
const sourceDir = resolve(buildDir, 'source')
const assetsDir = resolve(sourceDir, 'assets')
const pdfPath = resolve(buildDir, 'Rainy-Day-Story-Quest-Pack.pdf')
const zipPath = resolve(buildDir, 'rainy-day-story-quest-pack.zip')
const htmlPath = resolve(sourceDir, 'rainy-day-story-quest-pack.html')
const manifestPath = resolve(buildDir, 'manifest.json')
const readmePath = resolve(buildDir, 'README.txt')

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

function renderLines(lines) {
  return lines
    .map((line) => `<p class="write-line">${escapeHtml(line)}</p>`)
    .join('\n')
}

function renderList(items) {
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join('\n')
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
        <p>${escapeHtml(world.premise)}</p>
      </div>
    </article>`
}

function renderPrintablePage(page, index, worlds, imageMap) {
  const world = worlds.get(page.worldSlug)
  const imagePath = imageMap.get(page.worldSlug)
  const imageBlock =
    world && imagePath
      ? `<figure><img src="${escapeHtml(imagePath)}" alt="${escapeHtml(world.title)} illustration"><figcaption>${escapeHtml(world.title)}</figcaption></figure>`
      : ''
  const sections = page.sections
    .map(
      (section) => `
        <section class="worksheet-section">
          <h3>${escapeHtml(section.heading)}</h3>
          ${renderLines(section.lines)}
        </section>`,
    )
    .join('\n')
  const pageClasses = ['pack-page', 'worksheet-page']
  if (page.sections.length >= 4) pageClasses.push('dense-page')

  return `
    <section class="${pageClasses.join(' ')}">
      <div class="page-kicker">Page ${index + 1} | ${escapeHtml(page.type)}</div>
      <h2>${escapeHtml(page.title)}</h2>
      ${imageBlock}
      <p class="kid-direction">${escapeHtml(page.kidDirection)}</p>
      <p class="adult-note">${escapeHtml(page.adultNote)}</p>
      <div class="worksheet-sections">${sections}</div>
    </section>`
}

export function renderRainyDayPackHtml(source, worlds, imageMap = new Map()) {
  const worldIntros = source.worldSlugs
    .map((slug) => {
      const world = worlds.get(slug)
      if (!world) throw new Error(`Unknown Rainy Day world slug: ${slug}`)
      return renderWorldIntro(world, imageMap.get(slug))
    })
    .join('\n')

  const sessionFlow = source.adultGuide.sessionFlow
    .map(
      (step) => `
        <li>
          <strong>${escapeHtml(step.minutes)} min | ${escapeHtml(step.title)}:</strong>
          ${escapeHtml(step.instruction)}
        </li>`,
    )
    .join('\n')

  const printablePages = source.pages
    .map((page, index) => renderPrintablePage(page, index, worlds, imageMap))
    .join('\n')

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(source.title)}</title>
    <style>
      @page { size: Letter; margin: 0.38in; }
      :root {
        --ink: #17343a;
        --muted: #52656b;
        --paper: #fffdf6;
        --line: #9fcac4;
        --rain: #2b7f92;
        --sun: #f2c14f;
        --coral: #e96d3d;
        color: var(--ink);
        font-family: Avenir Next, Avenir, Trebuchet MS, Verdana, sans-serif;
        font-size: 14px;
        line-height: 1.35;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        background: var(--paper);
      }
      h1, h2, h3, p { margin-top: 0; }
      h1, h2 {
        font-family: Georgia, Times New Roman, serif;
        line-height: 1.02;
      }
      h1 { max-width: 12ch; font-size: 48px; }
      h2 { font-size: 28px; }
      h3 { font-size: 15px; }
      p, li { color: var(--muted); }
      img {
        display: block;
        max-width: 100%;
        border: 1px solid var(--line);
      }
      .pack-page {
        height: 9.2in;
        padding: 0.14in;
        overflow: hidden;
        page-break-after: always;
        background:
          linear-gradient(90deg, rgba(43, 127, 146, 0.08) 1px, transparent 1px),
          linear-gradient(180deg, rgba(43, 127, 146, 0.08) 1px, transparent 1px),
          var(--paper);
        background-size: 0.25in 0.25in;
        border: 2px solid var(--ink);
      }
      .cover-page {
        display: grid;
        grid-template-columns: 1fr 2.1in;
        gap: 0.25in;
        align-items: start;
      }
      .kicker, .page-kicker, .world-intro span {
        color: var(--rain);
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .badge {
        display: inline-grid;
        min-width: 0.86in;
        min-height: 0.52in;
        place-items: center;
        border: 2px solid var(--ink);
        background: white;
        color: var(--ink);
        font-size: 22px;
        font-weight: 900;
      }
      .included-grid, .world-grid, .support-grid {
        display: grid;
        gap: 0.12in;
      }
      .included-grid {
        grid-template-columns: 1fr;
      }
      .world-grid, .support-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .included-grid li, .support-grid li {
        min-height: 0.46in;
        padding: 0.08in;
        border: 1px solid var(--line);
        background: white;
        list-style: none;
      }
      .world-intro {
        display: grid;
        grid-template-columns: 1.35in 1fr;
        gap: 0.12in;
        min-height: 1.22in;
        padding: 0.1in;
        border: 1px solid var(--line);
        background: white;
      }
      .world-intro img {
        width: 1.35in;
        height: 0.78in;
        object-fit: cover;
      }
      .image-placeholder {
        width: 1.35in;
        height: 0.78in;
        border: 1px dashed var(--line);
        background: #e8f6f1;
      }
      .guide-columns {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.14in;
      }
      .guide-box, .worksheet-section, .kid-direction, .adult-note {
        padding: 0.09in;
        border: 1px solid var(--line);
        background: white;
      }
      .kid-direction {
        color: var(--ink);
        font-weight: 900;
      }
      .adult-note {
        border-color: #e5bc7c;
        background: #fff4dc;
      }
      figure {
        float: right;
        width: 1.86in;
        margin: 0 0 0.08in 0.14in;
      }
      figure img {
        width: 1.86in;
        height: 1.04in;
        object-fit: cover;
      }
      figcaption {
        color: var(--muted);
        font-size: 10px;
      }
      .worksheet-section {
        margin-top: 0.08in;
      }
      .worksheet-sections {
        clear: both;
      }
      .dense-page .worksheet-sections {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.08in;
      }
      .dense-page .worksheet-section {
        margin-top: 0;
      }
      .write-line {
        min-height: 0.2in;
        margin-bottom: 0.045in;
        padding-bottom: 0.04in;
        border-bottom: 1px solid var(--line);
        color: var(--ink);
      }
      .footer-note {
        margin-top: 0.1in;
        padding-top: 0.1in;
        border-top: 2px solid var(--sun);
        color: var(--muted);
        font-size: 11px;
      }
      .guide-page {
        font-size: 11.5px;
      }
      .guide-page h2 {
        font-size: 26px;
      }
      .guide-page h3 {
        margin-bottom: 0.04in;
      }
      .guide-page .footer-note {
        margin-top: 0.06in;
        padding-top: 0.06in;
        font-size: 10px;
      }
      .guide-page .world-grid {
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 0.06in;
      }
      .guide-page .world-intro {
        display: block;
        min-height: auto;
        padding: 0.07in;
      }
      .guide-page .world-intro img {
        display: none;
      }
      .guide-page .world-intro p {
        margin-bottom: 0;
        font-size: 10px;
        line-height: 1.22;
      }
      .guide-page .support-grid li {
        min-height: auto;
        padding: 0.055in;
        font-size: 10.5px;
        line-height: 1.22;
      }
      @media screen {
        body { padding: 24px; background: #dfeee7; }
        .pack-page {
          width: 8.5in;
          margin: 0 auto 24px;
          box-shadow: 0 18px 40px rgba(20, 31, 43, 0.18);
        }
      }
    </style>
  </head>
  <body>
    <section class="pack-page cover-page">
      <div>
        <p class="kicker">${escapeHtml(source.cover.kicker)}</p>
        <h1>${escapeHtml(source.cover.headline)}</h1>
        <p>${escapeHtml(source.cover.subhead)}</p>
        <div class="badge">${escapeHtml(source.pricePoint)}</div>
        <p><strong>Best for:</strong> ${escapeHtml(source.audience)}</p>
        <p><strong>Session:</strong> ${escapeHtml(source.sessionLength)}</p>
        <p>${escapeHtml(source.safetyNote)}</p>
      </div>
      <div>
        <h2>Inside</h2>
        <ul class="included-grid">${renderList(source.cover.included)}</ul>
      </div>
    </section>
    <section class="pack-page guide-page">
      <p class="page-kicker">Adult setup guide</p>
      <h2>Run the rainy-day session</h2>
      <div class="guide-columns">
        <div class="guide-box">
          <h3>Setup</h3>
          <ol>${renderList(source.adultGuide.setup)}</ol>
        </div>
        <div class="guide-box">
          <h3>Session flow</h3>
          <ol>${sessionFlow}</ol>
        </div>
      </div>
      <h3>World menu</h3>
      <div class="world-grid">${worldIntros}</div>
      <h3>Support moves</h3>
      <ul class="support-grid">${renderList(source.adultGuide.supportMoves)}</ul>
      <h3>Extension ideas</h3>
      <ul class="support-grid">${renderList(source.adultGuide.extensionIdeas)}</ul>
      <p class="footer-note">Use these pages offline. The pack is designed for adult-guided writing practice with no accounts, no uploads, and no public sharing.</p>
    </section>
    ${printablePages}
  </body>
</html>
`
}

function sha256File(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex')
}

function fileRecord(path) {
  return {
    path: relative(root, path),
    sha256: sha256File(path),
    size: readFileSync(path).length,
  }
}

export function buildProductArtifactManifest(source, files, options = {}) {
  return {
    batchId: source.batchId,
    generatedAt: source.generatedAt,
    productSlug: source.productSlug,
    title: source.title,
    pricePoint: source.pricePoint,
    sourcePageCount: source.pages?.length ?? source.promptCards?.length ?? source.quests?.length ?? 0,
    fulfillmentNote:
      options.fulfillmentNote ??
      'provider-upload-ready artifact: PDF plus source HTML and local image assets; checkout still requires Sam provider choice.',
    files,
  }
}

export function buildArtifactManifest(source, files) {
  return buildProductArtifactManifest(
    {
      ...source,
      batchId: source.batchId ?? '2026-06-02-batch7',
      generatedAt: source.generatedAt ?? '2026-06-02',
    },
    files,
  )
}

function loadWorlds() {
  const worlds = new Map()
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
  return null
}

function prepareBuildDirectory() {
  rmSync(buildDir, { recursive: true, force: true })
  mkdirSync(assetsDir, { recursive: true })
}

function copyPackAssets(source) {
  const imageMap = new Map()
  for (const slug of source.worldSlugs) {
    const sourceImage = productImagePath(slug)
    if (!sourceImage) continue
    const targetName = `${slug}${sourceImage.endsWith('.webp') ? '.webp' : '.jpg'}`
    const targetPath = resolve(assetsDir, targetName)
    copyFileSync(sourceImage, targetPath)
    imageMap.set(slug, `assets/${targetName}`)
  }
  return imageMap
}

function writeReadme(source) {
  const text = [
    source.title,
    '',
    `Price point: ${source.pricePoint}`,
    `Audience: ${source.audience}`,
    `Session: ${source.sessionLength}`,
    '',
    'Files:',
    '- Rainy-Day-Story-Quest-Pack.pdf',
    '- source/rainy-day-story-quest-pack.html',
    '- source/assets/*.jpg',
    '',
    'Fulfillment note:',
    'Upload the ZIP to a hosted checkout provider only after Sam chooses the provider.',
    'Do not add a public download URL to the static site.',
    '',
  ].join('\n')
  writeFileSync(readmePath, text)
}

function zipEntries() {
  const entries = [
    {
      name: 'Rainy-Day-Story-Quest-Pack.pdf',
      data: readFileSync(pdfPath),
    },
    {
      name: 'README.txt',
      data: readFileSync(readmePath),
    },
    {
      name: 'source/rainy-day-story-quest-pack.html',
      data: readFileSync(htmlPath),
    },
  ]
  for (const file of readdirSync(assetsDir).sort()) {
    entries.push({
      name: `source/assets/${file}`,
      data: readFileSync(resolve(assetsDir, file)),
    })
  }
  return entries
}

export async function buildRainyDayPack() {
  const source = readJson(sourcePath)
  const product = readJson(productsPath).products.find((candidate) => candidate.slug === source.productSlug)
  if (!product) throw new Error(`Missing product record for ${source.productSlug}`)
  const worlds = loadWorlds()

  prepareBuildDirectory()
  const imageMap = copyPackAssets(source)
  const html = renderRainyDayPackHtml(source, worlds, imageMap)
  mkdirSync(dirname(htmlPath), { recursive: true })
  writeFileSync(htmlPath, html)
  writeReadme(source)

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
  } finally {
    await browser.close()
  }

  writeStoredZip(zipPath, zipEntries())
  const manifest = buildArtifactManifest(source, {
    pdf: fileRecord(pdfPath),
    zip: fileRecord(zipPath),
    sourceHtml: fileRecord(htmlPath),
    readme: fileRecord(readmePath),
    assets: readdirSync(assetsDir)
      .sort()
      .map((file) => fileRecord(resolve(assetsDir, file))),
  })
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)

  return {
    product,
    source,
    manifest,
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  buildRainyDayPack()
    .then(({ manifest }) => {
      console.log(
        `Built ${manifest.title}: ${manifest.files.pdf.path}, ${manifest.files.zip.path}, ${manifest.files.sourceHtml.path}`,
      )
    })
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}
