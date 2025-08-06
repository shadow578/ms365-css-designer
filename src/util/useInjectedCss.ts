import { useEffect } from "react";

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
  useEffect(() => {
    if (!targetDocument?.head) return;

    const id = "__injected-style__"; // TODO: make this more unique, best per-call

    const styleElement = targetDocument.createElement("style");
    styleElement.id = id;
    styleElement.appendChild(targetDocument.createTextNode(css));
    targetDocument.head.appendChild(styleElement);

    return () => {
      targetDocument.getElementById(id)?.remove();
    };
  }, [css, targetDocument]);
}
