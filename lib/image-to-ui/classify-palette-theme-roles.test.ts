import { describe, expect, it } from "vitest";

import {
  assignedRoleRationaleForHex,
  classifyPaletteThemeRoles,
  type ClassifiedPaletteThemeRoles,
} from "@/lib/image-to-ui/classify-palette-theme-roles";

function expectClassification(
  selectedColors: string[],
  expected: ClassifiedPaletteThemeRoles,
) {
  expect(classifyPaletteThemeRoles(selectedColors)).toEqual(expected);
}

const CURSOR_GOLDEN_PALETTES: Array<{
  selectedColors: [string, string, string];
  expected: ClassifiedPaletteThemeRoles;
}> = [
  {
    selectedColors: ["#a1a8ae", "#09568c", "#eaebef"],
    expected: {
      surfaceSeed: "#EAEBEF",
      actionSeed: "#09568C",
      supportSeed: "#A1A8AE",
    },
  },
  {
    selectedColors: ["#c9c2bd", "#eaebef", "#3472a1"],
    expected: {
      surfaceSeed: "#EAEBEF",
      actionSeed: "#3472A1",
      supportSeed: "#C9C2BD",
    },
  },
  {
    selectedColors: ["#3472a1", "#cddadb", "#faf8f0"],
    expected: {
      surfaceSeed: "#FAF8F0",
      actionSeed: "#3472A1",
      supportSeed: "#CDDADB",
    },
  },
  {
    selectedColors: ["#cddadb", "#9e9982", "#3472a1"],
    expected: {
      surfaceSeed: "#CDDADB",
      actionSeed: "#3472A1",
      supportSeed: "#9E9982",
    },
  },
  {
    selectedColors: ["#09568c", "#c9c2bd", "#8d9ca0"],
    expected: {
      surfaceSeed: "#C9C2BD",
      actionSeed: "#09568C",
      supportSeed: "#8D9CA0",
    },
  },
  {
    selectedColors: ["#faf8f0", "#09568c", "#9e9982"],
    expected: {
      surfaceSeed: "#FAF8F0",
      actionSeed: "#09568C",
      supportSeed: "#9E9982",
    },
  },
];

describe("classifyPaletteThemeRoles", () => {
  it.each(CURSOR_GOLDEN_PALETTES)(
    "keeps Cursor golden palette %# aligned with its hand-mapped roles",
    ({ selectedColors, expected }) => {
      expectClassification(selectedColors, expected);
    },
  );

  it("classifies rubric reference palette regardless of selection order", () => {
    const expected: ClassifiedPaletteThemeRoles = {
      surfaceSeed: "#FAF8F0",
      actionSeed: "#09568C",
      supportSeed: "#9E9982",
    };

    expectClassification(["#faf8f0", "#09568c", "#9e9982"], expected);
    expectClassification(["#09568c", "#9e9982", "#faf8f0"], expected);
    expectClassification(["#9e9982", "#faf8f0", "#09568c"], expected);
  });

  it("classifies a second rubric reference set by color properties", () => {
    expectClassification(["#a1a8ae", "#09568c", "#eaebef"], {
      surfaceSeed: "#EAEBEF",
      actionSeed: "#09568C",
      supportSeed: "#A1A8AE",
    });
  });

  it("classifies the third rubric reference set regardless of selection order", () => {
    for (const selected of [
      ["#3472a1", "#cddadb", "#faf8f0"],
      ["#faf8f0", "#3472a1", "#cddadb"],
    ]) {
      const result = classifyPaletteThemeRoles(selected);
      expect(result.actionSeed).toBe("#3472A1");
      expect([result.surfaceSeed, result.supportSeed].sort()).toEqual(
        ["#CDDADB", "#FAF8F0"].sort(),
      );
    }
  });

  it("scores complete role candidates instead of keeping the greedy action choice", () => {
    expectClassification(["#F0E6D0", "#4A90A4", "#C45C26"], {
      surfaceSeed: "#F0E6D0",
      actionSeed: "#4A90A4",
      supportSeed: "#C45C26",
    });
  });

  it("keeps a hot warm accent secondary when a calmer cool action is available", () => {
    expectClassification(["#F7EEE2", "#BF3E1F", "#246C8F"], {
      surfaceSeed: "#F7EEE2",
      actionSeed: "#246C8F",
      supportSeed: "#BF3E1F",
    });
  });

  it("prefers a calm light surface over a saturated bright warm swatch", () => {
    expectClassification(["#F5EDE2", "#F7B733", "#1D5A7A"], {
      surfaceSeed: "#F5EDE2",
      actionSeed: "#1D5A7A",
      supportSeed: "#F7B733",
    });
  });

  it("allows a deep wine color to become the action color on a calm surface", () => {
    expectClassification(["#F6EFE8", "#7A1F3D", "#B9ADA3"], {
      surfaceSeed: "#F6EFE8",
      actionSeed: "#7A1F3D",
      supportSeed: "#B9ADA3",
    });
  });

  it("allows a dark brick color to become the action color on a neutral surface", () => {
    expectClassification(["#F3ECE2", "#8A3A22", "#9AA5A0"], {
      surfaceSeed: "#F3ECE2",
      actionSeed: "#8A3A22",
      supportSeed: "#9AA5A0",
    });
  });

  it("allows a deep amber color to become the action color when it stays readable", () => {
    expectClassification(["#F4E9D8", "#8A5A12", "#AAB0A3"], {
      surfaceSeed: "#F4E9D8",
      actionSeed: "#8A5A12",
      supportSeed: "#AAB0A3",
    });
  });

  it("throws when fewer than three colors are provided", () => {
    expect(() => classifyPaletteThemeRoles(["#111111", "#222222"])).toThrow(
      /three selected colors/i,
    );
  });

  it("throws on invalid hex input", () => {
    expect(() =>
      classifyPaletteThemeRoles(["#111111", "#222222", "not-a-color"]),
    ).toThrow(/unsupported color/i);
  });
});

describe("assignedRoleRationaleForHex", () => {
  it("explains rubric roles with surface, contrast, and mid-tone language", () => {
    const selectedColors = ["#faf8f0", "#09568c", "#9e9982"];
    const classification = classifyPaletteThemeRoles(selectedColors);

    expect(assignedRoleRationaleForHex(classification.surfaceSeed, selectedColors)).toMatch(
      /表面|背景|亮|饱和/,
    );
    expect(assignedRoleRationaleForHex(classification.actionSeed, selectedColors)).toMatch(
      /对比|动作|操作/,
    );
    expect(assignedRoleRationaleForHex(classification.supportSeed, selectedColors)).toMatch(
      /中调|辅助|弱强调|边框/,
    );
  });
});
