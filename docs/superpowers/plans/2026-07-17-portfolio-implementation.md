# Keshav Tyagi Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and privately publish a simple, responsive portfolio that presents Keshav as a broad software builder with an AI emphasis and gives recruiters direct access to his work and contact links.

**Architecture:** Create a Sites/Vinext project in `site/` because the repository root already contains approved planning documents. The product is one static route composed in `app/page.tsx`, styled by `app/globals.css`, and described by request-aware metadata in `app/layout.tsx`; the existing rendered-HTML test exercises the built Worker output without adding a test framework. Vinext remains the OpenAI Sites build target, while `vercel.json` selects a separate standard Next.js build for Vercel.

**Tech Stack:** Vinext, Next.js 16, React 19, TypeScript, CSS, Node's built-in test runner, OpenAI Sites hosting, Vercel-compatible Next.js build

## Global Constraints

- Use one scrolling route in this exact order: Hero, About, Selected work, Experience, Toolkit, Contact.
- Navigation items are `about`, `work`, `experience`, and `contact me`; do not add a résumé link.
- Use `mailto:keshavtyg@gmail.com` for both the navigation contact action and closing contact button.
- Use `https://github.com/keshav-tyg` and `https://linkedin.com/in/keshav--tyagi` for social links.
- Use `https://fin-sight-frontend-blond.vercel.app/` and `https://github.com/keshav-tyg/WealthLens` for WealthLens.
- Use `https://bay-guard-usf.vercel.app/` for BayGuard Tampa.
- Use palette values `#020713`, `#0A1C2D`, `#D6E8F5`, `#718CA1`, `#49B9DF`, and `#102A40` exactly.
- Use system sans-serif for headings/body and system monospace for navigation, labels, dates, and technology lists.
- Do not add a photo, status panel, sidebar, skill-icon wall, contact form, blog, gallery, phone number, loading screen, music, 3D graphics, parallax, cursor effect, or decorative animation loop.
- Honor `prefers-reduced-motion`, preserve keyboard focus, and prevent horizontal overflow at 320 pixels.
- Keep the bundled `sites()` Vite plugin and Cloudflare Worker-compatible ESM output.
- Preserve `npm run build` for Vinext/Sites and add `npm run build:vercel` for a standard `next build`.
- Generate exactly one bespoke social card after the page content and visual direction are implemented; retry once only if its text is unusable.

---

## File Map

- `site/app/page.tsx` — semantic page structure, approved copy, portfolio records, and external-link rendering
- `site/app/globals.css` — ink-navy design tokens, layout, focus states, responsive rules, and motion preferences
- `site/app/layout.tsx` — document shell and request-aware page/Open Graph/X metadata
- `site/tests/rendered-html.test.mjs` — built-output contract for content, section order, links, metadata, starter removal, and CSS requirements
- `site/public/og.png` — bespoke social-preview image matching the finished portfolio
- `site/package.json` and `site/package-lock.json` — starter dependencies with `react-loading-skeleton` removed
- `site/.openai/hosting.json` — Sites project identity, created by the starter and updated during publishing
- `site/vercel.json` — Vercel framework and build-command override for the same source tree

---

### Task 1: Initialize the Sites Project

**Files:**
- Create: `site/**` from the bundled Vinext starter
- Preserve: `docs/superpowers/specs/2026-07-17-portfolio-design.md`
- Preserve: `docs/superpowers/plans/2026-07-17-portfolio-implementation.md`

**Interfaces:**
- Consumes: approved repository-root design and implementation documents
- Produces: a healthy Vinext project at `site/` with the starter development server available

- [ ] **Step 1: Confirm the target is absent and the repository is clean**

Run from `/Users/keshavtyagi/Documents/Portfolio`:

```bash
test ! -e site
git status --short --branch
```

Expected: the first command exits 0 and Git reports `## master` with no changed files.

- [ ] **Step 2: Initialize the bundled starter once**

```bash
mkdir site
cd site
bash /Users/keshavtyagi/.codex/plugins/cache/openai-bundled/sites/0.1.30/scripts/init-site.sh "$PWD"
```

Expected: dependency installation completes and `site/.openai/hosting.json`, `site/app/page.tsx`, and `site/package-lock.json` exist. Do not run another initializer.

- [ ] **Step 3: Start the retained development server**

```bash
npm run dev
```

Expected: Vinext prints one healthy Local URL. Keep this process alive through implementation and build, and open that exact URL in Codex once.

- [ ] **Step 4: Verify the unmodified starter baseline**

In a second terminal, run:

```bash
cd /Users/keshavtyagi/Documents/Portfolio/site
npm test
```

Expected: the starter production build completes and both starter rendered-HTML tests pass.

- [ ] **Step 5: Commit the initialized project**

```bash
cd /Users/keshavtyagi/Documents/Portfolio
git add site
git commit -m "chore: initialize portfolio site"
```

Expected: one commit containing the untouched Sites starter.

---

### Task 2: Replace the Starter With Semantic Portfolio Content

**Files:**
- Modify: `site/tests/rendered-html.test.mjs`
- Modify: `site/app/page.tsx`
- Modify: `site/app/layout.tsx`
- Delete: `site/app/_sites-preview/SkeletonPreview.tsx`
- Delete: `site/app/_sites-preview/preview.css`
- Modify: `site/package.json`
- Modify: `site/package-lock.json`

**Interfaces:**
- Consumes: starter Worker render helper and approved content/link constants
- Produces: a server-rendered single page with `#about`, `#work`, `#experience`, `#toolkit`, and `#contact`

- [ ] **Step 1: Replace the starter test with the product contract**

Write `site/tests/rendered-html.test.mjs` exactly as follows:

```js
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("renders Keshav's portfolio content and verified links", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Keshav Tyagi \| Computer Science &amp; Software<\/title>/i);
  assert.match(html, /CS student · systems \+ AI/);
  assert.match(html, /Keshav Tyagi/);
  assert.match(html, /id="main-content"/);
  assert.match(html, /id="about"/);
  assert.match(html, /id="work"/);
  assert.match(html, /id="experience"/);
  assert.match(html, /id="toolkit"/);
  assert.match(html, /id="contact"/);
  assert.match(html, /WealthLens/);
  assert.match(html, /BayGuard Tampa/);
  assert.match(html, /mailto:keshavtyg@gmail\.com/);
  assert.match(html, /https:\/\/github\.com\/keshav-tyg/);
  assert.match(html, /https:\/\/linkedin\.com\/in\/keshav--tyagi/);
  assert.match(html, /https:\/\/fin-sight-frontend-blond\.vercel\.app\//);
  assert.match(html, /https:\/\/bay-guard-usf\.vercel\.app\//);

  const order = ["about", "work", "experience", "toolkit", "contact"].map(
    (id) => html.indexOf(`id="${id}"`),
  );
  assert.ok(order.every((index) => index >= 0));
  assert.deepEqual(order, [...order].sort((a, b) => a - b));

  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/i);
  assert.doesNotMatch(html, /résumé|resume|keshav54@usf\.edu|813[ -]327[ -]9470/i);
});

test("removes disposable starter files and dependency", async () => {
  const packageJson = await readFile(new URL("../package.json", import.meta.url), "utf8");
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(new URL("../app/_sites-preview/", import.meta.url)));
});
```

- [ ] **Step 2: Run the contract to verify it fails against the starter**

```bash
cd /Users/keshavtyagi/Documents/Portfolio/site
npm test
```

Expected: FAIL because the built page still contains the starter title and loading skeleton.

- [ ] **Step 3: Implement the semantic page**

Replace `site/app/page.tsx` with:

```tsx
const projects = [
  {
    name: "WealthLens",
    stack: "Next.js · FastAPI · PostgreSQL · Redis · Machine Learning",
    description:
      "An AI financial copilot that connects real bank data to cash-flow forecasts, anomaly detection, personalized summaries, and grounded financial guidance.",
    links: [
      { label: "Live site", href: "https://fin-sight-frontend-blond.vercel.app/" },
      { label: "GitHub", href: "https://github.com/keshav-tyg/WealthLens" },
    ],
  },
  {
    name: "BayGuard Tampa",
    stack: "React · Express · Gemini · Redis · REST APIs",
    description:
      "A disaster-intelligence platform that combines five live data sources into evacuation guidance, situational summaries, and automated alerts.",
    links: [{ label: "Live site", href: "https://bay-guard-usf.vercel.app/" }],
  },
] as const;

const experience = [
  {
    dates: "Jun 2026 — Present",
    location: "Tampa, FL",
    organization: "USF Office of the Provost",
    role: "Student Assistant",
    description:
      "Resolve 50+ weekly technical support requests across Simple Syllabus and LMS integrations, manage Jira intake, and document repeatable solutions.",
  },
  {
    dates: "2022 — 2024",
    location: "Riverview, FL",
    organization: "Family-Owned Business",
    role: "Import & Export Assistant",
    description:
      "Coordinated roughly 100 weekly orders across shipment tracking, inventory, invoices, vendor communication, and customer support.",
  },
] as const;

const skills = [
  ["Languages", "Python, TypeScript, JavaScript, C++, SQL"],
  ["Backend + Data", "Node.js, FastAPI, Express, PostgreSQL, Redis, REST APIs"],
  ["AI + ML", "scikit-learn, Pandas, NumPy, RAG, LLM integration, forecasting"],
  ["Frontend + Cloud", "Next.js, React, Tailwind CSS, GitHub Actions, Vercel, Render, Neon"],
] as const;

const external = {
  email: "mailto:keshavtyg@gmail.com",
  github: "https://github.com/keshav-tyg",
  linkedin: "https://linkedin.com/in/keshav--tyagi",
} as const;

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
      <span aria-hidden="true"> ↗</span>
    </a>
  );
}

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header shell">
        <nav aria-label="Primary navigation">
          <a className="brand" href="#top" aria-label="Keshav Tyagi, back to top">keshav.tyagi</a>
          <div className="nav-links">
            <a href="#about">about</a>
            <a href="#work">work</a>
            <a href="#experience">experience</a>
            <a className="nav-contact" href={external.email}>contact me</a>
          </div>
        </nav>
      </header>

      <main id="main-content" className="shell">
        <section id="top" className="hero" aria-labelledby="hero-title">
          <p className="eyebrow">CS student · systems + AI</p>
          <h1 id="hero-title">Keshav Tyagi</h1>
          <p className="hero-copy">
            I build <strong>practical software across the stack</strong>, with a growing interest in intelligent systems that turn complex data into useful decisions.
          </p>
          <div className="hero-links" aria-label="Profile links">
            <a href="#about">About me <span aria-hidden="true">↓</span></a>
            <ExternalLink href={external.github}>GitHub</ExternalLink>
            <ExternalLink href={external.linkedin}>LinkedIn</ExternalLink>
            <a href={external.email}>Email <span aria-hidden="true">↗</span></a>
          </div>
        </section>

        <section id="about" className="content-section" aria-labelledby="about-title">
          <p className="section-label">01 / About</p>
          <h2 id="about-title" className="sr-only">About</h2>
          <p className="about-copy">
            I’m a third-year computer science student at the <strong>University of South Florida</strong>. I like understanding the whole system—what problem it solves, how the product feels, and what makes it reliable. Lately, I’m especially interested in where <strong>AI can improve real workflows</strong> without becoming the whole story.
          </p>
        </section>

        <section id="work" className="content-section" aria-labelledby="work-title">
          <p className="section-label">02 / Selected work</p>
          <h2 id="work-title" className="sr-only">Selected work</h2>
          <div className="project-list">
            {projects.map((project) => (
              <article className="project" key={project.name}>
                <div className="project-heading">
                  <h3>{project.name}</h3>
                  <div className="project-links">
                    {project.links.map((link) => (
                      <ExternalLink href={link.href} key={link.href}>{link.label}</ExternalLink>
                    ))}
                  </div>
                </div>
                <p className="stack">{project.stack}</p>
                <p>{project.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="experience" className="content-section" aria-labelledby="experience-title">
          <p className="section-label">03 / Experience</p>
          <h2 id="experience-title" className="sr-only">Experience</h2>
          <div className="experience-list">
            {experience.map((item) => (
              <article className="job" key={item.organization}>
                <p className="job-meta">{item.dates}<br />{item.location}</p>
                <div>
                  <h3>{item.organization}</h3>
                  <p className="role">{item.role}</p>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="toolkit" className="content-section" aria-labelledby="toolkit-title">
          <p className="section-label">04 / Toolkit</p>
          <h2 id="toolkit-title" className="sr-only">Toolkit</h2>
          <dl className="skills">
            {skills.map(([group, values]) => (
              <div className="skill-row" key={group}>
                <dt>{group}</dt>
                <dd>{values}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="contact" className="content-section contact" aria-labelledby="contact-title">
          <div>
            <p className="section-label">05 / Contact</p>
            <h2 id="contact-title">Let’s build something useful.</h2>
            <p>I’m open to internships, software engineering opportunities, and conversations about interesting projects.</p>
            <div className="contact-socials">
              <ExternalLink href={external.github}>GitHub</ExternalLink>
              <ExternalLink href={external.linkedin}>LinkedIn</ExternalLink>
            </div>
          </div>
          <a className="contact-button" href={external.email}>Contact me <span aria-hidden="true">↗</span></a>
        </section>
      </main>

      <footer className="site-footer shell">
        <a href={external.email}>keshavtyg@gmail.com</a>
        <span>Tampa, FL · 2026</span>
      </footer>
    </>
  );
}
```

- [ ] **Step 4: Replace starter metadata and document shell**

Replace `site/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Keshav Tyagi | Computer Science & Software",
  description:
    "Portfolio of Keshav Tyagi, a computer science student building practical software and intelligent systems.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 5: Remove the starter preview and unused dependency**

Delete `site/app/_sites-preview/SkeletonPreview.tsx` and `site/app/_sites-preview/preview.css` with `apply_patch`, then run:

```bash
cd /Users/keshavtyagi/Documents/Portfolio/site
npm uninstall react-loading-skeleton
```

Expected: the preview directory is absent and both package files no longer reference `react-loading-skeleton`.

- [ ] **Step 6: Run the contract and confirm it passes**

```bash
npm test
```

Expected: the production build succeeds and both rendered-HTML tests pass.

- [ ] **Step 7: Commit the semantic portfolio**

```bash
cd /Users/keshavtyagi/Documents/Portfolio
git add site
git commit -m "feat: add portfolio content"
```

---

### Task 3: Implement the Ink-Navy Responsive Design

**Files:**
- Modify: `site/tests/rendered-html.test.mjs`
- Modify: `site/app/globals.css`

**Interfaces:**
- Consumes: class names and section IDs from `app/page.tsx`
- Produces: the approved ink-navy layout, responsive stacking, focus states, and reduced-motion behavior

- [ ] **Step 1: Add source-level visual-system assertions**

Append this test to `site/tests/rendered-html.test.mjs`:

```js
test("keeps the approved palette, responsive rules, and motion safeguards", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  for (const token of ["#020713", "#0a1c2d", "#d6e8f5", "#718ca1", "#49b9df", "#102a40"]) {
    assert.match(css.toLowerCase(), new RegExp(token));
  }
  assert.match(css, /@media\s*\(max-width:\s*620px\)/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /overflow-x:\s*hidden/);
  assert.doesNotMatch(css, /cursor:\s*none|canvas|scanline|perspective|parallax/i);
});
```

- [ ] **Step 2: Run the new assertion to verify it fails**

```bash
cd /Users/keshavtyagi/Documents/Portfolio/site
npm test
```

Expected: FAIL because the starter stylesheet does not contain the approved palette and safeguards.

- [ ] **Step 3: Implement the complete stylesheet**

Replace `site/app/globals.css` with:

```css
@import "tailwindcss";

:root {
  --background: #020713;
  --background-radial: #0a1c2d;
  --foreground: #d6e8f5;
  --muted: #718ca1;
  --accent: #49b9df;
  --line: #102a40;
  --panel: #050e1b;
  --font-sans: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

* { box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  margin: 0;
  min-height: 100vh;
  overflow-x: hidden;
  background: radial-gradient(circle at 50% -18%, var(--background-radial) 0, var(--background) 32%, #01050d 100%);
  color: var(--foreground);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}

a { color: inherit; text-decoration: none; }
a:hover { color: var(--accent); }
a:focus-visible { outline: 2px solid var(--accent); outline-offset: 5px; border-radius: 2px; }

.shell { width: min(760px, calc(100% - 40px)); margin-inline: auto; }

.skip-link {
  position: fixed;
  z-index: 100;
  left: 16px;
  top: 12px;
  transform: translateY(-160%);
  padding: 10px 12px;
  background: var(--accent);
  color: var(--background);
  font: 700 12px/1 var(--font-mono);
}
.skip-link:focus { transform: translateY(0); }

.site-header { padding-top: 34px; }
.site-header nav { display: flex; align-items: center; justify-content: space-between; gap: 24px; font: 500 12px/1.2 var(--font-mono); color: var(--muted); }
.brand, .nav-contact { color: var(--accent); }
.nav-links { display: flex; align-items: center; gap: 20px; }
.nav-links a { display: inline-flex; min-height: 44px; align-items: center; }

.hero { padding: 112px 0 92px; border: 0; }
.eyebrow, .section-label { margin: 0; color: var(--accent); font: 500 11px/1.2 var(--font-mono); letter-spacing: .08em; }
.section-label { margin-bottom: 28px; text-transform: uppercase; }

h1 { margin: 16px 0 18px; font-size: clamp(44px, 8vw, 72px); line-height: .95; letter-spacing: -.06em; }
h2 { margin: 0; font-size: 28px; letter-spacing: -.04em; }
h3 { margin: 0; letter-spacing: -.025em; }

.hero-copy { max-width: 670px; margin: 0; color: #8fa7b9; font-size: 17px; line-height: 1.75; }
.hero-copy strong, .about-copy strong { color: var(--foreground); font-weight: 500; }
.hero-links { display: flex; flex-wrap: wrap; gap: 18px; margin-top: 30px; color: var(--muted); font: 500 12px/1.2 var(--font-mono); }
.hero-links a { display: inline-flex; min-height: 44px; align-items: center; border-bottom: 1px solid var(--line); }

.content-section { padding: 72px 0; border-top: 1px solid var(--line); scroll-margin-top: 32px; }
.about-copy { margin: 0; color: #8da5b7; font-size: 16px; line-height: 1.8; }

.project, .job { border-top: 1px solid color-mix(in srgb, var(--line) 82%, transparent); }
.project:first-child, .job:first-child { border-top: 0; padding-top: 0; }
.project { padding: 26px 0; }
.project-heading { display: flex; align-items: baseline; justify-content: space-between; gap: 24px; }
.project h3 { font-size: 19px; }
.project-links { display: flex; gap: 14px; color: var(--muted); font: 500 11px/1.4 var(--font-mono); }
.project-links a { display: inline-flex; min-height: 44px; align-items: center; }
.stack { margin: 10px 0 0; color: var(--accent); font: 500 10px/1.5 var(--font-mono); }
.project > p:last-child, .job div > p:last-child { margin: 10px 0 0; color: var(--muted); font-size: 13px; line-height: 1.75; }

.job { display: grid; grid-template-columns: 170px 1fr; gap: 28px; padding: 24px 0; }
.job-meta { margin: 0; color: #58758b; font: 500 10px/1.6 var(--font-mono); }
.job h3 { font-size: 16px; }
.role { margin: 4px 0 12px; color: var(--accent); font: 500 10px/1.5 var(--font-mono); }

.skills { margin: 0; }
.skill-row { display: grid; grid-template-columns: 140px 1fr; gap: 28px; padding: 8px 0; }
.skills dt { color: var(--foreground); font: 500 11px/1.7 var(--font-mono); }
.skills dd { margin: 0; color: var(--muted); font-size: 13px; line-height: 1.7; }

.contact { display: grid; grid-template-columns: 1fr auto; align-items: end; gap: 40px; }
.contact > div > p:not(.section-label) { max-width: 520px; margin: 12px 0 0; color: var(--muted); font-size: 14px; line-height: 1.7; }
.contact-socials { display: flex; gap: 18px; margin-top: 22px; color: #647f93; font: 500 11px/1.2 var(--font-mono); }
.contact-button { display: inline-flex; min-height: 44px; align-items: center; padding: 12px 15px; border: 1px solid var(--accent); color: var(--accent); font: 600 11px/1 var(--font-mono); white-space: nowrap; }
.contact-button:hover { background: var(--accent); color: var(--background); }

.site-footer { display: flex; justify-content: space-between; gap: 24px; padding: 32px 0 54px; border-top: 1px solid var(--line); color: #506b80; font: 500 10px/1.5 var(--font-mono); }

.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }

@keyframes reveal {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: no-preference) {
  .hero, .content-section { animation: reveal .45s ease-out both; }
}

@media (max-width: 620px) {
  .hero { padding: 84px 0 74px; }
  .nav-links a:nth-child(1), .nav-links a:nth-child(2) { display: none; }
  .content-section { padding: 58px 0; }
  .job, .skill-row, .contact { grid-template-columns: 1fr; gap: 10px; }
  .project-heading { align-items: flex-start; flex-direction: column; gap: 10px; }
  .contact { gap: 24px; }
  .contact-button { width: fit-content; }
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
}
```

- [ ] **Step 4: Run the complete contract**

```bash
npm test
```

Expected: the build succeeds and all three tests pass.

- [ ] **Step 5: Commit the visual system**

```bash
cd /Users/keshavtyagi/Documents/Portfolio
git add site/app/globals.css site/tests/rendered-html.test.mjs
git commit -m "style: add ink-navy portfolio design"
```

---

### Task 4: Add Request-Aware Metadata and Social Preview

**Files:**
- Modify: `site/tests/rendered-html.test.mjs`
- Modify: `site/app/layout.tsx`
- Create: `site/public/og.png`

**Interfaces:**
- Consumes: final palette, copy, and hero treatment from Tasks 2 and 3
- Produces: absolute Open Graph/X image metadata derived from the request host and one validated social card

- [ ] **Step 1: Add metadata and asset assertions**

Append this test to `site/tests/rendered-html.test.mjs`:

```js
test("publishes request-aware social metadata and a bespoke card", async () => {
  const response = await render();
  const html = await response.text();
  assert.match(html, /property="og:title" content="Keshav Tyagi \| Computer Science &amp; Software"/i);
  assert.match(html, /property="og:image" content="http:\/\/localhost\/og\.png"/i);
  assert.match(html, /name="twitter:card" content="summary_large_image"/i);
  await access(new URL("../public/og.png", import.meta.url));
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
cd /Users/keshavtyagi/Documents/Portfolio/site
npm test
```

Expected: FAIL because `og.png` and request-aware Open Graph/X metadata are absent.

- [ ] **Step 3: Generate and validate one social card**

Use the image-generation tool once with this exact brief:

```text
Create a complete 1200x630 social preview card for Keshav Tyagi's software portfolio. Use an almost-black ink-navy background (#020713) with a subtle deep-blue radial tone (#0A1C2D), clean off-white text (#D6E8F5), and restrained cyan accents (#49B9DF). Include exactly this text, spelled exactly: "Keshav Tyagi" and "CS student · systems + AI". Use a simple modern sans-serif name treatment plus a small monospace label, thin divider lines, generous negative space, and no photos, logos, code screenshots, gradients with bright glow, or extra words. The finished card should feel calm, technical, and legible in Slack, X, iMessage, and other link previews.
```

Inspect the returned image at original detail. Confirm both text lines are correct and no extra text was invented. Retry once only if the card is unusable. Save the validated image as `site/public/og.png`; omit image metadata if neither attempt is valid.

- [ ] **Step 4: Implement request-aware metadata**

Replace `site/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

const title = "Keshav Tyagi | Computer Science & Software";
const description =
  "Portfolio of Keshav Tyagi, a computer science student building practical software and intelligent systems.";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const metadataBase = new URL(`${protocol}://${host}`);
  const image = new URL("/og.png", metadataBase).toString();

  return {
    metadataBase,
    title,
    description,
    openGraph: {
      type: "website",
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: "Keshav Tyagi — CS student, systems and AI" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 5: Run the metadata contract**

```bash
npm test
```

Expected: the production build succeeds and all four tests pass.

- [ ] **Step 6: Commit metadata and the social card**

```bash
cd /Users/keshavtyagi/Documents/Portfolio
git add site/app/layout.tsx site/public/og.png site/tests/rendered-html.test.mjs
git commit -m "feat: add portfolio social preview"
```

---

### Task 5: Add and Verify Vercel Compatibility

**Files:**
- Modify: `site/tests/rendered-html.test.mjs`
- Modify: `site/package.json`
- Create: `site/vercel.json`

**Interfaces:**
- Consumes: the standard Next.js-compatible `app/` source used by Vinext
- Produces: a dedicated `next build` path selected automatically by Vercel without changing the Sites build

- [ ] **Step 1: Add the Vercel configuration contract**

Append this test to `site/tests/rendered-html.test.mjs`:

```js
test("provides an independent Vercel Next.js build target", async () => {
  const packageJson = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf8"),
  );
  const vercel = JSON.parse(
    await readFile(new URL("../vercel.json", import.meta.url), "utf8"),
  );

  assert.equal(packageJson.scripts.build, "WRANGLER_LOG_PATH=.wrangler/wrangler.log vinext build");
  assert.equal(packageJson.scripts["build:vercel"], "next build");
  assert.equal(vercel.$schema, "https://openapi.vercel.sh/vercel.json");
  assert.equal(vercel.framework, "nextjs");
  assert.equal(vercel.buildCommand, "npm run build:vercel");
  assert.equal("outputDirectory" in vercel, false);
});
```

- [ ] **Step 2: Run the new contract to verify it fails**

```bash
cd /Users/keshavtyagi/Documents/Portfolio/site
npm test
```

Expected: FAIL because `vercel.json` and the `build:vercel` script are absent.

- [ ] **Step 3: Add the dedicated Next.js build script**

```bash
cd /Users/keshavtyagi/Documents/Portfolio/site
npm pkg set 'scripts.build:vercel=next build'
```

Expected: `package.json` contains `"build:vercel": "next build"` and the Vinext `build` script is unchanged.

- [ ] **Step 4: Create Vercel's project configuration**

Create `site/vercel.json` with:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "buildCommand": "npm run build:vercel"
}
```

Do not set `outputDirectory`; Vercel's Next.js framework preset owns the build output.

- [ ] **Step 5: Verify both build targets**

```bash
cd /Users/keshavtyagi/Documents/Portfolio/site
npm test
npm run build:vercel
```

Expected: the rendered-HTML contract passes through the Vinext build and the separate Next.js production build completes successfully.

- [ ] **Step 6: Commit dual-host support**

```bash
cd /Users/keshavtyagi/Documents/Portfolio
git add site/package.json site/vercel.json site/tests/rendered-html.test.mjs
git commit -m "build: add Vercel deployment target"
```

When importing the repository in Vercel, select `site` as the Root Directory. From the Vercel CLI, deploy the same project with `vercel --cwd site`; no source changes are required.

---

### Task 6: Validate and Publish the Portfolio

**Files:**
- Verify: `site/**`
- Modify during hosting: `site/.openai/hosting.json`

**Interfaces:**
- Consumes: the complete site, passing rendered-output contract, both production build targets, and retained development server
- Produces: one private OpenAI Sites deployment and its final URL

- [ ] **Step 1: Run the full production verification**

```bash
cd /Users/keshavtyagi/Documents/Portfolio/site
npm test
npm run build:vercel
```

Expected: all five tests pass, the Vinext build used by `npm test` exits 0, and the standard Next.js build exits 0.

- [ ] **Step 2: Run deterministic source and content checks**

```bash
cd /Users/keshavtyagi/Documents/Portfolio/site
! rg -n "codex-preview|SkeletonPreview|react-loading-skeleton|résumé|resume|keshav54@usf\.edu|813[ -]327[ -]9470" app package.json tests
rg -n "mailto:keshavtyg@gmail\.com|fin-sight-frontend-blond\.vercel\.app|bay-guard-usf\.vercel\.app|prefers-reduced-motion|:focus-visible" app tests
```

Expected: the forbidden-content search returns no matches; the required-content search returns the contact, project, motion, and focus implementations.

- [ ] **Step 3: Verify all external destinations**

```bash
for url in \
  https://github.com/keshav-tyg \
  https://linkedin.com/in/keshav--tyagi \
  https://fin-sight-frontend-blond.vercel.app/ \
  https://github.com/keshav-tyg/WealthLens \
  https://bay-guard-usf.vercel.app/; do
  code=$(curl -fsSIL --max-time 20 -o /dev/null -w '%{http_code}' "$url")
  printf '%s %s\n' "$code" "$url"
done
```

Expected: each URL resolves through redirects to HTTP 200. If a provider blocks `HEAD`, repeat that single URL with `curl -fsSL --max-time 20 -o /dev/null -w '%{http_code}'`.

- [ ] **Step 4: Publish through the Sites hosting workflow**

Invoke the `sites-hosting` skill. For a new site, call `create_site` once, persist only its `project_id` in `site/.openai/hosting.json`, and reuse the returned source-write credential. Commit the exact validated source, push the branch head using the credential as an HTTP authorization header, package `site/` with the plugin's `scripts/package-site.sh`, save one version with the pushed commit SHA, deploy privately, and poll deployment status until it succeeds or fails.

- [ ] **Step 5: Open the finished private deployment and tear down local processes**

After deployment reports `succeeded`, open the exact deployed URL in Codex. Stop the retained `npm run dev` process and remove any temporary hosting archive. Do not remove `site/dist/` until packaging and deployment are complete.

- [ ] **Step 6: Record the final state**

```bash
cd /Users/keshavtyagi/Documents/Portfolio
git status --short --branch
git log -5 --oneline
```

Expected: the worktree is clean, the hosting metadata commit is at `HEAD`, and the recent history contains the scaffold, content, design, social-preview, Vercel-support, and deployment commits.
