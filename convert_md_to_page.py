#!/usr/bin/env python3
"""Convert MD files to Next.js page.tsx for Paper Summarizer blog."""

import markdown
import yaml
import os
import sys
import re


def generate_slug(title: str, date_str: str) -> str:
    """Generate a URL-friendly slug from title and date."""
    base = re.sub(r'[^a-zA-Z0-9\s\-]', '', title.lower())
    base = re.sub(r'\s+', '-', base.strip())
    base = re.sub(r'-+', '-', base)
    if len(base) > 80:
        base = base[:80]
    return f"{date_str.replace('-', '')}-{base}"


def escape_for_js_double_quote(s: str) -> str:
    """Escape for JS double-quoted string (newlines become \\n)."""
    parts = []
    for line in s.split('\n'):
        escaped = line.replace('\\', '\\\\').replace('"', '\\"')
        parts.append(escaped)
    return '\\n'.join(parts)


def format_keywords_js(tags: list, title: str) -> str:
    """Format keywords as a proper JS array string."""
    all_kws = [title] + tags
    return '[' + ', '.join(f'"{k}"' for k in all_kws) + ']'


def build_page_tsx(title: str, description: str, tags: list, body_html: str) -> str:
    """Build the complete page.tsx content."""
    
    chinese_title = f"{title} | Paper Summarizer"
    keywords_js = format_keywords_js(tags, title)
    
    # Escape HTML for JS single-quoted string (newlines become \\n)
    safe_html_parts = []
    for line in body_html.split('\n'):
        escaped = line.replace('\\', '\\\\').replace("'", "\\'").replace('"', '\\"')
        safe_html_parts.append(escaped)
    safe_html = '\\n'.join(safe_html_parts)
    
    # Escape title and description for JS DOUBLE-quoted strings (avoids apostrophe issues)
    safe_title = escape_for_js_double_quote(chinese_title)
    safe_desc = escape_for_js_double_quote(description)
    
    # Split the content string into chunks using JS + concatenation (max 175 chars per chunk)
    CHUNK_MAX = 175
    chunks = []
    i = 0
    while i < len(safe_html):
        end = min(i + CHUNK_MAX, len(safe_html))
        if end < len(safe_html) and safe_html[end-1] == '\\' and (end + 1 < len(safe_html)):
            next_c = safe_html[end]
            if next_c in ("'", '"', '\\', 'n', '`'):
                end = min(end + 1, len(safe_html))
        chunks.append(f"'{safe_html[i:end]}'")
        i = end
    
    content_str = ' +\n'.join(f"    {c}" for c in chunks)
    
    return f'''import Link from 'next/link'
import BlogCTA from '@/components/BlogCTA'
import ShareButton from '../../../components/ShareButton'

export const metadata = {{
  title: "{safe_title}",
  description: "{safe_desc}",
  keywords: {keywords_js},
}}

export default function BlogPost() {{
  const content = {content_str};
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-bg-card/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={{2}} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2 2V5a2 2 0 012-2h5.586a1 0 1.707.293l5.414 5.414a1 0 1.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-text">Paper Summarizer</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 max-w-3xl mx-auto px-4 py-8">
        <Link href="/blog" className="text-primary hover:text-primary-dark transition-colors text-sm">← Back to Blog</Link>
        <article className="mt-6 prose prose-invert max-w-none" dangerouslySetInnerHTML={{{{__html: content}}}} />
        <div className="mt-8 pt-4 border-t border-border/50">
          <ShareButton title="{safe_title}" compact />
        </div>

        <BlogCTA />
      </main>
      <footer className="border-t border-border bg-bg-card/50 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Link href="/" className="text-primary transition-colors">← Back to Summarizer</Link>
        </div>
      </footer>
    </div>
  )
}}
'''


def process_md_file(md_path: str, output_dir: str):
    """Process a single MD file and generate page.tsx."""
    
    with open(md_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if not content.startswith('---'):
        print(f"  ERROR: No front matter in {md_path}")
        return None
    
    parts = content.split('---', 2)
    if len(parts) < 3:
        print(f"  ERROR: Invalid front matter in {md_path}")
        return None
    
    front_matter = yaml.safe_load(parts[1])
    body_md = parts[2].strip()
    
    title = front_matter.get('title', 'Untitled')
    description = front_matter.get('description', '')
    date_str = front_matter.get('date', '2026-01-01')
    tags = front_matter.get('tags', [])
    
    slug = generate_slug(title, date_str)
    out_dir = os.path.join(output_dir, slug)
    
    # Convert markdown to HTML (NO codehilite - Pygments spans break JSX)
    extensions = ['tables', 'fenced_code']
    body_html = markdown.markdown(body_md, extensions=extensions)
    
    # Build page.tsx  
    page_content = build_page_tsx(title, description, tags, body_html)
    
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, 'page.tsx')
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(page_content)
    
    print(f"  ✓ Generated {out_path}")
    return slug


def main():
    md_dir = sys.argv[1] if len(sys.argv) > 1 else '/home/zxw/.openclaw/workspace/paper-summarizer-seo-articles'
    output_dir = sys.argv[2] if len(sys.argv) > 2 else '/home/zxw/paper-summarizer/src/app/blog'
    
    md_files = sorted([f for f in os.listdir(md_dir) if f.endswith('.md')])
    print(f"Found {len(md_files)} MD files to convert")
    
    slugs = []
    for md_file in md_files:
        md_path = os.path.join(md_dir, md_file)
        try:
            slug = process_md_file(md_path, output_dir)
            if slug:
                slugs.append(slug)
        except Exception as e:
            print(f"  ERROR processing {md_file}: {e}")
    
    print(f"\nDone! Generated {len(slugs)} pages:")
    for s in slugs:
        print(f"  - {s}/")


if __name__ == '__main__':
    main()
