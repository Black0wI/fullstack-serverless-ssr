import { getRequestConfig } from "next-intl/server";

export const locales = ["fr", "en"] as const;
export const defaultLocale = "fr" as const;

export type Locale = (typeof locales)[number];

function normalizeLocale(locale?: string | null): Locale {
  if (!locale) {
    return defaultLocale;
  }

  const baseLocale = locale.toLowerCase().split("-")[0];
  return locales.includes(baseLocale as Locale) ? (baseLocale as Locale) : defaultLocale;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = normalizeLocale(await requestLocale);

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
