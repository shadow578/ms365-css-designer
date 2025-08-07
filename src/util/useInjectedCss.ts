import { useCallback, useEffect } from "react";

/**
 * dynamically injects CSS into a target document.
 *
 * @param targetDocument the document where the CSS should be injected. can either be window.document or an iframe's document.
 * @param css The CSS string to inject into the target document.
 * @note targetDocument is optional for convenience. if not provided, this hook is a no-op.
 */
export default function useInjectedCss(
  targetDocument: Document | undefined | null,
  css: string,
) {
  const id = "__injected-style__";

  const injectCss = useCallback(() => {
    if (!targetDocument?.head) return;

    const styleElement = targetDocument.createElement("style");
    styleElement.id = id;
    styleElement.appendChild(targetDocument.createTextNode(css));
    targetDocument.head.appendChild(styleElement);
  }, [targetDocument, css, id]);

  const removeCss = useCallback(() => {
    if (!targetDocument?.head) return;

    targetDocument.getElementById(id)?.remove();
  }, [targetDocument, id]);

  useEffect(() => {
    injectCss();
    return removeCss;
  }, [injectCss, removeCss, css, targetDocument]);

  return { injectCss };
}
