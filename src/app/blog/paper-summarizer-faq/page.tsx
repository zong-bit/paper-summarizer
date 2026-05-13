import Link from 'next/link'
import BlogCTA from '@/components/BlogCTA'

export const metadata = {
  title: 'paper-summarizer FAQ — 常见问题解答 | Paper Summarizer',
  description: '关于 paper-summarizer 的常见问题解答：免费额度、中文支持、数据安全、升级Pro等。',
  keywords: ['paper-summarizer FAQ', 'AI论文摘要工具常见问题', 'Paper Summarizer 帮助', 'AI摘要工具FAQ', '论文摘要工具'],
}

export default function BlogPost() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-bg-card/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2 2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-text">Paper Summarizer</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 max-w-3xl mx-auto px-4 py-8">
        <Link href="/blog" className="text-primary hover:text-primary-dark transition-colors text-sm">← Back to Blog</Link>
        <article className="mt-6 prose prose-invert max-w-none">
          <h1>paper-summarizer FAQ</h1>

          <p>以下是关于 paper-summarizer 的常见问题。如果还有其他疑问，欢迎联系我们。</p>

          <div className="space-y-6 mt-8">
            <div>
              <h2 className="text-lg font-semibold text-text mb-2">Q: 需要注册吗？</h2>
              <p className="text-text-secondary">A: 不需要。打开 summarizeai.app 直接使用。</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-text mb-2">Q: 免费版每天能用几次？</h2>
              <p className="text-text-secondary">A: 每天3次。升级Pro（¥9.9/月）无限使用。</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-text mb-2">Q: 支持中文论文吗？</h2>
              <p className="text-text-secondary">A: 支持。中英文论文都可以。</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-text mb-2">Q: 能上传PDF吗？</h2>
              <p className="text-text-secondary">A: 支持直接粘贴文本，PDF上传功能在开发中。</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-text mb-2">Q: 摘要结果准确吗？</h2>
              <p className="text-text-secondary">A: 经过测试，能准确提取论文核心信息。建议结合人工判断使用。</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-text mb-2">Q: 怎么升级Pro？</h2>
              <p className="text-text-secondary">A: 打开 /premium 页面，选择支付方式。</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-text mb-2">Q: 数据安全吗？</h2>
              <p className="text-text-secondary">A: 你的论文内容仅用于生成摘要，不会存储或分享。</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-text mb-2">Q: 有API吗？</h2>
              <p className="text-text-secondary">A: 开发中，即将上架RapidAPI。</p>
            </div>
          </div>

          <p className="text-text-tertiary text-xs mt-8 pt-4 border-t border-border">© 2025 paper-summarizer | 让每一篇论文的价值，都被高效发现</p>
        </article>
        <div className="mt-8">
          <div className="bg-bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-text mb-2">试试我们的 AI 论文摘要工具</h3>
            <p className="text-text-secondary text-sm mb-4">秒级生成结构化摘要，让你的文献调研效率提升10倍。</p>
            <Link href="/" className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors font-medium text-sm">
              开始使用 Paper Summarizer
            </Link>
          </div>
        </div>
      </main>
      <footer className="border-t border-border bg-bg-card/50 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Link href="/" className="text-primary transition-colors">← Back to Summarizer</Link>
        </div>
      </footer>
    </div>
  )
}
