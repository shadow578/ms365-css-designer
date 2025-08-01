"use client";

import {CSSEditorContextProvider, CSSEditor} from "~/components/editor";

export default function ConvergedSignInPage() {
  return (
    <CSSEditorContextProvider>
      <CSSEditor />;
    </CSSEditorContextProvider>
  );
}
