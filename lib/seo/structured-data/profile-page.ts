import {
  HOMEPAGE_CONTACT_GITHUB_URL,
  HOMEPAGE_CONTACT_UPWORK_URL,
} from "@/lib/homepage-contact/constants";

export type HomeProfilePageJsonLdInput = {
  name: string;
  description: string;
  pageUrl: string;
  profileUrl: string;
};

export function buildHomeProfilePageJsonLd(input: HomeProfilePageJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: input.pageUrl,
    mainEntity: {
      "@type": "Person",
      name: input.name,
      description: input.description,
      url: input.profileUrl,
      sameAs: [HOMEPAGE_CONTACT_GITHUB_URL, HOMEPAGE_CONTACT_UPWORK_URL],
    },
  } as const;
}
