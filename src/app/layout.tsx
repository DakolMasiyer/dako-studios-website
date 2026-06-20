import type { Metadata } from "next";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { PageLoader } from "@/components/page-loader";

import { spaceGrotesk, syne, plusJakartaSans, jetbrainsMono, fraunces } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Dako Studios | One Creative Studio. Every Edge.",
  description: "Built for the businesses building Africa's next chapter. Websites, brand identity, motion, and film marketing — fully yours at launch. Based in Abuja, serving Nigeria and the diaspora.",
  openGraph: {
    title: "Dako Studios | One Creative Studio. Every Edge.",
    description: "Built for the businesses building Africa's next chapter. Websites, brand identity, motion, and film marketing — fully yours at launch.",
    url: "https://www.dako.studio",
    siteName: "Dako Studios",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Dako Studios",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dako Studios | One Creative Studio. Every Edge.",
    description: "Built for the businesses building Africa's next chapter.",
    images: ["/og-image.png"],
  },
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
      className={`${spaceGrotesk.variable} ${syne.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} ${fraunces.variable} antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Dako Studios",
              "url": "https://www.dako.studio",
              "logo": "https://www.dako.studio/icon.svg",
              "sameAs": []
            }),
          }}
        />
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
          <PageLoader />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
