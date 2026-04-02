import DefaultTheme from 'vitepress/theme'
import mediumZoom from 'medium-zoom'
import { onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import HomeLayout from './HomeLayout.vue'
import PricingLayout from './PricingLayout.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('HomeLayout', HomeLayout)
    app.component('PricingLayout', PricingLayout)
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('dark')
    }
  },
  setup() {
    const route = useRoute()
    let zoom: ReturnType<typeof mediumZoom> | null = null

    const refreshZoom = () => {
      if (!zoom) {
        zoom = mediumZoom({ background: 'var(--vp-c-bg)', margin: 48 })
      } else {
        zoom.detach()
      }
      zoom.attach('.vp-doc img:not(.no-zoom)')
    }

    onMounted(refreshZoom)
    watch(() => route.path, () => nextTick(refreshZoom))
  },
}
