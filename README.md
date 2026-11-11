
<p align="center">
    <a href="https://github.com/SuhrobKholmurodov/committerstop"><img src="https://img.shields.io/badge/status-active-brightgreen.svg"></a>
    <a href="https://github.com/SuhrobKholmurodov/committerstop/graphs/contributors"><img src="https://img.shields.io/github/contributors/SuhrobKholmurodov/committerstop?color=blue"></a>
    <a href="https://github.com/SuhrobKholmurodov/committerstop/stargazers"><img src="https://img.shields.io/github/stars/SuhrobKholmurodov/committerstop.svg?logo=github"></a>
    <a href="https://github.com/SuhrobKholmurodov/committerstop/network/members"><img src="https://img.shields.io/github/forks/SuhrobKholmurodov/committerstop.svg?color=blue&logo=github"></a>
    <img src="https://visitor-badge.laobi.icu/badge?page_id=SuhrobKholmurodov.committerstop" alt="visitors"/>   
</p>

![Banner](https://capsule-render.vercel.app/api?type=venom&height=200&color=0:ff6b6b,100:4ecdc4&text=%20GitHub%20Committers&textBg=false&desc=(Top%20Active%20Developers%20Worldwide)&descAlign=79&fontAlign=50&descAlignY=70&fontColor=f7f5f5)

<p align="center">
GitHub Committers is a responsive web application that displays the most active GitHub users worldwide, ranked by commits, contributions, or overall activity. The frontend is built with React and TypeScript, using Redux Toolkit Query for data fetching and state management.
</p>


<br>

<h2 id=tech>🛠 Tech Stack</h2>

**Frontend**

![technologies](https://skillicons.dev/icons?i=react,js,ts,tailwind,html,css,vite&perline=10)

**State Management**

![technologies](https://skillicons.dev/icons?i=redux&perline=10)

**Tools & Platforms**

![technologies](https://skillicons.dev/icons?i=github,vscode&perline=10)

<h2>🚀Features</h2>

- 📊 View rankings of top active GitHub users worldwide
- 🔄 Switch between Commits, Contributions, and All tabs
- 🔍 Search users by username
- 🖼 View user details and avatars
- ⚡ Data updates dynamically with loading indicators
- 🌙 Toggle dark/light mode
- 🔔 Toast notifications for user interactions
- 🌍 Global leaderboard showcasing developers from around the world

<h2 id=setup>Quick Start</h2>

### Prerequisites

- Node.js 20+
- pnpm

## 📥 Setup and Installation

1. Navigate to the project directory:
   ```bash
   cd committerstop
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Copy `.env.example` to `.env.local` and fill in the values:
   ```bash
   API_URL=https://your-backend.vercel.app
   API_KEY=generate-a-long-random-string
   VITE_SITE_URL=https://committers.app
   ```

### Environment variables

| Variable | Exposed to the browser | Description |
| --- | --- | --- |
| `API_URL` | No | Backend origin. Used by the `/api` proxy and by the prerender step |
| `API_KEY` | No | Shared secret sent to the backend in the `x-api-key` header. Must match `API_KEY` of the backend |
| `VITE_SITE_URL` | Yes | Public site URL used for canonical links, Open Graph and the sitemap |

The browser never talks to the backend directly: it requests `/api/*` on the same origin. In development Vite proxies these requests, in production `vercel.ts` rewrites them to `API_URL` and adds the `x-api-key` header on Vercel's edge, so neither the backend URL nor the key ends up in the client bundle. Set `API_URL` and `API_KEY` in **Vercel → Project Settings → Environment Variables** for both Production and Preview.

4. Start the development server:
   ```bash
   pnpm dev
   ```

### Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the Vite dev server (client-side rendering) |
| `pnpm build` | Type-check, build the client and SSR bundles, prerender every page and generate `sitemap.xml` |
| `pnpm preview` | Serve the production build locally |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run the TypeScript compiler |

<h2>🏗 Architecture</h2>

The source code follows [Feature-Sliced Design](https://feature-sliced.design/). A layer may only import from the layers below it.

```
src/
├── app/        entry points (client + server), providers, routes, store, global styles
├── pages/      home, country, not-found
├── widgets/    header, footer, country card, continent nav, filter bar, committers table
├── features/   theme toggle, go to top, GitHub user dialog
├── entities/   country, committer, github-user (RTK Query endpoints, types, helpers)
└── shared/     base API, config, hooks, formatting, SEO helpers, UI kit (shadcn/ui)
```

All endpoints are injected into a single RTK Query `baseApi`, so the app has one cache and one middleware.

<h2>🔎 SEO</h2>

- Every route is **prerendered at build time** (`scripts/prerender.mjs`): the home page, a page for each country and `404.html`. Crawlers and social networks receive complete HTML with the title, description, canonical URL, Open Graph / Twitter tags and JSON-LD (`WebSite`, `CollectionPage`, `ItemList`, `BreadcrumbList`).
- The prerendered data is embedded into the page and the client **hydrates** it, then refreshes the ranking in the background.
- Continent hub pages (`/continent/europe`, …), visible breadcrumbs (Home › Continent › Country) and "more rankings in this continent" blocks build a crawlable site hierarchy with strong internal linking.
- Country metadata (ISO code, continent, grammatical name such as "in the United States") lives in `src/entities/country/model/profiles.ts`, so flags and continents are rendered into the static HTML without extra API calls. New countries fall back to the backend `/flags` endpoint.
- `sitemap.xml` and `llms.txt` are generated on every build with real `lastmod` dates taken from the ranking data.
- Titles and descriptions adapt to stay within ~70 / 160 characters, the Open Graph image is a 1200×630 JPEG (~75 KB) and favicons follow Google's 48px-multiple requirement.
- `vercel.ts` enables clean URLs without trailing slashes; unknown URLs are served by `404.html` with a real `404` status and `noindex`.
- Rankings are refreshed by the backend every few days, so redeploy (for example with a Vercel Deploy Hook on a schedule) to keep prerendered pages fresh.

<h2>📡 Data Fetching</h2>

- **Committers Data**  
  Provided by the CommittersTop backend (`/countries`, `/committers/:country/:mode`, `/flags`), which aggregates data from [committers.top](https://committers.top).

- **GitHub User Details**  
  Requested through the backend `/github-user/:username` endpoint.

<h2 id=contributing>🤝 Contributing</h2>

If you have any ideas, suggestions, or improvements, feel free to contribute by opening issues or submitting pull requests. Your help is always welcome!


<h2 id=license>License</h2>

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

<h2 id=contact>Support</h2>

<div align="left">
    <a href="mailto:suhrob.kholmurodov@gmail.com"><img src="https://img.shields.io/badge/Email-30302f?style=flat-square&logo=gmail" alt="Email"></a>
    <a href="https://github.com/SuhrobKholmurodov/committerstop"><img src="https://img.shields.io/badge/View%20on%20GitHub-30302f?style=flat-square&logo=github" alt="GitHub"></a>
</div>
