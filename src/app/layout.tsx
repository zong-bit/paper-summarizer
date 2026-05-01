import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Free AI Paper Summarizer - Summarize Research Papers Instantly',
  description: 'Summarize any academic paper or PDF with AI. Get key findings, methodology, and conclusions in seconds. Free to use.',
  keywords: 'AI paper summarizer, research paper summary, academic paper summarizer, PDF summarizer, DeepSeek',
  authors: [{ name: 'Paper Summarizer' }],
  openGraph: {
    title: 'Free AI Paper Summarizer',
    description: 'Summarize any academic paper or PDF with AI',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Free AI Paper Summarizer',
    description: 'Summarize any academic paper or PDF with AI',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6809828426585070" crossOrigin="anonymous"></script>
      </head>
      <body className="min-h-screen bg-bg">
        {children}
      </body>
    </html>
  )
}
