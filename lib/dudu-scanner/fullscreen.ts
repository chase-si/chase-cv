export type FullscreenHost = HTMLElement & {
  requestFullscreen?: () => Promise<void>;
};

export async function requestAppFullscreen(host: FullscreenHost | null): Promise<boolean> {
  if (!host?.requestFullscreen) {
    return false;
  }
  try {
    await host.requestFullscreen();
    return true;
  } catch {
    return false;
  }
}

export async function exitAppFullscreen(): Promise<void> {
  if (typeof document === "undefined") {
    return;
  }
  if (document.fullscreenElement) {
    try {
      await document.exitFullscreen();
    } catch {
      // ignore
    }
  }
}

export function isFullscreenActive(): boolean {
  if (typeof document === "undefined") {
    return false;
  }
  return Boolean(document.fullscreenElement);
}
