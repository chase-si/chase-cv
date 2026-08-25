#!/usr/bin/env node

const siteUrl = process.env.SITE_URL?.trim() || "https://dashuaibi.vip";
const endpoint = "https://api.indexnow.org/indexnow";
const indexNowKey = "8f3c1a7e2b9d4f60a1c8e5d7b3f90214";
const keyPath = `/${indexNowKey}.txt`;

function parseSitemapLocs(xml) {
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((match) => match[1]);
}

function urlsOnHost(urls, host) {
  return urls.filter((url) => {
    try {
      return new URL(url).hostname === host;
    } catch {
      return false;
    }
  });
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
  const host = new URL(origin).hostname;
  const [sitemapXml, key] = await Promise.all([
    fetchText(new URL("/sitemap.xml", origin).toString()),
    fetchText(new URL(keyPath, origin).toString()),
  ]);
  const urlList = urlsOnHost(parseSitemapLocs(sitemapXml), host);
  if (urlList.length === 0) {
    throw new Error("sitemap.xml did not contain any <loc> URLs for this host");
  }

  const payload = {
    host,
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
