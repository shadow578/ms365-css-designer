"use client";

import {
  Box,
  Button,
  Circle,
  CloseButton,
  Drawer,
  Portal,
} from "@chakra-ui/react";
import { useRef } from "react";

export default function Home() {
  const iframe = useRef<HTMLIFrameElement>(null);

  function injectDynamicCSS(style: string) {
    if (!iframe.current) throw new Error("iframe inaccessible");

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

  const testIframeInjection = () => {
    injectDynamicCSS(`
      .ext-button {
        background-color: ${"red"} !important;
      }
    `);
  };

  return (
    <>
      <iframe
        ref={iframe}
        src="/converged-signin-page"
        style={{
          position: "absolute",
          top: "10%",
          left: "10%",
          width: "80%",
          height: "80%",
        }}
      />

      <div>
        <Drawer.Root placement="start" size="xl">
          <Drawer.Trigger asChild>
            <Circle
              size="100px"
              bg="blue.500"
              position="absolute"
              top="20px"
              left="20px"
            />
          </Drawer.Trigger>
          <Portal>
            <Drawer.Backdrop />
            <Drawer.Positioner>
              <Drawer.Content>
                <Drawer.Header>
                  <Drawer.Title>Drawer Title</Drawer.Title>
                </Drawer.Header>
                <Drawer.Body>
                  <p>drawer.body</p>

                  <Button onClick={testIframeInjection}>
                    Test Iframe Injection
                  </Button>
                </Drawer.Body>

                <Drawer.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Drawer.CloseTrigger>
              </Drawer.Content>
            </Drawer.Positioner>
          </Portal>
        </Drawer.Root>
      </div>
    </>
  );
}
