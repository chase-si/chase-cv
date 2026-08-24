import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { GoogleAdSense } from "@/components/google-adsense";

describe("GoogleAdSense", () => {
  it("renders the official Auto Ads script for the configured publisher", () => {
    const markup = renderToStaticMarkup(
      <GoogleAdSense clientId="ca-pub-1234567890123456" />,
    );

    expect(markup).toContain('id="google-adsense"');
    expect(markup).toContain(
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456",
    );
    expect(markup).toContain('crossorigin="anonymous"');
    expect(markup).toContain("async=\"\"");
  });
});
