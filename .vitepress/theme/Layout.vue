<script setup>
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
const { Layout } = DefaultTheme

const route = useRoute()
const hideSearch = computed(() =>
  route.path === '/' || route.path === '/index.html' ||
  route.path === '/cloud' || route.path === '/cloud.html'
)
</script>

<template>
  <div :class="{ 'hide-search': hideSearch }">
    <Layout>
      <template #nav-bar-content-after>
        <a href="https://cloud.openbin.app/" class="nav-login-btn">Log In</a>
      </template>
    </Layout>
  </div>
</template>
