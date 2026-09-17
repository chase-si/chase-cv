import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { FloorPlanShell } from "@/components/floor-plan/floor-plan-shell";
import type { AppLocale } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: AppLocale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return {
    title:
      locale === "zh"
        ? "标准户型空间验证器 | Chase's CV"
        : "Floor Plan Space Validator | Chase's CV",
    description:
      locale === "zh"
        ? "标准户型库浏览与响应式 SVG 空间验证"
        : "Browse standard floor plans in a responsive SVG viewer and verify spatial dimensions",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function FloorPlanPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <FloorPlanShell />;
}
