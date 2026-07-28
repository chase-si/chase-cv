"use client";

import type { ComponentType, SVGProps } from "react";
import { ArrowUpRight, GitFork, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback } from "react";

import { UpworkIcon } from "@/components/icons/upwork-icon";
import { HomepageMotion } from "@/components/homepage/homepage-motion";
import { Link } from "@/i18n/navigation";
import { trackEvent } from "@/lib/analytics";
import {
  HOMEPAGE_CONTACT_EMAIL,
  HOMEPAGE_CONTACT_GITHUB_URL,
  HOMEPAGE_CONTACT_UPWORK_URL,
} from "@/lib/homepage-contact/constants";
import { cn } from "@/lib/utils";

type ChannelIcon = ComponentType<SVGProps<SVGSVGElement>>;

type ContactChannel = {
  id: "email" | "upwork" | "github";
  label: string;
  headline: string;
  actionLabel: string;
  icon: ChannelIcon;
  href: string;
  external: boolean;
  headlineClassName?: string;
};

function ContactBillboardCard({
  channel,
  onOutbound,
}: {
  channel: ContactChannel;
  onOutbound: (target: string, url: string) => void;
}) {
  const Icon = channel.icon;
  const className = cn(
    "group/billboard relative flex h-full min-h-56 flex-col overflow-hidden rounded-4xl border-2 border-border",
    "bg-card shadow-[8px_8px_0_0] shadow-foreground/50 transition-transform",
    "hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
  );

  const body = (
    <>
      <Icon
        className="pointer-events-none absolute -right-4 -bottom-6 size-40 text-primary/15 transition-colors group-hover/billboard:text-primary/25"
        aria-hidden
      />
      <div className="relative flex h-full flex-col gap-4 p-6 sm:p-7">
        <span className="w-fit rounded-md border border-border px-2.5 py-1 font-mono text-[10px] font-bold tracking-[0.18em] uppercase">
          {channel.label}
        </span>
        <p
          className={cn(
            "min-w-0 flex-1 text-2xl font-black tracking-tight text-foreground sm:text-3xl",
            channel.headlineClassName,
          )}
        >
          {channel.headline}
        </p>
        <span className="mt-auto inline-flex items-center gap-2 border-t-2 border-border pt-4 text-sm font-bold text-primary">
          {channel.actionLabel}
          <ArrowUpRight className="size-4 transition-transform group-hover/billboard:translate-x-0.5 group-hover/billboard:-translate-y-0.5" />
        </span>
      </div>
    </>
  );

  if (channel.external) {
    return (
      <Link
        href={channel.href}
        target="_blank"
        rel="noreferrer"
        onClick={() => onOutbound(channel.id, channel.href)}
        className={className}
      >
        {body}
      </Link>
    );
  }

  return (
    <a
      href={channel.href}
      onClick={() => onOutbound(channel.id, channel.href)}
      className={className}
    >
      {body}
    </a>
  );
}

export function HomepageContact() {
  const t = useTranslations("home");
  const tNav = useTranslations("siteNav");

  const onOutbound = useCallback((target: string, url: string) => {
    trackEvent("outbound_click", { url, target });
  }, []);

  const channels: ContactChannel[] = [
    {
      id: "email",
      label: t("contact.channels.email.label"),
      headline: HOMEPAGE_CONTACT_EMAIL,
      actionLabel: t("contact.channels.email.action"),
      icon: Mail,
      href: `mailto:${HOMEPAGE_CONTACT_EMAIL}`,
      external: false,
      headlineClassName: "font-mono text-lg sm:text-xl",
    },
    {
      id: "upwork",
      label: t("contact.channels.upwork.label"),
      headline: t("contact.upwork"),
      actionLabel: t("contact.channels.upwork.action"),
      icon: UpworkIcon,
      href: HOMEPAGE_CONTACT_UPWORK_URL,
      external: true,
      headlineClassName: "lowercase",
    },
    {
      id: "github",
      label: t("contact.channels.github.label"),
      headline: tNav("github"),
      actionLabel: t("contact.channels.github.action"),
      icon: GitFork,
      href: HOMEPAGE_CONTACT_GITHUB_URL,
      external: true,
    },
  ];

  return (
    <section id="contact" aria-labelledby="contact-heading" className="scroll-mt-24 space-y-6">
      <HomepageMotion kind="reveal" className="flex items-center gap-4">
        <span className="size-5 shrink-0 bg-foreground" />
        <h2 id="contact-heading" className="text-3xl font-black tracking-tight">
          {t("contactTitle")}
        </h2>
        <span className="h-px flex-1 bg-border" />
      </HomepageMotion>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {channels.map((channel) => (
          <ContactBillboardCard
            key={channel.id}
            channel={channel}
            onOutbound={onOutbound}
          />
        ))}
      </div>
    </section>
  );
}
