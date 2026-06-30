import type { Metadata } from 'next'

export const generateMetadata = (): Metadata => ({
  title: '⚡ Pro Plans - Paper Summarizer',
  description: 'Upgrade to Pro for unlimited paper summaries, priority processing, and advanced PDF parsing. Starting at $9.99/month.',
  alternates: {
    canonical: 'https://www.summarizeai.app/premium',
  },
  openGraph: {
    title: '⚡ Pro Plans - Paper Summarizer',
    description: 'Upgrade to Pro for unlimited summaries and priority processing.',
    type: 'website',
    url: 'https://www.summarizeai.app/premium',
    siteName: 'Paper Summarizer',
    images: [
      {
        url: 'https://www.summarizeai.app/og-home.png',
        width: 1200,
        height: 630,
        alt: 'Pro Plans - Paper Summarizer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '⚡ Pro Plans - Paper Summarizer',
    description: 'Upgrade to Pro for unlimited summaries and priority processing.',
    images: ['https://www.summarizeai.app/og-home.png'],
  },
})

export default function PremiumLayout({ children }: { children: React.ReactNode }) {
  return children
}
