type GoogleAdSenseProps = {
  clientId: string;
};

export function GoogleAdSense({ clientId }: GoogleAdSenseProps) {
  const scriptUrl = new URL(
    "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",
  );
  scriptUrl.searchParams.set("client", clientId);

  return (
    <script
      id="google-adsense"
      async
      src={scriptUrl.toString()}
      crossOrigin="anonymous"
    />
  );
}
