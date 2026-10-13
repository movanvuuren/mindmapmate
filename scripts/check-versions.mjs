// Fails unless the version agrees across manifest.json, package.json, package-lock.json and versions.json, and
// versions.json maps it to the manifest's minAppVersion (what Obsidian's release tooling and ship.mjs rely on).
import { readFileSync } from 'node:fs'

const json = file => JSON.parse(readFileSync(file, 'utf8'))
const manifest = json('manifest.json'), pkg = json('package.json'), lock = json('package-lock.json'), versions = json('versions.json')
const problems = []
const expect = (what, actual) => { if (actual !== manifest.version) problems.push(`${what} is ${actual}, manifest.json is ${manifest.version}`) }
expect('package.json', pkg.version)
expect('package-lock.json', lock.version)
expect('package-lock.json packages[""]', lock.packages[''].version)
if (versions[manifest.version] !== manifest.minAppVersion) {
  problems.push(`versions.json maps ${manifest.version} to ${versions[manifest.version]}, expected ${manifest.minAppVersion}`)
}
if (problems.length) {
  console.error('check-versions:\n  ' + problems.join('\n  '))
  process.exit(1)
}
console.log(`check-versions: ${manifest.version} agrees everywhere`)
