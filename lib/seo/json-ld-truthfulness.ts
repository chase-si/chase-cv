const FORBIDDEN_STRUCTURED_DATA_KEYS = [
  "aggregateRating",
  "review",
  "ratingValue",
  "ratingCount",
] as const;

export function findForbiddenStructuredDataKeys(
  value: unknown,
  path = "$",
): string[] {
  if (value === null || typeof value !== "object") {
    return [];
  }

  const hits: string[] = [];

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      hits.push(...findForbiddenStructuredDataKeys(item, `${path}[${index}]`));
    });
    return hits;
  }

  for (const [key, nested] of Object.entries(value)) {
    if (
      FORBIDDEN_STRUCTURED_DATA_KEYS.includes(
        key as (typeof FORBIDDEN_STRUCTURED_DATA_KEYS)[number],
      )
    ) {
      hits.push(`${path}.${key}`);
    }
    hits.push(...findForbiddenStructuredDataKeys(nested, `${path}.${key}`));
  }

  return hits;
}

export function parseStructuredDataScripts(markup: string): unknown[] {
  const scripts = [...markup.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  return scripts.map((match) => JSON.parse(match[1] ?? "{}"));
}
