export type Project = {
  id: string
  title: string
  slug: string
  summary: string
  role: string
  year: number
  status: 'live' | 'prototype' | 'concept'
  accent: 'red' | 'cyan' | 'yellow' | 'white'
  tags: string[]
  stack: string[]
  links: { label: string; url: string }[]
}

export type Skill = {
  id: string
  name: string
  area: 'Frontend' | 'CMS' | 'Motion' | 'Tooling'
  level: number
  highlight: boolean
}

export type Profile = {
  name: string
  title: string
  intro: string
  location: string
  availability: string
  email: string
  socials: { label: string; url: string }[]
}

export const fallbackProfile: Profile = {
  name: 'Tdvr.dev',
  title: 'Creative Svelte Developer',
  intro:
    'Ik bouw snelle, expressieve webinterfaces met scherpe interacties, sterke contentstructuur en een visuele stijl die blijft hangen.',
  location: 'Nederland',
  availability: 'Beschikbaar voor stages, freelance en creatieve webprojecten',
  email: 'hello@example.dev',
  socials: [
    { label: 'GitHub', url: 'https://github.com/' },
    { label: 'LinkedIn', url: 'https://linkedin.com/' }
  ]
}

export const fallbackProjects: Project[] = [
  {
    id: 'project-01',
    title: 'Phantom Dashboard',
    slug: 'phantom-dashboard',
    summary:
      'Een high-contrast dashboardconcept met live statuskaarten, custom filters en micro-interacties voor snelle besluitvorming.',
    role: 'Frontend, motion, UI systems',
    year: 2026,
    status: 'prototype',
    accent: 'red',
    tags: ['SvelteKit', 'Motion', 'Dashboard'],
    stack: ['SvelteKit', 'TypeScript', 'CSS animations'],
    links: [{ label: 'Case', url: '#projects' }]
  },
  {
    id: 'project-02',
    title: 'Payload Case Files',
    slug: 'payload-case-files',
    summary:
      'Een headless CMS setup waarin projecten, skills en profieldata via Payload beheerd worden en realtime in de portfolio landen.',
    role: 'CMS architecture, content model',
    year: 2026,
    status: 'live',
    accent: 'cyan',
    tags: ['Payload CMS', 'Content', 'API'],
    stack: ['Payload', 'Next.js', 'SQLite'],
    links: [{ label: 'CMS', url: 'http://localhost:3001/admin' }]
  },
  {
    id: 'project-03',
    title: 'Kinetic Portfolio',
    slug: 'kinetic-portfolio',
    summary:
      'Een portfolio-ervaring met diagonal cuts, comic-panel cards, sticky navigatie en keyboard-friendly interactiestates.',
    role: 'Design, frontend, accessibility',
    year: 2026,
    status: 'concept',
    accent: 'yellow',
    tags: ['Portfolio', 'Design', 'Accessibility'],
    stack: ['Svelte', 'CSS Grid', 'Responsive design'],
    links: [{ label: 'Preview', url: '#top' }]
  }
]

export const fallbackSkills: Skill[] = [
  { id: 'skill-01', name: 'SvelteKit', area: 'Frontend', level: 92, highlight: true },
  { id: 'skill-02', name: 'Payload CMS', area: 'CMS', level: 84, highlight: true },
  { id: 'skill-03', name: 'TypeScript', area: 'Frontend', level: 88, highlight: true },
  { id: 'skill-04', name: 'Motion Design', area: 'Motion', level: 80, highlight: false },
  { id: 'skill-05', name: 'API Modeling', area: 'CMS', level: 82, highlight: false },
  { id: 'skill-06', name: 'Tooling', area: 'Tooling', level: 78, highlight: false }
]
