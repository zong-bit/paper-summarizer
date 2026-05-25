import type { Metadata } from 'next'

const BASE_URL = 'https://www.summarizeai.app'

export const metadata: Metadata = {
  title: 'About Paper Summarizer — AI-Powered Academic Paper Summarization',
  description: 'Paper Summarizer helps researchers, students, and professionals read academic papers 10x faster with AI-generated structured summaries. Learn about our mission, features, and team.',
  keywords: 'AI paper summarizer, about paper summarizer, academic research tool, paper reading tool, AI summary team',
  alternates: {
    canonical: `${BASE_URL}/about`,
  },
  openGraph: {
    title: 'About Paper Summarizer — AI-Powered Academic Paper Summarization',
    description: 'Paper Summarizer helps researchers, students, and professionals read academic papers 10x faster with AI-generated structured summaries.',
    type: 'website',
    url: `${BASE_URL}/about`,
    siteName: 'Paper Summarizer',
    images: [
      {
        url: 'https://www.summarizeai.app/og-about.png',
        width: 1200,
        height: 630,
        alt: 'About Paper Summarizer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Paper Summarizer — AI-Powered Academic Paper Summarization',
    description: 'Paper Summarizer helps researchers, students, and professionals read academic papers 10x faster with AI-generated structured summaries.',
    images: ['https://www.summarizeai.app/og-about.png'],
  },
}

const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Paper Summarizer',
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  description: 'Paper Summarizer is an AI-powered academic paper summarization tool that helps researchers, students, and professionals quickly extract key findings, methodologies, and conclusions from research papers.',
  foundingDate: '2025',
  email: 'selina_zxw@qq.com',
  sameAs: [
    'https://github.com/zong-bit/paper-summarizer',
    'https://x.com/PaperSummarizer',
    'https://www.reddit.com/r/PaperSummarizer/',
  ],
}

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
        />
      </head>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-3xl mx-auto px-4 pt-20 pb-16 md:pt-28 md:pb-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About Paper Summarizer
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Our mission is simple: help every researcher, student, and knowledge worker read academic papers 10x faster — without sacrificing depth or accuracy.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-slate-950 py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">Our Mission</h2>
          <div className="space-y-5 text-slate-300 leading-relaxed">
            <p>
              Every year, millions of research papers are published across thousands of academic journals and conference proceedings. For researchers, graduate students, and professionals, keeping up with the latest literature has become an impossible task. Reading a single paper can take 30 minutes to several hours — and with the volume of publications growing exponentially, traditional reading methods simply don't scale.
            </p>
            <p>
              Paper Summarizer was founded to solve this problem. We believe that AI-powered summarization can transform how researchers consume academic literature — not by replacing deep reading, but by making it dramatically more efficient.
            </p>
            <p>
              Our platform uses advanced large language models (LLMs) to generate structured, accurate summaries of research papers. Instead of skimming through pages of dense text, researchers can get a clear, sectioned overview — including research question, methodology, key findings, and conclusions — in seconds. This allows them to decide which papers deserve a full read and which can be processed at a high level.
            </p>
            <p>
              We are committed to accuracy, transparency, and user privacy. Every summary is clearly structured so you can trace claims back to the original text. We never sell user data, and uploaded content is processed securely and not stored longer than necessary.
            </p>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="bg-slate-900/50 py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">Core Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureCard
              emoji="📄"
              title="AI Paper Summarization"
              description="Upload any academic paper (PDF, URL, or paste text) and get a structured summary with research question, methodology, key findings, and conclusion in seconds."
            />
            <FeatureCard
              emoji="💬"
              title="Paper Q&A"
              description="Ask specific questions about any paper. Our AI understands the context and provides answers grounded in the original text. Available to Pro users."
            />
            <FeatureCard
              emoji="🔬"
              title="Paper Comparison"
              description="Compare two papers side by side. Our system analyzes both papers and highlights differences in methodology, findings, and contributions. Pro feature."
            />
            <FeatureCard
              emoji="📚"
              title="Literature Outline"
              description="Generate structured literature review outlines from multiple papers. Perfect for thesis writing, grant proposals, and survey papers. Pro feature."
            />
            <FeatureCard
              emoji="📋"
              title="Citation Export"
              description="Export summaries and citations in multiple formats. Supports APA, MLA, Chicago, and more. Free for all users."
            />
            <FeatureCard
              emoji="🎮"
              title="Research Games"
              description="Review papers interactively with our bingo and quiz games. A fun way to test your understanding and engage with academic content."
            />
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="bg-slate-950 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Our Team</h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-8">
            Paper Summarizer is built by a small, dedicated team of engineers, researchers, and designers who are passionate about making academic knowledge more accessible. We combine expertise in natural language processing, software engineering, and academic research to build tools that genuinely help the research community.
          </p>
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-8 inline-block">
            <div className="text-4xl mb-4">👥</div>
            <p className="text-lg text-white font-semibold mb-2">Paper Summarizer Team</p>
            <p className="text-slate-400 text-sm">
              A group of engineers and researchers passionate about AI-powered academic tools.
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-slate-900/50 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Contact Us</h2>
          <p className="text-slate-400 mb-6">
            Have questions, suggestions, or feedback? We'd love to hear from you.
          </p>
          <a
            href="mailto:selina_zxw@qq.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            selina_zxw@qq.com
          </a>
          <p className="text-slate-500 text-sm mt-4">
            For support inquiries, please email us and we'll get back to you within 24 hours.
          </p>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ emoji, title, description }: { emoji: string; title: string; description: string }) {
  return (
    <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-6 hover:border-blue-500/30 transition-all">
      <div className="text-3xl mb-3">{emoji}</div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
    </div>
  )
}
