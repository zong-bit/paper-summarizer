import fs from 'fs'
import path from 'path'
import { remark } from 'remark'
import html from 'remark-html'
import Link from 'next/link'
import type { Metadata } from 'next'

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

// All known blog slugs with metadata
const BLOG_POSTS: Record<string, { title: string; description: string }> = {
  'rag-vs-long-context-2026': { title: 'RAG vs 长上下文：LLM 到底该选谁？2026 年最新研究告诉你答案', description: 'RAG（检索增强生成）和扩展长上下文窗口是当前 LLM 落地的两大主流方案。2026 年 5 月最新研究提出让 LLM 自己判断该走哪条路。' },
  '2026-ai-paper-summarization-trends': { title: '2026 AI论文摘要新趋势：大模型如何改变科研阅读方式', description: '多模态理解、推理增强、领域专用模型、实时协作与可解释性——五大趋势解析AI如何重塑科研阅读。' },
  'ai-sheng-cheng-nei-rong-jian-ce-2026': { title: 'AI生成内容检测技术2026：学术论文中的AI写作识别与应对指南', description: '2026年AI生成内容检测技术最新进展。了解AI写作检测工具如何识别AI辅助的学术论文。' },
  'context-contamination-llm-agent': { title: '为什么重试让 LLM Agent 越修越糟？上下文污染问题深度解析', description: 'arXiv最新论文揭示：Agent重试失败后，失败痕迹会"污染"下次尝试，使失败率提高7倍。' },
  'glguard-efficient-llm-guardrail': { title: 'GLiGuard解读：0.3B参数实现27B级AI安全护栏，16倍加速的突破', description: '2026年5月最新论文GLiGuard提出了一种革命性的LLM安全护栏方案。' },
  'matryoshkalora-lora-dynamic-rank-2026': { title: 'MatryoshkaLoRA解读：套娃式LoRA实现动态rank选择，微调效率再升级', description: '2026年5月最新论文MatryoshkaLoRA提出了一种革命性的LoRA微调框架。' },
  'how-value-induction-reshapes-llm-behavior-2026': { title: '给AI"灌鸡汤"反而有害？价值诱导的连锁反应解读', description: '2026年5月最新论文揭示：给AI"灌输"某种价值观会产生意想不到的连锁反应。' },
  'beyond-pairs-preference-graph-dpo-2026': { title: '大模型的"秘密偏好图"：Beyond Pairs论文解读', description: '2026年5月最新论文Beyond Pairs揭示：大模型在DPO训练时隐式优化一个偏好图。' },
  '深度学习自然语言处理最新突破-2026': { title: '深度学习在自然语言处理中的最新突破：2026年NLP技术全景解读', description: '系统梳理2025-2026年NLP六大核心突破。' },
  'tool-calling-reasoning-2026': { title: 'AI Agent"思考"如何用工具？2026年工具调用推理研究全景解读', description: '系统梳理2025-2026年工具调用推理领域的核心论文、技术进展。' },
  'agentic-ai-scientific-research-2026': { title: 'AI Agent重塑科研范式：从文献检索到论文撰写的自动化革命', description: '深度解读Stanford Agent Laboratory、Google DeepMind ChemCrow、Meta AutoResearch三大里程碑。' },
  'ai-citation-management-academic-research-2026': { title: '2026年AI学术引用管理完全指南：让参考文献管理效率提升10倍', description: '深入探讨AI在学术引用管理中的应用。' },
  'long-context-ai-paper-reading-2026': { title: '长上下文AI如何改变论文阅读？2026年百万Token上下文革命解读', description: '深度解析长上下文技术如何重塑AI论文摘要。' },
  'paper-reading-efficiency-guide-2026': { title: '论文阅读效率提升指南：用AI工具每天高效阅读10篇论文', description: '系统性论文阅读工作流：从文献筛选到深度精读。' },
  'ai-lun-wen-zhai-yao-gong-ju-zen-me-xuan': { title: 'AI论文摘要工具怎么选？AI摘要与人工摘要的深度对比', description: 'AI摘要与人工摘要的深度对比：速度、规模、深度、批判性思维等10个维度全面评测。' },
  'ai-lun-wen-zhai-yao-gong-ju-shi-yong-zhi-nan-2026': { title: 'AI论文摘要工具使用指南2026：从入门到精通', description: '手把手教你使用AI论文摘要工具。' },
  'ai-paper-summary-chinese-support-review-2026': { title: 'AI论文摘要工具中文支持深度测评', description: '中文论文用AI摘要靠谱吗？实测6款主流AI论文摘要工具的中文支持能力。' },
  'ai-paper-summary-hallucination-2026': { title: 'AI论文摘要的"幻觉"真相：2026年研究者必须知道的6种陷阱与应对指南', description: '2026年AI幻觉问题引发学术信任危机。' },
  'future-trends-ai-paper-summarizer': { title: 'AI论文摘要工具的未来趋势：2026-2027年展望', description: '深度解析AI论文摘要工具的四大未来趋势。' },
  'how-to-verify-ai-paper-summaries-accuracy': { title: '如何验证AI论文摘要的准确性：研究者必读的核实指南', description: '本文提供7个实用的验证方法，帮助研究者快速判断AI摘要质量。' },
  'ru-he-yong-ai-kuai-su-yue-du-ying-wen-wen-xian': { title: '如何用AI快速阅读英文文献：非英语母语研究者的终极指南', description: '非英语母语研究者如何用AI工具快速阅读英文文献。' },
  'ai-research-productivity-guide-2026': { title: '2026研究生科研效率革命：AI论文工具全攻略', description: '2026年研究生必备科研效率提升指南。' },
  'ai-wen-xian-zong-shu-gong-ju-2026': { title: 'AI文献综述工具推荐：2026年用AI写文献综述的正确姿势', description: '精选5款AI文献综述工具深度测评。' },
  '5款免费论文摘要工具对比': { title: '5款免费论文摘要工具横向对比（2025实测）', description: '实测5款主流论文摘要工具。' },
  '摘要质量真实测试': { title: 'paper-summarizer 摘要质量怎么样？真实测试', description: '选取3篇不同领域论文做真实测试。' },
  'paper-summarizer-faq': { title: 'paper-summarizer FAQ — 常见问题解答', description: '关于 paper-summarizer 的常见问题。' },
  '论文润色降重工具推荐-2026': { title: '2026年论文润色与降重工具推荐及使用技巧全攻略', description: '精选8款论文润色与降重工具对比。' },
  'ai-vs-human-summary': { title: 'AI论文摘要工具 vs 手动摘要：哪个更适合你的科研需求？', description: '从速度、准确性、多语言支持等维度深度对比。' },
  'ai-paper-summarizer-tools-comparison-2026': { title: 'AI论文摘要工具大对比：2026年最佳论文总结工具测评与选择指南', description: '深度测评6款主流AI论文摘要工具。' },
  'latent-planning-in-llms-2026': { title: 'AI模型会"提前计划"吗？2026年最新研究揭示大模型的"思维路线图"', description: '解读arXiv最新论文"Where\'s the Plan?"。' },
  'ai-literature-review-workflow-2026': { title: 'AI文献综述工作流2026：从文献检索到综述撰写的全流程指南', description: '手把手教你用AI工具完成一篇完整的文献综述。' },
  'ai-paper-summary-tool-comparison-2026': { title: 'AI论文摘要工具对比2026：哪款最适合你的研究？', description: '对比市面上主流AI论文摘要工具。' },
  'the-future-of-academic-reading-with-ai': { title: 'The Future of Academic Reading: How AI Is Changing Research', description: 'How AI summarization tools are transforming the way researchers consume literature.' },
  'ai-vs-manual-summarizing-which-is-better': { title: 'AI vs Manual Summarizing: Which Is Better for Researchers?', description: 'A honest comparison of AI summarization vs reading papers yourself.' },
  'how-to-write-a-literature-review-faster': { title: 'How to Write a Literature Review Faster Using AI Summarizers', description: 'Speed up your literature review process with AI-powered paper summarization.' },
  'how-to-summarize-a-research-paper-in-5-minutes': { title: 'How to Summarize a Research Paper in 5 Minutes with AI', description: 'Learn how to quickly extract key findings from any academic paper using our free AI summarizer.' },
  'best-ai-tools-for-academic-paper-summary': { title: 'Best AI Tools for Academic Paper Summary in 2025', description: 'Compare the top AI paper summarizers.' },
  'how-to-extract-key-findings-from-pdf-papers': { title: 'How to Extract Key Findings from PDF Papers Instantly', description: 'Stop reading entire papers. Learn to extract methodology, results, and conclusions in seconds.' },
  'common-mistakes-when-summarizing-academic-papers': { title: 'Common Mistakes When Summarizing Academic Papers (And How to Avoid Them)', description: 'Avoid these pitfalls when summarizing research papers for better accuracy.' },
  'why-every-graduate-student-needs-an-ai-summarizer': { title: 'Why Every Graduate Student Needs an AI Paper Summarizer', description: 'Save dozens of hours per semester with AI-assisted paper reading.' },
  'how-to-summarize-multiple-papers-at-once': { title: 'How to Summarize Multiple Papers at Once: A Practical Guide', description: 'Batch process your reading list with AI summarization techniques.' },
  'ai-for-academic-writing': { title: '研究生必备：5个提高论文写作效率的AI工具', description: '研究生写论文的痛苦，只有经历过的人才懂。本文推荐5个研究生必备的AI工具。' },
  'ai-side-hustle-100': { title: '零基础用AI做副业：3个日赚100的方法', description: '2025年，AI不再是程序员和科技公司的专属。零基础普通人也能用AI做副业赚钱。' },
  'ai-academic-writing-assistance-2026': { title: 'AI学术写作辅助工具2026：从文献综述到论文发表的全流程指南', description: '2026年AI学术写作辅助工具全景测评。' },
  'free-ai-tools-2025': { title: '2025年免费AI工具推荐：学生党必备的5个神器', description: '推荐5款真正好用、完全免费的AI神器，亲测有效。' },
  'chinese-ai-comparison': { title: '2025年中国AI工具大对比：从ChatGPT到国产大模型', description: '深度对比ChatGPT、通义千问、文心一言、Kimi等主流AI工具。' },
  'paper-summarizer-comparison': { title: 'Paper Summarizer vs 其他AI论文摘要工具对比', description: 'Paper Summarizer与ChatPDF、Scispace、Elicit等主流工具的全面对比。' },
  'paper-reading-workflow-2025': { title: '2025年论文阅读工作流：从文献检索到深度精读的全流程', description: '系统性论文阅读方法，结合AI工具提升阅读效率。' },
  '2026-05-11-xlstm-paper-interpretation': { title: '【论文解读】xLSTM：让LSTM在Transformer时代重新杀回擂台！', description: '解读SAP研究院最新论文xLSTM。' },
  '2026-05-11-ai-paper-summarizer-comparison': { title: '2026年AI论文摘要工具对比：哪款最适合中国用户？', description: '全面对比国内外主流AI论文摘要工具。' },
  '2026-05-12-lora-peft-efficient-fine-tuning': { title: 'LoRA/PEFT高效微调技术详解：用小预算获得大模型能力', description: '详解LoRA、LoRA+、QLoRA等高效微调技术。' },
  '2026-05-12-autotts-test-time-scaling': { title: 'Test-Time Scaling（TTS）技术解读：推理时动态调整算力', description: '解读2026年最新研究Test-Time Scaling。' },
  '2026-05-12-rag-academic-research-guide': { title: 'RAG在学术研究中的应用指南：从原理到实践', description: '手把手教你用RAG技术构建学术研究知识库。' },
  '2026-05-12-ai-lun-wen-zhai-yao-gong-ju-tui-jian': { title: '2026年AI论文摘要工具推荐：从入门到进阶', description: '精选多款AI论文摘要工具。' },
  '2026-05-12-ai-paper-reading-workflow-2026': { title: '2026年AI论文阅读工作流：用AI工具每天高效阅读10篇论文', description: '系统性论文阅读工作流，结合AI论文摘要、文献管理、笔记整理等工具。' },
  '2026-05-13-ai-wen-xian-zong-shu-gong-ju-tui-jian': { title: 'AI文献综述工具推荐：2026年用AI写文献综述的正确姿势', description: '精选5款AI文献综述工具深度测评。' },
  '2026-05-13-ai-lun-wen-zhai-yao-dui-bi': { title: 'AI论文摘要工具对比：2026年最新版', description: '2026年最新AI论文摘要工具横向对比。' },
  '2026-05-13-LLM-context-contamination-jie-xi': { title: '为什么重试让 LLM Agent 越修越糟？上下文污染问题深度解析', description: 'arXiv最新论文揭示：Agent重试失败后，失败痕迹会"污染"下次尝试。' },
  '2026-05-14-ai-lun-wen-zhai-yao-dui-bi': { title: '2026年5月AI论文摘要工具最新对比', description: '最新评测：6款主流AI论文摘要工具在中文支持、摘要质量、价格等方面的对比。' },
  '2026-05-14-rag-vs-long-context': { title: 'RAG vs 长上下文：LLM 到底该选谁？2026 年最新研究告诉你答案', description: 'RAG（检索增强生成）和扩展长上下文窗口是当前 LLM 落地的两大主流方案。' },
  '2026-05-14-bo-shi-sheng-he-yong-AI-ti-gao-ke-yan-xiao-lv': { title: '博士生如何用AI提高科研效率：从文献阅读到论文发表', description: '博士生科研效率提升指南：从文献检索、AI论文摘要、文献综述到论文发表。' },
  '2026-05-15-ai-lun-wen-zhai-yao-gong-ju-dui-bi': { title: '2026年5月AI论文摘要工具终极对比', description: '终极对比：6款主流AI论文摘要工具在中文支持、摘要质量、价格、功能等方面的全面评测。' },
  'week19-yong-ai-kuai-su-shai-xuan-lun-wen': { title: '如何用AI在5分钟内判断一篇论文是否值得精读：科研效率的降维打击', description: '面对海量论文，用AI快速筛选，把时间花在真正值得精读的论文上。' },
  'week20-fu-xian-lun-wen-shi-yan-jie-guo': { title: '如何用AI工具快速复现一篇论文的实验结果：科研人员的完整指南', description: '论文读完了，结论很有意思，但你想验证一下——AI能帮你把复现时间从两周缩短到两天。' },
  'week21-yong-AI-shi-xian-lun-wen-san-ceng-yue-du-fa': { title: '用AI实现论文"三层阅读法"：让每篇论文的阅读效率提升5倍', description: '用AI辅助的"三层阅读法"，你只需要精读其中20%，就能掌握一个领域80%的核心知识。' },
  'week22-xue-shu-fa-xian-gong-ju-dui-bi': { title: 'Connected Papers vs ResearchRabbit vs Elicit：2026年学术发现工具横评', description: '三大学术发现工具深度对比，帮你找到最适合的学术文献发现工具。' },
  'week23-yong-ai-gong-ju-bi-jiao-xuan-ze-zhi-nan': { title: '2026年AI论文摘要工具全对比：哪款最适合你？', description: '本文原创于 Paper Summarizer，发布于 2026年5月15日。免费使用，无需注册。' },
}

// Get all available blog slugs from filesystem
function getAvailableSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return []
  return fs.readdirSync(BLOG_DIR)
    .filter(f => f.endsWith('.md') || f.endsWith('.mdx'))
    .map(f => f.replace(/\.(md|mdx)$/, ''))
}

export async function generateStaticPaths() {
  const slugs = getAvailableSlugs()
  return {
    paths: slugs.map(slug => ({ params: { slug } })),
    fallback: false,
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params
  const knownPost = BLOG_POSTS[slug]
  const title = knownPost?.title || slug
  const description = knownPost?.description || `Read about ${slug} on Paper Summarizer Blog`

  const canonicalUrl = `https://www.summarizeai.app/blog/${slug}`
  const ogImage = `https://www.summarizeai.app/og-blog.png`

  return {
    title: `${title} | Paper Summarizer`,
    description,
    keywords: ['AI paper summarizer', 'research paper summary', 'AI academic tools', 'Paper Summarizer'],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      url: canonicalUrl,
      siteName: 'Paper Summarizer',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

interface BlogPageProps {
  params: { slug: string }
}

// Read and parse markdown file
async function getPostContent(slug: string): Promise<string | null> {
  if (!fs.existsSync(BLOG_DIR)) return null
  
  const mdPath = path.join(BLOG_DIR, `${slug}.md`)
  const mdxPath = path.join(BLOG_DIR, `${slug}.mdx`)
  
  const filePath = fs.existsSync(mdPath) ? mdPath : (fs.existsSync(mdxPath) ? mdxPath : null)
  if (!filePath) return null
  
  const raw = fs.readFileSync(filePath, 'utf-8')
  
  // Parse frontmatter if present
  let content = raw
  let title = slug
  let description = slug
  
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/
  const match = raw.match(frontmatterRegex)
  if (match) {
    const fm = match[1]
    content = match[2]
    const titleMatch = fm.match(/title:\s*["']?([^"'\n]+)["']?/)
    const descMatch = fm.match(/description:\s*["']?([^"'\n]+)["']?/)
    if (titleMatch) title = titleMatch[1]
    if (descMatch) description = descMatch[1]
  }
  
  // Convert markdown to HTML
  const processed = await remark().use(html).process(content)
  return processed.toString()
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { slug } = params
  const htmlContent = await getPostContent(slug)
  const knownPost = BLOG_POSTS[slug]
  const title = knownPost?.title || slug
  const description = knownPost?.description || `Read about ${slug} on Paper Summarizer Blog`

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    url: `https://www.summarizeai.app/blog/${slug}`,
    author: {
      '@type': 'Organization',
      name: 'Paper Summarizer',
      url: 'https://www.summarizeai.app',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Paper Summarizer',
      url: 'https://www.summarizeai.app',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.summarizeai.app/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.summarizeai.app/blog/${slug}`,
    },
  }

  if (!htmlContent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-text mb-4">Post not found</h1>
        <Link href="/blog" className="text-primary hover:underline">← Back to Blog</Link>
      </div>
    )
  }

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
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-4 py-8">
        <Link href="/blog" className="text-primary hover:text-primary-dark transition-colors text-sm">← Back to Blog</Link>
        <article className="mt-6 prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: htmlContent }} />
        
        <div className="mt-8 pt-4 border-t border-border/50">
          <div className="flex gap-3">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title + ' - Paper Summarizer')}&url=${encodeURIComponent('https://www.summarizeai.app/blog/' + slug)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-dark transition-colors text-sm"
            >
              Share on Twitter
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://www.summarizeai.app/blog/' + slug)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-dark transition-colors text-sm"
            >
              Share on LinkedIn
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <h2 className="text-2xl font-bold text-text mb-6">FAQ</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-text">What is Paper Summarizer?</h3>
              <p className="text-text-secondary">Paper Summarizer is a free AI-powered tool that summarizes academic papers and research documents. Upload a PDF or paste text to get key findings, methodology, and conclusions in seconds.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text">Is Paper Summarizer free to use?</h3>
              <p className="text-text-secondary">Yes! Paper Summarizer offers a generous free tier. You can summarize papers without any cost. Premium plans are available for heavy users.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text">Does it support Chinese papers?</h3>
              <p className="text-text-secondary">Yes, Paper Summarizer supports both English and Chinese academic papers. The AI can understand and summarize content in multiple languages.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 p-6 bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 border border-primary/20 rounded-2xl text-center">
          <p className="text-text font-semibold mb-3">Try Paper Summarizer ✨</p>
          <p className="text-text-secondary text-sm mb-4">Upload a PDF or paste any academic paper to get an AI-powered summary in seconds.</p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2 2V5a2 2 0 012 2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Try Free AI Summarizer
          </a>
        </div>
      </main>

      <footer className="border-t border-border bg-bg-card/50 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Link href="/" className="text-primary transition-colors">← Back to Summarizer</Link>
        </div>
      </footer>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  )
}
