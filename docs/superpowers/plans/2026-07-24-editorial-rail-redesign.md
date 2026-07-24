# Editorial Rail Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild Keshav Tyagi’s portfolio in the approved Editorial Rail direction with readable typography, visible section headings, real project screenshots, and production-ready responsive behavior.

**Architecture:** Keep the existing single-page Next.js/Vinext application and its data-driven rendering. Extend the project data with local image metadata, introduce one reusable `SectionRail` component for the repeated section structure, and replace the current narrow-column CSS with the approved 1040px editorial grid. Continue using the existing Node test suite to validate rendered HTML, asset presence, accessibility contracts, styling tokens, and both deployment targets.

**Tech Stack:** Next.js 16, React 19, TypeScript, `next/image`, CSS, Node test runner, Sharp, Vinext, Vercel, OpenAI Sites

## Global Constraints

- Preserve the section order: Hero, About, Selected work, Experience, Toolkit, Contact, Footer.
- Keep About as the first content section.
- Use an approximately `1040px` centered structural container with `36px` desktop gutters.
- Keep prose blocks between `60ch` and `65ch`.
- Use `"Avenir Next", Avenir, Inter, "Segoe UI", Helvetica, Arial, sans-serif` for primary text.
- Reserve monospace for navigation, section numbers, dates, locations, tags, and metadata.
- Use visible `h2` headings for every major section.
- Use dark navy `#020817`, primary text `#edf6ff`, body text `#b8c9d8`, muted text `#7891a7`, and cyan `#56d2ff`.
- Restrict cyan to the brand mark, section numbers, key metadata, focus states, and primary actions.
- Use fresh local screenshots of WealthLens and BayGuard.
- Keep `mailto:keshavtyg@gmail.com`, GitHub, LinkedIn, WealthLens, and BayGuard destinations unchanged.
- Do not add a résumé button, third placeholder project, custom cursor, 3D effect, or heavy animation.
- Collapse the rail and project cards at `760px`.
- Keep interactive targets at least `44px` tall and honor `prefers-reduced-motion`.

---

### Task 1: Add Optimized Project Screenshot Assets

**Files:**
- Create: `site/public/projects/wealthlens.webp`
- Create: `site/public/projects/bayguard.webp`
- Modify: `site/tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: Captures at `.superpowers/brainstorm/69462-1784924995/content/wealthlens.png` and `.superpowers/brainstorm/69462-1784924995/content/bayguard.png`
- Produces: Public image URLs `/projects/wealthlens.webp` and `/projects/bayguard.webp`

- [ ] **Step 1: Write the failing asset test**

Add this test after the portfolio-content test in `site/tests/rendered-html.test.mjs`:

```js
test("ships optimized local screenshots for both projects", async () => {
  const assets = [
    new URL("../public/projects/wealthlens.webp", import.meta.url),
    new URL("../public/projects/bayguard.webp", import.meta.url),
  ];

  for (const asset of assets) {
    const bytes = await readFile(asset);
    assert.ok(bytes.byteLength > 10_000, `${asset.pathname} should contain a real screenshot`);
    assert.ok(bytes.byteLength < 200_000, `${asset.pathname} should remain web-sized`);
  }
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
cd site
npm run build
node --test --test-name-pattern="ships optimized local screenshots" tests/rendered-html.test.mjs
```

Expected: FAIL with `ENOENT` for `public/projects/wealthlens.webp`.

- [ ] **Step 3: Convert the approved captures to WebP**

Run from the repository root:

```bash
mkdir -p site/public/projects
node --input-type=module -e '
import sharp from "./site/node_modules/sharp/lib/index.js";
const jobs = [
  [".superpowers/brainstorm/69462-1784924995/content/wealthlens.png", "site/public/projects/wealthlens.webp"],
  [".superpowers/brainstorm/69462-1784924995/content/bayguard.png", "site/public/projects/bayguard.webp"],
];
for (const [source, destination] of jobs) {
  await sharp(source)
    .resize({ width: 1280, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(destination);
}
'
```

Expected: both WebP files are created and each is below 200 KB.

- [ ] **Step 4: Run the asset test to verify it passes**

Run:

```bash
cd site
node --test --test-name-pattern="ships optimized local screenshots" tests/rendered-html.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Commit the assets**

```bash
git add site/public/projects site/tests/rendered-html.test.mjs
git commit -m "feat: add project screenshots"
```

---

### Task 2: Build the Editorial Rail Page Structure

**Files:**
- Modify: `site/app/page.tsx:1-196`
- Modify: `site/tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: `/projects/wealthlens.webp` and `/projects/bayguard.webp` from Task 1
- Produces: `SectionRail`, expanded project records, visible heading markup, image-led project cards, and primary email actions

- [ ] **Step 1: Write the failing rendered-HTML contract**

Add this test after the screenshot-asset test:

```js
test("renders the approved Editorial Rail hierarchy", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(html, /I build useful software for real people\./);
  assert.match(html, /CS @ USF/);
  assert.match(html, /Available 2026/);
  assert.match(html, /class="hero-primary"[^>]*href="mailto:keshavtyg@gmail\.com"/);
  assert.match(html, /<h2 id="about-title"[^>]*>Curious by default\. Practical by design\.<\/h2>/);
  assert.match(html, /<h2 id="work-title"[^>]*>A few things I’ve built\.<\/h2>/);
  assert.match(html, /<h2 id="experience-title"[^>]*>Experience<\/h2>/);
  assert.match(html, /<h2 id="toolkit-title"[^>]*>Toolkit<\/h2>/);
  assert.match(html, /alt="WealthLens financial copilot landing page"/);
  assert.match(html, /alt="BayGuard Tampa risk dashboard"/);
  assert.match(html, /projects(?:%2F|\/)wealthlens\.webp/i);
  assert.match(html, /projects(?:%2F|\/)bayguard\.webp/i);
  assert.doesNotMatch(html, /<h2[^>]*class="sr-only"/);
});
```

In the existing `test("renders Keshav's portfolio content and verified links", ...)`, replace:

```js
assert.match(html, /CS student · systems \+ AI/);
```

with:

```js
assert.match(html, /I build useful software for real people\./);
assert.match(html, /CS @ USF/);
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
cd site
npm run build
node --test --test-name-pattern="renders the approved Editorial Rail hierarchy" tests/rendered-html.test.mjs
```

Expected: FAIL because the new hero statement and visible headings are absent.

- [ ] **Step 3: Expand the project model and add `SectionRail`**

At the top of `site/app/page.tsx`, import `Image`, add image/category/tag data, and define the repeated rail component:

```tsx
import Image from "next/image";

const projects = [
  {
    name: "WealthLens",
    category: "Product + AI",
    image: {
      src: "/projects/wealthlens.webp",
      width: 1265,
      height: 712,
      alt: "WealthLens financial copilot landing page",
    },
    tags: ["Next.js", "FastAPI", "PostgreSQL", "Redis", "Machine Learning"],
    description:
      "An AI financial copilot that connects real bank data to cash-flow forecasts, anomaly detection, personalized summaries, and grounded financial guidance.",
    links: [
      {
        label: "Live site",
        href: "https://fin-sight-frontend-blond.vercel.app/",
        ariaLabel: "WealthLens live site",
      },
      {
        label: "GitHub",
        href: "https://github.com/keshav-tyg/WealthLens",
        ariaLabel: "WealthLens GitHub repository",
      },
    ],
  },
  {
    name: "BayGuard Tampa",
    category: "Civic technology",
    image: {
      src: "/projects/bayguard.webp",
      width: 1112,
      height: 712,
      alt: "BayGuard Tampa risk dashboard",
    },
    tags: ["React", "Express", "Gemini", "Redis", "REST APIs"],
    description:
      "A disaster-intelligence platform that combines five live data sources into evacuation guidance, situational summaries, and automated alerts.",
    links: [
      {
        label: "Live site",
        href: "https://bay-guard-usf.vercel.app/",
        ariaLabel: "BayGuard Tampa live site",
      },
    ],
  },
] as const;

function SectionRail({
  id,
  index,
  label,
  title,
  className = "",
  children,
}: {
  id: string;
  index: string;
  label: string;
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  const titleId = `${id}-title`;

  return (
    <section
      id={id}
      className={`content-section editorial-section ${className}`.trim()}
      aria-labelledby={titleId}
    >
      <p className="section-label">
        {index} / {label}
      </p>
      <div className="section-content">
        <h2 id={titleId}>{title}</h2>
        {children}
      </div>
    </section>
  );
}
```

Retain the existing `experience`, `skills`, `external`, and `ExternalLink` definitions unchanged.

- [ ] **Step 4: Replace the page JSX with the approved semantic structure**

Replace `Home()` with:

```tsx
export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>

      <header className="site-header shell">
        <nav aria-label="Primary navigation">
          <a className="brand" href="#top" aria-label="Keshav Tyagi, back to top">
            <span className="brand-dot" aria-hidden="true" />
            Keshav Tyagi
          </a>
          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#work">Work</a>
            <a href={external.email}>Contact</a>
          </div>
        </nav>
      </header>

      <main id="main-content" className="shell">
        <section id="top" className="hero" aria-labelledby="hero-title">
          <p className="eyebrow">CS @ USF<br />Available 2026</p>
          <div className="hero-main">
            <h1 id="hero-title">I build useful software for real people.</h1>
            <p className="hero-copy">
              I’m Keshav, a third-year computer science student focused on practical,
              thoughtful products—from intelligent systems to full-stack web apps.
            </p>
            <div className="hero-actions" aria-label="Profile links">
              <a className="hero-primary" href={external.email}>
                Email me <span aria-hidden="true">↗</span>
              </a>
              <ExternalLink href={external.github} ariaLabel="GitHub profile">GitHub</ExternalLink>
              <ExternalLink href={external.linkedin} ariaLabel="LinkedIn profile">LinkedIn</ExternalLink>
            </div>
          </div>
        </section>

        <SectionRail
          id="about"
          index="01"
          label="About"
          title="Curious by default. Practical by design."
        >
          <p className="about-copy">
            I’m a third-year computer science student at the <strong>University of South Florida</strong>.
            I like turning messy problems into software that feels clear and dependable. My interests
            are broad—product engineering, full-stack systems, data, and AI—but the common thread is
            simple: <strong>build things people can actually use.</strong>
          </p>
        </SectionRail>

        <SectionRail
          id="work"
          index="02"
          label="Selected work"
          title="A few things I’ve built."
          className="work-section"
        >
          <p className="work-note">Two projects shaped around clear problems and useful outcomes.</p>
          <div className="projects">
            {projects.map((project, projectIndex) => (
              <article className="project" key={project.name}>
                <div className="project-shot">
                  <Image
                    src={project.image.src}
                    alt={project.image.alt}
                    width={project.image.width}
                    height={project.image.height}
                    sizes="(max-width: 760px) calc(100vw - 36px), 540px"
                  />
                </div>
                <div className="project-content">
                  <p className="project-meta">
                    <span>{String(projectIndex + 1).padStart(2, "0")}</span>
                    {" · "}
                    {project.category}
                  </p>
                  <h3>{project.name}</h3>
                  <p className="project-copy">{project.description}</p>
                  <ul className="tags" aria-label={`${project.name} technologies`}>
                    {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
                  </ul>
                  <div className="project-links">
                    {project.links.map((link) => (
                      <ExternalLink href={link.href} ariaLabel={link.ariaLabel} key={link.href}>
                        {link.label}
                      </ExternalLink>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </SectionRail>

        <SectionRail id="experience" index="03" label="Experience" title="Experience">
          <div className="experience-list">
            {experience.map((item) => (
              <article className="job" key={item.organization}>
                <p className="job-meta">{item.dates}<br />{item.location}</p>
                <div>
                  <h3>{item.organization}</h3>
                  <p className="role">{item.role}</p>
                  <p className="job-copy">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </SectionRail>

        <SectionRail id="toolkit" index="04" label="Toolkit" title="Toolkit">
          <dl className="skills">
            {skills.map(([group, values]) => (
              <div className="skill-row" key={group}>
                <dt>{group}</dt>
                <dd>{values}</dd>
              </div>
            ))}
          </dl>
        </SectionRail>

        <SectionRail id="contact" index="05" label="Contact" title="Let’s build something useful." className="contact-section">
          <div className="contact-layout">
            <div>
              <p className="contact-copy">
                I’m open to internships, software engineering opportunities, and
                conversations about interesting projects.
              </p>
              <div className="contact-socials">
                <ExternalLink href={external.github} ariaLabel="GitHub profile">GitHub</ExternalLink>
                <ExternalLink href={external.linkedin} ariaLabel="LinkedIn profile">LinkedIn</ExternalLink>
              </div>
            </div>
            <a className="contact-button" href={external.email}>
              Contact me <span aria-hidden="true">↗</span>
            </a>
          </div>
        </SectionRail>
      </main>

      <footer className="site-footer shell">
        <a href={external.email}>keshavtyg@gmail.com</a>
        <span>Tampa, FL · 2026</span>
      </footer>
    </>
  );
}
```

- [ ] **Step 5: Run the rendered-HTML test**

Run:

```bash
cd site
npm run build
node --test --test-name-pattern="renders the approved Editorial Rail hierarchy" tests/rendered-html.test.mjs
```

Expected: PASS.

- [ ] **Step 6: Commit the semantic redesign**

```bash
git add site/app/page.tsx site/tests/rendered-html.test.mjs
git commit -m "feat: build editorial rail layout"
```

---

### Task 3: Implement the Readable Editorial Visual System

**Files:**
- Modify: `site/app/globals.css:1-125`
- Modify: `site/tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: class names and semantic structure from Task 2
- Produces: approved tokens, 1040px editorial grid, image cards, responsive collapse, focus treatment, and reduced-motion behavior

- [ ] **Step 1: Replace the obsolete typography test with the new CSS contract**

Replace `test("gives portfolio text balanced visual emphasis", ...)` with:

```js
test("implements the approved Editorial Rail visual system", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  for (const token of ["#020817", "#edf6ff", "#b8c9d8", "#7891a7", "#56d2ff"]) {
    assert.match(css.toLowerCase(), new RegExp(token));
  }

  assert.match(css, /--font-sans:\s*"Avenir Next",\s*Avenir,\s*Inter/);
  assert.match(css, /\.shell\s*\{[^}]*width:\s*min\(1040px,\s*calc\(100%\s*-\s*72px\)\)/s);
  assert.match(css, /\.hero,\s*\.editorial-section\s*\{[^}]*grid-template-columns:\s*180px\s+1fr/s);
  assert.match(css, /\.section-content\s*>\s*h2\s*\{[^}]*font-size:\s*42px/s);
  assert.match(css, /\.about-copy\s*\{[^}]*max-width:\s*65ch[^}]*font-size:\s*17px/s);
  assert.match(css, /\.project\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1\.05fr\)\s+minmax\(0,\s*0\.95fr\)/s);
  assert.match(css, /\.hero-primary\s*\{[^}]*min-height:\s*44px[^}]*background:\s*var\(--accent\)/s);
  assert.match(css, /@media\s*\(max-width:\s*760px\)/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /overflow-x:\s*hidden/);
  assert.doesNotMatch(css, /cursor:\s*none|canvas|scanline|perspective|parallax/i);
});
```

Update the older palette/responsive test so it checks the new token set and `760px` breakpoint:

```js
test("keeps the approved palette, responsive rules, and motion safeguards", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  for (const token of ["#020817", "#edf6ff", "#b8c9d8", "#7891a7", "#56d2ff", "#19304b"]) {
    assert.match(css.toLowerCase(), new RegExp(token));
  }
  assert.match(css, /@media\s*\(max-width:\s*760px\)/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /overflow-x:\s*hidden/);
});
```

In `test("documents deployment and exposes accessible link contracts", ...)`, replace the existing selector loop and standalone footer-link assertion with:

```js
assert.match(
  css,
  /\.brand\s*\{[^}]*display:\s*inline-flex[^}]*align-items:\s*center[^}]*min-height:\s*44px/s,
);
assert.match(
  css,
  /\.nav-links a,\s*\.hero-actions a,\s*\.project-links a,\s*\.contact-socials a,\s*\.site-footer a\s*\{[^}]*min-height:\s*44px[^}]*display:\s*inline-flex[^}]*align-items:\s*center/s,
);
assert.match(
  css,
  /\.project-links a,\s*\.contact-socials a,\s*\.site-footer a\s*\{[^}]*text-decoration:\s*underline[^}]*text-underline-offset:/s,
);
```

- [ ] **Step 2: Run the new CSS contract to verify it fails**

Run:

```bash
cd site
node --test --test-name-pattern="implements the approved Editorial Rail visual system" tests/rendered-html.test.mjs
```

Expected: FAIL because the old CSS uses a 760px shell and the old color tokens.

- [ ] **Step 3: Replace the global tokens and base layout**

Replace `site/app/globals.css` with the following complete stylesheet:

```css
@import "tailwindcss";

:root {
  --background: #020817;
  --panel: #071426;
  --panel-strong: #09192c;
  --foreground: #edf6ff;
  --body: #b8c9d8;
  --muted: #7891a7;
  --accent: #56d2ff;
  --line: #19304b;
  --font-sans: "Avenir Next", Avenir, Inter, "Segoe UI", Helvetica, Arial, sans-serif;
  --font-mono: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }

body {
  margin: 0;
  min-height: 100vh;
  overflow-x: hidden;
  background:
    radial-gradient(circle at 76% -8%, rgba(32, 117, 179, .15), transparent 34rem),
    linear-gradient(rgba(255, 255, 255, .012) 1px, transparent 1px),
    var(--background);
  background-size: auto, 100% 72px, auto;
  color: var(--foreground);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

a { color: inherit; text-decoration: none; }
a:hover { color: var(--accent); }
a:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 5px;
  border-radius: 3px;
}

.shell {
  width: min(1040px, calc(100% - 72px));
  margin-inline: auto;
}

.skip-link {
  position: fixed;
  z-index: 100;
  top: 12px;
  left: 16px;
  min-height: 44px;
  padding: 12px;
  transform: translateY(-160%);
  background: var(--accent);
  color: #00101a;
  font: 700 12px/1.6 var(--font-mono);
}

.skip-link:focus { transform: translateY(0); }

.site-header nav {
  min-height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  border-bottom: 1px solid rgba(61, 96, 126, .42);
}

.brand {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  gap: 12px;
  font-size: 14px;
  font-weight: 650;
}

.brand-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 18px rgba(86, 210, 255, .6);
}

.nav-links {
  display: flex;
  gap: 28px;
  color: #9eb1c2;
  font: 500 11px/1.5 var(--font-mono);
  letter-spacing: .08em;
  text-transform: uppercase;
}

.nav-links a,
.hero-actions a,
.project-links a,
.contact-socials a,
.site-footer a {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
}

.hero,
.editorial-section {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 36px;
}

.hero {
  min-height: 300px;
  align-items: center;
  border-bottom: 1px solid rgba(61, 96, 126, .42);
}

.eyebrow,
.section-label,
.project-meta,
.job-meta,
.role,
.skills dt {
  font-family: var(--font-mono);
}

.eyebrow,
.section-label {
  margin: 0;
  color: var(--accent);
  font-size: 11px;
  line-height: 1.5;
  letter-spacing: .12em;
  text-transform: uppercase;
}

.hero-main { padding: 54px 0 48px; }
h1, h2, h3, p { margin-top: 0; }

h1 {
  max-width: 800px;
  margin-bottom: 20px;
  font-size: clamp(54px, 6.1vw, 82px);
  font-weight: 680;
  line-height: .98;
  letter-spacing: -.055em;
}

.hero-copy {
  max-width: 60ch;
  margin-bottom: 25px;
  color: var(--body);
  font-size: 18px;
  line-height: 1.62;
  letter-spacing: -.012em;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 23px;
  color: #9db1c3;
  font-size: 14px;
  font-weight: 600;
}

.hero-primary {
  min-height: 44px;
  padding: 0 18px;
  gap: 9px;
  border-radius: 6px;
  background: var(--accent);
  box-shadow: 0 8px 28px rgba(33, 153, 202, .18);
  color: #00101a;
}

.hero-primary:hover { color: #00101a; background: #82dcff; }
.hero-actions a:not(.hero-primary) { border-bottom: 1px solid #3c556b; }

.content-section {
  padding: 52px 0;
  border-bottom: 1px solid rgba(61, 96, 126, .42);
  scroll-margin-top: 24px;
}

.section-label { padding-top: 12px; }
.section-content > h2 {
  max-width: 760px;
  margin: 0;
  font-size: 42px;
  font-weight: 640;
  line-height: 1.08;
  letter-spacing: -.037em;
}

.about-copy {
  max-width: 65ch;
  margin: 21px 0 0;
  color: var(--body);
  font-size: 17px;
  line-height: 1.72;
}

.about-copy strong {
  color: var(--foreground);
  font-weight: 600;
}

.work-section { padding-bottom: 70px; }
.work-note {
  max-width: 42ch;
  margin: 14px 0 29px;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.6;
}

.projects { display: grid; gap: 17px; }

.project {
  min-height: 270px;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, .95fr);
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: linear-gradient(140deg, rgba(13, 32, 54, .96), rgba(6, 19, 36, .96));
  box-shadow: 0 18px 54px rgba(0, 0, 0, .17);
}

.project-shot {
  position: relative;
  min-height: 270px;
  overflow: hidden;
  border-right: 1px solid var(--line);
  background: #0b1725;
}

.project-shot::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  box-shadow: inset -20px 0 45px rgba(2, 8, 23, .13);
}

.project-shot img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: top left;
  filter: saturate(.9) contrast(1.02);
}

.project-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 28px 32px;
}

.project-meta {
  margin: 0;
  color: var(--muted);
  font-size: 10px;
  line-height: 1.5;
  letter-spacing: .12em;
  text-transform: uppercase;
}

.project-meta span { color: var(--accent); }

.project h3 {
  margin: 10px 0 0;
  font-size: 27px;
  font-weight: 630;
  line-height: 1.12;
  letter-spacing: -.035em;
}

.project-copy,
.job-copy,
.contact-copy {
  color: var(--body);
  font-size: 14px;
  line-height: 1.65;
}

.project-copy { max-width: 48ch; margin: 11px 0 0; }

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin: 15px 0 0;
  padding: 0;
  list-style: none;
}

.tags li {
  padding: 5px 8px;
  border: 1px solid #264763;
  border-radius: 4px;
  color: #a8bdcd;
  font: 500 9px/1.5 var(--font-mono);
  letter-spacing: .05em;
  text-transform: uppercase;
}

.project-links {
  display: flex;
  gap: 18px;
  margin-top: 12px;
  color: #d8e9f4;
  font-size: 13px;
  font-weight: 620;
}

.project-links a,
.contact-socials a,
.site-footer a {
  text-decoration: underline;
  text-decoration-color: #4d6f88;
  text-decoration-thickness: 1px;
  text-underline-offset: 5px;
}

.experience-list { margin-top: 24px; }
.job {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 28px;
  padding: 24px 0;
  border-top: 1px solid rgba(25, 48, 75, .8);
}

.job:first-child { padding-top: 0; border-top: 0; }
.job-meta {
  margin: 0;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.65;
}

.job h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 620;
  letter-spacing: -.02em;
}

.role {
  margin: 4px 0 10px;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.5;
  letter-spacing: .06em;
  text-transform: uppercase;
}

.job-copy { max-width: 65ch; margin: 0; }
.skills { margin: 22px 0 0; }
.skill-row {
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 28px;
  padding: 11px 0;
}

.skills dt {
  color: var(--foreground);
  font-size: 11px;
  line-height: 1.7;
}

.skills dd {
  margin: 0;
  color: var(--body);
  font-size: 14px;
  line-height: 1.7;
}

.contact-layout {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: end;
  gap: 40px;
  margin-top: 18px;
}

.contact-copy { max-width: 60ch; margin: 0; }
.contact-socials {
  display: flex;
  gap: 18px;
  margin-top: 12px;
  color: var(--muted);
  font: 500 12px/1.2 var(--font-mono);
}

.contact-button {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 17px;
  border: 1px solid var(--accent);
  border-radius: 6px;
  color: var(--accent);
  font: 600 12px/1 var(--font-mono);
  white-space: nowrap;
}

.contact-button:hover { background: var(--accent); color: #00101a; }

.site-footer {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding: 32px 0 54px;
  color: var(--muted);
  font: 500 11px/1.5 var(--font-mono);
}

@keyframes reveal {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: no-preference) {
  .hero,
  .content-section { animation: reveal .45s ease-out both; }
}

@media (max-width: 760px) {
  .shell { width: min(100% - 36px, 620px); }
  .hero,
  .editorial-section {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  .hero { padding: 42px 0; }
  .hero-main { padding: 0; }
  .section-label { padding-top: 0; }
  .content-section { padding: 44px 0; }
  .project { grid-template-columns: 1fr; }
  .project-shot {
    min-height: 210px;
    border-right: 0;
    border-bottom: 1px solid var(--line);
  }
  .job,
  .skill-row,
  .contact-layout { grid-template-columns: 1fr; }
  .job,
  .skill-row { gap: 10px; }
  .contact-layout { gap: 24px; }
  .contact-button { width: fit-content; }
}

@media (max-width: 520px) {
  .nav-links a:nth-child(2) { display: none; }
  .nav-links { gap: 18px; }
  h1 { font-size: clamp(46px, 14vw, 64px); }
  .section-content > h2 { font-size: 36px; }
  .project-content { padding: 24px 22px; }
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}
```

- [ ] **Step 4: Run the full automated suite**

Run:

```bash
cd site
npm run lint
npm test
npm run build:vercel
```

Expected:

- ESLint exits `0`.
- All Node tests pass.
- Vinext build completes and writes `dist/server/index.js`.
- Next.js build completes without type or route errors.

- [ ] **Step 5: Commit the visual system**

```bash
git add site/app/globals.css site/tests/rendered-html.test.mjs
git commit -m "style: apply editorial rail system"
```

---

### Task 4: Visual QA, Push, and Production Deployment

**Files:**
- Verify: `site/app/page.tsx`
- Verify: `site/app/globals.css`
- Verify: `site/public/projects/wealthlens.webp`
- Verify: `site/public/projects/bayguard.webp`
- Verify: `site/.openai/hosting.json`

**Interfaces:**
- Consumes: Completed source and tests from Tasks 1–3
- Produces: Verified GitHub/Vercel source state and a matching deployed OpenAI Sites version

- [ ] **Step 1: Start the local portfolio**

Run:

```bash
cd site
npm run dev
```

Expected: Vinext reports a local HTTP URL and serves the portfolio without runtime errors.

- [ ] **Step 2: Verify the desktop layout in the browser**

At a 1440×900 viewport, confirm:

- the top navigation fits on one line;
- the hero uses the 180px metadata rail;
- “Email me” is the only filled hero action;
- About is the first content section;
- every section heading is visible;
- both project cards show a real screenshot;
- each project’s links sit below its tags and description;
- body copy remains visually capped near 65 characters per line;
- Experience, Toolkit, and Contact use the same rail system;
- the browser console contains no errors.

Also evaluate:

```js
document.documentElement.scrollWidth === document.documentElement.clientWidth
```

Expected: `true`.

- [ ] **Step 3: Verify the mobile layout in the browser**

At a 390×844 viewport, confirm:

- the rail collapses to one column;
- section labels remain above visible headings;
- project screenshots stack above project copy;
- no text, tag, button, or screenshot overflows;
- Email and Contact actions remain at least 44px tall;
- keyboard focus remains visible;
- reduced-motion mode removes the entrance animation.

Evaluate the horizontal-overflow expression again.

Expected: `true`.

- [ ] **Step 4: Run final verification against the exact source state**

Stop the dev server, then run:

```bash
cd site
npm run lint
npm test
npm run build:vercel
cd ..
git diff --check
git status --short --branch
```

Expected: all commands succeed and the worktree contains no uncommitted changes.

- [ ] **Step 5: Push the verified source to GitHub and Vercel**

Run:

```bash
git push origin HEAD:main
git rev-parse HEAD
```

Expected: GitHub accepts the push to `main`; the printed SHA is the exact source state Vercel deploys.

- [ ] **Step 6: Package the exact Vinext build for Sites**

From the repository root, run:

```bash
bash /Users/keshavtyagi/.codex/plugins/cache/openai-bundled/sites/0.1.30/skills/sites-hosting/scripts/package-site.sh \
  site \
  /tmp/keshav-portfolio-editorial-rail.tar.gz
tar -tzf /tmp/keshav-portfolio-editorial-rail.tar.gz | rg 'dist/server/index.js|dist/.openai/hosting.json'
```

Expected: the archive contains both required paths.

- [ ] **Step 7: Save and deploy the matching Sites version**

Read `site/.openai/hosting.json` and use the exact project ID `appgprj_6a5a94abdc5881919fa0b289279cc938`.

Save a Sites version with:

- `commit_sha`: the SHA printed in Step 5
- `archive`: `/tmp/keshav-portfolio-editorial-rail.tar.gz`
- `project_id`: `appgprj_6a5a94abdc5881919fa0b289279cc938`

Deploy only the returned saved version ID. If the initial deployment state is not terminal, inspect deployment status until it becomes `deployed` or returns an actionable failure.

Expected: the saved version deploys to the existing production Sites URL.

- [ ] **Step 8: Verify both production destinations**

Open the clean Vercel domain and the Sites production URL. On each, verify:

- the Editorial Rail hero is visible;
- WealthLens and BayGuard screenshots load;
- the Email button resolves to `mailto:keshavtyg@gmail.com`;
- WealthLens, BayGuard, GitHub, and LinkedIn links retain their expected destinations;
- the production console contains no new errors.

Expected: both deployments render the same approved portfolio.
