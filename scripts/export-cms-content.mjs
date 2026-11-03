import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
const outputPath = path.join(root, 'apps', 'web', 'src', 'lib', 'generated-content.json')
const payloadUrl = process.env.PAYLOAD_URL ?? process.env.PUBLIC_PAYLOAD_URL ?? 'http://127.0.0.1:3001'

const fetchJson = async (pathName) => {
  const response = await fetch(`${payloadUrl}${pathName}`)

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} for ${pathName}`)
  }

  return response.json()
}

const mapList = (items, mapper) => (Array.isArray(items) ? items.map(mapper) : [])

const isPublicLink = (link) => {
  try {
    const url = new URL(link.url, 'https://tdvr.dev')
    return ['http:', 'https:'].includes(url.protocol) &&
      !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
  } catch {
    return false
  }
}

const main = async () => {
  let projectsResponse
  let skillsResponse
  let profile

  try {
    ;[projectsResponse, skillsResponse, profile] = await Promise.all([
      fetchJson('/api/projects?depth=1&limit=50&sort=order,-year'),
      fetchJson('/api/skills?limit=50&sort=order,name'),
      fetchJson('/api/globals/profile')
    ])
  } catch (error) {
    console.error(`Could not export Payload content from ${payloadUrl}.`)
    console.error('Start the local CMS first with scripts\\dev.cmd and try again.')
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  }

  const content = {
    exportedAt: new Date().toISOString(),
    profile: {
      name: profile.name,
      title: profile.title,
      intro: profile.intro,
      location: profile.location,
      availability: profile.availability,
      email: profile.email,
      socials: mapList(profile.socials, (social) => ({
        label: social.label,
        url: social.url
      })).filter((social) => social.label && social.url)
    },
    projects: mapList(projectsResponse.docs, (project) => ({
      id: String(project.id),
      title: project.title,
      slug: project.slug,
      summary: project.summary,
      role: project.role,
      year: project.year,
      status: project.status,
      accent: project.accent,
      tags: mapList(project.tags, (tag) => tag.name).filter(Boolean),
      stack: mapList(project.stack, (item) => item.name).filter(Boolean),
      links: mapList(project.links, (link) => ({
        label: link.label,
        url: link.url
      })).filter((link) => link.label && link.url && isPublicLink(link))
    })).filter((project) => project.title && project.slug),
    skills: mapList(skillsResponse.docs, (skill) => ({
      id: String(skill.id),
      name: skill.name,
      area: skill.area,
      level: skill.level,
      highlight: Boolean(skill.highlight)
    })).filter((skill) => skill.name)
  }

  await writeFile(outputPath, `${JSON.stringify(content, null, 2)}\n`)
  console.log(`Exported Payload content to ${path.relative(root, outputPath)}`)
}

await main()
