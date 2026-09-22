import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { FloorPlanShell } from "@/components/floor-plan/floor-plan-shell";
import type { AppLocale } from "@/i18n/routing";
import {
  FLOOR_PLAN_ROBOTS_METADATA,
  isFloorPlanInternalEnabled,
} from "@/lib/floor-plan/internal-boundary";

type Props = {
  params: Promise<{ locale: AppLocale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return {
    title:
      locale === "zh"
        ? "户型实验室 | Chase's CV"
        : "Floor Plan Lab | Chase's CV",
    description:
      locale === "zh"
        ? "候选户型资产预览与空间验证实验室"
        : "Candidate floor plan asset preview and spatial validation lab",
    robots: FLOOR_PLAN_ROBOTS_METADATA,
  };
}

export default async function FloorPlanLabPage({ params }: Props) {
  if (!isFloorPlanInternalEnabled()) {
    notFound();
  }

  const { locale } = await params;
  setRequestLocale(locale);

  return <FloorPlanShell locale={locale} />;
}
