"use client";

import {
  Box,
  Center,
  Flex,
  Heading,
  Highlight,
  IconButton,
  Presence,
  Text,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { MdOutlineArrowLeft, MdStyle } from "react-icons/md";
import {
  CSSEditorContext,
  CSSEditor,
  useGeneratedCSS,
} from "~/components/editor";
import { ColorModeButton } from "~/components/ui/color-mode";
import useInjectedCss from "~/util/useInjectedCss";
import { Editor as MonacoEditor } from "@monaco-editor/react";

export default function Index() {
  return (
    <CSSEditorContext>
      <MainLayout />
    </CSSEditorContext>
  );
}

function MainLayout() {
  const signinFrame = useRef<HTMLIFrameElement>(null);

  const designerGeneratedCSS = useGeneratedCSS();
  const [monacoCSS, setMonacoCSS] = useState("");

  useInjectedCss(
    signinFrame.current?.contentDocument ??
      signinFrame.current?.contentWindow?.document,
    monacoCSS,
  );

  const [editorOpen, setEditorOpen] = useState(true);

  console.log(monacoCSS)

  return (
    <Flex direction="row" width="100vw" height="100vh">
      <Presence
        width="40%"
        height="100vh"
        overflow="scroll"
        scrollBehavior="smooth"
        present={editorOpen}
        animationName={{
          _open: "slide-from-left-full",
          _closed: "slide-to-left-full",
        }}
        animationDuration="moderate"
      >
        <Box p={4} paddingEnd={0} height="100%" backgroundColor="red.100">
          <MonacoEditor
            options={{
              lineNumbers: "off",
              minimap: { enabled: false },
              contextmenu: false,
            }}
            language="css"
            height="100%"
            onChange={(e) => setMonacoCSS(e ?? "")}
          />
        </Box>
      </Presence>

      <Flex direction="column" flexGrow={1} height="100%">
        <Box>
          <Flex alignItems="center" gap={2}>
            <EditorButton open={editorOpen} onClick={setEditorOpen} />
            <Heading flex={1}>M365 CSS Designer</Heading>
            <ColorModeButton />
          </Flex>
        </Box>
        <Box flexGrow={1}>
          <iframe
            ref={signinFrame}
            src="/converged-signin-page"
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        </Box>
        <Box backgroundColor="red.600">
          <Center>
            <Text>
              <Highlight query="not" styles={{ fontWeight: "bold" }}>
                This page is not a real sign-in page. Do not enter any real
                credentials.
              </Highlight>
            </Text>
          </Center>
        </Box>
      </Flex>
    </Flex>
  );
}

function EditorButton(props: {
  open: boolean;
  onClick: (open: boolean) => void;
}) {
  return (
    <IconButton
      variant="ghost"
      rounded="full"
      size="xl"
      onClick={() => props.onClick(!props.open)}
    >
      {props.open ? <MdOutlineArrowLeft /> : <MdStyle />}
    </IconButton>
  );
}
