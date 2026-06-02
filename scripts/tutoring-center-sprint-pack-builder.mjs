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
const sourcePath = resolve(root, 'content', 'product-artifacts', 'tutoring-center-story-sprint-pack.json')
const productsPath = resolve(root, 'content', 'products', 'batch5-products.json')
const worldsDir = resolve(root, 'content', 'worlds')
const buildDir = resolve(root, 'product-build', 'tutoring-center-story-sprint-pack')

function tutoringCenterBuildPaths(targetBuildDir = buildDir) {
  const sourceDir = resolve(targetBuildDir, 'source')
  return {
    buildDir: targetBuildDir,
    sourceDir,
    assetsDir: resolve(sourceDir, 'assets'),
    pdfPath: resolve(targetBuildDir, 'Tutoring-Center-Story-Sprint-Pack.pdf'),
    zipPath: resolve(targetBuildDir, 'tutoring-center-story-sprint-pack.zip'),
    htmlPath: resolve(sourceDir, 'tutoring-center-story-sprint-pack.html'),
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

function renderTakeHomeSlip(slip) {
  return `
    <article class="slip-card">
      <span>${escapeHtml(slip.time)} | ${escapeHtml(slip.skill)}</span>
      <h3>${escapeHtml(slip.title)}</h3>
      <p>${escapeHtml(slip.direction)}</p>
      <p>${escapeHtml(slip.familyLine)}</p>
    </article>`
}

function renderSprintPage(sprint, index, worlds, imageMap) {
  const world = worlds.get(sprint.worldSlug)
  if (!world) throw new Error(`Unknown Tutoring Center world slug: ${sprint.worldSlug}`)
  const imagePath = imageMap.get(sprint.worldSlug)
  if (!imagePath) throw new Error(`Missing Tutoring Center copied image for ${sprint.worldSlug}`)
  const imageBlock = `<figure><img src="${escapeHtml(imagePath)}" alt="${escapeHtml(world.title)} illustration"><figcaption>${escapeHtml(world.title)}</figcaption></figure>`
  const sections = sprint.pageSections
    .map(
      (section) => `
        <section class="worksheet-section">
          <h3>${escapeHtml(section.heading)}</h3>
          ${renderWriteLines(section.lines)}
        </section>`,
    )
    .join('\n')

  return `
    <section class="pack-page sprint-page">
      <div class="page-kicker">Sprint ${index + 1} | Ages ${escapeHtml(sprint.ageBand)}</div>
      <h2>${escapeHtml(sprint.title)}</h2>
      ${imageBlock}
      <p class="kid-direction">${escapeHtml(sprint.kidDirection)}</p>
      <p class="adult-note">${escapeHtml(sprint.coachingPrompt)}</p>
      <div class="quest-meta">
        <span>${escapeHtml(sprint.sprintSkill)}</span>
        <span>${escapeHtml(sprint.sessionFit)}</span>
      </div>
      <p><strong>Tutor setup:</strong> ${escapeHtml(sprint.tutorSetup)}</p>
      <div class="worksheet-sections">${sections}</div>
      <p class="wrap-line">${escapeHtml(sprint.wrapUpLine)}</p>
      <p class="extension-line">${escapeHtml(sprint.extensionLine)}</p>
    </section>`
}

export function renderTutoringCenterSprintPackHtml(source, worlds, imageMap = new Map()) {
  const worldIntros = source.worldSlugs
    .map((slug) => {
      const world = worlds.get(slug)
      if (!world) throw new Error(`Unknown Tutoring Center source world slug: ${slug}`)
      return renderWorldIntro(world, imageMap.get(slug))
    })
    .join('\n')
  const sprintPages = source.sprints
    .map((sprint, index) => renderSprintPage(sprint, index, worlds, imageMap))
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
        font-size: 11.2px;
        line-height: 1.16;
      }
      * { box-sizing: border-box; }
      body { margin: 0; background: var(--paper); }
      h1, h2, h3, p { margin-top: 0; }
      h1, h2 {
        font-family: Georgia, Times New Roman, serif;
        line-height: 1.02;
      }
      h1 { max-width: 12ch; font-size: 37px; }
      h2 { margin-bottom: 0.05in; font-size: 22px; }
      h3 { margin-bottom: 0.025in; font-size: 11.4px; }
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
      .routine-page {
        border-top: 0.16in solid var(--blue);
        font-size: 9px;
      }
      .slip-page {
        border-top: 0.16in solid var(--coral);
        font-size: 9px;
      }
      .sprint-page {
        font-size: 10.1px;
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
        color: var(--ink);
        font-size: 21px;
        font-weight: 900;
      }
      .included-grid, .setup-grid, .world-grid, .routine-grid, .slip-grid, .share-grid {
        display: grid;
        gap: 0.05in;
      }
      .included-grid { grid-template-columns: 1fr; }
      .setup-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .routine-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .slip-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .share-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .world-grid {
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 0.045in;
      }
      .included-grid li, .setup-grid li, .share-grid li, .routine-card, .slip-card,
      .world-intro, .worksheet-section, .kid-direction, .adult-note, .quest-meta, .wrap-line, .extension-line {
        padding: 0.045in;
        border: 1px solid var(--line);
        background: white;
      }
      .included-grid li, .setup-grid li, .share-grid li { list-style: none; }
      .world-intro {
        min-height: 0.52in;
      }
      .world-intro img, .world-intro p { display: none; }
      .world-intro h3 { margin: 0; font-size: 8.1px; line-height: 1.02; }
      .guide-page h2 { font-size: 19px; }
      .guide-page h3 { font-size: 9.5px; }
      .guide-page li { line-height: 1.1; }
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
        grid-template-columns: 1.35in 1fr;
        gap: 0.04in;
        color: var(--ink);
        font-size: 8.8px;
        font-weight: 900;
      }
      figure {
        float: right;
        width: 1.35in;
        margin: 0 0 0.04in 0.08in;
      }
      figure img {
        width: 1.35in;
        height: 0.76in;
        object-fit: cover;
      }
      figcaption {
        color: var(--muted);
        font-size: 7.8px;
      }
      .write-line {
        min-height: 0.17in;
        margin-bottom: 0.025in;
        padding-bottom: 0.024in;
        border-bottom: 1px solid var(--line);
        color: var(--ink);
      }
      .wrap-line, .extension-line {
        margin-top: 0.04in;
        color: var(--ink);
        font-weight: 900;
      }
      .footer-note {
        margin-top: 0.05in;
        padding-top: 0.05in;
        border-top: 2px solid var(--gold);
        color: var(--muted);
        font-size: 8.8px;
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
      <p class="page-kicker">Tutor setup</p>
      <h2>Run the tutoring sprints</h2>
      <div class="setup-grid">
        <div>
          <h3>Before session</h3>
          <ol>${renderList(source.tutorGuide.beforeSession)}</ol>
        </div>
        <div>
          <h3>Setup</h3>
          <ol>${renderList(source.tutorGuide.setup)}</ol>
        </div>
        <div>
          <h3>During sprint</h3>
          <ol>${renderList(source.tutorGuide.duringSprint)}</ol>
        </div>
        <div>
          <h3>Wrap up</h3>
          <ol>${renderList(source.tutorGuide.wrapUp)}</ol>
        </div>
        <div>
          <h3>No-data use</h3>
          <ol>${renderList(source.tutorGuide.noDataUse)}</ol>
        </div>
      </div>
      <h3>Image-backed world menu</h3>
      <div class="world-grid">${worldIntros}</div>
      <p class="footer-note">Use these pages offline for adult-guided tutoring. Keep finished pages in folders or send them home.</p>
    </section>
    <section class="pack-page routine-page">
      <p class="page-kicker">Tutor tools</p>
      <h2>Sprint routines and optional share prompts</h2>
      <div class="routine-grid">${source.sprintRoutines.map(renderRoutine).join('\n')}</div>
      <h3>Optional share prompts</h3>
      <ul class="share-grid">${renderList(source.sharePrompts)}</ul>
    </section>
    <section class="pack-page slip-page">
      <p class="page-kicker">Tutor tools</p>
      <h2>Take-home micro-practice slips</h2>
      <div class="slip-grid">${source.takeHomeSlips.map(renderTakeHomeSlip).join('\n')}</div>
    </section>
${sprintPages}
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

export function loadTutoringCenterSprintBuildInputs() {
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
  for (const sprint of source.sprints) {
    if (!worlds.has(sprint.worldSlug)) throw new Error(`Missing sprint world record for ${sprint.worldSlug}`)
    if (!imageMap.has(sprint.worldSlug)) throw new Error(`Missing local copied image for sprint world ${sprint.worldSlug}`)
  }
  return {
    source,
    product,
    worlds,
    imageMap,
  }
}

function prepareBuildDirectory(paths = tutoringCenterBuildPaths()) {
  rmSync(paths.buildDir, { recursive: true, force: true })
  mkdirSync(paths.assetsDir, { recursive: true })
}

function copyPackAssets(source, paths = tutoringCenterBuildPaths()) {
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

function writeReadme(source, paths = tutoringCenterBuildPaths()) {
  const text = [
    source.title,
    '',
    `Price point: ${source.pricePoint}`,
    `Audience: ${source.audience}`,
    `Format: ${source.sessionLength}`,
    '',
    'Files:',
    '- Tutoring-Center-Story-Sprint-Pack.pdf',
    '- source/tutoring-center-story-sprint-pack.html',
    '- source/assets/*.jpg',
    '',
    'Fulfillment note:',
    'Place the ZIP in a hosted product only after Sam chooses the provider.',
    'Do not add a public download URL to the static site.',
    '',
  ].join('\n')
  writeFileSync(paths.readmePath, text)
}

function zipEntries(paths = tutoringCenterBuildPaths()) {
  const entries = [
    {
      name: 'Tutoring-Center-Story-Sprint-Pack.pdf',
      data: readFileSync(paths.pdfPath),
    },
    {
      name: 'README.txt',
      data: readFileSync(paths.readmePath),
    },
    {
      name: 'source/tutoring-center-story-sprint-pack.html',
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

export async function buildTutoringCenterSprintPack(options = {}) {
  const { source, product, worlds } = loadTutoringCenterSprintBuildInputs()
  const paths = tutoringCenterBuildPaths(options.buildDir ?? buildDir)
  const recordRoot = options.recordRoot ?? root

  prepareBuildDirectory(paths)
  const imageMap = copyPackAssets(source, paths)
  const html = renderTutoringCenterSprintPackHtml(source, worlds, imageMap)
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
  buildTutoringCenterSprintPack()
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
