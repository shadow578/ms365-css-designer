import type { CSSPropertyName } from "./properties";

export interface CSSSelector {
  displayName: string;
  description: string;
  properties: CSSPropertyName[];
}

const margins = [
  "margin-top",
  "margin-bottom",
  "margin-right",
  "margin-left",
] as const;

const SELECTORS = {
  "*": {
    displayName: "All",
    description: "The universal selector applies to all elements",
    properties: ["color", "font-weight"],
  },

  //#region form
  ".ext-sign-in-box": {
    displayName: "Sign-in Box",
    description: "The main container of the sign-in form",
    properties: [
      "background-color",
      "border-radius",
      ...margins,
    ],
  },
  ".ext-banner-logo": {
    displayName: "Banner Logo",
    description: "The logo shown in the top of the form",
    properties: [...margins, "background-image"],
  },
  ".ext-title": {
    displayName: "Title",
    description: "The title of the form, e.g. 'Sign In' or 'Create Account'",
    properties: ["text-align", "font-weight", "color"],
  },
  ".ext-input": {
    displayName: "Input Fields",
    description: "All input fields in the form, e.g. 'Username' and 'Password'",
    properties: ["font-weight", "color", "border-radius"],
  },
  ".ext-error": {
    displayName: "Form Error",
    description: "The error message shown when the form is invalid",
    properties: ["font-weight", "color", "background-color"],
  },
  ".ext-boilerplate-text": {
    displayName: "Boilerplate Text",
    description: "The text shown below the form, configured in the admin panel",
    properties: ["text-align", "font-weight", "color", "background-color"],
  },
  //#endregion

  //#region buttons
  ".ext-button": {
    displayName: "Buttons",
    description: "All buttons below the form, e.g. 'Login' and 'Back'",
    properties: ["font-weight", "color", "background-color", "border-radius"],
  },
  ".ext-button.ext-primary": {
    displayName: "Primary Button",
    description: "The main button e.g. 'Login' or 'Next'",
    properties: ["font-weight", "color", "background-color", "border-radius"],
  },
  ".ext-button.ext-secondary": {
    displayName: "Secondary Button",
    description: "The secondary button e.g. 'Back' or 'Cancel'",
    properties: ["font-weight", "color", "background-color", "border-radius"],
  },
  //#endregion

  //#region background
  ".ext-background-image": {
    displayName: "Background Image",
    description: "The background image of the sign-in page",
    properties: [
      "background-image"
    ],
  },
  ".ext-background-overlay": {
    displayName: "Background Overlay",
    description: "The semi-transparent overlay on top of the background image",
    properties: ["background-color"],
  },
  //#endregion
} satisfies Record<string, CSSSelector>;
export default SELECTORS;

export const ALL_SELECTORS = Object.keys(SELECTORS) as CSSPropertyName[];

export type CSSSelectorName = keyof typeof SELECTORS;
