"use client";

import { createContext, useContext, useMemo } from "react";
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
  const [, setState] = useCSSDesignerState();

  const context: MutationContextType = useMemo(() => {
    return {
      addSelector(selector) {
        setState((prev) => {
          if (selector in prev.style) {
            throw new Error(
              `selector '${selector}' already present in style def.`,
            );
          }

          return {
            ...prev,
            style: {
              ...prev.style,
              [selector]: {},
            },
          };
        });
      },
      removeSelector(selector) {
        setState((prev) => {
          if (!(selector in prev.style)) {
            throw new Error(`selector '${selector}' not found in style def.`);
          }

          const { [selector]: _, ...style } = prev.style;
          return {
            ...prev,
            style,
          };
        });
      },
      addProperty(selector, prop) {
        setState((prev) => {
          if (!(selector in prev.style) || !prev.style[selector]) {
            throw new Error(`selector '${selector}' not found in style def.`);
          }
          if (prop in prev.style[selector]) {
            throw new Error(
              `property '${prop}' already present in selector '${selector}'.`,
            );
          }

          const value = PROPERTIES[prop].defaultValue;
          assertCSSPropertyValue(prop, value);

          return {
            ...prev,
            style: {
              ...prev.style,
              [selector]: {
                ...prev.style[selector],
                [prop]: value,
              },
            },
          };
        });
      },
      removeProperty(selector, prop) {
        setState((prev) => {
          if (!(selector in prev.style) || !prev.style[selector]) {
            throw new Error(`selector '${selector}' not found in style def.`);
          }
          if (!(prop in prev.style[selector])) {
            throw new Error(
              `property '${prop}' not found in selector '${selector}'.`,
            );
          }

          const { [prop]: _, ...rest } = prev.style[selector];

          return {
            ...prev,
            style: {
              ...prev.style,
              [selector]: rest,
            },
          };
        });
      },
      setProperty(selector, prop, value) {
        setState((prev) => {
          if (!(selector in prev.style) || !prev.style[selector]) {
            throw new Error(`selector '${selector}' not found in style def.`);
          }
          if (!(prop in prev.style[selector])) {
            throw new Error(
              `property '${prop}' not found in selector '${selector}'.`,
            );
          }

          assertCSSPropertyValue(prop, value);

          return {
            ...prev,
            style: {
              ...prev.style,
              [selector]: {
                ...prev.style[selector],
                [prop]: value,
              },
            },
          };
        });
      },
    };
  }, [setState]);

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
