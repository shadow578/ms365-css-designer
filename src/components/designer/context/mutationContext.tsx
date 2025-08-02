"use client";

import { createContext, useContext } from "react";
import { useCSSDesignerState } from "./stateContext";
import type { CSSSelectorName } from "../definitions/selectors";
import type {
  CSSPropertyName,
  CSSPropertyValueTypeForProperty,
} from "../definitions/properties";
import PROPERTIES, { assertCSSPropertyValue } from "../definitions/properties";

interface MutationContextType {
  addSelector: (selector: CSSSelectorName) => void;
  removeSelector: (selector: CSSSelectorName) => void;

  addProperty: <Tprop extends CSSPropertyName>(
    selector: CSSSelectorName,
    prop: Tprop,
  ) => void;
  removeProperty: (selector: CSSSelectorName, prop: CSSPropertyName) => void;
  setProperty: <Tprop extends CSSPropertyName>(
    selector: CSSSelectorName,
    prop: Tprop,
    value: CSSPropertyValueTypeForProperty<Tprop>,
  ) => void;
}

const MutationContext = createContext<MutationContextType | undefined>(
  undefined,
);

export default function CSSDesignerMutationContextProvider(props: {
  children: React.ReactNode;
}) {
  const [state, setState] = useCSSDesignerState();

  const context: MutationContextType = {
    addSelector(selector) {
      if (selector in state.style) {
        throw new Error(`selector '${selector}' already present in style def.`);
      }

      state.style[selector] = {};
      setState({ ...state });
    },
    removeSelector(selector) {
      if (!(selector in state.style)) {
        throw new Error(`selector '${selector}' not found in style def.`);
      }

      delete state.style[selector];
      setState({ ...state });
    },
    addProperty(selector, prop) {
      if (!(selector in state.style) || !state.style[selector]) {
        throw new Error(`selector '${selector}' not found in style def.`);
      }
      if (prop in state.style[selector]) {
        throw new Error(
          `property '${prop}' already present in selector '${selector}'.`,
        );
      }

      const value = PROPERTIES[prop].defaultValue;
      assertCSSPropertyValue(prop, value);

      //@ts-expect-error -- FIXME figure this out some day
      state.style[selector][prop] = value;
      setState({ ...state });
    },
    removeProperty(selector, prop) {
      if (!(selector in state.style) || !state.style[selector]) {
        throw new Error(`selector '${selector}' not found in style def.`);
      }
      if (!(prop in state.style[selector])) {
        throw new Error(
          `property '${prop}' not found in selector '${selector}'.`,
        );
      }

      delete state.style[selector][prop];
      setState({ ...state });
    },
    setProperty(selector, prop, value) {
      if (!(selector in state.style) || !state.style[selector]) {
        throw new Error(`selector '${selector}' not found in style def.`);
      }
      if (!(prop in state.style[selector])) {
        throw new Error(
          `property '${prop}' not found in selector '${selector}'.`,
        );
      }

      assertCSSPropertyValue(prop, value);

      //@ts-expect-error -- FIXME figure this out some day
      state.style[selector][prop] = value;
      setState({ ...state });
    },
  };

  return (
    <MutationContext.Provider value={context}>
      {props.children}
    </MutationContext.Provider>
  );
}

/**
 * use css designer mutation functions
 */
export function useCSSDesignerMutation() {
  const context = useContext(MutationContext);

  if (!context) {
    throw new Error(
      "useCSSDesignerMutation must be used within a CSSDesignerMutationContextProvider",
    );
  }

  return context;
}
