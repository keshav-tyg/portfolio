const projects = [
  {
    name: "WealthLens",
    stack: "Next.js · FastAPI · PostgreSQL · Redis · Machine Learning",
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
    stack: "React · Express · Gemini · Redis · REST APIs",
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

function ExternalLink({
  href,
  ariaLabel,
  children,
}: {
  href: string;
  ariaLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <a href={href} target="_blank" rel="noreferrer" aria-label={ariaLabel}>
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
            <ExternalLink href={external.github} ariaLabel="GitHub profile">GitHub</ExternalLink>
            <ExternalLink href={external.linkedin} ariaLabel="LinkedIn profile">LinkedIn</ExternalLink>
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
                      <ExternalLink href={link.href} ariaLabel={link.ariaLabel} key={link.href}>
                        {link.label}
                      </ExternalLink>
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
              <ExternalLink href={external.github} ariaLabel="GitHub profile">GitHub</ExternalLink>
              <ExternalLink href={external.linkedin} ariaLabel="LinkedIn profile">LinkedIn</ExternalLink>
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
