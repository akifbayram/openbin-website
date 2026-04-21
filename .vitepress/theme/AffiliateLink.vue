<script setup>
const AMAZON_TAG = 'openbin0e-20'

const props = defineProps({
  asin: { type: String, default: null },
  search: { type: String, default: null },
  domain: { type: String, default: 'amazon.com' },
})

const href = (() => {
  if (props.asin) {
    return `https://www.${props.domain}/dp/${props.asin}?tag=${AMAZON_TAG}`
  }
  const q = encodeURIComponent(props.search || '')
  return `https://www.${props.domain}/s?k=${q}&tag=${AMAZON_TAG}`
})()
</script>

<template>
  <a :href="href" target="_blank" rel="sponsored nofollow noopener"><slot /></a>
</template>
