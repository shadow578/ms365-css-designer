"use client";

import { createContext, useContext, useMemo, useRef } from "react";
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
  const stateRef = useRef(state);

  const context: MutationContextType = useMemo(() => {

    // FIXME this is a quick hack to make other memo hooks work correctly
    // ASAP this should be changed to do a proper state update instead of crappy mutation
    const setStateW = (newState: typeof state) => {
      setState(structuredClone(newState));
    };

    return {
      addSelector(selector) {
        const s = stateRef.current;

        if (selector in s.style) {
          throw new Error(
            `selector '${selector}' already present in style def.`,
          );
        }

        s.style[selector] = {};
        setStateW({ ...s });
      },
      removeSelector(selector) {
        const s = stateRef.current;

        if (!(selector in s.style)) {
          throw new Error(`selector '${selector}' not found in style def.`);
        }

        delete s.style[selector];
        setStateW({ ...s });
      },
      addProperty(selector, prop) {
        const s = stateRef.current;

        if (!(selector in s.style) || !s.style[selector]) {
          throw new Error(`selector '${selector}' not found in style def.`);
        }
        if (prop in s.style[selector]) {
          throw new Error(
            `property '${prop}' already present in selector '${selector}'.`,
          );
        }

        const value = PROPERTIES[prop].defaultValue;
        assertCSSPropertyValue(prop, value);

        //@ts-expect-error -- FIXME figure this out some day
        s.style[selector][prop] = value;
        setStateW({ ...s });
      },
      removeProperty(selector, prop) {
        const s = stateRef.current;
        if (!(selector in s.style) || !s.style[selector]) {
          throw new Error(`selector '${selector}' not found in style def.`);
        }
        if (!(prop in s.style[selector])) {
          throw new Error(
            `property '${prop}' not found in selector '${selector}'.`,
          );
        }

        delete s.style[selector][prop];
        setStateW({ ...s });
      },
      setProperty(selector, prop, value) {
        const s = stateRef.current;

        if (!(selector in s.style) || !s.style[selector]) {
          throw new Error(`selector '${selector}' not found in style def.`);
        }
        if (!(prop in s.style[selector])) {
          throw new Error(
            `property '${prop}' not found in selector '${selector}'.`,
          );
        }

        assertCSSPropertyValue(prop, value);

        //@ts-expect-error -- FIXME figure this out some day
        s.style[selector][prop] = value;
        setStateW({ ...s });
      },
    };
  }, [stateRef, setState]);

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
