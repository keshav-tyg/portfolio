# Editorial Rail Portfolio Redesign

**Date:** 2026-07-24
**Status:** Approved visual direction; implementation pending

## Goal

Make Keshav Tyagi’s portfolio easier and more inviting to read while preserving its simple, dark-blue character. The page should communicate a broad practical-software focus, with AI presented as one part of the work rather than the entire identity.

The approved direction is **Editorial Rail**: a wide structural layout with a narrow metadata rail, readable humanist sans-serif typography, visible section headings, and project cards built around real product screenshots.

## Information Architecture

Keep the existing order and content areas:

1. Hero
2. About
3. Selected work
4. Experience
5. Toolkit
6. Contact
7. Footer

The redesign changes presentation and hierarchy, not the underlying résumé content. About remains the first content section.

## Layout

- Use a centered structural container approximately `1040px` wide with `36px` desktop side gutters.
- Use a recurring two-column editorial grid:
  - `180px` metadata rail
  - flexible content column
  - `36px` gap
- Keep prose blocks at `60–65ch` even when the structural container is wider.
- Use visible dividers between major sections.
- Reduce section padding from the current `72px` to roughly `44–56px` so the page feels intentional rather than sparse.
- Reuse the rail pattern for Experience and Toolkit to make the page feel like one coherent system.

## Typography

- Primary stack: `"Avenir Next", Avenir, Inter, "Segoe UI", Helvetica, Arial, sans-serif`.
- Monospace is reserved for navigation, section numbers, dates, locations, technology tags, and small metadata.
- Hero headline: `clamp(54px, 6.1vw, 82px)`, weight around `680`, line-height near `0.98`.
- Visible section headings: approximately `42px`, weight around `640`, line-height near `1.08`.
- Body copy: `17–18px` with `1.62–1.72` line-height.
- Project descriptions: at least `14px` with approximately `1.58` line-height.
- Use stronger white for headings and emphasized phrases; use the muted body color only for supporting copy.
- Remove screen-reader-only treatment from the primary section headings. Each section must have a visible `h2`.

## Color and Hierarchy

- Background: very dark navy near `#020817`.
- Panel surfaces: navy values near `#071426` and `#09192c`.
- Primary text: near-white blue `#edf6ff`.
- Body text: light blue-gray near `#b8c9d8`.
- Muted metadata: blue-gray near `#7891a7`.
- Accent: bright cyan near `#56d2ff`.
- Restrict cyan to the brand mark, section numbers, key metadata, focus states, and the primary Email action.
- Maintain at least WCAG AA contrast for all body-sized text and controls.

## Hero

- Replace the name-only headline with the approved value statement:
  - “I build useful software for real people.”
- Keep a small left rail reading “CS @ USF” and “Available 2026.”
- Introduce Keshav in a concise paragraph that covers practical products, intelligent systems, and full-stack work.
- Make “Email me” the primary filled action.
- Keep GitHub and LinkedIn as quieter underlined text links.
- Preserve the simple top navigation with About, Work, and Contact.

## About

- Show `01 / About` in the metadata rail.
- Use the visible heading:
  - “Curious by default. Practical by design.”
- Keep the current biography’s substance, with important phrases emphasized in brighter text.
- Cap the paragraph at `65ch`.

## Selected Work

- Show `02 / Selected work` in the metadata rail.
- Use the visible heading:
  - “A few things I’ve built.”
- Present WealthLens and BayGuard as image-led cards.
- Each card uses a two-column split:
  - left: real screenshot
  - right: project metadata, name, concise description, technology tags, and links
- Keep links directly beneath the project description/tags rather than at the far edge of the row.
- Use approximately `1.05fr / 0.95fr` columns on desktop.
- Use rounded `12px` panels with a restrained navy border and subtle shadow.
- Screenshots should be fresh captures of the live projects, optimized for the web, stored locally, and rendered with `next/image`.
- WealthLens links to its live site and GitHub repository.
- BayGuard links to its live site.
- Screenshot alt text must identify the interface shown without repeating nearby prose.

## Experience, Toolkit, and Contact

- Give Experience and Toolkit visible `h2` headings at the same size as About and Selected work.
- Keep existing experience and skill content.
- Preserve the metadata/content split for dates, locations, and skill categories.
- Keep Contact as the final section with the existing internship/opportunity message.
- “Contact me” must remain a `mailto:keshavtyg@gmail.com` link and should be the strongest action in that section.

## Responsive Behavior

- At `760px` and below:
  - collapse the editorial rail into a single column
  - place section labels above headings
  - stack project screenshots above project copy
  - remove the vertical border between screenshot and copy
  - use approximately `18px` side gutters
- Hide only nonessential navigation links when horizontal space is limited.
- Keep all tap targets at least `44px` tall.
- Ensure text never overflows and project images retain a useful crop.

## Motion and Accessibility

- Retain only a subtle entrance reveal.
- Honor `prefers-reduced-motion`.
- Preserve the skip link and semantic landmarks.
- Preserve keyboard focus indicators.
- External links must remain clearly labeled and open safely.
- Do not communicate state or hierarchy through color alone.

## Non-Goals

- No additional third project with placeholder content.
- No résumé download button.
- No heavy animation, 3D effects, custom cursor, or decorative visual noise.
- No change to the existing contact email or social profile destinations.

## Acceptance Criteria

- Every major section has a visible heading.
- The desktop structural container is approximately `1040px`, while prose remains no wider than `65ch`.
- The hero has one clearly dominant Email action.
- WealthLens and BayGuard both show real project screenshots.
- Project links sit close to their related descriptions.
- Cyan is used as an accent, not as a second body-text color.
- The page remains readable and fully usable at desktop and mobile breakpoints.
- `npm run lint`, `npm run build`, and the existing test suite pass.
- The finished site is visually verified in-browser before deployment.
