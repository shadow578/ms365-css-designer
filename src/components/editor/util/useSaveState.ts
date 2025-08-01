import { useRouter } from "next/router";
import { useEffect } from "react";
import type { EditorState } from "../index"
import validateState from "./validateState";

function serializeState(state: EditorState): string {
  return JSON.stringify(state);
}

function deserializeState(state: string): EditorState {
  try {
    const stateUnknown = JSON.parse(state) as unknown;
    return validateState(stateUnknown) ?? { style: {} };
  } catch (e) {
    console.error("Failed to deserialize state:", e);
    return { style: {} };
  }
}

export function useGetSaveState(): {
  state?: EditorState;
  ready: boolean;
} {
  const { query, isReady } = useRouter();
  if (!isReady) {
    return { ready: false };
  }

  return {
    ready: true,
    state: deserializeState(query.s),
  };
}

export default function useSetSaveState(state: EditorState) {
  useEffect(() => {
    // timer to avoid too many updates
    // otherwise, replaceState may throw a security error
    const timer = setTimeout(() => {
      const params = new URLSearchParams({ s: serializeState(state) });
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, "", newUrl);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [state]);
}
