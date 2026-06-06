import Link from 'next/link'
import ShareButton from '../../../components/ShareButton'
import { generateBlogMetadata, generateBlogJsonLd } from '../utils'

export const metadata = generateBlogMetadata({
  title: 'Zotero + AI Paper Summarizer: The Ultimate Research Workflow for 2026',
  description: 'Integrate Zotero reference manager with AI paper summarization for a seamless research workflow. Automatically summarize papers in your Zotero library and build a searchable knowledge base.',
  keywords: ['Zotero AI integration', 'Zotero paper summarizer', 'reference manager AI', 'Zotero workflow 2026', 'academic knowledge management', 'Paper Summarizer Zotero'],
  slug: 'zotero-ai-paper-summarizer-workflow-2026',
  publishedTime: '2026-06-05T08:00:00+08:00',
})

export default function BlogPost() {
  const jsonLd = generateBlogJsonLd({
    title: metadata.title as string,
    description: metadata.description as string,
    slug: 'zotero-ai-paper-summarizer-workflow-2026',
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
          <h1>Zotero + AI Paper Summarizer: The Ultimate Research Workflow for 2026</h1>
          <p className="text-sm text-slate-500 mt-2 mb-6">by Paper Summarizer Team</p>

          <blockquote>
            <p>Zotero is the gold standard for reference management. Combine it with AI paper summarization and you have a research superpower. Here's the complete workflow.</p>
          </blockquote>

          <h2>Why Zotero + AI Is a Game-Changer</h2>
          <p>Zotero excels at collecting, organizing, and citing papers. But it doesn't help you <em>understand</em> them. By integrating AI paper summarization into your Zotero workflow, you transform your reference library from a citation database into a <strong>searchable knowledge base</strong> where every paper comes with an AI-generated summary.</p>

          <h2>Step-by-Step Zotero + Paper Summarizer Workflow</h2>

          <h3>Step 1: Collect Papers in Zotero</h3>
          <p>Use Zotero's browser connector to save papers as you browse. The connector works with:</p>
          <ul>
            <li>arXiv, PubMed, IEEE Xplore, ACM Digital Library</li>
            <li>Google Scholar, Semantic Scholar</li>
            <li>Journal websites (Nature, Science, Elsevier, Springer)</li>
            <li>University library catalogs</li>
          </ul>
          <p>Zotero automatically captures metadata: title, authors, journal, year, DOI, and abstract. It also downloads the PDF when available.</p>

          <h3>Step 2: Export PDFs for AI Summarization</h3>
          <p>Zotero stores PDFs locally. Navigate to your Zotero storage folder, select the papers you want to summarize, and upload them to <strong>Paper Summarizer</strong>. Each paper gets a structured AI summary with:</p>
          <ul>
            <li>Research question and motivation</li>
            <li>Methodology breakdown</li>
            <li>Key findings with specific metrics</li>
            <li>Limitations and future work</li>
          </ul>

          <h3>Step 3: Store Summaries as Zotero Notes</h3>
          <p>This is the crucial integration step. For each paper you summarize:</p>
          <ol>
            <li>Copy the AI-generated summary from Paper Summarizer</li>
            <li>In Zotero, select the paper and create a new "Note"</li>
            <li>Paste the summary into the note</li>
            <li>Add tags like "AI-summarized", "key-paper", "methodology-interesting"</li>
          </ol>
          <p>Now your Zotero library is searchable by summary content, not just metadata. Search for "transformer architecture" and find papers whose <em>summaries</em> mention it, not just titles.</p>

          <h3>Step 4: Build Smart Collections</h3>
          <p>Use Zotero's saved searches and collections to organize your summarized papers:</p>
          <ul>
            <li><strong>"Core Literature"</strong> — papers with summaries tagged "key-paper"</li>
            <li><strong>"Methodology Reference"</strong> — papers whose summaries mention specific methods</li>
            <li><strong>"Literature Review Candidates"</strong> — papers relevant to your current writing project</li>
            <li><strong>"To Read Fully"</strong> — papers flagged during AI screening that deserve full reading</li>
          </ul>

          <h2>Advanced Integration: Zotero + Paper Summarizer + Writing</h2>
          <p>When writing your paper or thesis in Word/LibreOffice/Google Docs with Zotero's citation plugin:</p>
          <ol>
            <li>Insert citations from Zotero as you write</li>
            <li>Need to verify a paper supports your claim? Open the Zotero note with the AI summary</li>
            <li>The summary tells you the paper's key findings instantly — no need to re-read the full paper</li>
            <li>If the summary confirms your point, keep the citation. If not, find a better reference.</li>
          </ol>

          <h2>Pro Tips for the Zotero + AI Workflow</h2>
          <ul>
            <li><strong>Summarize in batches.</strong> Set aside 30 minutes weekly to process 15-20 new papers through Paper Summarizer and add notes to Zotero.</li>
            <li><strong>Use colored tags.</strong> Assign colors to papers based on summary quality or relevance (green = highly relevant, yellow = somewhat relevant, red = not relevant).</li>
            <li><strong>Link related papers.</strong> Use Zotero's "Related" feature to connect papers that the AI summaries show are methodologically or thematically linked.</li>
            <li><strong>Sync to the cloud.</strong> Zotero sync keeps your summarized library available across all your devices.</li>
          </ul>

          <h2>Time Savings: The Numbers</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-border">
              <thead>
                <tr className="bg-bg-card">
                  <th className="border px-4 py-2 text-left">Activity</th>
                  <th className="border px-4 py-2 text-left">Without AI</th>
                  <th className="border px-4 py-2 text-left">Zotero + AI</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border px-4 py-2">Processing 20 new papers/week</td><td className="border px-4 py-2">10-15 hours</td><td className="border px-4 py-2">1-2 hours</td></tr>
                <tr className="bg-bg-card/30"><td className="border px-4 py-2">Finding papers on X topic in library</td><td className="border px-4 py-2">30-60 min</td><td className="border px-4 py-2">Instant (search summaries)</td></tr>
                <tr><td className="border px-4 py-2">Verifying citation support</td><td className="border px-4 py-2">5-15 min each</td><td className="border px-4 py-2">30 sec each</td></tr>
                <tr className="bg-bg-card/30"><td className="border px-4 py-2">Literature review writing</td><td className="border px-4 py-2">3-4 weeks</td><td className="border px-4 py-2">1-2 weeks</td></tr>
              </tbody>
            </table>
          </div>

          <p>Your Zotero library contains a goldmine of knowledge. AI summarization unlocks it. Start building your AI-enhanced research workflow with <strong>Paper Summarizer</strong> today.</p>
        </article>
        <div className="mt-8 pt-4 border-t border-border/50">
          <ShareButton title='Zotero + AI Paper Summarizer: The Ultimate Research Workflow for 2026 - Paper Summarizer' compact />
        </div>
        <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 border border-primary/20 rounded-2xl text-center">
          <p className="text-text font-semibold mb-3">Supercharge Your Zotero Library ✨</p>
          <p className="text-text-secondary text-sm mb-4">Upload papers from Zotero and get AI summaries you can store as searchable notes.</p>
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
