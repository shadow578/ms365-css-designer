"use client";

import {
  Box,
  ColorPicker,
  Center,
  CloseButton,
  Drawer,
  Flex,
  Heading,
  HStack,
  IconButton,
  Text,
  Portal,
  parseColor,
  type Color,
  Button,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { MdStyle } from "react-icons/md";

export default function Home() {
  const iframe = useRef<HTMLIFrameElement>(null);
  function injectDynamicCSS(style: string) {
    if (!iframe.current) throw new Error("iframe ref not set");

    const frameDocument =
      iframe.current.contentDocument ?? iframe.current.contentWindow?.document;
    if (!frameDocument) throw new Error("iframe document inaccessible");

    const id = "__injected-style__";

    // remove existing style if it exists
    frameDocument.getElementById(id)?.remove();

    const styleElement = frameDocument.createElement("style");
    styleElement.id = id;
    styleElement.appendChild(frameDocument.createTextNode(style));
    frameDocument.head.appendChild(styleElement);
  }

  const [editorOpen, setEditorOpen] = useState(false);
  const [css, setCSS] = useState<Record<string, string>>({});
  useEffect(() => {
    const cssString = `
    .ext-button {
      background-color: ${css.primaryColor ?? "blue"} !important;
    }
    `;

    console.log("Injecting CSS:", css);
    injectDynamicCSS(cssString);
  }, [css]);

  return (
    <Flex direction="row" width="100vw" height="100vh">
      <EditorDrawer
        open={editorOpen}
        onOpenChange={setEditorOpen}
        css={css}
        setCSS={setCSS}
      />
      <Flex direction="column" flexGrow={1} height="100%">
        <MainLayout
          onOpenEditorClick={() => setEditorOpen(true)}
          iFrameRef={iframe}
        />
      </Flex>
    </Flex>
  );
}

function MainLayout(props: {
  onOpenEditorClick: () => void;
  iFrameRef?: React.RefObject<HTMLIFrameElement | null>;
}) {
  return (
    <>
      <Box>
        <HStack>
          <IconButton
            variant="ghost"
            rounded="full"
            size="xl"
            onClick={props.onOpenEditorClick}
          >
            <MdStyle />
          </IconButton>
          <Heading>M365 CSS Designer</Heading>
        </HStack>
      </Box>
      <Box flexGrow={1} backgroundColor="blue">
        <iframe
          ref={props.iFrameRef}
          src="/converged-signin-page"
          style={{ width: "100%", height: "100%", border: "none" }}
        />
      </Box>
      <Box backgroundColor="red.600">
        <Center>
          <Text>
            This page is <strong>not</strong> a real sign-in page. Do not enter
            any real credentials.
          </Text>
        </Center>
      </Box>
    </>
  );
}

function EditorDrawer(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  css: Record<string, string>;
  setCSS: (css: Record<string, string>) => void;
}) {
  return (
    <Drawer.Root
      placement="start"
      size="xl"
      open={props.open}
      onOpenChange={(e) => props.onOpenChange(e.open)}
    >
      <Drawer.Backdrop />
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Drawer Title</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <p>drawer.body</p>

          <Button
            onClick={() =>
              props.setCSS({
                ...props.css,
                primaryColor: "green",
              })
            }
          >
            Set CSS
          </Button>

          <ColorSelection
            value={parseColor(props.css.primaryColor ?? "blue")}
            onChange={(_, c) =>
              props.setCSS({
                ...props.css,
                primaryColor: c,
              })
            }
          />
        </Drawer.Body>

        <Drawer.CloseTrigger asChild>
          <CloseButton size="sm" />
        </Drawer.CloseTrigger>
      </Drawer.Content>
    </Drawer.Root>
  );
}

function ColorSelection(props: {
  value: Color;
  onChange: (value: Color, asString: string) => void;
}) {
  return (
    <ColorPicker.Root
      value={props.value}
      onValueChange={(e) => props.onChange(e.value, e.valueAsString)}
      maxW="200px"
    >
      <ColorPicker.HiddenInput />
      <ColorPicker.Label>Color</ColorPicker.Label>
      <ColorPicker.Control>
        <ColorPicker.Input />
        <ColorPicker.Trigger />
      </ColorPicker.Control>
      <Portal>
        <ColorPicker.Positioner>
          <ColorPicker.Content>
            <ColorPicker.Area />
            <HStack>
              <ColorPicker.EyeDropper size="xs" variant="outline" />
              <ColorPicker.Sliders />
            </HStack>
          </ColorPicker.Content>
        </ColorPicker.Positioner>
      </Portal>
    </ColorPicker.Root>
  );
}
