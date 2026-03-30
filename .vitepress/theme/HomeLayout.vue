<template>
  <div class="home-layout">
    <!-- Hero -->
    <section class="px-6 pt-24 pb-16 text-center">
      <h1
        class="mx-auto max-w-3xl text-4xl font-bold tracking-tight lg:text-6xl"
        style="color: var(--vp-c-text-1)"
      >
        Organize Your Physical World
      </h1>
      <p
        class="mx-auto mt-6 max-w-2xl text-lg lg:text-xl"
        style="color: var(--vp-c-text-2)"
      >
        Self-hosted inventory system with QR codes, AI categorization, and
        multi-user collaboration. Know exactly what you have and where it is.
      </p>
      <div class="mt-10 flex flex-wrap justify-center gap-4">
        <a href="https://docs.openbin.app/getting-started/" class="btn-primary">
          Get Started
        </a>
        <a href="https://cloud.openbin.app/" class="btn-secondary">
          Try Cloud
        </a>
      </div>
      <div class="mx-auto mt-16 max-w-4xl">
        <img
          src="/screenshots/dashboard.png"
          alt="OpenBin Dashboard"
          class="w-full rounded-lg"
          style="border: 1px solid var(--vp-c-divider)"
        />
      </div>
    </section>

    <!-- Features -->
    <section class="px-6 py-24" style="background: var(--vp-c-bg-soft)">
      <div class="mx-auto max-w-6xl">
        <h2
          class="mb-16 text-center text-3xl font-bold lg:text-4xl"
          style="color: var(--vp-c-text-1)"
        >
          Everything you need to stay organized
        </h2>
        <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div
            class="overflow-hidden rounded-lg"
            style="border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg)"
          >
            <img
              src="/screenshots/print-labels.png"
              alt="QR Labels"
              class="w-full"
              style="border-bottom: 1px solid var(--vp-c-divider)"
            />
            <div class="p-6">
              <h3
                class="text-xl font-semibold"
                style="color: var(--vp-c-text-1)"
              >
                QR Labels
              </h3>
              <p class="mt-2" style="color: var(--vp-c-text-2)">
                Print and scan QR labels to find anything instantly. Customize
                label formats, colors, and styles.
              </p>
            </div>
          </div>

          <div
            class="overflow-hidden rounded-lg"
            style="border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg)"
          >
            <img
              src="/screenshots/bin-detail.png"
              alt="AI-Powered"
              class="w-full"
              style="border-bottom: 1px solid var(--vp-c-divider)"
            />
            <div class="p-6">
              <h3
                class="text-xl font-semibold"
                style="color: var(--vp-c-text-1)"
              >
                AI-Powered
              </h3>
              <p class="mt-2" style="color: var(--vp-c-text-2)">
                Auto-categorize items with photos, voice, or text. Works with
                OpenAI, Anthropic, and Gemini.
              </p>
            </div>
          </div>

          <div
            class="overflow-hidden rounded-lg"
            style="border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg)"
          >
            <img
              src="/screenshots/qr-scanner.png"
              alt="Multi-User"
              class="w-full"
              style="border-bottom: 1px solid var(--vp-c-divider)"
            />
            <div class="p-6">
              <h3
                class="text-xl font-semibold"
                style="color: var(--vp-c-text-1)"
              >
                Multi-User
              </h3>
              <p class="mt-2" style="color: var(--vp-c-text-2)">
                Share locations with your household or team. Role-based access
                with admin, member, and viewer permissions.
              </p>
            </div>
          </div>

          <div
            class="overflow-hidden rounded-lg"
            style="border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg)"
          >
            <div class="flex h-full flex-col justify-center p-8 text-center">
              <div
                class="mx-auto mb-4 text-5xl"
                style="color: var(--vp-c-brand-1)"
              >
                &lt;/&gt;
              </div>
              <h3
                class="text-xl font-semibold"
                style="color: var(--vp-c-text-1)"
              >
                Self-Hosted &amp; Open Source
              </h3>
              <p class="mt-2" style="color: var(--vp-c-text-2)">
                Your data stays on your hardware. AGPL-3.0 licensed, fully
                transparent, with a complete REST API and MCP server.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Self-Host vs Cloud -->
    <section class="px-6 py-24">
      <div class="mx-auto max-w-5xl">
        <h2
          class="mb-16 text-center text-3xl font-bold lg:text-4xl"
          style="color: var(--vp-c-text-1)"
        >
          Choose how you run it
        </h2>
        <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div
            class="rounded-lg p-8"
            style="border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft)"
          >
            <h3
              class="text-2xl font-semibold"
              style="color: var(--vp-c-text-1)"
            >
              Self-Host
            </h3>
            <p class="mt-4 text-lg" style="color: var(--vp-c-text-2)">
              Free forever. Run on your own hardware with Docker. Full control
              over your data, backups, and configuration.
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
                Get Started
              </a>
            </div>
          </div>

          <div
            class="rounded-lg p-8"
            style="border: 1px solid var(--vp-c-brand-1); background: var(--vp-c-bg-soft)"
          >
            <h3
              class="text-2xl font-semibold"
              style="color: var(--vp-c-text-1)"
            >
              Cloud
            </h3>
            <p class="mt-4 text-lg" style="color: var(--vp-c-text-2)">
              Managed hosting with automatic updates. No server setup required.
              Sign up and start organizing in seconds.
            </p>
            <ul class="mt-6 space-y-2" style="color: var(--vp-c-text-2)">
              <li>No setup or maintenance</li>
              <li>Automatic updates</li>
              <li>Managed backups</li>
              <li>Priority support</li>
            </ul>
            <div class="mt-8">
              <a href="https://cloud.openbin.app/" class="btn-secondary">
                Try Cloud
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Bottom CTA -->
    <section
      class="px-6 py-24 text-center"
      style="background: var(--vp-c-bg-soft)"
    >
      <h2
        class="text-3xl font-bold lg:text-4xl"
        style="color: var(--vp-c-text-1)"
      >
        Ready to get organized?
      </h2>
      <p class="mx-auto mt-4 max-w-xl text-lg" style="color: var(--vp-c-text-2)">
        Free to self-host. Cloud plans available for those who prefer managed
        hosting.
      </p>
      <div class="mt-10 flex flex-wrap justify-center gap-4">
        <a href="https://docs.openbin.app/getting-started/" class="btn-primary">
          Get Started
        </a>
        <a href="https://cloud.openbin.app/" class="btn-secondary">
          Try Cloud
        </a>
      </div>
    </section>
  </div>
</template>
