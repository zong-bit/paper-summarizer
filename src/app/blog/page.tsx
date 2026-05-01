import Link from 'next/link'

const posts = [
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
      </main>

      <footer className="border-t border-border bg-bg-card/50 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Link href="/" className="text-primary hover:text-primary-dark transition-colors">← Back to Summarizer</Link>
        </div>
      </footer>
    </div>
  )
}
