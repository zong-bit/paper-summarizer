'use client'

import { useEffect } from 'react'

interface BlogJsonLdProps {
  title: string
  description: string
  slug: string
  publishedTime?: string
  modifiedTime?: string
}

export default function BlogJsonLd({ title, description, slug, publishedTime, modifiedTime }: BlogJsonLdProps) {
  useEffect(() => {
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
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    }

    // Remove any existing Paper Summarizer Article JSON-LD to avoid duplicates
    const existingScripts = document.querySelectorAll('script[data-pss-type="article"]')
    existingScripts.forEach(s => s.remove())

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-pss-type', 'article')
    script.textContent = JSON.stringify(jsonLd)
    document.head.appendChild(script)

    return () => {
      script.remove()
    }
  }, [title, description, slug, publishedTime, modifiedTime])

  return null
}
