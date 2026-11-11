<script lang="ts">
  import { onMount } from 'svelte'
  import { browser } from '$app/environment'
  import { cubicOut } from 'svelte/easing'
  import { Tween } from 'svelte/motion'
  import type { Project } from '$lib/content'
  import type { PageData } from './$types'

  let { data }: { data: PageData } = $props()
  let progress = $state(0)
  let pointerX = $state(50)
  let pointerY = $state(32)
  let skillsNode: HTMLDivElement | undefined
  let activeSection = $state('top-hero')
  let selected = $state<Project | null>(null)
  let selectedIndex = $state(0)
  let dialogNode: HTMLDialogElement | undefined
  let skillFilter = $state('Alle')

  // Zonder JavaScript staan de meters direct op hun eindwaarde.
  const meter = new Tween(browser ? 0 : 1, { duration: 1200, easing: cubicOut })

  const navItems = [
    { id: 'projects', label: 'Projecten' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Contact' }
  ]

  const navLink =
    'relative py-2 transition hover:text-paper after:absolute after:inset-x-0 after:bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:bg-loud-red after:transition-transform hover:after:scale-x-100 focus-visible:after:scale-x-100'

  const skillAreas = $derived(['Alle', ...new Set(data.skills.map((skill) => skill.area))])
  const visibleSkills = $derived(
    skillFilter === 'Alle' ? data.skills : data.skills.filter((skill) => skill.area === skillFilter)
  )

  const fileNumber = (index: number) => String(index + 1).padStart(2, '0')

  const prefersReducedMotion = () =>
    browser && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const fillMeters = () => {
    if (prefersReducedMotion()) {
      meter.set(1, { duration: 0 })
      return
    }

    meter.set(0, { duration: 0 })
    meter.set(1)
  }

  const setSkillFilter = (area: string) => {
    skillFilter = area
    fillMeters()
  }

  const openDossier = (project: Project, index: number) => {
    selected = project
    selectedIndex = index
    dialogNode?.showModal()
  }

  const stepDossier = (step: number) => {
    const total = data.projects.length
    selectedIndex = (selectedIndex + step + total) % total
    selected = data.projects[selectedIndex]
  }

  const dossierKeys = (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight') stepDossier(1)
    if (event.key === 'ArrowLeft') stepDossier(-1)
  }

  let revealObserver: IntersectionObserver | undefined

  const reveal = (node: HTMLElement, delay = 0) => {
    revealObserver ??= new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            revealObserver?.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    )

    node.style.setProperty('--reveal-delay', `${delay}ms`)
    revealObserver.observe(node)

    return { destroy: () => revealObserver?.unobserve(node) }
  }

  const tilt = (node: HTMLElement) => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || prefersReducedMotion()) {
      return
    }

    const move = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width
      const y = (event.clientY - rect.top) / rect.height
      // Brede kaarten kantelen minder, zodat de randen rustig blijven.
      const strength = Math.min(5, 1800 / rect.width)

      node.style.setProperty('--mx', `${x * 100}%`)
      node.style.setProperty('--my', `${y * 100}%`)
      node.style.setProperty('--ry', `${(x - 0.5) * strength}deg`)
      node.style.setProperty('--rx', `${(0.5 - y) * strength}deg`)
    }

    const leave = () => {
      node.style.setProperty('--rx', '0deg')
      node.style.setProperty('--ry', '0deg')
    }

    node.addEventListener('pointermove', move)
    node.addEventListener('pointerleave', leave)

    return {
      destroy: () => {
        node.removeEventListener('pointermove', move)
        node.removeEventListener('pointerleave', leave)
      }
    }
  }

  const statusLabels = {
    live: 'Live',
    prototype: 'Prototype',
    concept: 'Concept'
  } as const

  const statusTone = {
    live: 'text-[#5dc8b4]',
    prototype: 'text-charge-yellow',
    concept: 'text-loud-red'
  } as const

  const accentPanel = {
    red: 'before:bg-loud-red',
    cyan: 'before:bg-cyber-cyan',
    yellow: 'before:bg-charge-yellow',
    white: 'before:bg-paper'
  } as const

  const tickerItems = ['Projecten', 'Ontwerp', 'Realisatie', 'Skills', 'Ervaringen']

  const processCards = [
    {
      title: 'Requirements',
      text: 'Ik breng het doel, de gebruikers en de eisen in kaart. Zo bepaal ik wat het project moet opleveren.'
    },
    {
      title: 'Ontwerp',
      text: 'Ik maak schetsen en visualisaties om uit te werken hoe het ontwerp eruitziet en hoe het gebruikt wordt.'
    },
    {
      title: 'Realisatie',
      text: 'Ik bouw en test het ontwerp. Daarna laat ik het resultaat zien en leg ik vast wat ik heb geleerd.'
    },
    {
      title: 'Oplevering',
      text: 'Ik draag het resultaat over en documenteer wat is opgeleverd en hoe je ermee verder kunt.'
    }
  ]

  const skillDots = (level: number) => Math.max(1, Math.min(5, Math.round(level / 20)))

  onMount(() => {
    const updateProgress = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      progress = maxScroll > 0 ? Math.min(100, (window.scrollY / maxScroll) * 100) : 0
    }

    const updatePointer = (event: PointerEvent) => {
      pointerX = (event.clientX / window.innerWidth) * 100
      pointerY = (event.clientY / window.innerHeight) * 100
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          fillMeters()
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    if (skillsNode) {
      observer.observe(skillsNode)
    }

    // Houdt bij welke sectie in beeld is, voor de navigatie.
    const spy = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            activeSection = entry.target.id
          }
        }
      },
      { rootMargin: '-45% 0px -50% 0px' }
    )

    for (const id of ['top-hero', ...navItems.map((item) => item.id)]) {
      const section = document.getElementById(id)
      if (section) spy.observe(section)
    }

    const burst = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.button !== 0 || prefersReducedMotion()) return

      const star = document.createElement('span')
      star.className = 'click-burst'
      star.style.left = `${event.clientX}px`
      star.style.top = `${event.clientY}px`
      star.addEventListener('animationend', () => star.remove(), { once: true })
      document.body.append(star)
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('pointermove', updatePointer, { passive: true })
    window.addEventListener('pointerdown', burst, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('pointermove', updatePointer)
      window.removeEventListener('pointerdown', burst)
      observer.disconnect()
      spy.disconnect()
    }
  })
</script>

<svelte:head>
  <title>{data.profile.name} | Portfolio</title>
  <link rel="canonical" href="https://tdvr.dev/" />
  <meta property="og:site_name" content="tdvr.dev" />
  <meta property="og:url" content="https://tdvr.dev/" />
</svelte:head>

<div
  id="top"
  class="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_88%_12%,rgba(0,217,255,.14),transparent_20rem),linear-gradient(135deg,rgba(217,4,41,.34)_0_12%,transparent_12%_100%),#050505]"
  style={`--progress: ${progress}%; --pointer-x: ${pointerX}%; --pointer-y: ${pointerY}%`}
>
  <div aria-hidden="true" class="intro-wipe"><span></span><span></span><span></span></div>
  <div
    aria-hidden="true"
    class="fixed left-0 top-0 z-50 h-1 w-[var(--progress)] bg-gradient-to-r from-loud-red via-[#ff6b35] to-charge-yellow shadow-[0_0_1rem_rgba(217,4,41,.8)] transition-[width] duration-75"
  ></div>
  <div
    aria-hidden="true"
    class="pointer-events-none fixed inset-0 z-[2] opacity-[.18] mix-blend-screen [background-image:radial-gradient(circle,rgba(255,255,255,.92)_1px,transparent_1.5px),linear-gradient(45deg,rgba(255,255,255,.12)_25%,transparent_25%)] [background-size:10px_10px,6px_6px]"
  ></div>
  <div
    aria-hidden="true"
    class="pointer-events-none fixed inset-0 z-[2] animate-lines-drift opacity-20 [background:linear-gradient(112deg,transparent_0_38%,rgba(255,255,255,.86)_38%_38.2%,transparent_38.2%),linear-gradient(112deg,transparent_0_65%,rgba(239,16,25,.9)_65%_65.4%,transparent_65.4%),linear-gradient(112deg,transparent_0_80%,rgba(0,217,255,.85)_80%_80.15%,transparent_80.15%)] motion-reduce:animate-none"
  ></div>
  <div
    aria-hidden="true"
    class="pointer-events-none fixed inset-0 z-[1] opacity-[.55] [background:radial-gradient(circle_at_var(--pointer-x)_var(--pointer-y),rgba(0,217,255,.18),transparent_16rem),radial-gradient(circle_at_calc(100%_-_var(--pointer-x))_18%,rgba(217,4,41,.24),transparent_18rem)]"
  ></div>

  <header
    class="fixed inset-x-0 top-0 z-20 flex items-center justify-between gap-4 border-b-2 border-loud-red bg-ink/95 px-4 py-4 font-display backdrop-blur-xl md:px-16 max-[900px]:absolute max-[900px]:items-start max-sm:grid"
  >
    <a class="flex items-center gap-3 font-black uppercase tracking-[.1em]" href="#top" aria-label="{data.profile.name} home">
      <span
        class="grid size-9 place-items-center bg-loud-red text-sm font-black text-white [clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]"
        >T</span
      >
      <span>{data.profile.name}</span>
    </a>

    <nav
      class="flex flex-wrap items-center justify-end gap-x-6 gap-y-2 text-xs font-black uppercase tracking-[.22em] text-paper/55 max-sm:justify-start"
      aria-label="Hoofdnavigatie"
    >
      {#each navItems as item}
        <a
          class={`${navLink} ${activeSection === item.id ? 'text-paper after:scale-x-100' : ''}`}
          href={`#${item.id}`}
          aria-current={activeSection === item.id ? 'true' : undefined}>{item.label}</a
        >
      {/each}
      {#if data.showCmsLink}
        <a class="relative py-2 text-[#5dc8b4] after:absolute after:inset-x-0 after:bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:bg-loud-red after:transition-transform hover:after:scale-x-100 focus-visible:after:scale-x-100" href="{data.payloadUrl}/admin">CMS</a>
      {/if}
    </nav>
  </header>

  <section
    id="top-hero"
    class="relative z-[3] grid min-h-[92vh] grid-cols-1 items-center overflow-hidden px-4 pb-16 pt-32 md:px-16 max-[900px]:min-h-[96vh] max-[900px]:items-start max-sm:pt-32"
    aria-labelledby="hero-title"
  >
    <img
      class="absolute inset-0 size-full object-cover object-center opacity-70 contrast-110 saturate-110 max-[900px]:object-[36%_center]"
      src="/assets/hero-comic-noir.png"
      alt="Grafische comic-noir illustratie van een developer in een rode en zwarte stad"
    />
    <div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,.52),rgba(5,5,5,.12)_48%,rgba(5,5,5,.58)),linear-gradient(180deg,rgba(5,5,5,.12),rgba(5,5,5,.85))]"></div>
    <div class="absolute inset-0 bg-[linear-gradient(rgba(217,4,41,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(217,4,41,.07)_1px,transparent_1px)] bg-[length:52px_52px]"></div>
    <div class="absolute inset-x-0 bottom-[-1px] h-32 bg-gradient-to-b from-transparent to-ink"></div>

    <span aria-hidden="true" class="absolute right-[30%] top-[-5%] h-[110%] w-1 rotate-12 bg-loud-red opacity-20"></span>
    <span aria-hidden="true" class="absolute right-[36%] top-[-5%] h-[110%] w-0.5 rotate-12 bg-loud-red opacity-10"></span>
    <span aria-hidden="true" class="absolute right-[24%] top-[-5%] h-[110%] w-0.5 rotate-12 bg-charge-yellow opacity-10"></span>

    <div class="relative z-[2] w-full max-w-3xl animate-slam-in [animation-delay:380ms] motion-reduce:animate-none">
      <p
        class="mb-5 inline-flex items-center gap-2 bg-loud-red px-3 py-1 font-display text-[.66rem] font-black uppercase tracking-[.28em] text-white [clip-path:polygon(0_0,100%_0,96%_100%,4%_100%)] before:size-1.5 before:animate-p5-spin before:bg-charge-yellow before:content-[''] before:[clip-path:polygon(50%_0,100%_50%,50%_100%,0_50%)] motion-reduce:before:animate-none"
      >
        Persoonlijk archief
      </p>
      <h1
        id="hero-title"
        aria-label={data.profile.name}
        class="mb-2 max-w-[11ch] break-words font-display text-6xl font-black uppercase leading-[.88] tracking-tight text-paper [text-shadow:.06em_.06em_0_#9b0020,-.025em_-.025em_0_rgba(255,210,63,.34)] max-[900px]:text-5xl max-sm:text-[3.55rem]"
      >
        {#each [...data.profile.name] as letter, index}<span aria-hidden="true" class="hero-letter" style={`--i: ${index}`}>{letter}</span>{/each}
      </h1>
      <p
        class="mb-5 w-fit max-w-full rotate-[-1deg] bg-loud-red px-3 py-2 font-display text-sm font-black uppercase tracking-[.24em] text-white [clip-path:polygon(0_0,100%_12%,96%_100%,3%_84%)]"
      >
        {data.profile.title}
      </p>

      <p class="mb-7 max-w-xl text-xl leading-8 text-paper/75 [text-shadow:0_2px_18px_rgba(0,0,0,.8)] max-sm:text-base">
        {data.profile.intro}
      </p>

      <div class="flex flex-wrap gap-3 max-sm:grid">
        <a class="inline-flex min-h-12 items-center justify-center bg-loud-red px-6 py-3 font-display text-xs font-black uppercase tracking-[.2em] text-white shadow-[4px_4px_0_rgba(0,0,0,.75)] transition [clip-path:polygon(0_0,100%_0,96%_100%,4%_100%)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:brightness-125 focus-visible:-translate-x-0.5 focus-visible:-translate-y-0.5 max-sm:w-full" href="#projects">Naar projecten</a>
        <a class="inline-flex min-h-12 items-center justify-center border border-paper/35 bg-transparent px-6 py-3 font-display text-xs font-black uppercase tracking-[.2em] text-paper shadow-[3px_3px_0_rgba(217,4,41,.36)] transition [clip-path:polygon(0_0,100%_0,96%_100%,4%_100%)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-loud-red/15 focus-visible:-translate-x-0.5 focus-visible:-translate-y-0.5 max-sm:w-full" href="#skills">Naar skills</a>
      </div>

      <aside
        class="mt-8 w-fit max-w-full border border-loud-red/35 border-l-4 border-l-loud-red bg-[#111118]/90 px-5 py-3 [clip-path:polygon(0_0,100%_0,97%_100%,3%_100%)]"
        aria-label="Archiefindex"
      >
        <span class="mb-1 block font-display text-[.65rem] font-black uppercase tracking-[.24em] text-[#ff7b80]">◆ Archiefindex</span>
        <p class="font-display text-sm text-paper">{data.projects.length} projecten <span aria-hidden="true" class="px-1 text-loud-red">/</span> {data.skills.length} skills</p>
      </aside>
    </div>

    <div
      aria-hidden="true"
      class="absolute right-[min(38%,320px)] top-[22vh] z-[3] rotate-[3deg] bg-loud-red px-3 py-2 font-display text-[.62rem] font-black uppercase tracking-[.18em] text-white [clip-path:polygon(0_8%,100%_0,92%_100%,8%_92%)] max-[900px]:right-6 max-[900px]:top-auto max-[900px]:bottom-56 max-sm:hidden"
    >
      Scroll
      <strong class="mt-1 block text-3xl leading-none">{Math.round(progress)}%</strong>
    </div>
  </section>

  <section
    class="relative z-[5] overflow-hidden border-y border-black/50 bg-loud-red py-2 text-white rotate-[-1deg] scale-x-[1.03]"
    aria-label="Inhoud van het archief"
  >
    <div class="flex w-max animate-ticker [will-change:transform] motion-reduce:animate-none">
      {#each [0, 1] as copy}
        <div class="flex w-max min-w-[100vw] shrink-0 justify-around" aria-hidden={copy === 1}>
          {#each tickerItems as item}
            <span class="inline-flex min-h-10 items-center whitespace-nowrap px-7 font-display text-xs font-black uppercase tracking-[.26em] after:ml-7 after:text-[.5rem] after:opacity-70 after:content-['◆'] max-sm:text-[.68rem]">{item}</span>
          {/each}
        </div>
      {/each}
    </div>
  </section>

  <main class="relative z-[4] bg-[#111118]">
    <section class="scroll-mt-20 px-4 py-20 md:px-16" id="projects" aria-labelledby="projects-title">
      <div class="mx-auto max-w-6xl">
        <div use:reveal data-reveal="slash" class="relative isolate mb-8 flex min-h-56 flex-wrap items-center justify-between gap-6 overflow-hidden border border-loud-red/35 border-l-4 border-l-loud-red bg-[#181018] px-5 py-8 sm:px-9 md:py-10">
          <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_90%_30%,rgba(239,16,25,.27),transparent_65%),linear-gradient(115deg,transparent_56%,rgba(239,16,25,.15)_56%_79%,transparent_79%_81%,rgba(239,16,25,.08)_81%)]"></div>
          <div aria-hidden="true" class="banner-shine"></div>
          <div aria-hidden="true" class="pointer-events-none absolute inset-y-0 right-0 -z-10 w-1/2 opacity-20 [background-image:radial-gradient(circle,#ef1019_1px,transparent_1.5px)] [background-size:9px_9px] [mask-image:linear-gradient(to_right,transparent,black)]"></div>
          <div>
            <p class="mb-4 inline-flex bg-loud-red px-3 py-1 font-display text-[.65rem] font-black uppercase tracking-[.24em] text-white [clip-path:polygon(0_0,100%_0,96%_100%,0_100%)]">Selected Files</p>
            <h2 id="projects-title" class="mb-3 font-display text-[clamp(1.8rem,6vw,3.75rem)] font-black uppercase leading-none text-paper [text-shadow:.045em_.045em_0_#9b0020]">Projectarchief</h2>
            <p class="max-w-lg text-lg leading-6 text-paper/75">Een overzicht van mijn werk, van het eerste concept tot de oplevering.</p>
          </div>
          <div aria-hidden="true" class="mr-2 hidden rotate-[4deg] border-2 border-[#ff7b80]/60 px-6 py-3 text-center font-display text-[#ff7b80] md:block">
            <span class="block text-5xl font-black leading-none">{String(data.projects.length).padStart(2, '0')}</span>
            <span class="text-[.65rem] font-bold uppercase tracking-[.23em]">Dossiers</span>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-5 max-[900px]:grid-cols-1" aria-label="Projecten">
          {#each data.projects as project, index}
            {@const fullWidth = project.slug.toLowerCase() === 'kledingdokter-website'}
            <article
              use:reveal={index * 110}
              use:tilt
              data-reveal
              class={`tilt-card group relative isolate overflow-hidden border border-loud-red/25 bg-[#0e0e17] p-6 transition [clip-path:polygon(0_0,100%_0,100%_90%,94%_100%,0_100%)] before:absolute before:inset-x-0 before:top-0 before:h-1 before:origin-left before:scale-x-0 before:transition before:content-[''] after:absolute after:right-0 after:top-0 after:size-0 after:border-l-[28px] after:border-t-[28px] after:border-l-transparent after:border-t-loud-red after:opacity-75 after:content-[''] hover:-translate-y-1 hover:border-loud-red/80 hover:before:scale-x-100 ${fullWidth ? 'col-span-full' : 'min-h-[24rem]'} ${index === 0 && !fullWidth ? 'min-[900px]:col-span-2' : ''} ${accentPanel[project.accent]}`}
            >
              <div aria-hidden="true" class="card-spot"></div>
              <span
                aria-hidden="true"
                class="pointer-events-none absolute -bottom-7 right-4 -z-10 font-display text-[8rem] font-black leading-none text-white/[.035] transition duration-300 group-hover:-translate-y-2 group-hover:text-loud-red/20"
                >{fileNumber(index)}</span
              >
              <div class={`flex justify-between gap-3 font-display text-xs font-black uppercase tracking-[.18em] text-paper/35 ${fullWidth ? 'mb-8' : 'mb-14'}`}>
                <span>Dossier {fileNumber(index)} <span aria-hidden="true" class="px-1 text-loud-red">/</span> {project.year}</span>
                <span class={statusTone[project.status]}>{statusLabels[project.status]}</span>
              </div>

              <h3 class="mb-3 font-display text-2xl font-bold uppercase tracking-[.04em] text-paper">
                {project.title}
              </h3>
              <p class="mb-5 max-w-2xl leading-7 text-paper/55">{project.summary}</p>

              <div class="mb-6 flex flex-wrap gap-2" aria-label="Keywords">
                {#each project.tags as tag}
                  <span class="border border-loud-red/30 bg-loud-red/10 px-2 py-1 font-display text-[.65rem] font-bold uppercase tracking-[.12em] text-[#ff7b80]">{tag.trim()}</span>
                {/each}
              </div>

              <div class="flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-4 text-sm text-paper/35">
                <span>{project.role}</span>
                <div class="flex flex-wrap items-center gap-x-5 gap-y-2">
                  {#if project.links[0]}
                    <a class="relative z-10 font-display text-xs font-black uppercase tracking-[.14em] text-charge-yellow transition hover:tracking-[.22em]" href={project.links[0].url}>
                      {project.links[0].label} →
                    </a>
                  {/if}
                  <button
                    type="button"
                    class="cursor-pointer font-display text-xs font-black uppercase tracking-[.14em] text-paper/70 transition after:absolute after:inset-0 after:content-[''] hover:text-[#ff7b80] focus-visible:text-[#ff7b80] group-hover:text-[#ff7b80]"
                    aria-haspopup="dialog"
                    onclick={() => openDossier(project, index)}
                  >
                    Open dossier <span aria-hidden="true" class="inline-block transition group-hover:translate-x-1">◆</span>
                  </button>
                </div>
              </div>
            </article>
          {/each}
        </div>

        <section class="mt-12" aria-labelledby="process-title">
          <h2 id="process-title" use:reveal data-reveal="slash" class="mb-5 w-fit font-display text-2xl font-black uppercase tracking-[.06em] text-paper">Werkwijze</h2>
          <ol class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {#each processCards as card, index}
              <li
                use:reveal={index * 120}
                data-reveal
                class="group relative border border-loud-red/20 border-t-2 border-t-loud-red/55 bg-[#0e0e17] p-5 transition duration-200 [clip-path:polygon(0_0,100%_0,100%_90%,94%_100%,0_100%)] hover:-translate-y-1 hover:border-t-loud-red hover:bg-[#15101a]"
              >
                <div aria-hidden="true" class="mb-3 font-display text-3xl font-black leading-none text-[#ff7b80] transition duration-200 group-hover:translate-x-1 group-hover:text-loud-red">0{index + 1}</div>
                <h3 class="mb-2 font-display text-base font-bold uppercase tracking-[.04em] text-paper">{card.title}</h3>
                <p class="leading-6 text-paper/70">{card.text}</p>
              </li>
            {/each}
          </ol>
        </section>
      </div>
    </section>

    <div class="relative h-56 overflow-hidden bg-[linear-gradient(180deg,#111118_0%,#060c22_55%,#08112e_100%)]" aria-hidden="true">
      <div class="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(200,151,42,.5)_30%,rgba(200,151,42,.9)_50%,rgba(200,151,42,.5)_70%,transparent)]"></div>
      <div class="absolute bottom-[-40px] left-1/2 h-20 w-80 -translate-x-1/2 rounded-full bg-velvet-gold/10 blur-xl"></div>
      {#each [8, 19, 31, 44, 57, 68, 81, 92] as left, index}
        <span class="mote" style={`--x: ${left}%; --d: ${(index * 1.3) % 5}s; --t: ${5 + (index % 4)}s`}></span>
      {/each}
      <div class="butterfly">
        <svg viewBox="0 0 40 32" width="36" height="29" xmlns="http://www.w3.org/2000/svg">
          <g class="wing">
            <path d="M20 15 C13 1 2 1 3 11 C3.5 17 12 18 20 15 Z" />
            <path d="M20 16 C13 18 6 22 9 27 C12 31 18 24 20 16 Z" />
          </g>
          <g transform="matrix(-1 0 0 1 40 0)">
            <g class="wing">
              <path d="M20 15 C13 1 2 1 3 11 C3.5 17 12 18 20 15 Z" />
              <path d="M20 16 C13 18 6 22 9 27 C12 31 18 24 20 16 Z" />
            </g>
          </g>
          <path class="butterfly-body" d="M20 10 L20 24" />
        </svg>
      </div>
      <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-display">
        <span use:reveal data-reveal class="inline-block whitespace-nowrap text-sm italic tracking-[.3em] text-velvet-gold/75">— The Velvet Room —</span>
      </div>
    </div>

    <section
      class="relative scroll-mt-20 overflow-hidden bg-[linear-gradient(180deg,#08112e_0%,#0d1b4b_100%)] px-4 py-20 md:px-16"
      id="skills"
      aria-labelledby="skills-title"
    >
      <div aria-hidden="true" class="absolute inset-0 opacity-[.06] [background-image:repeating-linear-gradient(60deg,rgba(200,151,42,.6)_0,rgba(200,151,42,.6)_1px,transparent_1px,transparent_60px),repeating-linear-gradient(-60deg,rgba(200,151,42,.6)_0,rgba(200,151,42,.6)_1px,transparent_1px,transparent_60px)] [background-size:80px_140px]"></div>
      <div aria-hidden="true" class="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,rgba(200,151,42,.08),transparent)]"></div>

      <div class="relative z-[1] mx-auto max-w-6xl">
        <div class="mb-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
          <h2 id="skills-title" use:reveal data-reveal="slash" class="font-display text-5xl font-black uppercase tracking-[.03em] text-velvet-cream [text-shadow:0_0_60px_rgba(200,151,42,.22)] max-sm:text-4xl">
            Skills
          </h2>

          <div use:reveal={120} data-reveal class="flex flex-wrap gap-2" role="group" aria-label="Filter skills op categorie">
            {#each skillAreas as area}
              <button
                type="button"
                class={`cursor-pointer border px-3 py-1.5 font-display text-[.65rem] font-bold uppercase tracking-[.2em] transition [clip-path:polygon(6%_0,100%_0,94%_100%,0_100%)] ${skillFilter === area ? 'border-velvet-gold bg-velvet-gold text-velvet-navy' : 'border-velvet-gold/30 bg-velvet-navy/60 text-velvet-mist hover:border-velvet-gold/70 hover:text-velvet-cream'}`}
                aria-pressed={skillFilter === area}
                onclick={() => setSkillFilter(area)}
              >
                {area}
              </button>
            {/each}
          </div>
        </div>

        <div bind:this={skillsNode} class="grid grid-cols-2 gap-4 max-[900px]:grid-cols-1">
          {#each visibleSkills as skill, index (skill.id)}
            <article
              use:reveal={index * 70}
              data-reveal
              class={`group relative overflow-hidden border bg-[#0d1b4b]/70 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-velvet-gold/70 hover:bg-[#12235c]/80 [clip-path:polygon(0_0,100%_0,100%_85%,96%_100%,0_100%)] ${skill.highlight ? 'border-velvet-gold/50' : 'border-velvet-gold/20'}`}
            >
              {#if skill.highlight}
                <span
                  class="absolute bottom-0 left-0 top-0 w-0.5 bg-gradient-to-b from-velvet-gold to-velvet-gold-soft"
                  aria-hidden="true"
                ></span>
              {/if}
              <span class="mb-2 block font-display text-[.62rem] italic uppercase tracking-[.32em] text-velvet-mist">{skill.area}</span>
              <div class="mb-4 flex items-baseline justify-between gap-4">
                <h3 class="font-display text-xl font-bold uppercase tracking-[.05em] text-velvet-cream">{skill.name}</h3>
                <span aria-hidden="true" class="font-display text-lg font-bold tabular-nums text-velvet-gold-soft">{Math.round(skill.level * meter.current)}%</span>
              </div>
              <div class="relative h-1.5 overflow-hidden bg-white/10 [clip-path:polygon(0_0,100%_0,98%_100%,2%_100%)]" aria-label="{skill.name} niveau {skill.level} procent">
                <span
                  class="skill-fill absolute bottom-0 left-0 top-0 bg-gradient-to-r from-velvet-gold/80 to-velvet-gold-soft"
                  style={`width: ${skill.level * meter.current}%`}
                ></span>
              </div>
              <div class="mt-3 flex gap-1">
                {#each Array(5) as _, dot}
                  <span
                    class={`size-2 transition duration-300 [clip-path:polygon(50%_0,100%_50%,50%_100%,0_50%)] ${meter.current > 0.05 && dot < skillDots(skill.level * meter.current) ? 'bg-velvet-gold opacity-90' : 'bg-white/10'}`}
                    aria-hidden="true"
                  ></span>
                {/each}
              </div>
            </article>
          {/each}
        </div>
      </div>
    </section>

    <section
      class="relative scroll-mt-20 overflow-hidden bg-velvet-navy px-4 py-20 md:px-16"
      id="contact"
      aria-labelledby="contact-title"
    >
      <div aria-hidden="true" class="absolute inset-0 overflow-hidden">
        <span class="absolute bottom-0 top-0 left-[12%] w-px bg-[linear-gradient(180deg,transparent,rgba(200,151,42,.2)_20%,rgba(200,151,42,.35)_50%,rgba(200,151,42,.2)_80%,transparent)]"></span>
        <span class="absolute bottom-0 top-0 left-[88%] w-px bg-[linear-gradient(180deg,transparent,rgba(200,151,42,.2)_20%,rgba(200,151,42,.35)_50%,rgba(200,151,42,.2)_80%,transparent)]"></span>
        <span class="absolute bottom-0 top-0 left-[25%] w-px bg-[linear-gradient(180deg,transparent,rgba(200,151,42,.14)_20%,rgba(200,151,42,.24)_50%,rgba(200,151,42,.14)_80%,transparent)]"></span>
        <span class="absolute bottom-0 top-0 left-[75%] w-px bg-[linear-gradient(180deg,transparent,rgba(200,151,42,.14)_20%,rgba(200,151,42,.24)_50%,rgba(200,151,42,.14)_80%,transparent)]"></span>
        <span class="absolute left-1/2 top-[-80px] h-64 w-[min(32rem,80vw)] -translate-x-1/2 rounded-t-full border border-b-0 border-velvet-gold/15"></span>
        <span class="absolute left-1/2 top-[-60px] h-48 w-[min(24rem,68vw)] -translate-x-1/2 rounded-t-full border border-b-0 border-velvet-gold/10"></span>
        <span class="absolute left-1/2 top-0 h-32 w-[min(38rem,90vw)] -translate-x-1/2 bg-[radial-gradient(ellipse_at_50%_0%,rgba(200,151,42,.11),transparent_70%)]"></span>
      </div>

      <div class="relative z-[1] mx-auto max-w-6xl">
        <div class="mb-12 text-center font-display">
          <h2 id="contact-title" use:reveal data-reveal class="font-display text-5xl font-black uppercase leading-tight tracking-[.08em] text-velvet-cream [text-shadow:0_0_80px_rgba(200,151,42,.25)] max-sm:text-3xl">
            Contact
          </h2>
        </div>

        <div class="mb-12 flex items-center gap-3">
          <span class="h-px flex-1 bg-[linear-gradient(90deg,transparent,rgba(200,151,42,.42))]"></span>
          <span class="font-display text-velvet-gold">◆</span>
          <span class="h-px flex-1 bg-[linear-gradient(90deg,rgba(200,151,42,.42),transparent)]"></span>
        </div>

        <div class="grid grid-cols-2 items-start gap-10 max-[900px]:grid-cols-1">
          <article use:reveal data-reveal class="border border-velvet-gold/20 bg-[#1e3070]/45 p-7 [clip-path:polygon(0_0,96%_0,100%_4%,100%_100%,4%_100%,0_96%)]">
            <p class="leading-7 text-velvet-cream/80">Voor vragen over een project kun je me mailen of een bericht sturen op LinkedIn.</p>
            <p class="mt-4 font-display text-xs italic tracking-[.12em] text-velvet-mist">{data.profile.location}</p>
          </article>

          <div use:reveal={140} data-reveal class="grid gap-3">
            <a
              class="group flex items-center justify-between border border-velvet-gold/20 bg-[#08112e]/80 p-4 font-display text-sm uppercase tracking-[.18em] text-velvet-cream transition [clip-path:polygon(0_0,100%_0,97%_100%,3%_100%)] hover:border-velvet-gold/50 hover:bg-velvet-gold/10"
              href={`mailto:${data.profile.email}`}
            >
              <span><span class="mb-1 block text-[.62rem] tracking-[.3em] text-velvet-mist/60">E-mail</span>{data.profile.email}</span>
              <span class="text-velvet-gold transition group-hover:translate-x-1">→</span>
            </a>
            {#each data.profile.socials as social}
              <a
                class="group flex items-center justify-between border border-velvet-gold/20 bg-[#08112e]/80 p-4 font-display text-sm uppercase tracking-[.18em] text-velvet-cream transition [clip-path:polygon(0_0,100%_0,97%_100%,3%_100%)] hover:border-velvet-gold/50 hover:bg-velvet-gold/10"
                href={social.url}
              >
                <span><span class="mb-1 block text-[.62rem] tracking-[.3em] text-velvet-mist/60">{social.label}</span>{social.url.replace('https://', '')}</span>
                <span class="text-velvet-gold transition group-hover:translate-x-1">→</span>
              </a>
            {/each}
            {#if data.showCmsLink}
              <a
                class="mt-2 inline-flex w-fit items-center gap-2 font-display text-xs italic uppercase tracking-[.28em] text-[#5dc8b4]/65 transition hover:text-[#5dc8b4]"
                href="{data.payloadUrl}/admin"
              >
                ◆ CMS Admin Panel
              </a>
            {/if}
          </div>
        </div>

        <div use:reveal data-reveal class="mt-16 text-center font-display text-xs italic uppercase tracking-[.42em] text-velvet-gold/40">
          <svg class="mx-auto mb-3 opacity-40" width="160" height="40" viewBox="0 0 160 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <line x1="0" y1="20" x2="60" y2="20" stroke="#c8972a" stroke-width="1" />
            <polygon points="80,8 88,20 80,32 72,20" fill="none" stroke="#c8972a" stroke-width="1" />
            <circle cx="80" cy="20" r="3" fill="#c8972a" />
            <line x1="100" y1="20" x2="160" y2="20" stroke="#c8972a" stroke-width="1" />
          </svg>
          Thou art I / And I am thou
        </div>
      </div>
    </section>
  </main>

  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
  <dialog
    bind:this={dialogNode}
    class="dossier"
    aria-labelledby="dossier-title"
    onclose={() => (selected = null)}
    onclick={(event) => {
      if (event.target === dialogNode) dialogNode?.close()
    }}
    onkeydown={dossierKeys}
  >
    {#if selected}
      {#key selected.id}
        <div class="dossier-panel relative isolate max-h-[calc(100dvh-2rem)] overflow-y-auto border border-loud-red/60 border-l-4 border-l-loud-red bg-[#0e0e17] p-6 sm:p-9">
          <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_95%_0%,rgba(239,16,25,.22),transparent_60%),linear-gradient(115deg,transparent_62%,rgba(239,16,25,.1)_62%_80%,transparent_80%)]"></div>
          <span aria-hidden="true" class="pointer-events-none absolute -top-4 right-16 -z-10 font-display text-[9rem] font-black leading-none text-loud-red/10">{fileNumber(selectedIndex)}</span>

          <div class="mb-6 flex items-start justify-between gap-4">
            <p class="inline-flex bg-loud-red px-3 py-1 font-display text-[.65rem] font-black uppercase tracking-[.24em] text-white [clip-path:polygon(0_0,100%_0,96%_100%,0_100%)]">
              Dossier {fileNumber(selectedIndex)} / {String(data.projects.length).padStart(2, '0')}
            </p>
            <button
              type="button"
              class="grid size-9 shrink-0 cursor-pointer place-items-center border border-paper/25 font-display text-sm font-black text-paper/70 transition hover:rotate-90 hover:border-loud-red hover:bg-loud-red hover:text-white"
              aria-label="Dossier sluiten"
              onclick={() => dialogNode?.close()}>✕</button
            >
          </div>

          <h2 id="dossier-title" class="mb-2 font-display text-[clamp(1.6rem,5vw,2.6rem)] font-black uppercase leading-tight text-paper [text-shadow:.045em_.045em_0_#9b0020]">
            {selected.title}
          </h2>
          <p class="mb-6 font-display text-xs font-black uppercase tracking-[.18em] text-paper/45">
            {selected.year} <span aria-hidden="true" class="px-1 text-loud-red">/</span>
            <span class={statusTone[selected.status]}>{statusLabels[selected.status]}</span>
          </p>

          <p class="mb-7 whitespace-pre-line leading-7 text-paper/75">{selected.summary.trim()}</p>

          <dl class="mb-7 grid gap-5 sm:grid-cols-2">
            <div>
              <dt class="mb-2 font-display text-[.65rem] font-black uppercase tracking-[.24em] text-[#ff7b80]">◆ Keywords</dt>
              <dd class="flex flex-wrap gap-2">
                {#each selected.tags as tag, index}
                  <span class="dossier-chip border border-loud-red/30 bg-loud-red/10 px-2 py-1 font-display text-[.65rem] font-bold uppercase tracking-[.12em] text-[#ff7b80]" style={`--i: ${index}`}>{tag.trim()}</span>
                {/each}
              </dd>
            </div>
            {#if selected.stack?.length}
              <div>
                <dt class="mb-2 font-display text-[.65rem] font-black uppercase tracking-[.24em] text-[#ff7b80]">◆ Gebouwd met</dt>
                <dd class="flex flex-wrap gap-2">
                  {#each selected.stack as item, index}
                    <span class="dossier-chip border border-paper/20 bg-paper/5 px-2 py-1 font-display text-[.65rem] font-bold uppercase tracking-[.12em] text-paper/80" style={`--i: ${index + selected.tags.length}`}>{item}</span>
                  {/each}
                </dd>
              </div>
            {/if}
          </dl>

          <div class="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
            <span class="text-sm text-paper/45">{selected.role}</span>
            <div class="flex flex-wrap items-center gap-3">
              {#if selected.links[0]}
                <a class="font-display text-xs font-black uppercase tracking-[.14em] text-charge-yellow transition hover:tracking-[.22em]" href={selected.links[0].url}>
                  {selected.links[0].label} →
                </a>
              {/if}
              {#if data.projects.length > 1}
                <button type="button" class="cursor-pointer border border-paper/25 px-3 py-2 font-display text-xs font-black text-paper/70 transition hover:-translate-x-0.5 hover:border-loud-red hover:text-white" aria-label="Vorig dossier" onclick={() => stepDossier(-1)}>←</button>
                <button type="button" class="cursor-pointer border border-paper/25 px-3 py-2 font-display text-xs font-black text-paper/70 transition hover:translate-x-0.5 hover:border-loud-red hover:text-white" aria-label="Volgend dossier" onclick={() => stepDossier(1)}>→</button>
              {/if}
            </div>
          </div>
        </div>
      {/key}
    {/if}
  </dialog>

  <footer class="relative z-[4] flex flex-wrap items-center justify-between gap-3 border-t border-velvet-gold/15 bg-[#040814] px-4 py-5 font-display text-[.62rem] uppercase tracking-[.2em] text-velvet-gold/30 md:px-16">
    <span>© 2026 / Portfolio</span>
    <span class="text-velvet-gold/40">✦ Velvet Room ✦</span>
    <span>SvelteKit · Payload</span>
  </footer>
</div>
