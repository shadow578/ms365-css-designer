import { useEffect } from "react";
import type { DesignerState } from "../index";
import validateState from "./validateState";
import { useSearchParams } from "next/navigation";

function serializeState(state: DesignerState): string {
  const json = JSON.stringify(state);

  // note: the json string is base64 encoded here to avoid having to URL escape characters.
  // modern browsers only allow about 2k characters in the URL, so we need to ensure we keep it as short as possible.
  // having to encode one character into three characters is not the way to do that, thus base64.
  // this should be fine for the moment.
  return btoa(json);
}

function deserializeState(state: string): DesignerState {
  try {
    const json = atob(state);
    const stateUnknown = JSON.parse(json) as unknown;
    return validateState(stateUnknown) ?? { style: {} };
  } catch (e) {
    console.error("Failed to deserialize state:", e);
    return { style: {} };
  }
}

export function useGetSaveState(): DesignerState | undefined {
  const searchParams = useSearchParams();
  const s = searchParams?.get("s");

  // In app router, searchParams is always available, so ready is always true
  if (!s || typeof s !== "string") {
    return undefined;
  }

  return deserializeState(s)
}

export default function useSetSaveState(state: DesignerState) {
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
