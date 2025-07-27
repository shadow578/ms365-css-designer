import { createContext, useContext, useMemo, useState } from "react";
import type { CSSStyleDefinition } from ".";
import generateCSS from "./generator";

interface EditorState {
  style: CSSStyleDefinition;
}

interface ContextType {
  state: EditorState;
  setState: (state: EditorState) => void;
}

const CSSEditorContext = createContext<ContextType | undefined>(undefined);

/**
 * Provide the context for the CSS editor state.
 */
export default function CSSEditorContextProvider(props: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<EditorState>({
    style: {},
  });

  return (
    <CSSEditorContext.Provider value={{ state, setState }}>
      {props.children}
    </CSSEditorContext.Provider>
  );
}

/**
 * Hook to access the state of the CSS editor, when within a CSSEditorContextProvider.
 */
export function useCSSEditorState(): [
  EditorState,
  (state: EditorState) => void,
] {
  const context = useContext(CSSEditorContext);
  if (!context) {
    throw new Error(
      "useCSSEditorState must be used within a CSSEditorContextProvider",
    );
  }

  return [context.state, context.setState];
}

/**
 * Hook to access the generated CSS from the current state of the CSS editor.
 */
export function useGeneratedCSS() {
  const [state] = useCSSEditorState();

  return useMemo(() => {
    return generateCSS(state.style);
  }, [state]);
}
