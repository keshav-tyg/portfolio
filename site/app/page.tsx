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
      width: 1761,
      height: 944,
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

        <SectionRail
          id="about"
          index="01"
          label="About"
          title="About me."
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
                  {/* eslint-disable-next-line @next/next/no-img-element -- Vinext's optimizer route requires unavailable local runtime bindings. */}
                  <img
                    src={project.image.src}
                    alt={project.image.alt}
                    width={project.image.width}
                    height={project.image.height}
                    loading="lazy"
                    decoding="async"
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
