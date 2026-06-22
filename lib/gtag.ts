const DATA_LAYER = "dataLayer";

declare global {
  interface Window {
    dataLayer?: IArguments[];
    gtag?: Gtag;
  }
}

type Gtag = {
  (...args: unknown[]): void;
};

function getGtag(): Gtag | undefined {
  if (typeof window === "undefined") return undefined;
  return window.gtag;
}

export function ensureGtag(gaId: string) {
  if (typeof window === "undefined" || !gaId) return;

  if (document.querySelector(`script[data-chase-ga="${gaId}"]`)) {
    return;
  }

  window[DATA_LAYER] = window[DATA_LAYER] || [];
  const gtag = function gtag() {
    // gtag.js pushes the `arguments` object, not a rest array.
    // eslint-disable-next-line prefer-rest-params -- required for GA dataLayer contract
    window[DATA_LAYER]!.push(arguments);
  } as Gtag;
  window.gtag = gtag;

  gtag("js", new Date());
  gtag("config", gaId);

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
  script.dataset.chaseGa = gaId;
  document.head.appendChild(script);
}

export function sendGtagPageView(gaId: string, pagePath: string) {
  if (typeof window === "undefined" || !gaId) return;
  ensureGtag(gaId);
  getGtag()?.("config", gaId, { page_path: pagePath });
}

export function sendGtagEvent(
  name: string,
  params?: Record<string, string | number | boolean>,
) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  if (!gaId || typeof window === "undefined") return;
  ensureGtag(gaId);
  getGtag()?.("event", name, params ?? {});
}
