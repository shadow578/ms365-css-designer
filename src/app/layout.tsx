import { type Metadata } from "next";
import { Provider } from "~/components/ui/provider";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "M365 CSS Designer",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <TRPCReactProvider>
          <Provider>{children}</Provider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
