export type WebApplicationJsonLdInput = {
  name: string;
  description: string;
  url: string;
  applicationCategory: string;
  operatingSystem: string;
  inLanguage: string;
};

export function buildWebApplicationJsonLd(input: WebApplicationJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: input.name,
    description: input.description,
    url: input.url,
    applicationCategory: input.applicationCategory,
    operatingSystem: input.operatingSystem,
    inLanguage: input.inLanguage,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    isAccessibleForFree: true,
    browserRequirements: "Requires JavaScript. Image processing runs in the browser.",
  } as const;
}
