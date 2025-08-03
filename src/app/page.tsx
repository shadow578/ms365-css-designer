"use client";

import {
  Box,
  Center,
  DownloadTrigger,
  Flex,
  Heading,
  Highlight,
  Presence,
  Text,
} from "@chakra-ui/react";
import { useEffect, useReducer, useRef, useState } from "react";
import {
  MdAdd,
  MdBugReport,
  MdDownload,
  MdEdit,
  MdOutlineArrowLeft,
  MdOutlineBugReport,
  MdStyle,
} from "react-icons/md";
import {
  CSSDesignerContext,
  CSSDesigner,
  useGeneratedCSS,
} from "~/components/designer";
import { ColorModeButton, useColorMode } from "~/components/ui/color-mode";
import useInjectedCss from "~/util/useInjectedCss";
import { Editor as MonacoEditor } from "@monaco-editor/react";
import useKeycode, { KONAMI_CODE } from "~/util/useKeycode";
import ContentBox from "~/components/ContentBox";
import { CSSDesignerAddSelectorButton } from "~/components/designer/CSSDesigner";
import IconButton from "~/components/IconButton";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "~/components/LocaleSwitcher";

export default function Index() {
  return (
    <CSSDesignerContext>
      <MainLayout />
    </CSSDesignerContext>
  );
}

function MainLayout() {
  const signinFrame = useRef<HTMLIFrameElement>(null);

  const [css, setCSS] = useState("");
  useInjectedCss(
    signinFrame.current?.contentDocument ??
      signinFrame.current?.contentWindow?.document,
    css,
  );

  const [editorOpen, setEditorOpen] = useState(true);

  // force re-render once the iframe loads, since css injection will only
  // work for a loaded iframe
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const t = useTranslations("Index.MainLayout");

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
        <EditorPane onCSSChange={setCSS} />
      </Presence>

      <Flex direction="column" flexGrow={1} height="100%">
        <Box>
          <Flex alignItems="center" gap={2}>
            <EditorButton open={editorOpen} onClick={setEditorOpen} />
            <Heading flex={1}>{t("heading")}</Heading>
            <ColorModeButton />
            <LocaleSwitcher />
          </Flex>
        </Box>
        <Box flexGrow={1}>
          <iframe
            ref={signinFrame}
            src="/converged-signin-page"
            style={{ width: "100%", height: "100%", border: "none" }}
            onLoad={() => forceUpdate()}
          />
        </Box>
        <Box backgroundColor="red.600">
          <Center>
            <Text>
              {t.rich("disclaimer", {
                strong: (c) => <strong>{c}</strong>,
              })}
            </Text>
          </Center>
        </Box>
      </Flex>
    </Flex>
  );
}

function EditorPane(props: { onCSSChange?: (css: string) => void }) {
  const [designerMode, setDesignerMode] = useState(true);

  const showDesignerDebugButton = useKeycode(KONAMI_CODE);
  const [designerDebugMode, setDesignerDebugMode] = useState(false);

  const designerGeneratedCSS = useGeneratedCSS();
  const [monacoCSS, setMonacoCSS] = useState<string>("");
  const currentCSS = designerMode ? designerGeneratedCSS : monacoCSS;

  useEffect(() => {
    props.onCSSChange?.(currentCSS);
  }, [props, currentCSS]);

  const { colorMode } = useColorMode();

  const t = useTranslations("Index.EditorPane");

  return (
    <Box p={4} height="100%">
      <ContentBox
        height="100%"
        header={
          <Heading>
            {designerMode ? t("heading.designer") : t("heading.editor")}
          </Heading>
        }
        buttons={
          <>
            {designerMode && (
              <>
                <CSSDesignerAddSelectorButton>
                  <IconButton label={t("buttons.add_selector")}>
                    <MdAdd />
                  </IconButton>
                </CSSDesignerAddSelectorButton>

                {showDesignerDebugButton && (
                  <IconButton
                    label={
                      designerDebugMode
                        ? t("buttons.debug.enable")
                        : t("buttons.debug.disable")
                    }
                    onClick={() => setDesignerDebugMode(!designerDebugMode)}
                  >
                    {designerDebugMode ? (
                      <MdBugReport />
                    ) : (
                      <MdOutlineBugReport />
                    )}
                  </IconButton>
                )}
              </>
            )}

            <DownloadTrigger
              data={currentCSS}
              fileName="style.css"
              mimeType="text/css"
              asChild
            >
              <IconButton label={t("buttons.download_css")}>
                <MdDownload />
              </IconButton>
            </DownloadTrigger>

            <IconButton
              label={
                designerMode
                  ? t("buttons.switch_to.editor")
                  : t("buttons.switch_to.designer")
              }
              onClick={() => setDesignerMode(!designerMode)}
            >
              {designerMode ? <MdEdit /> : <MdStyle />}
            </IconButton>
          </>
        }
      >
        {designerMode ? (
          <CSSDesigner debug={designerDebugMode} />
        ) : (
          <Box flex={1} borderWidth={1}>
            <MonacoEditor
              options={{
                lineNumbers: "off",
                minimap: { enabled: false },
                contextmenu: false,
              }}
              language="css"
              theme={colorMode === "dark" ? "vs-dark" : "vs-light"}
              defaultValue={designerGeneratedCSS}
              value={monacoCSS}
              onChange={(e) => setMonacoCSS(e ?? "")}
            />
          </Box>
        )}
      </ContentBox>
    </Box>
  );
}

function EditorButton(props: {
  open: boolean;
  onClick: (open: boolean) => void;
}) {
  const t = useTranslations("Index.MainLayout");

  return (
    <IconButton
      label={props.open ? t("buttons.pane.close") : t("buttons.pane.open")}
      onClick={() => props.onClick(!props.open)}
    >
      {props.open ? <MdOutlineArrowLeft /> : <MdStyle />}
    </IconButton>
  );
}
