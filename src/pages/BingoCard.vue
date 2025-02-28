<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { showService } from '../services/showService'
import type { Show } from '../types/Show'

const route = useRoute()
const show = ref<Show | null>(null)
const bingoGrid = ref<string[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const generateBingoGrid = (phrases: string[]) => {
  // Create a copy of phrases array to shuffle
  const shuffledPhrases = [...phrases]
  
  // Fisher-Yates shuffle algorithm
  for (let i = shuffledPhrases.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffledPhrases[i], shuffledPhrases[j]] = [shuffledPhrases[j], shuffledPhrases[i]]
  }

  // Take first 25 phrases (5x5 grid)
  return shuffledPhrases.slice(0, 25)
}

const loadShow = async () => {
  const showId = parseInt(route.params.id as string)
  if (isNaN(showId)) {
    error.value = 'Invalid show ID'
    loading.value = false
    return
  }

  try {
    const fetchedShow = await showService.getShowById(showId)
    if (!fetchedShow) {
      error.value = 'Show not found'
      return
    }
    show.value = fetchedShow
    bingoGrid.value = generateBingoGrid(fetchedShow.phrases || [])
  } catch (e) {
    error.value = 'Failed to load show'
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadShow()
})
</script>

<template>
  <div class="bingo-card-page">
    <div v-if="loading" class="loading">
      Loading bingo card...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else-if="show" class="bingo-card-container">
      <div class="header">
        <h2>{{ show.showTitle }}</h2>
        <router-link to="/" class="back-link">← Back to Shows</router-link>
      </div>

      <div class="bingo-grid">
        <div 
          v-for="(phrase, index) in bingoGrid" 
          :key="index"
          class="bingo-cell"
        >
          {{ phrase }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bingo-card-page {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.back-link {
  text-decoration: none;
  color: #666;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.back-link:hover {
  text-decoration: underline;
}

.bingo-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 8px;
}

.bingo-cell {
  aspect-ratio: 1;
  background-color: white;
  border: 2px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 1.1em;
  line-height: 1.3;
  color: #000;
  cursor: pointer;
  transition: all 0.2s;
}

.bingo-cell:hover {
  transform: scale(1.02);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  color: #dc2626;
}
</style>
