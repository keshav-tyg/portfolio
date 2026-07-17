import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

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
  assert.match(html, /CS student · systems \+ AI/);
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

test("removes disposable starter files and dependency", async () => {
  const packageJson = await readFile(new URL("../package.json", import.meta.url), "utf8");
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(new URL("../app/_sites-preview/", import.meta.url)));
});

test("keeps the approved palette, responsive rules, and motion safeguards", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  for (const token of ["#020713", "#0a1c2d", "#d6e8f5", "#718ca1", "#49b9df", "#102a40"]) {
    assert.match(css.toLowerCase(), new RegExp(token));
  }
  assert.match(css, /@media\s*\(max-width:\s*620px\)/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /overflow-x:\s*hidden/);
  assert.doesNotMatch(css, /cursor:\s*none|canvas|scanline|perspective|parallax/i);
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
