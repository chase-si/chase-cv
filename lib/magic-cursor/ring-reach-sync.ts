/** `ring` 通过 window `pointermove` 激活；画廊懒挂载时需在 pointerenter / 悬停时补发一次。 */
export function dispatchRingReachPointerMove(clientX: number, clientY: number) {
  window.dispatchEvent(
    new PointerEvent("pointermove", {
      clientX,
      clientY,
      bubbles: true,
      pointerId: 1,
      pointerType: "mouse",
    }),
  );
}

export function activateRingReachAt(clientX: number, clientY: number) {
  dispatchRingReachPointerMove(clientX, clientY);
  queueMicrotask(() => dispatchRingReachPointerMove(clientX, clientY));
  requestAnimationFrame(() => dispatchRingReachPointerMove(clientX, clientY));
}

export function bindRingReachActivationSync(root: HTMLElement) {
  const onEnter = (event: PointerEvent) => {
    dispatchRingReachPointerMove(event.clientX, event.clientY);
  };
  root.addEventListener("pointerenter", onEnter);
  if (root.matches(":hover")) {
    requestAnimationFrame(() => {
      const rect = root.getBoundingClientRect();
      dispatchRingReachPointerMove(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
      );
    });
  }
  return () => {
    root.removeEventListener("pointerenter", onEnter);
  };
}
