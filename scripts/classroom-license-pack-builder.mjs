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
const sourcePath = resolve(root, 'content', 'product-artifacts', 'classroom-story-license-pack.json')
const productsPath = resolve(root, 'content', 'products', 'batch5-products.json')
const worldsDir = resolve(root, 'content', 'worlds')
const buildDir = resolve(root, 'product-build', 'classroom-story-license-pack')

function classroomBuildPaths(targetBuildDir = buildDir) {
  const targetSourceDir = resolve(targetBuildDir, 'source')
  return {
    buildDir: targetBuildDir,
    sourceDir: targetSourceDir,
    assetsDir: resolve(targetSourceDir, 'assets'),
    pdfPath: resolve(targetBuildDir, 'Classroom-Story-License-Pack.pdf'),
    zipPath: resolve(targetBuildDir, 'classroom-story-license-pack.zip'),
    htmlPath: resolve(targetSourceDir, 'classroom-story-license-pack.html'),
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
        <p>${escapeHtml(world.premise)}</p>
      </div>
    </article>`
}

function renderPromptCard(card, index, worlds, imageMap) {
  const world = worlds.get(card.worldSlug)
  if (!world) throw new Error(`Unknown Classroom Story License world slug: ${card.worldSlug}`)
  const imagePath = imageMap.get(card.worldSlug)
  const imageBlock = imagePath
    ? `<figure><img src="${escapeHtml(imagePath)}" alt="${escapeHtml(world.title)} illustration"><figcaption>${escapeHtml(world.title)}</figcaption></figure>`
    : ''
  return `
    <section class="pack-page prompt-card-page">
      <div class="page-kicker">Prompt card ${index + 1} | ${escapeHtml(card.skillFocus)}</div>
      <h2>${escapeHtml(card.title)}</h2>
      ${imageBlock}
      <p class="student-prompt">${escapeHtml(card.studentPrompt)}</p>
      <div class="card-grid">
        <section>
          <h3>Choices</h3>
          <ul>${renderList(card.choiceSet)}</ul>
        </section>
        <section>
          <h3>Teacher setup</h3>
          <p>${escapeHtml(card.teacherSetup)}</p>
        </section>
      </div>
      <section class="writing-box">
        <h3>Draft on the card</h3>
        ${renderWriteLines(card.writingLines)}
      </section>
      <div class="card-grid">
        <section>
          <h3>Share move</h3>
          <p>${escapeHtml(card.shareMove)}</p>
        </section>
        <section>
          <h3>Extension</h3>
          <p>${escapeHtml(card.extension)}</p>
        </section>
      </div>
      <p class="rubric-note"><strong>Look for:</strong> ${escapeHtml(card.rubricLookFor)}</p>
    </section>`
}

function renderRubric(source) {
  return source.rubric.criteria
    .map(
      (criterion) => `
        <article class="rubric-row">
          <h3>${escapeHtml(criterion.name)}</h3>
          <p>${escapeHtml(criterion.lookFor)}</p>
          <ol>
            ${source.rubric.levels
              .map((level) => `<li><strong>${escapeHtml(level)}:</strong> ${escapeHtml(criterion.levels[level])}</li>`)
              .join('\n')}
          </ol>
        </article>`,
    )
    .join('\n')
}

function renderExtensionActivities(source) {
  return source.extensionActivities
    .map(
      (activity) => `
        <article class="extension-card">
          <span>${escapeHtml(activity.minutes)} minutes</span>
          <h3>${escapeHtml(activity.title)}</h3>
          <p><strong>Teacher:</strong> ${escapeHtml(activity.teacherMove)}</p>
          <p><strong>Output:</strong> ${escapeHtml(activity.studentOutput)}</p>
        </article>`,
    )
    .join('\n')
}

export function renderClassroomLicenseHtml(source, worlds, imageMap = new Map()) {
  const worldIntros = source.worldSlugs
    .map((slug) => {
      const world = worlds.get(slug)
      if (!world) throw new Error(`Unknown Classroom Story License world slug: ${slug}`)
      return renderWorldIntro(world, imageMap.get(slug))
    })
    .join('\n')

  const promptCards = source.promptCards
    .map((card, index) => renderPromptCard(card, index, worlds, imageMap))
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
        font-size: 12.8px;
        line-height: 1.28;
      }
      * { box-sizing: border-box; }
      body { margin: 0; background: var(--paper); }
      h1, h2, h3, p { margin-top: 0; }
      h1, h2 {
        font-family: Georgia, Times New Roman, serif;
        line-height: 1.02;
      }
      h1 { max-width: 11ch; font-size: 38px; }
      h2 { margin-bottom: 0.07in; font-size: 24px; }
      h3 { margin-bottom: 0.035in; font-size: 13px; }
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
        grid-template-columns: 1fr 2.35in;
        gap: 0.23in;
        border-top: 0.15in solid var(--gold);
      }
      .guide-page {
        border-top: 0.15in solid var(--teal);
        font-size: 10.8px;
      }
      .rubric-page {
        border-top: 0.15in solid var(--blue);
        font-size: 10.3px;
      }
      .extension-page {
        border-top: 0.15in solid var(--coral);
        font-size: 10.2px;
      }
      .page-kicker, .kicker, .world-intro span, .extension-card span {
        color: var(--teal);
        font-size: 9.6px;
        font-weight: 900;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .badge {
        display: inline-grid;
        min-width: 0.86in;
        min-height: 0.5in;
        place-items: center;
        border: 2px solid var(--ink);
        background: white;
        color: var(--ink);
        font-size: 21px;
        font-weight: 900;
      }
      .included-grid, .setup-grid, .world-grid, .extension-grid, .card-grid {
        display: grid;
        gap: 0.07in;
      }
      .included-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .setup-grid, .card-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .world-grid { grid-template-columns: repeat(5, minmax(0, 1fr)); }
      .extension-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .included-grid li, .setup-grid li, .card-grid section, .writing-box, .rubric-note,
      .extension-card, .rubric-row, .world-intro {
        padding: 0.05in;
        border: 1px solid var(--line);
        background: white;
      }
      .included-grid li, .setup-grid li { list-style: none; }
      .included-grid li {
        min-height: 0.36in;
        font-size: 10px;
        line-height: 1.16;
      }
      .world-intro {
        min-height: auto;
      }
      .world-intro img, .world-intro p { display: none; }
      .world-intro h3 {
        margin: 0;
        font-size: 9.1px;
        line-height: 1.06;
      }
      .student-prompt {
        min-height: 0.56in;
        padding: 0.08in;
        border: 2px solid var(--ink);
        background: white;
        color: var(--ink);
        font-weight: 900;
      }
      figure {
        float: right;
        width: 1.68in;
        margin: 0 0 0.05in 0.1in;
      }
      figure img {
        width: 1.68in;
        height: 0.94in;
        object-fit: cover;
      }
      figcaption {
        color: var(--muted);
        font-size: 9px;
      }
      .write-line {
        min-height: 0.18in;
        margin-bottom: 0.035in;
        padding-bottom: 0.03in;
        border-bottom: 1px solid var(--line);
        color: var(--ink);
      }
      .rubric-note {
        margin-top: 0.07in;
        border-color: #e5bc7c;
        background: #fff4dc;
      }
      .rubric-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.07in;
      }
      .rubric-row h3, .extension-card h3 { margin-bottom: 0.02in; }
      .rubric-row ol {
        margin: 0;
        padding-left: 0.15in;
      }
      .footer-note {
        margin-top: 0.07in;
        padding-top: 0.07in;
        border-top: 2px solid var(--gold);
        color: var(--muted);
        font-size: 9.6px;
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
      <p class="page-kicker">Teacher setup</p>
      <h2>Run repeatable writing stations</h2>
      <div class="setup-grid">
        <div>
          <h3>Setup</h3>
          <ol>${renderList(source.teacherSetup)}</ol>
        </div>
        <div>
          <h3>Classroom routines</h3>
          <ol>${renderList(source.classroomRoutines)}</ol>
        </div>
      </div>
      <h3>World menu</h3>
      <div class="world-grid">${worldIntros}</div>
      <p class="footer-note">Use these pages offline for adult-guided classroom writing practice with no accounts, no uploads, and no public sharing.</p>
    </section>
    <section class="pack-page rubric-page">
      <p class="page-kicker">Teacher tools</p>
      <h2>Four-criterion rubric</h2>
      <div class="rubric-grid">${renderRubric(source)}</div>
      <p class="footer-note">Score one criterion per writing block. The pack is built for fast feedback on visible writing moves.</p>
    </section>
    <section class="pack-page extension-page">
      <p class="page-kicker">Teacher tools</p>
      <h2>Extension activity menu</h2>
      <div class="extension-grid">${renderExtensionActivities(source)}</div>
    </section>
${promptCards}
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

export function loadClassroomLicenseBuildInputs() {
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

function prepareBuildDirectory(paths = classroomBuildPaths()) {
  rmSync(paths.buildDir, { recursive: true, force: true })
  mkdirSync(paths.assetsDir, { recursive: true })
}

function copyPackAssets(source, paths = classroomBuildPaths()) {
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

function writeReadme(source, paths = classroomBuildPaths()) {
  const text = [
    source.title,
    '',
    `Price point: ${source.pricePoint}`,
    `Audience: ${source.audience}`,
    `Format: ${source.sessionLength}`,
    '',
    'Files:',
    '- Classroom-Story-License-Pack.pdf',
    '- source/classroom-story-license-pack.html',
    '- source/assets/*.jpg',
    '',
    'Fulfillment note:',
    'Upload the ZIP to a hosted provider only after Sam chooses the provider.',
    'Do not add a public download URL to the static site.',
    '',
  ].join('\n')
  writeFileSync(paths.readmePath, text)
}

function zipEntries(paths = classroomBuildPaths()) {
  const entries = [
    {
      name: 'Classroom-Story-License-Pack.pdf',
      data: readFileSync(paths.pdfPath),
    },
    {
      name: 'README.txt',
      data: readFileSync(paths.readmePath),
    },
    {
      name: 'source/classroom-story-license-pack.html',
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

export async function buildClassroomLicensePack(options = {}) {
  const { source, product, worlds } = loadClassroomLicenseBuildInputs()
  const paths = classroomBuildPaths(options.buildDir ?? buildDir)
  const recordRoot = options.recordRoot ?? root

  prepareBuildDirectory(paths)
  const imageMap = copyPackAssets(source, paths)
  const html = renderClassroomLicenseHtml(source, worlds, imageMap)
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
  buildClassroomLicensePack()
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
