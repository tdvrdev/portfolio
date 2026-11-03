# tdvr.dev

Een SvelteKit portfolio met een Payload CMS backend/admin.

## Starten

Gebruik Node.js en pnpm:

```powershell
pnpm install --frozen-lockfile
pnpm dev
```

Of korter op Windows:

```powershell
.\scripts\dev.cmd
```

Alleen de portfolio-preview starten:

```powershell
.\scripts\dev-web.cmd
```

Daarna:

- Portfolio: http://localhost:5173
- CMS/admin: http://localhost:3001/admin

Maak bij de eerste CMS-open een admin gebruiker aan. De frontend toont alvast voorbeeldcontent en haalt automatisch Payload content op zodra de CMS draait.

## CMS vullen

De voorbeeldcontent is al een keer geseed. Later opnieuw draaien kan zo:

```powershell
pnpm --filter @portfolio/cms seed
```

Belangrijke plekken:

- `apps/web/src/routes/+page.svelte`: homepage markup
- `apps/web/src/app.css`: Tailwind import, theme tokens en animatie-keyframes
- `apps/cms/src/collections`: Payload collections
- `apps/cms/src/globals/Profile.ts`: profieltekst voor de hero

De portfolio-frontend gebruikt Tailwind CSS via de officiele Vite plugin. De Payload admin gebruikt zijn eigen ingebouwde styling, omdat dat een externe CMS-interface is.

## Publiceren

De online versie is een statische snapshot van de portfolio. Payload draait lokaal en wordt niet mee gedeployed.

Workflow:

1. Start lokaal de portfolio en CMS:

```powershell
.\scripts\dev.cmd
```

2. Pas content aan in Payload:

```txt
http://127.0.0.1:3001/admin
```

3. Publiceer de laatste CMS-content naar de static site:

```powershell
.\scripts\publish-site.cmd
```

Dat script exporteert Payload-content naar `apps/web/src/lib/generated-content.json`, bouwt de statische site, commit de contentwijziging en pusht naar GitHub.

## Cloudflare Pages

Het primaire domein is `https://tdvr.dev/`. Voeg `tdvr.dev` toe onder het Pages-project bij **Custom domains** en laat Cloudflare het apex-DNS-record aanmaken. Laat `www.tdvr.dev` daarna met een 301-redirect naar `https://tdvr.dev/` wijzen. De zone en het Pages-project moeten in hetzelfde Cloudflare-account staan.

Kies in Cloudflare Pages deze instellingen:

```txt
Framework preset:
None

Build command:
corepack enable && corepack prepare pnpm@11.5.0 --activate && pnpm install --frozen-lockfile && pnpm run build:static

Build output directory:
apps/web/build
```

De CMS-link wordt op productie verborgen zolang `PUBLIC_PAYLOAD_URL` niet is ingesteld. Daardoor verwijst de publieke site niet naar je lokale Payload CMS.

## GitHub

Deze repository is voorbereid om publiek te pushen. Lokale databases, `.env` bestanden, installatiemappen, build-output en logs staan in `.gitignore`.

De remote van deze checkout is `https://github.com/tdvrdev/portfolio.git`.
