'use client'

import { useTranslation } from '@/i18n/provider'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="border-t border-slate-800 bg-slate-900/50 py-8">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 text-slate-400">
          <span>Powered by</span>
          <a
            href="https://www.deepseek.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
          >
            DeepSeek
          </a>
        </div>
        <p className="mt-4 text-slate-500 text-sm">
          {t('footer.tagline')}
        </p>
        <div className="mt-4 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
            <a href="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</a>
            <a href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
            <a href="/refund" className="hover:text-blue-400 transition-colors">Refund Policy</a>
            <a href="/about" className="hover:text-blue-400 transition-colors">About</a>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-center gap-4 text-xs text-slate-600">
          <a href="/premium" className="hover:text-blue-400 transition-colors">⭐ {t('nav.premium')}</a>
        </div>
        {/* Social Links */}
        <div className="mt-4 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-center gap-6">
            {/* GitHub */}
            <a
              href="https://github.com/zong-bit/paper-summarizer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-white transition-colors"
              title="GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            {/* Reddit */}
            <a
              href="https://www.reddit.com/r/PaperSummarizer/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-[#FF4500] transition-colors"
              title="Reddit"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.962 12.962c0 .736-.406 1.363-.998 1.688.077.32.117.656.117 1.002 0 2.622-2.868 4.75-6.398 4.75-3.529 0-6.398-2.128-6.398-4.75 0-.346.04-.682.117-1.002-.592-.325-.998-.952-.998-1.688 0-1.064.865-1.926 1.926-1.926.518 0 .989.204 1.339.533 1.142-.768 2.698-1.271 4.424-1.347l.95-3.772c.034-.135.16-.227.299-.206l2.711.576c.175-.338.527-.578.938-.578.579 0 1.048.47 1.048 1.048 0 .579-.47 1.048-1.048 1.048-.375 0-.701-.198-.885-.489l-2.494-.529-.854 3.396c1.694.081 3.22.583 4.34 1.344.349-.324.818-.524 1.333-.524 1.064 0 1.929.862 1.929 1.926zM7.37 11.846c-.528 0-.957.429-.957.957s.429.957.957.957.957-.429.957-.957-.429-.957-.957-.957zm5.651 4.903c-.111-.111-.291-.111-.402 0-.628.628-1.639.629-2.267 0-.111-.111-.291-.111-.402 0-.111.111-.111.291 0 .402.847.847 2.218.847 3.065 0 .111-.111.111-.291 0-.402h.006zm-.396-2.989c-.528 0-.957.429-.957.957s.429.957.957.957.957-.429.957-.957-.429-.957-.957-.957zm3.221-1.914c-.528 0-.957.429-.957.957s.429.957.957.957.957-.429.957-.957-.429-.957-.957-.957z"/>
              </svg>
            </a>
            {/* Twitter/X */}
            <a
              href="https://x.com/PaperSummarizer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-white transition-colors"
              title="Twitter / X"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            {/* Blog */}
            <a
              href="/blog"
              className="text-slate-500 hover:text-blue-400 transition-colors"
              title="Blog"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </a>
          </div>
        </div>
        <div className="mt-4 text-xs text-slate-600">
          &copy; {new Date().getFullYear()} Paper Summarizer. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
