import type { LinguiConfig } from "@lingui/conf";

const config: LinguiConfig = {
  compileNamespace: "es",
  locales: ["en", "de"],
  sourceLocale: "en",
  fallbackLocales: {
    default: "en",
  },
  catalogs: [
    {
      path: "src/locales/{locale}",
      include: ["src/"],
    },
  ],
};

export default config;
