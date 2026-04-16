import DefaultTheme from 'vitepress/theme'
import { withBlogTheme } from 'vitepress-plugin-blog'
import 'vitepress-plugin-blog/style.css'
import mediumZoom from 'medium-zoom'
import { onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import Layout from './Layout.vue'
import HomeLayout from './HomeLayout.vue'
import CloudLayout from './CloudLayout.vue'
import AiLayout from './AiLayout.vue'
import BlogListLayout from './BlogListLayout.vue'
import './custom.css'

export default withBlogTheme({
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('HomeLayout', HomeLayout)
    app.component('CloudLayout', CloudLayout)
    app.component('AiLayout', AiLayout)
    app.component('BlogListLayout', BlogListLayout)
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('dark')
    }
  },
  setup() {
    const route = useRoute()
    let zoom: ReturnType<typeof mediumZoom> | null = null

    const ensureSkipLink = () => {
      if (document.getElementById('skip-to-content')) return
      const link = document.createElement('a')
      link.id = 'skip-to-content'
      link.href = '#VPContent'
      link.className = 'skip-link'
      link.textContent = 'Skip to content'
      document.body.prepend(link)
      document.getElementById('VPContent')?.setAttribute('tabindex', '-1')
    }

    const refreshZoom = () => {
      if (!zoom) {
        zoom = mediumZoom({ background: 'var(--vp-c-bg)', margin: 48 })
      } else {
        zoom.detach()
      }
      zoom.attach('.vp-doc img:not(.no-zoom)')
    }

    onMounted(() => {
      ensureSkipLink()
      refreshZoom()
    })
    watch(() => route.path, () => nextTick(refreshZoom))
  },
})
