<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  const targets = document.querySelectorAll(
    '.scroll-reveal, .scroll-slide-left, .scroll-slide-right'
  )
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
    <!-- Hero -->
    <section class="hero-bg px-6 pt-16 pb-12 text-center">
      <h1
        class="display-heading gradient-text animate-in mx-auto max-w-3xl text-4xl lg:text-6xl"
      >
        Organize Your Physical World
      </h1>
      <p
        class="animate-in delay-1 mx-auto mt-6 max-w-2xl text-lg lg:text-xl"
        style="color: var(--vp-c-text-2)"
      >
        Inventory with intelligence. QR codes, photo recognition, and
        multi-user collaboration. Know what you have and where it is.
      </p>
      <div class="animate-in delay-2 mt-8 flex flex-wrap justify-center gap-4">
        <a href="https://docs.openbin.app/getting-started/" class="btn-primary">
          Get Started <span class="btn-arrow">&rarr;</span>
        </a>
        <a href="https://cloud.openbin.app/" class="btn-secondary">
          Try Cloud <span class="btn-arrow">&rarr;</span>
        </a>
        <a href="https://demo.openbin.app/" class="btn-secondary">
          Live Demo <span class="btn-arrow">&rarr;</span>
        </a>
      </div>
      <!-- Live demo (desktop) / static screenshot (mobile) -->
      <div class="animate-in delay-3 mx-auto mt-12 max-w-5xl">
        <div class="relative hidden lg:block">
          <span class="try-me-badge">Try Me — click around, it's a live demo</span>
          <div class="window-chrome">
            <div class="window-chrome-bar">
              <span class="window-chrome-dot window-chrome-dot--close"></span>
              <span class="window-chrome-dot window-chrome-dot--minimize"></span>
              <span class="window-chrome-dot window-chrome-dot--maximize"></span>
              <span class="window-chrome-url">demo.openbin.app</span>
            </div>
            <iframe
              src="https://demo.openbin.app"
              title="OpenBin Demo"
              loading="lazy"
              allow="clipboard-write"
              class="w-full"
              style="height: 600px; border: none; background: var(--vp-c-bg)"
            />
          </div>
        </div>
        <div class="window-chrome lg:hidden">
          <div class="window-chrome-bar">
            <span class="window-chrome-dot window-chrome-dot--close"></span>
            <span class="window-chrome-dot window-chrome-dot--minimize"></span>
            <span class="window-chrome-dot window-chrome-dot--maximize"></span>
            <span class="window-chrome-url">demo.openbin.app</span>
          </div>
          <img
            src="/screenshots/dashboard.png"
            alt="OpenBin Dashboard"
            class="w-full"
          />
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="px-6 py-16" style="background: var(--vp-c-bg-soft)">
      <div class="mx-auto max-w-5xl">
        <h2
          class="display-heading scroll-reveal mb-2 text-center text-3xl lg:text-4xl"
          style="color: var(--vp-c-text-1)"
        >
          How It Works
        </h2>
        <p
          class="scroll-reveal mb-12 text-center text-lg"
          style="color: var(--vp-c-text-2)"
        >
          Three steps from chaos to catalog.
        </p>
        <div class="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <!-- Step 1 -->
          <div class="scroll-reveal text-center">
            <div class="step-number mx-auto mb-4">1</div>
            <svg
              class="mx-auto mb-4"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              style="color: var(--vp-c-brand-1)"
            >
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z" />
              <circle cx="12" cy="13" r="3" />
            </svg>
            <h3
              class="text-xl font-semibold"
              style="color: var(--vp-c-text-1)"
            >
              Snap a photo
            </h3>
            <p class="mx-auto mt-2 max-w-xs" style="color: var(--vp-c-text-2)">
              Take a picture of what's inside. AI names the bin, lists every
              item, and suggests tags. Or type it yourself.
            </p>
          </div>
          <!-- Step 2 -->
          <div class="scroll-reveal text-center">
            <div class="step-number mx-auto mb-4">2</div>
            <svg
              class="mx-auto mb-4"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              style="color: var(--vp-c-brand-1)"
            >
              <path d="M3 7V5a2 2 0 0 1 2-2h2" />
              <path d="M17 3h2a2 2 0 0 1 2 2v2" />
              <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
              <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
              <line x1="7" x2="17" y1="12" y2="12" />
            </svg>
            <h3
              class="text-xl font-semibold"
              style="color: var(--vp-c-text-1)"
            >
              Stick a QR label
            </h3>
            <p class="mx-auto mt-2 max-w-xs" style="color: var(--vp-c-text-2)">
              Print a label and stick it on the box, shelf, or drawer.
              Customize the format, colors, and style.
            </p>
          </div>
          <!-- Step 3 -->
          <div class="scroll-reveal text-center">
            <div class="step-number mx-auto mb-4">3</div>
            <svg
              class="mx-auto mb-4"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              style="color: var(--vp-c-brand-1)"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <h3
              class="text-xl font-semibold"
              style="color: var(--vp-c-text-1)"
            >
              Scan to find anything
            </h3>
            <p class="mx-auto mt-2 max-w-xs" style="color: var(--vp-c-text-2)">
              Scan any label with your phone to see what's inside. Or search
              by name, tag, or area.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Feature Showcase -->
    <section class="px-6 py-16">
      <div class="mx-auto max-w-6xl">
        <h2
          class="display-heading scroll-reveal mb-2 text-center text-3xl lg:text-4xl"
          style="color: var(--vp-c-text-1)"
        >
          What OpenBin Does
        </h2>
        <p
          class="scroll-reveal mb-14 text-center text-lg"
          style="color: var(--vp-c-text-2)"
        >
          More than a spreadsheet. Less than an ERP.
        </p>

        <!-- Row 1: text left, image right -->
        <div class="feature-row mb-16">
          <div class="scroll-slide-left flex flex-col justify-center">
            <h3
              class="text-2xl font-semibold"
              style="color: var(--vp-c-text-1)"
            >
              What's in that box?
            </h3>
            <p class="mt-4 text-lg" style="color: var(--vp-c-text-2)">
              AI photo recognition identifies contents, suggests names and
              tags, builds your item list from a single photo. Bring your own
              API key from OpenAI, Anthropic, or Gemini.
            </p>
          </div>
          <div class="scroll-slide-right">
            <div class="window-chrome">
              <div class="window-chrome-bar">
                <span class="window-chrome-dot window-chrome-dot--close"></span>
                <span class="window-chrome-dot window-chrome-dot--minimize"></span>
                <span class="window-chrome-dot window-chrome-dot--maximize"></span>
                <span class="window-chrome-url">openbin.app</span>
              </div>
              <img
                src="/screenshots/dashboard.png"
                alt="AI photo recognition in OpenBin"
                class="w-full"
              />
            </div>
          </div>
        </div>

        <!-- Row 2: image left, text right -->
        <div class="feature-row mb-16">
          <div class="scroll-slide-left order-2 lg:order-1">
            <div class="window-chrome">
              <div class="window-chrome-bar">
                <span class="window-chrome-dot window-chrome-dot--close"></span>
                <span class="window-chrome-dot window-chrome-dot--minimize"></span>
                <span class="window-chrome-dot window-chrome-dot--maximize"></span>
                <span class="window-chrome-url">openbin.app</span>
              </div>
              <img
                src="/screenshots/dashboard.png"
                alt="Search and filter bins in OpenBin"
                class="w-full"
              />
            </div>
          </div>
          <div
            class="scroll-slide-right flex flex-col justify-center order-1 lg:order-2"
          >
            <h3
              class="text-2xl font-semibold"
              style="color: var(--vp-c-text-1)"
            >
              Find it in seconds
            </h3>
            <p class="mt-4 text-lg" style="color: var(--vp-c-text-2)">
              Search across all your bins by name, tag, item, or area. Filter
              and sort to narrow down exactly what you need.
            </p>
          </div>
        </div>

        <!-- Row 3: text left, image right -->
        <div class="feature-row mb-16">
          <div class="scroll-slide-left flex flex-col justify-center">
            <h3
              class="text-2xl font-semibold"
              style="color: var(--vp-c-text-1)"
            >
              Labels that look good
            </h3>
            <p class="mt-4 text-lg" style="color: var(--vp-c-text-2)">
              Print QR labels in multiple formats, sizes, and styles.
              Customize colors, icons, and layout. Scan any label to jump
              straight to the bin.
            </p>
          </div>
          <div class="scroll-slide-right">
            <div class="window-chrome">
              <div class="window-chrome-bar">
                <span class="window-chrome-dot window-chrome-dot--close"></span>
                <span class="window-chrome-dot window-chrome-dot--minimize"></span>
                <span class="window-chrome-dot window-chrome-dot--maximize"></span>
                <span class="window-chrome-url">openbin.app</span>
              </div>
              <img
                src="/screenshots/dashboard.png"
                alt="QR label printing in OpenBin"
                class="w-full"
              />
            </div>
          </div>
        </div>

        <!-- Row 4: image left, text right -->
        <div class="feature-row">
          <div class="scroll-slide-left order-2 lg:order-1">
            <div class="window-chrome">
              <div class="window-chrome-bar">
                <span class="window-chrome-dot window-chrome-dot--close"></span>
                <span class="window-chrome-dot window-chrome-dot--minimize"></span>
                <span class="window-chrome-dot window-chrome-dot--maximize"></span>
                <span class="window-chrome-url">openbin.app</span>
              </div>
              <img
                src="/screenshots/dashboard.png"
                alt="Multi-user collaboration in OpenBin"
                class="w-full"
              />
            </div>
          </div>
          <div
            class="scroll-slide-right flex flex-col justify-center order-1 lg:order-2"
          >
            <h3
              class="text-2xl font-semibold"
              style="color: var(--vp-c-text-1)"
            >
              Share with your household
            </h3>
            <p class="mt-4 text-lg" style="color: var(--vp-c-text-2)">
              Invite your family or team. Three roles — admin, member, viewer
              — control who can edit and who can browse. Everyone sees the
              same inventory.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Use Cases -->
    <section class="px-6 py-16" style="background: var(--vp-c-bg-soft)">
      <div class="mx-auto max-w-6xl">
        <h2
          class="display-heading scroll-reveal mb-10 text-center text-3xl lg:text-4xl"
          style="color: var(--vp-c-text-1)"
        >
          Built for real life
        </h2>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <!-- Moving -->
          <div
            class="feature-card scroll-reveal rounded-lg p-8"
            style="background: var(--vp-c-bg)"
          >
            <svg
              class="mb-4"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              style="color: var(--vp-c-brand-1)"
            >
              <path d="m7.5 4.27 9 5.15" />
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
              <path d="m3.3 7 8.7 5 8.7-5" />
              <path d="M12 22V12" />
            </svg>
            <h3
              class="text-xl font-semibold"
              style="color: var(--vp-c-text-1)"
            >
              Moving
            </h3>
            <p class="mt-2" style="color: var(--vp-c-text-2)">
              Know what's in every box before you open it.
            </p>
          </div>
          <!-- Workshop -->
          <div
            class="feature-card scroll-reveal rounded-lg p-8"
            style="background: var(--vp-c-bg)"
          >
            <svg
              class="mb-4"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              style="color: var(--vp-c-brand-1)"
            >
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z" />
            </svg>
            <h3
              class="text-xl font-semibold"
              style="color: var(--vp-c-text-1)"
            >
              Workshop
            </h3>
            <p class="mt-2" style="color: var(--vp-c-text-2)">
              Find the right part bin without digging through drawers.
            </p>
          </div>
          <!-- Shared spaces -->
          <div
            class="feature-card scroll-reveal rounded-lg p-8"
            style="background: var(--vp-c-bg)"
          >
            <svg
              class="mb-4"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              style="color: var(--vp-c-brand-1)"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <h3
              class="text-xl font-semibold"
              style="color: var(--vp-c-text-1)"
            >
              Shared spaces
            </h3>
            <p class="mt-2" style="color: var(--vp-c-text-2)">
              One inventory for the whole household or team.
            </p>
          </div>
          <!-- Collections -->
          <div
            class="feature-card scroll-reveal rounded-lg p-8"
            style="background: var(--vp-c-bg)"
          >
            <svg
              class="mb-4"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              style="color: var(--vp-c-brand-1)"
            >
              <rect width="7" height="7" x="3" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="14" rx="1" />
              <rect width="7" height="7" x="3" y="14" rx="1" />
            </svg>
            <h3
              class="text-xl font-semibold"
              style="color: var(--vp-c-text-1)"
            >
              Collections
            </h3>
            <p class="mt-2" style="color: var(--vp-c-text-2)">
              Catalog board games, LEGO sets, craft supplies, tools.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Section divider -->
    <div class="section-divider"></div>

    <!-- Self-Host vs Cloud -->
    <section class="px-6 py-16">
      <div class="mx-auto max-w-5xl">
        <h2
          class="display-heading scroll-reveal mb-10 text-center text-3xl lg:text-4xl"
          style="color: var(--vp-c-text-1)"
        >
          Choose how you run it
        </h2>
        <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div
            class="scroll-slide-left rounded-lg p-8 text-left"
            style="border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft)"
          >
            <h3
              class="text-2xl font-semibold"
              style="color: var(--vp-c-text-1)"
            >
              Self-Host
            </h3>
            <p class="mt-4 text-lg" style="color: var(--vp-c-text-2)">
              Free forever. One Docker container, your hardware. You own the
              data and the backups.
            </p>
            <ul class="mt-6 space-y-2" style="color: var(--vp-c-text-2)">
              <li>Single Docker container</li>
              <li>SQLite — no external database</li>
              <li>Automatic backups</li>
              <li>All features included</li>
            </ul>
            <div class="mt-8">
              <a
                href="https://docs.openbin.app/getting-started/"
                class="btn-primary"
              >
                Get Started <span class="btn-arrow">&rarr;</span>
              </a>
            </div>
          </div>

          <div
            class="scroll-slide-right rounded-lg p-8 text-left"
            style="border: 1px solid var(--vp-c-brand-1); background: var(--vp-c-bg-soft)"
          >
            <h3
              class="text-2xl font-semibold"
              style="color: var(--vp-c-text-1)"
            >
              Cloud
            </h3>
            <p class="mt-4 text-lg" style="color: var(--vp-c-text-2)">
              We run it, you use it. No server, no Docker, no maintenance.
              Just sign up.
            </p>
            <ul class="mt-6 space-y-2" style="color: var(--vp-c-text-2)">
              <li>No setup or maintenance</li>
              <li>Automatic updates</li>
              <li>Managed backups</li>
              <li>Priority support</li>
            </ul>
            <div class="mt-8">
              <a href="https://cloud.openbin.app/" class="btn-secondary">
                Try Cloud <span class="btn-arrow">&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Bottom CTA -->
    <section
      class="px-6 py-16 text-center"
      style="background: var(--vp-c-bg-soft)"
    >
      <h2
        class="display-heading scroll-reveal text-3xl lg:text-4xl"
        style="color: var(--vp-c-text-1)"
      >
        Stop searching. Start finding.
      </h2>
      <p class="mx-auto mt-4 max-w-xl text-lg" style="color: var(--vp-c-text-2)">
        Free to self-host. Cloud if you'd rather not.
      </p>
      <div class="mt-8 flex flex-wrap justify-center gap-4">
        <a href="https://docs.openbin.app/getting-started/" class="btn-primary">
          Get Started <span class="btn-arrow">&rarr;</span>
        </a>
        <a href="https://cloud.openbin.app/" class="btn-secondary">
          Try Cloud <span class="btn-arrow">&rarr;</span>
        </a>
      </div>
    </section>
  </div>
</template>
