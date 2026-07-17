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
