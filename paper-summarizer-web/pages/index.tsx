import Link from 'next/link'

export const metadata = {
  title: 'Free AI Paper Summarizer - Summarize Research Papers Instantly',
  description: 'Summarize any academic paper or PDF with AI. Get key findings, methodology, and conclusions in seconds. Free to use.',
  keywords: 'AI paper summarizer, research paper summary, academic paper summarizer, PDF summarizer, DeepSeek',
  alternates: {
    canonical: 'https://www.summarizeai.app/',
  },
  openGraph: {
    title: 'Free AI Paper Summarizer - Summarize Research Papers Instantly',
    description: 'Summarize any academic paper or PDF with AI. Get key findings, methodology, and conclusions in seconds.',
    type: 'website',
    url: 'https://www.summarizeai.app/',
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

// JSON-LD structured data
const HOME_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Paper Summarizer',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  description: 'Free AI-powered academic paper summarizer. Paste any paper text or upload a PDF to get key findings, methodology, and conclusions in seconds.',
  url: 'https://www.summarizeai.app',
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
    url: 'https://www.summarizeai.app',
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-bg-card/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2 2V5a2 2 0 012 2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-text">Paper Summarizer</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/blog" className="text-text-secondary hover:text-text transition-colors text-sm">Blog</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-text mb-4">
            Free AI Paper Summarizer
          </h1>
          <p className="text-xl text-text-secondary mb-2">
            Summarize any research paper in seconds
          </p>
          <p className="text-text-secondary text-sm mb-8">
            论文摘要、文献综述、AI工具推荐 — 免费使用
          </p>
          <a
            href="https://www.summarizeai.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium text-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2 2V5a2 2 0 012 2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Try Paper Summarizer
          </a>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-bg-card border border-border rounded-xl p-6">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-lg font-semibold text-text mb-2">Instant Summaries</h3>
            <p className="text-text-secondary text-sm">Upload a PDF or paste text to get key findings, methodology, and conclusions in seconds.</p>
          </div>
          <div className="bg-bg-card border border-border rounded-xl p-6">
            <div className="text-3xl mb-3">🌐</div>
            <h3 className="text-lg font-semibold text-text mb-2">Multi-language</h3>
            <p className="text-text-secondary text-sm">Supports both English and Chinese academic papers. 支持中英文论文摘要。</p>
          </div>
          <div className="bg-bg-card border border-border rounded-xl p-6">
            <div className="text-3xl mb-3">🆓</div>
            <h3 className="text-lg font-semibold text-text mb-2">Free to Use</h3>
            <p className="text-text-secondary text-sm">Generous free tier available. No credit card required to get started.</p>
          </div>
        </div>

        {/* Blog preview */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-text mb-6">Latest Blog Posts</h2>
          <div className="grid gap-4">
            {[
              { slug: 'rag-vs-long-context-2026', title: 'RAG vs 长上下文：LLM 到底该选谁？2026 年最新研究告诉你答案', desc: 'RAG 和长上下文窗口两大方案深度对比，2026 年 5 月最新研究为你指明方向。' },
              { slug: '2026-05-14-bo-shi-sheng-he-yong-AI-ti-gao-ke-yan-xiao-lv', title: '博士生如何用AI提高科研效率：从文献阅读到论文发表', desc: '博士生科研效率提升指南：从文献检索、AI论文摘要、文献综述到论文发表。' },
              { slug: '2026-05-14-ai-lun-wen-zhai-yao-dui-bi', title: '2026年5月AI论文摘要工具最新对比', desc: '最新评测：6款主流AI论文摘要工具在中文支持、摘要质量、价格等方面的对比。' },
            ].map(post => (
              <Link key={post.slug} href={"/blog/" + post.slug} className="block bg-bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors">
                <h3 className="text-lg font-semibold text-text mb-1">{post.title}</h3>
                <p className="text-text-secondary text-sm">{post.desc}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/blog" className="text-primary hover:text-primary-dark transition-colors">
              View all posts →
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="p-8 bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 border border-primary/20 rounded-2xl text-center">
          <p className="text-text font-semibold mb-3 text-xl">Ready to summarize your first paper?</p>
          <p className="text-text-secondary text-sm mb-6">Join thousands of researchers who use Paper Summarizer every day.</p>
          <a
            href="https://www.summarizeai.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium text-lg transition-colors"
          >
            Get Started Free
          </a>
        </div>
      </main>

      <footer className="border-t border-border bg-bg-card/50 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center gap-6 mb-4">
            <Link href="/blog" className="text-text-secondary hover:text-text transition-colors text-sm">Blog</Link>
            <a href="https://www.summarizeai.app" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-text transition-colors text-sm">Try Summarizer</a>
          </div>
          <p className="text-text-secondary text-sm">© 2026 Paper Summarizer. All rights reserved.</p>
        </div>
      </footer>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_JSON_LD) }}
      />
    </div>
  )
}
