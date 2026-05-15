import Link from 'next/link'

export const metadata = {
  title: 'Prompt Lab - 50+ Research AI Prompts | Paper Summarizer',
  description: 'Free collection of 50+ AI prompts for researchers. Organized by category: literature review, paper reading, writing, data analysis, and more. Boost your research productivity.',
  keywords: 'AI prompts for research, research paper prompts, literature review prompts, academic writing prompts, AI prompt library, Prompt Lab',
  alternates: {
    canonical: 'https://www.summarizeai.app/tools/',
  },
  openGraph: {
    title: 'Prompt Lab - 50+ Research AI Prompts | Paper Summarizer',
    description: 'Free collection of 50+ AI prompts for researchers organized by category.',
    type: 'website',
    url: 'https://www.summarizeai.app/tools/',
    siteName: 'Paper Summarizer',
    images: [
      {
        url: 'https://www.summarizeai.app/og-tools.png',
        width: 1200,
        height: 630,
        alt: 'Prompt Lab - Research AI Prompts',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prompt Lab - 50+ Research AI Prompts',
    description: 'Free collection of 50+ AI prompts for researchers.',
    images: ['https://www.summarizeai.app/og-tools.png'],
  },
}

// JSON-LD structured data
const TOOLS_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Prompt Lab - Research AI Prompts',
  description: 'Free collection of 50+ AI prompts for researchers organized by category. Includes literature review, paper reading, academic writing, data analysis, and more.',
  url: 'https://www.summarizeai.app/tools/',
  publisher: {
    '@type': 'Organization',
    name: 'Paper Summarizer',
    url: 'https://www.summarizeai.app',
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'CNY',
    availability: 'https://schema.org/InStock',
  },
}

interface PromptCategory {
  icon: string
  name: string
  desc: string
  prompts: string[]
  color: string
}

const CATEGORIES: PromptCategory[] = [
  {
    icon: '📖',
    name: '文献阅读与理解',
    nameEn: 'Literature Reading & Comprehension',
    desc: '快速理解论文核心内容、方法和结论',
    color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
    prompts: [
      '用中文总结这篇论文的核心贡献、方法和结论，不超过300字。',
      '这篇论文的research gap是什么？作者是如何填补这个gap的？',
      '用通俗语言解释这篇论文的技术方法，适合没有专业背景的人理解。',
      '列出这篇论文的3个主要创新点，并说明它们为什么重要。',
      '这篇论文的实验结果有哪些局限性？作者没有讨论的问题是什么？',
    ],
  },
  {
    icon: '📚',
    name: '文献综述',
    nameEn: 'Literature Review',
    desc: '高效整合多篇文献，构建综述框架',
    color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
    prompts: [
      '基于以下5篇论文，帮我写一段关于XX领域的文献综述，要求指出研究空白。',
      '这3篇论文在研究方法上有什么异同？请用表格对比。',
      '帮我梳理XX领域近3年的研究脉络，列出关键转折点。',
      '从批判性视角分析这组文献的主要争议点。',
      '根据以下摘要，帮我生成一个文献综述的大纲。',
    ],
  },
  {
    icon: '✍️',
    name: '论文写作',
    nameEn: 'Academic Writing',
    desc: '辅助论文各阶段的写作工作',
    color: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
    prompts: [
      '帮我润色这段abstract，使其更符合学术写作规范。',
      '将以下段落改写为更简洁的学术表达。',
      '为这篇论文写一个引言段落，说明研究动机和贡献。',
      '帮我检查这段methodology的逻辑是否严密。',
      '将以下结论部分改写为更有力量的表达，突出研究贡献。',
    ],
  },
  {
    icon: '🔬',
    name: '论文解读',
    nameEn: 'Paper Deep Dive',
    desc: '深入分析论文的技术细节',
    color: 'from-orange-500/20 to-amber-500/20 border-orange-500/30',
    prompts: [
      '用类比的方式解释这篇论文的核心算法。',
      '这篇论文的假设条件是什么？在什么情况下这些假设可能不成立？',
      '帮我分析这篇论文的实验设计，有哪些可以改进的地方？',
      '用伪代码描述这篇论文的核心算法流程。',
      '这篇论文的方法可以迁移到哪些其他领域？为什么？',
    ],
  },
  {
    icon: '📊',
    name: '数据分析',
    nameEn: 'Data Analysis',
    desc: '辅助数据处理和统计分析',
    color: 'from-red-500/20 to-rose-500/20 border-red-500/30',
    prompts: [
      '帮我设计一个实验来验证以下假设。',
      '对于以下数据类型，推荐合适的统计检验方法。',
      '帮我解释这个回归分析的结果，包括系数和显著性。',
      '如何用可视化方式展示这组数据的核心发现？',
      '帮我分析这个数据集的特征分布，找出可能的异常值。',
    ],
  },
  {
    icon: '🌐',
    name: '翻译与跨语言',
    nameEn: 'Translation & Cross-lingual',
    desc: '中英文学术文献互译与理解',
    color: 'from-teal-500/20 to-sky-500/20 border-teal-500/30',
    prompts: [
      '将以下中文摘要翻译为学术风格的英文。',
      '这篇英文论文的中文核心要点是什么？用中文总结。',
      '帮我翻译以下专业术语，确保在学术语境下准确。',
      '将这段中文文献综述改写为英文学术写作风格。',
      '对比中英文对同一概念的表达差异。',
    ],
  },
  {
    icon: '🎯',
    name: '研究选题',
    nameEn: 'Research Topic Discovery',
    desc: '发现研究热点和创新方向',
    color: 'from-indigo-500/20 to-violet-500/20 border-indigo-500/30',
    prompts: [
      '基于以下关键词，帮我推荐5个有研究价值的选题方向。',
      'XX领域目前有哪些未解决的关键问题？',
      '帮我分析这个研究方向的可行性：数据可得性、技术难度、发表前景。',
      '这个选题与创新点X相比，有什么优势和劣势？',
      '帮我生成5个具体的研究问题（research questions）。',
    ],
  },
  {
    icon: '🤖',
    name: 'AI辅助研究',
    nameEn: 'AI-Assisted Research',
    desc: '用AI工具提升科研效率',
    color: 'from-lime-500/20 to-green-500/20 border-lime-500/30',
    prompts: [
      '推荐3款适合处理中文学术论文的AI工具，并说明各自优势。',
      '如何用AI工具快速筛选大量文献的相关性？',
      '帮我设计一个用AI辅助文献阅读的工作流。',
      '以下论文摘要中，哪些最可能与我的研究相关？为什么？',
      '如何用AI工具自动生成参考文献格式？',
    ],
  },
  {
    icon: '📝',
    name: '笔记与知识管理',
    nameEn: 'Notes & Knowledge Management',
    desc: '整理读书笔记和知识体系',
    color: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30',
    prompts: [
      '根据以下论文内容，帮我生成结构化的读书笔记。',
      '帮我用Zettelkasten方法整理这些文献笔记。',
      '从以下笔记中提取关键概念，构建知识图谱。',
      '帮我创建这个研究领域的概念映射图。',
      '将以下零散的阅读笔记整理成一篇有逻辑的综述短文。',
    ],
  },
  {
    icon: '🎓',
    name: '学术汇报',
    nameEn: 'Academic Presentation',
    desc: '准备学术报告与答辩',
    color: 'from-fuchsia-500/20 to-purple-500/20 border-fuchsia-500/30',
    prompts: [
      '帮我准备一个15分钟的学术报告大纲，主题是XX。',
      '根据以下论文，帮我写一个会议poster的内容框架。',
      '帮我预测答辩委员可能提出的5个问题并给出回答建议。',
      '将以下技术内容改写为适合非专业听众的演讲稿。',
      '帮我准备一个3分钟的论文电梯演讲（elevator pitch）。',
    ],
  },
  {
    icon: '💡',
    name: '创意与头脑风暴',
    nameEn: 'Creative Brainstorming',
    desc: '激发研究灵感和创新思路',
    color: 'from-pink-500/20 to-rose-500/20 border-pink-500/30',
    prompts: [
      '基于以下研究背景，帮我 brainstorm 5个创新的研究方向。',
      '如果将A领域的方法应用到B领域，可能产生什么新的研究问题？',
      '帮我从跨学科视角分析这个研究问题。',
      '这个研究结果如果反过来会怎样？有什么有趣的推论？',
      '帮我设计一个反直觉的实验来挑战现有理论。',
    ],
  },
  {
    icon: '📈',
    name: '投稿与发表',
    nameEn: 'Submission & Publication',
    desc: '论文投稿策略与回复审稿人',
    color: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30',
    prompts: [
      '帮我根据以下摘要推荐3个合适的期刊。',
      '帮我写一封cover letter，说明这篇论文的创新性和重要性。',
      '帮我回复以下审稿意见，保持专业且坚定的语气。',
      '这篇论文需要补充哪些实验才能满足顶会的要求？',
      '帮我分析这篇论文的target venue选择是否合理。',
    ],
  },
  {
    icon: '🧪',
    name: '代码与实现',
    nameEn: 'Code & Implementation',
    desc: '辅助编程和代码复现',
    color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30',
    prompts: [
      '用PyTorch实现以下算法的核心模块。',
      '帮我解释这段代码的逻辑，并指出可能的bug。',
      '如何将以下MATLAB代码转换为Python/PyTorch？',
      '帮我优化这段代码的性能，使其适合大规模数据。',
      '为以下函数写一份完整的docstring和单元测试。',
    ],
  },
  {
    icon: '📐',
    name: '方法论',
    nameEn: 'Research Methodology',
    desc: '研究设计与方法论指导',
    color: 'from-slate-500/20 to-gray-500/20 border-slate-500/30',
    prompts: [
      '对于以下研究问题，推荐定量还是定性研究方法？为什么？',
      '帮我设计一个实验的完整方法论部分。',
      '以下研究设计的内部效度和外部效度如何？',
      '帮我选择合适的抽样方法和样本量计算。',
      '这个研究问题适合用case study方法吗？有什么替代方案？',
    ],
  },
  {
    icon: '🔗',
    name: '学术社交与 networking',
    nameEn: 'Academic Networking',
    desc: '学术社交与邮件沟通',
    color: 'from-violet-500/20 to-indigo-500/20 border-violet-500/30',
    prompts: [
      '帮我写一封邮件给潜在的合作者，提出合作意向。',
      '帮我写一封请教邮件给某领域的知名学者。',
      '帮我回复以下审稿意见，语气专业且有说服力。',
      '帮我准备学术会议的茶歇交流话术。',
      '帮我写一封感谢审稿人的回复信。',
    ],
  },
]

export default function ToolsPage() {
  return (
    <div className="min-h-screen flex flex-col">
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
            <Link href="/tools" className="text-primary font-medium text-sm">Prompt Lab</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium mb-6">
            ✨ Free Resource
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text mb-4">
            Prompt Lab
          </h1>
          <p className="text-xl text-text-secondary mb-2">
            50+ AI Prompts for Researchers
          </p>
          <p className="text-text-secondary text-sm mb-8">
            按分类整理的研究AI提示词库，直接复制使用，提升科研效率
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-text-secondary">
            <span>📂 {CATEGORIES.length} 个分类</span>
            <span>•</span>
            <span>💬 {CATEGORIES.reduce((s, c) => s + c.prompts.length, 0)}+ 个提示词</span>
            <span>•</span>
            <span>🆓 完全免费</span>
          </div>
        </div>

        {/* Category Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {CATEGORIES.map((cat, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-br ${cat.color} border rounded-xl p-6 hover:scale-[1.02] transition-transform cursor-default`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{cat.icon}</span>
                <div>
                  <h3 className="text-lg font-semibold text-text">{cat.name}</h3>
                  <p className="text-text-secondary text-xs">{cat.nameEn}</p>
                </div>
              </div>
              <p className="text-text-secondary text-sm mb-4">{cat.desc}</p>
              <div className="space-y-2">
                {cat.prompts.map((prompt, pIdx) => (
                  <div
                    key={pIdx}
                    className="bg-bg-card/80 border border-border/50 rounded-lg p-3 text-sm text-text-secondary hover:text-text transition-colors group relative"
                  >
                    "{prompt}"
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="p-8 bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 border border-primary/20 rounded-2xl text-center">
          <p className="text-text font-semibold mb-3 text-xl">Need help summarizing papers with these prompts?</p>
          <p className="text-text-secondary text-sm mb-6">
            Paper Summarizer makes it easy to get AI-powered summaries of academic papers. Try it free!
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
            Try Paper Summarizer Free
          </a>
        </div>
      </main>

      <footer className="border-t border-border bg-bg-card/50 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex justify-center gap-6 mb-4">
            <Link href="/" className="text-text-secondary hover:text-text transition-colors text-sm">Home</Link>
            <Link href="/blog" className="text-text-secondary hover:text-text transition-colors text-sm">Blog</Link>
            <a href="https://www.summarizeai.app" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-text transition-colors text-sm">Try Summarizer</a>
          </div>
          <p className="text-text-secondary text-sm">© 2026 Paper Summarizer. All rights reserved.</p>
        </div>
      </footer>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(TOOLS_JSON_LD) }}
      />
    </div>
  )
}
