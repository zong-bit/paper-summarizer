import type { Metadata } from 'next'

// PM hotfix 07:00 - force rebuild
export const generateMetadata = (): Metadata => ({
  title: '📚 My Library - Paper Summarizer',
  description: 'View and manage your saved paper summaries. Access all your previously summarized academic papers in one place.',
  alternates: {
    canonical: 'https://www.summarizeai.app/library',
  },
  openGraph: {
    title: '📚 My Library - Paper Summarizer',
    description: 'View and manage your saved paper summaries.',
    type: 'website',
    url: 'https://www.summarizeai.app/library',
    siteName: 'Paper Summarizer',
    images: [
      {
        url: 'https://www.summarizeai.app/og-home.png',
        width: 1200,
        height: 630,
        alt: 'My Library - Paper Summarizer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '📚 My Library - Paper Summarizer',
    description: 'View and manage your saved paper summaries.',
    images: ['https://www.summarizeai.app/og-home.png'],
  },
})

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  return children
}
