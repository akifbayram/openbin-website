<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// ── Scroll reveal observer ──
let scrollObserver = null

// ── Hero Photo Analysis Demo ──
const heroDemoEl = ref(null)
const heroPhase = ref(0) // 0=idle, 1=upload, 2=analyzing, 3=streaming, 4=carousel, 5=complete
const heroCurrentBin = ref(0)
const heroStreamedItems = ref(0)
const heroTypedName = ref('')
const heroCounter = ref(0)
const heroTransition = ref('')
let heroTimers = []
let heroStarted = false
let heroAnimId = null

const heroBins = [
  {
    name: 'Workshop Drawer',
    photo: '#4a3f6b',
    items: [
      { n: 'Drill bits', q: '×2' },
      { n: 'Sandpaper', q: '×1' },
      { n: 'Wood glue', q: '×1' },
      { n: 'Paint brushes', q: '×2' },
    ],
    tags: ['tools', 'workshop'],
  },
  {
    name: 'Fasteners Box',
    photo: '#3b5998',
    items: [
      { n: 'Screws, assorted', q: '×2' },
      { n: 'Wall anchors', q: '×1' },
      { n: 'Nails', q: '×2' },
      { n: 'Cable ties', q: '×1' },
    ],
    tags: ['hardware', 'garage'],
  },
  {
    name: 'Paint Supplies',
    photo: '#6b4c3b',
    items: [
      { n: 'Spray paint cans', q: '×2' },
      { n: "Painter's tape", q: '×1' },
      { n: 'Drop cloth', q: '×1' },
      { n: 'Rollers', q: '×2' },
    ],
    tags: ['paint', 'supplies'],
  },
]

const heroTotalItems = computed(() => heroBins.reduce((sum, b) => sum + b.items.length, 0))

function heroTimer(fn, ms) {
  const id = setTimeout(fn, ms)
  heroTimers.push(id)
  return id
}

function clearHeroTimers() {
  heroTimers.forEach(t => { clearTimeout(t); clearInterval(t) })
  heroTimers = []
  if (heroAnimId) { cancelAnimationFrame(heroAnimId); heroAnimId = null }
}

function heroAnimateCount(target, max, duration) {
  const start = performance.now()
  function tick(now) {
    const p = Math.min((now - start) / duration, 1)
    target.value = Math.round((1 - Math.pow(1 - p, 3)) * max)
    if (p < 1) heroAnimId = requestAnimationFrame(tick)
    else heroAnimId = null
  }
  heroAnimId = requestAnimationFrame(tick)
}

function heroStreamBin(binIndex) {
  heroStreamedItems.value = 0
  heroTypedName.value = ''
  heroTransition.value = 'ai-slide-in'
  heroCurrentBin.value = binIndex

  heroTimer(() => { heroTransition.value = '' }, 350)

  // Type bin name
  const name = heroBins[binIndex].name
  let ci = 0
  const typeInterval = setInterval(() => {
    if (ci < name.length) { heroTypedName.value = name.slice(0, ci + 1); ci++ }
    else clearInterval(typeInterval)
  }, 35)
  heroTimers.push(typeInterval)

  // Stream items after name typed
  const nameTime = name.length * 35 + 200
  const items = heroBins[binIndex].items
  for (let i = 1; i <= items.length; i++) {
    heroTimer(() => { heroStreamedItems.value = i }, nameTime + i * 200)
  }

  const streamDone = nameTime + items.length * 200 + 600

  if (binIndex < heroBins.length - 1) {
    heroTimer(() => { heroTransition.value = 'ai-slide-out' }, streamDone)
    heroTimer(() => { heroStreamBin(binIndex + 1) }, streamDone + 400)
  } else {
    heroTimer(() => {
      heroPhase.value = 5
      heroAnimateCount(heroCounter, heroBins.length, 800)
      // Restart cycle
      heroTimer(() => {
        heroPhase.value = 0
        heroTimer(runHeroDemo, 600)
      }, 3000)
    }, streamDone + 200)
  }
}

function runHeroDemo() {
  clearHeroTimers()
  heroPhase.value = 1
  heroCurrentBin.value = 0
  heroStreamedItems.value = 0
  heroTypedName.value = ''
  heroCounter.value = 0

  // Upload phase
  heroTimer(() => { heroPhase.value = 2 }, 1000)
  // Start streaming
  heroTimer(() => {
    heroPhase.value = 3
    heroStreamBin(0)
  }, 2000)
}

// ── Lifecycle ──
onMounted(() => {
  const revealTargets = document.querySelectorAll(
    '.scroll-reveal, .scroll-slide-left, .scroll-slide-right, .scroll-scale-in'
  )
  if (revealTargets.length) {
    scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-visible')
            scrollObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )
    revealTargets.forEach((el) => scrollObserver.observe(el))
  }

  // Hero demo intersection observer
  if (heroDemoEl.value) {
    const heroObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !heroStarted) {
          heroStarted = true
          runHeroDemo()
          heroObs.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    heroObs.observe(heroDemoEl.value)
  }
})

onUnmounted(() => {
  if (scrollObserver) scrollObserver.disconnect()
  clearHeroTimers()
})
</script>

<template>
  <div class="home-layout">
    <!-- ════════ Hero ════════ -->
    <section class="hero-bg px-6 pt-16 pb-12 text-center">
      <p class="animate-in text-sm font-semibold uppercase tracking-widest" style="color: var(--vp-c-brand-3)">
        AI Features
      </p>
      <h1 class="display-heading gradient-text animate-in delay-1 mx-auto mt-3 max-w-3xl text-4xl lg:text-6xl">
        Your inventory learns.
      </h1>
      <p class="animate-in delay-2 mx-auto mt-6 max-w-2xl text-lg lg:text-xl">
        Point your camera at a bin. AI identifies every item, suggests names and tags, and keeps everything organized as your space grows.
      </p>
      <div class="animate-in delay-3 mt-8 flex flex-wrap justify-center gap-4">
        <a href="/cloud" class="btn-primary">
          Start Free <span class="btn-arrow">&rarr;</span>
        </a>
        <a href="https://demo.openbin.app" target="_blank" rel="noopener" class="btn-secondary">
          Try Demo <span class="btn-arrow">&rarr;</span>
        </a>
      </div>
      <p class="animate-in delay-4 mt-4 text-center text-sm">
        7-day free trial &middot; No credit card required
      </p>

      <!-- Hero demo: Photo Analysis Showcase -->
      <div ref="heroDemoEl" class="animate-in delay-5 mx-auto mt-12 max-w-2xl">
        <div class="ai-demo-card">
          <div class="ai-demo-header">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--vp-c-brand-3)">
              <path d="m12 3-1.9 5.8a2 2 0 0 1-1.287 1.288L3 12l5.8 1.9a2 2 0 0 1 1.288 1.287L12 21l1.9-5.8a2 2 0 0 1 1.287-1.288L21 12l-5.8-1.9a2 2 0 0 1-1.288-1.287Z"/>
            </svg>
            <span>Photo Analysis</span>
          </div>

          <!-- Upload row -->
          <div class="ai-demo-upload" :class="{ 'ai-demo-visible': heroPhase >= 1 }">
            <div class="ai-demo-thumbs">
              <div v-for="(bin, i) in heroBins" :key="i" class="ai-demo-thumb" :class="{ 'ai-demo-thumb-active': heroPhase >= 2 && heroCurrentBin === i, 'ai-demo-thumb-done': heroPhase >= 3 && heroCurrentBin > i || heroPhase >= 5 }">
                <div class="ai-demo-thumb-img" :style="{ background: bin.photo }"></div>
                <div v-if="heroPhase >= 3 && (heroCurrentBin > i || heroPhase >= 5)" class="ai-demo-thumb-check">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
              </div>
            </div>
            <div class="ai-demo-mode">
              <span class="ai-demo-mode-pill ai-demo-mode-active">One bin per photo</span>
              <span class="ai-demo-mode-pill">All in one bin</span>
            </div>
          </div>

          <!-- Analysis stream -->
          <div v-if="heroPhase >= 2" class="ai-demo-analysis">
            <div v-if="heroPhase === 2" class="ai-demo-scanning">
              <svg class="ai-demo-spinner" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--vp-c-brand-3)" stroke-width="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              <span>Analyzing photos...</span>
            </div>

            <div v-if="heroPhase >= 3 && heroPhase < 5" class="ai-demo-stream" :class="heroTransition">
              <div class="ai-demo-stream-row">
                <div class="ai-demo-stream-photo">
                  <div class="ai-demo-thumb-img ai-demo-thumb-lg" :style="{ background: heroBins[heroCurrentBin].photo }"></div>
                  <div class="ai-shimmer" :class="{ 'ai-shimmer-on': heroPhase >= 3 }"></div>
                </div>
                <div class="ai-demo-stream-result">
                  <div class="ai-demo-bin-name">{{ heroTypedName }}<span v-if="heroStreamedItems < heroBins[heroCurrentBin].items.length" class="ai-demo-cursor">|</span></div>
                  <div class="ai-demo-items">
                    <div
                      v-for="(item, i) in heroBins[heroCurrentBin].items"
                      :key="heroCurrentBin + '-' + item.n"
                      class="ai-demo-item"
                      :class="{ 'ai-demo-item-show': heroStreamedItems > i }"
                    >
                      <span>{{ item.n }}</span>
                      <span class="ai-demo-qty">{{ item.q }}</span>
                    </div>
                  </div>
                  <div v-if="heroStreamedItems >= heroBins[heroCurrentBin].items.length" class="ai-demo-tags">
                    <span v-for="tag in heroBins[heroCurrentBin].tags" :key="tag" class="ai-demo-tag">{{ tag }}</span>
                  </div>
                </div>
              </div>
              <div class="ai-demo-progress">
                Photo {{ heroCurrentBin + 1 }} of {{ heroBins.length }}
              </div>
            </div>

            <!-- Completion -->
            <div v-if="heroPhase >= 5" class="ai-demo-complete">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              <span>{{ heroCounter }} bins created &middot; {{ heroTotalItems }} items cataloged</span>
            </div>
          </div>

          <!-- Bin dots -->
          <div v-if="heroPhase >= 3" class="ai-demo-dots">
            <span
              v-for="(_, i) in heroBins"
              :key="i"
              class="ai-demo-dot"
              :class="{ 'ai-demo-dot-active': heroCurrentBin === i && heroPhase < 5, 'ai-demo-dot-done': heroCurrentBin > i || heroPhase >= 5 }"
            ></span>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════ Without / With AI ════════ -->
    <section class="px-6 py-16">
      <div class="mx-auto max-w-5xl text-center">
        <h2 class="display-heading scroll-reveal mb-2 text-3xl lg:text-4xl">
          The old way vs. the OpenBin way
        </h2>
        <p class="scroll-reveal mb-10 text-lg">
          Every box is a guessing game — until it isn't.
        </p>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <!-- Without -->
          <div class="scroll-reveal stagger-1 rounded-lg p-8 text-left" style="border: 1px solid rgba(239, 68, 68, 0.15); background: rgba(239, 68, 68, 0.04)">
            <div class="mb-4 text-xs font-semibold uppercase tracking-widest" style="color: #fca5a5">Without AI</div>
            <ul class="pricing-list space-y-3">
              <li class="flex items-start gap-3 text-sm">
                <span class="mt-0.5 shrink-0 font-bold" style="color: #ef4444" aria-hidden="true">&#x2717;</span>
                <span>Type every item name by hand</span>
              </li>
              <li class="flex items-start gap-3 text-sm">
                <span class="mt-0.5 shrink-0 font-bold" style="color: #ef4444" aria-hidden="true">&#x2717;</span>
                <span>Guess at quantities and categories</span>
              </li>
              <li class="flex items-start gap-3 text-sm">
                <span class="mt-0.5 shrink-0 font-bold" style="color: #ef4444" aria-hidden="true">&#x2717;</span>
                <span>Reorganize bins one at a time</span>
              </li>
              <li class="flex items-start gap-3 text-sm">
                <span class="mt-0.5 shrink-0 font-bold" style="color: #ef4444" aria-hidden="true">&#x2717;</span>
                <span>Search by exact name only</span>
              </li>
              <li class="flex items-start gap-3 text-sm">
                <span class="mt-0.5 shrink-0 font-bold" style="color: #ef4444" aria-hidden="true">&#x2717;</span>
                <span>Naming conventions drift over time</span>
              </li>
            </ul>
          </div>
          <!-- With -->
          <div class="scroll-reveal stagger-2 rounded-lg p-8 text-left" style="border: 1px solid rgba(94, 47, 224, 0.25); background: rgba(94, 47, 224, 0.06)">
            <div class="mb-4 text-xs font-semibold uppercase tracking-widest" style="color: var(--vp-c-brand-3)">With OpenBin AI</div>
            <ul class="pricing-list space-y-3">
              <li class="flex items-start gap-3 text-sm">
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mt-0.5 shrink-0" style="color: var(--vp-c-brand-3)"><polyline points="20 6 9 17 4 12" /></svg>
                <span>Snap a photo, AI names everything</span>
              </li>
              <li class="flex items-start gap-3 text-sm">
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mt-0.5 shrink-0" style="color: var(--vp-c-brand-3)"><polyline points="20 6 9 17 4 12" /></svg>
                <span>Quantities and tags auto-detected</span>
              </li>
              <li class="flex items-start gap-3 text-sm">
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mt-0.5 shrink-0" style="color: var(--vp-c-brand-3)"><polyline points="20 6 9 17 4 12" /></svg>
                <span>Reorganize an entire location at once</span>
              </li>
              <li class="flex items-start gap-3 text-sm">
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mt-0.5 shrink-0" style="color: var(--vp-c-brand-3)"><polyline points="20 6 9 17 4 12" /></svg>
                <span>"Where did I put the holiday lights?"</span>
              </li>
              <li class="flex items-start gap-3 text-sm">
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mt-0.5 shrink-0" style="color: var(--vp-c-brand-3)"><polyline points="20 6 9 17 4 12" /></svg>
                <span>Consistent naming across your whole inventory</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════ How AI Works ════════ -->
    <section class="px-6 py-16" style="background: var(--vp-c-bg-soft)">
      <div class="mx-auto max-w-5xl">
        <h2 class="display-heading scroll-reveal mb-2 text-center text-3xl lg:text-4xl">
          Three steps. Zero typing.
        </h2>
        <p class="scroll-reveal mb-12 text-center text-lg">
          From messy drawer to searchable inventory.
        </p>
        <div class="steps-wire grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div class="scroll-reveal stagger-1 text-center relative z-10">
            <div class="ai-step-circle mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                <circle cx="12" cy="13" r="3"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold">Snap</h3>
            <p class="mx-auto mt-2 max-w-xs">
              Upload a photo of any bin, box, or drawer.
            </p>
          </div>
          <div class="scroll-reveal stagger-2 text-center relative z-10">
            <div class="ai-step-circle mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m12 3-1.9 5.8a2 2 0 0 1-1.287 1.288L3 12l5.8 1.9a2 2 0 0 1 1.288 1.287L12 21l1.9-5.8a2 2 0 0 1 1.287-1.288L21 12l-5.8-1.9a2 2 0 0 1-1.288-1.287Z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold">Analyze</h3>
            <p class="mx-auto mt-2 max-w-xs">
              AI identifies items, quantities, and suggests tags.
            </p>
          </div>
          <div class="scroll-reveal stagger-3 text-center relative z-10">
            <div class="ai-step-circle mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold">Organize</h3>
            <p class="mx-auto mt-2 max-w-xs">
              Accept, edit, or dismiss. One tap to save.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
