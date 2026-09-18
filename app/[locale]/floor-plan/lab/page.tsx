import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { RecognitionLabShell } from "@/components/floor-plan/recognition-lab/recognition-lab-shell";
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
        ? "CubiCasa 识图实验室 | Chase's CV"
        : "CubiCasa Recognition Lab | Chase's CV",
    description:
      locale === "zh"
        ? "CubiCasa 户型图片识别、两点尺度标定与拓扑规整实验室"
        : "CubiCasa floor plan recognition, two-point scale calibration, and topology normalization lab",
    robots: FLOOR_PLAN_ROBOTS_METADATA,
  };
}

export default async function FloorPlanLabPage({ params }: Props) {
  if (!isFloorPlanInternalEnabled()) {
    notFound();
  }

  const { locale } = await params;
  setRequestLocale(locale);

  return <RecognitionLabShell />;
}
