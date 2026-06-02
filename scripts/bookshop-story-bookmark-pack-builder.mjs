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
const sourcePath = resolve(root, 'content', 'product-artifacts', 'bookshop-story-bookmark-pack.json')
const productsPath = resolve(root, 'content', 'products', 'batch5-products.json')
const worldsDir = resolve(root, 'content', 'worlds')
const buildDir = resolve(root, 'product-build', 'bookshop-story-bookmark-pack')

function bookshopBookmarkBuildPaths(targetBuildDir = buildDir) {
  const sourceDir = resolve(targetBuildDir, 'source')
  return {
    buildDir: targetBuildDir,
    sourceDir,
    assetsDir: resolve(sourceDir, 'assets'),
    pdfPath: resolve(targetBuildDir, 'Bookshop-Story-Bookmark-Pack.pdf'),
    zipPath: resolve(targetBuildDir, 'bookshop-story-bookmark-pack.zip'),
    htmlPath: resolve(sourceDir, 'bookshop-story-bookmark-pack.html'),
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

function renderBookmarkFormat(format) {
  return `
    <article class="small-card">
      <h3>${escapeHtml(format.name)}</h3>
      <p>${escapeHtml(format.bestFor)}</p>
      <ol>${renderList(format.steps)}</ol>
    </article>`
}

function renderBookmarkSlip(slip) {
  return `
    <article class="bookmark-slip">
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

function renderBookmark(bookmark, index, worlds, imageMap) {
  const world = worlds.get(bookmark.worldSlug)
  if (!world) throw new Error(`Unknown Bookshop Story Bookmark world slug: ${bookmark.worldSlug}`)
  const imagePath = imageMap.get(bookmark.worldSlug)
  if (!imagePath) throw new Error(`Missing Bookshop Story Bookmark copied image for ${bookmark.worldSlug}`)
  const fields = [
    renderField('Front prompt', bookmark.bookmarkFrontPrompt),
    renderField('Back prompt', bookmark.bookmarkBackPrompt),
    renderField('Story seed', bookmark.storySeedPrompt),
    renderField('First line path', bookmark.firstLinePath),
    renderField('Revision nudge', bookmark.revisionNudge),
    renderField('Quiet option', bookmark.quietOptionLine),
  ].join('\n')

  return `
    <section class="pack-page bookmark-page">
      <div class="page-kicker">Paper Bookmark ${index + 1} | Ages ${escapeHtml(bookmark.ageBand)} | ${escapeHtml(bookmark.bookmarkSkill)}</div>
      <h2>${escapeHtml(bookmark.title)}</h2>
      <figure>
        <img src="${escapeHtml(imagePath)}" alt="${escapeHtml(world.title)} illustration">
        <figcaption>${escapeHtml(world.title)}</figcaption>
      </figure>
      <p class="adult-note"><strong>Adult setup:</strong> ${escapeHtml(bookmark.adultSetup)}</p>
      <p class="kid-direction">${escapeHtml(bookmark.kidDirection)}</p>
      <div class="field-grid">${fields}</div>
      <p class="take-home-line">${escapeHtml(bookmark.takeHomeLine)}</p>
    </section>`
}

export function renderBookshopStoryBookmarkPackHtml(source, worlds, imageMap = new Map()) {
  const worldCards = source.worldSlugs
    .map((slug) => {
      const world = worlds.get(slug)
      if (!world) throw new Error(`Unknown Bookshop Story Bookmark source world slug: ${slug}`)
      return renderWorldCard(world, imageMap.get(slug))
    })
    .join('\n')
  const bookmarks = source.bookmarks
    .map((bookmark, index) => renderBookmark(bookmark, index, worlds, imageMap))
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
      .bookmark-page { font-size: 7.52px; }
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
      .guide-card, .small-card, .world-card, .bookmark-slip, .field-block {
        padding: 0.04in;
        background: rgba(255, 255, 255, 0.86);
        border: 1px solid var(--line);
      }
      .world-card img { width: 100%; aspect-ratio: 2.15 / 1; object-fit: cover; margin-bottom: 0.022in; }
      .world-card h3 { font-size: 7.1px; }
      .small-card p, .small-card li, .bookmark-slip p { margin-bottom: 0.022in; }
      .bookmark-page figure { float: right; width: 1.34in; margin: 0 0 0.05in 0.09in; }
      .bookmark-page figure img { width: 100%; aspect-ratio: 1.28 / 1; object-fit: cover; }
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
      <h2>Shelf-clue story coaching</h2>
      <div class="guide-grid">
        ${renderGuideCard('Before the session', source.adultGuide.beforeSession)}
        ${renderGuideCard('Bookmark setup', source.adultGuide.bookmarkSetup)}
        ${renderGuideCard('Shelf-clue story coaching', source.adultGuide.shelfStoryCoaching)}
        ${renderGuideCard('Privacy and safety notes', source.adultGuide.privacyAndSafetyNotes)}
        ${renderGuideCard('Family handoff', source.adultGuide.familyHandoff)}
        ${renderGuideCard('Reset', source.adultGuide.reset)}
      </div>
      <p class="footer-note">Use one paper bookmark at a time. Keep every choice broad, invented, and screen-free.</p>
    </section>
    <section class="pack-page world-page">
      <p class="page-kicker">World menu</p>
      <h2>Sixteen bookmark worlds</h2>
      <p>Pick a world image, then turn one invented shelf clue into a story start.</p>
      <div class="world-grid">${worldCards}</div>
    </section>
    <section class="pack-page format-page">
      <p class="page-kicker">Bookmark formats</p>
      <h2>Choose the paper bookmark rhythm</h2>
      <div class="format-grid">${source.bookmarkFormats.map(renderBookmarkFormat).join('\n')}</div>
    </section>
    <section class="pack-page slip-page">
      <p class="page-kicker">Take-home bookmark slips</p>
      <h2>Finish one story clue later</h2>
      <div class="slip-grid">${source.takeHomeBookmarkSlips.map(renderBookmarkSlip).join('\n')}</div>
      <h3>Optional share prompts</h3>
      <ul>${renderList(source.optionalSharePrompts)}</ul>
    </section>
${bookmarks}
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

export function loadBookshopStoryBookmarkPackBuildInputs() {
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
  for (const bookmark of source.bookmarks) {
    if (!worlds.has(bookmark.worldSlug)) throw new Error(`Missing bookmark world record for ${bookmark.worldSlug}`)
    if (!imageMap.has(bookmark.worldSlug)) throw new Error(`Missing local copied image for bookmark world ${bookmark.worldSlug}`)
  }
  return {
    source,
    product,
    worlds,
    imageMap,
  }
}

function prepareBuildDirectory(paths = bookshopBookmarkBuildPaths()) {
  rmSync(paths.buildDir, { recursive: true, force: true })
  mkdirSync(paths.assetsDir, { recursive: true })
}

function copyPackAssets(source, paths = bookshopBookmarkBuildPaths()) {
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

function writeReadme(source, paths = bookshopBookmarkBuildPaths()) {
  const text = [
    source.title,
    '',
    `Price point: ${source.pricePoint}`,
    `Audience: ${source.audience}`,
    `Format: ${source.sessionLength}`,
    '',
    'Files:',
    '- Bookshop-Story-Bookmark-Pack.pdf',
    '- source/bookshop-story-bookmark-pack.html',
    '- source/assets/*.jpg',
    '',
    'Fulfillment note:',
    'Place the ZIP in a hosted product only after Sam chooses the provider.',
    'Do not add a public download URL to the static site.',
    '',
  ].join('\n')
  writeFileSync(paths.readmePath, text)
}

function zipEntries(paths = bookshopBookmarkBuildPaths()) {
  const entries = [
    {
      name: 'Bookshop-Story-Bookmark-Pack.pdf',
      data: readFileSync(paths.pdfPath),
    },
    {
      name: 'README.txt',
      data: readFileSync(paths.readmePath),
    },
    {
      name: 'source/bookshop-story-bookmark-pack.html',
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

export async function buildBookshopStoryBookmarkPack(options = {}) {
  const { source, product, worlds } = loadBookshopStoryBookmarkPackBuildInputs()
  const paths = bookshopBookmarkBuildPaths(options.buildDir ?? buildDir)
  const recordRoot = options.recordRoot ?? root

  prepareBuildDirectory(paths)
  const imageMap = copyPackAssets(source, paths)
  const html = renderBookshopStoryBookmarkPackHtml(source, worlds, imageMap)
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
  buildBookshopStoryBookmarkPack().catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}
