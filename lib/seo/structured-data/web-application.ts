export type WebApplicationJsonLdInput = {
  name: string;
  alternateName?: string[];
  description: string;
  url: string;
  applicationCategory: string;
  operatingSystem: string;
  inLanguage: string;
  type?: "WebApplication" | "SoftwareApplication";
  author?: { name: string; url: string };
};

export function buildWebApplicationJsonLd(input: WebApplicationJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": input.type ?? "WebApplication",
    name: input.name,
    ...(input.alternateName ? { alternateName: input.alternateName } : {}),
    description: input.description,
    url: input.url,
    applicationCategory: input.applicationCategory,
    operatingSystem: input.operatingSystem,
    inLanguage: input.inLanguage,
    ...(input.author
      ? { author: { "@type": "Person", name: input.author.name, url: input.author.url } }
      : {}),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    isAccessibleForFree: true,
    browserRequirements: "Requires JavaScript. Image processing runs in the browser.",
  } as const;
}
