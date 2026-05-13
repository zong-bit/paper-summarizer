import Link from 'next/link'

const posts = [
  { slug: 'rag-vs-long-context-2026', title: 'RAG vs 长上下文：LLM 到底该选谁？2026 年最新研究告诉你答案', desc: 'RAG（检索增强生成）和扩展长上下文窗口是当前 LLM 落地的两大主流方案。2026 年 5 月最新研究提出让 LLM 自己判断该走哪条路，帮你理清思路找到最适合的方案。' },
  { slug: 'context-contamination-llm-agent', title: '为什么重试让 LLM Agent 越修越糟？上下文污染问题深度解析', desc: 'arXiv最新论文揭示：Agent重试失败后，失败痕迹会"污染"下次尝试，使失败率提高7倍。首个数学模型CCRM给出最优重试策略。' },
  { slug: 'ai-research-productivity-guide-2026', title: '2026研究生科研效率革命：AI论文工具全攻略，从文献阅读到论文发表', desc: '2026年研究生必备科研效率提升指南：从文献检索、AI论文摘要、文献综述撰写到论文发表，全覆盖8大AI工具与实操工作流。附完整时间表：如何用AI将论文写作周期从3个月压缩到3周。' },
  { slug: 'ai-wen-xian-zong-shu-gong-ju-2026', title: 'AI文献综述工具推荐：2026年用AI写文献综述的正确姿势（附实操教程）', desc: '精选5款AI文献综述工具深度测评，从摘要生成到参考文献管理全覆盖。附完整新手实操教程：如何用AI在3天内完成一篇高质量的文献综述初稿。' },
  { slug: 'ai-lun-wen-zhai-yao-gong-ju-xuan-ze', title: 'AI论文摘要工具怎么选？AI摘要与人工摘要的深度对比', desc: 'AI摘要与人工摘要的深度对比：速度、规模、深度、批判性思维、跨领域理解等10个维度全面评测，帮你找到最适合的摘要方式。' },
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
  { slug: 'ai-paper-summarizer-tools-comparison-2026', title: 'AI论文摘要工具大对比：2026年最佳论文总结工具测评与选择指南', desc: '深度测评6款主流AI论文摘要工具（Paper Summarizer、ChatPDF、Scispace、Elicit、Consensus、ChatDOC），从摘要准确率、中文支持、批量处理、价格等12个维度客观对比。' },
  { slug: 'latent-planning-in-llms-2026', title: 'AI模型会"提前计划"吗？2026年最新研究揭示大模型的"思维路线图"', desc: '解读arXiv最新论文"Where\'s the Plan?"，揭示Gemma-3如何在内部"提前计划"未来输出，以及这对AI论文摘要工具的深远影响。' },
  { slug: 'glguard-efficient-llm-guardrail', title: 'GLiGuard解读：0.3B参数实现27B级AI安全护栏，16倍加速的突破', desc: '2026年5月最新论文GLiGuard提出了一种革命性的LLM安全护栏方案：仅用0.3B参数（比传统方案小90倍）实现与7B-27B模型相当的检测精度，推理速度提升16倍。' },
  { slug: 'long-context-ai-paper-reading-2026', title: '长上下文AI如何改变论文阅读？2026年百万Token上下文革命解读', desc: '深度解析长上下文技术如何重塑AI论文摘要——从RoPE位置编码到FlashAttention，含模型对比、实战指南和SEO优化。' },
  { slug: 'paper-reading-efficiency-guide-2026', title: '论文阅读效率提升指南：用AI工具每天高效阅读10篇论文', desc: '系统性论文阅读工作流：从文献筛选到深度精读，用AI论文摘要工具将阅读效率提升10倍。含具体方法、工具推荐和实操步骤。' },
  { slug: '论文润色降重工具推荐-2026', title: '2026年论文润色与降重工具推荐及使用技巧全攻略', desc: '精选8款论文润色与降重工具（Grammarly、QuillBot、Turnitin等），对比功能与价格，分享降重实操技巧，帮你高效通过查重。' },
  { slug: 'matryoshkalora-lora-dynamic-rank-2026', title: 'MatryoshkaLoRA解读：套娃式LoRA实现动态rank选择，微调效率再升级', desc: '2026年5月最新论文MatryoshkaLoRA提出了一种革命性的LoRA微调框架：通过"套娃"式层次化低秩表示，实现动态rank选择，无需网格搜索即可在不同计算预算下获得最优微调效果。' },
  { slug: 'how-value-induction-reshapes-llm-behavior-2026', title: '给AI"灌鸡汤"反而有害？价值诱导的连锁反应解读', desc: '2026年5月最新论文揭示：给AI"灌输"某种价值观会产生意想不到的连锁反应——所有价值诱导都会让模型变得更"讨好型人格"。深度解读这一发现对AI论文摘要工具的启示。' },
  { slug: 'beyond-pairs-preference-graph-dpo-2026', title: '大模型的"秘密偏好图"：Beyond Pairs论文解读——你的AI正在优化一个你看不见的关系网', desc: '2026年5月最新论文Beyond Pairs揭示：大模型在DPO训练时隐式优化一个偏好图。GraphDPO将这一结构显式化，在多个基准上显著优于DPO。深度解读技术原理及其对AI论文摘要工具的深远影响。' },
  { slug: '深度学习自然语言处理最新突破-2026', title: '深度学习在自然语言处理中的最新突破：2026年NLP技术全景解读', desc: '系统梳理2025-2026年NLP六大核心突破：推理能力飞跃、多模态融合、高效微调、长上下文处理、AI代理、推理加速，以及它们对AI论文摘要工具的深远影响。' },
  { slug: 'tool-calling-reasoning-2026', title: 'AI Agent"思考"如何用工具？2026年工具调用推理研究全景解读', desc: '系统梳理2025-2026年工具调用推理领域的核心论文、技术进展，以及这些突破如何直接影响AI论文摘要工具（如Paper Summarizer）的能力边界。' },
  { slug: 'agentic-ai-scientific-research-2026', title: 'AI Agent重塑科研范式：从文献检索到论文撰写的自动化革命', desc: '深度解读Stanford Agent Laboratory、Google DeepMind ChemCrow、Meta AutoResearch三大里程碑，详解AI Agent在科研全流程中的六大应用场景及未来趋势。' },
  { slug: 'ai-citation-management-academic-research-2026', title: '2026年AI学术引用管理完全指南：让参考文献管理效率提升10倍', desc: '深入探讨AI在学术引用管理中的应用：智能文献推荐、自动引用格式生成、知识图谱构建、引用上下文理解。含前沿论文解读、工具对比和实操指南。' },
]


export const metadata = {
  title: 'Blog - Paper Summarizer | AI Research Tips',
  description: 'Learn how to summarize academic papers efficiently with AI. Tips, guides, and best practices for researchers and students.',
  keywords: 'AI paper summarizer, research paper summary, AI literature review, academic paper tools, paper reading tips',
  alternates: {
    canonical: 'https://www.summarizeai.app/blog/',
  },
  openGraph: {
    title: 'Blog - Paper Summarizer | AI Research Tips',
    description: 'Learn how to summarize academic papers efficiently with AI. Tips, guides, and best practices for researchers and students.',
    type: 'website',
    url: 'https://www.summarizeai.app/blog/',
    siteName: 'Paper Summarizer',
    images: [
      {
        url: 'https://www.summarizeai.app/og-blog.png',
        width: 1200,
        height: 630,
        alt: 'Paper Summarizer Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - Paper Summarizer | AI Research Tips',
    description: 'Learn how to summarize academic papers efficiently with AI.',
    images: ['https://www.summarizeai.app/og-blog.png'],
  },
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
