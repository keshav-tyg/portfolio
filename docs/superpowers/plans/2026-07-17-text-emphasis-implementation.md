# Portfolio Text Emphasis Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the portfolio typography brighter and moderately stronger without changing its minimal ink-navy layout.

**Architecture:** Keep the change inside the existing stylesheet and rendered-output contract. One test-first visual task updates shared color and typography rules; one release task validates and publishes the exact resulting commit to GitHub, Vercel-compatible source, and the existing private Sites project.

**Tech Stack:** Next.js 16, React 19, Vinext, CSS, Node test runner, OpenAI Sites, Vercel

## Global Constraints

- Preserve the current dark-blue background, cyan accent, single-column layout, spacing, responsive breakpoint, and motion behavior.
- Do not change page copy, markup structure, metadata, dependencies, or hosting configuration.
- Changed text colors must meet WCAG AA contrast against `#020713`.
- Preserve all existing focus states, 44px touch targets, semantic structure, and accessible labels.
- Add no glow, shadow, decorative effect, animation, or new UI element.

---

### Task 1: Apply Balanced Text Emphasis

**Files:**
- Modify: `site/tests/rendered-html.test.mjs`
- Modify: `site/app/globals.css`

**Interfaces:**
- Consumes: the existing CSS tokens and the `keeps the approved palette, responsive rules, and motion safeguards` test.
- Produces: a brighter `--muted: #8aa4b7` token and explicit stronger typography rules used by the existing page markup.

- [ ] **Step 1: Append the failing visual contract**

Append this test to `site/tests/rendered-html.test.mjs`:

```js
test("gives portfolio text balanced visual emphasis", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  assert.match(css, /--muted:\s*#8aa4b7/i);
  assert.match(css, /h1\s*\{[^}]*font-weight:\s*700/s);
  assert.match(css, /h2\s*\{[^}]*font-weight:\s*650/s);
  assert.match(css, /h3\s*\{[^}]*font-weight:\s*600/s);
  assert.match(css, /\.hero-copy\s*\{[^}]*color:\s*#aec1d0[^}]*font-weight:\s*500/s);
  assert.match(css, /\.about-copy\s*\{[^}]*color:\s*#a9bdcb[^}]*font-size:\s*17px[^}]*font-weight:\s*500/s);
  assert.match(css, /\.project\s*>\s*p:last-child,\s*\.job div\s*>\s*p:last-child\s*\{[^}]*font-size:\s*14px[^}]*font-weight:\s*500/s);
  assert.match(css, /\.skills dd\s*\{[^}]*font-size:\s*14px[^}]*font-weight:\s*500/s);
  assert.match(css, /\.site-footer\s*\{[^}]*font:\s*500 11px\/1\.5/s);
});
```

- [ ] **Step 2: Run the test suite to verify RED**

Run from `site/`:

```bash
npm test
```

Expected: the existing six tests pass and `gives portfolio text balanced visual emphasis` fails because `--muted` is still `#718ca1`.

- [ ] **Step 3: Implement the balanced typography rules**

Update the relevant rules in `site/app/globals.css` to these exact values while leaving layout properties unchanged:

```css
:root {
  --muted: #8aa4b7;
}

h1 { font-weight: 700; }
h2 { font-weight: 650; }
h3 { font-weight: 600; }

.hero-copy { color: #aec1d0; font-weight: 500; }
.about-copy { color: #a9bdcb; font-size: 17px; font-weight: 500; }
.project > p:last-child, .job div > p:last-child { font-size: 14px; font-weight: 500; }
.job-meta { font-size: 11px; }
.role { font-size: 11px; }
.stack { font-size: 11px; }
.skills dd { font-size: 14px; font-weight: 500; }
.contact > div > p:not(.section-label) { font-weight: 500; }
.contact-socials { color: var(--muted); font-size: 12px; }
.site-footer { font: 500 11px/1.5 var(--font-mono); }
```

Preserve every existing margin, line-height, display, spacing, border, breakpoint, and motion declaration in those rules.

- [ ] **Step 4: Run full local verification**

Run from `site/`:

```bash
npm test
npm run build:vercel
npm run lint
```

Expected: seven tests pass; both production builds and lint exit 0.

- [ ] **Step 5: Review and commit**

Run from the repository root:

```bash
git diff --check
git diff -- site/app/globals.css site/tests/rendered-html.test.mjs
git add site/app/globals.css site/tests/rendered-html.test.mjs
git commit -m "style: strengthen portfolio typography"
```

Expected: one commit containing only the stylesheet and its focused test.

---

### Task 2: Publish the Validated Revision

**Files:**
- Verify: `site/**`
- Preserve: `site/.openai/hosting.json`

**Interfaces:**
- Consumes: the clean Task 1 commit and the existing Sites `project_id`.
- Produces: GitHub `main` and one new private Sites version pointing to the same commit SHA.

- [ ] **Step 1: Reconfirm the release state**

Run from the repository root:

```bash
git status --short --branch
git rev-parse HEAD
```

Expected: a clean worktree on `codex/portfolio-build`, tracking `origin/main`.

- [ ] **Step 2: Push the validated commit to GitHub**

```bash
git push origin HEAD:main
```

Expected: GitHub `main` advances to the Task 1 commit.

- [ ] **Step 3: Publish through Sites**

Follow `sites:sites-hosting`: reuse the `project_id` in `site/.openai/hosting.json`, obtain a fresh source credential, push the same commit SHA, package `site/`, save exactly one new version, deploy it privately, and poll to terminal `succeeded`.

Expected: the existing private URL serves a Sites version whose `commit_sha` exactly matches local `HEAD` and GitHub `main`.

- [ ] **Step 4: Clean up and record evidence**

Delete the temporary site archive, then run:

```bash
git status --short --branch
git ls-remote origin refs/heads/main
```

Expected: the worktree is clean and the remote SHA equals local `HEAD`.

