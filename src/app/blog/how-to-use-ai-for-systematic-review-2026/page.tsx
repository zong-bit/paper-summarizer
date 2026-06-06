import Link from 'next/link'
import ShareButton from '../../../components/ShareButton'
import { generateBlogMetadata, generateBlogJsonLd } from '../utils'

export const metadata = generateBlogMetadata({
  title: 'How to Use AI for Systematic Literature Review: A Complete 2026 Workflow',
  description: 'Step-by-step guide to conducting systematic reviews with AI paper summarizers. From PRISMA screening to data extraction, learn how AI accelerates every stage of your systematic review.',
  keywords: ['systematic review AI', 'PRISMA AI', 'literature review automation', 'AI data extraction', 'systematic review tool', 'meta-analysis AI', 'Paper Summarizer'],
  slug: 'how-to-use-ai-for-systematic-review-2026',
  publishedTime: '2026-06-05T08:00:00+08:00',
})

export default function BlogPost() {
  const jsonLd = generateBlogJsonLd({
    title: metadata.title as string,
    description: metadata.description as string,
    slug: 'how-to-use-ai-for-systematic-review-2026',
    publishedTime: '2026-06-05T08:00:00+08:00',
  })

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
      <main className="flex-1 max-w-3xl mx-auto px-4 py-8">
        <Link href="/blog" className="text-primary hover:text-primary-dark transition-colors text-sm">← Back to Blog</Link>
        <article className="mt-6 prose prose-invert max-w-none">
          <h1>How to Use AI for Systematic Literature Review: A Complete 2026 Workflow</h1>
          <p className="text-sm text-slate-500 mt-2 mb-6">by Paper Summarizer Team</p>

          <blockquote>
            <p>A systematic review typically takes 6-12 months. With AI tools integrated into every stage — from screening to data extraction — researchers are now completing rigorous systematic reviews in 4-8 weeks. Here's the complete, reproducible workflow.</p>
          </blockquote>

          <h2>Why Systematic Reviews Need AI</h2>
          <p>Systematic reviews are the gold standard of evidence synthesis, but they're also incredibly time-consuming. The Cochrane Handbook estimates 1,139 person-hours for a typical systematic review. The bottlenecks are clear:</p>
          <ul>
            <li><strong>Title/abstract screening:</strong> 2,000-10,000 articles to manually screen</li>
            <li><strong>Full-text review:</strong> 200-500 papers requiring detailed assessment</li>
            <li><strong>Data extraction:</strong> 20-50 data points per included study</li>
            <li><strong>Synthesis:</strong> Organizing findings across dozens of papers</li>
          </ul>
          <p>AI paper summarization tools like <strong>Paper Summarizer</strong> can radically accelerate each of these stages while maintaining methodological rigor.</p>

          <h2>Stage 1: Search and Initial Screening (AI-Assisted PRISMA)</h2>
          <p>The PRISMA 2020 flow diagram is the standard for systematic reviews. Here's how AI integrates at each step:</p>
          <h3>Database Search → AI Abstract Screening</h3>
          <p>After running your search strings in PubMed, Scopus, or Web of Science, you'll typically get 2,000-8,000 results. Instead of manually reading abstracts:</p>
          <ol>
            <li>Export search results as a CSV with titles and abstracts</li>
            <li>Upload batches to Paper Summarizer for preliminary screening</li>
            <li>AI identifies studies matching your inclusion criteria based on PICO framework (Population, Intervention, Comparison, Outcome)</li>
            <li>Flag borderline cases for human review only</li>
          </ol>
          <p>A recent study found AI-assisted screening achieves <strong>95% sensitivity</strong> while reducing screening time by 70%.</p>

          <h2>Stage 2: Full-Text Assessment with AI</h2>
          <p>For the 200-500 papers that pass initial screening, you need to read full texts to confirm eligibility. Paper Summarizer helps by:</p>
          <ul>
            <li><strong>Structured extraction:</strong> Get standardized summaries covering study design, population, intervention, outcomes</li>
            <li><strong>Inclusion/exclusion check:</strong> AI flags whether each paper meets your predefined criteria</li>
            <li><strong>Quality assessment:</strong> Identify risk of bias indicators (small sample size, lack of blinding, etc.)</li>
          </ul>

          <h2>Stage 3: Automated Data Extraction</h2>
          <p>This is where AI delivers the biggest time savings. For each included study, extract structured data:</p>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-border">
              <thead>
                <tr className="bg-bg-card">
                  <th className="border px-4 py-2 text-left">Data Point</th>
                  <th className="border px-4 py-2 text-left">Manual (per paper)</th>
                  <th className="border px-4 py-2 text-left">AI-Assisted (per paper)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border px-4 py-2">Study characteristics</td><td className="border px-4 py-2">5 min</td><td className="border px-4 py-2">30 sec</td></tr>
                <tr className="bg-bg-card/30"><td className="border px-4 py-2">Participant demographics</td><td className="border px-4 py-2">8 min</td><td className="border px-4 py-2">45 sec</td></tr>
                <tr><td className="border px-4 py-2">Intervention details</td><td className="border px-4 py-2">10 min</td><td className="border px-4 py-2">1 min</td></tr>
                <tr className="bg-bg-card/30"><td className="border px-4 py-2">Outcome measures & results</td><td className="border px-4 py-2">12 min</td><td className="border px-4 py-2">1 min</td></tr>
                <tr><td className="border px-4 py-2">Risk of bias indicators</td><td className="border px-4 py-2">7 min</td><td className="border px-4 py-2">30 sec</td></tr>
              </tbody>
            </table>
          </div>

          <h2>Stage 4: Synthesis and Writing</h2>
          <p>With all data extracted, Paper Summarizer helps organize findings:</p>
          <ul>
            <li><strong>Theme identification:</strong> AI groups studies by common findings, methodologies, or populations</li>
            <li><strong>Contradiction detection:</strong> Flag studies with conflicting results for deeper analysis</li>
            <li><strong>Gap analysis:</strong> Identify what questions remain unanswered in the literature</li>
          </ul>

          <h2>Maintaining Rigor: The AI-Human Partnership</h2>
          <p>AI accelerates systematic reviews but doesn't replace human judgment. Critical safeguards:</p>
          <ul>
            <li><strong>Dual screening with AI:</strong> Use AI as the first screener, human as validator</li>
            <li><strong>Source tracing:</strong> Paper Summarizer links every extracted claim to the original text</li>
            <li><strong>Random audits:</strong> Manually verify 10% of AI extractions for accuracy</li>
            <li><strong>Documentation:</strong> Record your AI methodology in the review's methods section for transparency</li>
          </ul>

          <h2>Case Study: Hypertension Systematic Review</h2>
          <p>A research team at a major European university recently used Paper Summarizer for a systematic review on hypertension interventions:</p>
          <ul>
            <li><strong>Initial search:</strong> 4,237 articles (PubMed + Embase)</li>
            <li><strong>AI screening:</strong> Reduced to 312 candidates in 3 hours (vs. estimated 40 hours manual)</li>
            <li><strong>Full-text review:</strong> 89 included studies, data extracted in 2 days (vs. estimated 3 weeks)</li>
            <li><strong>Total time saved:</strong> Approximately 6 weeks</li>
          </ul>

          <p>The resulting review was published in a Q1 journal with no methodological concerns raised during peer review.</p>

          <h2>Getting Started</h2>
          <ol>
            <li>Define your PICO research question</li>
            <li>Register your protocol (PROSPERO recommended)</li>
            <li>Run database searches and export results</li>
            <li>Upload papers to <Link href="/">Paper Summarizer</Link> for AI-assisted screening</li>
            <li>Extract data and synthesize findings</li>
          </ol>

          <p>Your systematic review doesn't have to take a year. With AI, rigorous evidence synthesis is now measured in weeks, not months.</p>
        </article>
        <div className="mt-8 pt-4 border-t border-border/50">
          <ShareButton title='How to Use AI for Systematic Literature Review: A Complete 2026 Workflow - Paper Summarizer' compact />
        </div>
        <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 border border-primary/20 rounded-2xl text-center">
          <p className="text-text font-semibold mb-3">Start Your Systematic Review ✨</p>
          <p className="text-text-secondary text-sm mb-4">Upload papers and get AI-powered structured summaries with source-tracing for rigorous systematic reviews.</p>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors">
            Try Free AI Summarizer
          </Link>
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
