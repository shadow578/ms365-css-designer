import React, { useCallback, useMemo } from "react";
import SELECTORS, {
  type CSSSelector,
  type CSSSelectorName,
} from "./definitions/selectors";
import type {
  CSSPropertyKindFor,
  CSSPropertyName,
  CSSPropertyOptionsForKind,
  CSSPropertyValueTypeForProperty,
} from "./definitions/properties";
import SelectNewButton, {
  type SelectNewButtonChildren,
} from "./components/SelectNewButton";
import { filterRecord, mapRecord } from "~/util/util";
import { Box, Button, Code, Flex, For, Text } from "@chakra-ui/react";
import PROPERTIES from "./definitions/properties";
import CONTROLS, { type ComponentFor } from "./components/controls";
import type { CSSSelectorPropertyDefinition } from "./definitions";
import { MdAdd, MdDelete } from "react-icons/md";
import { useCSSDesignerState, useGeneratedCSS } from ".";
import EmptyState from "./components/EmptyState";
import IconButton from "../IconButton";
import ContentBox from "../ContentBox";
import { useCSSDesignerMutation } from "./context/mutationContext";
import { useTranslations } from "next-intl";
import useDesignerTranslations from "./i18n";

export function CSSDesignerAddSelectorButton(props: {
  children: SelectNewButtonChildren;
}) {
  const [state] = useCSSDesignerState();
  const { addSelector } = useCSSDesignerMutation();

  const { tSelector } = useDesignerTranslations();

  const selectOptions = useMemo(() => {
    let selectableSelectors = filterRecord(
      SELECTORS,
      (_, s) => !(s in state.style),
    );

    if (state.options?.onlySpecCompliant) {
      selectableSelectors = filterRecord(
        selectableSelectors,
        (def: CSSSelector) => def.specCompliant !== false,
      );
    }

    return mapRecord(selectableSelectors, (_, sel) => tSelector(sel));
  }, [state.style, state.options, tSelector]);

  return (
    <SelectNewButton options={selectOptions} onSelect={addSelector}>
      {props.children}
    </SelectNewButton>
  );
}

function CSSDesignerDebugView() {
  const [state] = useCSSDesignerState();

  const generatedCss = useGeneratedCSS();

  return (
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
  );
}

export default function CSSDesigner(props: { debug?: boolean }) {
  const [state] = useCSSDesignerState();

  const t = useTranslations("CSSDesigner");

  return (
    <Box>
      <For
        each={Object.entries(state.style)}
        fallback={
          <EmptyState
            title={t("selector.empty.message")}
            action={
              <CSSDesignerAddSelectorButton>
                <Button variant="outline">
                  <MdAdd />
                  {t("selector.empty.action")}
                </Button>
              </CSSDesignerAddSelectorButton>
            }
          />
        }
      >
        {([selector, _]) => (
          <SelectorDesigner
            key={selector}
            selector={selector as CSSSelectorName}
            CSSProperties={state.style[selector as CSSSelectorName]!}
            debug={props.debug ?? false}
          ></SelectorDesigner>
        )}
      </For>

      {props.debug && <CSSDesignerDebugView />}
    </Box>
  );
}

const SelectorDesigner = React.memo(
  <Tsel extends CSSSelectorName>(props: {
    selector: Tsel;
    CSSProperties: CSSSelectorPropertyDefinition;
    debug: boolean;
  }) => {
    const { removeSelector, addProperty } = useCSSDesignerMutation();

    const t = useTranslations("CSSDesigner.selector");
    const tp = useTranslations("CSSDesigner.property");

    const { tSelector, tProperty } = useDesignerTranslations();

    const selectableProperties = useMemo(() => {
      const selector = SELECTORS[props.selector];
      const availableProperties = filterRecord(PROPERTIES, (_, cssProp) =>
        (selector.properties as string[]).includes(cssProp),
      );

      return filterRecord(
        availableProperties,
        (_, prop) => !(prop in props.CSSProperties),
      );
    }, [props.CSSProperties, props.selector]);

    const SelectPropertyButton = useCallback(
      (cprops: { children: SelectNewButtonChildren }) => (
        <SelectNewButton
          options={mapRecord(selectableProperties, (_, sel) => tProperty(sel))}
          onSelect={(cssProp) => {
            addProperty?.(props.selector, cssProp);
          }}
        >
          {cprops.children}
        </SelectNewButton>
      ),
      [tProperty, addProperty, props.selector, selectableProperties],
    );

    const children = useMemo(() => {
      const properties = Object.entries(props.CSSProperties);

      if (properties.length === 0) {
        return (
          <EmptyState
            title={tp("empty.message")}
            action={
              <SelectPropertyButton>
                <Button variant="outline">
                  <MdAdd />
                  {tp("empty.action")}
                </Button>
              </SelectPropertyButton>
            }
          />
        );
      }

      return properties.map(([prop, value]) => (
        <PropertyDesigner
          key={prop}
          selector={props.selector}
          property={prop as CSSPropertyName}
          value={value}
          debug={props.debug}
        />
      ));
    }, [
      props.CSSProperties,
      props.debug,
      props.selector,
      tp,
      SelectPropertyButton,
    ]);

    return (
      <ContentBox
        outline
        collapsible
        header={
          <Text fontSize="lg" fontWeight="bold">
            {props.debug ? `${props.selector}` : tSelector(props.selector)}
          </Text>
        }
        buttons={
          <>
            <SelectPropertyButton>
              {(n) => (
                <IconButton label={tp("add")} disabled={n <= 0}>
                  <MdAdd />
                </IconButton>
              )}
            </SelectPropertyButton>

            <IconButton
              label={t("remove")}
              color="red.500"
              onClick={() => removeSelector(props.selector)}
            >
              <MdDelete />
            </IconButton>
          </>
        }
      >
        {children}
      </ContentBox>
    );
  },
);
SelectorDesigner.displayName = "SelectorDesigner";

const PropertyDesigner = React.memo(
  <Tprop extends CSSPropertyName>(props: {
    selector: CSSSelectorName;
    property: Tprop;
    value: CSSPropertyValueTypeForProperty<Tprop>;
    debug: boolean;
  }) => {
    const { setProperty, removeProperty } = useCSSDesignerMutation();

    const t = useTranslations("CSSDesigner.property");
    const { tProperty } = useDesignerTranslations();

    const prop = PROPERTIES[props.property];

    const control = useMemo(() => {
      const ControlFn = CONTROLS[prop.kind]?.component as ComponentFor<
        CSSPropertyKindFor<Tprop>
      >;
      if (!ControlFn) {
        throw new Error(
          `don't know how to render control for kind '${prop.kind}'`,
        );
      }

      return (
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
      );
    }, [props.property, props.value, props.selector, prop, setProperty]);

    return (
      <ContentBox
        outline
        collapsible
        header={
          <Text fontSize="md">
            {props.debug
              ? `${props.property} (${prop.kind})`
              : tProperty(props.property as string)}
          </Text>
        }
        buttons={
          <IconButton
            label={t("remove")}
            color="red.500"
            onClick={() => removeProperty(props.selector, props.property)}
          >
            <MdDelete />
          </IconButton>
        }
      >
        <Flex gap={2}>
          <Box flex={1} padding={2}>
            {control}
          </Box>
        </Flex>
      </ContentBox>
    );
  },
);
PropertyDesigner.displayName = "PropertyDesigner";
