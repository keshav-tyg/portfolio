import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

function readLossyWebPDimensions(bytes) {
  assert.equal(bytes.toString("ascii", 0, 4), "RIFF");
  assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
  assert.equal(bytes.toString("ascii", 12, 16), "VP8 ");

  return {
    width: bytes.readUInt16LE(26) & 0x3fff,
    height: bytes.readUInt16LE(28) & 0x3fff,
  };
}

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("renders Keshav's portfolio content and verified links", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Keshav Tyagi \| Computer Science &amp; Software<\/title>/i);
  assert.match(html, /Software, data, and applied AI\./);
  assert.match(html, /Keshav Tyagi/);
  assert.match(html, /id="main-content"/);
  assert.match(html, /id="about"/);
  assert.match(html, /id="work"/);
  assert.match(html, /id="experience"/);
  assert.match(html, /id="toolkit"/);
  assert.match(html, /id="contact"/);
  assert.match(html, /WealthLens/);
  assert.match(html, /BayGuard Tampa/);
  assert.match(html, /mailto:keshavtyg@gmail\.com/);
  assert.match(html, /https:\/\/github\.com\/keshav-tyg/);
  assert.match(html, /https:\/\/linkedin\.com\/in\/keshav--tyagi/);
  assert.match(html, /https:\/\/fin-sight-frontend-blond\.vercel\.app\//);
  assert.match(html, /https:\/\/bay-guard-usf\.vercel\.app\//);

  const order = ["about", "work", "experience", "toolkit", "contact"].map(
    (id) => html.indexOf(`id="${id}"`),
  );
  assert.ok(order.every((index) => index >= 0));
  assert.deepEqual(order, [...order].sort((a, b) => a - b));

  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/i);
  assert.doesNotMatch(html, /résumé|resume|keshav54@usf\.edu|813[ -]327[ -]9470/i);
});

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

  const bayGuardBytes = await readFile(assets[1]);
  assert.equal(
    createHash("sha256").update(bayGuardBytes).digest("hex"),
    "8fe1e86149de103f23de9638c98fc415468e34233a6c2c15a9f64a5d74aac02a",
    "BayGuard should keep the approved fully loaded risk-map capture",
  );
});

test("renders project screenshots from direct runtime-compatible asset URLs", async () => {
  const response = await render();
  const html = await response.text();
  const pageSource = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const bayGuardBytes = await readFile(
    new URL("../public/projects/bayguard.webp", import.meta.url),
  );
  const bayGuardDimensions = readLossyWebPDimensions(bayGuardBytes);

  assert.match(
    html,
    /<img[^>]*src="\/projects\/wealthlens\.webp"[^>]*width="1265"[^>]*height="712"/,
  );
  assert.match(
    html,
    new RegExp(
      `<img[^>]*src="/projects/bayguard\\.webp"[^>]*width="${bayGuardDimensions.width}"[^>]*height="${bayGuardDimensions.height}"`,
    ),
  );
  assert.doesNotMatch(html, /\/_(?:vinext|next)\/image\b/i);
  assert.doesNotMatch(pageSource, /from\s+["']next\/image["']/);
});

test("renders the approved Editorial Rail hierarchy", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(html, /<h1 id="hero-title">Software, data, and applied AI\.<\/h1>/);
  assert.match(html, /<h2 id="about-title"[^>]*>About me\.<\/h2>/);
  assert.doesNotMatch(html, /CS @ USF|Available 2026/);
  assert.doesNotMatch(html, /I’m Keshav, a third-year computer science student/);
  assert.doesNotMatch(html, /class="hero-copy"/);
  assert.match(html, /class="hero-primary"[^>]*href="mailto:keshavtyg@gmail\.com"/);
  assert.match(html, /<h2 id="work-title"[^>]*>A few things I’ve built\.<\/h2>/);
  assert.match(html, /<h2 id="experience-title"[^>]*>Experience<\/h2>/);
  assert.match(html, /<h2 id="toolkit-title"[^>]*>Toolkit<\/h2>/);
  assert.match(html, /<h2 id="contact-title"[^>]*>Let’s build something useful\.<\/h2>/);
  assert.match(html, /alt="WealthLens financial copilot landing page"/);
  assert.match(html, /alt="BayGuard Tampa risk dashboard"/);
  assert.match(html, /projects(?:%2F|\/)wealthlens\.webp/i);
  assert.match(html, /projects(?:%2F|\/)bayguard\.webp/i);
  assert.doesNotMatch(html, /<h2[^>]*class="sr-only"/);
});

test("removes disposable starter files and dependency", async () => {
  const packageJson = await readFile(new URL("../package.json", import.meta.url), "utf8");
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(new URL("../app/_sites-preview/", import.meta.url)));
});

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

test("publishes request-aware social metadata and a bespoke card", async () => {
  const response = await render();
  const html = await response.text();
  assert.match(html, /property="og:title" content="Keshav Tyagi \| Computer Science &amp; Software"/i);
  assert.match(html, /property="og:image" content="http:\/\/localhost\/og\.png"/i);
  assert.match(html, /name="twitter:card" content="summary_large_image"/i);
  await access(new URL("../public/og.png", import.meta.url));
});

test("provides an independent Vercel Next.js build target", async () => {
  const packageJson = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf8"),
  );
  const vercel = JSON.parse(
    await readFile(new URL("../vercel.json", import.meta.url), "utf8"),
  );

  assert.equal(packageJson.scripts.build, "WRANGLER_LOG_PATH=.wrangler/wrangler.log vinext build");
  assert.equal(packageJson.scripts["build:vercel"], "next build");
  assert.equal(vercel.$schema, "https://openapi.vercel.sh/vercel.json");
  assert.equal(vercel.framework, "nextjs");
  assert.equal(vercel.buildCommand, "npm run build:vercel");
  assert.equal("outputDirectory" in vercel, false);
});

test("documents deployment and exposes accessible link contracts", async () => {
  const response = await render();
  const html = await response.text();
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");

  for (const label of [
    "GitHub profile",
    "LinkedIn profile",
    "WealthLens live site",
    "WealthLens GitHub repository",
    "BayGuard Tampa live site",
  ]) {
    assert.match(html, new RegExp(`aria-label="${label}"`, "i"));
  }

  assert.match(
    html,
    /<div[^>]*class="hero-actions"[^>]*role="group"[^>]*aria-label="Profile links"/,
  );
  assert.match(css, /\.job-meta\s*\{[^}]*color:\s*var\(--muted\)/s);
  assert.match(css, /\.site-footer\s*\{[^}]*color:\s*var\(--muted\)/s);
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

  for (const contract of [
    /npm run dev/,
    /npm test/,
    /npm run build\b/,
    /Vinext/i,
    /Sites/i,
    /npm run build:vercel/,
    /Vercel/,
    /Root Directory[^\n]*site/i,
    /Project structure/i,
  ]) {
    assert.match(readme, contract);
  }
  assert.doesNotMatch(readme, /starter|loading skeleton/i);
});

test("implements the approved Editorial Rail visual system", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  for (const token of ["#020817", "#edf6ff", "#b8c9d8", "#7891a7", "#56d2ff"]) {
    assert.match(css.toLowerCase(), new RegExp(token));
  }

  assert.match(css, /--font-sans:\s*"Avenir Next",\s*Avenir,\s*Inter/);
  assert.match(css, /\.shell\s*\{[^}]*width:\s*min\(1040px,\s*calc\(100%\s*-\s*72px\)\)/s);
  assert.match(css, /\.hero,\s*\.editorial-section\s*\{[^}]*grid-template-columns:\s*180px\s+1fr/s);
  assert.match(css, /\.hero-main\s*\{[^}]*grid-column:\s*2/s);
  assert.match(css, /\.hero-main\s*\{[^}]*min-width:\s*0/s);
  assert.match(
    css,
    /@media\s*\(max-width:\s*760px\)\s*\{[\s\S]*?\.hero-main\s*\{[^}]*grid-column:\s*1/s,
  );
  assert.match(css, /\.section-content\s*>\s*h2\s*\{[^}]*font-size:\s*42px/s);
  assert.match(css, /\.about-copy\s*\{[^}]*max-width:\s*65ch[^}]*font-size:\s*17px/s);
  assert.match(css, /(?:^|\n)a:hover\s*\{\s*color:\s*var\(--foreground\);\s*\}/);
  assert.doesNotMatch(css, /(?:^|\n)a:hover\s*\{[^}]*color:\s*var\(--accent\)/s);
  assert.match(css, /\.work-note\s*\{[^}]*max-width:\s*60ch/s);
  assert.match(css, /\.project\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1\.05fr\)\s+minmax\(0,\s*\.95fr\)/s);
  assert.match(css, /\.project-copy\s*\{[^}]*max-width:\s*60ch/s);
  assert.match(css, /\.hero-primary\s*\{[^}]*min-height:\s*44px[^}]*background:\s*var\(--accent\)/s);
  assert.match(css, /@media\s*\(max-width:\s*760px\)/);
  assert.doesNotMatch(
    css,
    /\.nav-links\s+a:nth-child\(2\)\s*\{[^}]*display:\s*none/s,
  );
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /overflow-x:\s*hidden/);
  assert.doesNotMatch(css, /cursor:\s*none|canvas|scanline|perspective|parallax/i);
});
