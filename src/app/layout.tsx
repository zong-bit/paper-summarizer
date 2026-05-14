import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { I18nProvider } from '@/i18n/provider'

const BASE_URL = 'https://www.summarizeai.app'

export const metadata: Metadata = {
  title: 'Free AI Paper Summarizer - Summarize Research Papers Instantly',
  description: 'Summarize any academic paper or PDF with AI. Get key findings, methodology, and conclusions in seconds. Free to use.',
  keywords: 'AI paper summarizer, research paper summary, academic paper summarizer, PDF summarizer, DeepSeek',
  authors: [{ name: 'Paper Summarizer' }],
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: 'Free AI Paper Summarizer - Summarize Research Papers Instantly',
    description: 'Summarize any academic paper or PDF with AI. Get key findings, methodology, and conclusions in seconds.',
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
  twitter: {
    card: 'summary_large_image',
    title: 'Free AI Paper Summarizer - Summarize Research Papers Instantly',
    description: 'Summarize any academic paper or PDF with AI. Get key findings, methodology, and conclusions in seconds.',
    images: ['https://www.summarizeai.app/og-home.png'],
  },
}

// JSON-LD structured data for the home page
const HOME_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Paper Summarizer',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  description: 'Free AI-powered academic paper summarizer. Paste any paper text or upload a PDF to get key findings, methodology, and conclusions in seconds.',
  url: BASE_URL,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'CNY',
    availability: 'https://schema.org/InStock',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    bestRating: '5',
    worstRating: '1',
    ratingCount: 1000,
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
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6809828426585070" crossOrigin="anonymous"></script>
        {/* JSON-LD structured data for home page */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_JSON_LD) }}
        />
      </head>
      <body className="min-h-screen bg-bg">
        <I18nProvider>
          {children}
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  )
}
