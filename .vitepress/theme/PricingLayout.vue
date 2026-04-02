<script setup>
import { ref, computed, onMounted } from 'vue'

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
    name: 'Lite',
    badge: null,
    price: billing.value === 'monthly' ? '$5' : '$4',
    priceDetail: billing.value === 'monthly' ? '/month' : '/mo, billed annually',
    description: 'One person, one location.',
    cta: 'Start Free Trial',
    ctaLink: 'https://cloud.openbin.app/',
    ctaClass: 'btn-secondary',
    highlight: false,
    features: [
      { name: 'Unlimited bins', included: true },
      { name: '1 location', included: true },
      { name: '1 member', included: true },
      { name: '100 MB photo storage', included: true },
      { name: 'QR labels & scanning', included: true },
      { name: 'Areas & tags', included: true },
      { name: 'Search & saved views', included: true },
      { name: 'Bulk operations', included: true },
      { name: 'CSV export', included: true },
    ],
  },
  {
    name: 'Pro',
    badge: 'Most Popular',
    badgeClass: 'plan-badge--popular',
    price: billing.value === 'monthly' ? '$12' : '$10',
    priceDetail: billing.value === 'monthly' ? '/month' : '/mo, billed annually',
    description: 'Share it with your household or team.',
    cta: 'Start Free Trial',
    ctaLink: 'https://cloud.openbin.app/',
    ctaClass: 'btn-primary',
    highlight: true,
    preamble: 'All of Lite, plus:',
    features: [
      { name: 'Unlimited locations', included: true },
      { name: 'Unlimited members', included: true },
      { name: '5 GB photo storage', included: true },
      { name: 'AI categorization', included: true },
      { name: 'AI reorganization', included: true },
      { name: 'Natural language commands', included: true },
      { name: 'API keys & MCP server', included: true },
      { name: 'Custom fields', included: true },
      { name: 'Full export (ZIP/JSON)', included: true },
      { name: 'Bin sharing', included: true },
    ],
  },
])

// ── Feature comparison table ──
const comparison = [
  {
    category: 'Basics',
    rows: [
      { feature: 'Bins', lite: 'Unlimited', pro: 'Unlimited' },
      { feature: 'Locations', lite: '1', pro: 'Unlimited' },
      { feature: 'Members', lite: '1', pro: 'Unlimited' },
      { feature: 'Photo storage', lite: '100 MB', pro: '5 GB' },
    ],
  },
  {
    category: 'Organization',
    rows: [
      { feature: 'Areas & tags', lite: true, pro: true },
      { feature: 'Custom fields', lite: false, pro: true },
      { feature: 'Saved views', lite: true, pro: true },
      { feature: 'Bulk operations', lite: true, pro: true },
    ],
  },
  {
    category: 'AI',
    rows: [
      { feature: 'Photo recognition', lite: false, pro: true },
      { feature: 'AI reorganization', lite: false, pro: true },
      { feature: 'Natural language', lite: false, pro: true },
    ],
  },
  {
    category: 'Labels & Sharing',
    rows: [
      { feature: 'QR labels & scanning', lite: true, pro: true },
      { feature: 'Bin sharing links', lite: false, pro: true },
    ],
  },
  {
    category: 'Data & Integration',
    rows: [
      { feature: 'CSV export', lite: true, pro: true },
      { feature: 'Full export (ZIP/JSON)', lite: false, pro: true },
      { feature: 'API access', lite: false, pro: true },
      { feature: 'MCP server', lite: false, pro: true },
    ],
  },
  {
    category: 'Infrastructure',
    rows: [
      { feature: 'Updates', lite: 'Automatic', pro: 'Automatic' },
      { feature: 'Backups', lite: 'Managed', pro: 'Managed' },
      { feature: 'Support', lite: 'Email', pro: 'Priority' },
    ],
  },
]

// ── Pricing FAQ ──
const faqs = [
  {
    q: "What's included in the free trial?",
    a: 'Full Pro access for 7 days. No credit card required. After the trial, choose a plan or your account becomes read-only.',
  },
  {
    q: 'Can I switch plans later?',
    a: 'Yes. Upgrade or downgrade anytime from your account settings. Changes take effect immediately and billing is prorated.',
  },
  {
    q: 'How does self-hosted differ from cloud?',
    a: "Same software, same features. Self-hosted runs on your hardware with your own AI API keys. Cloud runs on ours with managed AI, backups, and updates included.",
  },
  {
    q: 'What counts toward photo storage?',
    a: "Every photo you upload to a bin. Thumbnails are generated automatically and don't count against your limit. Self-hosted storage is limited by your disk space.",
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. No contracts, no cancellation fees. Your data stays accessible for 30 days after cancellation, and you can export everything before you go.',
  },
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
    <!-- ════════ Hero ════════ -->
    <section class="hero-bg px-6 pt-16 pb-10 text-center">
      <!-- Billing toggle -->
      <div
        class="animate-in delay-2 billing-toggle mx-auto mt-8"
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
          <span class="billing-save">Save 20%</span>
        </button>
      </div>
    </section>

    <!-- ════════ Pricing Cards ════════ -->
    <section class="px-6 pb-16">
      <div class="mx-auto max-w-5xl">
        <div class="mx-auto grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
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

            <div
              v-if="plan.preamble"
              class="mt-8 mb-3 text-sm font-medium"
              style="color: var(--vp-c-text-3)"
            >
              {{ plan.preamble }}
            </div>

            <ul :class="['pricing-list flex-1 space-y-3', plan.preamble ? '' : 'mt-8']">
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

        <!-- Trust signals -->
        <p
          class="mt-6 text-center text-sm"
          style="color: var(--vp-c-text-3)"
        >
          7-day free trial &middot; No credit card required &middot; Cancel anytime
        </p>
      </div>
    </section>

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
                <th scope="col">Lite</th>
                <th scope="col" class="comparison-highlight-col">Pro</th>
              </tr>
            </thead>
            <tbody v-for="group in comparison" :key="group.category">
              <tr class="comparison-cat-row">
                <td colspan="3">{{ group.category }}</td>
              </tr>
              <tr v-for="row in group.rows" :key="row.feature">
                <td class="comparison-feature-col">{{ row.feature }}</td>
                <td v-for="key in ['lite', 'pro']" :key="key" :class="{ 'comparison-highlight-col': key === 'pro' }">
                  <!-- Boolean check/dash -->
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
                  <!-- String value -->
                  <span v-else>{{ row[key] }}</span>
                </td>
              </tr>
            </tbody>
          </table>
          <p class="comparison-footnote">
            Prefer to run it yourself? <a href="https://docs.openbin.app/getting-started/" style="color: var(--vp-c-brand-1); text-decoration: underline;">Self-host for free</a> with all features included.
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
          Pricing questions
        </h2>
        <div class="scroll-reveal">
          <div v-for="(faq, i) in faqs" :key="i" class="faq-item">
            <button
              class="flex w-full items-center justify-between py-4 text-left"
              :aria-expanded="openFaq === i"
              :aria-controls="'pricing-faq-' + i"
              @click="toggleFaq(i)"
            >
              <span class="pr-4 text-lg font-semibold">{{ faq.q }}</span>
              <svg
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
            <div :id="'pricing-faq-' + i" role="region" class="faq-answer" :class="{ 'faq-answer--open': openFaq === i }">
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
        Self-host for free or try cloud for 7 days.
      </p>
      <div class="scroll-reveal mt-8 flex flex-wrap justify-center gap-4">
        <a href="/docs/getting-started/" class="btn-primary">
          Get Started <span class="btn-arrow">&rarr;</span>
        </a>
        <a href="https://cloud.openbin.app/" class="btn-secondary">
          Try Cloud <span class="btn-arrow">&rarr;</span>
        </a>
      </div>
    </section>
  </div>
</template>

<style>
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
  padding: 0.4rem 1.25rem;
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
  min-width: 420px;
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
