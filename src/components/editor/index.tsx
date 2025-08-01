"use client";

import CSSEditorMutationContextProvider from "./context/mutationContext";
import CSSEditorStateContextProvider from "./context/stateContext";
import type { CSSStyleDefinition } from "./definitions";

export { useCSSEditorState, useGeneratedCSS } from "./context/stateContext";

export { default as CSSEditor } from "./CSSEditor";

export interface EditorState {
  style: CSSStyleDefinition;
}

export function CSSEditorContext(props: { children: React.ReactNode }) {
  return (
    <CSSEditorStateContextProvider>
      <CSSEditorMutationContextProvider>
        {props.children}
      </CSSEditorMutationContextProvider>
    </CSSEditorStateContextProvider>
  );
}
