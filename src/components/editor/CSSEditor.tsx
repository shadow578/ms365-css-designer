import { useState } from "react";
import CLASSES, { type CSSClassName } from "./classes";
import type {
  CSSPropertyKindFor,
  CSSPropertyName,
  CSSPropertyValueTypeForProperty,
} from "./properties";
import SelectNewButton from "./editor/SelectNewButton";
import { filterRecord, mapRecord } from "~/util/util";
import { Box, Button, For, Heading } from "@chakra-ui/react";
import PROPERTIES from "./properties";
import CONTROLS, { type ComponentFor } from "./controls";

type CSSClassState = {
  [K in CSSPropertyName]?: CSSPropertyValueTypeForProperty<K>;
};

interface CSSEditorState {
  classes: Partial<Record<CSSClassName, CSSClassState>>;
}

export default function CSSEditor() {
  const [state, setState] = useState<CSSEditorState>({
    classes: {},
  });

  const addClass = (cls: CSSClassName) => {
    if (cls in state.classes) {
      console.warn(`class ${cls} already exists.`);
      return;
    }

    state.classes[cls] = {};
    setState({ ...state });
  };

  const removeClass = (cls: CSSClassName) => {
    if (!(cls in state.classes)) {
      console.warn(`class ${cls} does not exist.`);
      return;
    }

    delete state.classes[cls];
    setState({ ...state });
  };

  const addClassProperty = (cls: CSSClassName, prop: CSSPropertyName) => {
    if (!state.classes[cls]) {
      console.warn(`class ${cls} does not exist.`);
      return;
    }
    if (prop in state.classes[cls]) {
      console.warn(`property ${prop} already exists in class ${cls}.`);
      return;
    }

    //@ts-expect-error -- FIXME figure this out some day
    state.classes[cls][prop] = PROPERTIES[prop].defaultValue;
    setState({ ...state });
  };

  const removeClassProperty = (cls: CSSClassName, prop: CSSPropertyName) => {
    if (!state.classes[cls]) {
      console.warn(`class ${cls} does not exist.`);
      return;
    }
    if (!(prop in state.classes[cls])) {
      console.warn(`property ${prop} does not exist in class ${cls}.`);
      return;
    }

    delete state.classes[cls][prop];
    setState({ ...state });
  };

  const setClassProperty = <Tprop extends CSSPropertyName>(
    cls: CSSClassName,
    prop: Tprop,
    value: CSSPropertyValueTypeForProperty<Tprop>,
  ) => {
    if (!state.classes[cls]) {
      console.warn(`class ${cls} does not exist.`);
      return;
    }
    if (!(prop in state.classes[cls])) {
      console.warn(`property ${prop} does not exist in class ${cls}.`);
      return;
    }

    //@ts-expect-error -- FIXME figure this out some day
    state.classes[cls][prop] = value;
    setState({ ...state });
  };

  const selectableClasses = filterRecord(
    CLASSES,
    (_, cls) => !(cls in state.classes),
  );

  return (
    <Box width="50%">
      <SelectNewButton
        options={mapRecord(selectableClasses, (info) => info.displayName)}
        onSelect={addClass}
      >
        Add Class
      </SelectNewButton>

      <For each={Object.entries(state.classes)}>
        {([cls, _]) => (
          <ClassEditor
            key={cls}
            targetClass={cls as CSSClassName}
            cssProps={state.classes[cls as CSSClassName]!}
            onRemove={removeClass}
            addProperty={addClassProperty}
            removeProperty={removeClassProperty}
            setProperty={setClassProperty}
          ></ClassEditor>
        )}
      </For>

      <pre>{JSON.stringify(state, null, 2)}</pre>
    </Box>
  );
}

function ClassEditor<Tcls extends CSSClassName>(props: {
  targetClass: Tcls;
  cssProps: CSSClassState;
  onRemove?: (cls: CSSClassName) => void;
  addProperty?: (cls: Tcls, prop: CSSPropertyName) => void;
  removeProperty?: (cls: Tcls, prop: CSSPropertyName) => void;
  setProperty?: <TsetProp extends CSSPropertyName>(
    cls: Tcls,
    prop: TsetProp,
    value: CSSPropertyValueTypeForProperty<TsetProp>,
  ) => void;
}) {
  const availableProperties = filterRecord(PROPERTIES, (_, cssProp) =>
    (CLASSES[props.targetClass].properties as string[]).includes(cssProp),
  );

  const selectableProperties = filterRecord(
    availableProperties,
    (_, prop) => !(prop in props.cssProps),
  );

  return (
    <Box margin={4} borderWidth={2} borderColor="black">
      <Heading>Class {props.targetClass}</Heading>
      <Button onClick={() => props.onRemove?.(props.targetClass)}>
        Remove
      </Button>

      <SelectNewButton
        options={mapRecord(selectableProperties, (info) => info.displayName)}
        onSelect={(cssProp) => {
          props.addProperty?.(props.targetClass, cssProp);
        }}
      >
        Add Property
      </SelectNewButton>

      <For each={Object.entries(props.cssProps)}>
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
          ></PropertyEditor>
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
  const ControlFn = CONTROLS[PROPERTIES[props.targetProperty].kind]
    .component as ComponentFor<Tkind>;

  return (
    <Box margin={4} borderWidth={2} borderColor="black">
      <Heading>Property {props.targetProperty}</Heading>
      <Button onClick={props.remove}>Remove</Button>

      <ControlFn value={props.value} onChange={props.setValue}></ControlFn>
    </Box>
  );
}
