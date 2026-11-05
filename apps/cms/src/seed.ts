import { getPayload } from 'payload'

import config from './payload.config'
import type { Skill } from './payload-types'

type ProjectSeed = {
  accent: 'red' | 'cyan' | 'yellow' | 'white'
  featured: boolean
  links: { label: string; url: string }[]
  order: number
  role: string
  slug: string
  stack: { name: string }[]
  status: 'live' | 'prototype' | 'concept'
  summary: string
  tags: { name: string }[]
  title: string
  year: number
}

type SkillSeed = {
  area: Skill['area']
  highlight: boolean
  level: number
  name: string
  order: number
}

const projects: ProjectSeed[] = [
  {
    title: 'Phantom Dashboard',
    slug: 'phantom-dashboard',
    summary:
      'Een high-contrast dashboardconcept met live statuskaarten, custom filters en micro-interacties voor snelle besluitvorming.',
    role: 'Frontend, motion, UI systems',
    year: 2026,
    status: 'prototype',
    accent: 'red',
    featured: true,
    order: 1,
    tags: [{ name: 'SvelteKit' }, { name: 'Motion' }, { name: 'Dashboard' }],
    stack: [{ name: 'SvelteKit' }, { name: 'TypeScript' }, { name: 'CSS animations' }],
    links: [{ label: 'Case', url: 'http://localhost:5173/#projects' }]
  },
  {
    title: 'Payload Case Files',
    slug: 'payload-case-files',
    summary:
      'Een headless CMS setup waarin projecten, skills en profieldata via Payload beheerd worden en realtime in de portfolio landen.',
    role: 'CMS architecture, content model',
    year: 2026,
    status: 'live',
    accent: 'cyan',
    featured: true,
    order: 2,
    tags: [{ name: 'Payload CMS' }, { name: 'Content' }, { name: 'API' }],
    stack: [{ name: 'Payload' }, { name: 'Next.js' }, { name: 'SQLite' }],
    links: [{ label: 'CMS', url: 'http://localhost:3001/admin' }]
  },
  {
    title: 'Kinetic Portfolio',
    slug: 'kinetic-portfolio',
    summary:
      'Een portfolio-ervaring met diagonal cuts, comic-panel cards, sticky navigatie en keyboard-friendly interactiestates.',
    role: 'Design, frontend, accessibility',
    year: 2026,
    status: 'concept',
    accent: 'yellow',
    featured: false,
    order: 3,
    tags: [{ name: 'Portfolio' }, { name: 'Design' }, { name: 'Accessibility' }],
    stack: [{ name: 'Svelte' }, { name: 'CSS Grid' }, { name: 'Responsive design' }],
    links: [{ label: 'Preview', url: 'http://localhost:5173/' }]
  }
] 

const skills: SkillSeed[] = [
  { name: 'SvelteKit', area: 'Frontend', level: 92, highlight: true, order: 1 },
  { name: 'Payload CMS', area: 'CMS', level: 84, highlight: true, order: 2 },
  { name: 'TypeScript', area: 'Frontend', level: 88, highlight: true, order: 3 },
  { name: 'Motion Design', area: 'Motion', level: 80, highlight: false, order: 4 },
  { name: 'API Modeling', area: 'CMS', level: 82, highlight: false, order: 5 },
  { name: 'Tooling', area: 'Tooling', level: 78, highlight: false, order: 6 }
] 

const payload = await getPayload({ config })

await payload.updateGlobal({
  slug: 'profile',
  data: {
    name: 'tdvr.dev',
    title: 'Creative Svelte Developer',
    intro:
      'Ik bouw snelle, expressieve webinterfaces met scherpe interacties, sterke contentstructuur en een visuele stijl die blijft hangen.',
    location: 'Nederland',
    availability: 'Beschikbaar voor stages, freelance en creatieve webprojecten',
    email: 'hello@example.dev',
    socials: [
      { label: 'GitHub', url: 'https://github.com/tdvrdev' },
      { label: 'LinkedIn', url: 'https://linkedin.com/' }
    ]
  }
})

for (const project of projects) {
  const existing = await payload.find({
    collection: 'projects',
    limit: 1,
    where: {
      slug: {
        equals: project.slug
      }
    }
  })

  if (existing.docs[0]) {
    await payload.update({
      id: existing.docs[0].id,
      collection: 'projects',
      data: project
    })
  } else {
    await payload.create({
      collection: 'projects',
      data: project
    })
  }
}

for (const skill of skills) {
  const existing = await payload.find({
    collection: 'skills',
    limit: 1,
    where: {
      name: {
        equals: skill.name
      }
    }
  })

  if (existing.docs[0]) {
    await payload.update({
      id: existing.docs[0].id,
      collection: 'skills',
      data: skill
    })
  } else {
    await payload.create({
      collection: 'skills',
      data: skill
    })
  }
}

console.log('Portfolio CMS seed klaar.')
