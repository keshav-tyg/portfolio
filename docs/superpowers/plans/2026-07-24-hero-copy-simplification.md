# Hero Copy Simplification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the clichéd opening copy with restrained factual language, remove redundant hero biography text, and preserve the Editorial Rail layout.

**Architecture:** Keep the existing page and stylesheet structure. Remove the hero rail label and paragraph from the React markup, explicitly place the remaining hero content in the second desktop grid column, and reset it to the first column at the existing mobile breakpoint.

**Tech Stack:** Next.js, React, TypeScript, CSS, Node test runner, Vinext

## Global Constraints

- Hero heading must be exactly `Software, data, and applied AI.`
- About heading must be exactly `About me.`
- Remove `CS @ USF`, `Available 2026`, and the hero paragraph beginning `I’m Keshav`.
- Preserve Email, GitHub, and LinkedIn actions.
- Preserve the About paragraph and every section after About.
- Add no dependencies or new components.

---

### Task 1: Simplify the hero and About copy

**Files:**
- Modify: `site/tests/rendered-html.test.mjs`
- Modify: `site/app/page.tsx`
- Modify: `site/app/globals.css`

**Interfaces:**
- Consumes: the existing server-rendered portfolio page and `.hero` two-column grid.
- Produces: a hero with one `h1` and its action group in desktop column two, plus the existing About section under `About me.`

- [ ] **Step 1: Write the failing rendered-output test**

Update the Editorial Rail hierarchy assertions to require the approved copy and reject the removed copy:

```js
assert.match(html, /<h1 id="hero-title">Software, data, and applied AI\.<\/h1>/);
assert.match(html, /<h2 id="about-title"[^>]*>About me\.<\/h2>/);
assert.doesNotMatch(html, /CS @ USF|Available 2026/);
assert.doesNotMatch(html, /I’m Keshav, a third-year computer science student/);
assert.doesNotMatch(html, /class="hero-copy"/);
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```bash
cd site
npm test
```

Expected: the hierarchy/content tests fail because the page still renders the old hero title, rail label, hero paragraph, and About heading.

- [ ] **Step 3: Implement the minimal markup change**

Replace the current hero with:

```tsx
<section id="top" className="hero" aria-labelledby="hero-title">
  <div className="hero-main">
    <h1 id="hero-title">Software, data, and applied AI.</h1>
    <div className="hero-actions" role="group" aria-label="Profile links">
      <a className="hero-primary" href={external.email}>
        Email me <span aria-hidden="true">↗</span>
      </a>
      <ExternalLink href={external.github} ariaLabel="GitHub profile">GitHub</ExternalLink>
      <ExternalLink href={external.linkedin} ariaLabel="LinkedIn profile">LinkedIn</ExternalLink>
    </div>
  </div>
</section>
```

Change the About `SectionRail` title to:

```tsx
title="About me."
```

- [ ] **Step 4: Preserve the editorial alignment**

Update the desktop rule:

```css
.hero-main {
  grid-column: 2;
  padding: 54px 0 48px;
}
```

Update the existing `max-width: 760px` rule:

```css
.hero-main {
  grid-column: 1;
  padding: 0;
}
```

Remove the unused `.eyebrow` selectors and the unused `.hero-copy` rule.

- [ ] **Step 5: Run GREEN verification**

Run:

```bash
cd site
npm run lint
npm test
npm run build:vercel
git diff --check
```

Expected: lint succeeds, all 10 tests pass, both Vinext and Vercel builds succeed, and the diff check reports no errors.

- [ ] **Step 6: Review, commit, and publish**

Review the diff against the design spec, commit the three implementation files, push the exact commit to `main`, package the validated Vinext build, save one Sites version, and deploy that saved version privately.
