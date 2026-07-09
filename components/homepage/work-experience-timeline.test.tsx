import { cleanup, render, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, it } from "vitest";

import { HomepageWorkExperienceTimeline } from "@/components/homepage/work-experience-timeline";
import {
  fabricatedResumePatterns,
  homepageWorkExperienceEntryIds,
  homepageWorkExperienceProjectIds,
  patchHomeMessagesWithWorkExperience,
  WORK_EXPERIENCE_PLACEHOLDER_MARKER,
  workExperienceFieldKeys,
} from "@/lib/homepage-work-experience";
import enMessages from "@/messages/en.json";
import zhMessages from "@/messages/zh.json";

function renderTimeline(locale: "en" | "zh") {
  const base = locale === "zh" ? zhMessages : enMessages;
  const messages = patchHomeMessagesWithWorkExperience(base, locale);
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <HomepageWorkExperienceTimeline />
    </NextIntlClientProvider>,
  );
}

function collectSectionText(section: HTMLElement) {
  return section.textContent ?? "";
}

afterEach(() => {
  cleanup();
});

describe("HomepageWorkExperienceTimeline", () => {
  it("renders experience entries with image project cards and resume fields", () => {
    renderTimeline("en");

    const section = screen.getByRole("region", { name: "Work experience timeline" });
    const timeline = within(section).getByTestId("work-experience-timeline");

    expect(timeline).toBeInTheDocument();

    for (const entryId of homepageWorkExperienceEntryIds) {
      const item = within(section).getByTestId(`work-experience-entry-${entryId}`);

      for (const field of workExperienceFieldKeys) {
        if (field === "outcomes") {
          continue;
        }

        const fieldNode = within(item).getByTestId(`work-experience-field-${field}`);
        expect(fieldNode).toBeInTheDocument();
        expect(fieldNode.textContent).not.toContain(WORK_EXPERIENCE_PLACEHOLDER_MARKER);
      }

      for (const projectId of homepageWorkExperienceProjectIds[entryId]) {
        const card = within(section).getByTestId(`work-experience-project-${projectId}`);
        const blurb = within(card).getByTestId(`work-experience-project-${projectId}-blurb`);
        expect(blurb.textContent).not.toContain(WORK_EXPERIENCE_PLACEHOLDER_MARKER);
        expect(
          within(card).getByTestId(`work-experience-project-${projectId}-image`),
        ).toBeInTheDocument();
      }
    }
  });

  it("localizes field labels and supporting copy in Chinese", () => {
    renderTimeline("zh");

    const section = screen.getByRole("region", { name: "工作经历时间线" });
    const terms = within(section).getAllByRole("term");
    const labels = [...new Set(terms.map((node) => node.textContent))];

    expect(labels).toEqual(
      expect.arrayContaining(["时间段", "角色", "范围"]),
    );
    expect(
      within(section).getByText("约 8 年 Web、桌面与移动端产品交付；按雇主归纳，项目卡以截图佐证。"),
    ).toBeInTheDocument();
  });

  it("does not include fabricated employers, date ranges, or metric-style achievements", () => {
    renderTimeline("en");

    const section = screen.getByRole("region", { name: "Work experience timeline" });
    const text = collectSectionText(section);

    for (const pattern of fabricatedResumePatterns) {
      expect(text).not.toMatch(pattern);
    }
  });
});
