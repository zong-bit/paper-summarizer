import Link from 'next/link'

const posts = [
  { slug: '5款免费论文摘要工具对比', title: '5款免费论文摘要工具横向对比（2025实测）', desc: '实测5款主流论文摘要工具，从免费额度、中文支持到AI摘要质量，一篇帮你选对。' },
  { slug: '摘要质量真实测试', title: 'paper-summarizer 摘要质量怎么样？真实测试', desc: '选取3篇不同领域论文做真实测试，分享摘要准确性评估结果和使用建议。' },
  { slug: 'paper-summarizer-faq', title: 'paper-summarizer FAQ — 常见问题解答', desc: '关于 paper-summarizer 的常见问题：免费额度、中文支持、数据安全、升级Pro等。' },
  { slug: 'how-to-summarize-a-research-paper-in-5-minutes', title: 'How to Summarize a Research Paper in 5 Minutes with AI', desc: 'Learn how to quickly extract key findings from any academic paper using our free AI summarizer.' },
  { slug: 'best-ai-tools-for-academic-paper-summary', title: 'Best AI Tools for Academic Paper Summary in 2025', desc: 'Compare the top AI paper summarizers and find out which one saves you the most time.' },
  { slug: 'how-to-write-a-literature-review-faster', title: 'How to Write a Literature Review Faster Using AI Summarizers', desc: 'Speed up your literature review process with AI-powered paper summarization.' },
  { slug: 'ai-vs-manual-summarizing-which-is-better', title: 'AI vs Manual Summarizing: Which Is Better for Researchers?', desc: 'A honest comparison of AI summarization vs reading papers yourself.' },
  { slug: 'how-to-extract-key-findings-from-pdf-papers', title: 'How to Extract Key Findings from PDF Papers Instantly', desc: 'Stop reading entire papers. Learn to extract methodology, results, and conclusions in seconds.' },
  { slug: 'common-mistakes-when-summarizing-academic-papers', title: 'Common Mistakes When Summarizing Academic Papers (And How to Avoid Them)', desc: 'Avoid these pitfalls when summarizing research papers for better accuracy.' },
  { slug: 'why-every-graduate-student-needs-an-ai-summarizer', title: 'Why Every Graduate Student Needs an AI Paper Summarizer', desc: 'Save dozens of hours per semester with AI-assisted paper reading.' },
  { slug: 'how-to-summarize-multiple-papers-at-once', title: 'How to Summarize Multiple Papers at Once: A Practical Guide', desc: 'Batch process your reading list with AI summarization techniques.' },
  { slug: 'the-future-of-academic-reading-with-ai', title: 'The Future of Academic Reading: How AI Is Changing Research', desc: 'How AI summarization tools are transforming the way researchers consume literature.' },
  { slug: 'top-10-research-papers-on-machine-learning-2025', title: 'Top 10 Research Papers on Machine Learning in 2025 (Summarized)', desc: 'Our AI summarizes the most impactful ML papers of the year.' },
  { slug: 'ai-vs-human-summary', title: 'AI论文摘要工具 vs 手动摘要：哪个更适合你的科研需求？', desc: '从速度、准确性、多语言支持等维度深度对比AI摘要与人工摘要，告诉你如何结合两者优势提升科研效率。' },
  { slug: '2026-ai-paper-summarization-trends', title: '2026 AI论文摘要新趋势：大模型如何改变科研阅读方式', desc: '多模态理解、推理增强、领域专用模型、实时协作与可解释性——五大趋势解析AI如何重塑科研阅读。' },
  { slug: 'llm-inference-acceleration-guide', title: 'LLM推理加速技术全景指南：从原理到实践', desc: '深入解析量化、KV Cache、投机解码、MoE、PagedAttention等六大核心技术，理解AI论文摘要背后的推理加速原理。' },
  { slug: 'ai-paper-summarizer-tools-comparison-2025', title: 'AI论文摘要工具怎么选？2025年最新评测与避坑指南', desc: '评测8款主流AI论文摘要工具（paper-summarizer、Scholarcy、Elicit、SciSpace等），从摘要质量、中文支持、价格多维度对比，含避坑指南。' },
  { slug: 'latent-planning-in-llms-2026', title: 'AI模型会"提前计划"吗？2026年最新研究揭示大模型的"思维路线图"', desc: '解读arXiv最新论文"Where\'s the Plan?"，揭示Gemma-3如何在内部"提前计划"未来输出，以及这对AI论文摘要工具的深远影响。' },
  { slug: 'glguard-efficient-llm-guardrail', title: 'GLiGuard解读：0.3B参数实现27B级AI安全护栏，16倍加速的突破', desc: '2026年5月最新论文GLiGuard提出了一种革命性的LLM安全护栏方案：仅用0.3B参数（比传统方案小90倍）实现与7B-27B模型相当的检测精度，推理速度提升16倍。' },
  { slug: 'long-context-ai-paper-reading-2026', title: '长上下文AI如何改变论文阅读？2026年百万Token上下文革命解读', desc: '深度解析长上下文技术如何重塑AI论文摘要——从RoPE位置编码到FlashAttention，含模型对比、实战指南和SEO优化。' },
  { slug: 'paper-reading-efficiency-guide-2026', title: '论文阅读效率提升指南：用AI工具每天高效阅读10篇论文', desc: '系统性论文阅读工作流：从文献筛选到深度精读，用AI论文摘要工具将阅读效率提升10倍。含具体方法、工具推荐和实操步骤。' },
]

export const metadata = {
  title: 'Blog - Paper Summarizer | AI Research Tips',
  description: 'Learn how to summarize academic papers efficiently with AI. Tips, guides, and best practices for researchers and students.',
}

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-bg-card/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-text">Paper Summarizer</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-text mb-2">Paper Summarizer Blog</h1>
        <p className="text-text-secondary mb-8">Tips and guides for summarizing academic papers with AI.</p>
        
        <div className="grid gap-6">
          {posts.map(post => (
            <Link key={post.slug} href={"/blog/" + post.slug} className="block bg-bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors">
              <h2 className="text-xl font-semibold text-text mb-2">{post.title}</h2>
              <p className="text-text-secondary">{post.desc}</p>
            </Link>
          ))}
        </div>
              <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 border border-primary/20 rounded-2xl text-center">
          <p className="text-text font-semibold mb-3">Try It Yourself ✨</p>
          <p className="text-text-secondary text-sm mb-4">Upload a PDF or paste any academic paper to get an AI-powered summary with key findings, methodology, and conclusions — in seconds.</p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Try Free AI Summarizer
          </a>
        </div>
      </main>

      <footer className="border-t border-border bg-bg-card/50 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Link href="/" className="text-primary hover:text-primary-dark transition-colors">← Back to Summarizer</Link>
        </div>
      </footer>
    </div>
  )
}
