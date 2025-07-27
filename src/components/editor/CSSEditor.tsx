import { useState } from "react";
import { type CSSClasses } from "./classes";
import type {
  CSSProperties,
  CSSPropertyValueTypeForProperty,
} from "./properties";

type CSSClassState = {
  [K in CSSProperties]: CSSPropertyValueTypeForProperty<K>;
};

type CSSEditorState = Partial<Record<CSSClasses, Partial<CSSClassState>>>;

export default function CSSEditor() {
  const [state, setState] = useState<CSSEditorState>({});

  return <></>;
}
