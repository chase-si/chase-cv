import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  HOMEPAGE_EXPERIENCE_CARD_IN_DURATION,
  HOMEPAGE_EXPERIENCE_CARD_OUT_DURATION,
  HOMEPAGE_EXPERIENCE_FLY_X_PERCENT,
  HOMEPAGE_EXPERIENCE_PIN_PX,
  HOMEPAGE_EXPERIENCE_SCRUB,
  HOMEPAGE_EXPERIENCE_STACK_SPREAD,
} from "@/lib/homepage-motion/config";
import type {
  HomepageWorkExperienceEntryId,
  HomepageWorkExperienceProjectId,
} from "@/lib/homepage-work-experience";

function ensureScrollTrigger() {
  gsap.registerPlugin(ScrollTrigger);
}

export const HOMEPAGE_EXPERIENCE_S_PATH =
  "M 62 18 C 28 92, 198 68, 158 152 C 118 236, 34 268, 78 348 C 122 428, 210 438, 172 518 C 134 598, 38 572, 88 628";

export const HOMEPAGE_EXPERIENCE_NODE_ALONG_PATH = [0.14, 0.48, 0.86] as const;

export type ExperiencePathNode = { x: number; y: number };

export type ExperienceStackPose = { x: number; y: number; rotation: number };

export type FlatExperienceProject = {
  entryId: HomepageWorkExperienceEntryId;
  projectId: HomepageWorkExperienceProjectId;
  globalIndex: number;
};

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function stackPoseForExperienceCard(
  projectId: string,
  spread = HOMEPAGE_EXPERIENCE_STACK_SPREAD,
): ExperienceStackPose {
  const hash = hashString(projectId);
  const pick = (shift: number, span: number) => ((hash >> shift) % span) - (span - 1) / 2;
  return {
    x: pick(0, 17) * spread,
    y: pick(3, 15) * spread,
    rotation: pick(6, 11) * 0.55 * spread,
  };
}

function cardRevealThreshold(globalIndex: number, total: number) {
  return globalIndex / total;
}

export function targetVisibleExperienceCardCount(progress: number, total: number) {
  let count = 0;
  for (let i = 0; i < total; i += 1) {
    if (progress >= cardRevealThreshold(i, total)) {
      count += 1;
    }
  }
  return count;
}

export function measureExperiencePathNodes(path: SVGPathElement): ExperiencePathNode[] {
  if (typeof path.getTotalLength !== "function") {
    return [];
  }
  const pathLength = path.getTotalLength();
  return HOMEPAGE_EXPERIENCE_NODE_ALONG_PATH.map((t) => {
    const point = path.getPointAtLength(pathLength * t);
    return { x: point.x, y: point.y };
  });
}

type RegisterOptions = {
  scope: HTMLElement;
  pin: HTMLElement;
  path: SVGPathElement;
  cardRefs: Map<string, HTMLElement>;
  flatProjects: FlatExperienceProject[];
  onPathNodes?: (nodes: ExperiencePathNode[]) => void;
};

export function registerHomepageExperienceScroll({
  scope,
  pin,
  path,
  cardRefs,
  flatProjects,
  onPathNodes,
}: RegisterOptions) {
  ensureScrollTrigger();
  const totalCards = flatProjects.length;
  const displayedCountRef = { current: 0 };
  const stackPoses = flatProjects.map(({ projectId }) =>
    stackPoseForExperienceCard(projectId),
  );

  const flyX = HOMEPAGE_EXPERIENCE_FLY_X_PERCENT;

  const flyCardIn = (globalIndex: number) => {
    const { projectId } = flatProjects[globalIndex]!;
    const el = cardRefs.get(projectId);
    const pose = stackPoses[globalIndex];
    if (!el || !pose) {
      return;
    }

    gsap.killTweensOf(el);
    gsap.fromTo(
      el,
      {
        xPercent: flyX,
        x: 0,
        y: 0,
        rotation: pose.rotation * 1.6,
        opacity: 0,
      },
      {
        xPercent: 0,
        x: pose.x,
        y: pose.y,
        rotation: pose.rotation,
        opacity: 1,
        duration: HOMEPAGE_EXPERIENCE_CARD_IN_DURATION,
        ease: "back.out(1.35)",
        overwrite: true,
      },
    );
    gsap.set(el, { zIndex: 10 + globalIndex });
  };

  const flyCardOut = (globalIndex: number) => {
    const { projectId } = flatProjects[globalIndex]!;
    const el = cardRefs.get(projectId);
    if (!el) {
      return;
    }

    gsap.killTweensOf(el);
    gsap.to(el, {
      xPercent: flyX,
      x: 0,
      y: 0,
      rotation: 0,
      opacity: 0,
      duration: HOMEPAGE_EXPERIENCE_CARD_OUT_DURATION,
      ease: "back.in(1.35)",
      overwrite: true,
      onComplete: () => {
        gsap.set(el, { zIndex: 0 });
      },
    });
  };

  const syncStackToTarget = (targetCount: number) => {
    const current = displayedCountRef.current;
    if (targetCount === current) {
      return;
    }

    if (targetCount > current) {
      for (let i = current; i < targetCount; i += 1) {
        flyCardIn(i);
      }
    } else {
      for (let i = current - 1; i >= targetCount; i -= 1) {
        flyCardOut(i);
      }
    }

    displayedCountRef.current = targetCount;
  };

  const ctx = gsap.context(() => {
    const pathLength = path.getTotalLength();
    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });

    onPathNodes?.(measureExperiencePathNodes(path));

    flatProjects.forEach(({ projectId }) => {
      const el = cardRefs.get(projectId);
      if (el) {
        gsap.set(el, {
          xPercent: flyX,
          x: 0,
          y: 0,
          rotation: 0,
          opacity: 0,
          zIndex: 0,
        });
      }
    });
    displayedCountRef.current = 0;
    syncStackToTarget(targetVisibleExperienceCardCount(0, totalCards));

    ScrollTrigger.create({
      trigger: pin,
      start: "top top",
      end: `+=${HOMEPAGE_EXPERIENCE_PIN_PX}`,
      pin: true,
      scrub: HOMEPAGE_EXPERIENCE_SCRUB,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const scrollProgress = self.progress;
        gsap.set(path, {
          strokeDashoffset: pathLength * (1 - scrollProgress),
        });
        const targetCount = targetVisibleExperienceCardCount(scrollProgress, totalCards);
        syncStackToTarget(targetCount);
      },
    });

    ScrollTrigger.refresh();
  }, scope);

  return () => {
    displayedCountRef.current = 0;
    ctx.revert();
  };
}

export function setExperiencePathFullyDrawn(path: SVGPathElement) {
  if (typeof path.getTotalLength !== "function") {
    return;
  }
  const pathLength = path.getTotalLength();
  gsap.set(path, {
    strokeDasharray: pathLength,
    strokeDashoffset: 0,
  });
}
