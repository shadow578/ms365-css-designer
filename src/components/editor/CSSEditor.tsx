import React, { useState } from "react";
import SELECTORS, { type CSSSelectorName } from "./definitions/selectors";
import type {
  CSSPropertyKindFor,
  CSSPropertyName,
  CSSPropertyOptionsForKind,
  CSSPropertyValueTypeForProperty,
} from "./definitions/properties";
import SelectNewButton from "./components/SelectNewButton";
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
import PROPERTIES from "./definitions/properties";
import CONTROLS, { type ComponentFor } from "./components/controls";
import type { CSSSelectorPropertyDefinition } from "./definitions";
import {
  MdAdd,
  MdBugReport,
  MdDelete,
  MdDownload,
  MdOutlineBugReport,
} from "react-icons/md";
import { useCSSEditorState, useGeneratedCSS } from ".";
import EmptyState from "./components/EmptyState";
import IconButton from "./components/IconButton";
import ContentBox from "./components/ContentBox";
import useKeycode, { KONAMI_CODE } from "~/util/useKeycode";
import { useCSSEditorMutation } from "./context/mutationContext";

export default function CSSEditor() {
  const showDebugButton = useKeycode(KONAMI_CODE);
  const [debugMode, setDebugMode] = useState(false);

  const [state] = useCSSEditorState();
  const { addSelector } = useCSSEditorMutation();

  const generatedCss = useGeneratedCSS();

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
              selector={selector as CSSSelectorName}
              CSSProperties={state.style[selector as CSSSelectorName]!}
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
  selector: Tsel;
  CSSProperties: CSSSelectorPropertyDefinition;
  debug: boolean;
}) {
  const { removeSelector, addProperty } = useCSSEditorMutation();

  const selector = SELECTORS[props.selector];
  const availableProperties = filterRecord(PROPERTIES, (_, cssProp) =>
    (selector.properties as string[]).includes(cssProp),
  );

  const selectableProperties = filterRecord(
    availableProperties,
    (_, prop) => !(prop in props.CSSProperties),
  );

  return (
    <ContentBox
      outline
      header={
        <Text fontSize="lg" fontWeight="bold">
          {props.debug ? `${props.selector}` : selector.displayName}
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
              addProperty?.(props.selector, cssProp);
            }}
          >
            <IconButton label="Add Property">
              <MdAdd />
            </IconButton>
          </SelectNewButton>

          <IconButton
            label="Remove this Selector"
            color="red.500"
            onClick={() => removeSelector(props.selector)}
          >
            <MdDelete />
          </IconButton>
        </>
      }
    >
      <For
        each={Object.entries(props.CSSProperties)}
        fallback={<EmptyState>No Properties Selected</EmptyState>}
      >
        {([prop, value]) => (
          <PropertyEditor
            key={prop}
            selector={props.selector}
            property={prop as CSSPropertyName}
            value={value}
            debug={props.debug}
          />
        )}
      </For>
    </ContentBox>
  );
}

function PropertyEditor<Tprop extends CSSPropertyName>(props: {
  selector: CSSSelectorName;
  property: Tprop;
  value: CSSPropertyValueTypeForProperty<Tprop>;
  debug: boolean;
}) {
  const { removeProperty, setProperty } = useCSSEditorMutation();

  const prop = PROPERTIES[props.property];
  const ControlFn = CONTROLS[prop.kind]?.component as ComponentFor<
    CSSPropertyKindFor<Tprop>
  >;
  if (!ControlFn) {
    throw new Error(`don't know how to render control for kind '${prop.kind}'`);
  }

  return (
    <ContentBox
      outline
      header={
        <Text fontSize="md">
          {props.debug ? `${props.property} (${prop.kind})` : prop.displayName}
        </Text>
      }
      buttons={
        <IconButton
          label="Remove this Property"
          color="red.500"
          onClick={() => removeProperty(props.selector, props.property)}
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
            onChange={(value) =>
              setProperty(props.selector, props.property, value)
            }
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
