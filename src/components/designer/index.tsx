"use client";

import CSSDesignerMutationContextProvider from "./context/mutationContext";
import CSSDesignerStateContextProvider from "./context/stateContext";
import type { CSSStyleDefinition } from "./definitions";
import type { GenerateCSSOptions } from "./generator";

export { useCSSDesignerState, useGeneratedCSS } from "./context/stateContext";

export { default as CSSDesigner } from "./CSSDesigner";

export interface DesignerState {
  style: CSSStyleDefinition;
  options?: GenerateCSSOptions;
}

export function CSSDesignerContext(props: { children: React.ReactNode }) {
  return (
    <CSSDesignerStateContextProvider>
      <CSSDesignerMutationContextProvider>
        {props.children}
      </CSSDesignerMutationContextProvider>
    </CSSDesignerStateContextProvider>
  );
}
