type EnvKey = "NEXT_PUBLIC_SITE_URL";

function required(name: EnvKey): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

export const env = {
  NEXT_PUBLIC_SITE_URL: required("NEXT_PUBLIC_SITE_URL"),
};
