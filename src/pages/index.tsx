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
  Slider,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { MdStyle } from "react-icons/md";
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

  const [editorOpen, setEditorOpen] = useState(false);

  return (
    <Flex direction="row" width="100vw" height="100vh">
      <Box width="40%" hidden={!editorOpen} padding="4">
        <CSSEditor />
      </Box>
      <Flex direction="column" flexGrow={1} height="100%">
        <>
          <Box>
            <HStack>
              <IconButton
                variant="ghost"
                rounded="full"
                size="xl"
                onClick={() => setEditorOpen(!editorOpen)}
              >
                <MdStyle />
              </IconButton>
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
                This page is <strong>not</strong> a real sign-in page. Do not
                enter any real credentials.
              </Text>
            </Center>
          </Box>
        </>
      </Flex>
    </Flex>
  );
}
