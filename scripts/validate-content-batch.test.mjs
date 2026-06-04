import { execFileSync } from 'node:child_process'
import { copyFileSync, cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

function readJson(relativePath) {
  return JSON.parse(readFileSync(resolve(root, relativePath), 'utf8'))
}

function currentLocalImageCount() {
  const batch4Images = readJson('content/image-queue/2026-06-02-batch4-world-images.json').images.length
  const expansionWorldImages = readdirSync(resolve(root, 'content', 'image-queue'))
    .filter((fileName) => fileName.endsWith('-world-images.json') && fileName !== '2026-06-02-batch4-world-images.json')
    .reduce((count, fileName) => count + readJson(`content/image-queue/${fileName}`).images.length, 0)
  const productImages = readdirSync(resolve(root, 'content', 'image-queue'))
    .filter((fileName) => fileName.endsWith('-product-images.json'))
    .reduce((count, fileName) => count + readJson(`content/image-queue/${fileName}`).images.length, 0)
  const combinedImages = readdirSync(resolve(root, 'content', 'image-queue'))
    .filter((fileName) => fileName.endsWith('-images.json') && !fileName.endsWith('-world-images.json') && !fileName.endsWith('-product-images.json'))
    .reduce((count, fileName) => count + readJson(`content/image-queue/${fileName}`).images.length, 0)

  return batch4Images + expansionWorldImages + productImages + combinedImages
}

function currentProductArtifactCount() {
  return readdirSync(resolve(root, 'content', 'product-artifacts'), { withFileTypes: true }).filter(
    (entry) => entry.isFile() && entry.name.endsWith('.json'),
  ).length
}

function runVerifierExpectingFailure() {
  try {
    execFileSync('node', ['scripts/validate-content-batch.mjs'], {
      cwd: root,
      encoding: 'utf8',
      stdio: 'pipe',
    })
  } catch (error) {
    return `${error.stdout ?? ''}${error.stderr ?? ''}`
  }
  throw new Error('Expected content verifier to fail.')
}

function withRestoredPaths(paths, callback) {
  const backups = paths.map((path, index) => {
    const backupPath = resolve(root, `.tmp-validate-content-batch-${process.pid}-${index}`)
    rmSync(backupPath, { recursive: true, force: true })
    if (existsSync(path)) cpSync(path, backupPath, { recursive: true })
    return { path, backupPath, existed: existsSync(backupPath) }
  })

  try {
    return callback()
  } finally {
    for (const { path, backupPath, existed } of backups) {
      rmSync(path, { recursive: true, force: true })
      if (existed) cpSync(backupPath, path, { recursive: true })
      rmSync(backupPath, { recursive: true, force: true })
    }
  }
}

describe('content batch verifier summary', () => {
  it('reports image and artifact totals from the current manifests', () => {
    const output = execFileSync('node', ['scripts/validate-content-batch.mjs'], {
      cwd: root,
      encoding: 'utf8',
    })

    expect(output).toContain(`${currentLocalImageCount()} local world/product images`)
    expect(output).toContain(`${currentProductArtifactCount()} product artifacts`)
    expect(output).toContain('80 local world/product images')
    expect(output).toContain('53 static product pages')
    expect(output).toContain('53 product artifacts')
  })

  it('fails closed if a Batch55 generated image exists before the static page is rendered', () => {
    const imageManifest = readJson('content/image-queue/2026-06-03-batch55-images.json').images[0]
    const imagePath = resolve(
      root,
      'public/images/plotsprout/batch55/expanding-file-story-scene-chain-card-pack.jpg',
    )
    const webpPath = resolve(
      root,
      'public/images/plotsprout/batch55/expanding-file-story-scene-chain-card-pack.webp',
    )
    const sidecarPath = resolve(
      root,
      'content/image-runs/batch55/expanding-file-story-scene-chain-card-pack.json',
    )
    const productPageDir = resolve(root, 'public/expanding-file-story-scene-chain-card-pack')

    withRestoredPaths([imagePath, webpPath, sidecarPath, productPageDir], () => {
      rmSync(imagePath, { force: true })
      rmSync(webpPath, { force: true })
      rmSync(sidecarPath, { force: true })
      rmSync(productPageDir, { recursive: true, force: true })
      mkdirSync(dirname(imagePath), { recursive: true })
      mkdirSync(dirname(sidecarPath), { recursive: true })
      copyFileSync(resolve(root, 'public/images/plotsprout/batch54/accordion-folder-story-arc-card-pack.jpg'), imagePath)
      copyFileSync(resolve(root, 'public/images/plotsprout/batch54/accordion-folder-story-arc-card-pack.webp'), webpPath)
      writeFileSync(
        sidecarPath,
        `${JSON.stringify(
          {
            slug: imageManifest.slug,
            prompt: imageManifest.prompt,
            negativePrompt: imageManifest.negativePrompt,
            steps: 42,
            seed: imageManifest.seed,
            outputJpeg: imageManifest.outputJpeg,
            outputWebp: imageManifest.outputWebp,
          },
          null,
          2,
        )}\n`,
      )

      const output = runVerifierExpectingFailure()
      expect(output).toContain('static output is missing after Batch 55 generated outputs started')
    })
  })

  it('fails closed if Batch60 artifacts exist before hero image files exist', () => {
    const imagePath = resolve(
      root,
      'public/images/plotsprout/batch60/archive-drawer-story-resolution-card-pack.jpg',
    )
    const webpPath = resolve(
      root,
      'public/images/plotsprout/batch60/archive-drawer-story-resolution-card-pack.webp',
    )
    const sidecarPath = resolve(
      root,
      'content/image-runs/batch60/archive-drawer-story-resolution-card-pack.json',
    )

    withRestoredPaths([imagePath, webpPath, sidecarPath], () => {
      rmSync(imagePath, { force: true })
      rmSync(webpPath, { force: true })
      rmSync(sidecarPath, { force: true })

      const output = runVerifierExpectingFailure()
      expect(output).toContain('Batch 60 generated image output is missing after Batch 60 generated outputs started')
    })
  })

  it('fails closed if Batch55 artifact generation leaves a partial artifact set', () => {
    const artifactDir = resolve(root, 'product-build/expanding-file-story-scene-chain-card-pack')
    const pdfPath = resolve(artifactDir, 'Expanding-File-Story-Scene-Chain-Card-Pack.pdf')
    const product = readJson('content/products/batch5-products.json').products.find(
      (candidate) => candidate.slug === 'expanding-file-story-scene-chain-card-pack',
    )
    const productPageDir = resolve(root, 'public/expanding-file-story-scene-chain-card-pack')
    const productPagePath = resolve(productPageDir, 'index.html')

    withRestoredPaths([artifactDir, productPageDir], () => {
      rmSync(artifactDir, { recursive: true, force: true })
      rmSync(productPageDir, { recursive: true, force: true })
      mkdirSync(artifactDir, { recursive: true })
      mkdirSync(productPageDir, { recursive: true })
      writeFileSync(pdfPath, '%PDF-1.7\n%%EOF\n')
      writeFileSync(
        productPagePath,
        [
          '<!doctype html>',
          '<html lang="en">',
          '<head>',
          `<title>${product.title}</title>`,
          `<meta name="description" content="${product.summary}.">`,
          '</head>',
          '<body>',
          `<h1>${product.title}</h1>`,
          `<p>${product.pricePoint}</p>`,
          `<p>${product.checkoutNote}</p>`,
          '</body>',
          '</html>',
        ].join('\n'),
      )

      const output = runVerifierExpectingFailure()
      expect(output).toContain('artifact set is incomplete after artifact generation started')
      expect(output).toContain('expanding-file-story-scene-chain-card-pack.zip')
    })
  })
})
