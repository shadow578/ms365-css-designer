import { useTranslations } from "next-intl";
import type { CSSSelectorName } from "./definitions/selectors";
import { normalizeKey } from "./i18n.util";

export default function useDesignerTranslations() {
  const tSel = useTranslations("CSSDesigner.selectors");
  const tProp = useTranslations("CSSDesigner.properties");

  return {
    tSelector: (selector: CSSSelectorName) => {
      return tSel(normalizeKey(selector));
    },
    tProperty: (property: string) => {
      return tProp(normalizeKey(property));
    },
  };
}
