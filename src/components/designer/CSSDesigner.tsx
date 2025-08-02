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
import { Box, Button, Code, Flex, For, Heading, Text } from "@chakra-ui/react";
import PROPERTIES from "./definitions/properties";
import CONTROLS, { type ComponentFor } from "./components/controls";
import type { CSSSelectorPropertyDefinition } from "./definitions";
import {
  MdAdd,
  MdBugReport,
  MdDelete,
  MdOutlineBugReport,
} from "react-icons/md";
import { useCSSDesignerState, useGeneratedCSS } from ".";
import EmptyState from "./components/EmptyState";
import IconButton from "./components/IconButton";
import ContentBox from "./components/ContentBox";
import useKeycode, { KONAMI_CODE } from "~/util/useKeycode";
import { useCSSDesignerMutation } from "./context/mutationContext";
import DownloadButton from "./components/DownloadButton";

export default function CSSDesigner() {
  const showDebugButton = useKeycode(KONAMI_CODE);
  const [debugMode, setDebugMode] = useState(false);

  const [state] = useCSSDesignerState();
  const { addSelector } = useCSSDesignerMutation();

  const generatedCss = useGeneratedCSS();

  const selectableSelectors = filterRecord(
    SELECTORS,
    (_, s) => !(s in state.style),
  );

  const SelectSelectorButton = (cprops: { children: React.ReactNode }) => (
    <SelectNewButton
      options={mapRecord(selectableSelectors, (info) => info.displayName)}
      onSelect={addSelector}
    >
      {cprops.children}
    </SelectNewButton>
  );

  return (
    <Box padding={4}>
      <ContentBox
        header={<Heading>CSS Designer</Heading>}
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

            <SelectSelectorButton>
              <IconButton label="Add Selector">
                <MdAdd />
              </IconButton>
            </SelectSelectorButton>
          </>
        }
      >
        <For
          each={Object.entries(state.style)}
          fallback={
            <EmptyState
              title={"No Selectors Added"}
              action={
                <SelectSelectorButton>
                  <Button variant="outline">
                    <MdAdd />
                    Add Selector
                  </Button>
                </SelectSelectorButton>
              }
            />
          }
        >
          {([selector, _]) => (
            <SelectorDesigner
              key={selector}
              selector={selector as CSSSelectorName}
              CSSProperties={state.style[selector as CSSSelectorName]!}
              debug={debugMode}
            ></SelectorDesigner>
          )}
        </For>
      </ContentBox>

      {debugMode && (
        <ContentBox outline collapsible header={"Debug View"}>
          <ContentBox outline header={"State"}>
            <Code asChild width="100%">
              <pre>{JSON.stringify(state, null, 2)}</pre>
            </Code>
          </ContentBox>

          <ContentBox outline header={"Generated CSS"}>
            <Code asChild width="100%">
              <pre>{generatedCss}</pre>
            </Code>
          </ContentBox>
        </ContentBox>
      )}
    </Box>
  );
}

function SelectorDesigner<Tsel extends CSSSelectorName>(props: {
  selector: Tsel;
  CSSProperties: CSSSelectorPropertyDefinition;
  debug: boolean;
}) {
  const { removeSelector, addProperty } = useCSSDesignerMutation();

  const selector = SELECTORS[props.selector];
  const availableProperties = filterRecord(PROPERTIES, (_, cssProp) =>
    (selector.properties as string[]).includes(cssProp),
  );

  const selectableProperties = filterRecord(
    availableProperties,
    (_, prop) => !(prop in props.CSSProperties),
  );

  const SelectPropertyButton = (cprops: { children: React.ReactNode }) => (
    <SelectNewButton
      options={mapRecord(selectableProperties, (info) => info.displayName)}
      onSelect={(cssProp) => {
        addProperty?.(props.selector, cssProp);
      }}
    >
      {cprops.children}
    </SelectNewButton>
  );

  return (
    <ContentBox
      outline
      collapsible
      header={
        <Text fontSize="lg" fontWeight="bold">
          {props.debug ? `${props.selector}` : selector.displayName}
        </Text>
      }
      buttons={
        <>
          <SelectPropertyButton>
            <IconButton label="Add Property">
              <MdAdd />
            </IconButton>
          </SelectPropertyButton>

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
        fallback={
          <EmptyState
            title="No Properties Added"
            action={
              <SelectPropertyButton>
                <Button variant="outline">
                  <MdAdd />
                  Add Property
                </Button>
              </SelectPropertyButton>
            }
          />
        }
      >
        {([prop, value]) => (
          <PropertyDesigner
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

function PropertyDesigner<Tprop extends CSSPropertyName>(props: {
  selector: CSSSelectorName;
  property: Tprop;
  value: CSSPropertyValueTypeForProperty<Tprop>;
  debug: boolean;
}) {
  const { removeProperty, setProperty } = useCSSDesignerMutation();

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
      collapsible
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
