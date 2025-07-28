import { useState } from "react";
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
  Flex,
  For,
  Heading,
  IconButton,
  Text,
} from "@chakra-ui/react";
import PROPERTIES, { assertCSSPropertyValue } from "./properties";
import CONTROLS, { type ComponentFor } from "./controls";
import type { CSSClassPropertyDefinition } from ".";
import DeleteButton from "./editor/DeleteButton";
import AddButton from "./editor/AddButton";
import { MdBugReport, MdOutlineBugReport } from "react-icons/md";
import { useCSSEditorState, useGeneratedCSS } from "./context";
import EmptyState from "./editor/EmptyState";

export default function CSSEditor() {
  const [debugMode, setDebugMode] = useState(false);
  const [state, setState] = useCSSEditorState();
  const generatedCss = useGeneratedCSS();

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
    <Box padding={4} backgroundColor="green.100">
      <Box>
        <Flex>
          <Heading flex={1}>CSS Editor</Heading>

          <IconButton variant="ghost" onClick={() => setDebugMode(!debugMode)}>
            {debugMode ? <MdBugReport /> : <MdOutlineBugReport />}
          </IconButton>

          <SelectNewButton
            options={mapRecord(selectableClasses, (info) => info.displayName)}
            onSelect={addClass}
          >
            <AddButton />
          </SelectNewButton>
        </Flex>

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
            ></ClassEditor>
          )}
        </For>
      </Box>

      {debugMode && (
        <Box backgroundColor="red.100">
          <Heading>Debug View</Heading>
          <Box>
            <Heading size="md">State</Heading>
            <Code asChild>
              <pre>{JSON.stringify(state, null, 2)}</pre>
            </Code>
          </Box>

          <Box>
            <Heading size="md">Generated CSS</Heading>
            <Code asChild>
              <pre>{generatedCss}</pre>
            </Code>
          </Box>
        </Box>
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
    <Box backgroundColor="yellow.100" padding={2}>
      <Flex>
        <Heading flex={1}>{cls.displayName}</Heading>

        <SelectNewButton
          options={mapRecord(selectableProperties, (info) => info.displayName)}
          onSelect={(cssProp) => {
            props.addProperty?.(props.targetClass, cssProp);
          }}
        >
          <AddButton />
        </SelectNewButton>

        <DeleteButton onClick={() => props.onRemove?.(props.targetClass)} />
      </Flex>

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
          />
        )}
      </For>
    </Box>
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
}) {
  // FIXME fix type wonkyness
  const prop = PROPERTIES[props.targetProperty];
  const ControlFn = CONTROLS[prop.kind]
    .component as unknown as ComponentFor<Tkind>;

  return (
    <>
      <Text fontSize="sm">{prop.displayName}</Text>

      <Flex backgroundColor="blue.100" gap={2}>
        <Box flex={1} padding={2}>
          <ControlFn value={props.value} onChange={props.setValue} />
        </Box>
        <DeleteButton onClick={props.remove} />
      </Flex>
    </>
  );
}
