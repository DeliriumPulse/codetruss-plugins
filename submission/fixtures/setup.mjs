import { execFileSync } from 'node:child_process'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

const destination = resolve(process.argv[2] || '/tmp/codetruss-plugin-fixtures')
const gitEnv = {
  ...process.env,
  GIT_AUTHOR_DATE: '2026-01-01T00:00:00Z',
  GIT_COMMITTER_DATE: '2026-01-01T00:00:00Z',
}

function run(cwd, command, args) {
  execFileSync(command, args, { cwd, env: gitEnv, stdio: 'ignore' })
}

function write(root, path, contents) {
  const target = join(root, path)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, contents)
}

const policy = `version: 1
allow:
  - src/**
  - tests/**
deny:
  - infra/production/**
  - .env*
verify:
  - npm run lint
  - npm test
receipts:
  dir: .codetruss/receipts
`

function createRepository(name, { withPolicy = true } = {}) {
  const root = join(destination, name)
  mkdirSync(root, { recursive: true })
  write(root, 'package.json', `${JSON.stringify({
    name: `codetruss-${name}-fixture`,
    private: true,
    scripts: {
      lint: 'node -e "process.exit(0)"',
      test: 'node -e "process.exit(0)"',
    },
  }, null, 2)}\n`)
  write(root, 'src/index.ts', 'export const fixture = true\n')
  write(root, 'tests/index.test.ts', 'export const fixtureTest = true\n')
  write(root, 'infra/production/main.tf', '# deliberately sensitive fixture surface\n')
  write(root, '.env.example', 'EXAMPLE_ONLY=true\n')
  if (withPolicy) write(root, '.codetruss.yml', policy)
  run(root, 'git', ['init', '-q'])
  run(root, 'git', ['config', 'user.name', 'CodeTruss Fixture'])
  run(root, 'git', ['config', 'user.email', 'reviewer@example.invalid'])
  run(root, 'git', ['add', '.'])
  run(root, 'git', ['commit', '-q', '-m', 'Initial reviewer fixture'])
  return root
}

rmSync(destination, { recursive: true, force: true })
mkdirSync(destination, { recursive: true })

createRepository('configure-boundary', { withPolicy: false })

const workingTree = createRepository('review-working-tree')
write(workingTree, 'src/rate-limit.ts', 'export const passwordResetLimit = 5\n')

const staged = createRepository('review-staged')
write(staged, 'src/staged.ts', 'export const stagedChange = true\n')
run(staged, 'git', ['add', 'src/staged.ts'])
write(staged, 'src/unstaged.ts', 'export const unstagedChange = true\n')

const hook = createRepository('diagnose-claude-hook')
write(hook, '.claude/settings.json', `${JSON.stringify({
  hooks: {
    Stop: [{
      hooks: [{ type: 'command', command: 'codetruss hooks run claude --legacy' }],
    }],
  },
}, null, 2)}\n`)

const receipt = createRepository('verify-receipt')
write(receipt, 'src/receipt.ts', 'export const receiptFixture = true\n')

process.stdout.write(`Created CodeTruss reviewer fixtures at ${destination}\n`)
