# Hero Copy Simplification

## Goal

Make the opening of Keshav Tyagi's portfolio factual, restrained, and free of
generic portfolio language. Keep personal background in the About section
instead of repeating it in the hero.

## Approved copy

- Hero heading: `Software, data, and applied AI.`
- About heading: `About me.`

## Hero changes

- Remove `CS @ USF`.
- Remove `Available 2026`.
- Remove the introductory paragraph beginning `I’m Keshav`.
- Keep the Email, GitHub, and LinkedIn actions unchanged.
- Keep the hero content aligned with the main editorial content column. Because
  the left-side hero label is removed, assign the hero content explicitly to
  the second desktop grid column and return it to the first column at the
  existing mobile breakpoint.

## About changes

- Replace `Curious by default. Practical by design.` with `About me.`
- Preserve the existing About paragraph, including the USF background and the
  broader software, systems, data, and AI focus.

## Scope

- No changes to projects, experience, toolkit, contact, colors, typography,
  navigation, or links.
- No new components or dependencies.

## Validation

- Rendered output contains the new hero and About headings.
- Rendered output does not contain the removed hero label or introductory
  paragraph.
- Desktop hero content remains in the main editorial column.
- Mobile hero remains a single-column layout without horizontal overflow.
- Existing lint, tests, Vinext build, and Vercel build remain successful.
