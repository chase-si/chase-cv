"use client";

import Link from "next/link";
import { GitFork } from "lucide-react";

import { trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/button";

const BLOG_URL = "https://blog.dashuaibi.vip/blog";
const GITHUB_URL = "https://github.com/chase-si";

export function SiteNavActions() {
  return (
    <nav className="hidden items-center gap-2 text-sm sm:flex">
      <Button
        size="sm"
        nativeButton={false}
        className="shadow-sm border-none"
        render={
          <Link
            href="/magic-cursor"
            onClick={() =>
              trackEvent("nav_click", { target: "works", href: "/magic-cursor" })
            }
          />
        }
      >
        作品
      </Button>
      <Button
        variant="ghost"
        size="sm"
        nativeButton={false}
        className="shadow-sm"
        render={
          <Link
            href={BLOG_URL}
            target="_blank"
            rel="noreferrer"
            onClick={() => {
              trackEvent("nav_click", { target: "blog", href: BLOG_URL });
              trackEvent("outbound_click", { url: BLOG_URL, target: "blog" });
            }}
          />
        }
      >
        博客
      </Button>
      <Button
        variant="outline"
        size="icon"
        nativeButton={false}
        aria-label="GitHub"
        className="shadow-sm hover:shadow-md"
        render={
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            onClick={() => {
              trackEvent("nav_click", { target: "github", href: GITHUB_URL });
              trackEvent("outbound_click", { url: GITHUB_URL, target: "github" });
            }}
          />
        }
      >
        <GitFork className="h-4 w-4" />
      </Button>
    </nav>
  );
}
