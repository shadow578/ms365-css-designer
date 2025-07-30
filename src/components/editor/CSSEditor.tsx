import React, { useState } from "react";
import SELECTORS, { type CSSSelectorName } from "./selectors";
import type {
  CSSPropertyKindFor,
  CSSPropertyName,
  CSSPropertyOptionsForKind,
  CSSPropertyValueTypeForProperty,
} from "./properties";
import SelectNewButton from "./editor/SelectNewButton";
import { filterRecord, mapRecord } from "~/util/util";
import {
  Box,
  Code,
  DownloadTrigger,
  Flex,
  For,
  Heading,
  Text,
} from "@chakra-ui/react";
import PROPERTIES, { assertCSSPropertyValue } from "./properties";
import CONTROLS, { type ComponentFor } from "./controls";
import type { CSSSelectorPropertyDefinition } from ".";
import {
  MdAdd,
  MdBugReport,
  MdDelete,
  MdDownload,
  MdOutlineBugReport,
} from "react-icons/md";
import { useCSSEditorState, useGeneratedCSS } from "./context";
import EmptyState from "./editor/EmptyState";
import IconButton from "./editor/IconButton";
import ContentBox from "./editor/ContentBox";
import useKeycode, { KONAMI_CODE } from "~/util/useKeycode";
import useQueryParams from "~/util/useQueryParams";

export default function CSSEditor() {
  const showDebugButton = useKeycode(KONAMI_CODE);
  const [debugMode, setDebugMode] = useState(false);

  const [state, setState] = useCSSEditorState();
  const generatedCss = useGeneratedCSS();

  useQueryParams({
    state: JSON.stringify(state.style),
  });

  const addSelector = (selector: CSSSelectorName) => {
    if (selector in state.style) {
      console.warn(`selector ${selector} already exists.`);
      return;
    }

    state.style[selector] = {};
    setState({ ...state });
  };

  const removeSelector = (selector: CSSSelectorName) => {
    if (!(selector in state.style)) {
      console.warn(`selector ${selector} does not exist.`);
      return;
    }

    delete state.style[selector];
    setState({ ...state });
  };

  const addSelectorProperty = (
    selector: CSSSelectorName,
    prop: CSSPropertyName,
  ) => {
    if (!state.style[selector]) {
      console.warn(`selector ${selector} does not exist.`);
      return;
    }
    if (prop in state.style[selector]) {
      console.warn(`property ${prop} already exists in selector ${selector}.`);
      return;
    }

    const value = PROPERTIES[prop].defaultValue;
    assertCSSPropertyValue(prop, value);

    //@ts-expect-error -- FIXME figure this out some day
    state.style[selector][prop] = value;
    setState({ ...state });
  };

  const removeSelectorProperty = (
    selector: CSSSelectorName,
    prop: CSSPropertyName,
  ) => {
    if (!state.style[selector]) {
      console.warn(`selector ${selector} does not exist.`);
      return;
    }
    if (!(prop in state.style[selector])) {
      console.warn(`property ${prop} does not exist in selector ${selector}.`);
      return;
    }

    delete state.style[selector][prop];
    setState({ ...state });
  };

  const setSelectorProperty = <Tprop extends CSSPropertyName>(
    selector: CSSSelectorName,
    prop: Tprop,
    value: CSSPropertyValueTypeForProperty<Tprop>,
  ) => {
    if (!state.style[selector]) {
      console.warn(`selector ${selector} does not exist.`);
      return;
    }
    if (!(prop in state.style[selector])) {
      console.warn(`property ${prop} does not exist in selector ${selector}.`);
      return;
    }

    assertCSSPropertyValue(prop, value);

    //@ts-expect-error -- FIXME figure this out some day
    state.style[selector][prop] = value;
    setState({ ...state });
  };

  const selectableSelectors = filterRecord(
    SELECTORS,
    (_, s) => !(s in state.style),
  );

  return (
    <Box padding={4}>
      <ContentBox
        header={<Heading>CSS Editor</Heading>}
        buttons={
          <>
            {showDebugButton && (
              <IconButton
                label={debugMode ? "Disable Debug Mode" : "Enable Debug Mode"}
                onClick={() => setDebugMode(!debugMode)}
              >
                {debugMode ? <MdBugReport /> : <MdOutlineBugReport />}
              </IconButton>
            )}

            <DownloadButton />

            <SelectNewButton
              options={mapRecord(
                selectableSelectors,
                (info) => info.displayName,
              )}
              onSelect={addSelector}
            >
              <IconButton label="Add CSS Selector">
                <MdAdd />
              </IconButton>
            </SelectNewButton>
          </>
        }
      >
        <For
          each={Object.entries(state.style)}
          fallback={<EmptyState>No Selector Selected</EmptyState>}
        >
          {([selector, _]) => (
            <SelectorEditor
              key={selector}
              targetSelector={selector as CSSSelectorName}
              cssProps={state.style[selector as CSSSelectorName]!}
              onRemove={removeSelector}
              addProperty={addSelectorProperty}
              removeProperty={removeSelectorProperty}
              setProperty={setSelectorProperty}
              debug={debugMode}
            ></SelectorEditor>
          )}
        </For>
      </ContentBox>

      {debugMode && (
        <ContentBox header={"Debug View"} outline>
          <ContentBox header={"State"} outline>
            <Code asChild width="100%">
              <pre>{JSON.stringify(state, null, 2)}</pre>
            </Code>
          </ContentBox>

          <ContentBox header={"Generated CSS"} outline>
            <Code asChild width="100%">
              <pre>{generatedCss}</pre>
            </Code>
          </ContentBox>
        </ContentBox>
      )}
    </Box>
  );
}

function SelectorEditor<Tsel extends CSSSelectorName>(props: {
  targetSelector: Tsel;
  cssProps: CSSSelectorPropertyDefinition;
  onRemove?: (selector: CSSSelectorName) => void;
  addProperty?: (selector: Tsel, prop: CSSPropertyName) => void;
  removeProperty?: (selector: Tsel, prop: CSSPropertyName) => void;
  setProperty?: <TsetProp extends CSSPropertyName>(
    selector: Tsel,
    prop: TsetProp,
    value: CSSPropertyValueTypeForProperty<TsetProp>,
  ) => void;
  debug: boolean;
}) {
  const selector = SELECTORS[props.targetSelector];
  const availableProperties = filterRecord(PROPERTIES, (_, cssProp) =>
    (selector.properties as string[]).includes(cssProp),
  );

  const selectableProperties = filterRecord(
    availableProperties,
    (_, prop) => !(prop in props.cssProps),
  );

  return (
    <ContentBox
      outline
      header={
        <Text fontSize="lg" fontWeight="bold">
          {props.debug ? `.${props.targetSelector}` : selector.displayName}
        </Text>
      }
      buttons={
        <>
          <SelectNewButton
            options={mapRecord(
              selectableProperties,
              (info) => info.displayName,
            )}
            onSelect={(cssProp) => {
              props.addProperty?.(props.targetSelector, cssProp);
            }}
          >
            <IconButton label="Add Property">
              <MdAdd />
            </IconButton>
          </SelectNewButton>

          <IconButton
            label="Remove this Selector"
            color="red.500"
            onClick={() => props.onRemove?.(props.targetSelector)}
          >
            <MdDelete />
          </IconButton>
        </>
      }
    >
      <For
        each={Object.entries(props.cssProps)}
        fallback={<EmptyState>No Properties Selected</EmptyState>}
      >
        {([prop, value]) => (
          <PropertyEditor
            key={prop}
            targetProperty={prop as CSSPropertyName}
            value={value}
            setValue={(newValue) => {
              props.setProperty?.(
                props.targetSelector,
                prop as CSSPropertyName,
                newValue,
              );
            }}
            remove={() => {
              props.removeProperty?.(
                props.targetSelector,
                prop as CSSPropertyName,
              );
            }}
            debug={props.debug}
          />
        )}
      </For>
    </ContentBox>
  );
}

function PropertyEditor<Tprop extends CSSPropertyName>(props: {
  targetProperty: Tprop;
  value: CSSPropertyValueTypeForProperty<Tprop>;
  setValue: (value: CSSPropertyValueTypeForProperty<Tprop>) => void;
  remove?: () => void;
  debug: boolean;
}) {
  // FIXME fix type wonkyness in this function
  const prop = PROPERTIES[props.targetProperty];
  const ControlFn = CONTROLS[prop.kind].component as unknown as ComponentFor<
    CSSPropertyKindFor<Tprop>
  >;

  return (
    <ContentBox
      outline
      header={
        <Text fontSize="md">
          {props.debug ? props.targetProperty : prop.displayName}
        </Text>
      }
      buttons={
        <IconButton
          label="Remove this Property"
          color="red.500"
          onClick={props.remove}
        >
          <MdDelete />
        </IconButton>
      }
    >
      <Flex gap={2}>
        <Box flex={1} padding={2}>
          <ControlFn
            options={
              prop as unknown as CSSPropertyOptionsForKind<
                CSSPropertyKindFor<Tprop>
              >
            }
            value={props.value}
            onChange={props.setValue}
          />
        </Box>
      </Flex>
    </ContentBox>
  );
}

function DownloadButton() {
  const css = useGeneratedCSS();

  return (
    <DownloadTrigger
      data={css}
      fileName="style.css"
      mimeType="text/css"
      asChild
    >
      <IconButton label="Download CSS">
        <MdDownload />
      </IconButton>
    </DownloadTrigger>
  );
}
