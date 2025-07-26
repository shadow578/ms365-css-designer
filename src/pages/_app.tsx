import { type Metadata } from "next";
import type { AppProps } from "next/app";
import { Provider } from "~/components/ui/provider";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "M365 CSS Designer",
};

export default function RootLayout({ Component, pageProps }: AppProps) {
  return (
    <TRPCReactProvider>
      <Provider>
        <Component {...pageProps} />
      </Provider>
    </TRPCReactProvider>
  );
}
