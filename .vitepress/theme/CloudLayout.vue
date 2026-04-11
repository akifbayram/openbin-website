<script setup>
import { ref, computed, onMounted } from 'vue'
import { cloudFaqs as faqs } from '../data/faqs'

// ── Billing toggle ──
const billing = ref('monthly')

// ── FAQ accordion ──
const openFaq = ref(null)
function toggleFaq(i) {
  openFaq.value = openFaq.value === i ? null : i
}

// ── Plans ──
const plans = computed(() => [
  {
    name: 'Free',
    badge: null,
    price: '$0',
    priceDetail: '/month',
    description: 'No card required.',
    cta: 'Sign Up Free',
    ctaLink: 'https://cloud.openbin.app/',
    ctaClass: 'btn-secondary',
    highlight: false,
    limits: [
      { label: 'Bins', value: '10' },
      { label: 'Locations', value: '1' },
      { label: 'Members', value: '1' },
      { label: 'Photo storage', value: '—' },
      { label: 'AI actions', value: '10/mo' },
    ],
    features: [
      { name: 'Custom labels', included: true, link: '/docs/guide/print-labels/' },
      { name: 'Areas & tags', included: true, link: '/docs/guide/items-tags/' },
      { name: 'Saved views', included: true, link: '/docs/guide/search-filter/' },
      { name: 'Bulk operations', included: true, link: '/docs/guide/bulk-operations/' },
      { name: 'AI assistant', included: true, link: '/docs/guide/ai.html#ai-assistant' },
      { name: 'Community support', included: true},

    ],
  },
  {
    name: 'Plus',
    badge: null,
    price: billing.value === 'monthly' ? '$3' : '$2.50',
    priceDetail: billing.value === 'monthly' ? '/month' : '/mo, billed annually',
    description: 'One person, one location.',
    cta: 'Start Free Trial',
    ctaLink: 'https://cloud.openbin.app/',
    ctaClass: 'btn-secondary',
    highlight: false,
    limits: [
      { label: 'Bins', value: '100' },
      { label: 'Locations', value: '1' },
      { label: 'Members', value: '1' },
      { label: 'Photo storage', value: '100 MB' },
      { label: 'AI actions', value: '25/mo' },
    ],
    features: [
      { name: 'Custom labels', included: true, link: '/docs/guide/print-labels/' },
      { name: 'Areas & tags', included: true, link: '/docs/guide/items-tags/' },
      { name: 'Saved views', included: true, link: '/docs/guide/search-filter/' },
      { name: 'Bulk operations', included: true, link: '/docs/guide/bulk-operations/' },
      { name: 'Photo upload', included: true, link: '/docs/guide/photos/' },
      { name: 'AI assistant', included: true, link: '/docs/guide/ai.html#ai-assistant' },
      { name: 'AI reorganization', included: true, link: '/docs/guide/ai.html#ai-reorganization' },
      { name: 'AI object recognition', included: true, link: '/docs/guide/ai.html#ai-object-recognition' },
      { name: 'Priority support', included: true},
    ],
  },
  {
    name: 'Pro',
    badge: 'Best Value',
    badgeClass: 'plan-badge--popular',
    price: billing.value === 'monthly' ? '$6' : '$5',
    priceDetail: billing.value === 'monthly' ? '/month' : '/mo, billed annually',
    description: 'Share it with your team.',
    cta: 'Get Pro',
    ctaLink: 'https://cloud.openbin.app/',
    ctaClass: 'btn-primary',
    highlight: true,
    limits: [
      { label: 'Bins', value: '1000' },
      { label: 'Locations', value: '10' },
      { label: 'Members', value: '10/loc' },
      { label: 'Photo storage', value: '1 GB' },
      { label: 'AI actions', value: '250/mo' },
    ],
    features: [
      { name: 'Custom labels', included: true, link: '/docs/guide/print-labels/' },
      { name: 'Areas & tags', included: true, link: '/docs/guide/items-tags/' },
      { name: 'Saved views', included: true, link: '/docs/guide/search-filter/' },
      { name: 'Bulk operations', included: true, link: '/docs/guide/bulk-operations/' },
      { name: 'Photo upload', included: true, link: '/docs/guide/photos/' },
      { name: 'AI assistant', included: true, link: '/docs/guide/ai.html#ai-assistant' },
      { name: 'AI reorganization', included: true, link: '/docs/guide/ai.html#ai-reorganization' },
      { name: 'AI object recognition', included: true, link: '/docs/guide/ai.html#ai-object-recognition' },
      { name: 'Priority support', included: true},
      { name: 'Custom fields', included: true },
      { name: 'API keys', included: true, link: '/docs/guide/api-keys/' },
      { name: 'Bin sharing', included: true },
    ],
  },
])

// ── Feature comparison table ──
const tierKeys = ['free', 'plus', 'pro']
const comparison = [
  {
    category: 'Basics',
    rows: [
      { feature: 'Bins', free: '10', plus: '100', pro: '1,000' },
      { feature: 'Locations', free: '1', plus: '1', pro: '10', link: '/docs/guide/locations/' },
      { feature: 'Members', free: '1', plus: '1', pro: '10' },
      { feature: 'Photo storage', free: false, plus: '100 MB', pro: '1 GB', link: '/docs/guide/photos/' },
      { feature: 'Activity history', free: '7 days', plus: '30 days', pro: '90 days' },
    ],
  },
  {
    category: 'Organization',
    rows: [
      { feature: 'Areas & tags', free: true, plus: true, pro: true, link: '/docs/guide/items-tags/' },
      { feature: 'Custom fields', free: false, plus: false, pro: true },
      { feature: 'Saved views', free: true, plus: true, pro: true, link: '/docs/guide/search-filter/' },
      { feature: 'Bulk operations', free: true, plus: true, pro: true, link: '/docs/guide/bulk-operations/' },
    ],
  },
  {
    category: 'AI',
    rows: [
      { feature: 'AI actions', free: '10/mo', plus: '25/mo', pro: '250/mo', link: '/docs/guide/ai/' },
      { feature: 'AI assistant', free: true, plus: true, pro: true, link: '/docs/guide/ai/' },
      { feature: 'AI reorganization', free: false, plus: true, pro: true, link: '/docs/guide/ai/' },
      { feature: 'AI object recognition', free: false, plus: true, pro: true, link: '/docs/guide/ai/' },
    ],
  },
  {
    category: 'Labels & Sharing',
    rows: [
      { feature: 'Custom labels', free: true, plus: true, pro: true, link: '/docs/guide/print-labels/' },
      { feature: 'Bin sharing links', free: false, plus: false, pro: true },
    ],
  },
  {
    category: 'Data & Integration',
    rows: [
      { feature: 'CSV export', free: true, plus: true, pro: true, link: '/docs/guide/import-export/' },
      { feature: 'Full export (ZIP/JSON)', free: false, plus: true, pro: true, link: '/docs/guide/import-export/' },
      { feature: 'API access', free: false, plus: false, pro: true, link: '/docs/guide/api-keys/' },
    ],
  },
  {
    category: 'Infrastructure',
    rows: [
      { feature: 'Updates', free: 'Automatic', plus: 'Automatic', pro: 'Automatic' },
      { feature: 'Backups', free: 'Managed', plus: 'Managed', pro: 'Managed' },
      { feature: 'Support', free: 'Community', plus: 'Priority', pro: 'Priority' },
    ],
  },
]

// ── Cloud benefits ──
const benefits = [
  { icon: 'zap', title: 'No setup', desc: 'Sign up and start organizing. No Docker, no server, no config files.' },
  { icon: 'refresh', title: 'Always up to date', desc: 'New features and security patches ship automatically.' },
  { icon: 'shield', title: 'Managed backups', desc: 'Your data is backed up daily. Restore anytime from your dashboard.' },
  { icon: 'cpu', title: 'AI included', desc: 'Photo recognition, natural language, and reorganization on Plus.' },
]

// ── Scroll animation ──
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

</script>

<template>
  <div class="home-layout">
    <!-- Animated background -->
    <div class="animated-bg" aria-hidden="true">
      <div class="animated-bg__orb animated-bg__orb--1"></div>
      <div class="animated-bg__orb animated-bg__orb--2"></div>
      <div class="animated-bg__orb animated-bg__orb--3"></div>
    </div>

    <!-- ════════ Pricing ════════ -->
    <section id="pricing" class="px-6 py-16 scroll-mt-16">
      <div class="mx-auto max-w-5xl text-center">
        <h2 class="display-heading scroll-reveal text-3xl lg:text-4xl">
          Pricing
        </h2>
        <p class="scroll-reveal mx-auto mt-4 max-w-xl" style="color: var(--vp-c-text-2)">
          Start free, upgrade anytime. 7-day Plus trial included — no credit card required.
        </p>

        <!-- Billing toggle -->
        <div
          class="scroll-reveal billing-toggle mx-auto mt-8"
          role="radiogroup"
          aria-label="Billing period"
        >
          <button
            role="radio"
            :aria-checked="billing === 'monthly'"
            class="billing-pill"
            :class="{ 'billing-pill--active': billing === 'monthly' }"
            @click="billing = 'monthly'"
          >
            Monthly
          </button>
          <button
            role="radio"
            :aria-checked="billing === 'annual'"
            class="billing-pill"
            :class="{ 'billing-pill--active': billing === 'annual' }"
            @click="billing = 'annual'"
          >
            Annual
            <span class="billing-save">Save 17%</span>
          </button>
        </div>

        <div class="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 text-left sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="plan in plans"
            :key="plan.name"
            class="scroll-reveal pricing-card relative flex flex-col rounded-lg p-8"
            :style="{
              border: plan.highlight
                ? '2px solid var(--vp-c-brand-1)'
                : '1px solid var(--vp-c-divider)',
              background: 'var(--vp-c-bg-soft)',
            }"
          >
            <span
              v-if="plan.badge"
              class="plan-badge"
              :class="plan.badgeClass"
            >
              {{ plan.badge }}
            </span>

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
              <span style="color: var(--vp-c-text-3)">{{ plan.priceDetail }}</span>
            </div>

            <p class="mt-3" style="color: var(--vp-c-text-2)">
              {{ plan.description }}
            </p>

            <div class="mt-6">
              <a
                :href="plan.ctaLink"
                :class="plan.ctaClass"
                class="w-full justify-center"
              >
                {{ plan.cta }} <span class="btn-arrow">&rarr;</span>
              </a>
            </div>

            <div v-if="plan.limits" class="plan-limits mt-6">
              <div
                v-for="limit in plan.limits"
                :key="limit.label"
                class="plan-limit"
              >
                <span class="plan-limit-label">{{ limit.label }}</span>
                <span
                  class="plan-limit-value"
                  :style="{ color: limit.value === '—' ? 'var(--vp-c-text-3)' : 'var(--vp-c-text-1)' }"
                >
                  {{ limit.value }}
                </span>
              </div>
            </div>

            <div
              v-if="plan.preamble"
              class="mt-6 mb-3 text-sm font-medium"
              style="color: var(--vp-c-text-3)"
            >
              {{ plan.preamble }}
            </div>

            <ul :class="['pricing-list flex-1 space-y-3', plan.preamble ? '' : 'mt-6']">
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
                <a v-if="feature.link" :href="feature.link" class="pricing-feature-link">{{ feature.name }}</a>
                <span v-else>{{ feature.name }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Trust signals -->
        <p
          class="mt-6 text-center text-sm"
          style="color: var(--vp-c-text-3)"
        >
          Free plan &middot; 7-day Plus subscription trial &middot; No credit card required
        </p>

        <!-- AI actions explainer -->
        <div class="scroll-reveal ai-actions-explainer mx-auto mt-10 max-w-3xl text-left">
          <h3 class="text-xl font-semibold" style="color: var(--vp-c-text-1)">What counts as an AI action?</h3>
          <p class="mt-4" style="color: var(--vp-c-text-2)">
            An AI action is one request to the AI: scanning a photo, chatting with the AI assistant, searching your inventory, or generating a reorganization suggestion. Each request uses one action from your monthly allowance.
          </p>
          <p class="mt-4" style="color: var(--vp-c-text-2)">
            The <a href="/docs/guide/ai.html#ai-assistant" class="pricing-feature-link">AI assistant</a> and <a href="/docs/guide/ai.html#inventory-search" class="pricing-feature-link">inventory search</a> are included with every plan. <a href="/docs/guide/ai.html#photo-analysis" class="pricing-feature-link">Photo analysis</a>, <a href="/docs/guide/ai.html#ai-reorganization" class="pricing-feature-link">AI reorganization</a>, and <a href="/docs/guide/ai.html#ai-object-recognition" class="pricing-feature-link">object recognition</a> are available on Plus and Pro.
          </p>
        </div>
      </div>
    </section>

    <!-- ════════ Why Cloud ════════ -->
    <section class="px-6 py-6">
      <div class="mx-auto max-w-5xl">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="(b, i) in benefits"
            :key="b.title"
            class="scroll-reveal feature-card rounded-lg p-6"
            :class="'stagger-' + (i + 1)"
          >
            <div class="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg" style="background: var(--vp-c-brand-soft)">
              <!-- Zap -->
              <svg v-if="b.icon === 'zap'" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--vp-c-brand-1)"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
              <!-- Refresh -->
              <svg v-else-if="b.icon === 'refresh'" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--vp-c-brand-1)"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
              <!-- Shield -->
              <svg v-else-if="b.icon === 'shield'" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--vp-c-brand-1)"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              <!-- CPU -->
              <svg v-else-if="b.icon === 'cpu'" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--vp-c-brand-1)"><rect x="4" y="4" width="16" height="16" rx="2" ry="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" /></svg>
            </div>
            <h3 class="text-lg font-semibold" style="color: var(--vp-c-text-1)">{{ b.title }}</h3>
            <p class="mt-2 text-sm" style="color: var(--vp-c-text-2)">{{ b.desc }}</p>
          </div>
        </div>
      </div>
    </section>


    <!-- ════════ What to Expect ════════ -->
    <section class="px-6 py-16">
      <div class="mx-auto max-w-3xl">
        <h2 class="display-heading scroll-reveal mb-10 text-center text-3xl lg:text-4xl">
          What to expect
        </h2>

        <div class="scroll-reveal" style="color: var(--vp-c-text-2)">
          <p class="mb-6">
            <strong style="color: var(--vp-c-text-1)">Nothing to maintain.</strong>
            Updates and security patches apply automatically. There's no server to monitor, no Docker to configure, no database to manage. You sign up, and it works.
          </p>

          <p class="mb-6">
            <strong style="color: var(--vp-c-text-1)">Your data stays yours.</strong>
            We back up daily, and you can download a full export — bins, items, photos, tags — from your account settings at any time. If you ever want to switch to self-hosting, your data comes with you.
          </p>

          <p>
            <strong style="color: var(--vp-c-text-1)">AI actions, explained.</strong>
            Every plan includes monthly AI actions. One action covers one task: scanning a photo, running an AI assistant instruction, or getting a reorganization suggestion. Free includes 10, Plus includes 25, and Pro includes 250 per month. Unused actions don't roll over.
          </p>
        </div>
      </div>
    </section>

    <div class="section-divider"></div>

    <!-- ════════ Feature Comparison ════════ -->
    <section class="px-6 py-16" style="background: var(--vp-c-bg-soft)">
      <div class="mx-auto max-w-5xl">
        <h2
          class="display-heading scroll-reveal mb-10 text-center text-3xl lg:text-4xl"
        >
          Compare plans
        </h2>
        <div class="scroll-reveal comparison-wrap">
          <table class="comparison-table">
            <thead>
              <tr>
                <th class="comparison-feature-col" scope="col">
                  <span class="sr-only">Feature</span>
                </th>
                <th scope="col">Free</th>
                <th scope="col">Plus</th>
                <th scope="col" class="comparison-highlight-col">Pro</th>
              </tr>
            </thead>
            <tbody v-for="group in comparison" :key="group.category">
              <tr class="comparison-cat-row">
                <td colspan="4">{{ group.category }}</td>
              </tr>
              <tr v-for="row in group.rows" :key="row.feature">
                <td class="comparison-feature-col">
                  <a v-if="row.link" :href="row.link" class="pricing-feature-link">{{ row.feature }}</a>
                  <template v-else>{{ row.feature }}</template>
                </td>
                <td v-for="key in tierKeys" :key="key" :class="{ 'comparison-highlight-col': key === 'pro' }">
                  <svg
                    v-if="row[key] === true"
                    aria-label="Included"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    style="color: var(--vp-c-brand-1)"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <svg
                    v-else-if="row[key] === false"
                    aria-label="Not included"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    style="color: var(--vp-c-text-3)"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span v-else>{{ row[key] }}</span>
                </td>
              </tr>
            </tbody>
          </table>
          <p class="comparison-footnote">
            Prefer to run it yourself? <a href="/docs/getting-started/" style="color: var(--vp-c-brand-1); text-decoration: underline;">Self-host for free</a> with all features included.
          </p>
        </div>
      </div>
    </section>

    <!-- ════════ FAQ ════════ -->
    <section class="px-6 py-16">
      <div class="mx-auto max-w-3xl">
        <h2
          class="display-heading scroll-reveal mb-10 text-center text-3xl lg:text-4xl"
        >
          Questions
        </h2>
        <div class="scroll-reveal">
          <div v-for="(faq, i) in faqs" :key="i" class="faq-item">
            <button
              :id="'cloud-faq-btn-' + i"
              class="flex w-full items-center justify-between py-4 text-left"
              :aria-expanded="openFaq === i"
              :aria-controls="'cloud-faq-' + i"
              @click="toggleFaq(i)"
            >
              <span class="pr-4 text-lg font-semibold">{{ faq.q }}</span>
              <svg
                aria-hidden="true"
                class="faq-chevron shrink-0"
                :class="{ 'faq-chevron--open': openFaq === i }"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            <div :id="'cloud-faq-' + i" role="region" :aria-labelledby="'cloud-faq-btn-' + i" class="faq-answer" :class="{ 'faq-answer--open': openFaq === i }">
              <div class="overflow-hidden">
                <p class="pb-4">{{ faq.a }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════ Bottom CTA ════════ -->
    <section class="cta-bg px-6 py-16 text-center">
      <h2
        class="display-heading scroll-reveal text-3xl lg:text-4xl"
      >
        Start organizing
      </h2>
      <p class="scroll-reveal mx-auto mt-4 max-w-xl text-lg">
        Use OpenBin Cloud for free, or self-host.
      </p>
      <div class="scroll-reveal mt-8 flex flex-wrap justify-center gap-4">
        <a href="https://cloud.openbin.app/" class="btn-primary">
          Try Cloud <span class="btn-arrow">&rarr;</span>
        </a>
        <a href="/docs/getting-started/" class="btn-secondary">
          Self-Host <span class="btn-arrow">&rarr;</span>
        </a>
      </div>
    </section>
  </div>
</template>

<style>
/* ── AI actions explainer ── */

.ai-actions-explainer {
  padding: 2rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}

/* ── Billing toggle ── */

.billing-toggle {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
}

.billing-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-text-3);
  background: transparent;
  border: none;
  border-radius: 7px;
  cursor: pointer;
  transition: color 0.2s, background 0.2s;
}

.billing-pill:hover {
  color: var(--vp-c-text-1);
}

.billing-pill--active {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
}

.billing-save {
  font-size: 0.65rem;
  font-weight: 700;
  color: #16a34a;
  background: rgba(34, 197, 94, 0.12);
  padding: 1px 6px;
  border-radius: 4px;
  white-space: nowrap;
}

.billing-pill:focus-visible {
  outline: 2px solid var(--vp-c-brand-3);
  outline-offset: 2px;
}

/* ── Plan badge ── */

.plan-badge {
  position: absolute;
  top: -11px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 14px;
  border-radius: 999px;
  white-space: nowrap;
  letter-spacing: 0.02em;
}

.plan-badge--popular {
  color: #fff;
  background: var(--vp-c-brand-1);
}

/* ── Plan limits ── */

.plan-limits {
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 0.75rem;
}

.plan-limit {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.3rem 0;
  font-size: 0.85rem;
}

.plan-limit-label {
  color: var(--vp-c-text-2);
}

.plan-limit-value {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

/* ── Comparison table ── */

.comparison-wrap {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg);
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
  min-width: 560px;
}

.comparison-table thead th {
  position: sticky;
  top: 0;
  z-index: 2;
  padding: 0.875rem 1rem;
  font-weight: 700;
  font-size: 0.8rem;
  text-align: center;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  border-bottom: 1px solid var(--vp-c-divider);
}

.comparison-feature-col {
  text-align: left !important;
  padding-left: 1.25rem !important;
  min-width: 160px;
}

.comparison-highlight-col {
  background: var(--vp-c-brand-soft) !important;
}

.comparison-cat-row td {
  padding: 0.625rem 1rem 0.375rem 1.25rem;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--vp-c-text-3);
  border-top: 1px solid var(--vp-c-divider);
}

.comparison-table tbody tr:not(.comparison-cat-row) td {
  padding: 0.5rem 1rem;
  text-align: center;
  color: var(--vp-c-text-2);
  border-top: 1px solid color-mix(in srgb, var(--vp-c-divider) 50%, transparent);
}

.comparison-table tbody tr:not(.comparison-cat-row) td:first-child {
  text-align: left;
  padding-left: 1.25rem;
  color: var(--vp-c-text-1);
  font-weight: 500;
}

.comparison-table svg {
  display: inline-block;
  vertical-align: middle;
}

.comparison-footnote {
  padding: 0.75rem 1.25rem;
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  border-top: 1px solid var(--vp-c-divider);
}

/* ── Pricing feature links ── */

.pricing-feature-link {
  color: inherit;
  text-decoration: underline;
  text-decoration-color: color-mix(in srgb, currentColor 30%, transparent);
  text-underline-offset: 2px;
  transition: text-decoration-color 0.2s;
}

.pricing-feature-link:hover {
  text-decoration-color: var(--vp-c-brand-1);
}

.pricing-feature-link:focus-visible {
  outline: 2px solid var(--vp-c-brand-3);
  outline-offset: 2px;
}

/* Sticky first column on mobile scroll */
@media (max-width: 640px) {
  .comparison-table thead th:first-child,
  .comparison-table tbody td:first-child {
    position: sticky;
    left: 0;
    z-index: 1;
    background: var(--vp-c-bg);
  }

  .comparison-cat-row td {
    position: sticky;
    left: 0;
    z-index: 1;
    background: var(--vp-c-bg);
  }
}
</style>
