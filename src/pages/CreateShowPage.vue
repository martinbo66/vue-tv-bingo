<template>
  <div class="create-show-page">
    <div class="header">
      <h2>Create New TV Show</h2>
      <router-link to="/" class="back-link">← Back to Shows</router-link>
    </div>
    <CreateShow @show-created="onShowCreated" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import CreateShow from '../components/CreateShow.vue'
import type { Show } from '../types/Show'

const router = useRouter()

const onShowCreated = (show: Show) => {
  // Here you would typically save the show to your state management or backend
  // For now, we'll use the existing shows array in ShowsList
  router.push('/')
}
</script>

<style scoped>
.create-show-page {
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.back-link {
  color: #646cff;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}
</style>
