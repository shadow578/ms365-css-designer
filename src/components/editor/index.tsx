"use client";

import type { CSSStyleDefinition } from "./definitions";

export {
  default as CSSEditorContextProvider,
  useCSSEditorState,
  useGeneratedCSS,
} from "./context/stateContext";

export { default as CSSEditor } from "./CSSEditor";

export interface EditorState {
  style: CSSStyleDefinition;
}
