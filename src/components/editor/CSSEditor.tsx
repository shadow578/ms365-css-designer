import React, { useState } from "react";
import CLASSES, { type CSSClassName } from "./classes";
import type {
  CSSPropertyKindFor,
  CSSPropertyName,
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
import type { CSSClassPropertyDefinition } from ".";
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

  const addClass = (cls: CSSClassName) => {
    if (cls in state.style) {
      console.warn(`class ${cls} already exists.`);
      return;
    }

    state.style[cls] = {};
    setState({ ...state });
  };

  const removeClass = (cls: CSSClassName) => {
    if (!(cls in state.style)) {
      console.warn(`class ${cls} does not exist.`);
      return;
    }

    delete state.style[cls];
    setState({ ...state });
  };

  const addClassProperty = (cls: CSSClassName, prop: CSSPropertyName) => {
    if (!state.style[cls]) {
      console.warn(`class ${cls} does not exist.`);
      return;
    }
    if (prop in state.style[cls]) {
      console.warn(`property ${prop} already exists in class ${cls}.`);
      return;
    }

    const value = PROPERTIES[prop].defaultValue;
    assertCSSPropertyValue(prop, value);

    //@ts-expect-error -- FIXME figure this out some day
    state.style[cls][prop] = value;
    setState({ ...state });
  };

  const removeClassProperty = (cls: CSSClassName, prop: CSSPropertyName) => {
    if (!state.style[cls]) {
      console.warn(`class ${cls} does not exist.`);
      return;
    }
    if (!(prop in state.style[cls])) {
      console.warn(`property ${prop} does not exist in class ${cls}.`);
      return;
    }

    delete state.style[cls][prop];
    setState({ ...state });
  };

  const setClassProperty = <Tprop extends CSSPropertyName>(
    cls: CSSClassName,
    prop: Tprop,
    value: CSSPropertyValueTypeForProperty<Tprop>,
  ) => {
    if (!state.style[cls]) {
      console.warn(`class ${cls} does not exist.`);
      return;
    }
    if (!(prop in state.style[cls])) {
      console.warn(`property ${prop} does not exist in class ${cls}.`);
      return;
    }

    assertCSSPropertyValue(prop, value);

    //@ts-expect-error -- FIXME figure this out some day
    state.style[cls][prop] = value;
    setState({ ...state });
  };

  const selectableClasses = filterRecord(
    CLASSES,
    (_, cls) => !(cls in state.style),
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
              options={mapRecord(selectableClasses, (info) => info.displayName)}
              onSelect={addClass}
            >
              <IconButton label="Add CSS Class">
                <MdAdd />
              </IconButton>
            </SelectNewButton>
          </>
        }
      >
        <For
          each={Object.entries(state.style)}
          fallback={<EmptyState>No Classes Selected</EmptyState>}
        >
          {([cls, _]) => (
            <ClassEditor
              key={cls}
              targetClass={cls as CSSClassName}
              cssProps={state.style[cls as CSSClassName]!}
              onRemove={removeClass}
              addProperty={addClassProperty}
              removeProperty={removeClassProperty}
              setProperty={setClassProperty}
              debug={debugMode}
            ></ClassEditor>
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

function ClassEditor<Tcls extends CSSClassName>(props: {
  targetClass: Tcls;
  cssProps: CSSClassPropertyDefinition;
  onRemove?: (cls: CSSClassName) => void;
  addProperty?: (cls: Tcls, prop: CSSPropertyName) => void;
  removeProperty?: (cls: Tcls, prop: CSSPropertyName) => void;
  setProperty?: <TsetProp extends CSSPropertyName>(
    cls: Tcls,
    prop: TsetProp,
    value: CSSPropertyValueTypeForProperty<TsetProp>,
  ) => void;
  debug: boolean;
}) {
  const cls = CLASSES[props.targetClass];
  const availableProperties = filterRecord(PROPERTIES, (_, cssProp) =>
    (cls.properties as string[]).includes(cssProp),
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
          {props.debug ? `.${props.targetClass}` : cls.displayName}
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
              props.addProperty?.(props.targetClass, cssProp);
            }}
          >
            <IconButton label="Add Property">
              <MdAdd />
            </IconButton>
          </SelectNewButton>

          <IconButton
            label="Remove this Class"
            color="red.500"
            onClick={() => props.onRemove?.(props.targetClass)}
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
                props.targetClass,
                prop as CSSPropertyName,
                newValue,
              );
            }}
            remove={() => {
              props.removeProperty?.(
                props.targetClass,
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

function PropertyEditor<
  Tprop extends CSSPropertyName,
  Tkind extends CSSPropertyKindFor<Tprop>,
>(props: {
  targetProperty: Tprop;
  value: CSSPropertyValueTypeForProperty<Tprop>;
  setValue: (value: CSSPropertyValueTypeForProperty<Tprop>) => void;
  remove?: () => void;
  debug: boolean;
}) {
  // FIXME fix type wonkyness
  const prop = PROPERTIES[props.targetProperty];
  const ControlFn = CONTROLS[prop.kind]
    .component as unknown as ComponentFor<Tkind>;

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
          <ControlFn options={prop} value={props.value} onChange={props.setValue} />
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
