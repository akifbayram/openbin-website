import tailwindcss from '@tailwindcss/vite'
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

export default defineConfig({
  title: 'OpenBin | Inventory with Intelligence',
  description: SITE_DESCRIPTION,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@700&display=swap', rel: 'stylesheet' }],
    ['meta', { property: 'og:title', content: SITE_TITLE }],
    ['meta', { property: 'og:description', content: SITE_DESCRIPTION }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: SITE_URL }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: SITE_TITLE }],
    ['meta', { name: 'twitter:description', content: SITE_DESCRIPTION }],
    ['meta', { property: 'og:image', content: `${SITE_URL}/og-image.png` }],
    ['meta', { name: 'twitter:image', content: `${SITE_URL}/og-image.png` }],
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
    plugins: [tailwindcss()],
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
      { text: 'OpenBin Cloud', link: '/cloud' },
    ],
    sidebar: {
      '/docs/': [
        {
          text: 'Introduction',
          items: [
            { text: 'What is OpenBin?', link: '/docs/' },
          ],
        },
        {
          text: 'Getting Started',
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
            { text: 'Bins', link: '/docs/guide/bins' },
            { text: 'QR Scanning', link: '/docs/guide/qr-scanning' },
            { text: 'Search & Filter', link: '/docs/guide/search-filter' },
            { text: 'Dashboard', link: '/docs/guide/dashboard' },
            { text: 'Locations & Areas', link: '/docs/guide/locations' },
            { text: 'Photos', link: '/docs/guide/photos' },
            { text: 'Print Labels', link: '/docs/guide/print-labels' },
            { text: 'Items & Tags', link: '/docs/guide/items-tags' },
            { text: 'Bulk Operations', link: '/docs/guide/bulk-operations' },
            { text: 'Bulk Add', link: '/docs/guide/bulk-add' },
            { text: 'Account & Profile', link: '/docs/guide/profile' },
            { text: 'Keyboard Shortcuts', link: '/docs/guide/shortcuts' },
          ],
        },
        {
          text: 'AI & Integrations',
          collapsed: false,
          items: [
            { text: 'AI Features', link: '/docs/guide/ai' },
            { text: 'MCP Server', link: '/docs/guide/mcp-server' },
            { text: 'API Keys', link: '/docs/guide/api-keys' },
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
      message: 'Open source on GitHub · Built by <a href="https://github.com/akifbayram" target="_blank" rel="noopener">Akif Bayram</a> · <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a>',
      copyright: '© 2026 OpenBin',
    },
  },
})
