<script setup>
import { computed, useSlots } from 'vue'
import { useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
const { Layout } = DefaultTheme

const route = useRoute()
const slots = useSlots()
const hideSearch = computed(() =>
  route.path === '/' || route.path === '/index.html' ||
  route.path === '/cloud' || route.path === '/cloud.html'
)
const isBlogPost = computed(() => route.path.startsWith('/blog/posts/'))
</script>

<template>
  <div :class="{ 'hide-search': hideSearch, 'blog-post-page': isBlogPost }">
    <Layout>
      <template #nav-bar-content-after>
        <a href="https://cloud.openbin.app/" class="nav-login-btn">Log In</a>
      </template>
      <template v-for="(_, name) in slots" :key="name" #[name]="slotData">
        <slot :name="name" v-bind="slotData || {}" />
      </template>
    </Layout>
  </div>
</template>
