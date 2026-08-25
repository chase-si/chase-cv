import { buildSitemapEntries } from "./sitemap-entries";
import { siteUrl } from "./urls";

export const INDEXNOW_KEY = "8f3c1a7e2b9d4f60a1c8e5d7b3f90214";
export const INDEXNOW_KEY_PATH = "/.well-known/indexnow.txt";
export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

export type IndexNowPayload = {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
};

export function buildIndexNowPayload(): IndexNowPayload {
  return {
    host: siteUrl.hostname,
    key: INDEXNOW_KEY,
    keyLocation: new URL(INDEXNOW_KEY_PATH, siteUrl).toString(),
    urlList: buildSitemapEntries().map((entry) => entry.url),
  };
}

export function createIndexNowKeyResponse() {
  return new Response(INDEXNOW_KEY, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}

export async function submitIndexNow(
  fetchImpl: typeof fetch = fetch,
): Promise<Response> {
  const payload = buildIndexNowPayload();

  return fetchImpl(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });
}
