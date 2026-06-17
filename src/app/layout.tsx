import type { Metadata } from "next";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";

import { syne, plusJakartaSans, jetbrainsMono } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Dako Studios",
  description: "Five disciplines. Zero compromises.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${syne.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <head>
        {/* Blocking script prevents flash of wrong theme on load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var stored = localStorage.getItem('dako-ui-theme');
                var theme = stored || 'dark';
                if (theme === 'system') {
                  theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                }
                document.documentElement.classList.add(theme);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={plusJakartaSans.className}>
        <ThemeProvider defaultTheme="dark" storageKey="dako-ui-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
