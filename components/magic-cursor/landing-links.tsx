"use client";

import type { ComponentProps, ReactNode } from "react";

import { Link } from "@/i18n/navigation";
import {
  trackMagicCursorHubEffectLinkClick,
  trackMagicCursorRelatedEffectClick,
  trackMagicCursorRelatedToolClick,
} from "@/lib/magic-cursor/magic-cursor-analytics-events";
import { cn } from "@/lib/utils";

type LinkHref = ComponentProps<typeof Link>["href"];

type HubEffectLinkProps = {
  kind: "hub_effect";
  effect: string;
  href: LinkHref;
  className?: string;
  children: ReactNode;
};

type RelatedEffectLinkProps = {
  kind: "related_effect";
  effect: string;
  href: LinkHref;
  className?: string;
  children: ReactNode;
};

type RelatedToolLinkProps = {
  kind: "related_tool";
  analyticsTarget: string;
  href: LinkHref;
  className?: string;
  children: ReactNode;
};

type HubLinkProps = {
  kind: "hub";
  href: LinkHref;
  className?: string;
  children: ReactNode;
};

type MagicCursorLandingLinksProps =
  | HubEffectLinkProps
  | RelatedEffectLinkProps
  | RelatedToolLinkProps
  | HubLinkProps;

export function MagicCursorLandingLinks(props: MagicCursorLandingLinksProps) {
  const { className, children } = props;

  const onClick = () => {
    if (props.kind === "hub_effect") {
      trackMagicCursorHubEffectLinkClick(props.effect);
      return;
    }
    if (props.kind === "related_effect") {
      trackMagicCursorRelatedEffectClick(props.effect);
      return;
    }
    if (props.kind === "related_tool") {
      trackMagicCursorRelatedToolClick(props.analyticsTarget);
    }
  };

  return (
    <Link href={props.href} className={cn(className)} onClick={onClick}>
      {children}
    </Link>
  );
}
