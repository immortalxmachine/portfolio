import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";
import { profile } from "../../content/profile";
import { SITE } from "@/lib/site";
import { getProjects } from "@/lib/github";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { CommandPalette } from "@/components/site/command-palette";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { BackToTop } from "@/components/site/back-to-top";
import { Toaster } from "@/components/site/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: `%s · ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: profile.links.github }],
  creator: SITE.name,
  keywords: [
    "Adhithyaa V P",
    "AI Engineer",
    "Machine Learning",
    "Data Engineering",
    "Software Engineer",
    "Generative AI",
    "portfolio",
    "SRM",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE.url,
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

/** JSON-LD Person schema for rich search results. */
function PersonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: SITE.url,
    jobTitle: "AI, Data & Software Engineer",
    email: `mailto:${profile.email}`,
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "SRM Institute of Science and Technology",
    },
    sameAs: [profile.links.github, profile.links.linkedin],
    knowsAbout: ["Machine Learning", "Data Engineering", "Generative AI", "Software Engineering"],
  };
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Live project index for the command palette (cached via ISR).
  const projects = await getProjects();
  const projectIndex = projects.map((p) => ({
    slug: p.slug,
    title: p.title,
    category: p.category,
  }));

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrains.variable} h-full`}
    >
      <body className="flex min-h-full flex-col antialiased">
        <PersonJsonLd />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CommandPalette projects={projectIndex}>
            <ScrollProgress />
            <a href="#main" className="skip-link">
              Skip to content
            </a>
            <SiteNav />
            <main id="main" tabIndex={-1} className="flex-1 outline-none">
              {children}
            </main>
            <SiteFooter />
            <BackToTop />
          </CommandPalette>
          <Toaster />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
