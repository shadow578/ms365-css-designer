import { type Metadata } from "next";
import type { AppProps } from "next/app";
import { Provider as ChakraProvider } from "~/components/ui/provider";

import { TRPCReactProvider } from "~/trpc/react";
import I18NProvider from "~/util/i18n";

export const metadata: Metadata = {
  title: "M365 CSS Designer",
};

export default function RootLayout({ Component, pageProps }: AppProps) {
  return (
    <TRPCReactProvider>
      <ChakraProvider>
        <I18NProvider>
        <Component {...pageProps} />
        </I18NProvider>
      </ChakraProvider>
    </TRPCReactProvider>
  );
}
