import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const workflowsDir = resolve(import.meta.dirname, '..', '.github', 'workflows')
const blockedPatterns = [
  /schedule:/i,
  /cron:/i,
  /content:batch/i,
  /npm\s+run\s+image:/i,
  /\bimage:(starter|batch\d+)\b/i,
  /generate.*content/i,
  /create-content-batch/i,
  /generate_story_images_local/i,
]

export function verifyWorkflowPolicy(workflowFiles, deploy) {
  if (workflowFiles.length !== 1 || workflowFiles[0] !== 'deploy.yml') {
    throw new Error(`Expected only deploy.yml workflow, found: ${workflowFiles.join(', ')}`)
  }

  if (!deploy.includes('self-hosted') || !deploy.includes('Linux') || !deploy.includes('X64')) {
    throw new Error('Deploy workflow must run on local self-hosted Linux X64 runners.')
  }

  if (!/push:\s*\n\s*branches:\s*\[\s*main\s*\]/m.test(deploy)) {
    throw new Error('Deploy workflow must deploy from push to main.')
  }

  if (/cache:\s*npm/i.test(deploy)) {
    throw new Error('Do not enable setup-node npm caching on the shared local runner cache.')
  }

  for (const pattern of blockedPatterns) {
    if (pattern.test(deploy)) {
      throw new Error(`Deploy workflow includes blocked content-generation automation: ${pattern}`)
    }
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const workflowFiles = readdirSync(workflowsDir).filter((file) => file.endsWith('.yml') || file.endsWith('.yaml'))
  const deploy = readFileSync(resolve(workflowsDir, 'deploy.yml'), 'utf8')
  verifyWorkflowPolicy(workflowFiles, deploy)
  console.log('Workflow policy verified: push deploy only, self-hosted runner, no content generation, no npm cache.')
}
