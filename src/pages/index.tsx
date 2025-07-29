"use client";

import {
  Box,
  Center,
  Flex,
  Heading,
  Highlight,
  HStack,
  IconButton,
  Presence,
  Text,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { MdOutlineArrowLeft, MdStyle } from "react-icons/md";
import CSSEditorContextProvider, {
  useGeneratedCSS,
} from "~/components/editor/context";
import CSSEditor from "~/components/editor/CSSEditor";
import useInjectedCss from "~/util/injectCssHook";

export default function Index() {
  return (
    <CSSEditorContextProvider>
      <MainLayout />
    </CSSEditorContextProvider>
  );
}

function MainLayout() {
  const signinFrame = useRef<HTMLIFrameElement>(null);

  const css = useGeneratedCSS();
  useInjectedCss(
    signinFrame.current?.contentDocument ??
      signinFrame.current?.contentWindow?.document,
    css,
  );

  const [editorOpen, setEditorOpen] = useState(true);

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
        <CSSEditor />
      </Presence>

      <Flex direction="column" flexGrow={1} height="100%">
        <Box>
          <HStack>
            <EditorButton open={editorOpen} onClick={setEditorOpen} />
            <Heading>M365 CSS Designer</Heading>
          </HStack>
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
