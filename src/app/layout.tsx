import { type Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { Provider as ChakraProvider } from "~/components/ui/provider";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "M365 CSS Designer",
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
      </body>
    </html>
  );
}
