import type { Metadata } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { DefaultSiteFooter } from "@/components/site-footer"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "VidyaQuest — Learn, Play, Explore & Achieve",
  description: "Discover a new way to learn with AI-powered education, interactive virtual labs, gamified challenges, and opportunities for every student.",
  openGraph: {
    title: "VidyaQuest — Learn, Play, Explore & Achieve",
    description: "A learning adventure built around curiosity, practical discovery, and opportunity.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={cn("antialiased")}
    >
      <body id="top">
        <ThemeProvider>
          {children}
          <DefaultSiteFooter year={String(new Date().getUTCFullYear())} />
        </ThemeProvider>
      </body>
    </html>
  )
}
