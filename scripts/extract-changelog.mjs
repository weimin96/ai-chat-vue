import { readFile, writeFile } from 'node:fs/promises'

const changelogPath = 'CHANGELOG.md'
const releaseNotesPath = '.release-notes.md'

function normalizeVersion(rawVersion) {
  return rawVersion.replace(/^refs\/tags\//, '').replace(/^v/, '')
}

function parseVersionHeading(line) {
  const match = line.match(/^##\s+\[?(v?\d+\.\d+\.\d+(?:[-+][^\]\s]+)?)\]?(?:\s+-\s+.*)?\s*$/)
  return match?.[1] ?? null
}

function findSection(lines, version) {
  const candidates = new Set([version, `v${version}`])
  let sectionStart = -1

  for (let index = 0; index < lines.length; index += 1) {
    const headingVersion = parseVersionHeading(lines[index])
    if (headingVersion && candidates.has(headingVersion)) {
      sectionStart = index + 1
      break
    }
  }

  if (sectionStart === -1) return null

  let sectionEnd = lines.length
  for (let index = sectionStart; index < lines.length; index += 1) {
    if (lines[index].startsWith('## ')) {
      sectionEnd = index
      break
    }
  }

  return lines.slice(sectionStart, sectionEnd).join('\n').trim()
}

async function main() {
  const rawVersion = process.argv[2]
  if (!rawVersion) {
    throw new Error('请传入 tag 或版本号，例如 v0.0.1')
  }

  const version = normalizeVersion(rawVersion)
  const changelog = await readFile(changelogPath, 'utf8')
  const releaseNotes = findSection(changelog.split(/\r?\n/), version)

  if (!releaseNotes) {
    throw new Error(`CHANGELOG.md 中缺少版本 ${version} 的发布说明`)
  }

  await writeFile(releaseNotesPath, `${releaseNotes}\n`, 'utf8')
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
