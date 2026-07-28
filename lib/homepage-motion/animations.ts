import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  HOMEPAGE_HERO_STAGGER,
  HOMEPAGE_REVEAL_DURATION,
  HOMEPAGE_REVEAL_EASE,
  HOMEPAGE_REVEAL_STAGGER,
  HOMEPAGE_REVEAL_Y,
  HOMEPAGE_SCROLL_TRIGGER_START,
} from "@/lib/homepage-motion/config";
import { exaggeratedBoxShadow, readElementBoxShadow } from "@/lib/homepage-motion/shadow";

gsap.registerPlugin(ScrollTrigger);

type MotionKind = "hero" | "reveal" | "reveal-card";

function neoBrutalistTweenVars(element: HTMLElement, y = HOMEPAGE_REVEAL_Y) {
  const boxShadow = readElementBoxShadow(element);
  const from: gsap.TweenVars = { opacity: 0, y };
  const to: gsap.TweenVars = {
    opacity: 1,
    y: 0,
    duration: HOMEPAGE_REVEAL_DURATION,
    ease: HOMEPAGE_REVEAL_EASE,
  };

  if (boxShadow) {
    from.boxShadow = exaggeratedBoxShadow(boxShadow, 2.25);
    to.boxShadow = boxShadow;
  }

  return { from, to };
}

function setNeoBrutalistFromState(element: HTMLElement, y = HOMEPAGE_REVEAL_Y) {
  const { from } = neoBrutalistTweenVars(element, y);
  gsap.set(element, from);
}

function queryMotionTargets(root: ParentNode, kind: MotionKind) {
  return gsap.utils.toArray<HTMLElement>(`[data-homepage-motion="${kind}"]`, root);
}

function restoreBoxShadow(element: HTMLElement) {
  gsap.set(element, { clearProps: "boxShadow,transform,opacity" });
}

export function runHeroIntro(root: ParentNode) {
  const targets = queryMotionTargets(root, "hero");
  if (targets.length === 0) {
    return;
  }

  targets.forEach((target) => setNeoBrutalistFromState(target));

  gsap.to(targets, {
    ...neoBrutalistTweenVars(targets[0]).to,
    stagger: HOMEPAGE_HERO_STAGGER,
    onComplete: () => {
      targets.forEach(restoreBoxShadow);
    },
  });
}

function registerRevealTarget(element: HTMLElement, y = HOMEPAGE_REVEAL_Y) {
  const { from, to } = neoBrutalistTweenVars(element, y);
  gsap.set(element, from);

  gsap.to(element, {
    ...to,
    scrollTrigger: {
      trigger: element,
      start: HOMEPAGE_SCROLL_TRIGGER_START,
      once: true,
    },
    onComplete: () => restoreBoxShadow(element),
  });
}

export function registerScrollReveals(root: ParentNode) {
  queryMotionTargets(root, "reveal").forEach((element) => registerRevealTarget(element));

  const cardGroups = gsap.utils.toArray<HTMLElement>("[data-homepage-motion-group]", root);
  cardGroups.forEach((group) => {
    const cards = queryMotionTargets(group, "reveal-card");
    if (cards.length === 0) {
      return;
    }

    const y = HOMEPAGE_REVEAL_Y + 8;
    cards.forEach((card) => setNeoBrutalistFromState(card, y));

    gsap.to(cards, {
      ...neoBrutalistTweenVars(cards[0], y).to,
      stagger: HOMEPAGE_REVEAL_STAGGER,
      scrollTrigger: {
        trigger: group,
        start: HOMEPAGE_SCROLL_TRIGGER_START,
        once: true,
      },
      onComplete: () => {
        cards.forEach(restoreBoxShadow);
      },
    });
  });
}
