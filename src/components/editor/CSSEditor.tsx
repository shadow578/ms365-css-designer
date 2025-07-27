import { useState } from "react";
import CLASSES, { type CSSClassName } from "./classes";
import type {
  CSSProperties,
  CSSPropertyValueTypeForProperty,
} from "./properties";
import SelectNewButton from "./editor/SelectNewButton";
import { filterRecord, mapRecord } from "~/util/util";
import { Box, Button, For, Heading } from "@chakra-ui/react";

type CSSClassState = {
  [K in CSSProperties]: CSSPropertyValueTypeForProperty<K>;
};

interface CSSEditorState {
  classes: Partial<Record<CSSClassName, Partial<CSSClassState>>>;
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

  const selectableClasses = filterRecord(
    CLASSES,
    (_, cls) => !(cls in state.classes),
  );

  return (
    <>
      <SelectNewButton
        options={mapRecord(selectableClasses, (info) => info.displayName)}
        onSelect={addClass}
      >
        Add Class
      </SelectNewButton>

      <For each={Object.entries(state.classes)}>
        {([cls, _]) => (
          <ClassEditor
            targetClass={cls as CSSClassName}
            onRemove={removeClass}
          ></ClassEditor>
        )}
      </For>

      <pre>{JSON.stringify(state, null, 2)}</pre>
    </>
  );
}

function ClassEditor(props: {
  targetClass: CSSClassName;
  onRemove: (cls: CSSClassName) => void;
}) {
  return (
    <Box margin={4} borderWidth={2} borderColor="black">
      <Heading>Class {props.targetClass}</Heading>
      <Button onClick={() => props.onRemove(props.targetClass)}>Remove</Button>
    </Box>
  );
}
