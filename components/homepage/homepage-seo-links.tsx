"use client";

import type { ComponentProps, ReactNode } from "react";

import { Link } from "@/i18n/navigation";
import {
  trackHomepageContactClick,
  trackHomepageToolClick,
} from "@/lib/homepage/homepage-seo-analytics-events";
import { cn } from "@/lib/utils";

type ToolLinkProps = {
  kind: "tool";
  href: ComponentProps<typeof Link>["href"];
  analyticsTarget: string;
  className?: string;
  children: ReactNode;
};

type ContactLinkProps = {
  kind: "contact";
  href: ComponentProps<typeof Link>["href"];
  channel: string;
  className?: string;
  children: ReactNode;
};

type HomepageSeoLinksProps = ToolLinkProps | ContactLinkProps;

export function HomepageSeoLinks(props: HomepageSeoLinksProps) {
  const { className, children } = props;

  const onClick = () => {
    if (props.kind === "tool") {
      trackHomepageToolClick(props.analyticsTarget);
      return;
    }
    trackHomepageContactClick(props.channel);
  };

  return (
    <Link href={props.href} className={cn(className)} onClick={onClick}>
      {children}
    </Link>
  );
}
