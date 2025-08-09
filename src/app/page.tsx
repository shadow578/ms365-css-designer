"use client";

import {
  Box,
  DownloadTrigger,
  Flex,
  Heading,
  Presence,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  MdAdd,
  MdBugReport,
  MdChevronLeft,
  MdChevronRight,
  MdDownload,
  MdEdit,
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
import { Editor as MonacoEditor, type Monaco } from "@monaco-editor/react";
import useKeycode, { KONAMI_CODE } from "~/util/useKeycode";
import ContentBox from "~/components/ContentBox";
import { CSSDesignerAddSelectorButton } from "~/components/designer/CSSDesigner";
import IconButton from "~/components/IconButton";
import { useLocale, useTranslations } from "next-intl";
import LocaleSwitcher from "~/components/LocaleSwitcher";
import registerSimpleCSSClassCompletionProvider from "~/util/simpleCompletionProvider";
import { ALL_SELECTORS } from "~/components/designer/definitions/selectors";
import Dialog from "~/components/Dialog";

import appIcon from "~/../public/icon.svg";
import Image from "next/image";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";

export default function Index() {
  return (
    <CSSDesignerContext>
      <main role="main">
        <MainLayout />
      </main>
    </CSSDesignerContext>
  );
}

function MainLayout() {
  const signinFrame = useRef<HTMLIFrameElement>(null);

  const [css, setCSS] = useState("");
  const { injectCss: manualInjectCss } = useInjectedCss(
    signinFrame.current?.contentDocument ??
      signinFrame.current?.contentWindow?.document,
    css,
  );

  const [__editorOpen, setEditorOpen] = useState(false);
  const editorOpen = useBreakpointValue({
    // on small screens, the editor pane is always open (below the content)
    base: true,
    lg: __editorOpen,
  });
  const editorOpenButtonShown = useBreakpointValue({
    // on small screens, the editor pane is always open, so the button is not shown
    base: false,
    lg: true,
  });

  const [warningDialogOpen, setWarningDialogOpen] = useState(false);
  const acceptWarningDialog = () => {
    setWarningDialogOpen(false);
    window.localStorage.setItem("warning_dismissed", "true");
  };

  // localStorage is checked inside useEffect to avoid SSR issues
  useEffect(() => {
    if (typeof window === "undefined" || !window.localStorage) {
      return;
    }

    const dismissed =
      window.localStorage.getItem("warning_dismissed") === "true";
    if (!dismissed) setWarningDialogOpen(true);
  }, []);

  const t = useTranslations("Index.MainLayout");
  const locale = useLocale();

  return (
    <>
      <Dialog
        open={warningDialogOpen}
        noDismiss
        title={
          <Flex alignItems="center">
            <Heading flex={1}>{t("warning_dialog.title")}</Heading>
            <LocaleSwitcher style="minimal" noPortal />
          </Flex>
        }
        primary={t("warning_dialog.primary")}
        onPrimary={acceptWarningDialog}
        primaryProps={{
          colorPalette: "red",
          variant: "surface",
          fontWeight: "bold",
        }}
      >
        <Text>
          {t.rich("warning_dialog.content", {
            strong: (c) => <strong>{c}</strong>,
          })}
        </Text>
      </Dialog>

      <Flex
        direction={{
          base: "column-reverse",
          lg: "row",
        }}
        width="100vw"
      >
        <Presence
          flex={1}
          width={{
            base: "100%",
            lg: "unset",
          }}
          maxWidth={{
            base: "100%",
            lg: "50%",
          }}
          minWidth="400px"
          height={{
            base: "unset",
            lg: "100vh",
          }}
          overflow={{
            base: "unset",
            lg: "scroll",
          }}
          scrollBehavior="smooth"
          present={editorOpen}
          animationName={{
            base: {
              _open: "slide-from-bottom-full",
              _closed: "slide-to-bottom-full",
            },
            lg: {
              _open: "slide-from-left-full",
              _closed: "slide-to-left-full",
            },
          }}
          animationDuration="moderate"
        >
          <EditorPane onCSSChange={setCSS} />
        </Presence>

        <Flex
          position="relative"
          direction="column"
          flexGrow={1}
          height="100vh"
        >
          {editorOpenButtonShown && (
            <Box position="absolute" top="50%" left="5px">
              <IconButton
                label={t(`buttons.pane.${editorOpen ? "close" : "open"}`)}
                onClick={() => setEditorOpen(!editorOpen)}
              >
                {editorOpen ? <MdChevronLeft /> : <MdChevronRight />}
              </IconButton>
            </Box>
          )}

          <PageHeader />
          <Box flexGrow={1}>
            <iframe
              title="Sign-in Page Preview"
              ref={signinFrame}
              src={`converged-signin-page?l=${locale}`}
              style={{ width: "100%", height: "100%", border: "none" }}
              onLoad={manualInjectCss}
            />
          </Box>
        </Flex>
      </Flex>
    </>
  );
}

function PageHeader() {
  const t = useTranslations("Index.MainLayout");

  return (
    <Flex ml={5} mr={5} alignItems="center" gap={2}>
      <Image
        src={appIcon as StaticImport}
        alt={t("heading")}
        style={{ height: "100%", width: "auto", padding: "4px" }}
      />

      <VStack flex={1} alignItems="start" gap={0}>
        <Heading>{t("heading")}</Heading>
        <Text fontSize="sm" color="text.secondary">
          {t("subheading")}
        </Text>
      </VStack>
      <ColorModeButton />
      <LocaleSwitcher style="full" />
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

  const getCSSForDownload = useCallback(() => {
    if (!designerMode) {
      return currentCSS;
    }

    return `/* generated using ${window.location.href} */\n` + currentCSS;
  }, [designerMode, currentCSS]);

  const { colorMode } = useColorMode();

  const onMonacoMount = useCallback((monaco: Monaco) => {
    // provide autocomplete for all selectors the designer supports, as a start
    registerSimpleCSSClassCompletionProvider(monaco, () =>
      ALL_SELECTORS.map((s) => ({
        label: s,
        insertText: s,
      })),
    );
  }, []);

  const [editorSwitchWarningOpen, setEditorSwitchWarningOpen] = useState(false);

  const t = useTranslations("Index.EditorPane");

  return (
    <>
      <Dialog
        open={editorSwitchWarningOpen}
        onOpenChange={setEditorSwitchWarningOpen}
        title={t("editor_switch_warning_dialog.title")}
        primary={t("editor_switch_warning_dialog.primary")}
        onPrimary={() => {
          setEditorSwitchWarningOpen(false);
          setDesignerMode(true);
        }}
        secondary={t("editor_switch_warning_dialog.secondary")}
        onSecondary={() => setEditorSwitchWarningOpen(false)}
      >
        <Text>{t("editor_switch_warning_dialog.content")}</Text>
      </Dialog>

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
                data={getCSSForDownload}
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
                onClick={() => {
                  if (designerMode) {
                    setDesignerMode(false);
                  } else {
                    // when switching back from editor to designer, warn
                    // the user that changes in the editor will not be applied
                    setEditorSwitchWarningOpen(true);
                  }
                }}
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
                onMount={(e, m) => onMonacoMount(m)}
              />
            </Box>
          )}
        </ContentBox>
      </Box>
    </>
  );
}
