import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";

import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from "@/components/ErrorBoundary";

export const metadata = {
  title: "Dope Control",
  description: "Control your dope with ease. Don't just have fun, earn it.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} antialiased`}>
      <body>
        <ErrorBoundary>
          <TRPCReactProvider>
            {children} <Toaster />
          </TRPCReactProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
