export type BreadcrumbListItem = {
  name: string;
  url?: string;
};

export function buildBreadcrumbListJsonLd(items: readonly BreadcrumbListItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  } as const;
}
