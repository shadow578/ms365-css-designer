"use client";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import generateCSS from "../generator";
import useSetSaveState, { useGetSaveState } from "../util/useSaveState";
import type { DesignerState } from "..";

interface ContextType {
  state: DesignerState;
  setState: Dispatch<SetStateAction<DesignerState>>;
}

const CSSDesignerContext = createContext<ContextType | undefined>(undefined);

export default function CSSDesignerStateContextProvider(props: {
  children: React.ReactNode;
}) {
  const initialState = useGetSaveState();

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

  const context = useMemo(() => ({ state, setState }), [state, setState]);

  return (
    <CSSDesignerContext.Provider value={context}>
      {props.children}
    </CSSDesignerContext.Provider>
  );
}

/**
 * Hook to access the state of the CSS designer, when within a CSSDesignerStateContextProvider.
 */
export function useCSSDesignerState(): [
  ContextType["state"],
  ContextType["setState"],
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
    return generateCSS(state.style, state.options);
  }, [state]);
}
