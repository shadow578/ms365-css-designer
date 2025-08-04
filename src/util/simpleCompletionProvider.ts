import type { Monaco } from "@monaco-editor/react";

export interface SimpleCompletionItem {
  label: string;
  insertText: string;
  detail?: string;
  documentation?: string;
}

export default function registerSimpleCSSClassCompletionProvider(
  monaco: Monaco,
  suggestionsFn: () => SimpleCompletionItem[],
) {
  monaco.languages.registerCompletionItemProvider("css", {
    provideCompletionItems(model, position) {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      return {
        suggestions: suggestionsFn().map((item) => ({
          label: item.label,
          kind: monaco.languages.CompletionItemKind.Class,
          insertText: item.insertText,
          detail: item.detail,
          documentation: item.documentation,
          range: range,
        })),
      };
    },
  });
}
