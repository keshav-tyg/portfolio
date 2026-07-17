# Keshav Tyagi Portfolio

Keshav Tyagi's single-page software engineering portfolio, built with Next.js and React. The project supports both OpenAI Sites through Vinext and a standard Vercel deployment.

## Requirements

- Node.js 22.13 or newer
- npm

## Local development

Install dependencies and start the Vinext development server:

```bash
npm install
npm run dev
```

The site is then available at the local URL printed by Vinext.

## Tests

```bash
npm test
```

This runs the production Vinext build followed by the rendered HTML contract tests in `tests/`.

## Production builds

For OpenAI Sites, run:

```bash
npm run build
```

This creates the Vinext output used by Sites. Hosting configuration lives in `.openai/hosting.json`.

For Vercel, run the independent Next.js build:

```bash
npm run build:vercel
```

When importing the repository into Vercel, set **Root Directory** to `site`. The checked-in `vercel.json` selects Next.js and uses the same build command.

## Project structure

- `app/page.tsx` — portfolio content and page markup
- `app/globals.css` — design tokens, layout, responsive styles, and accessibility states
- `public/` — static assets and social preview image
- `tests/rendered-html.test.mjs` — build and rendered-output contracts
- `.openai/hosting.json` — Sites hosting configuration
- `vercel.json` — Vercel build configuration
