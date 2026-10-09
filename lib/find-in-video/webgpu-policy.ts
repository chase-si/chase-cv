export type WebGpuEnvironment = {
  userAgent: string;
  platform: string;
  maxTouchPoints: number;
};

export const webGpuAttemptMs = 10_000;

export function shouldSkipWebGpu(env: WebGpuEnvironment) {
  const ua = env.userAgent;
  const ios =
    /iPad|iPhone|iPod/i.test(ua) || (env.platform === "MacIntel" && env.maxTouchPoints > 1);
  const inApp = /MicroMessenger|QQ\/|Weibo|AlipayClient|DingTalk|FBAN|FBAV|Instagram|; wv\)/i.test(ua);
  return ios || inApp;
}
