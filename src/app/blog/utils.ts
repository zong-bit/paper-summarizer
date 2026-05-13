import type { Metadata } from 'next'

const BASE_URL = 'https://www.summarizeai.app'

export interface BlogPostMetadata {
  title: string
  description: string
  keywords?: string[]
  publishedTime?: string
  modifiedTime?: string
  author?: string
  slug: string
}

export function generateBlogMetadata(post: BlogPostMetadata): Metadata {
  const canonicalUrl = `${BASE_URL}/blog/${post.slug}`
  const ogImage = `${BASE_URL}/og-blog.png`

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords || ['AI paper summarizer', 'research paper summary', 'AI academic tools', 'Paper Summarizer'],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: canonicalUrl,
      siteName: 'Paper Summarizer',
      publishedTime: post.publishedTime,
      modifiedTime: post.modifiedTime,
      authors: [post.author || 'Paper Summarizer'],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [ogImage],
    },
  }
}

export function generateBlogJsonLd(post: BlogPostMetadata): string {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    url: `${BASE_URL}/blog/${post.slug}`,
    author: {
      '@type': 'Organization',
      name: 'Paper Summarizer',
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Paper Summarizer',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/blog/${post.slug}`,
    },
    ...(post.publishedTime && { publishedTime: post.publishedTime }),
    ...(post.modifiedTime && { modifiedTime: post.modifiedTime }),
  }
  return JSON.stringify(jsonLd)
}
