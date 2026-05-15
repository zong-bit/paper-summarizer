import Link from 'next/link'

export const metadata = {
  title: 'Tools - Paper Summarizer',
  description: 'AI-powered tools for researchers: paper summarizer, prompt lab, paper QA, comparison, citation export, and literature outline. Free and premium tools to boost your research productivity.',
  keywords: 'AI tools for research, paper summarizer, prompt lab, literature review, academic writing, citation export',
  alternates: {
    canonical: 'https://www.summarizeai.app/tools/',
  },
  openGraph: {
    title: 'Tools - Paper Summarizer',
    description: 'AI-powered tools for researchers to boost productivity.',
    type: 'website',
    url: 'https://www.summarizeai.app/tools/',
    siteName: 'Paper Summarizer',
    images: [
      {
        url: 'https://www.summarizeai.app/og-tools.png',
        width: 1200,
        height: 630,
        alt: 'Tools - Paper Summarizer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_page',
    title: 'Tools - Paper Summarizer',
    description: 'AI-powered tools for researchers.',
    images: ['https://www.summarizeai.app/og-tools.png'],
  },
}

const TOOLS = [
  {
    href: '/tools/prompt-lab',
    icon: '🧪',
    title: 'Prompt Lab',
    desc: '50+ 研究 AI 提示词，按分类整理，直接复制使用',
    tag: 'Free',
    tagColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  {
    href: '/tools/paper-qa',
    icon: '🤖',
    title: 'Paper Q&A',
    desc: '用 AI 对话方式深入理解论文，问答式探索',
    tag: 'Pro',
    tagColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  {
    href: '/tools/paper-compare',
    icon: '⚖️',
    title: '论文对比',
    desc: '并排对比多篇论文的核心发现、方法和结论',
    tag: 'Pro',
    tagColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  {
    href: '/tools/citation-export',
    icon: '📋',
    title: '引用导出',
    desc: '一键导出标准格式的参考文献列表',
    tag: 'Pro',
    tagColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  {
    href: '/tools/literature-outline',
    icon: '📑',
    title: '综述大纲',
    desc: 'AI 自动生成文献综述的结构化大纲',
    tag: 'Pro',
    tagColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
]

export default function ToolsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-bg-card/50 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2 2V5a2 2 0 012 2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-text">Paper Summarizer</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-text-secondary hover:text-text transition-colors text-sm">Home</Link>
            <Link href="/blog" className="text-text-secondary hover:text-text transition-colors text-sm">Blog</Link>
            <Link href="/tools" className="text-primary font-medium text-sm">Tools</Link>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium mb-6">
            🛠️ Research Tools
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text mb-4">
            AI-Powered Research Tools
          </h1>
          <p className="text-xl text-text-secondary mb-2">
            一站式科研工具集
          </p>
          <p className="text-text-secondary text-sm mb-8">
            从论文阅读到文献综述，AI 帮你提升科研效率
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="bg-bg-card border border-border rounded-xl p-6 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all group block"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl">{tool.icon}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tool.tagColor}`}>
                  {tool.tag}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-text mb-1 group-hover:text-primary transition-colors">
                {tool.title}
              </h3>
              <p className="text-text-secondary text-sm">{tool.desc}</p>
              <div className="mt-4 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                使用工具 →
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="p-8 bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 border border-primary/20 rounded-2xl text-center">
          <p className="text-text font-semibold mb-3 text-xl">Ready to summarize your first paper?</p>
          <p className="text-text-secondary text-sm mb-6">
            Paste your paper text or upload a PDF and get an AI summary in seconds.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium text-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2 2V5a2 2 0 012 2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Try Paper Summarizer Free
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-bg-card/50 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex justify-center gap-6 mb-4">
            <Link href="/" className="text-text-secondary hover:text-text transition-colors text-sm">Home</Link>
            <Link href="/blog" className="text-text-secondary hover:text-text transition-colors text-sm">Blog</Link>
            <Link href="/tools" className="text-text-secondary hover:text-text transition-colors text-sm">Tools</Link>
          </div>
          <p className="text-text-secondary text-sm">© 2026 Paper Summarizer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
