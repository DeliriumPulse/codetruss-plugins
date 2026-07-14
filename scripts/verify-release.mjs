import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { setTimeout } from 'node:timers/promises'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')

function buildAndHash() {
  execFileSync(process.execPath, [join(root, 'scripts/build-release.mjs')], {
    cwd: root,
    stdio: 'inherit',
  })
  return Object.fromEntries(
    readdirSync(dist).sort().map((name) => [
      name,
      createHash('sha256').update(readFileSync(join(dist, name))).digest('hex'),
    ]),
  )
}

const first = buildAndHash()
await setTimeout(1_100)
const second = buildAndHash()
assert.deepEqual(second, first, 'release archives changed across identical builds')
assert.equal(Object.keys(first).filter((name) => name.endsWith('.zip')).length, 2)
assert.equal(Object.keys(first).filter((name) => name.endsWith('.sha256')).length, 2)

process.stdout.write('CodeTruss plugin release archives are byte-for-byte reproducible.\n')
