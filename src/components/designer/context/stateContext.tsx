"use client";
import { createContext, useContext, useMemo, useState } from "react";
import generateCSS from "../generator";
import useSetSaveState, { useGetSaveState } from "../util/useSaveState";
import type { DesignerState } from "..";

interface ContextType {
  state: DesignerState;
  setState: (state: DesignerState) => void;
}

const CSSDesignerContext = createContext<ContextType | undefined>(undefined);

export default function CSSDesignerStateContextProvider(props: {
  children: React.ReactNode;
}) {
  const { ready, state: initialState } = useGetSaveState();
  if (!ready) return null;

  return (
    <ContextProviderInner initialState={initialState}>
      {props.children}
    </ContextProviderInner>
  );
}

function ContextProviderInner(props: {
  children: React.ReactNode;
  initialState?: DesignerState;
}) {
  const [state, setState] = useState(
    props.initialState ?? {
      style: {},
    },
  );

  useSetSaveState(state);

  return (
    <CSSDesignerContext.Provider value={{ state, setState }}>
      {props.children}
    </CSSDesignerContext.Provider>
  );
}

/**
 * Hook to access the state of the CSS designer, when within a CSSDesignerStateContextProvider.
 */
export function useCSSDesignerState(): [
  DesignerState,
  (state: DesignerState) => void,
] {
  const context = useContext(CSSDesignerContext);
  if (!context) {
    throw new Error(
      "useCSSDesignerState must be used within a CSSDesignerStateContextProvider",
    );
  }

  return [context.state, context.setState];
}

/**
 * Hook to access the generated CSS from the current state of the CSS designer.
 */
export function useGeneratedCSS() {
  const [state] = useCSSDesignerState();

  return useMemo(() => {
    return generateCSS(state.style);
  }, [state]);
}
