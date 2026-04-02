import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'OpenBin | Inventory with Intelligence',
  description: 'Snap a photo, let AI catalog it. QR labels and shared access for your whole household.',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@700&display=swap', rel: 'stylesheet' }],
    ['meta', { property: 'og:title', content: 'OpenBin - Inventory with Intelligence' }],
    ['meta', { property: 'og:description', content: 'Snap a photo, let AI catalog it. QR labels and shared access for your whole household.' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: 'https://openbin.app' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  appearance: false,
  themeConfig: {
    logo: {
      dark: '/logo-horizontal-dark.svg',
      alt: 'OpenBin',
    },
    siteTitle: false,
    nav: [
      { text: 'Pricing', link: '/pricing' },
      { text: 'Documentation', link: '/docs/' },
      { text: 'Login', link: 'https://cloud.openbin.app/' },
      { text: 'Billing', link: 'https://billing.openbin.app/' },
    ],
    sidebar: {
      '/docs/getting-started/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Overview', link: '/docs/getting-started/' },
            { text: 'Docker', link: '/docs/getting-started/docker' },
            { text: 'Local Development', link: '/docs/getting-started/local-dev' },
            { text: 'Reverse Proxy', link: '/docs/getting-started/reverse-proxy' },
            { text: 'Configuration', link: '/docs/getting-started/configuration' },
          ],
        },
      ],
      '/docs/guide/': [
        {
          text: 'Overview',
          link: '/docs/guide/',
        },
        {
          text: 'Core Features',
          collapsed: false,
          items: [
            { text: 'Bins', link: '/docs/guide/bins' },
            { text: 'QR Scanning', link: '/docs/guide/qr-scanning' },
            { text: 'Search & Filter', link: '/docs/guide/search-filter' },
            { text: 'Dashboard', link: '/docs/guide/dashboard' },
          ],
        },
        {
          text: 'Organize & Customize',
          collapsed: false,
          items: [
            { text: 'Locations & Areas', link: '/docs/guide/locations' },
            { text: 'Photos', link: '/docs/guide/photos' },
            { text: 'Print Labels', link: '/docs/guide/print-labels' },
            { text: 'Bulk Operations', link: '/docs/guide/bulk-operations' },
          ],
        },
        {
          text: 'AI & Automation',
          collapsed: false,
          items: [
            { text: 'AI Features', link: '/docs/guide/ai' },
            { text: 'Bulk Add', link: '/docs/guide/bulk-add' },
            { text: 'API Keys', link: '/docs/guide/api-keys' },
            { text: 'MCP Server', link: '/docs/guide/mcp-server' },
          ],
        },
        {
          text: 'Data Management',
          collapsed: false,
          items: [
            { text: 'Import & Export', link: '/docs/guide/import-export' },
            { text: 'Items & Tags', link: '/docs/guide/items-tags' },
            { text: 'Account & Profile', link: '/docs/guide/profile' },
            { text: 'Keyboard Shortcuts', link: '/docs/guide/shortcuts' },
          ],
        },
      ],
      '/docs/api/': [
        {
          text: 'API Reference',
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
        {
          text: 'Reference',
          items: [
            { text: 'Configuration', link: '/docs/getting-started/configuration' },
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
      message: 'Open source on GitHub',
      copyright: '© 2026 OpenBin',
    },
  },
})
