import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'OpenBin',
  description: 'Self-hosted bin inventory with QR codes and AI',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@700&display=swap', rel: 'stylesheet' }],
    ['meta', { property: 'og:title', content: 'OpenBin — Organize Your Physical World' }],
    ['meta', { property: 'og:description', content: 'Self-hosted bin inventory with QR codes and AI' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: 'https://openbin.app' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    externalLinks: { target: '_self' },
  },
  themeConfig: {
    externalLinkIcon: false,
    logo: {
      light: '/logo-horizontal.svg',
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
      message: 'Released under the AGPL-3.0 License.',
      copyright: 'OpenBin',
    },
  },
})
