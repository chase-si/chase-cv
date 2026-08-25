import type { Metadata } from "next";

export function buildSearchEngineVerification(): Metadata["verification"] {
  const bing = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION?.trim();

  if (!bing) {
    return undefined;
  }

  return {
    other: {
      "msvalidate.01": bing,
    },
  };
}
