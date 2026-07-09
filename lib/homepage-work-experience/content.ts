/**
 * Single source of truth for homepage work experience:
 * timeline entries, project order, screenshots, and copy (en/zh).
 * Runtime messages are merged in `patchHomeMessagesWithWorkExperience`.
 */

export type WorkExperienceLocale = "en" | "zh";

export type LocalizedString = Record<WorkExperienceLocale, string>;

export type LocalizedStringList = Record<WorkExperienceLocale, readonly string[]>;

export type WorkExperienceProjectContent = {
  readonly id: string;
  readonly image: string;
  readonly title: LocalizedString;
  readonly blurb: LocalizedString;
};

export type WorkExperienceEntryContent = {
  readonly id: string;
  readonly yearLabel: LocalizedString;
  readonly company: LocalizedString;
  readonly period: LocalizedString;
  readonly role: LocalizedString;
  readonly scope: LocalizedString;
  readonly outcomes: LocalizedStringList;
  readonly projects: readonly WorkExperienceProjectContent[];
};

export const homepageWorkExperienceContent = {
  experienceTitle: {
    en: "Work experience",
    zh: "工作经历",
  },
  experienceDescription: {
    en: "Frontend and full-stack delivery across e-commerce, industrial desktop, and payments.",
    zh: "覆盖电商、工业桌面与支付等方向的前端与全栈交付。",
  },
  section: {
    sectionAria: {
      en: "Work experience timeline",
      zh: "工作经历时间线",
    },
    supportingLine: {
      en: "Eight years of shipping web, desktop, and mobile product work—summarized by employer with project evidence on the cards.",
      zh: "约 8 年 Web、桌面与移动端产品交付；按雇主归纳，项目卡以截图佐证。",
    },
    fields: {
      period: { en: "Period", zh: "时间段" },
      role: { en: "Role", zh: "角色" },
      scope: { en: "Scope", zh: "范围" },
      outcomes: { en: "Representative outcomes", zh: "代表性成果" },
    },
  },
  entries: [
    {
      id: "entry1",
      yearLabel: { en: "2018", zh: "2018" },
      company: { en: "Imaginato", zh: "Imaginato" },
      period: { en: "Mar 2018 – Aug 2020", zh: "2018 年 3 月 – 2020 年 8 月" },
      role: { en: "Frontend developer", zh: "前端开发" },
      scope: {
        en: "E-commerce and ticketing products with React, Next.js, Redux, Vue, Node.js, Express, and MySQL.",
        zh: "电商与票务产品，技术栈含 React、Next.js、Redux、Vue、Node.js、Express、MySQL。",
      },
      outcomes: {
        en: [
          "Contributed to Pomelo Fashion, Tix, and Go-shop across Southeast Asian e-commerce and ticketing.",
          "Worked across React and Vue stacks with backend APIs on Node.js and MySQL.",
        ],
        zh: [
          "参与 Pomelo Fashion、Tix、Go-shop 等东南亚电商与票务项目。",
          "在 React 与 Vue 栈及 Node.js / MySQL 后端协作中交付功能。",
        ],
      },
      projects: [
        {
          id: "imaginato-pomelo",
          image: "/imgs/work-experience/imaginato/pomelo-fashion.png",
          title: { en: "Pomelo Fashion", zh: "Pomelo Fashion" },
          blurb: {
            en: "Thai fashion e-commerce shipping to multiple countries in Southeast Asia.",
            zh: "面向东南亚多国发货的泰国时尚电商。",
          },
        },
        {
          id: "imaginato-tix",
          image: "/imgs/work-experience/imaginato/tix.png",
          title: { en: "Tix", zh: "Tix" },
          blurb: {
            en: "Ticketing product work alongside other Imaginato e-commerce initiatives.",
            zh: "票务产品，与其他 Imaginato 电商项目并行推进。",
          },
        },
      ],
    },
    {
      id: "entry2",
      yearLabel: { en: "2021", zh: "2021" },
      company: { en: "Red Creation", zh: "Red Creation" },
      period: { en: "Apr 2021 – Mar 2024", zh: "2021 年 4 月 – 2024 年 3 月" },
      role: { en: "Frontend lead and project manager", zh: "前端负责人 / 项目经理" },
      scope: {
        en: "Linux Electron desktop apps, device configuration, maps, charts, high-frequency data, and React flow-chart control systems.",
        zh: "Linux Electron 桌面、设备配置、地图与图表、高频数据，以及 React 流程图控制系统。",
      },
      outcomes: {
        en: [
          "Led frontend and delivery for a device sensor desktop application under hardware and offline constraints.",
          "Built React + Electron foundations and flow-chart interactions for ChuTian and ZhongJi control systems.",
        ],
        zh: [
          "主导设备传感桌面应用前端与交付，应对硬件、离线与高频渲染约束。",
          "为楚天、中集控制场景搭建 React + Electron 基座与流程图交互。",
        ],
      },
      projects: [
        {
          id: "red-creation-device-map",
          image: "/imgs/work-experience/red-creation/device-map-stations.png",
          title: { en: "Map rendering", zh: "地图渲染" },
          blurb: {
            en: "Render stations on the map inside the device configuration desktop app.",
            zh: "在设备配置桌面端将站点渲染到地图上。",
          },
        },
        {
          id: "red-creation-device-tree",
          image: "/imgs/work-experience/red-creation/device-tree-drag.png",
          title: { en: "Device tree", zh: "设备树" },
          blurb: {
            en: "Drag stations into a tree structure for organizing field devices.",
            zh: "拖拽站点组成树形结构，组织现场设备。",
          },
        },
        {
          id: "red-creation-device-control",
          image: "/imgs/work-experience/red-creation/device-control.png",
          title: { en: "Device control", zh: "设备控制" },
          blurb: {
            en: "Control UI for the selected device from the desktop client.",
            zh: "桌面客户端中对选中设备的控制界面。",
          },
        },
        {
          id: "red-creation-device-replay",
          image: "/imgs/work-experience/red-creation/device-replay-page.png",
          title: { en: "Data replay", zh: "数据回放" },
          blurb: {
            en: "Replay page for reviewing captured device data.",
            zh: "回放页查看采集到的设备数据。",
          },
        },
        {
          id: "red-creation-flow-architecture",
          image: "/imgs/work-experience/red-creation/flow-systems-architecture.png",
          title: { en: "Systems architecture", zh: "系统架构" },
          blurb: {
            en: "Architecture reference for ChuTian and ZhongJi flow-chart control projects.",
            zh: "楚天、中集流程图控制项目的架构参考。",
          },
        },
        {
          id: "red-creation-flow-design-doc",
          image: "/imgs/work-experience/red-creation/flow-design-document.png",
          title: { en: "ChuTian ChartFlow design", zh: "楚天 ChartFlow 设计" },
          blurb: {
            en: "Design document for ChartFlow interactions in the ChuTian program.",
            zh: "楚天项目中 ChartFlow 交互的设计文档。",
          },
        },
        {
          id: "red-creation-flow-chutian-demo",
          image: "/imgs/work-experience/red-creation/flow-chutian-demo.png",
          title: { en: "ChuTian flow chart", zh: "楚天流程图" },
          blurb: {
            en: "Operational flow-chart UI for medical drug synthesis control scenarios.",
            zh: "医药合成控制场景下的操作流程图界面。",
          },
        },
        {
          id: "red-creation-flow-zhongji-demo",
          image: "/imgs/work-experience/red-creation/flow-zhongji-demo.png",
          title: { en: "ZhongJi flow chart", zh: "中集流程图" },
          blurb: {
            en: "Flow-chart interactions for industrial equipment control.",
            zh: "工业设备控制场景的流程图交互。",
          },
        },
      ],
    },
    {
      id: "entry3",
      yearLabel: { en: "2024", zh: "2024" },
      company: { en: "Aladia", zh: "Aladia" },
      period: { en: "Jun 2024 – Apr 2026", zh: "2024 年 6 月 – 2026 年 4 月" },
      role: { en: "Frontend engineer", zh: "前端工程师" },
      scope: {
        en: "Stripe payments, billing, marketing tracking, HTML email infrastructure, SendGrid migration, and React Native payment flows.",
        zh: "Stripe 支付、账单、营销追踪、HTML 邮件体系、SendGrid 迁移与 React Native 支付。",
      },
      outcomes: {
        en: [
          "Implemented payment, billing, subscription, and invite-to-purchase flows on web and mobile.",
          "Built reusable email templates and migrated sending from Gmail to SendGrid.",
        ],
        zh: [
          "在 Web 与移动端实现支付、订阅、账单与邀请购买等流程。",
          "建设可复用邮件模板并将发送从 Gmail 迁移至 SendGrid。",
        ],
      },
      projects: [
        {
          id: "aladia-payment",
          image: "/imgs/work-experience/aladia/payment.png",
          title: { en: "Payment domain", zh: "支付域" },
          blurb: {
            en: "Stripe onboarding, checkout, payment methods, and balance management on web.",
            zh: "Web 端 Stripe 入驻、结账、支付方式与余额管理。",
          },
        },
        {
          id: "aladia-marketing",
          image: "/imgs/work-experience/aladia/marketing-utm.png",
          title: { en: "Marketing support", zh: "营销支持" },
          blurb: {
            en: "UTM parameters and tracking explanations for ads, registration, and checkout funnels.",
            zh: "广告 UTM 与注册、结账等漏斗的前端与 GTM 追踪说明。",
          },
        },
        {
          id: "aladia-email",
          image: "/imgs/work-experience/aladia/email-templates.png",
          title: { en: "Email templates", zh: "邮件模板" },
          blurb: {
            en: "Reusable HTML email components and a large library of production templates.",
            zh: "可复用 HTML 邮件组件与大量线上模板。",
          },
        },
        {
          id: "aladia-mobile",
          image: "/imgs/work-experience/aladia/mobile-payment.png",
          title: { en: "Mobile app", zh: "移动应用" },
          blurb: {
            en: "React Native WebView auth and Stripe payment flows on mobile.",
            zh: "React Native WebView 登录与 Stripe 支付相关能力。",
          },
        },
      ],
    },
  ],
} as const satisfies {
  experienceTitle: LocalizedString;
  experienceDescription: LocalizedString;
  section: {
    sectionAria: LocalizedString;
    supportingLine: LocalizedString;
    fields: Record<"period" | "role" | "scope" | "outcomes", LocalizedString>;
  };
  entries: readonly WorkExperienceEntryContent[];
};
