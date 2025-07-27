"use client";

import CSSEditorContextProvider from "~/components/editor/context";
import CSSEditor from "~/components/editor/CSSEditor";

export default function ConvergedSignInPage() {
  return (
    <CSSEditorContextProvider>
      <CSSEditor />;
    </CSSEditorContextProvider>
  );
}
