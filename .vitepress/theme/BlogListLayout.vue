<script setup>
import { computed } from 'vue'
import { useBlogPosts, formatDate, isGitHubUsername, getGitHubAvatarUrl } from 'vitepress-plugin-blog'
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

const hasAvatar = (author) => isGitHubUsername(author)
const avatarUrl = (author) => getGitHubAvatarUrl(author)
</script>

<template>
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

        <article v-for="post in yearPosts" :key="post.url" class="blog-list-entry">
          <a :href="withBase(post.url)" class="blog-list-entry-link">
            <h3 class="blog-list-entry-title">{{ post.title }}</h3>
          </a>

          <div class="blog-list-entry-meta">
            <time :datetime="post.date">{{ formatDate(post.date) }}</time>
            <span v-if="post.readingTime" class="blog-list-dot">&middot;</span>
            <span v-if="post.readingTime">{{ post.readingTime }} min read</span>
          </div>

          <div v-if="post.author" class="blog-list-entry-author">
            <img
              v-if="hasAvatar(post.author)"
              :src="avatarUrl(post.author)"
              :alt="post.author"
              class="blog-list-avatar"
              loading="lazy"
            />
            <span>{{ post.author }}</span>
          </div>

          <p v-if="post.description" class="blog-list-entry-desc">
            {{ post.description }}
          </p>

          <div class="blog-list-entry-footer">
            <ul v-if="post.tags?.length" class="blog-list-tags" aria-label="Tags">
              <li v-for="tag in post.tags" :key="tag">{{ tag }}</li>
            </ul>
            <a :href="withBase(post.url)" class="blog-list-read-more">
              Read more <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </article>
      </template>
    </div>

    <p v-else class="blog-list-empty">No posts yet.</p>
  </section>
</template>
