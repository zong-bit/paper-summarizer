'use client'

import { useState } from 'react'
import Link from 'next/link'
import Footer from '../../../components/Footer'
import ShareButton from '../../../components/ShareButton'
import LanguageSwitcher from '../../../components/LanguageSwitcher'
import { useTranslation } from '@/i18n/provider'

type CitationFormat = 'apa' | 'mla' | 'gbt'
type CitationType = 'journal' | 'book' | 'conference' | 'thesis' | 'website'

interface PaperInfo {
  authors: string
  year: string
  title: string
  journal: string
  volume: string
  issue: string
  pages: string
  doi: string
  publisher: string
  url: string
  accessedDate: string
}

export default function CitationExportPage() {
  const { t, tArray } = useTranslation()
  const [format, setFormat] = useState<CitationFormat>('apa')
  const [citationType, setCitationType] = useState<CitationType>('journal')
  const [info, setInfo] = useState<PaperInfo>({
    authors: '',
    year: '',
    title: '',
    journal: '',
    volume: '',
    issue: '',
    pages: '',
    doi: '',
    publisher: '',
    url: '',
    accessedDate: '',
  })
  const [result, setResult] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const updateField = (field: keyof PaperInfo, value: string) => {
    setInfo(prev => ({ ...prev, [field]: value }))
    setResult(null)
  }

  const generateCitation = () => {
    if (!info.authors.trim() || !info.title.trim()) {
      return
    }

    const year = info.year || 'n.d.'
    const title = info.title.trim()
    const authors = info.authors.trim()

    let citation = ''

    switch (format) {
      case 'apa':
        citation = generateAPA()
        break
      case 'mla':
        citation = generateMLA()
        break
      case 'gbt':
        citation = generateGBT()
        break
    }

    setResult(citation)
    setCopied(false)
  }

  const generateAPA = (): string => {
    const { authors, year, title, journal, volume, issue, pages, doi, publisher, url, accessedDate } = info

    switch (citationType) {
      case 'journal': {
        // Author, A. A. (Year). Title of article. Title of Journal, Volume(Issue), pages. https://doi.org/xxx
        if (journal) {
          let ref = `${authors} (${year || 'n.d.'}). ${title}. ${journal}`
          if (volume) ref += volume
          if (issue && volume) ref += `(${issue})`
          else if (issue && !volume) ref += `, ${issue}`
          if (pages) ref += `, ${pages}`
          ref += '.'
          if (doi) ref += ` https://doi.org/${doi}`
          else if (url) ref += ` Retrieved from ${url}`
          return ref
        }
        // Book/other
        const pubParts = [publisher]
        return `${authors} (${year || 'n.d.'}). ${title}. ${pubParts.filter(Boolean).join(', ')}.${doi ? ` https://doi.org/${doi}` : ''}`
      }
      case 'book': {
        return `${authors} (${year || 'n.d.'}). ${title}. ${publisher}.${doi ? ` https://doi.org/${doi}` : ''}`
      }
      case 'conference': {
        return `${authors} (${year || 'n.d.'}). ${title}. In ${journal || 'Proceedings'} (pp. ${pages || 'n/a'}). ${publisher}.${doi ? ` https://doi.org/${doi}` : ''}`
      }
      case 'thesis': {
        return `${authors} (${year || 'n.d.'}). ${title} (${citationType === 'thesis' ? 'Doctoral dissertation' : 'Master\'s thesis'}). ${publisher || 'University'}.${url ? ` Retrieved from ${url}` : ''}`
      }
      case 'website': {
        let ref = `${authors} (${year || 'n.d.'}). ${title}. ${publisher || 'Website'}.`
        if (url) ref += ` Retrieved ${accessedDate || 'n.d.'}, from ${url}`
        return ref
      }
      default:
        return ''
    }
  }

  const generateMLA = (): string => {
    const { authors, year, title, journal, volume, issue, pages, doi, publisher, url } = info
    // In MLA, first author is Last, First. Subsequent: First Last

    switch (citationType) {
      case 'journal': {
        let ref = `${authors}. "${title}." ${journal || 'Unknown Journal'}`
        if (volume) ref += `, vol. ${volume}`
        if (issue) ref += `, no. ${issue}`
        if (year) ref += `, ${year}`
        if (pages) ref += `, pp. ${pages}`
        ref += '.'
        if (doi) ref += ` doi:${doi}`
        else if (url) ref += ` ${url}`
        return ref
      }
      case 'book': {
        return `${authors}. ${title}. ${publisher || 'Unknown Publisher'}, ${year || 'n.d.'}.`
      }
      case 'conference': {
        return `${authors}. "${title}." ${journal || 'Conference Proceedings'}, ${publisher || 'Unknown Publisher'}, ${year || 'n.d.'}, pp. ${pages || 'n/a'}.${doi ? ` doi:${doi}` : ''}`
      }
      case 'thesis': {
        return `${authors}. "${title}." ${citationType === 'thesis' ? 'PhD dissertation' : 'MA thesis'}. ${publisher || 'University'}, ${year || 'n.d.'}.${url ? ` ${url}` : ''}`
      }
      case 'website': {
        let ref = `${authors}. "${title}." ${publisher || 'Website Name'}, ${year || 'n.d.'}`
        if (url) ref += `, ${url}`
        return ref + '.'
      }
      default:
        return ''
    }
  }

  const generateGBT = (): string => {
    const { authors, year, title, journal, volume, issue, pages, doi, publisher, url } = info
    // GB/T 7714-2015 format

    switch (citationType) {
      case 'journal': {
        // 作者. 题名[J]. 刊名, 年, 卷(期): 起止页码.
        let ref = `${authors}. ${title}[J]. ${journal || 'Unknown Journal'}, ${year || 'n.d.'}`
        if (volume) ref += `, ${volume}`
        if (issue) ref += `(${issue})`
        if (pages) ref += `: ${pages}`
        ref += '.'
        if (doi) ref += ` DOI: ${doi}.`
        return ref
      }
      case 'book': {
        // 作者. 书名[M]. 出版地: 出版社, 出版年.
        return `${authors}. ${title}[M]. ${publisher || 'Unknown Publisher'}, ${year || 'n.d.'}.`
      }
      case 'conference': {
        // 作者. 题名[C]. 会议名称, 会议地点, 会议日期.
        return `${authors}. ${title}[C]. ${journal || 'Conference Proceedings'}, ${year || 'n.d.'}.${pages ? `: ${pages}.` : ''}`
      }
      case 'thesis': {
        // 作者. 题名[D]. 学校, 年份.
        return `${authors}. ${title}[D]. ${publisher || 'University'}, ${year || 'n.d.'}.`
      }
      case 'website': {
        // 作者. 题名[EB/OL]. 发布日期, 引用日期. URL.
        const pubDate = year || 'n.d.'
        const accessDate = info.accessedDate || 'n.d.'
        let ref = `${authors}. ${title}[EB/OL]. ${pubDate}, ${accessDate}.`
        if (url) ref += ` ${url}.`
        return ref
      }
      default:
        return ''
    }
  }

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatLabels: Record<CitationFormat, string> = {
    apa: 'APA 7th Edition',
    mla: 'MLA 9th Edition',
    gbt: 'GB/T 7714-2015 (中文)',
  }

  const typeLabels: Record<CitationType, string> = {
    journal: 'Journal Article',
    book: 'Book',
    conference: 'Conference Paper',
    thesis: 'Thesis / Dissertation',
    website: 'Web Page',
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-bg-card/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-text hover:text-primary transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-bold">Paper Summarizer</span>
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link href="/premium" className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-medium transition-colors border border-primary/20">
              ⭐ {t('nav.premium')}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Title */}
        <div className="text-center space-y-3">
          <div className="inline-block px-4 py-1 bg-green-500/20 text-green-500 rounded-full text-sm font-medium">
            {t('tools.freeTool')}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text">
            {t('citationExport.title')}
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            {t('citationExport.subtitle')}
          </p>
        </div>

        <div className="bg-bg-card border border-border rounded-2xl p-6 space-y-5">
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">{t('citationExport.citationFormat')}</label>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(formatLabels) as [CitationFormat, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => { setFormat(key); setResult(null) }}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    format === key
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'bg-bg border border-border text-text-secondary hover:border-primary/40 hover:text-text'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Source Type */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">{t('citationExport.sourceType')}</label>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(typeLabels) as [CitationType, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => { setCitationType(key); setResult(null) }}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                    citationType === key
                      ? 'bg-secondary text-white'
                      : 'bg-bg border border-border text-text-secondary hover:border-secondary/40 hover:text-text'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text mb-1">{t('citationExport.authors')}</label>
              <input
                type="text"
                value={info.authors}
                onChange={(e) => updateField('authors', e.target.value)}
                placeholder={format === 'gbt' ? t('citationExport.authorsPlaceholder') : t('citationExport.authorsPlaceholderEn')}
                className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-text placeholder-text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">{t('citationExport.year')}</label>
              <input
                type="text"
                value={info.year}
                onChange={(e) => updateField('year', e.target.value)}
                placeholder={t('citationExport.yearPlaceholder')}
                className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-text placeholder-text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text mb-1">{t('citationExport.title')}</label>
              <input
                type="text"
                value={info.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder={t('citationExport.titlePlaceholder')}
                className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-text placeholder-text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>
            {(citationType === 'journal' || citationType === 'conference') && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text mb-1">{t('citationExport.journal')}</label>
                <input
                  type="text"
                  value={info.journal}
                  onChange={(e) => updateField('journal', e.target.value)}
                  placeholder={t('citationExport.journalPlaceholder')}
                  className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-text placeholder-text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                />
              </div>
            )}
            {citationType === 'journal' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">{t('citationExport.volume')}</label>
                  <input
                    type="text"
                    value={info.volume}
                    onChange={(e) => updateField('volume', e.target.value)}
                    placeholder={t('citationExport.volumePlaceholder')}
                    className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-text placeholder-text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">{t('citationExport.issue')}</label>
                  <input
                    type="text"
                    value={info.issue}
                    onChange={(e) => updateField('issue', e.target.value)}
                    placeholder={t('citationExport.issuePlaceholder')}
                    className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-text placeholder-text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text mb-1">{t('citationExport.pages')}</label>
                  <input
                    type="text"
                    value={info.pages}
                    onChange={(e) => updateField('pages', e.target.value)}
                    placeholder={t('citationExport.pagesPlaceholder')}
                    className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-text placeholder-text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  />
                </div>
              </>
            )}
            {citationType === 'book' && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text mb-1">{t('citationExport.publisher')}</label>
                <input
                  type="text"
                  value={info.publisher}
                  onChange={(e) => updateField('publisher', e.target.value)}
                  placeholder={t('citationExport.publisherPlaceholder')}
                  className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-text placeholder-text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                />
              </div>
            )}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text mb-1">{t('citationExport.doi')}</label>
              <input
                type="text"
                value={info.doi}
                onChange={(e) => updateField('doi', e.target.value)}
                placeholder={t('citationExport.doiPlaceholder')}
                className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-text placeholder-text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text mb-1">{t('citationExport.url')}</label>
              <input
                type="text"
                value={info.url}
                onChange={(e) => updateField('url', e.target.value)}
                placeholder={t('citationExport.urlPlaceholder')}
                className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-text placeholder-text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>
          </div>

          {/* Generate */}
          <button
            onClick={generateCitation}
            disabled={!info.authors.trim() || !info.title.trim()}
            className="w-full py-3.5 bg-primary hover:bg-primary-dark disabled:bg-primary/50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {t('citationExport.generate', { format: formatLabels[format] })}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="bg-bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-text">
                {t('citationExport.result', { format: formatLabels[format] })}
              </h2>
              <button
                onClick={handleCopy}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                {copied ? t('common.copied') : t('common.copy')}
              </button>
            </div>
            <div className="px-5 py-4">
              <div className="bg-bg border border-border rounded-xl p-4">
                <p className="text-sm text-text leading-relaxed select-all">{result}</p>
              </div>
            </div>
          </div>
        )}

        {/* Share */}
        <div className="pt-8">
          <ShareButton title="Citation Export - Paper Summarizer" description="Generate APA, MLA, and more citation formats for academic papers" />
        </div>

        {/* Back link */}
        <div className="text-center pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-bg-card border border-border hover:border-primary/40 text-text rounded-xl text-sm transition-colors"
          >
            {t('common.backToHome')}
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
