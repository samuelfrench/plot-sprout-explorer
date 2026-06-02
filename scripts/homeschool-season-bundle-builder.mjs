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

const root = resolve(import.meta.dirname, '..')
const sourcePath = resolve(root, 'content', 'product-artifacts', 'homeschool-season-story-bundle.json')
const productsPath = resolve(root, 'content', 'products', 'batch5-products.json')
const worldsDir = resolve(root, 'content', 'worlds')
const buildDir = resolve(root, 'product-build', 'homeschool-season-story-bundle')
const sourceDir = resolve(buildDir, 'source')
const assetsDir = resolve(sourceDir, 'assets')
const pdfPath = resolve(buildDir, 'Homeschool-Season-Story-Bundle.pdf')
const zipPath = resolve(buildDir, 'homeschool-season-story-bundle.zip')
const htmlPath = resolve(sourceDir, 'homeschool-season-story-bundle.html')
const manifestPath = resolve(buildDir, 'manifest.json')
const readmePath = resolve(buildDir, 'README.txt')

const seasonLabels = {
  fall: 'Fall',
  winter: 'Winter',
  spring: 'Spring',
  summer: 'Summer',
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

function renderLines(lines) {
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
        <p>${escapeHtml(world.premise)}</p>
      </div>
    </article>`
}

function renderQuestPage(page, index, worlds, imageMap) {
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
  const pageClasses = ['pack-page', 'quest-page', `${page.season}-page`]
  if (page.sections.length >= 4) pageClasses.push('dense-page')

  return `
    <section class="${pageClasses.join(' ')}">
      <div class="page-kicker">Quest ${index + 1} | ${escapeHtml(seasonLabels[page.season] ?? page.season)} | ${escapeHtml(page.type)}</div>
      <h2>${escapeHtml(page.title)}</h2>
      ${imageBlock}
      <p class="kid-direction">${escapeHtml(page.kidDirection)}</p>
      <p class="adult-note">${escapeHtml(page.adultNote)}</p>
      <div class="worksheet-sections">${sections}</div>
    </section>`
}

export function renderSeasonBundleHtml(source, worlds, imageMap = new Map()) {
  const worldIntros = source.worldSlugs
    .map((slug) => {
      const world = worlds.get(slug)
      if (!world) throw new Error(`Unknown Homeschool Season world slug: ${slug}`)
      return renderWorldIntro(world, imageMap.get(slug))
    })
    .join('\n')

  const seasonPlan = source.adultGuide.seasonPlan
    .map(
      (season) => `
        <li>
          <strong>${escapeHtml(seasonLabels[season.season] ?? season.season)}:</strong>
          ${escapeHtml(season.focus)}
        </li>`,
    )
    .join('\n')

  const printablePages = source.pages
    .map((page, index) => renderQuestPage(page, index, worlds, imageMap))
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
        --ink: #18343a;
        --muted: #52656b;
        --paper: #fffdf6;
        --line: #b7d4cf;
        --leaf: #2c7a78;
        --gold: #f2c14f;
        --coral: #ec6f3f;
        --berry: #c64c7a;
        color: var(--ink);
        font-family: Avenir Next, Avenir, Trebuchet MS, Verdana, sans-serif;
        font-size: 13.5px;
        line-height: 1.32;
      }
      * { box-sizing: border-box; }
      body { margin: 0; background: var(--paper); }
      h1, h2, h3, p { margin-top: 0; }
      h1, h2 {
        font-family: Georgia, Times New Roman, serif;
        line-height: 1.02;
      }
      h1 { max-width: 12ch; font-size: 45px; }
      h2 { font-size: 25px; }
      h3 { margin-bottom: 0.04in; font-size: 14px; }
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
          linear-gradient(90deg, rgba(44, 122, 120, 0.08) 1px, transparent 1px),
          linear-gradient(180deg, rgba(44, 122, 120, 0.08) 1px, transparent 1px),
          var(--paper);
        background-size: 0.25in 0.25in;
        border: 2px solid var(--ink);
      }
      .cover-page {
        display: grid;
        grid-template-columns: 1fr 2.2in;
        gap: 0.25in;
        align-items: start;
        border-top: 0.16in solid var(--gold);
      }
      .guide-page {
        border-top: 0.16in solid var(--leaf);
        font-size: 11.4px;
      }
      .kicker, .page-kicker, .world-intro span {
        color: var(--leaf);
        font-size: 10.5px;
        font-weight: 900;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .badge {
        display: inline-grid;
        min-width: 0.92in;
        min-height: 0.52in;
        place-items: center;
        border: 2px solid var(--ink);
        background: white;
        color: var(--ink);
        font-size: 22px;
        font-weight: 900;
      }
      .included-grid, .support-grid, .season-grid, .world-grid {
        display: grid;
        gap: 0.08in;
      }
      .included-grid { grid-template-columns: 1fr; }
      .support-grid, .season-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .world-grid { grid-template-columns: repeat(6, minmax(0, 1fr)); }
      .included-grid li, .support-grid li, .season-grid li {
        min-height: 0.36in;
        padding: 0.06in;
        border: 1px solid var(--line);
        background: white;
        list-style: none;
      }
      .world-intro {
        min-height: auto;
        padding: 0.045in;
        border: 1px solid var(--line);
        background: white;
      }
      .world-intro img {
        display: none;
      }
      .world-intro p {
        display: none;
      }
      .world-intro h3 {
        margin: 0;
        font-size: 9.4px;
        line-height: 1.06;
      }
      .guide-columns {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.12in;
      }
      .guide-box, .worksheet-section, .kid-direction, .adult-note {
        padding: 0.08in;
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
        width: 1.72in;
        margin: 0 0 0.06in 0.12in;
      }
      figure img {
        width: 1.72in;
        height: 0.96in;
        object-fit: cover;
      }
      figcaption {
        color: var(--muted);
        font-size: 9.6px;
      }
      .worksheet-section {
        margin-top: 0.07in;
      }
      .worksheet-sections {
        clear: both;
      }
      .dense-page .worksheet-sections {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.07in;
      }
      .dense-page .worksheet-section {
        margin-top: 0;
      }
      .write-line {
        min-height: 0.19in;
        margin-bottom: 0.04in;
        padding-bottom: 0.035in;
        border-bottom: 1px solid var(--line);
        color: var(--ink);
      }
      .fall-page { border-top: 0.16in solid var(--coral); }
      .winter-page { border-top: 0.16in solid #2b7f92; }
      .spring-page { border-top: 0.16in solid var(--leaf); }
      .summer-page { border-top: 0.16in solid var(--gold); }
      .footer-note {
        margin-top: 0.08in;
        padding-top: 0.08in;
        border-top: 2px solid var(--gold);
        color: var(--muted);
        font-size: 10px;
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
        <p><strong>Format:</strong> ${escapeHtml(source.sessionLength)}</p>
        <p>${escapeHtml(source.safetyNote)}</p>
      </div>
      <div>
        <h2>Inside</h2>
        <ul class="included-grid">${renderList(source.cover.included)}</ul>
      </div>
    </section>
    <section class="pack-page guide-page">
      <p class="page-kicker">Adult setup guide</p>
      <h2>Run the year in small sessions</h2>
      <div class="guide-columns">
        <div class="guide-box">
          <h3>Setup</h3>
          <ol>${renderList(source.adultGuide.setup)}</ol>
        </div>
        <div class="guide-box">
          <h3>Season plan</h3>
          <ol class="season-grid">${seasonPlan}</ol>
        </div>
      </div>
      <h3>World menu</h3>
      <div class="world-grid">${worldIntros}</div>
      <h3>Support moves</h3>
      <ul class="support-grid">${renderList(source.adultGuide.supportMoves)}</ul>
      <h3>Extension ideas</h3>
      <ul class="support-grid">${renderList(source.adultGuide.extensionIdeas)}</ul>
      <p class="footer-note">Use these pages offline. The bundle is designed for adult-guided writing practice with no accounts, no uploads, and no public sharing.</p>
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
  const starterJpeg = resolve(root, 'public', 'images', 'plotsprout', `${slug}.jpg`)
  if (existsSync(starterJpeg)) return starterJpeg
  return null
}

function prepareBuildDirectory() {
  rmSync(buildDir, { recursive: true, force: true })
  mkdirSync(assetsDir, { recursive: true })
}

function copyPackAssets(source) {
  const imageMap = new Map()
  for (const slug of new Set(source.worldSlugs)) {
    const sourceImage = productImagePath(slug)
    if (!sourceImage) continue
    const targetName = `${slug}.jpg`
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
    `Format: ${source.sessionLength}`,
    '',
    'Files:',
    '- Homeschool-Season-Story-Bundle.pdf',
    '- source/homeschool-season-story-bundle.html',
    '- source/assets/*.jpg',
    '',
    'Fulfillment note:',
    'Upload the ZIP to a hosted provider only after Sam chooses the provider.',
    'Do not add a public download URL to the static site.',
    '',
  ].join('\n')
  writeFileSync(readmePath, text)
}

function zipEntries() {
  const entries = [
    {
      name: 'Homeschool-Season-Story-Bundle.pdf',
      data: readFileSync(pdfPath),
    },
    {
      name: 'README.txt',
      data: readFileSync(readmePath),
    },
    {
      name: 'source/homeschool-season-story-bundle.html',
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

export async function buildHomeschoolSeasonBundle() {
  const source = readJson(sourcePath)
  const product = readJson(productsPath).products.find((candidate) => candidate.slug === source.productSlug)
  if (!product) throw new Error(`Missing product record for ${source.productSlug}`)
  const worlds = loadWorlds()

  prepareBuildDirectory()
  const imageMap = copyPackAssets(source)
  const html = renderSeasonBundleHtml(source, worlds, imageMap)
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
  const manifest = buildProductArtifactManifest(source, {
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
  buildHomeschoolSeasonBundle()
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
