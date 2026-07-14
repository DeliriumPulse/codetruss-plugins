import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (path) => readFile(join(root, path), 'utf8')
const json = async (path) => JSON.parse(await read(path))
const packageManifest = await json('package.json')

const canonicalSkill = await read('skills/codetruss/SKILL.md')
const claudeSkill = await read('plugins/codetruss-claude/skills/codetruss/SKILL.md')
const codexSkill = await read('plugins/codetruss/skills/codetruss/SKILL.md')
assert.equal(claudeSkill, canonicalSkill, 'Claude skill must match the canonical Agent Skill')
assert.equal(codexSkill, canonicalSkill, 'Codex skill must match the canonical Agent Skill')
assert.doesNotMatch(canonicalSkill, /\bTODO\b|\[TODO:/)
assert.match(canonicalSkill, /^---\nname: codetruss\ndescription: .{80,1024}\n---/s)

for (const required of [
  'obtain explicit consent before downloading or installing software',
  'Do not run `--llm`, `codetruss auth login`, or `codetruss sync` unless',
  'Do not broaden `allow`, remove `deny`, add `--no-verify`',
  'exit `1` as `REVIEW_REQUIRED`',
  'post-generation integrity evidence',
]) {
  assert.ok(canonicalSkill.includes(required), `missing trust-boundary rule: ${required}`)
}

const canonicalOpenAi = await read('skills/codetruss/agents/openai.yaml')
assert.equal(
  await read('plugins/codetruss-claude/skills/codetruss/agents/openai.yaml'),
  canonicalOpenAi,
)
assert.equal(
  await read('plugins/codetruss/skills/codetruss/agents/openai.yaml'),
  canonicalOpenAi,
)
assert.match(canonicalOpenAi, /default_prompt: "Use \$codetruss /)

const claudeManifest = await json('plugins/codetruss-claude/.claude-plugin/plugin.json')
const codexManifest = await json('plugins/codetruss/.codex-plugin/plugin.json')
for (const manifest of [claudeManifest, codexManifest]) {
  assert.equal(manifest.name, 'codetruss')
  assert.match(manifest.version, /^\d+\.\d+\.\d+$/)
  assert.equal(manifest.version, packageManifest.version)
  assert.equal(manifest.license, 'MIT')
  assert.equal(manifest.author.name, 'CodeTruss')
  assert.equal(manifest.author.email, 'zack@codetruss.com')
  assert.equal(manifest.skills, './skills/')
  assert.match(manifest.homepage, /^https:\/\/codetruss\.com\//)
}
assert.equal(codexManifest.interface.privacyPolicyURL, 'https://codetruss.com/privacy')
assert.equal(codexManifest.interface.termsOfServiceURL, 'https://codetruss.com/terms')
assert.ok(!('mcpServers' in codexManifest), 'local-first wrapper must not add an MCP server')
assert.ok(!('hooks' in codexManifest), 'plugin must delegate hooks to the tested CLI installer')
assert.equal(
  codexManifest.interface.shortDescription,
  'Local acceptance gate for coding-agent changes',
)
for (const assetField of ['composerIcon', 'logo', 'logoDark']) {
  assert.equal(codexManifest.interface[assetField], './assets/codetruss-mark-512.png')
}
const brandMark = await readFile(join(root, 'plugins/codetruss/assets/codetruss-mark-512.png'))
assert.equal(
  createHash('sha256').update(brandMark).digest('hex'),
  '2c46b3aca474ec80918333b6331326ef6f1df6d4a09d48c4f4f9f128dc3d45b8',
)

const claudeMarketplace = await json('.claude-plugin/marketplace.json')
assert.equal(claudeMarketplace.name, 'codetruss')
assert.equal(claudeMarketplace.plugins[0].source, './plugins/codetruss-claude')
assert.equal(claudeMarketplace.version, packageManifest.version)
assert.ok(!('version' in claudeMarketplace.plugins[0]))
const codexMarketplace = await json('.agents/plugins/marketplace.json')
assert.equal(codexMarketplace.name, 'codetruss')
assert.equal(codexMarketplace.plugins[0].source.path, './plugins/codetruss')
assert.deepEqual(codexMarketplace.plugins[0].policy, {
  installation: 'AVAILABLE',
  authentication: 'ON_INSTALL',
  products: ['CODEX'],
})

const submission = await read('submission/openai.md')
assert.equal((submission.match(/^### Positive \d+:/gm) ?? []).length, 5)
assert.equal((submission.match(/^### Negative \d+:/gm) ?? []).length, 3)
assert.match(submission, /Status: \*\*Prepared and locally validated; not submitted or approved\.\*\*/)
assert.match(submission, /Short description: Local acceptance gate for coding-agent changes\./)
assert.match(submission, /Requires the separately installed free CodeTruss CLI/)
assert.match(submission, /Availability:/)
assert.match(submission, /submission\/fixtures\/setup\.mjs/)

const claudeSubmission = await read('submission/claude.md')
assert.match(claudeSubmission, /reviewed community marketplace/)
assert.match(claudeSubmission, /not submitted or approved/)
assert.match(claudeSubmission, /Submitter email: `zack@codetruss\.com`/)
assert.match(claudeSubmission, /Supported platform: `Claude Code`/)
assert.match(claudeSubmission, /Wrapper license: `MIT`/)
assert.match(claudeSubmission, /## Example use cases/)
assert.doesNotMatch(claudeSubmission, /It never uploads code/)
assert.match(claudeSubmission, /Optional\n> `--llm` sends the reviewed diff directly/)

const publisherChecklist = await read('submission/PUBLISHER_CHECKLIST.md')
assert.match(publisherChecklist, /Apps Management: Write/)
assert.match(publisherChecklist, /gate the listing to Codex/)
assert.match(publisherChecklist, /Select `Claude Code` only/)
assert.match(publisherChecklist, /does not satisfy identity verification/)

const readme = await read('README.md')
assert.doesNotMatch(readme, /official listing remains pending review/)
assert.match(readme, /official marketplace is separately curated/)

process.stdout.write('CodeTruss Claude, Codex, and Agent Skills packages validated.\n')
