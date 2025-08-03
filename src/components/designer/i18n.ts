import { useTranslations } from "next-intl";
import type { CSSSelectorName } from "./definitions/selectors";

export default function useDesignerTranslations() {
  const tSel = useTranslations("CSSDesigner.selectors");
  const tProp = useTranslations("CSSDesigner.properties");

  function normalize(key: string): string {
    return key.replaceAll(".", "#");
  }

  return {
    tSelector: (selector: CSSSelectorName) => {
      return tSel(normalize(selector));
    },
    tProperty: (property: string) => {
      return tProp(normalize(property));
    },
  };
}
