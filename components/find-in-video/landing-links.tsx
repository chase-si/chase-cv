"use client";

import type { ComponentProps, ReactNode } from "react";

import { Link } from "@/i18n/navigation";
import {
  trackFindInVideoContactClick,
  trackFindInVideoProfileClick,
  trackFindInVideoRelatedToolClick,
} from "@/lib/find-in-video/find-in-video-analytics-events";
import { cn } from "@/lib/utils";

type LinkHref = ComponentProps<typeof Link>["href"];

type FindInVideoLandingLinksProps =
  | {
      kind: "related_tool";
      href: LinkHref;
      analyticsTarget: string;
      className?: string;
      children: ReactNode;
    }
  | {
      kind: "profile";
      href: LinkHref;
      className?: string;
      children: ReactNode;
    }
  | {
      kind: "contact";
      href: LinkHref;
      channel: string;
      className?: string;
      children: ReactNode;
    };

export function FindInVideoLandingLinks(props: FindInVideoLandingLinksProps) {
  const className = cn(props.className);

  if (props.kind === "related_tool") {
    return (
      <Link
        href={props.href}
        className={className}
        onClick={() => trackFindInVideoRelatedToolClick(props.analyticsTarget)}
      >
        {props.children}
      </Link>
    );
  }

  if (props.kind === "profile") {
    return (
      <Link href={props.href} className={className} onClick={() => trackFindInVideoProfileClick()}>
        {props.children}
      </Link>
    );
  }

  return (
    <Link
      href={props.href}
      className={className}
      onClick={() => trackFindInVideoContactClick(props.channel)}
    >
      {props.children}
    </Link>
  );
}
