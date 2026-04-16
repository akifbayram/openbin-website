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
</script>

<template>
  <div class="blog-list-page">
    <aside v-if="posts.length" class="blog-list-sidebar">
      <nav aria-label="Recent posts">
        <h2 class="blog-sidebar-heading">Recent posts</h2>
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
        <h1 class="display-heading blog-list-title">Blog</h1>
        <p class="blog-list-subtitle">
          Deep-dives, product updates, and notes from the OpenBin team.
        </p>
      </header>

      <div v-if="posts.length" class="blog-list-content">
        <template v-for="([year, yearPosts]) in grouped" :key="year">
          <h2 class="blog-list-year">{{ year }}</h2>

          <a
            v-for="post in yearPosts"
            :key="post.url"
            :href="withBase(post.url)"
            class="blog-list-entry"
          >
            <article>
              <h3 class="blog-list-entry-title">{{ post.title }}</h3>

              <div class="blog-list-entry-meta">
                <time :datetime="post.date">{{ formatDate(post.date) }}</time>
                <span v-if="post.readingTime" class="blog-list-dot">&middot;</span>
                <span v-if="post.readingTime">{{ post.readingTime }} min read</span>
                <template v-if="post.tags?.length">
                  <span class="blog-list-dot">&middot;</span>
                  <span v-for="tag in post.tags" :key="tag" class="blog-list-inline-tag">{{ tag }}</span>
                </template>
              </div>

              <p v-if="post.description" class="blog-list-entry-desc">
                {{ post.description }}
              </p>
            </article>
          </a>
        </template>
      </div>

      <p v-else class="blog-list-empty">No posts yet.</p>
    </section>
  </div>
</template>
