import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'OpenBin',
  description: 'Self-hosted bin inventory with QR codes and AI',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  themeConfig: {
    logo: {
      light: '/logo-horizontal.svg',
      dark: '/logo-horizontal-dark.svg',
      alt: 'OpenBin',
    },
    siteTitle: false,
    nav: [
      { text: 'Documentation', link: 'https://docs.openbin.app/' },
      { text: 'Login', link: 'https://cloud.openbin.app/' },
      { text: 'Billing', link: 'https://cloud.openbin.app/billing' },
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
