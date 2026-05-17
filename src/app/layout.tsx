import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { I18nProvider } from '@/i18n/provider'
import Navbar from '@/components/Navbar'

const BASE_URL = 'https://www.summarizeai.app'

export const metadata: Metadata = {
  title: '免费 AI 论文总结工具 - 数秒内总结任何学术论文',
  description: '使用 AI 总结任何学术论文或 PDF。快速获取关键发现、方法和结论。免费使用。',
  keywords: 'AI论文总结, 论文摘要, 学术论文总结, PDF摘要, 学术工具, DeepSeek',
  authors: [{ name: 'Paper Summarizer' }],
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: '免费 AI 论文总结工具 - 数秒内总结任何学术论文',
    description: '使用 AI 总结任何学术论文或 PDF。快速获取关键发现、方法和结论。',
    type: 'website',
    url: BASE_URL,
    siteName: 'Paper Summarizer',
    images: [
      {
        url: 'https://www.summarizeai.app/og-home.png',
        width: 1200,
        height: 630,
        alt: 'Paper Summarizer - 免费 AI 论文总结工具',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '免费 AI 论文总结工具 - 数秒内总结任何学术论文',
    description: '使用 AI 总结任何学术论文或 PDF。快速获取关键发现、方法和结论。',
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
  description: '免费 AI 驱动的学术论文总结工具。粘贴任何论文文本或上传 PDF，数秒内获取关键发现、方法和结论。',
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
          type="application/json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_JSON_LD) }}
        />
      </head>
      <body className="min-h-screen bg-slate-950">
        <I18nProvider>
          <Navbar />
          {children}
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  )
}
