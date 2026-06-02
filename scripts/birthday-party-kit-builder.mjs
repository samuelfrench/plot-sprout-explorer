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
const sourcePath = resolve(root, 'content', 'product-artifacts', 'birthday-party-story-quest-kit.json')
const productsPath = resolve(root, 'content', 'products', 'batch5-products.json')
const worldsDir = resolve(root, 'content', 'worlds')
const buildDir = resolve(root, 'product-build', 'birthday-party-story-quest-kit')

function birthdayBuildPaths(targetBuildDir = buildDir) {
  const targetSourceDir = resolve(targetBuildDir, 'source')
  return {
    buildDir: targetBuildDir,
    sourceDir: targetSourceDir,
    assetsDir: resolve(targetSourceDir, 'assets'),
    pdfPath: resolve(targetBuildDir, 'Birthday-Party-Story-Quest-Kit.pdf'),
    zipPath: resolve(targetBuildDir, 'birthday-party-story-quest-kit.zip'),
    htmlPath: resolve(targetSourceDir, 'birthday-party-story-quest-kit.html'),
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

function renderExtension(activity) {
  return `
    <article class="extension-card">
      <span>${escapeHtml(activity.time)} | ${escapeHtml(activity.writingSkill)}</span>
      <h3>${escapeHtml(activity.title)}</h3>
      <p>${escapeHtml(activity.direction)}</p>
    </article>`
}

function renderQuestPage(quest, index, worlds, imageMap) {
  const world = worlds.get(quest.worldSlug)
  if (!world) throw new Error(`Unknown Birthday Party world slug: ${quest.worldSlug}`)
  const imagePath = imageMap.get(quest.worldSlug)
  const imageBlock = imagePath
    ? `<figure><img src="${escapeHtml(imagePath)}" alt="${escapeHtml(world.title)} illustration"><figcaption>${escapeHtml(world.title)}</figcaption></figure>`
    : ''
  const sections = quest.pageSections
    .map(
      (section) => `
        <section class="worksheet-section">
          <h3>${escapeHtml(section.heading)}</h3>
          ${renderWriteLines(section.lines)}
        </section>`,
    )
    .join('\n')

  return `
    <section class="pack-page quest-page">
      <div class="page-kicker">Party quest ${index + 1} | ${escapeHtml(quest.groupMode)}</div>
      <h2>${escapeHtml(quest.title)}</h2>
      ${imageBlock}
      <p class="kid-direction">${escapeHtml(quest.kidDirection)}</p>
      <p class="adult-note">${escapeHtml(quest.adultNote)}</p>
      <div class="quest-meta">
        <span>Ages ${escapeHtml(quest.ageBand)}</span>
        <span>${escapeHtml(quest.setupMinutes)} setup</span>
        <span>${escapeHtml(quest.partyUse)}</span>
      </div>
      <div class="worksheet-sections">${sections}</div>
      <p class="take-home">${escapeHtml(quest.takeHomeLine)}</p>
    </section>`
}

export function renderBirthdayPartyKitHtml(source, worlds, imageMap = new Map()) {
  const worldIntros = source.worldSlugs
    .map((slug) => {
      const world = worlds.get(slug)
      if (!world) throw new Error(`Unknown Birthday Party world slug: ${slug}`)
      return renderWorldIntro(world, imageMap.get(slug))
    })
    .join('\n')

  const quests = source.quests
    .map((quest, index) => renderQuestPage(quest, index, worlds, imageMap))
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
        --line: #b6d4cf;
        --teal: #2c7a78;
        --coral: #ec6f3f;
        --gold: #f2c14f;
        --blue: #2b7f92;
        color: var(--ink);
        font-family: Avenir Next, Avenir, Trebuchet MS, Verdana, sans-serif;
        font-size: 12px;
        line-height: 1.24;
      }
      * { box-sizing: border-box; }
      body { margin: 0; background: var(--paper); }
      h1, h2, h3, p { margin-top: 0; }
      h1, h2 {
        font-family: Georgia, Times New Roman, serif;
        line-height: 1.02;
      }
      h1 { max-width: 11ch; font-size: 40px; }
      h2 { margin-bottom: 0.06in; font-size: 24px; }
      h3 { margin-bottom: 0.03in; font-size: 12.4px; }
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
        grid-template-columns: 1fr 2.2in;
        gap: 0.22in;
        border-top: 0.16in solid var(--gold);
      }
      .guide-page {
        border-top: 0.16in solid var(--teal);
        font-size: 10.6px;
      }
      .share-page {
        border-top: 0.16in solid var(--coral);
        font-size: 10.1px;
      }
      .extension-page {
        border-top: 0.16in solid var(--blue);
        font-size: 10.2px;
      }
      .page-kicker, .kicker, .world-intro span, .extension-card span {
        color: var(--teal);
        font-size: 9.2px;
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
      .included-grid, .setup-grid, .world-grid, .routine-grid, .extension-grid, .share-grid {
        display: grid;
        gap: 0.07in;
      }
      .included-grid { grid-template-columns: 1fr; }
      .setup-grid, .routine-grid, .extension-grid, .share-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .world-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
      .included-grid li, .setup-grid li, .share-grid li, .routine-card, .extension-card,
      .world-intro, .worksheet-section, .kid-direction, .adult-note, .take-home, .quest-meta {
        padding: 0.05in;
        border: 1px solid var(--line);
        background: white;
      }
      .included-grid li, .setup-grid li, .share-grid li { list-style: none; }
      .world-intro img, .world-intro p { display: none; }
      .world-intro h3 { margin: 0; font-size: 9px; line-height: 1.04; }
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
        font-size: 9.4px;
        font-weight: 900;
      }
      figure {
        float: right;
        width: 1.64in;
        margin: 0 0 0.05in 0.1in;
      }
      figure img {
        width: 1.64in;
        height: 0.92in;
        object-fit: cover;
      }
      figcaption {
        color: var(--muted);
        font-size: 8.8px;
      }
      .write-line {
        min-height: 0.2in;
        margin-bottom: 0.035in;
        padding-bottom: 0.03in;
        border-bottom: 1px solid var(--line);
        color: var(--ink);
      }
      .footer-note {
        margin-top: 0.07in;
        padding-top: 0.07in;
        border-top: 2px solid var(--gold);
        color: var(--muted);
        font-size: 9.3px;
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
      <p class="page-kicker">Adult setup</p>
      <h2>Run the party table</h2>
      <div class="setup-grid">
        <div>
          <h3>Timing</h3>
          <ol>${renderList(source.setupGuide.timing)}</ol>
        </div>
        <div>
          <h3>Table setup</h3>
          <ol>${renderList(source.setupGuide.tableSetup)}</ol>
        </div>
        <div>
          <h3>Adult script</h3>
          <ol>${renderList(source.setupGuide.adultScript)}</ol>
        </div>
        <div>
          <h3>Take-home prep</h3>
          <ol>${renderList(source.setupGuide.takeHomePrep)}</ol>
        </div>
      </div>
      <h3>World menu</h3>
      <div class="world-grid">${worldIntros}</div>
      <p class="footer-note">Use these pages offline for adult-guided party writing with no accounts, no uploads, and no public sharing.</p>
    </section>
    <section class="pack-page share-page">
      <p class="page-kicker">Party tools</p>
      <h2>Routines and share cards</h2>
      <div class="routine-grid">${source.partyRoutines.map(renderRoutine).join('\n')}</div>
      <h3>Group share cards</h3>
      <ul class="share-grid">${renderList(source.groupShareCards)}</ul>
    </section>
    <section class="pack-page extension-page">
      <p class="page-kicker">Party tools</p>
      <h2>Extension activity menu</h2>
      <div class="extension-grid">${source.extensionActivities.map(renderExtension).join('\n')}</div>
    </section>
${quests}
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

export function loadBirthdayPartyBuildInputs() {
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

function prepareBuildDirectory(paths = birthdayBuildPaths()) {
  rmSync(paths.buildDir, { recursive: true, force: true })
  mkdirSync(paths.assetsDir, { recursive: true })
}

function copyPackAssets(source, paths = birthdayBuildPaths()) {
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

function writeReadme(source, paths = birthdayBuildPaths()) {
  const text = [
    source.title,
    '',
    `Price point: ${source.pricePoint}`,
    `Audience: ${source.audience}`,
    `Format: ${source.sessionLength}`,
    '',
    'Files:',
    '- Birthday-Party-Story-Quest-Kit.pdf',
    '- source/birthday-party-story-quest-kit.html',
    '- source/assets/*.jpg',
    '',
    'Fulfillment note:',
    'Upload the ZIP to a hosted provider only after Sam chooses the provider.',
    'Do not add a public download URL to the static site.',
    '',
  ].join('\n')
  writeFileSync(paths.readmePath, text)
}

function zipEntries(paths = birthdayBuildPaths()) {
  const entries = [
    {
      name: 'Birthday-Party-Story-Quest-Kit.pdf',
      data: readFileSync(paths.pdfPath),
    },
    {
      name: 'README.txt',
      data: readFileSync(paths.readmePath),
    },
    {
      name: 'source/birthday-party-story-quest-kit.html',
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

export async function buildBirthdayPartyKit(options = {}) {
  const { source, product, worlds } = loadBirthdayPartyBuildInputs()
  const paths = birthdayBuildPaths(options.buildDir ?? buildDir)
  const recordRoot = options.recordRoot ?? root

  prepareBuildDirectory(paths)
  const imageMap = copyPackAssets(source, paths)
  const html = renderBirthdayPartyKitHtml(source, worlds, imageMap)
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
  buildBirthdayPartyKit()
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
