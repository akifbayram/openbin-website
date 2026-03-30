<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  const targets = document.querySelectorAll('.scroll-reveal')
  if (!targets.length) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('scroll-visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.15 }
  )

  targets.forEach((el) => observer.observe(el))
})

const plans = [
  {
    name: 'Self-Hosted',
    price: 'Free',
    period: 'forever',
    description: 'Run on your own hardware. All features, no limits.',
    cta: 'Get Started',
    ctaLink: 'https://docs.openbin.app/getting-started/',
    ctaClass: 'btn-secondary',
    highlight: false,
    features: [
      { name: 'Unlimited locations', included: true },
      { name: 'Unlimited members', included: true },
      { name: 'Unlimited photo storage', included: true },
      { name: 'AI categorization', included: true },
      { name: 'API keys & MCP server', included: true },
      { name: 'Custom fields', included: true },
      { name: 'Full export (ZIP/JSON)', included: true },
      { name: 'AI reorganization', included: true },
      { name: 'Bin sharing', included: true },
    ],
  },
  {
    name: 'Lite',
    price: '$5',
    period: '/month',
    description: 'For individuals getting started with cloud hosting.',
    cta: 'Start Free Trial',
    ctaLink: 'https://cloud.openbin.app/',
    ctaClass: 'btn-secondary',
    highlight: false,
    features: [
      { name: '1 location', included: true },
      { name: '1 member', included: true },
      { name: '100 MB photo storage', included: true },
      { name: 'AI categorization', included: false },
      { name: 'API keys & MCP server', included: false },
      { name: 'Custom fields', included: false },
      { name: 'Full export (ZIP/JSON)', included: false },
      { name: 'AI reorganization', included: false },
      { name: 'Bin sharing', included: false },
    ],
  },
  {
    name: 'Pro',
    price: '$12',
    period: '/month',
    description: 'For teams and power users who want it all.',
    cta: 'Start Free Trial',
    ctaLink: 'https://cloud.openbin.app/',
    ctaClass: 'btn-primary',
    highlight: true,
    features: [
      { name: 'Unlimited locations', included: true },
      { name: 'Unlimited members', included: true },
      { name: '5 GB photo storage', included: true },
      { name: 'AI categorization', included: true },
      { name: 'API keys & MCP server', included: true },
      { name: 'Custom fields', included: true },
      { name: 'Full export (ZIP/JSON)', included: true },
      { name: 'AI reorganization', included: true },
      { name: 'Bin sharing', included: true },
    ],
  },
]
</script>

<template>
  <div class="home-layout">
    <section class="hero-bg px-6 pt-16 pb-10 text-center">
      <h1
        class="display-heading gradient-text animate-in mx-auto max-w-3xl text-4xl lg:text-5xl"
      >
        Simple, transparent pricing
      </h1>
      <p
        class="animate-in delay-1 mx-auto mt-4 max-w-xl text-lg"
        style="color: var(--vp-c-text-2)"
      >
        Self-host free or let us handle it. Every plan includes unlimited bins.
      </p>
    </section>

    <section class="px-6 pb-16">
      <div class="mx-auto max-w-5xl">
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div
            v-for="plan in plans"
            :key="plan.name"
            class="scroll-reveal flex flex-col rounded-lg p-8"
            :style="{
              border: plan.highlight
                ? '2px solid var(--vp-c-brand-1)'
                : '1px solid var(--vp-c-divider)',
              background: 'var(--vp-c-bg-soft)',
            }"
          >
            <div
              v-if="plan.highlight"
              class="mb-4 inline-flex self-start rounded-md px-3 py-1 text-xs font-semibold"
              style="background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1)"
            >
              Most Popular
            </div>
            <h3
              class="text-2xl font-semibold"
              style="color: var(--vp-c-text-1)"
            >
              {{ plan.name }}
            </h3>
            <div class="mt-4 flex items-baseline gap-1">
              <span
                class="display-heading text-4xl"
                style="color: var(--vp-c-text-1)"
              >
                {{ plan.price }}
              </span>
              <span style="color: var(--vp-c-text-3)">{{ plan.period }}</span>
            </div>
            <p class="mt-3" style="color: var(--vp-c-text-2)">
              {{ plan.description }}
            </p>
            <div class="mt-6">
              <a :href="plan.ctaLink" :class="plan.ctaClass" class="w-full justify-center">
                {{ plan.cta }} <span class="btn-arrow">&rarr;</span>
              </a>
            </div>
            <ul class="pricing-list mt-8 flex-1 space-y-3">
              <li
                v-for="feature in plan.features"
                :key="feature.name"
                class="flex items-start gap-2 text-sm"
                :style="{ color: feature.included ? 'var(--vp-c-text-2)' : 'var(--vp-c-text-3)' }"
              >
                <svg
                  v-if="feature.included"
                  aria-hidden="true"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="mt-0.5 shrink-0"
                  style="color: var(--vp-c-brand-1)"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <svg
                  v-else
                  aria-hidden="true"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="mt-0.5 shrink-0"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>{{ feature.name }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>
