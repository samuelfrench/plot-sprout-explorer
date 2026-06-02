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
const sourcePath = resolve(root, 'content', 'product-artifacts', 'substitute-teacher-story-station-pack.json')
const productsPath = resolve(root, 'content', 'products', 'batch5-products.json')
const worldsDir = resolve(root, 'content', 'worlds')
const buildDir = resolve(root, 'product-build', 'substitute-teacher-story-station-pack')

function substituteTeacherBuildPaths(targetBuildDir = buildDir) {
  const targetSourceDir = resolve(targetBuildDir, 'source')
  return {
    buildDir: targetBuildDir,
    sourceDir: targetSourceDir,
    assetsDir: resolve(targetSourceDir, 'assets'),
    pdfPath: resolve(targetBuildDir, 'Substitute-Teacher-Story-Station-Pack.pdf'),
    zipPath: resolve(targetBuildDir, 'substitute-teacher-story-station-pack.zip'),
    htmlPath: resolve(targetSourceDir, 'substitute-teacher-story-station-pack.html'),
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

function renderRoutine(routine) {
  return `
    <article class="routine-card">
      <h3>${escapeHtml(routine.name)}</h3>
      <p><strong>Best for:</strong> ${escapeHtml(routine.bestFor)}</p>
      <ol>${renderList(routine.steps)}</ol>
    </article>`
}

function renderFinisherCard(card) {
  return `
    <article class="finisher-card">
      <span>${escapeHtml(card.time)} | ${escapeHtml(card.writingSkill)}</span>
      <h3>${escapeHtml(card.title)}</h3>
      <p>${escapeHtml(card.direction)}</p>
    </article>`
}

function renderStationPage(station, index, worlds, imageMap) {
  const world = worlds.get(station.worldSlug)
  if (!world) throw new Error(`Unknown Substitute Teacher world slug: ${station.worldSlug}`)
  const imagePath = imageMap.get(station.worldSlug)
  const imageBlock = imagePath
    ? `<figure><img src="${escapeHtml(imagePath)}" alt="${escapeHtml(world.title)} illustration"><figcaption>${escapeHtml(world.title)}</figcaption></figure>`
    : ''
  const sections = station.pageSections
    .map(
      (section) => `
        <section class="worksheet-section">
          <h3>${escapeHtml(section.heading)}</h3>
          ${renderWriteLines(section.lines)}
        </section>`,
    )
    .join('\n')

  return `
    <section class="pack-page station-page">
      <div class="page-kicker">Station ${index + 1} | ${escapeHtml(station.stationMode)}</div>
      <h2>${escapeHtml(station.title)}</h2>
      ${imageBlock}
      <p class="kid-direction">${escapeHtml(station.kidDirection)}</p>
      <p class="adult-note">${escapeHtml(station.subNote)}</p>
      <div class="quest-meta">
        <span>Ages ${escapeHtml(station.ageBand)}</span>
        <span>${escapeHtml(station.setupMinutes)} setup</span>
        <span>${escapeHtml(station.stationUse)}</span>
      </div>
      <div class="worksheet-sections">${sections}</div>
      <p class="exit-ticket">${escapeHtml(station.exitTicketLine)}</p>
    </section>`
}

export function renderSubstituteTeacherStationPackHtml(source, worlds, imageMap = new Map()) {
  const worldIntros = source.worldSlugs
    .map((slug) => {
      const world = worlds.get(slug)
      if (!world) throw new Error(`Unknown Substitute Teacher world slug: ${slug}`)
      return renderWorldIntro(world, imageMap.get(slug))
    })
    .join('\n')

  const stations = source.stations
    .map((station, index) => renderStationPage(station, index, worlds, imageMap))
    .join('\n')

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(source.title)}</title>
    <style>
      @page { size: Letter; margin: 0.36in; }
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
        font-size: 11.8px;
        line-height: 1.22;
      }
      * { box-sizing: border-box; }
      body { margin: 0; background: var(--paper); }
      h1, h2, h3, p { margin-top: 0; }
      h1, h2 {
        font-family: Georgia, Times New Roman, serif;
        line-height: 1.02;
      }
      h1 { max-width: 12ch; font-size: 38px; }
      h2 { margin-bottom: 0.06in; font-size: 23px; }
      h3 { margin-bottom: 0.03in; font-size: 12px; }
      p, li { color: var(--muted); }
      img {
        display: block;
        max-width: 100%;
        border: 1px solid var(--line);
      }
      .pack-page {
        height: 9.24in;
        padding: 0.13in;
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
        grid-template-columns: 1fr 2.22in;
        gap: 0.22in;
        border-top: 0.16in solid var(--gold);
      }
      .guide-page {
        border-top: 0.16in solid var(--teal);
        font-size: 8.7px;
      }
      .routine-page {
        border-top: 0.16in solid var(--blue);
        font-size: 9.7px;
      }
      .finisher-page {
        border-top: 0.16in solid var(--coral);
        font-size: 10px;
      }
      .page-kicker, .kicker, .world-intro span, .finisher-card span {
        color: var(--teal);
        font-size: 9px;
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
        color: var(--ink);
        font-size: 21px;
        font-weight: 900;
      }
      .included-grid, .setup-grid, .world-grid, .routine-grid, .finisher-grid, .share-grid {
        display: grid;
        gap: 0.06in;
      }
      .included-grid { grid-template-columns: 1fr; }
      .setup-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .routine-grid, .finisher-grid, .share-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .world-grid {
        grid-template-columns: repeat(6, minmax(0, 1fr));
        gap: 0.045in;
      }
      .included-grid li, .setup-grid li, .share-grid li, .routine-card, .finisher-card,
      .world-intro, .worksheet-section, .kid-direction, .adult-note, .exit-ticket, .quest-meta {
        padding: 0.05in;
        border: 1px solid var(--line);
        background: white;
      }
      .included-grid li, .setup-grid li, .share-grid li { list-style: none; }
      .world-intro img, .world-intro p { display: none; }
      .world-intro h3 { margin: 0; font-size: 8.3px; line-height: 1.02; }
      .guide-page h2 { font-size: 20px; }
      .guide-page h3 { font-size: 10px; }
      .guide-page li { line-height: 1.12; }
      .kid-direction {
        color: var(--ink);
        font-weight: 900;
      }
      .adult-note {
        border-color: #e5bc7c;
        background: #fff4dc;
      }
      .quest-meta {
        display: grid;
        grid-template-columns: 0.7in 0.95in 1fr;
        gap: 0.04in;
        color: var(--ink);
        font-size: 9.2px;
        font-weight: 900;
      }
      figure {
        float: right;
        width: 1.58in;
        margin: 0 0 0.05in 0.1in;
      }
      figure img {
        width: 1.58in;
        height: 0.88in;
        object-fit: cover;
      }
      figcaption {
        color: var(--muted);
        font-size: 8.4px;
      }
      .write-line {
        min-height: 0.19in;
        margin-bottom: 0.03in;
        padding-bottom: 0.028in;
        border-bottom: 1px solid var(--line);
        color: var(--ink);
      }
      .exit-ticket {
        margin-top: 0.05in;
        color: var(--ink);
        font-weight: 900;
      }
      .footer-note {
        margin-top: 0.06in;
        padding-top: 0.06in;
        border-top: 2px solid var(--gold);
        color: var(--muted);
        font-size: 9.1px;
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
      <p class="page-kicker">Substitute setup</p>
      <h2>Run the substitute stations</h2>
      <div class="setup-grid">
        <div>
          <h3>Before the day</h3>
          <ol>${renderList(source.substituteGuide.beforeTheDay)}</ol>
        </div>
        <div>
          <h3>Morning setup</h3>
          <ol>${renderList(source.substituteGuide.morningSetup)}</ol>
        </div>
        <div>
          <h3>During stations</h3>
          <ol>${renderList(source.substituteGuide.duringStations)}</ol>
        </div>
        <div>
          <h3>End of day</h3>
          <ol>${renderList(source.substituteGuide.endOfDay)}</ol>
        </div>
        <div>
          <h3>Handoff</h3>
          <ol>${renderList(source.substituteGuide.handoff)}</ol>
        </div>
      </div>
      <h3>World menu</h3>
      <div class="world-grid">${worldIntros}</div>
      <p class="footer-note">Use these pages offline for adult-guided station work. Keep finished work in folders or send it home.</p>
    </section>
    <section class="pack-page routine-page">
      <p class="page-kicker">Station tools</p>
      <h2>Station routines and optional share prompts</h2>
      <div class="routine-grid">${source.stationRoutines.map(renderRoutine).join('\n')}</div>
      <h3>Optional share prompts</h3>
      <ul class="share-grid">${renderList(source.sharePrompts)}</ul>
    </section>
    <section class="pack-page finisher-page">
      <p class="page-kicker">Station tools</p>
      <h2>Early finisher cards</h2>
      <div class="finisher-grid">${source.earlyFinisherCards.map(renderFinisherCard).join('\n')}</div>
    </section>
${stations}
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

export function loadSubstituteTeacherStationBuildInputs() {
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
  return {
    source,
    product,
    worlds,
    imageMap,
  }
}

function prepareBuildDirectory(paths = substituteTeacherBuildPaths()) {
  rmSync(paths.buildDir, { recursive: true, force: true })
  mkdirSync(paths.assetsDir, { recursive: true })
}

function copyPackAssets(source, paths = substituteTeacherBuildPaths()) {
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

function writeReadme(source, paths = substituteTeacherBuildPaths()) {
  const text = [
    source.title,
    '',
    `Price point: ${source.pricePoint}`,
    `Audience: ${source.audience}`,
    `Format: ${source.sessionLength}`,
    '',
    'Files:',
    '- Substitute-Teacher-Story-Station-Pack.pdf',
    '- source/substitute-teacher-story-station-pack.html',
    '- source/assets/*.jpg',
    '',
    'Fulfillment note:',
    'Place the ZIP in a hosted product only after Sam chooses the provider.',
    'Do not add a public download URL to the static site.',
    '',
  ].join('\n')
  writeFileSync(paths.readmePath, text)
}

function zipEntries(paths = substituteTeacherBuildPaths()) {
  const entries = [
    {
      name: 'Substitute-Teacher-Story-Station-Pack.pdf',
      data: readFileSync(paths.pdfPath),
    },
    {
      name: 'README.txt',
      data: readFileSync(paths.readmePath),
    },
    {
      name: 'source/substitute-teacher-story-station-pack.html',
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

export async function buildSubstituteTeacherStationPack(options = {}) {
  const { source, product, worlds } = loadSubstituteTeacherStationBuildInputs()
  const paths = substituteTeacherBuildPaths(options.buildDir ?? buildDir)
  const recordRoot = options.recordRoot ?? root

  prepareBuildDirectory(paths)
  const imageMap = copyPackAssets(source, paths)
  const html = renderSubstituteTeacherStationPackHtml(source, worlds, imageMap)
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
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  buildSubstituteTeacherStationPack()
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
