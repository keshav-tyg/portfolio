# Keshav Tyagi Portfolio Design

## Goal

Create a simple, recruiter-friendly portfolio for Keshav Tyagi, a third-year computer science student at the University of South Florida. The site should present him broadly as a software builder with a recurring interest in AI, not as an AI-only candidate.

The primary audience is recruiters and engineering teams evaluating Keshav for internships and early-career software engineering roles. A visitor should understand who he is, what he has built, and how to contact him within one short scroll.

## Positioning

The site presents Keshav as a computer science student who builds practical systems across the stack. AI and machine learning appear as strengths within broader product and systems work.

Hero label:

> CS student · systems + AI

Hero statement:

> I build practical software across the stack, with a growing interest in intelligent systems that turn complex data into useful decisions.

## Information Architecture

The portfolio is one scrolling page. The order is:

1. Hero
2. About
3. Selected work
4. Experience
5. Toolkit
6. Contact

The compact navigation contains `about`, `work`, `experience`, and `contact me`. It does not contain a résumé link. The portfolio complements the résumé instead of reproducing it.

### Hero

Show Keshav's name, positioning label, concise statement, and direct links to About, GitHub, LinkedIn, and email.

### About

Place About immediately after the hero. Use the following approved direction:

> I’m a third-year computer science student at the University of South Florida. I like understanding the whole system—what problem it solves, how the product feels, and what makes it reliable. Lately, I’m especially interested in where AI can improve real workflows without becoming the whole story.

### Selected Work

Feature two projects as clean rows rather than large cards:

- **WealthLens** — An AI financial copilot that connects real bank data to cash-flow forecasts, anomaly detection, personalized summaries, and grounded financial guidance.
- **BayGuard Tampa** — A disaster-intelligence platform that combines five live data sources into evacuation guidance, situational summaries, and automated alerts.

Each project row includes its short description, concise technology list, and only verified repository or deployed-demo links. Omit a link entirely when its destination cannot be confirmed; never show a disabled or placeholder action.

Confirmed project destinations:

- WealthLens live site: `https://fin-sight-frontend-blond.vercel.app/`
- WealthLens repository: `https://github.com/keshav-tyg/WealthLens`
- BayGuard Tampa live site: `https://bay-guard-usf.vercel.app/`

Do not expose the Vercel deployment-dashboard URL. Link visitors directly to the public production site.

### Experience

Show the two most relevant roles in the primary experience section:

- USF Office of the Provost — Student Assistant, June 2026 to present
- Family-Owned Business — Import & Export Assistant, 2022 to 2024

Keep each description shorter and more conversational than the résumé. Do not reproduce all résumé bullets.

### Toolkit

Use four compact text groups rather than an icon wall:

- Languages
- Backend + Data
- AI + ML
- Frontend + Cloud

### Contact

End with a small contact section containing the headline “Let’s build something useful.” Include email, GitHub, and LinkedIn. State that Keshav is open to internships, software engineering opportunities, and conversations about interesting projects.

Confirmed destinations:

- Email: `mailto:keshavtyg@gmail.com`
- GitHub: `https://github.com/keshav-tyg`
- LinkedIn: `https://linkedin.com/in/keshav--tyagi`

The navigation's `contact me` item and the closing contact button both open a new email draft addressed to `keshavtyg@gmail.com`. Do not display Keshav's phone number. Do not include a contact form, résumé link, blog, gallery, or separate page in the first version.

## Visual Design

The approved direction is a simplified version of “Deep Signal”: restrained, technical, and dark blue without dashboard chrome or cyberpunk effects.

### Palette

- Page background: `#020713`
- Subtle top radial tone: `#0A1C2D`
- Primary text: `#D6E8F5`
- Muted text: `#718CA1`
- Cyan accent: `#49B9DF`
- Dividers and borders: `#102A40`

The background remains nearly solid ink navy. Do not use scan lines, a visible grid, neon glow, or high-contrast gradients.

### Typography

- Headings and body: a clean system sans-serif stack
- Navigation, labels, dates, and technology lists: a system monospace stack
- Use strong scale and spacing for hierarchy, not decoration

### Layout

- Centered content column with a maximum width of approximately 760 pixels
- Desktop horizontal padding of 20 pixels per side at minimum
- Large but not oversized name in the hero
- Thin section dividers
- Generous vertical spacing and compact content rows
- No photo, status panel, sidebar, boxed skill grid, or oversized project cards

## Interaction Design

Interactions remain subtle:

- Smooth in-page navigation
- Underline or color changes on links
- A restrained first-load reveal for major content regions
- Reduced-motion users receive no entrance motion or smooth scrolling

Do not add cursor effects, loading screens, music, 3D graphics, parallax, or decorative interaction loops.

## Responsive Behavior

The mobile layout preserves the same reading order in one column. Experience rows and the contact call to action stack vertically. Navigation keeps the brand and essential contact path visible without horizontal overflow.

All interactive targets must remain comfortably tappable. Text must not require horizontal scrolling at 320 pixels wide.

## Accessibility

- Use semantic landmarks and heading order
- Include a skip link
- Preserve visible keyboard focus
- Meet WCAG AA contrast for body text and interactive elements
- Honor `prefers-reduced-motion`
- Give external links descriptive accessible names
- Do not rely on color alone to indicate interaction

## Technical Architecture

Build a static, single-route site using the Sites starter structure. Keep the implementation small:

- `app/page.tsx` composes the page sections
- `app/globals.css` owns the visual system and responsive rules
- `app/layout.tsx` owns metadata and the social-preview configuration
- Small local components may be extracted only when they clarify repeated project or experience rows

All portfolio content is local and version-controlled. The page has no database, CMS, runtime API calls, authentication, analytics requirement, or form submission.

## Data and Error Handling

There is no runtime data flow beyond normal navigation. Project and social links are static constants. Verify each destination before shipping. If a project destination is unavailable or ambiguous, omit that link.

Email contact uses a `mailto:` link, so there is no submission state or server-side failure path. External links open safely and include appropriate relationship attributes when opened in a new tab.

## Validation

Before publishing:

- Run the production build and resolve all failures
- Check the layout at mobile and desktop widths
- Test navigation with a keyboard
- Verify visible focus and reduced-motion behavior
- Confirm no horizontal overflow at 320 pixels
- Check every external link and email destination
- Confirm the final page contains no résumé link, placeholder action, starter content, or dead button
- Confirm metadata describes Keshav and the final site accurately

## Out of Scope

The first version excludes multiple routes, a blog, a gallery, a contact form, a CMS, a downloadable résumé, persistent data, authentication, and elaborate motion. These can be added later only when Keshav has content that justifies them.
