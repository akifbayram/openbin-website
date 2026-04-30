import fs from 'node:fs'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import { blogPlugin } from 'vitepress-plugin-blog/plugin'
import { defineConfig } from 'vitepress'
import { homeFaqs, cloudFaqs } from './data/faqs'

const SITE_URL = 'https://openbin.app'
const SITE_TITLE = 'OpenBin — Inventory with Intelligence'
const SITE_DESCRIPTION = 'Open source inventory management that makes physical storage searchable. Create bins for your stuff, let AI identify contents from a photo, and print QR labels to find anything with a scan.'
const SOCIAL_LINKS = {
  github: 'https://github.com/akifbayram/openbin',
  discord: 'https://discord.gg/W6JPZCqqx9',
}
const sameAs = Object.values(SOCIAL_LINKS)

function faqSchema(faqs: { q: string; a: string }[]) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  })
}

// Parse FAQ Q&A pairs from a blog post's markdown content.
// Expects a "## Frequently asked questions" section with "### Question" H3s
// followed by one or more paragraphs of answer text.
function parseFaqs(markdown: string): { q: string; a: string }[] {
  const faqSectionMatch = markdown.match(
    /##\s+Frequently asked questions\s*\n([\s\S]*?)(?=\n##\s+|\n---\s*\n|$)/i
  )
  if (!faqSectionMatch) return []
  const section = faqSectionMatch[1]
  const qaPattern = /###\s+(.+?)\n+([\s\S]*?)(?=\n###\s+|$)/g
  const faqs: { q: string; a: string }[] = []
  const matches = [...section.matchAll(qaPattern)]
  for (const m of matches) {
    const q = m[1].trim()
    const a = m[2]
      .trim()
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/\s+/g, ' ')
    if (q && a) faqs.push({ q, a })
  }
  return faqs
}

export default defineConfig({
  title: 'OpenBin | Inventory with Intelligence',
  description: SITE_DESCRIPTION,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@700&display=swap', rel: 'stylesheet' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['script', { defer: '', src: 'https://analytics.openbin.app/script.js', 'data-website-id': '3fd9d230-bac4-4550-9261-30641eb0e45a' }],
    ['script', { type: 'application/ld+json' }, JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'OpenBin',
      url: SITE_URL,
      description: 'Open source inventory management that makes physical storage searchable. Create bins for your stuff, let AI identify contents from a photo, and print QR labels to find anything with a scan.',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web, Docker (Linux, macOS, Windows)',
      offers: [
        { '@type': 'Offer', name: 'Free', price: '0', priceCurrency: 'USD' },
        { '@type': 'Offer', name: 'Plus', price: '3.00', priceCurrency: 'USD', description: 'Per month' },
        { '@type': 'Offer', name: 'Pro', price: '6.00', priceCurrency: 'USD', description: 'Per month' },
      ],
      featureList: [
        'QR label generation and scanning',
        'AI photo recognition for inventory cataloging',
        'Multi-user collaboration with role-based access',
        'Natural language inventory commands',
        'Bulk operations',
        'REST API and MCP server',
        'CSV and JSON export',
        'Self-hosted Docker deployment',
      ],
      downloadUrl: SOCIAL_LINKS.github,
      screenshot: `${SITE_URL}/screenshots/dashboard.webp`,
      image: `${SITE_URL}/og-image.png`,
      sameAs,
    })],
    ['script', { type: 'application/ld+json' }, JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'OpenBin',
      url: SITE_URL,
      logo: `${SITE_URL}/logo-horizontal.svg`,
      description: 'Open source inventory management that makes physical storage searchable. Create bins for your stuff, let AI identify contents from a photo, and print QR labels to find anything with a scan.',
      sameAs,
    })],
    ['script', { type: 'application/ld+json' }, JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'OpenBin',
      url: SITE_URL,
      description: 'Open source inventory management that makes physical storage searchable. Create bins for your stuff, let AI identify contents from a photo, and print QR labels to find anything with a scan.',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE_URL}/docs/?search={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    })],
  ],
  vite: {
    plugins: [tailwindcss(), blogPlugin()],
  },
  srcExclude: ['**/CLAUDE.md'],
  sitemap: {
    hostname: SITE_URL,
  },
  lastUpdated: true,
  appearance: false,
  transformPageData(pageData) {
    const canonicalUrl = `${SITE_URL}/${pageData.relativePath}`
      .replace(/index\.md$/, '')
      .replace(/\.md$/, '')
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(['link', { rel: 'canonical', href: canonicalUrl }])

    const fm = pageData.frontmatter
    const isBlogPost = fm.blogPost === true
    const pageTitle = fm.title || SITE_TITLE
    const pageDescription = fm.description || SITE_DESCRIPTION
    const coverUrl = fm.cover
      ? (fm.cover.startsWith('http') ? fm.cover : `${SITE_URL}${fm.cover}`)
      : `${SITE_URL}/og-image.png`

    pageData.frontmatter.head.push(
      ['meta', { property: 'og:title', content: pageTitle }],
      ['meta', { property: 'og:description', content: pageDescription }],
      ['meta', { property: 'og:url', content: canonicalUrl }],
      ['meta', { property: 'og:type', content: isBlogPost ? 'article' : 'website' }],
      ['meta', { property: 'og:image', content: coverUrl }],
      ['meta', { property: 'og:site_name', content: 'OpenBin' }],
      ['meta', { name: 'twitter:title', content: pageTitle }],
      ['meta', { name: 'twitter:description', content: pageDescription }],
      ['meta', { name: 'twitter:image', content: coverUrl }],
    )

    if (isBlogPost) {
      fm.aside ??= false
      fm.editLink ??= false
      fm.lastUpdated ??= false

      const datePublished = fm.date || new Date().toISOString().slice(0, 10)
      const dateModified = fm.lastUpdated || fm.updated || datePublished
      const authorName = fm.author || 'OpenBin'

      pageData.frontmatter.head.push(
        ['meta', { property: 'article:published_time', content: datePublished }],
        ['meta', { property: 'article:modified_time', content: dateModified }],
      )

      pageData.frontmatter.head.push(['script', { type: 'application/ld+json' }, JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: fm.title,
        description: fm.description,
        datePublished,
        dateModified,
        author: { '@type': 'Person', name: authorName, url: SITE_URL },
        publisher: {
          '@type': 'Organization',
          name: 'OpenBin',
          logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo-horizontal.svg` },
        },
        image: coverUrl,
        url: canonicalUrl,
        mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
        keywords: Array.isArray(fm.tags) ? fm.tags.join(', ') : undefined,
      })])

      // Parse FAQ section from markdown for FAQPage schema
      try {
        const filePath = path.resolve(process.cwd(), pageData.relativePath)
        if (fs.existsSync(filePath)) {
          const raw = fs.readFileSync(filePath, 'utf-8')
          const body = raw.replace(/^---[\s\S]*?---\n/, '')
          const faqs = parseFaqs(body)
          if (faqs.length > 0) {
            pageData.frontmatter.head.push([
              'script',
              { type: 'application/ld+json' },
              faqSchema(faqs),
            ])
          }
        }
      } catch {
        // Fail silently — schema injection is non-critical
      }

      // BreadcrumbList for blog posts
      if (pageData.relativePath.startsWith('blog/posts/')) {
        pageData.frontmatter.head.push(['script', { type: 'application/ld+json' }, JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'OpenBin', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog/` },
            { '@type': 'ListItem', position: 3, name: fm.title, item: canonicalUrl },
          ],
        })])
      }
    }

    if (pageData.relativePath === 'index.md') {
      pageData.frontmatter.head.push(['script', { type: 'application/ld+json' }, faqSchema(homeFaqs)])
    }

    if (pageData.relativePath === 'cloud.md') {
      pageData.frontmatter.head.push(['script', { type: 'application/ld+json' }, faqSchema(cloudFaqs)])
    }

    if (pageData.relativePath.startsWith('docs/')) {
      const parts = pageData.relativePath.replace(/\.md$/, '').split('/')
      const breadcrumbs = [
        { name: 'OpenBin', item: SITE_URL },
        { name: 'Documentation', item: `${SITE_URL}/docs/` },
      ]
      if (parts.length > 2) {
        const section = parts[1]
        const sectionNames: Record<string, string> = {
          'getting-started': 'Getting Started',
          'guide': 'Guide',
          'api': 'API Reference',
        }
        if (sectionNames[section]) {
          breadcrumbs.push({
            name: sectionNames[section],
            item: `${SITE_URL}/docs/${section}/`,
          })
        }
      }
      if (pageData.title && parts[parts.length - 1] !== 'index') {
        breadcrumbs.push({ name: pageData.title, item: canonicalUrl })
      }
      pageData.frontmatter.head.push(['script', { type: 'application/ld+json' }, JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((b, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: b.name,
          item: b.item,
        })),
      })])
    }
  },
  themeConfig: {
    logo: {
      dark: '/logo-horizontal-dark.svg',
      alt: 'OpenBin',
    },
    siteTitle: false,
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Documentation', link: '/docs/' },
      { text: 'Blog', link: '/blog/' },
      { text: 'OpenBin Cloud', link: '/cloud' },
    ],
    sidebar: {
      '/docs/': [
        {
          text: 'Introduction',
          items: [
            { text: 'What is OpenBin?', link: '/docs/' },
            { text: 'Screenshots', link: '/docs/screenshots' },
          ],
        },
        {
          text: 'Getting Started',
          link: '/docs/getting-started/',
          collapsed: false,
          items: [
            { text: 'Docker', link: '/docs/getting-started/docker' },
            { text: 'Local Development', link: '/docs/getting-started/local-dev' },
            { text: 'Configuration', link: '/docs/getting-started/configuration' },
          ],
        },
        {
          text: 'Guide',
          collapsed: false,
          items: [
            { text: 'Locations & Areas', link: '/docs/guide/locations' },
            { text: 'Bins', link: '/docs/guide/bins' },
            { text: 'Items & Tags', link: '/docs/guide/items-tags' },
            { text: 'Photos', link: '/docs/guide/photos' },
            { text: 'Attachments', link: '/docs/guide/attachments' },
            { text: 'Checkouts', link: '/docs/guide/checkouts' },
            { text: 'Bin Sharing', link: '/docs/guide/sharing' },
            { text: 'QR Scanning', link: '/docs/guide/qr-scanning' },
            { text: 'Print Labels', link: '/docs/guide/print-labels' },
            { text: 'Search & Filter', link: '/docs/guide/search-filter' },
            { text: 'Dashboard', link: '/docs/guide/dashboard' },
            { text: 'Usage Tracking', link: '/docs/guide/usage' },
            { text: 'Activity Log', link: '/docs/guide/activity' },
            { text: 'Bulk Add', link: '/docs/guide/bulk-add' },
            { text: 'Bulk Operations', link: '/docs/guide/bulk-operations' },
            { text: 'Account & Profile', link: '/docs/guide/profile' },
            { text: 'Keyboard Shortcuts', link: '/docs/guide/shortcuts' },
          ],
        },
        {
          text: 'AI & Integrations',
          collapsed: false,
          items: [
            {
              text: 'AI',
              collapsed: true,
              items: [
                { text: 'Overview & Setup', link: '/docs/guide/ai/' },
                { text: 'Photo Analysis', link: '/docs/guide/ai/photo-analysis' },
                { text: 'AI Assistant', link: '/docs/guide/ai/assistant' },
                { text: 'AI Reorganization', link: '/docs/guide/ai/reorganization' },
                { text: 'Task Routing', link: '/docs/guide/ai/task-routing' },
                { text: 'Custom Prompts & Tuning', link: '/docs/guide/ai/advanced' },
              ],
            },
            { text: 'API Keys', link: '/docs/guide/api-keys' },
            { text: 'MCP Server', link: '/docs/guide/mcp-server' },
            { text: 'Import & Export', link: '/docs/guide/import-export' },
          ],
        },
        {
          text: 'Troubleshooting',
          collapsed: false,
          items: [
            { text: 'FAQ', link: '/docs/guide/faq' },
          ],
        },
        {
          text: 'API Reference',
          collapsed: true,
          items: [
            { text: 'Overview', link: '/docs/api/' },
            { text: 'Auth', link: '/docs/api/auth' },
            { text: 'Locations', link: '/docs/api/locations' },
            { text: 'Areas', link: '/docs/api/areas' },
            { text: 'Bins', link: '/docs/api/bins' },
            { text: 'Custom Fields', link: '/docs/api/custom-fields' },
            { text: 'Photos', link: '/docs/api/photos' },
            { text: 'Tag Colors', link: '/docs/api/tag-colors' },
            { text: 'Print Settings', link: '/docs/api/print-settings' },
            { text: 'Export', link: '/docs/api/export' },
            { text: 'AI', link: '/docs/api/ai' },
            { text: 'Activity', link: '/docs/api/activity' },
            { text: 'API Keys', link: '/docs/api/api-keys' },
            { text: 'User Preferences', link: '/docs/api/preferences' },
            { text: 'Saved Views', link: '/docs/api/saved-views' },
            { text: 'Scan History', link: '/docs/api/scan-history' },
            { text: 'Batch Operations', link: '/docs/api/batch' },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'discord', link: 'https://discord.gg/W6JPZCqqx9' },
      { icon: 'github', link: 'https://github.com/akifbayram/openbin' },
    ],
    search: {
      provider: 'local',
    },
    editLink: {
      pattern: 'https://github.com/akifbayram/openbin-website/edit/main/:path',
      text: 'Edit this page on GitHub',
    },
    footer: {
      message: '<a href="/docs/">Docs</a> · <a href="/blog/">Blog</a> · <a href="/cloud">Cloud</a> · <a href="https://github.com/akifbayram/openbin" target="_blank" rel="noopener">GitHub</a> · <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a><br><span style="opacity:0.6;font-size:0.85em">As an Amazon Associate we earn from qualifying purchases.</span>',
      copyright: '© 2026 OpenBin',
    },
  },
})
