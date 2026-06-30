import fs from 'fs'
import path from 'path'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { remarkGfm } from 'remark-gfm'
import { remark } from 'remark'

export const metadata = {
  title: 'AI论文摘要工具阅读流水线指南：从发现到深度阅读的完整工作流',
  description: '构建从论文发现到深度理解的完整AI辅助阅读流水线，让阅读效率提升5-10倍。从探索阶段到写作阶段，每步都有AI工具优化方案。',
  keywords: 'AI论文摘要工具,阅读流水线,文献管理,学术工作流,论文筛选,深度阅读,文献综述',
  alternates: {
    canonical: 'https://www.summarizeai.app/blog/w70-ai-paper-summarizer-reading-pipeline-guide/',
  },
  openGraph: {
    title: 'AI论文摘要工具阅读流水线指南：从发现到深度阅读的完整工作流',
    description: '构建从论文发现到深度理解的完整AI辅助阅读流水线，让阅读效率提升5-10倍。',
    type: 'article',
    url: 'https://www.summarizeai.app/blog/w70-ai-paper-summarizer-reading-pipeline-guide/',
    siteName: 'Paper Summarizer',
    images: [
      {
        url: 'https://www.summarizeai.app/og-blog-w70.png',
        width: 1200,
        height: 630,
        alt: 'AI论文摘要工具阅读流水线指南',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI论文摘要工具阅读流水线指南',
    description: '构建从论文发现到深度理解的完整AI辅助阅读流水线。',
    images: ['https://www.summarizeai.app/og-blog-w70.png'],
  },
}

export default async function BlogPost() {
  const mdxPath = path.join(process.cwd(), 'content/w70-ai-paper-summarizer-reading-pipeline-guide.md')
  const source = fs.readFileSync(mdxPath, 'utf8')

  const processed = await remark().use(remarkGfm).process(source)

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4">AI论文摘要工具阅读流水线指南：从发现到深度阅读的完整工作流</h1>
        <div className="text-sm text-gray-500">
          Week 70 · AI学术工作流优化
        </div>
      </header>
      <div className="prose prose-gray max-w-none">
        <MDXRemote source={processed.toString()} />
      </div>
    </article>
  )
}
