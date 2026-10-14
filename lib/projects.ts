export type ProjectId =
  | "magicCursor"
  | "imageToUi"
  | "duduScanner"
  | "flowEditor"
  | "findInVideo"
  | "floorPlan";

export type ProjectNavigationItem = {
  id: ProjectId;
  href:
    | "/magic-cursor"
    | "/image-to-ui"
    | "/dudu-scanner"
    | "/flow"
    | "/find-in-video"
    | "/floor-plan";
  analyticsTarget:
    | "magic_cursor"
    | "image_to_ui"
    | "dudu_scanner"
    | "flow_editor"
    | "find_in_video"
    | "floor_plan";
};

export const projectNavigationItems: ProjectNavigationItem[] = [
  {
    id: "duduScanner",
    href: "/dudu-scanner",
    analyticsTarget: "dudu_scanner",
  },
  {
    id: "magicCursor",
    href: "/magic-cursor",
    analyticsTarget: "magic_cursor",
  },
  {
    id: "imageToUi",
    href: "/image-to-ui",
    analyticsTarget: "image_to_ui",
  },
  {
    id: "flowEditor",
    href: "/flow",
    analyticsTarget: "flow_editor",
  },
  {
    id: "findInVideo",
    href: "/find-in-video",
    analyticsTarget: "find_in_video",
  },
  {
    id: "floorPlan",
    href: "/floor-plan",
    analyticsTarget: "floor_plan",
  },
];

/** Homepage lab-bench showcase order (differs from nav menu order). */
export const homepageProjectShowcaseOrder = [
  "duduScanner",
  "imageToUi",
  "magicCursor",
] as const satisfies readonly ProjectId[];
