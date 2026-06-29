import { HomepageScrollProvider } from "@/components/homepage/homepage-scroll-provider";

export default function HomepageLayout({ children }: { children: React.ReactNode }) {
  return <HomepageScrollProvider>{children}</HomepageScrollProvider>;
}
