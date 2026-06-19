export const SETTINGS_TEAM_MEMBERS = [
  { initials: "S", name: "Sofia Davis", email: "m@example.com", role: "Owner" as const },
  { initials: "J", name: "Jackson Lee", email: "p@example.com", role: "Developer" as const },
  { initials: "I", name: "Isabella Nguyen", email: "i@example.com", role: "Billing" as const },
];

export const PREVIEW_CUSTOMER_PIPELINE_ROWS: Array<{
  customer: string;
  owner: string;
  arr: string;
  stage: string;
  status: string;
  statusVariant: "secondary" | "accent" | "outline";
  actionLabel: string;
  actionText: string;
}> = [
  {
    customer: "Acme Robotics",
    owner: "Nora West",
    arr: "$124k",
    stage: "Expansion",
    status: "At risk",
    statusVariant: "accent",
    actionLabel: "Open Acme Robotics account",
    actionText: "Open account",
  },
  {
    customer: "Northwind Labs",
    owner: "Alex Li",
    arr: "$88k",
    stage: "QBR",
    status: "Healthy",
    statusVariant: "secondary",
    actionLabel: "Schedule QBR for Northwind Labs",
    actionText: "Schedule QBR",
  },
  {
    customer: "Zephyr Mobility",
    owner: "Mina Park",
    arr: "$63k",
    stage: "Renewal",
    status: "Renewal due",
    statusVariant: "outline",
    actionLabel: "Review Zephyr Mobility renewal",
    actionText: "Review renewal",
  },
];

export const DASHBOARD_KPI_CARDS = [
  {
    label: "Total revenue",
    value: "$84,200",
    delta: "+12.4%",
    detail: "Trending up this month",
    testId: "saas-metric-mrr",
  },
  {
    label: "New customers",
    value: "1,284",
    delta: "+18.2%",
    detail: "Pipeline conversion improved",
    testId: "saas-metric-customers",
  },
  {
    label: "Open incidents",
    value: "3",
    delta: "-2",
    detail: "APAC latency remains watched",
    testId: "saas-metric-incidents",
  },
  {
    label: "Expansion rate",
    value: "42%",
    delta: "+4.5%",
    detail: "Healthy account momentum",
    testId: "saas-metric-growth",
  },
];

export const REVENUE_SERIES = [
  { month: "Jan", revenue: 42, expansion: 16 },
  { month: "Feb", revenue: 48, expansion: 22 },
  { month: "Mar", revenue: 51, expansion: 27 },
  { month: "Apr", revenue: 58, expansion: 31 },
  { month: "May", revenue: 64, expansion: 36 },
  { month: "Jun", revenue: 78, expansion: 44 },
];

export const SEGMENT_SERIES = [
  { segment: "SMB", active: 36, risk: 10 },
  { segment: "Mid", active: 48, risk: 12 },
  { segment: "Ent", active: 62, risk: 8 },
  { segment: "Gov", active: 28, risk: 6 },
];

export const LANDING_FEATURE_CARDS = [
  {
    title: "Pipeline intelligence",
    description: "Surface expansion risk and revenue signals before they become escalations.",
  },
  {
    title: "Guided playbooks",
    description: "Turn best practices into repeatable motions for every customer segment.",
  },
  {
    title: "Executive visibility",
    description: "Share progress, blockers, and proof points in one branded command center.",
  },
];

export const BAR_CHART_HOVER_CURSOR = "color-mix(in srgb, var(--primary) 14%, transparent)";
