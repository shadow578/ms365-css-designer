import "jest";
import type { Messages } from "next-intl";
import { ALL_PROPERTY_NAMES } from "./definitions/properties";
import { ALL_SELECTORS } from "./definitions/selectors";
import { normalizeKey } from "./i18n.util";

describe("i18n.util", () => {
  test("normalizeKey", () => {
    expect(normalizeKey("color")).toBe("color");
    expect(normalizeKey("color$:hover")).toBe("color$:hover");
    expect(normalizeKey(".ext-button")).toBe("#ext-button");
  });
});

describe("i18n messages", () => {
  describe.each(["en", "de"])(
    "all messages present for language '%s'",
    (lang) => {
      const loadMessage = async (lang: string) => {
        return (await import(`../../../messages/${lang}.json`)) as Messages;
      };

      it.each(ALL_SELECTORS)(
        "message for selector '%s' is present",
        async (selector) => {
          const messages = await loadMessage(lang);
          expect(messages).toHaveProperty(
            `CSSDesigner.selectors.${normalizeKey(selector)}`,
          );
        },
      );

      it.each(ALL_PROPERTY_NAMES)(
        "message for property '%s' is present",
        async (property) => {
          const messages = await loadMessage(lang);
          expect(messages).toHaveProperty(
            `CSSDesigner.properties.${normalizeKey(property)}`,
          );
        },
      );
    },
  );
});
