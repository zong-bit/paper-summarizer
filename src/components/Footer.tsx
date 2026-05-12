export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg-card/50 py-8">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 text-text-secondary">
          <span>Powered by</span>
          <a 
            href="https://www.deepseek.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-dark transition-colors font-medium"
          >
            DeepSeek
          </a>
        </div>
        <p className="mt-4 text-text-secondary/60 text-sm">
          Free AI Paper Summarizer - Summarize research papers instantly
        </p>
        <div className="mt-2 flex items-center justify-center gap-4 text-xs text-text-secondary/40">
          <a href="/premium" className="hover:text-primary transition-colors">⭐ Pro</a>
          <span>·</span>
          <a href="https://afdian.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">爱发电</a>
        </div>
      </div>
    </footer>
  )
}
