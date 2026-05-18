import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { GoogleAnalytics } from '@next/third-parties/google'
import './globals.css'
import { I18nProvider } from '@/i18n/provider'
import Navbar from '@/components/Navbar'
import FeedbackButton from '@/components/FeedbackButton'

const BASE_URL = 'https://www.summarizeai.app'

export const metadata: Metadata = {
  title: 'Free AI Paper Summarizer - Summarize Any Academic Paper in Seconds',
  description: 'Summarize any academic paper or PDF with AI. Get key findings, methods, and conclusions in seconds. Free to use.',
  keywords: 'AI paper summarizer, paper summary, academic paper summary, PDF summary, research tool, DeepSeek',
  authors: [{ name: 'Paper Summarizer' }],
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: 'Free AI Paper Summarizer - Summarize Any Academic Paper in Seconds',
    description: 'Summarize any academic paper or PDF with AI. Get key findings, methods, and conclusions in seconds.',
    type: 'website',
    url: BASE_URL,
    siteName: 'Paper Summarizer',
    images: [
      {
        url: 'https://www.summarizeai.app/og-home.png',
        width: 1200,
        height: 630,
        alt: 'Paper Summarizer - Free AI Paper Summarizer',
      },
    ],
  },
  verification: {
    google: 'google7cb187820d4c40ab',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free AI Paper Summarizer - Summarize Any Academic Paper in Seconds',
    description: 'Summarize any academic paper or PDF with AI. Get key findings, methods, and conclusions in seconds.',
    images: ['https://www.summarizeai.app/og-home.png'],
  },
}

// JSON-LD structured data for the home page
const HOME_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Paper-Summarizer',
  applicationCategory: 'Education',
  operatingSystem: 'Web',
  description: 'AI-powered academic paper summarizer. Instantly summarize complex papers and export citations.',
  url: BASE_URL,
  offers: {
    '@type': 'Offer',
    price: '9.99',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  },
  author: {
    '@type': 'Organization',
    name: 'Paper Summarizer',
    url: BASE_URL,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6809828426585070" crossOrigin="anonymous"></script>
        {/* JSON-LD structured data for home page */}
        <script
          type="application/json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_JSON_LD) }}
        />
      </head>
      <body className="min-h-screen bg-slate-950">
        <I18nProvider>
          <Navbar />
          {children}
          <FeedbackButton />
        </I18nProvider>
        <Analytics />
        <GoogleAnalytics gaId="G-3F0LETZ2NY" />
      </body>
    </html>
  )
}
