#!/usr/bin/env node

const siteUrl = process.env.SITE_URL?.trim() || "https://dashuaibi.vip";
const endpoint = "https://api.indexnow.org/indexnow";
const keyPath = "/.well-known/indexnow.txt";

function parseSitemapLocs(xml) {
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((match) => match[1]);
}

async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`GET ${url} failed with ${response.status}`);
  }
  return response.text();
}

async function main() {
  const origin = new URL(siteUrl).origin;
  const [sitemapXml, key] = await Promise.all([
    fetchText(new URL("/sitemap.xml", origin).toString()),
    fetchText(new URL(keyPath, origin).toString()),
  ]);
  const urlList = parseSitemapLocs(sitemapXml);
  if (urlList.length === 0) {
    throw new Error("sitemap.xml did not contain any <loc> URLs");
  }

  const payload = {
    host: new URL(origin).hostname,
    key: key.trim(),
    keyLocation: new URL(keyPath, origin).toString(),
    urlList,
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  if (response.status !== 200 && response.status !== 202) {
    const body = await response.text();
    throw new Error(`IndexNow ${response.status}: ${body}`);
  }

  console.log(`IndexNow accepted ${urlList.length} URLs (${response.status})`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
