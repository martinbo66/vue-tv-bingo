<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showService } from '../services/showService'
import type { Show } from '../types/Show'
import type { Ref } from 'vue'

const route = useRoute()
const router = useRouter()
const show = ref<Show | null>(null)
const bingoGrid = ref<string[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const selectedCells = ref<Set<number>>(new Set())
const winningLines: Ref<number[][]> = ref([])

const generateBingoGrid = (phrases: string[], centerSquare?: string) => {
  // Create a copy of phrases array to shuffle
  const shuffledPhrases = [...phrases]
  
  // Fisher-Yates shuffle algorithm
  for (let i = shuffledPhrases.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffledPhrases[i], shuffledPhrases[j]] = [shuffledPhrases[j], shuffledPhrases[i]]
  }

  // Take first 24 phrases (for a 5x5 grid minus the center)
  const result = shuffledPhrases.slice(0, 24)
  
  // Insert the center square at the middle position (index 12)
  // The center is the 13th element (index 12) in a 5x5 grid (row 3, column 3)
  result.splice(12, 0, centerSquare || 'FREE SPACE')
  
  return result
}

const checkWinningCombinations = () => {
  const possibleWins: Array<Array<number>> = [
    // Rows
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
    // Columns
    [0, 5, 10, 15, 20],
    [1, 6, 11, 16, 21],
    [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23],
    [4, 9, 14, 19, 24],
    // Diagonals
    [0, 6, 12, 18, 24],
    [4, 8, 12, 16, 20]
  ]

  winningLines.value = possibleWins.filter((line: Array<number>) => 
    line.every(cell => selectedCells.value.has(cell))
  )
}

const toggleCell = (index: number) => {
  if (selectedCells.value.has(index)) {
    selectedCells.value.delete(index)
  } else {
    selectedCells.value.add(index)
  }
  checkWinningCombinations()
}

const navigateToShowDetail = () => {
  if (show.value) {
    router.push(`/show/${show.value.id}/edit`)
  }
}

const regenerateBingoCard = () => {
  if (show.value) {
    bingoGrid.value = generateBingoGrid(show.value.phrases, show.value.centerSquare)
    selectedCells.value.clear()
    winningLines.value = []
  }
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
    
    // Check if there are at least 24 phrases
    if (!fetchedShow.phrases || fetchedShow.phrases.length < 24) {
      error.value = 'This show needs at least 24 phrases to create a bingo card'
      show.value = fetchedShow // Still set the show so we can navigate to edit
      return
    }
    
    show.value = fetchedShow
    bingoGrid.value = generateBingoGrid(fetchedShow.phrases, fetchedShow.centerSquare)
  } catch (e) {
    error.value = 'Failed to load show'
    console.error(e)
  } finally {
    loading.value = false
  }
}

const isWinningCell = computed(() => (index: number) => 
  winningLines.value.some(line => line.includes(index))
)

const hasBingo = computed(() => winningLines.value.length > 0)

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
      <p>{{ error }}</p>
      <div v-if="show && error.includes('24 phrases')" class="error-actions">
        <button @click="navigateToShowDetail" class="edit-button">Edit Show</button>
      </div>
    </div>

    <div v-else-if="show" class="bingo-card-container">
      <div class="header">
        <h2 @click="navigateToShowDetail" class="show-title">{{ show.showTitle }}</h2>
        <button @click="regenerateBingoCard" class="regenerate-button">
          Regenerate Bingo Card
        </button>
        <router-link to="/" class="back-link">← Back to Shows</router-link>
      </div>

      <div class="bingo-grid">
        <div 
          v-for="(phrase, index) in bingoGrid" 
          :key="index"
          class="bingo-cell"
          :class="{ 
            'selected': selectedCells.has(index),
            'center-square': index === 12,
            'winning': isWinningCell(index)
          }"
          @click="toggleCell(index)"
        >
          {{ phrase }}
        </div>
      </div>

      <div v-if="hasBingo" class="bingo-alert">
        <div class="bingo-text">BINGO!</div>
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

.header-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.show-title {
  cursor: pointer;
  transition: color 0.2s;
}

.show-title:hover {
  color: #4a6cf7;
  text-decoration: underline;
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
  transform: scale(1.06);
  box-shadow: 0 2px 4px rgba(177, 17, 17, 0.1);
}

.bingo-cell.selected {
  background-color: #333;
  color: white;
  border-color: #222;
}

.center-square {
  font-weight: bold;
  background-color: #f0f0f0;
}

.center-square.selected {
  background-color: #333;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  color: #dc2626;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.error-actions {
  margin-top: 1rem;
}

.edit-button {
  background-color: #4a6cf7;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.edit-button:hover {
  background-color: #3a5ce5;
}

.regenerate-container {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.regenerate-button {
  background-color: #4a6cf7;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.bingo-card-container {
  max-width: 100%;
  padding: 1rem;
  margin: 0 auto;
}

.bingo-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  max-width: min(100%, 800px);
  margin: 0 auto;
  aspect-ratio: 1;
}

.bingo-cell {
  aspect-ratio: 1;
  border: 2px solid #333;
  border-radius: 4px;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  font-size: clamp(0.75rem, 2vw, 1rem);
  word-break: break-word;
  background-color: var(--cell-bg-color);
  transition: background-color 0.2s;
}

.header {
  padding: 1rem;
  margin-bottom: 1rem;
}

.show-title {
  font-size: clamp(1.5rem, 4vw, 2rem);
  margin: 0;
}

.regenerate-container {
  padding: 0 1rem;
}

.bingo-cell.winning {
  background-color: #4CAF50;
  color: white;
  border-color: #45a049;
  animation: pulse 1s infinite;
}

.bingo-alert {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.8);
  padding: 2rem 4rem;
  border-radius: 1rem;
  z-index: 100;
  animation: fadeIn 0.5s ease-out;
}

.bingo-text {
  font-size: 4rem;
  font-weight: bold;
  color: #FFD700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  animation: bounce 1s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@media (max-width: 600px) {
  .header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .back-link {
    font-size: 0.9rem;
  }

  .regenerate-button {
    font-size: 0.9rem;
    padding: 0.4rem 0.8rem;
  }
}
</style>
