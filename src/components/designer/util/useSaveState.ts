import { useEffect } from "react";
import { DEFAULT_DESIGNER_OPTIONS, type DesignerState } from "../index";
import { useSearchParams } from "next/navigation";
import { transform } from "~/util/zodExtras";
import z from "zod";
import SELECTORS, { ALL_SELECTORS } from "../definitions/selectors";
import PROP_SCHEMA_BY_KIND from "../definitions/kinds";
import PROPERTIES from "../definitions/properties";

export const DESIGNER_STATE_SCHEMA = (() => {
  return z.object({
    options: z
      .object({
        important: z.boolean().optional(),
        includeAdditionalSelectors: z.boolean().optional(),
      })
      .optional(),
    style: z.object(
      Object.fromEntries(
        ALL_SELECTORS.map((selector) => [
          selector,
          z
            .object(
              Object.fromEntries(
                SELECTORS[selector].properties.map((property) => [
                  property,
                  PROP_SCHEMA_BY_KIND[PROPERTIES[property].kind].optional(),
                ]),
              ),
            )
            .optional(),
        ]),
      ),
    ),
  });
})();

function serializeState(state: DesignerState): string {
  const json = JSON.stringify(state);

  // note: the json string is base64 encoded here to avoid having to URL escape characters.
  // modern browsers only allow about 2k characters in the URL, so we need to ensure we keep it as short as possible.
  // having to encode one character into three characters is not the way to do that, thus base64.
  // this should be fine for the moment.
  return btoa(json);
}

function deserializeState(state: string): DesignerState {
  const fallback = { style: {}, options: DEFAULT_DESIGNER_OPTIONS };

  try {
    const json = atob(state);
    const stateUnknown = JSON.parse(json) as unknown;

    const parsedState = transform(DESIGNER_STATE_SCHEMA, stateUnknown);
    if (!parsedState) return fallback;

    parsedState.options ??= DEFAULT_DESIGNER_OPTIONS;
    if (!parsedState.options) throw new Error("options is undefined");

    return parsedState as DesignerState;
  } catch (e) {
    console.error("deserializeState failed:", e);
    return fallback;
  }
}

export function useGetSaveState(): DesignerState | undefined {
  const searchParams = useSearchParams();
  const s = searchParams?.get("s");

  // In app router, searchParams is always available, so ready is always true
  if (!s || typeof s !== "string") {
    return undefined;
  }

  return deserializeState(s);
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
