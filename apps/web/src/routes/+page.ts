import {
  fallbackProfile,
  fallbackProjects,
  fallbackSkills,
  type Profile,
  type Project,
  type Skill
} from '$lib/content'
import generatedContent from '$lib/generated-content.json'

const payloadUrl = import.meta.env.PUBLIC_PAYLOAD_URL ?? 'http://localhost:3001'
const hasPublicPayloadUrl = Boolean(import.meta.env.PUBLIC_PAYLOAD_URL)

export const prerender = true

type PayloadList<T> = {
  docs?: T[]
}

type PayloadProject = {
  id: string
  title: string
  slug: string
  summary?: string
  role?: string
  year?: number
  status?: Project['status']
  accent?: Project['accent']
  tags?: { name?: string }[]
  stack?: { name?: string }[]
  links?: { label?: string; url?: string }[]
}

type PayloadSkill = {
  id: string
  name: string
  area?: Skill['area']
  level?: number
  highlight?: boolean
}

type PayloadProfile = Partial<Profile>

type GeneratedContent = {
  profile?: Partial<Profile>
  projects?: Project[]
  skills?: Skill[]
}

const isPublicLink = (link: { url: string }) => {
  try {
    const url = new URL(link.url, 'https://tdvr.dev')
    return ['http:', 'https:'].includes(url.protocol) &&
      !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
  } catch {
    return false
  }
}

const fetchJson = async <T>(fetchFn: typeof fetch, path: string): Promise<T | null> => {
  try {
    const response = await fetchFn(`${payloadUrl}${path}`)

    if (!response.ok) {
      return null
    }

    return (await response.json()) as T
  } catch {
    return null
  }
}

const mapProject = (project: PayloadProject): Project => ({
  id: project.id,
  title: project.title,
  slug: project.slug,
  summary: project.summary ?? '',
  role: project.role ?? 'Design & development',
  year: project.year ?? new Date().getFullYear(),
  status: project.status ?? 'concept',
  accent: project.accent ?? 'red',
  tags: project.tags?.map((tag) => tag.name).filter(Boolean) as string[],
  stack: project.stack?.map((item) => item.name).filter(Boolean) as string[],
  links:
    project.links
      ?.filter((link) => link.label && link.url)
      .map((link) => ({ label: link.label as string, url: link.url as string })) ?? []
})

export const load = async ({ fetch }) => {
  if (import.meta.env.PROD) {
    const generated = generatedContent as GeneratedContent

    return {
      payloadUrl: import.meta.env.PUBLIC_PAYLOAD_URL ?? '',
      showCmsLink: hasPublicPayloadUrl,
      profile: {
        ...fallbackProfile,
        ...(generated.profile ?? {})
      },
      projects: (generated.projects?.length ? generated.projects : fallbackProjects).map((project) => ({
        ...project,
        links: project.links.filter(isPublicLink)
      })),
      skills: generated.skills?.length ? generated.skills : fallbackSkills
    }
  }

  const [projectResponse, skillResponse, profileResponse] = await Promise.all([
    fetchJson<PayloadList<PayloadProject>>(
      fetch,
      '/api/projects?depth=1&limit=12&sort=order,-year'
    ),
    fetchJson<PayloadList<PayloadSkill>>(fetch, '/api/skills?limit=20&sort=order,name'),
    fetchJson<PayloadProfile>(fetch, '/api/globals/profile')
  ])

  const projects = projectResponse?.docs?.length
    ? projectResponse.docs.map(mapProject)
    : fallbackProjects

  const skills = skillResponse?.docs?.length
    ? skillResponse.docs.map((skill) => ({
        id: skill.id,
        name: skill.name,
        area: skill.area ?? 'Frontend',
        level: skill.level ?? 75,
        highlight: skill.highlight ?? false
      }))
    : fallbackSkills

  const profile: Profile = {
    ...fallbackProfile,
    ...(profileResponse ?? {})
  }

  return {
    payloadUrl,
    showCmsLink: true,
    profile,
    projects,
    skills
  }
}
