"use client";

import type { ComponentProps, ReactNode } from "react";

import { Link } from "@/i18n/navigation";
import {
  trackImageToUiContactClick,
  trackImageToUiProfileClick,
  trackImageToUiRelatedToolClick,
} from "@/lib/image-to-ui/image-to-ui-analytics-events";
import { cn } from "@/lib/utils";

type LinkHref = ComponentProps<typeof Link>["href"];

type RelatedToolLinkProps = {
  kind: "related_tool";
  href: LinkHref;
  analyticsTarget: string;
  className?: string;
  children: ReactNode;
};

type ProfileLinkProps = {
  kind: "profile";
  href: LinkHref;
  className?: string;
  children: ReactNode;
};

type ContactLinkProps = {
  kind: "contact";
  href: LinkHref;
  channel: string;
  className?: string;
  children: ReactNode;
};

type ImageToUiLandingLinksProps =
  | RelatedToolLinkProps
  | ProfileLinkProps
  | ContactLinkProps;

export function ImageToUiLandingLinks(props: ImageToUiLandingLinksProps) {
  const { className, children } = props;

  const onClick = () => {
    if (props.kind === "related_tool") {
      trackImageToUiRelatedToolClick(props.analyticsTarget);
      return;
    }
    if (props.kind === "profile") {
      trackImageToUiProfileClick();
      return;
    }
    trackImageToUiContactClick(props.channel);
  };

  return (
    <Link href={props.href} className={cn(className)} onClick={onClick}>
      {children}
    </Link>
  );
}
