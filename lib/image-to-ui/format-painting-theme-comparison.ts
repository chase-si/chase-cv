import { classifyPaletteThemeRoles } from "@/lib/image-to-ui/classify-palette-theme-roles";
import {
  derivePreviewThemeTokens,
  type PreviewThemeTokens,
} from "@/lib/image-to-ui/derive-preview-theme";
import type { PaintingThemeComparisonFixture } from "@/lib/image-to-ui/painting-theme-comparison-fixtures";
import { parseHexToRgb } from "@/lib/image-to-ui/palette-color-math";

const COMPARISON_TOKEN_KEYS = [
  "background",
  "foreground",
  "card",
  "muted",
  "border",
  "input",
  "primary",
  "secondary",
  "accent",
  "ring",
] as const satisfies ReadonlyArray<keyof PreviewThemeTokens>;

export type PaintingThemeComparisonSnapshot = {
  fixtureId: string;
  mode: PaintingThemeComparisonFixture["mode"];
  selectedColors: [string, string, string];
  classifiedRoles: ReturnType<typeof classifyPaletteThemeRoles>;
  tokens: Pick<PreviewThemeTokens, (typeof COMPARISON_TOKEN_KEYS)[number]>;
};

export function buildPaintingThemeComparisonSnapshot(
  fixture: PaintingThemeComparisonFixture,
): PaintingThemeComparisonSnapshot {
  const classifiedRoles = classifyPaletteThemeRoles(fixture.selectedColors);
  const fullTokens = derivePreviewThemeTokens({
    selectedColors: fixture.selectedColors,
    mode: fixture.mode,
  });

  const tokens = COMPARISON_TOKEN_KEYS.reduce(
    (picked, key) => {
      picked[key] = fullTokens[key];
      return picked;
    },
    {} as PaintingThemeComparisonSnapshot["tokens"],
  );

  return {
    fixtureId: fixture.id,
    mode: fixture.mode,
    selectedColors: fixture.selectedColors,
    classifiedRoles,
    tokens,
  };
}

/** Stable, human-readable lines for diffing theme regressions in tests or logs. */
export function formatPaintingThemeComparisonLines(
  snapshot: PaintingThemeComparisonSnapshot,
): string[] {
  const { classifiedRoles, tokens } = snapshot;
  return [
    `fixture=${snapshot.fixtureId} mode=${snapshot.mode}`,
    `selected=${snapshot.selectedColors.join(", ")}`,
    `roles surface=${classifiedRoles.surfaceSeed} action=${classifiedRoles.actionSeed} support=${classifiedRoles.supportSeed}`,
    ...COMPARISON_TOKEN_KEYS.map((key) => `${key}=${tokens[key]}`),
  ];
}

export function primaryMatchesFirstSelectedSwatch(
  fixture: PaintingThemeComparisonFixture,
  tokens: Pick<PreviewThemeTokens, "primary">,
): boolean {
  const [first] = fixture.selectedColors;
  const firstRgb = parseHexToRgb(first);
  const firstCss = `rgb(${firstRgb.r}, ${firstRgb.g}, ${firstRgb.b})`;
  return tokens.primary === firstCss;
}
