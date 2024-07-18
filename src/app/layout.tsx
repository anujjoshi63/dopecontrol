import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";

import { TRPCReactProvider } from "@/trpc/react";

export const metadata = {
  title: "Dope Control",
  description: "Control your dope with ease. Don't just have fun, earn it.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  logsModal,
  children,
}: {
  logsModal: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} antialiased`}>
      <body>
        <TRPCReactProvider>
          {logsModal}
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
