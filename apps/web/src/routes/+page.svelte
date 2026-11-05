<script lang="ts">
  import { onMount } from 'svelte'
  import type { PageData } from './$types'

  let { data }: { data: PageData } = $props()
  let progress = $state(0)
  let pointerX = $state(50)
  let pointerY = $state(32)
  let skillsArmed = $state(false)
  let skillsNode: HTMLDivElement | undefined

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

  const tiltClass = ['rotate-[-2deg]', 'rotate-[2deg]'] as const

  const tickerItems = [
    'SvelteKit',
    'Payload CMS',
    'Sharp UI',
    'Motion Design',
    'Content Models',
    'Fast Builds',
    'Arcana Energy',
    'Velvet Polish'
  ]

  const processCards = [
    {
      title: 'Scout',
      text: 'Ik zoek eerst de visuele haak, de contentstructuur en de interactie die de pagina laat leven.'
    },
    {
      title: 'Strike',
      text: 'Daarna bouw ik compacte componenten, schuine layouts en states die snel voelen onder je cursor.'
    },
    {
      title: 'Charge',
      text: 'Motion, CMS-data en responsive polish komen samen tot een ervaring die niet vlak aanvoelt.'
    },
    {
      title: 'Launch',
      text: 'Tot slot check ik flow, mobiel gedrag, contrast en of de site makkelijk te beheren blijft.'
    }
  ]

  const arcanaLevel = (level: number) => Math.max(1, Math.min(5, Math.round(level / 20)))

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
          skillsArmed = true
          observer.disconnect()
        }
      },
      { threshold: 0.25 }
    )

    if (skillsNode) {
      observer.observe(skillsNode)
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('pointermove', updatePointer, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('pointermove', updatePointer)
      observer.disconnect()
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
        >P</span
      >
      <span>{data.profile.name}</span>
    </a>

    <nav
      class="flex flex-wrap items-center justify-end gap-x-6 gap-y-2 text-xs font-black uppercase tracking-[.22em] text-paper/55 max-sm:justify-start"
      aria-label="Hoofdnavigatie"
    >
      <a class="relative py-2 transition hover:text-paper after:absolute after:inset-x-0 after:bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:bg-loud-red after:transition-transform hover:after:scale-x-100 focus-visible:after:scale-x-100" href="#projects">Werk</a>
      <a class="relative py-2 transition hover:text-paper after:absolute after:inset-x-0 after:bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:bg-loud-red after:transition-transform hover:after:scale-x-100 focus-visible:after:scale-x-100" href="#skills">Skills</a>
      <a class="relative py-2 transition hover:text-paper after:absolute after:inset-x-0 after:bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:bg-loud-red after:transition-transform hover:after:scale-x-100 focus-visible:after:scale-x-100" href="#contact">Contact</a>
      {#if data.showCmsLink}
        <a class="relative py-2 text-[#5dc8b4] after:absolute after:inset-x-0 after:bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:bg-loud-red after:transition-transform hover:after:scale-x-100 focus-visible:after:scale-x-100" href="{data.payloadUrl}/admin">CMS</a>
      {/if}
    </nav>
  </header>

  <section
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

    <div class="relative z-[2] w-full max-w-3xl animate-slam-in motion-reduce:animate-none">
      <p
        class="mb-5 inline-flex items-center gap-2 bg-loud-red px-3 py-1 font-display text-[.66rem] font-black uppercase tracking-[.28em] text-white [clip-path:polygon(0_0,100%_0,96%_100%,4%_100%)] before:size-1.5 before:animate-p5-spin before:bg-charge-yellow before:content-[''] before:[clip-path:polygon(50%_0,100%_50%,50%_100%,0_50%)] motion-reduce:before:animate-none"
      >
        Phantom build / Frontend developer
      </p>
      <h1
        id="hero-title"
        class="mb-2 max-w-[11ch] break-words font-display text-6xl font-black uppercase leading-[.88] tracking-tight text-paper [text-shadow:.06em_.06em_0_#9b0020,-.025em_-.025em_0_rgba(255,210,63,.34)] max-[900px]:text-5xl max-sm:text-[3.55rem]"
      >
        {data.profile.name}
      </h1>
      <p
        class="mb-5 w-fit max-w-full rotate-[-1deg] bg-loud-red px-3 py-2 font-display text-sm font-black uppercase tracking-[.24em] text-white [clip-path:polygon(0_0,100%_12%,96%_100%,3%_84%)]"
      >
        {data.profile.title}
      </p>

      <div aria-hidden="true" class="mb-6 flex flex-wrap gap-2">
        <span class="inline-flex min-w-16 justify-center bg-loud-red px-3 py-1 font-display text-xs font-black uppercase tracking-[.18em] text-white [clip-path:polygon(8%_0,100%_12%,92%_100%,0_86%)]">Fast</span>
        <span class="inline-flex min-w-16 justify-center bg-charge-yellow px-3 py-1 font-display text-xs font-black uppercase tracking-[.18em] text-ink [clip-path:polygon(8%_0,100%_12%,92%_100%,0_86%)]">Sharp</span>
        <span class="inline-flex min-w-16 justify-center bg-paper px-3 py-1 font-display text-xs font-black uppercase tracking-[.18em] text-ink [clip-path:polygon(8%_0,100%_12%,92%_100%,0_86%)]">CMS</span>
      </div>

      <p class="mb-7 max-w-xl text-xl leading-8 text-paper/75 [text-shadow:0_2px_18px_rgba(0,0,0,.8)] max-sm:text-base">
        {data.profile.intro}
      </p>

      <div class="flex flex-wrap gap-3 max-sm:grid">
        <a class="inline-flex min-h-12 items-center justify-center bg-loud-red px-6 py-3 font-display text-xs font-black uppercase tracking-[.2em] text-white shadow-[4px_4px_0_rgba(0,0,0,.75)] transition [clip-path:polygon(0_0,100%_0,96%_100%,4%_100%)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:brightness-125 focus-visible:-translate-x-0.5 focus-visible:-translate-y-0.5 max-sm:w-full" href="#projects">Bekijk werk</a>
        <a class="inline-flex min-h-12 items-center justify-center border border-paper/35 bg-transparent px-6 py-3 font-display text-xs font-black uppercase tracking-[.2em] text-paper shadow-[3px_3px_0_rgba(217,4,41,.36)] transition [clip-path:polygon(0_0,100%_0,96%_100%,4%_100%)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-loud-red/15 focus-visible:-translate-x-0.5 focus-visible:-translate-y-0.5 max-sm:w-full" href="#contact">Contact</a>
      </div>

      <aside
        class="mt-10 max-w-md border border-loud-red/35 border-l-4 border-l-loud-red bg-[#111118]/90 p-4 [clip-path:polygon(0_0,100%_0,97%_100%,3%_100%)]"
        aria-label="Beschikbaarheid"
      >
        <span class="mb-2 flex items-center gap-2 font-display text-[.62rem] font-black uppercase tracking-[.28em] text-loud-red before:size-1.5 before:animate-p5-pulse before:rounded-full before:bg-loud-red before:content-[''] motion-reduce:before:animate-none">Status / Online</span>
        <strong class="block font-display text-sm tracking-[.06em] text-paper">{data.profile.availability}</strong>
        <span class="text-paper/45">{data.profile.location}</span>
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
    aria-label="Technologie en focus"
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
    <section class="px-4 py-20 md:px-16" id="projects">
      <div class="mx-auto max-w-6xl">
        <p class="mb-3 flex items-center gap-3 font-display text-xs font-black uppercase tracking-[.35em] text-loud-red before:h-0.5 before:w-6 before:bg-loud-red after:h-0.5 after:w-2 after:bg-loud-red">Selected Files</p>
        <h2 class="mb-10 font-display text-5xl font-black uppercase leading-none text-paper max-sm:text-4xl">
          Projecten met karakter.
        </h2>

        <div class="grid grid-cols-3 gap-5 max-[900px]:grid-cols-1" aria-label="Projecten">
          {#each data.projects as project, index}
            {@const fullWidth = project.slug.toLowerCase() === 'kledingdokter-website'}
            <article
              class={`group relative isolate overflow-hidden border border-loud-red/25 bg-[#0e0e17] p-6 transition [clip-path:polygon(0_0,100%_0,100%_90%,94%_100%,0_100%)] before:absolute before:inset-x-0 before:top-0 before:h-1 before:origin-left before:scale-x-0 before:transition before:content-[''] after:absolute after:right-0 after:top-0 after:size-0 after:border-l-[28px] after:border-t-[28px] after:border-l-transparent after:border-t-loud-red after:opacity-75 after:content-[''] hover:-translate-y-1 hover:border-loud-red/80 hover:before:scale-x-100 ${fullWidth ? 'col-span-full' : 'min-h-[24rem]'} ${index === 0 && !fullWidth ? 'min-[900px]:col-span-2' : ''} ${accentPanel[project.accent]}`}
            >
              <div class={`flex justify-between gap-3 font-display text-xs font-black uppercase tracking-[.18em] text-paper/35 ${fullWidth ? 'mb-8' : 'mb-14'}`}>
                <span>{project.year}</span>
                <span class={statusTone[project.status]}>{statusLabels[project.status]}</span>
              </div>

              <h3 class="mb-3 font-display text-2xl font-bold uppercase tracking-[.04em] text-paper">
                {project.title}
              </h3>
              <p class="mb-5 max-w-2xl leading-7 text-paper/55">{project.summary}</p>

              <div class="mb-6 flex flex-wrap gap-2" aria-label="Project tags">
                {#each project.tags as tag}
                  <span class="border border-loud-red/30 bg-loud-red/10 px-2 py-1 font-display text-[.6rem] font-bold uppercase tracking-[.14em] text-loud-red">{tag}</span>
                {/each}
              </div>

              <div class="flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-4 text-sm text-paper/35">
                <span>{project.role}</span>
                {#if project.links[0]}
                  <a class="font-display text-xs font-black uppercase tracking-[.14em] text-charge-yellow transition hover:tracking-[.22em]" href={project.links[0].url}>
                    {project.links[0].label} →
                  </a>
                {/if}
              </div>
            </article>
          {/each}
        </div>

        <section class="mt-6 grid grid-cols-4 gap-0 max-[900px]:grid-cols-1" aria-labelledby="process-title">
          <h2 id="process-title" class="sr-only">Werkwijze</h2>
          {#each processCards as card, index}
            <article
              class={`group relative min-h-56 overflow-hidden border border-white/5 bg-[#0a0a12] p-5 transition [clip-path:polygon(6%_0,100%_0,94%_100%,0_100%)] hover:border-loud-red/35 hover:bg-loud-red/10 ${tiltClass[index % 2]}`}
            >
              <div class="mb-3 font-display text-4xl font-black leading-none text-loud-red/20">0{index + 1}</div>
              <h3 class="mb-3 font-display text-xl font-bold uppercase tracking-[.06em] text-paper">{card.title}</h3>
              <p class="text-sm leading-7 text-paper/40">{card.text}</p>
            </article>
          {/each}
        </section>
      </div>
    </section>

    <div class="relative h-56 overflow-hidden bg-[linear-gradient(180deg,#111118_0%,#060c22_55%,#08112e_100%)]" aria-hidden="true">
      <div class="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(200,151,42,.5)_30%,rgba(200,151,42,.9)_50%,rgba(200,151,42,.5)_70%,transparent)]"></div>
      <div class="absolute bottom-[-40px] left-1/2 h-20 w-80 -translate-x-1/2 rounded-full bg-velvet-gold/10 blur-xl"></div>
      <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-display">
        <p class="mb-1 text-xs uppercase tracking-[.5em] text-velvet-gold/50">Entering</p>
        <span class="text-sm italic tracking-[.3em] text-velvet-gold/75">— The Velvet Room —</span>
      </div>
    </div>

    <section
      class="relative overflow-hidden bg-[linear-gradient(180deg,#08112e_0%,#0d1b4b_100%)] px-4 py-20 md:px-16"
      id="skills"
      aria-labelledby="skills-title"
    >
      <div aria-hidden="true" class="absolute inset-0 opacity-[.06] [background-image:repeating-linear-gradient(60deg,rgba(200,151,42,.6)_0,rgba(200,151,42,.6)_1px,transparent_1px,transparent_60px),repeating-linear-gradient(-60deg,rgba(200,151,42,.6)_0,rgba(200,151,42,.6)_1px,transparent_1px,transparent_60px)] [background-size:80px_140px]"></div>
      <div aria-hidden="true" class="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,rgba(200,151,42,.08),transparent)]"></div>

      <div class="relative z-[1] mx-auto max-w-6xl">
        <p class="mb-3 flex items-center gap-3 font-display text-xs font-black italic uppercase tracking-[.45em] text-velvet-gold before:h-px before:w-5 before:bg-velvet-gold/70 after:h-px after:w-5 after:bg-velvet-gold/70">Loadout / Arcana</p>
        <h2 id="skills-title" class="mb-10 font-display text-5xl font-black uppercase tracking-[.03em] text-velvet-cream [text-shadow:0_0_60px_rgba(200,151,42,.22)] max-sm:text-4xl">
          Skills die de site aandrijven.
        </h2>

        <div bind:this={skillsNode} class="grid grid-cols-2 gap-4 max-[900px]:grid-cols-1">
          {#each data.skills as skill}
            <article
              class={`relative overflow-hidden border bg-[#0d1b4b]/70 p-5 [clip-path:polygon(0_0,100%_0,100%_85%,96%_100%,0_100%)] ${skill.highlight ? 'border-velvet-gold/50' : 'border-velvet-gold/20'}`}
            >
              {#if skill.highlight}
                <span
                  class="absolute bottom-0 left-0 top-0 w-0.5 bg-gradient-to-b from-velvet-gold to-velvet-gold-soft"
                  aria-hidden="true"
                ></span>
              {/if}
              <span class="mb-2 block font-display text-[.62rem] italic uppercase tracking-[.32em] text-velvet-mist">{skill.area}</span>
              <h3 class="mb-4 font-display text-xl font-bold uppercase tracking-[.05em] text-velvet-cream">{skill.name}</h3>
              <div class="relative h-1.5 overflow-hidden bg-white/10 [clip-path:polygon(0_0,100%_0,98%_100%,2%_100%)]" aria-label="{skill.name} niveau {skill.level} procent">
                <span
                  class="absolute bottom-0 left-0 top-0 bg-gradient-to-r from-velvet-gold/80 to-velvet-gold-soft transition-[width] duration-1000 ease-out"
                  style={`width: ${skillsArmed ? skill.level : 0}%`}
                ></span>
              </div>
              <div class="mt-3 flex gap-1">
                {#each Array(5) as _, dot}
                  <span
                    class={`size-2 [clip-path:polygon(50%_0,100%_50%,50%_100%,0_50%)] ${dot < arcanaLevel(skill.level) ? 'bg-velvet-gold opacity-90' : 'bg-white/10'}`}
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
      class="relative overflow-hidden bg-velvet-navy px-4 py-20 md:px-16"
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
          <span class="mb-3 block text-xs italic uppercase tracking-[.55em] text-velvet-gold/55">✦ Velvet Room ✦</span>
          <h2 id="contact-title" class="font-display text-5xl font-black uppercase leading-tight tracking-[.08em] text-velvet-cream [text-shadow:0_0_80px_rgba(200,151,42,.25)] max-sm:text-3xl">
            Laten we iets bouwen<br class="max-sm:hidden" /> dat knalt.
          </h2>
          <p class="mt-3 text-sm italic tracking-[.25em] text-velvet-gold/50">— Welcome to my world, dear guest —</p>
        </div>

        <div class="mb-12 flex items-center gap-3">
          <span class="h-px flex-1 bg-[linear-gradient(90deg,transparent,rgba(200,151,42,.42))]"></span>
          <span class="font-display text-velvet-gold">◆</span>
          <span class="h-px flex-1 bg-[linear-gradient(90deg,rgba(200,151,42,.42),transparent)]"></span>
        </div>

        <div class="grid grid-cols-2 items-start gap-10 max-[900px]:grid-cols-1">
          <article class="border border-velvet-gold/20 bg-[#1e3070]/45 p-7 [clip-path:polygon(0_0,96%_0,100%_4%,100%_100%,4%_100%,0_96%)]">
            <h3 class="mb-4 font-display text-xs font-bold italic uppercase tracking-[.4em] text-velvet-gold">✦ The Contract</h3>
            <p class="mb-6 leading-8 text-velvet-cream/65">
              Een project, een idee of gewoon een vraag. Ik reageer graag en werk met je mee aan een portfolio, tool of webwereld die voelt alsof hij echt een eigen identity heeft.
            </p>
            <p class="mb-3 flex items-center gap-3 font-display text-xs uppercase tracking-[.24em] text-velvet-mist before:size-2 before:animate-p5-pulse before:rounded-full before:bg-[#5dc8b4] before:shadow-[0_0_10px_#5dc8b4] before:content-[''] motion-reduce:before:animate-none">
              {data.profile.availability}
            </p>
            <p class="font-display text-xs italic tracking-[.18em] text-velvet-mist/50">{data.profile.location} / Remote mogelijk</p>
          </article>

          <div class="grid gap-3">
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

        <div class="mt-16 text-center font-display text-xs italic uppercase tracking-[.42em] text-velvet-gold/40">
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

  <footer class="relative z-[4] flex flex-wrap items-center justify-between gap-3 border-t border-velvet-gold/15 bg-[#040814] px-4 py-5 font-display text-[.62rem] uppercase tracking-[.2em] text-velvet-gold/30 md:px-16">
    <span>© 2026 / Portfolio</span>
    <span class="text-velvet-gold/40">✦ Velvet Room ✦</span>
    <span>SvelteKit · Payload · Motion</span>
  </footer>
</div>
