import Link from 'next/link'

export default function BlogCTA() {
  return (
    <div className="mt-10 pt-8 border-t border-border">
      <div className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl border border-primary/20 text-center">
        <p className="text-lg font-bold text-text mb-1">📄 试试用AI帮你总结论文</p>
        <p className="text-text-secondary text-sm mb-5">免费使用，每天3次，Pro用户无限量</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-1 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors text-sm"
          >
            试用AI论文摘要工具
            <span className="text-lg leading-none">→</span>
          </Link>
          <Link
            href="/premium"
            className="inline-flex items-center justify-center gap-1 px-6 py-2.5 bg-bg-card hover:bg-bg-hover text-primary border border-primary/40 rounded-lg font-medium transition-colors text-sm"
          >
            升级Pro版解锁无限使用
            <span className="text-lg leading-none">→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
