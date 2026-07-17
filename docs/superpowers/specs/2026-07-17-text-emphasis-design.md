# Portfolio Text Emphasis Design

## Goal

Make the portfolio text easier to notice and read while preserving the existing simple, dark ink-navy design. The change should feel like a clearer version of the current site, not a redesign.

## Approved Direction

Use balanced emphasis: combine brighter contrast with small, restrained increases in type size and weight.

## Visual Changes

- Brighten the shared muted text color so secondary copy remains visibly subordinate but no longer fades into the background.
- Increase project descriptions, experience descriptions, toolkit values, and footer text by approximately 1px where they currently feel undersized.
- Give body and supporting copy slightly firmer font weights without making paragraphs look bold.
- Strengthen section and project headings with modest weight increases; keep the current sizes and spacing hierarchy largely intact.
- Preserve the cyan accent, dark-blue background, single-column layout, responsive behavior, and reduced-motion support.
- Avoid new effects, shadows, glows, gradients, animations, or decorative UI.

## Accessibility and Responsive Behavior

- All changed text colors must retain at least WCAG AA contrast against the page background.
- Existing 44px touch targets, focus-visible states, semantic structure, and accessible labels remain unchanged.
- Mobile layout and breakpoint behavior remain unchanged; type increases must not cause horizontal overflow or cramped project headers.

## Implementation Surface

- Primary change: `site/app/globals.css`.
- Update the rendered-output contract in `site/tests/rendered-html.test.mjs` to pin the brighter muted token and the key typography rules.
- No content, component structure, metadata, hosting configuration, or dependencies change.

## Validation

- Observe the new contract fail before the stylesheet change.
- Run the full Vinext/rendered-output test suite.
- Run the independent Vercel/Next.js production build.
- Run lint and whitespace checks.
- Publish a new private Sites version from the exact validated commit and push the same commit to GitHub `main`.

