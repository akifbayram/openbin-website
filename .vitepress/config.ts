import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'OpenBin - Inventory with Intelligence',
  description: 'Snap a photo, let AI catalog it. QR labels, search, and multi-user access.',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@700&display=swap', rel: 'stylesheet' }],
    ['meta', { property: 'og:title', content: 'OpenBin - Inventory with Intelligence' }],
    ['meta', { property: 'og:description', content: 'Snap a photo, let AI catalog it. QR labels, search, and multi-user access.' }],
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
      { text: 'Documentation', link: 'https://docs.openbin.app/' },
      { text: 'Login', link: 'https://cloud.openbin.app/' },
      { text: 'Billing', link: 'https://billing.openbin.app/' },
    ],
    sidebar: false,
    aside: false,
    socialLinks: [
      { icon: 'discord', link: 'https://discord.gg/W6JPZCqqx9' },
      { icon: 'github', link: 'https://github.com/akifbayram/openbin' },
    ],
    footer: {
      message: 'Open source on GitHub',
      copyright: '© 2025 OpenBin',
    },
  },
})
