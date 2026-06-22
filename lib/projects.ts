export type ProjectId = "magicCursor" | "imageToUi" | "flowEditor";

export type ProjectNavigationItem = {
  id: ProjectId;
  href: "/magic-cursor" | "/image-to-ui" | "/flow";
  analyticsTarget: "magic_cursor" | "image_to_ui" | "flow_editor";
};

export const projectNavigationItems: ProjectNavigationItem[] = [
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
];

/** Homepage lab-bench showcase order (differs from nav menu order). */
export const homepageProjectShowcaseOrder: ProjectId[] = [
  "imageToUi",
  "magicCursor",
  "flowEditor",
];
