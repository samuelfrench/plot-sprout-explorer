import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { starterWorlds } from './starter-worlds.mjs'

const root = resolve(import.meta.dirname, '..')
const collectionPath = resolve(root, 'content', 'seo-collections', 'batch2-collections.json')
const miniUnitsPath = resolve(root, 'content', 'mini-units', 'batch3-mini-units.json')
const batch4ImagesPath = resolve(root, 'content', 'image-queue', '2026-06-02-batch4-world-images.json')
const productsPath = resolve(root, 'content', 'products', 'batch5-products.json')
const worldsDir = resolve(root, 'content', 'worlds')
const publicDir = resolve(root, 'public')
const siteRoot = 'https://samuelfrench.github.io/plot-sprout-explorer'
const basePath = '/plot-sprout-explorer/'

const heroImages = new Map([
  ['creative-writing-prompts-for-kids', 'images/plotsprout/moon-muffin-market.jpg'],
  ['story-writing-worksheets', 'images/plotsprout/buttonwood-library-train.jpg'],
  ['reluctant-writer-activities', 'images/plotsprout/puddle-planet-post-office.jpg'],
  ['homeschool-writing-prompts', 'images/plotsprout/cloudberry-clocktower.jpg'],
])

function fail(message) {
  throw new Error(message)
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

function loadWorlds() {
  const worlds = new Map()
  for (const world of starterWorlds) {
    worlds.set(world.slug, {
      ...world,
      seoLane: 'starter world',
    })
  }
  for (const file of readdirSync(worldsDir).filter((item) => /^batch1-.+\.json$/.test(item))) {
    const data = readJson(resolve(worldsDir, file))
    for (const world of data.worlds) {
      worlds.set(world.slug, world)
    }
  }
  return worlds
}

function renderList(items) {
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join('\n')
}

function metaDescription(value, maxLength = 158) {
  const text = String(value).trim()
  if (text.length <= maxLength) return text
  const clipped = text.slice(0, maxLength + 1)
  const boundary = clipped.lastIndexOf(' ')
  const candidate = boundary > 80 ? clipped.slice(0, boundary) : text.slice(0, maxLength)
  let cleaned = candidate.replace(/[ ,;:-]+$/g, '')
  while (/\s+(and|or|with|for|to|a|an|the)$/i.test(cleaned)) {
    cleaned = cleaned.replace(/\s+(and|or|with|for|to|a|an|the)$/i, '').replace(/[ ,;:-]+$/g, '')
  }
  return /[.!?]$/.test(cleaned) ? cleaned : `${cleaned}.`
}

function renderCollection(collection, worlds) {
  const canonical = `${siteRoot}/${collection.slug}/`
  const imagePath = heroImages.get(collection.slug) ?? 'images/plotsprout/moon-muffin-market.jpg'
  const featuredWorlds = collection.featuredWorldSlugs.map((slug) => {
    const world = worlds.get(slug)
    if (!world) {
      fail(`Unknown featured world slug in ${collection.slug}: ${slug}`)
    }
    return world
  })

  const sections = collection.sections
    .map(
      (section) => `
        <section class="content-block">
          <h2>${escapeHtml(section.heading)}</h2>
          <p>${escapeHtml(section.body)}</p>
          <ul>${renderList(section.bullets)}</ul>
        </section>`,
    )
    .join('\n')

  const worldCards = featuredWorlds
    .map(
      (world) => `
        <article class="world-card">
          <span>Ages ${escapeHtml(world.ageBand)}</span>
          <h3>${escapeHtml(world.title)}</h3>
          <p>${escapeHtml(world.premise)}</p>
        </article>`,
    )
    .join('\n')

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(collection.title)} | Plot Sprout Explorer</title>
    <meta name="description" content="${escapeHtml(collection.metaDescription)}">
    <link rel="canonical" href="${canonical}">
    <link rel="icon" type="image/svg+xml" href="${basePath}favicon.svg">
    <style>
      :root {
        --ink: #19343a;
        --muted: #52656b;
        --paper: #f7fbf4;
        --panel: #fdf8ef;
        --line: #bfd8d2;
        --coral: #ec6f3f;
        --teal: #2c7a78;
        color: var(--ink);
        background:
          radial-gradient(circle at top left, rgba(242, 193, 79, 0.34), transparent 30rem),
          linear-gradient(135deg, #f7fbf4 0%, #e8f6f1 46%, #fff7eb 100%);
        font-family: Avenir Next, Avenir, Trebuchet MS, Verdana, sans-serif;
        font-size: 17px;
        line-height: 1.5;
      }
      * { box-sizing: border-box; }
      body { min-width: 320px; margin: 0; }
      main { width: min(1120px, calc(100% - 28px)); margin: 0 auto; padding: 28px 0; }
      a { color: inherit; }
      .hero, .content-block, .offer, .world-card {
        border: 1px solid var(--line);
        background: color-mix(in srgb, var(--panel) 92%, white);
        box-shadow: 0 18px 45px rgba(20, 31, 43, 0.08);
      }
      .hero {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(260px, 0.72fr);
        gap: 22px;
        padding: 24px;
      }
      .eyebrow, .world-card span {
        margin: 0 0 8px;
        color: var(--teal);
        font-size: 0.76rem;
        font-weight: 900;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      h1, h2, h3 { margin: 0; line-height: 1.08; }
      h1 {
        max-width: 12ch;
        font-family: Georgia, Times New Roman, serif;
        font-size: clamp(2.2rem, 7vw, 5.4rem);
      }
      h2 { font-size: clamp(1.4rem, 3vw, 2.1rem); }
      h3 { font-size: 1.1rem; }
      p { color: var(--muted); }
      .hero img {
        width: 100%;
        min-height: 280px;
        aspect-ratio: 7 / 4;
        object-fit: cover;
        border: 1px solid var(--line);
      }
      .hero-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 20px;
      }
      .button {
        display: inline-flex;
        min-height: 44px;
        align-items: center;
        justify-content: center;
        padding: 0 16px;
        border: 1px solid #9c3f29;
        border-radius: 7px;
        background: var(--coral);
        color: #fff;
        font-weight: 900;
        text-decoration: none;
      }
      .button.secondary {
        border-color: var(--line);
        background: #fff;
        color: var(--ink);
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 14px;
        margin-top: 18px;
      }
      .content-block, .offer, .world-card { padding: 18px; }
      .content-block ul { padding-left: 1.2rem; color: var(--muted); }
      .featured {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 10px;
        margin-top: 18px;
      }
      .world-card {
        min-height: 180px;
        background: #fff;
        border-top: 7px solid var(--teal);
      }
      .offer { margin-top: 18px; }
      footer { padding: 24px 0 8px; color: var(--muted); }
      @media (max-width: 880px) {
        .hero, .grid, .featured { grid-template-columns: 1fr; }
        .hero img { min-height: auto; }
      }
    </style>
  </head>
  <body>
    <main>
      <section class="hero">
        <div>
          <p class="eyebrow">${escapeHtml(collection.keyword)}</p>
          <h1>${escapeHtml(collection.title)}</h1>
          <p>${escapeHtml(collection.intro)}</p>
          <p><strong>Best fit:</strong> ${escapeHtml(collection.audience)}</p>
          <div class="hero-actions">
            <a class="button" href="${basePath}">Open the quest workbench</a>
            <a class="button secondary" href="${basePath}#project-engine">View printable kit engine</a>
          </div>
        </div>
        <img src="${basePath}${imagePath}" alt="">
      </section>
      <section class="offer">
        <h2>Why this lane works</h2>
        <p>${escapeHtml(collection.whyItWorks)}</p>
      </section>
      <div class="grid">${sections}</div>
      <section class="offer">
        <h2>Featured quest worlds</h2>
        <div class="featured">${worldCards}</div>
      </section>
      <section class="offer">
        <h2>Printable direction</h2>
        <p>${escapeHtml(collection.printableOffer)}</p>
        <p>${escapeHtml(collection.safetyNote)}</p>
        <p><strong>${escapeHtml(collection.cta)}</strong></p>
      </section>
      <footer>
        <a href="${basePath}">Plot Sprout Explorer</a> creates static, family-safe writing quest pages from committed content batches.
      </footer>
    </main>
  </body>
</html>
`
}

function renderMiniUnitIndex(units) {
  const cards = units
    .map(
      (unit) => `
        <article class="unit-card">
          <span>Ages ${escapeHtml(unit.ageBand)} | ${escapeHtml(unit.duration)}</span>
          <h2>${escapeHtml(unit.title)}</h2>
          <p>${escapeHtml(unit.summary)}</p>
          <a href="${basePath}mini-units/${unit.slug}/">Open unit</a>
        </article>`,
    )
    .join('\n')

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Teacher Mini-Units | Plot Sprout Explorer</title>
    <meta name="description" content="Browse 10 low-prep Plot Sprout mini-units with teacher notes, lesson flow, printable directions, and no student-account requirements.">
    <link rel="canonical" href="${siteRoot}/mini-units/">
    <link rel="icon" type="image/svg+xml" href="${basePath}favicon.svg">
    <style>
      :root {
        --ink: #19343a;
        --muted: #52656b;
        --panel: #fdf8ef;
        --line: #bfd8d2;
        --coral: #ec6f3f;
        --teal: #2c7a78;
        color: var(--ink);
        background:
          radial-gradient(circle at top left, rgba(242, 193, 79, 0.34), transparent 30rem),
          linear-gradient(135deg, #f7fbf4 0%, #e8f6f1 46%, #fff7eb 100%);
        font-family: Avenir Next, Avenir, Trebuchet MS, Verdana, sans-serif;
        font-size: 17px;
        line-height: 1.5;
      }
      * { box-sizing: border-box; }
      body { min-width: 320px; margin: 0; }
      main { width: min(1120px, calc(100% - 28px)); margin: 0 auto; padding: 28px 0; }
      h1, h2 { margin: 0; line-height: 1.08; }
      h1 {
        max-width: 12ch;
        font-family: Georgia, Times New Roman, serif;
        font-size: clamp(2.2rem, 7vw, 5.4rem);
      }
      p { color: var(--muted); }
      .hero, .unit-card, .note {
        border: 1px solid var(--line);
        background: color-mix(in srgb, var(--panel) 92%, white);
        box-shadow: 0 18px 45px rgba(20, 31, 43, 0.08);
      }
      .hero { padding: 24px; }
      .eyebrow, .unit-card span {
        color: var(--teal);
        font-size: 0.76rem;
        font-weight: 900;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 14px;
        margin-top: 18px;
      }
      .unit-card {
        display: grid;
        gap: 10px;
        min-height: 230px;
        padding: 18px;
        border-top: 7px solid var(--teal);
      }
      .unit-card a, .button {
        display: inline-flex;
        min-height: 44px;
        align-items: center;
        justify-content: center;
        justify-self: start;
        padding: 0 16px;
        color: #fff;
        font-weight: 900;
        text-decoration: none;
        background: var(--coral);
        border: 1px solid #9c3f29;
        border-radius: 7px;
      }
      .note { margin-top: 18px; padding: 18px; }
      footer { padding: 24px 0 8px; color: var(--muted); }
      @media (max-width: 820px) { .grid { grid-template-columns: 1fr; } }
    </style>
  </head>
  <body>
    <main>
      <section class="hero">
        <p class="eyebrow">No student accounts required</p>
        <h1>Teacher Mini-Units</h1>
        <p>Ten three-lesson Plot Sprout units for homeschool tables, tutoring sessions, substitute folders, and elementary classrooms. Every unit is built for printable writing practice, teacher notes, and adult-guided story work.</p>
        <a class="button" href="${basePath}">Open the quest workbench</a>
      </section>
      <div class="grid">${cards}</div>
      <section class="note">
        <h2>Safety and product direction</h2>
        <p>These units use committed, reviewed content. They do not require student accounts, uploads, public publishing, or online story sharing. Future monetization can package them as printable bundles, homeschool season packs, or classroom licenses.</p>
      </section>
      <footer><a href="${basePath}">Plot Sprout Explorer</a> mini-units are generated in manual Codex batches and rendered as static pages.</footer>
    </main>
  </body>
</html>
`
}

function renderMiniUnit(unit, worlds) {
  const canonical = `${siteRoot}/mini-units/${unit.slug}/`
  const referencedWorlds = unit.worldSlugs.map((slug) => {
    const world = worlds.get(slug)
    if (!world) fail(`Unknown mini-unit world slug in ${unit.slug}: ${slug}`)
    return world
  })

  const lessons = unit.lessonFlow
    .map(
      (lesson) => `
        <article class="lesson">
          <span>${escapeHtml(lesson.minutes)} minutes</span>
          <h3>${escapeHtml(lesson.title)}</h3>
          <p><strong>Teacher move:</strong> ${escapeHtml(lesson.teacherMove)}</p>
          <p><strong>Student task:</strong> ${escapeHtml(lesson.studentTask)}</p>
          <p><strong>Output:</strong> ${escapeHtml(lesson.output)}</p>
        </article>`,
    )
    .join('\n')
  const worldsList = referencedWorlds
    .map((world) => `<li><strong>${escapeHtml(world.title)}</strong>: ${escapeHtml(world.premise)}</li>`)
    .join('\n')

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(unit.title)} | Plot Sprout Explorer</title>
    <meta name="description" content="${escapeHtml(unit.summary).slice(0, 158)}">
    <link rel="canonical" href="${canonical}">
    <link rel="icon" type="image/svg+xml" href="${basePath}favicon.svg">
    <style>
      :root {
        --ink: #19343a;
        --muted: #52656b;
        --panel: #fdf8ef;
        --line: #bfd8d2;
        --coral: #ec6f3f;
        --teal: #2c7a78;
        color: var(--ink);
        background:
          radial-gradient(circle at top left, rgba(242, 193, 79, 0.34), transparent 30rem),
          linear-gradient(135deg, #f7fbf4 0%, #e8f6f1 46%, #fff7eb 100%);
        font-family: Avenir Next, Avenir, Trebuchet MS, Verdana, sans-serif;
        font-size: 17px;
        line-height: 1.5;
      }
      * { box-sizing: border-box; }
      body { min-width: 320px; margin: 0; }
      main { width: min(1120px, calc(100% - 28px)); margin: 0 auto; padding: 28px 0; }
      h1, h2, h3 { margin: 0; line-height: 1.08; }
      h1 {
        max-width: 13ch;
        font-family: Georgia, Times New Roman, serif;
        font-size: clamp(2.1rem, 7vw, 5rem);
      }
      p, li { color: var(--muted); }
      .hero, .panel, .lesson {
        border: 1px solid var(--line);
        background: color-mix(in srgb, var(--panel) 92%, white);
        box-shadow: 0 18px 45px rgba(20, 31, 43, 0.08);
      }
      .hero {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(220px, 0.45fr);
        gap: 18px;
        padding: 24px;
      }
      .eyebrow, .lesson span {
        color: var(--teal);
        font-size: 0.76rem;
        font-weight: 900;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .button {
        display: inline-flex;
        min-height: 44px;
        align-items: center;
        justify-content: center;
        padding: 0 16px;
        color: #fff;
        font-weight: 900;
        text-decoration: none;
        background: var(--coral);
        border: 1px solid #9c3f29;
        border-radius: 7px;
      }
      .stats {
        display: grid;
        gap: 10px;
        align-content: start;
      }
      .stat {
        padding: 12px;
        background: #fff;
        border: 1px solid var(--line);
        font-weight: 900;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 14px;
        margin-top: 18px;
      }
      .panel, .lesson { padding: 18px; }
      .lesson { min-height: 260px; border-top: 7px solid var(--teal); }
      footer { padding: 24px 0 8px; color: var(--muted); }
      @media (max-width: 880px) {
        .hero, .grid { grid-template-columns: 1fr; }
      }
    </style>
  </head>
  <body>
    <main>
      <section class="hero">
        <div>
          <p class="eyebrow">Teacher mini-unit</p>
          <h1>${escapeHtml(unit.title)}</h1>
          <p>${escapeHtml(unit.summary)}</p>
          <a class="button" href="${basePath}mini-units/">Back to mini-units</a>
        </div>
        <div class="stats">
          <div class="stat">Ages ${escapeHtml(unit.ageBand)}</div>
          <div class="stat">${escapeHtml(unit.duration)}</div>
          <div class="stat">${escapeHtml(unit.audience)}</div>
        </div>
      </section>
      <section class="panel">
        <h2>Objectives</h2>
        <ul>${renderList(unit.objectives)}</ul>
      </section>
      <section class="panel">
        <h2>Materials</h2>
        <ul>${renderList(unit.materials)}</ul>
      </section>
      <section>
        <h2>Lesson flow</h2>
        <div class="grid">${lessons}</div>
      </section>
      <section class="panel">
        <h2>Teacher notes</h2>
        <ul>${renderList(unit.teacherNotes)}</ul>
      </section>
      <section class="panel">
        <h2>Quest worlds used</h2>
        <ul>${worldsList}</ul>
      </section>
      <section class="panel">
        <h2>Homeschool and classroom use</h2>
        <p><strong>Homeschool adaptation:</strong> ${escapeHtml(unit.homeschoolAdaptation)}</p>
        <p><strong>Classroom management:</strong> ${escapeHtml(unit.classroomManagement)}</p>
        <p><strong>Assessment:</strong> ${escapeHtml(unit.assessment)}</p>
      </section>
      <section class="panel">
        <h2>Printable direction</h2>
        <p>${escapeHtml(unit.printableOffer)}</p>
        <p>${escapeHtml(unit.safetyNote)}</p>
      </section>
      <footer><a href="${basePath}">Plot Sprout Explorer</a> keeps mini-units static, printable-first, and adult-guided.</footer>
    </main>
  </body>
</html>
`
}

function renderWorldGallery(manifest, worlds) {
  const canonical = `${siteRoot}/world-gallery/`
  const laneCounts = manifest.images.reduce((counts, image) => {
    counts.set(image.seoLane, (counts.get(image.seoLane) ?? 0) + 1)
    return counts
  }, new Map())
  const laneSummary = Array.from(laneCounts.entries())
    .map(([lane, count]) => `${count} ${lane}`)
    .join(' | ')
  const cards = manifest.images
    .map((image) => {
      const world = worlds.get(image.slug)
      if (!world) fail(`Unknown Batch 4 world slug: ${image.slug}`)
      return `
        <article class="image-card">
          <picture>
            <source srcset="${basePath}${escapeHtml(image.outputWebp.replace(/^public\//, ''))}" type="image/webp">
            <img src="${basePath}${escapeHtml(image.outputJpeg.replace(/^public\//, ''))}" alt="${escapeHtml(image.title)} quest world illustration" loading="lazy" width="1344" height="768">
          </picture>
          <div>
            <span>Ages ${escapeHtml(image.ageBand)} | ${escapeHtml(image.seoLane)}</span>
            <h2>${escapeHtml(image.title)}</h2>
            <p>${escapeHtml(world.premise)}</p>
            <p><strong>Printable angle:</strong> ${escapeHtml(world.productAngle)}</p>
          </div>
        </article>`
    })
    .join('\n')

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>World Art Gallery | Plot Sprout Explorer</title>
    <meta name="description" content="Browse 20 locally generated Plot Sprout world images for printable writing quests, classroom packets, and homeschool story prompts.">
    <link rel="canonical" href="${canonical}">
    <link rel="icon" type="image/svg+xml" href="${basePath}favicon.svg">
    <style>
      :root {
        --ink: #19343a;
        --muted: #52656b;
        --panel: #fdf8ef;
        --line: #bfd8d2;
        --coral: #ec6f3f;
        --teal: #2c7a78;
        --gold: #f2c14f;
        color: var(--ink);
        background:
          linear-gradient(90deg, rgba(25, 52, 58, 0.05) 1px, transparent 1px),
          linear-gradient(180deg, rgba(25, 52, 58, 0.05) 1px, transparent 1px),
          linear-gradient(135deg, #f7fbf4 0%, #e8f6f1 46%, #fff7eb 100%);
        background-size: 36px 36px, 36px 36px, auto;
        font-family: Avenir Next, Avenir, Trebuchet MS, Verdana, sans-serif;
        font-size: 17px;
        line-height: 1.5;
      }
      * { box-sizing: border-box; }
      body { min-width: 320px; margin: 0; }
      main { width: min(1180px, calc(100% - 28px)); margin: 0 auto; padding: 28px 0; }
      a { color: inherit; }
      h1, h2 { margin: 0; line-height: 1.08; }
      h1 {
        max-width: 12ch;
        font-family: Georgia, Times New Roman, serif;
        font-size: clamp(2.2rem, 7vw, 5.5rem);
      }
      p { color: var(--muted); }
      .hero, .image-card, .note {
        border: 1px solid var(--line);
        background: color-mix(in srgb, var(--panel) 92%, white);
        box-shadow: 0 18px 45px rgba(20, 31, 43, 0.08);
      }
      .hero {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(220px, 0.48fr);
        gap: 20px;
        padding: 24px;
        border-top: 8px solid var(--gold);
      }
      .eyebrow, .image-card span {
        color: var(--teal);
        font-size: 0.76rem;
        font-weight: 900;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .stat-stack {
        display: grid;
        gap: 10px;
        align-content: start;
      }
      .stat {
        padding: 12px;
        background: #fff;
        border: 1px solid var(--line);
        font-weight: 900;
      }
      .button {
        display: inline-flex;
        width: fit-content;
        min-height: 44px;
        align-items: center;
        justify-content: center;
        padding: 0 16px;
        color: #fff;
        font-weight: 900;
        text-decoration: none;
        background: var(--coral);
        border: 1px solid #9c3f29;
        border-radius: 7px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 14px;
        margin-top: 18px;
      }
      .image-card {
        display: grid;
        grid-template-columns: minmax(190px, 0.9fr) minmax(0, 1fr);
        gap: 14px;
        min-height: 250px;
        padding: 14px;
        border-top: 7px solid var(--teal);
      }
      picture, img {
        display: block;
        width: 100%;
      }
      img {
        aspect-ratio: 7 / 4;
        height: auto;
        object-fit: cover;
        background: #dfeee7;
        border: 1px solid var(--line);
      }
      .image-card h2 {
        font-size: clamp(1.2rem, 3vw, 1.7rem);
      }
      .note { margin-top: 18px; padding: 18px; }
      footer { padding: 24px 0 8px; color: var(--muted); }
      @media (max-width: 860px) {
        .hero, .grid, .image-card { grid-template-columns: 1fr; }
      }
    </style>
  </head>
  <body>
    <main>
      <section class="hero">
        <div>
          <p class="eyebrow">Local GPU image batch</p>
          <h1>World Art Gallery</h1>
          <p>Twenty committed Plot Sprout world images generated locally on the RTX 4090. Each image supports printable writing quests, classroom packets, homeschool prompts, and static SEO pages without cloud image services.</p>
          <a class="button" href="${basePath}">Open the quest workbench</a>
        </div>
        <div class="stat-stack">
          <div class="stat">20 local world images</div>
          <div class="stat">JPEG + WebP assets</div>
          <div class="stat">${escapeHtml(laneSummary)}</div>
        </div>
      </section>
      <div class="grid">${cards}</div>
      <section class="note">
        <h2>Generation policy</h2>
        <p>Batch 4 is a manual Codex/local-GPU batch. The images are committed as static files with prompt sidecars under <code>content/image-runs/batch4/</code>. There are no upload forms, public publishing flows, or automated GitHub Actions content-generation jobs.</p>
      </section>
      <footer><a href="${basePath}">Plot Sprout Explorer</a> keeps art generation local, reviewed, and adult-guided.</footer>
    </main>
  </body>
</html>
`
}

function renderProductPage(product, worlds) {
  const canonical = `${siteRoot}/${product.slug}/`
  const productWorldSummaryRecords = new Map((product.worldSummaries ?? []).map((item) => [item.slug, item]))
  const referencedWorlds = product.worldSlugs.map((slug) => {
    const world = worlds.get(slug)
    if (!world) fail(`Unknown product world slug in ${product.slug}: ${slug}`)
    return world
  })
  const worldCards = referencedWorlds
    .map(
      (world) => `
        <article class="world-card">
          <span>Ages ${escapeHtml(productWorldSummaryRecords.get(world.slug)?.ageBand ?? world.ageBand)} | ${escapeHtml(world.seoLane ?? 'starter world')}</span>
          <h3>${escapeHtml(world.title)}</h3>
          <p>${escapeHtml(productWorldSummaryRecords.get(world.slug)?.summary ?? world.premise)}</p>
        </article>`,
    )
    .join('\n')

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(product.title)} | Plot Sprout Explorer</title>
    <meta name="description" content="${escapeHtml(metaDescription(product.summary))}">
    <link rel="canonical" href="${canonical}">
    <link rel="icon" type="image/svg+xml" href="${basePath}favicon.svg">
    <style>
      :root {
        --ink: #19343a;
        --muted: #52656b;
        --panel: #fdf8ef;
        --line: #bfd8d2;
        --coral: #ec6f3f;
        --teal: #2c7a78;
        --gold: #f2c14f;
        color: var(--ink);
        background:
          linear-gradient(135deg, rgba(29, 157, 178, 0.18), transparent 36rem),
          linear-gradient(135deg, #f7fbf4 0%, #e8f6f1 46%, #fff7eb 100%);
        font-family: Avenir Next, Avenir, Trebuchet MS, Verdana, sans-serif;
        font-size: 17px;
        line-height: 1.5;
      }
      * { box-sizing: border-box; }
      body { min-width: 320px; margin: 0; }
      main { width: min(1120px, calc(100% - 28px)); margin: 0 auto; padding: 28px 0; }
      a { color: inherit; }
      h1, h2, h3 { margin: 0; line-height: 1.08; }
      h1 {
        max-width: 13ch;
        font-family: Georgia, Times New Roman, serif;
        font-size: clamp(2.2rem, 7vw, 5.4rem);
      }
      h2 { font-size: clamp(1.35rem, 3vw, 2rem); }
      p, li { color: var(--muted); }
      .hero, .panel, .world-card {
        border: 1px solid var(--line);
        background: color-mix(in srgb, var(--panel) 92%, white);
        box-shadow: 0 18px 45px rgba(20, 31, 43, 0.08);
      }
      .hero {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(260px, 0.72fr);
        gap: 22px;
        padding: 24px;
        border-top: 8px solid var(--gold);
      }
      .eyebrow, .world-card span {
        color: var(--teal);
        font-size: 0.76rem;
        font-weight: 900;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .hero img {
        width: 100%;
        min-height: 280px;
        aspect-ratio: 7 / 4;
        object-fit: cover;
        border: 1px solid var(--line);
        background: #dfeee7;
      }
      .price {
        display: inline-grid;
        min-width: 92px;
        min-height: 58px;
        place-items: center;
        margin: 12px 0;
        background: #fff;
        border: 2px solid var(--ink);
        color: var(--ink);
        font-size: 1.8rem;
        font-weight: 900;
      }
      .button {
        display: inline-flex;
        min-height: 44px;
        align-items: center;
        justify-content: center;
        padding: 0 16px;
        color: #fff;
        font-weight: 900;
        text-decoration: none;
        background: var(--coral);
        border: 1px solid #9c3f29;
        border-radius: 7px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 14px;
        margin-top: 18px;
      }
      .panel, .world-card { padding: 18px; }
      .panel ul, .panel ol { padding-left: 1.2rem; }
      .world-card {
        min-height: 210px;
        background: #fff;
        border-top: 7px solid var(--teal);
      }
      .notice {
        border-top: 7px solid var(--coral);
      }
      footer { padding: 24px 0 8px; color: var(--muted); }
      @media (max-width: 880px) {
        .hero, .grid { grid-template-columns: 1fr; }
        .hero img { min-height: auto; }
      }
    </style>
  </head>
  <body>
    <main>
      <section class="hero">
        <div>
          <p class="eyebrow">Static product page | checkout pending</p>
          <h1>${escapeHtml(product.title)}</h1>
          <div class="price">${escapeHtml(product.pricePoint)}</div>
          <p><strong>${escapeHtml(product.headline)}</strong></p>
          <p>${escapeHtml(product.summary)}</p>
          <a class="button" href="${escapeHtml(product.ctaHref)}">${escapeHtml(product.ctaLabel)}</a>
        </div>
        <img src="${basePath}${escapeHtml(product.heroImage)}" alt="">
      </section>
      <section class="panel notice">
        <h2>Checkout status</h2>
        <p>${escapeHtml(product.checkoutNote)}</p>
      </section>
      <div class="grid">
        <section class="panel">
          <h2>Included pages</h2>
          <ul>${renderList(product.includedPages)}</ul>
        </section>
        <section class="panel">
          <h2>Best uses</h2>
          <ul>${renderList(product.useCases)}</ul>
        </section>
        <section class="panel">
          <h2>Parent steps</h2>
          <ol>${renderList(product.parentSteps)}</ol>
        </section>
      </div>
      <section class="panel">
        <h2>Quest worlds in the pack</h2>
        <div class="grid">${worldCards}</div>
      </section>
      <section class="panel">
        <h2>Safety</h2>
        <p>${escapeHtml(product.safetyNote)}</p>
      </section>
      <footer><a href="${basePath}">Plot Sprout Explorer</a> product pages stay static until checkout wiring is deliberately selected.</footer>
    </main>
  </body>
</html>
`
}

if (!existsSync(collectionPath)) {
  fail(`Missing SEO collection source: ${collectionPath}`)
}

const worlds = loadWorlds()
const data = readJson(collectionPath)
for (const collection of data.collections) {
  const outputDir = resolve(publicDir, collection.slug)
  mkdirSync(outputDir, { recursive: true })
  writeFileSync(resolve(outputDir, 'index.html'), renderCollection(collection, worlds))
  console.log(`Rendered ${collection.slug}/index.html`)
}

if (!existsSync(miniUnitsPath)) {
  fail(`Missing mini-unit source: ${miniUnitsPath}`)
}

const miniUnits = readJson(miniUnitsPath)
const miniUnitIndexDir = resolve(publicDir, 'mini-units')
mkdirSync(miniUnitIndexDir, { recursive: true })
writeFileSync(resolve(miniUnitIndexDir, 'index.html'), renderMiniUnitIndex(miniUnits.units))
console.log('Rendered mini-units/index.html')

for (const unit of miniUnits.units) {
  const outputDir = resolve(miniUnitIndexDir, unit.slug)
  mkdirSync(outputDir, { recursive: true })
  writeFileSync(resolve(outputDir, 'index.html'), renderMiniUnit(unit, worlds))
  console.log(`Rendered mini-units/${unit.slug}/index.html`)
}

if (!existsSync(batch4ImagesPath)) {
  fail(`Missing Batch 4 image manifest: ${batch4ImagesPath}`)
}

const batch4Images = readJson(batch4ImagesPath)
const galleryDir = resolve(publicDir, 'world-gallery')
mkdirSync(galleryDir, { recursive: true })
writeFileSync(resolve(galleryDir, 'index.html'), renderWorldGallery(batch4Images, worlds))
console.log('Rendered world-gallery/index.html')

if (!existsSync(productsPath)) {
  fail(`Missing Batch 5 products source: ${productsPath}`)
}

const products = readJson(productsPath)
for (const product of products.products) {
  const productDir = resolve(publicDir, product.slug)
  mkdirSync(productDir, { recursive: true })
  writeFileSync(resolve(productDir, 'index.html'), renderProductPage(product, worlds))
  console.log(`Rendered ${product.slug}/index.html`)
}
