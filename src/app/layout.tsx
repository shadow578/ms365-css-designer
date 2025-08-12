import { type Metadata, type Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

import { Provider as ChakraProvider } from "~/components/ui/provider";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "Custom CSS Designer",
  description: "A Designer for Microsoft 365 Custom CSS",
  applicationName: "MS365 CSS Designer",
  authors: [
    {
      name: "shadow578",
      url: "https://github.com/shadow578/ms365-custom-css-designer",
    },
  ],
  icons: "/favicon.ico",
};

export const viewport: Viewport = {
  width: "400px", // = minWidth of EditorPane
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <TRPCReactProvider>
          <ChakraProvider>
            <NextIntlClientProvider>{children}</NextIntlClientProvider>
          </ChakraProvider>
        </TRPCReactProvider>

        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
