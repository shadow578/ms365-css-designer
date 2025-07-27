import type { CSSProperties } from "./properties";

export interface CSSClass {
  displayName: string;
  properties: CSSProperties[];
}

const CLASSES = {
  "ext-button": {
    displayName: "UI Buttons",
    properties: ["background-color", "border-radius"],
  },
} satisfies Record<string, CSSClass>;
export default CLASSES;

export const ALL_CLASSES = Object.keys(CLASSES) as CSSProperties[];

export type CSSClasses = keyof typeof CLASSES;
