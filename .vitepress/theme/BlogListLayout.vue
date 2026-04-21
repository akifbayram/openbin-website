<script setup>
import { computed } from 'vue'
import { useBlogPosts, formatDate } from 'vitepress-plugin-blog'
import { withBase } from 'vitepress'

const { posts } = useBlogPosts()

const grouped = computed(() => {
  const groups = {}
  for (const post of posts.value) {
    const year = post.date ? new Date(post.date).getFullYear() : 'Undated'
    if (!groups[year]) groups[year] = []
    groups[year].push(post)
  }
  return Object.entries(groups).sort(([a], [b]) => Number(b) - Number(a))
})

const featured = computed(() => posts.value[0] ?? null)
const rest = computed(() => {
  if (!featured.value) return []
  return posts.value.slice(1)
})
const restGrouped = computed(() => {
  const groups = {}
  for (const post of rest.value) {
    const year = post.date ? new Date(post.date).getFullYear() : 'Undated'
    if (!groups[year]) groups[year] = []
    groups[year].push(post)
  }
  return Object.entries(groups).sort(([a], [b]) => Number(b) - Number(a))
})
</script>

<template>
  <div class="blog-list-page">
    <aside v-if="posts.length" class="blog-list-sidebar">
      <nav aria-label="All posts">
        <h2 class="blog-sidebar-heading">All posts</h2>
        <template v-for="([year, yearPosts]) in grouped" :key="'sb-' + year">
          <h3 class="blog-sidebar-year">{{ year }}</h3>
          <ul class="blog-sidebar-list">
            <li v-for="post in yearPosts" :key="post.url">
              <a :href="withBase(post.url)">{{ post.title }}</a>
            </li>
          </ul>
        </template>
      </nav>
    </aside>

    <section class="blog-list-wrap">
      <header class="blog-list-header animate-in">
        <p class="blog-list-eyebrow">OpenBin Blog</p>
        <h1 class="display-heading blog-list-title">Organize, track, find.</h1>
        <p class="blog-list-subtitle">
          Deep-dives, product updates, and notes from the OpenBin team.
        </p>
      </header>

      <template v-if="featured">
        <a
          :href="withBase(featured.url)"
          class="blog-list-featured"
          aria-label="Featured post"
        >
          <div v-if="featured.cover" class="blog-list-featured-cover">
            <img
              :src="withBase(featured.cover)"
              :alt="featured.title"
              loading="eager"
              onerror="this.style.display='none'"
            />
          </div>
          <div class="blog-list-featured-body">
            <span class="blog-list-featured-badge">Latest</span>
            <h2 class="blog-list-featured-title">{{ featured.title }}</h2>
            <div class="blog-list-entry-meta">
              <time :datetime="featured.date">{{ formatDate(featured.date) }}</time>
              <span v-if="featured.readingTime" class="blog-list-dot">&middot;</span>
              <span v-if="featured.readingTime">{{ featured.readingTime }} min read</span>
            </div>
            <p v-if="featured.description" class="blog-list-featured-desc">
              {{ featured.description }}
            </p>
            <template v-if="featured.tags?.length">
              <ul class="blog-list-tag-row">
                <li v-for="tag in featured.tags" :key="tag">{{ tag }}</li>
              </ul>
            </template>
          </div>
        </a>
      </template>

      <div v-if="rest.length" class="blog-list-content">
        <template v-for="([year, yearPosts]) in restGrouped" :key="year">
          <h2 class="blog-list-year">
            <span>{{ year }}</span>
          </h2>

          <a
            v-for="post in yearPosts"
            :key="post.url"
            :href="withBase(post.url)"
            class="blog-list-entry"
          >
            <article>
              <div v-if="post.cover" class="blog-list-entry-cover">
                <img
                  :src="withBase(post.cover)"
                  :alt="post.title"
                  loading="lazy"
                  onerror="this.style.display='none'"
                />
              </div>

              <div class="blog-list-entry-body">
                <h3 class="blog-list-entry-title">{{ post.title }}</h3>

                <div class="blog-list-entry-meta">
                  <time :datetime="post.date">{{ formatDate(post.date) }}</time>
                  <span v-if="post.readingTime" class="blog-list-dot">&middot;</span>
                  <span v-if="post.readingTime">{{ post.readingTime }} min read</span>
                </div>

                <p v-if="post.description" class="blog-list-entry-desc">
                  {{ post.description }}
                </p>

                <ul v-if="post.tags?.length" class="blog-list-tag-row">
                  <li v-for="tag in post.tags" :key="tag">{{ tag }}</li>
                </ul>
              </div>
            </article>
          </a>
        </template>
      </div>

      <p v-if="!posts.length" class="blog-list-empty">No posts yet.</p>
    </section>
  </div>
</template>
