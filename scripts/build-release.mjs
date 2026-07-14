import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const packageManifest = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
const version = packageManifest.version
const tag = `v${version}`
const ref = process.env.CODETRUSS_PLUGIN_RELEASE_REF || 'HEAD'
const dist = join(root, 'dist')
const commitDate = execFileSync('git', ['show', '-s', '--format=%cI', ref], {
  cwd: root,
  encoding: 'utf8',
}).trim()

function readJsonAtRef(path) {
  return JSON.parse(execFileSync('git', ['show', `${ref}:${path}`], {
    cwd: root,
    encoding: 'utf8',
  }))
}

const committedPackage = readJsonAtRef('package.json')
if (committedPackage.version !== version) {
  throw new Error(
    `Committed ${ref} is version ${committedPackage.version}, but the working tree is ${version}; commit the release inputs before packaging`,
  )
}

for (const manifestPath of [
  'plugins/codetruss/.codex-plugin/plugin.json',
  'plugins/codetruss-claude/.claude-plugin/plugin.json',
]) {
  const manifest = readJsonAtRef(manifestPath)
  if (manifest.version !== version) {
    throw new Error(`${manifestPath} at ${ref} is ${manifest.version}, expected ${version}`)
  }
}

if (process.env.GITHUB_REF_TYPE === 'tag' && process.env.GITHUB_REF_NAME !== tag) {
  throw new Error(`Release tag ${process.env.GITHUB_REF_NAME} does not match package ${tag}`)
}

rmSync(dist, { recursive: true, force: true })
mkdirSync(dist, { recursive: true })

const packages = [
  ['openai', 'plugins/codetruss'],
  ['claude', 'plugins/codetruss-claude'],
]

for (const [target, tree] of packages) {
  const filename = `codetruss-${target}-plugin-v${version}.zip`
  const output = join(dist, filename)
  execFileSync('git', [
    'archive',
    '--format=zip',
    `--mtime=${commitDate}`,
    `--output=${output}`,
    `${ref}:${tree}`,
  ], { cwd: root, stdio: 'inherit' })
  const digest = createHash('sha256').update(readFileSync(output)).digest('hex')
  writeFileSync(`${output}.sha256`, `${digest}  ${filename}\n`)
}

process.stdout.write(`Built reproducible CodeTruss plugin archives for ${tag} from ${ref}.\n`)
