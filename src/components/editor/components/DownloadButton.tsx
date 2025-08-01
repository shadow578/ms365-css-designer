import { DownloadTrigger } from "@chakra-ui/react";
import IconButton from "./IconButton";
import { MdDownload } from "react-icons/md";
import { useGeneratedCSS } from "../context/stateContext";

export default function DownloadButton() {
  const css = useGeneratedCSS();

  return (
    <DownloadTrigger
      data={css}
      fileName="style.css"
      mimeType="text/css"
      asChild
    >
      <IconButton label="Download CSS">
        <MdDownload />
      </IconButton>
    </DownloadTrigger>
  );
}
