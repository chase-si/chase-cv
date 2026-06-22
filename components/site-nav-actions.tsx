"use client";

import * as React from "react";
import {
  ChevronDown,
  GitFork,
  ImageIcon,
  Menu,
  MousePointer2,
  Workflow,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { trackEvent } from "@/lib/analytics";
import { Button, buttonVariants } from "@/components/ui/button";
import { projectNavigationItems, type ProjectId } from "@/lib/projects";
import { cn } from "@/lib/utils";

const BLOG_URL = "https://blog.dashuaibi.vip/blog";
const GITHUB_URL = "https://github.com/chase-si";
const projectIcons = {
  magicCursor: MousePointer2,
  imageToUi: ImageIcon,
  flowEditor: Workflow,
} satisfies Record<ProjectId, React.ComponentType<React.SVGProps<SVGSVGElement>>>;

type ProjectMenuItemsProps = {
  onNavigate: () => void;
};

function ProjectMenuItems({ onNavigate }: ProjectMenuItemsProps) {
  const t = useTranslations("siteNav");

  return (
    <>
      {projectNavigationItems.map((item) => {
        const Icon = projectIcons[item.id];

        return (
          <Link
            key={item.id}
            role="menuitem"
            href={item.href}
            className={cn(
              "flex min-w-0 items-start gap-3 rounded-xl px-3 py-2.5 outline-none transition-colors",
              "hover:bg-muted focus-visible:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30",
            )}
            onClick={() => {
              trackEvent("nav_click", {
                target: item.analyticsTarget,
                href: item.href,
              });
              onNavigate();
            }}
          >
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground">
              <Icon className="size-4" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block font-medium text-foreground">
                {t(`projects.items.${item.id}.name`)}
              </span>
              <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                {t(`projects.items.${item.id}.description`)}
              </span>
            </span>
          </Link>
        );
      })}
    </>
  );
}

export function SiteNavActions() {
  const t = useTranslations("siteNav");
  const [projectsOpen, setProjectsOpen] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const projectsMenuId = React.useId();
  const mobileMenuId = React.useId();

  const closeProjects = () => setProjectsOpen(false);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <nav
        aria-label={t("primaryAria")}
        className="relative hidden items-center gap-2 text-sm sm:flex"
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            closeProjects();
          }
        }}
      >
        <div className="relative">
          <Button
            type="button"
            size="sm"
            aria-expanded={projectsOpen}
            aria-controls={projectsOpen ? projectsMenuId : undefined}
            aria-haspopup="menu"
            className="shadow-sm"
            onClick={() => setProjectsOpen((open) => !open)}
          >
            {t("projects.label")}
            <ChevronDown data-icon="inline-end" />
          </Button>
          {projectsOpen ? (
            <div
              id={projectsMenuId}
              role="menu"
              aria-label={t("projects.label")}
              className="absolute right-0 top-full mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-border bg-card p-2 shadow-lg"
            >
              <div className="flex flex-col gap-1">
                <ProjectMenuItems onNavigate={closeProjects} />
              </div>
            </div>
          ) : null}
        </div>
        <Link
          href={BLOG_URL}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants({
            variant: "ghost",
            size: "sm",
            className: "shadow-sm",
          })}
          onClick={() => {
            trackEvent("nav_click", { target: "blog", href: BLOG_URL });
            trackEvent("outbound_click", { url: BLOG_URL, target: "blog" });
          }}
        >
          {t("blog")}
        </Link>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
          className={buttonVariants({
            variant: "outline",
            size: "icon",
            className: "rounded-full shadow-sm hover:shadow-md",
          })}
          onClick={() => {
            trackEvent("nav_click", { target: "github", href: GITHUB_URL });
            trackEvent("outbound_click", { url: GITHUB_URL, target: "github" });
          }}
        >
          <GitFork />
        </a>
      </nav>
      <nav
        aria-label={t("mobileAria")}
        className="relative flex items-center text-sm sm:hidden"
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            closeMobileMenu();
          }
        }}
      >
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-expanded={mobileMenuOpen}
          aria-controls={mobileMenuOpen ? mobileMenuId : undefined}
          aria-haspopup="menu"
          className="rounded-full shadow-sm"
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <Menu data-icon="inline-start" />
          {t("menu")}
        </Button>
        {mobileMenuOpen ? (
          <div
            id={mobileMenuId}
            role="menu"
            aria-label={t("menu")}
            className="fixed left-4 right-4 top-16 rounded-2xl border border-border bg-card p-2 shadow-lg"
          >
            <div className="flex flex-col gap-1">
              <ProjectMenuItems onNavigate={closeMobileMenu} />
              <Link
                role="menuitem"
                href={BLOG_URL}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl px-3 py-2 font-medium text-foreground outline-none transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30"
                onClick={() => {
                  trackEvent("nav_click", { target: "blog", href: BLOG_URL });
                  trackEvent("outbound_click", { url: BLOG_URL, target: "blog" });
                  closeMobileMenu();
                }}
              >
                {t("blog")}
              </Link>
              <a
                role="menuitem"
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl px-3 py-2 font-medium text-foreground outline-none transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30"
                onClick={() => {
                  trackEvent("nav_click", { target: "github", href: GITHUB_URL });
                  trackEvent("outbound_click", { url: GITHUB_URL, target: "github" });
                  closeMobileMenu();
                }}
              >
                {t("github")}
              </a>
            </div>
          </div>
        ) : null}
      </nav>
    </>
  );
}
