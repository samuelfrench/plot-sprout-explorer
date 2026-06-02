import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const workflowsDir = resolve(import.meta.dirname, '..', '.github', 'workflows')
const workflowFiles = readdirSync(workflowsDir).filter((file) => file.endsWith('.yml') || file.endsWith('.yaml'))

if (workflowFiles.length !== 1 || workflowFiles[0] !== 'deploy.yml') {
  throw new Error(`Expected only deploy.yml workflow, found: ${workflowFiles.join(', ')}`)
}

const deploy = readFileSync(resolve(workflowsDir, 'deploy.yml'), 'utf8')
const blockedPatterns = [
  /schedule:/i,
  /cron:/i,
  /content:batch/i,
  /image:starter/i,
  /generate.*content/i,
  /create-content-batch/i,
  /generate_story_images_local/i,
]

if (!deploy.includes('self-hosted') || !deploy.includes('Linux') || !deploy.includes('X64')) {
  throw new Error('Deploy workflow must run on local self-hosted Linux X64 runners.')
}

if (!/push:\s*\n\s*branches:\s*\[\s*main\s*\]/m.test(deploy)) {
  throw new Error('Deploy workflow must deploy from push to main.')
}

for (const pattern of blockedPatterns) {
  if (pattern.test(deploy)) {
    throw new Error(`Deploy workflow includes blocked content-generation automation: ${pattern}`)
  }
}

console.log('Workflow policy verified: push deploy only, self-hosted runner, no content generation.')
