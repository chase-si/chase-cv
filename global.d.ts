import messages from "./messages/en.json";

import type { PatchedHomeExperienceMessages } from "@/lib/homepage-work-experience/intl-messages";

declare module "next-intl" {
  interface AppConfig {
    Messages: typeof messages & {
      home: typeof messages.home & PatchedHomeExperienceMessages;
    };
  }
}
