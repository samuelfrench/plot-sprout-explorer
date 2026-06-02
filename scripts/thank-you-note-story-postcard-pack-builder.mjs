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
const sourcePath = resolve(root, 'content', 'product-artifacts', 'thank-you-note-story-postcard-pack.json')
const productsPath = resolve(root, 'content', 'products', 'batch5-products.json')
const worldsDir = resolve(root, 'content', 'worlds')
const buildDir = resolve(root, 'product-build', 'thank-you-note-story-postcard-pack')

function thankYouBuildPaths(targetBuildDir = buildDir) {
  const sourceDir = resolve(targetBuildDir, 'source')
  return {
    buildDir: targetBuildDir,
    sourceDir,
    assetsDir: resolve(sourceDir, 'assets'),
    pdfPath: resolve(targetBuildDir, 'Thank-You-Note-Story-Postcard-Pack.pdf'),
    zipPath: resolve(targetBuildDir, 'thank-you-note-story-postcard-pack.zip'),
    htmlPath: resolve(sourceDir, 'thank-you-note-story-postcard-pack.html'),
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

function sanitizeAdultGuideLine(value) {
  return String(value)
    .replace(/\bKeep addresses? separate\./gi, 'Keep delivery details separate.')
    .replace(/\bDo not collect addresses?\./gi, 'Use role labels or a blank recipient line.')
    .replace(/\bDo not write full names?\./gi, 'Use initials or role labels.')
    .replace(/\bSkip gift prices?\./gi, 'Skip value notes.')
    .replace(/,\s*without writing private contact details\.?/gi, '.')
    .replace(
      /\bThe pack is printable and offline; it does not need accounts?, uploads?, photos?, recordings?, or public posting\./gi,
      'The pack is printable and offline; keep writing pages family-held.',
    )
    .replace(
      /\bDo not collect mailing details?, full names?, contact details?, child profiles?, family records?, or private household facts\./gi,
      'Use role labels, initials chosen at home, or blank recipient lines.',
    )
    .replace(
      /\bUse role labels, initials chosen by the family, or blank recipient lines instead of storing personal identifiers\./gi,
      'Use role labels, initials chosen by the family, or blank recipient lines.',
    )
    .replace(
      /\bRemind families that mailing, delivery, or saving the note is handled outside the printable pack\./gi,
      'Remind families that sending, delivery, or saving the note is handled outside the printable pack.',
    )
    .replace(/\s+/g, ' ')
    .trim()
}

function renderGuideCard(title, items) {
  return `<article class="guide-card"><h3>${escapeHtml(title)}</h3><ul>${renderList(items.map(sanitizeAdultGuideLine))}</ul></article>`
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

function renderSituation(situation) {
  return `
    <article class="small-card">
      <h3>${escapeHtml(situation.name)}</h3>
      <p>${escapeHtml(situation.bestFor)}</p>
      <ol>${renderList(situation.steps)}</ol>
    </article>`
}

function renderRevisionPrompt(prompt) {
  return `
    <article class="small-card">
      <p class="card-kicker">${escapeHtml(prompt.skill)}</p>
      <h3>${escapeHtml(prompt.title)}</h3>
      <p>${escapeHtml(prompt.direction)}</p>
      <p>${escapeHtml(prompt.adultLine)}</p>
    </article>`
}

function renderField(label, value) {
  return `
    <section class="field-block">
      <h3>${escapeHtml(label)}</h3>
      <p>${escapeHtml(value)}</p>
    </section>`
}

function renderPostcard(postcard, index, worlds, imageMap) {
  const world = worlds.get(postcard.worldSlug)
  if (!world) throw new Error(`Unknown Thank-You Note Story Postcard world slug: ${postcard.worldSlug}`)
  const imagePath = imageMap.get(postcard.worldSlug)
  if (!imagePath) throw new Error(`Missing Thank-You Note Story Postcard copied image for ${postcard.worldSlug}`)
  const fieldBlocks = [
    renderField('Start the thank-you note', postcard.noteStarter),
    renderField('Story bridge', postcard.storyBridge),
    renderField('Polite close', postcard.politeClose),
    renderField('Tiny drawing prompt', postcard.drawingPrompt),
    renderField('Polish the thank-you note', postcard.revisionNudge),
    renderField('Quiet option', postcard.quietOption),
  ].join('\n')

  return `
    <section class="pack-page postcard-page">
      <div class="page-kicker">Postcard ${index + 1} | Ages ${escapeHtml(postcard.ageBand)} | ${escapeHtml(postcard.thankYouSkill)}</div>
      <h2>${escapeHtml(postcard.title)}</h2>
      <figure>
        <img src="${escapeHtml(imagePath)}" alt="${escapeHtml(world.title)} illustration">
        <figcaption>${escapeHtml(world.title)}</figcaption>
      </figure>
      <p class="adult-note"><strong>Adult setup:</strong> ${escapeHtml(postcard.adultSetup)}</p>
      <p class="kid-direction">${escapeHtml(postcard.kidDirection)}</p>
      <div class="field-grid">${fieldBlocks}</div>
      <p class="take-home-line">${escapeHtml(postcard.takeHomeLine)}</p>
    </section>`
}

export function renderThankYouNoteStoryPostcardPackHtml(source, worlds, imageMap = new Map()) {
  const worldCards = source.worldSlugs
    .map((slug) => {
      const world = worlds.get(slug)
      if (!world) throw new Error(`Unknown Thank-You Note Story Postcard source world slug: ${slug}`)
      return renderWorldCard(world, imageMap.get(slug))
    })
    .join('\n')
  const postcards = source.postcards
    .map((postcard, index) => renderPostcard(postcard, index, worlds, imageMap))
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
        --line: #ccd8ce;
        --leaf: #39735c;
        --rose: #c94f66;
        --gold: #e7b84a;
        --blue: #327889;
        color: var(--ink);
        font-family: Avenir Next, Avenir, Trebuchet MS, Verdana, sans-serif;
        font-size: 9px;
        line-height: 1.11;
      }
      * { box-sizing: border-box; }
      body { margin: 0; background: var(--paper); }
      h1, h2, h3, p { margin-top: 0; }
      h1, h2 {
        font-family: Georgia, Times New Roman, serif;
        line-height: 1.02;
      }
      h1 { max-width: 11ch; font-size: 35px; }
      h2 { margin-bottom: 0.05in; font-size: 19px; }
      h3 { margin-bottom: 0.025in; font-size: 9.4px; }
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
      .cover-page {
        display: grid;
        grid-template-columns: 1fr 2.2in;
        gap: 0.22in;
        border-top: 0.16in solid var(--gold);
      }
      .guide-page { border-top: 0.16in solid var(--leaf); font-size: 7.45px; }
      .world-page { border-top: 0.16in solid var(--gold); font-size: 7.35px; }
      .situation-page { border-top: 0.16in solid var(--blue); }
      .revision-page { border-top: 0.16in solid var(--rose); }
      .postcard-page { font-size: 8.65px; }
      .page-kicker, .card-kicker, .kicker {
        color: var(--leaf);
        font-size: 7.4px;
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
      .cover-page ul, .guide-page ul, .situation-page ol, .revision-page ul {
        margin: 0;
        padding-left: 0.16in;
      }
      .cover-meta {
        display: grid;
        gap: 0.08in;
        align-content: start;
      }
      .guide-grid, .situation-grid, .revision-grid, .world-grid {
        display: grid;
        gap: 0.055in;
      }
      .guide-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.04in; }
      .situation-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .revision-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .world-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.038in; }
      .guide-card, .small-card, .world-card, .field-block {
        padding: 0.048in;
        background: rgba(255, 255, 255, 0.84);
        border: 1px solid var(--line);
      }
      .world-card img {
        width: 100%;
        aspect-ratio: 2.15 / 1;
        object-fit: cover;
        margin-bottom: 0.025in;
      }
      .world-card h3 { font-size: 7.4px; }
      .small-card p, .small-card li { margin-bottom: 0.025in; }
      .postcard-page figure {
        float: right;
        width: 1.6in;
        margin: 0 0 0.055in 0.11in;
      }
      .postcard-page figure img {
        width: 100%;
        aspect-ratio: 1.28 / 1;
        object-fit: cover;
      }
      figcaption {
        color: var(--leaf);
        font-size: 7px;
        font-weight: 900;
      }
      .adult-note, .kid-direction {
        margin-bottom: 0.05in;
        padding: 0.05in;
        background: white;
        border-left: 0.06in solid var(--gold);
      }
      .kid-direction { border-left-color: var(--leaf); }
      .field-grid {
        clear: both;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.045in;
      }
      .field-block p {
        min-height: 0.34in;
        margin-bottom: 0;
        padding-bottom: 0.02in;
        border-bottom: 1px solid rgba(57, 115, 92, 0.18);
      }
      .take-home-line {
        margin-top: 0.055in;
        padding: 0.052in;
        background: rgba(255, 255, 255, 0.86);
        border: 1px dashed var(--rose);
        color: var(--ink);
        font-weight: 700;
      }
      .footer-note {
        margin-top: 0.07in;
        font-size: 8px;
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
      <h2>Start the thank-you note</h2>
      <div class="guide-grid">
        ${renderGuideCard('Setup', source.adultGuide.setup)}
        ${renderGuideCard('Coaching moves', source.adultGuide.coachingMoves)}
        ${renderGuideCard('Privacy notes', source.adultGuide.privacyNotes)}
        ${renderGuideCard('Family handoff notes', source.adultGuide.handoff)}
        ${renderGuideCard('Reset', source.adultGuide.reset)}
      </div>
      <p class="footer-note">Use one postcard at a time. Keep every story object invented, printable, and screen-free.</p>
    </section>
    <section class="pack-page world-page">
      <p class="page-kicker">World menu</p>
      <h2>Sixteen postcard worlds</h2>
      <p>Pick a world image, then turn one thankful detail into a tiny invented story clue.</p>
      <div class="world-grid">${worldCards}</div>
    </section>
    <section class="pack-page situation-page">
      <p class="page-kicker">Writing situations</p>
      <h2>Choose the thank-you moment</h2>
      <div class="situation-grid">${source.noteSituations.map(renderSituation).join('\n')}</div>
    </section>
    <section class="pack-page revision-page">
      <p class="page-kicker">Revision tools</p>
      <h2>Polish the thank-you note</h2>
      <div class="revision-grid">${source.revisionPrompts.map(renderRevisionPrompt).join('\n')}</div>
      <h3>Optional share prompts</h3>
      <ul>${renderList(source.optionalSharePrompts)}</ul>
    </section>
${postcards}
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

export function loadThankYouNoteStoryPostcardPackBuildInputs() {
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
  for (const postcard of source.postcards) {
    if (!worlds.has(postcard.worldSlug)) throw new Error(`Missing postcard world record for ${postcard.worldSlug}`)
    if (!imageMap.has(postcard.worldSlug)) throw new Error(`Missing local copied image for postcard world ${postcard.worldSlug}`)
  }
  return {
    source,
    product,
    worlds,
    imageMap,
  }
}

function prepareBuildDirectory(paths = thankYouBuildPaths()) {
  rmSync(paths.buildDir, { recursive: true, force: true })
  mkdirSync(paths.assetsDir, { recursive: true })
}

function copyPackAssets(source, paths = thankYouBuildPaths()) {
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

function writeReadme(source, paths = thankYouBuildPaths()) {
  const text = [
    source.title,
    '',
    `Price point: ${source.pricePoint}`,
    `Audience: ${source.audience}`,
    `Format: ${source.sessionLength}`,
    '',
    'Files:',
    '- Thank-You-Note-Story-Postcard-Pack.pdf',
    '- source/thank-you-note-story-postcard-pack.html',
    '- source/assets/*.jpg',
    '',
    'Fulfillment note:',
    'Place the ZIP in a hosted product only after Sam chooses the provider.',
    'Do not add a public download URL to the static site.',
    '',
  ].join('\n')
  writeFileSync(paths.readmePath, text)
}

function zipEntries(paths = thankYouBuildPaths()) {
  const entries = [
    {
      name: 'Thank-You-Note-Story-Postcard-Pack.pdf',
      data: readFileSync(paths.pdfPath),
    },
    {
      name: 'README.txt',
      data: readFileSync(paths.readmePath),
    },
    {
      name: 'source/thank-you-note-story-postcard-pack.html',
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

export async function buildThankYouNoteStoryPostcardPack(options = {}) {
  const { source, product, worlds } = loadThankYouNoteStoryPostcardPackBuildInputs()
  const paths = thankYouBuildPaths(options.buildDir ?? buildDir)
  const recordRoot = options.recordRoot ?? root

  prepareBuildDirectory(paths)
  const imageMap = copyPackAssets(source, paths)
  const html = renderThankYouNoteStoryPostcardPackHtml(source, worlds, imageMap)
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
  buildThankYouNoteStoryPostcardPack().catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}
