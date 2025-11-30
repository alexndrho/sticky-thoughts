import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import {
  ColorSchemeScript,
  mantineHtmlProps,
  MantineProvider,
} from "@mantine/core";
import { Analytics } from "@vercel/analytics/next";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/tiptap/styles.css";

import Providers from "./providers";
import { theme } from "./theme";
import "./global.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StickyThoughts | Online Freedom Wall",
  description:
    "StickyThoughts is an online freedom wall where you can express yourself freely and share your thoughts and experiences with others.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <MantineProvider defaultColorScheme="auto" theme={theme}>
          <Providers>{children}</Providers>
          <Analytics />
          <Notifications />
        </MantineProvider>
      </body>
    </html>
  );
}
