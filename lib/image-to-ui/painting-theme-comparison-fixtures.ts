export type PaintingThemeComparisonMode = "light" | "dark";

export type PaintingThemeComparisonFixtureTag =
  | "new-colors-harmonious"
  | "primary-not-first"
  | "light-palette"
  | "dark-palette"
  | "low-contrast"
  | "warm-cool-mixed";

export type PaintingThemeComparisonFixture = {
  id: string;
  label: string;
  selectedColors: [string, string, string];
  mode: PaintingThemeComparisonMode;
  tags: PaintingThemeComparisonFixtureTag[];
  /** When true, `primary` must not match the first selected swatch (order is not semantics). */
  primaryMustNotBeFirstSelected: boolean;
};

/**
 * Representative painting-derived palettes from planning (`New Colors.md` / rubric references)
 * and edge cases used to compare theme output across refactors.
 */
export const PAINTING_THEME_COMPARISON_FIXTURES: PaintingThemeComparisonFixture[] = [
  {
    id: "new-colors-cream-blue-neutral",
    label: "New Colors: cream surface, deep blue action, warm neutral support",
    selectedColors: ["#faf8f0", "#09568c", "#9e9982"],
    mode: "light",
    tags: ["new-colors-harmonious", "light-palette"],
    primaryMustNotBeFirstSelected: true,
  },
  {
    id: "new-colors-gray-blue-mist",
    label: "New Colors: cool gray support, blue action, airy surface",
    selectedColors: ["#a1a8ae", "#09568c", "#eaebef"],
    mode: "light",
    tags: ["new-colors-harmonious", "light-palette"],
    primaryMustNotBeFirstSelected: true,
  },
  {
    id: "new-colors-teal-cream-sage",
    label: "New Colors: teal action with sage and cream surfaces",
    selectedColors: ["#3472a1", "#cddadb", "#faf8f0"],
    mode: "light",
    tags: ["new-colors-harmonious", "light-palette"],
    primaryMustNotBeFirstSelected: false,
  },
  {
    id: "primary-not-first-muted-lead",
    label: "Muted gray listed first; vivid magenta should stay primary",
    selectedColors: ["#445566", "#FF0088", "#112233"],
    mode: "light",
    tags: ["primary-not-first", "light-palette"],
    primaryMustNotBeFirstSelected: true,
  },
  {
    id: "primary-not-first-neutral-lead",
    label: "Warm neutral listed first; deep blue should stay primary",
    selectedColors: ["#9e9982", "#faf8f0", "#09568c"],
    mode: "light",
    tags: ["primary-not-first", "light-palette"],
    primaryMustNotBeFirstSelected: true,
  },
  {
    id: "dark-cream-blue-neutral",
    label: "Dark mode sibling of cream / blue / neutral painting palette",
    selectedColors: ["#faf8f0", "#09568c", "#9e9982"],
    mode: "dark",
    tags: ["dark-palette", "new-colors-harmonious"],
    primaryMustNotBeFirstSelected: true,
  },
  {
    id: "low-contrast-warm-surfaces",
    label: "Low-contrast warm surfaces with a single stronger blue accent",
    selectedColors: ["#d8d4cc", "#cfc9bf", "#2a5f8f"],
    mode: "light",
    tags: ["low-contrast", "light-palette"],
    primaryMustNotBeFirstSelected: true,
  },
  {
    id: "warm-cool-mixed-light",
    label: "Warm cream, cool teal, and burnt orange in one painting pick",
    selectedColors: ["#faf8f0", "#4a90a4", "#c45c26"],
    mode: "light",
    tags: ["warm-cool-mixed", "light-palette"],
    primaryMustNotBeFirstSelected: true,
  },
  {
    id: "warm-cool-mixed-dark",
    label: "Warm/cool mixed palette in dark mode",
    selectedColors: ["#faf8f0", "#4a90a4", "#c45c26"],
    mode: "dark",
    tags: ["warm-cool-mixed", "dark-palette"],
    primaryMustNotBeFirstSelected: true,
  },
];

export function paintingThemeComparisonFixturesByTag(
  tag: PaintingThemeComparisonFixtureTag,
): PaintingThemeComparisonFixture[] {
  return PAINTING_THEME_COMPARISON_FIXTURES.filter((fixture) => fixture.tags.includes(tag));
}
