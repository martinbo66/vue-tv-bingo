<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showService } from '../services/showService'
import type { Show } from '../types/Show'

const router = useRouter()
const shows = ref<Show[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const fetchShows = async () => {
  loading.value = true
  error.value = null
  try {
    shows.value = await showService.getShows()
  } catch (e) {
    error.value = 'Failed to load shows'
    console.error(e)
  } finally {
    loading.value = false
  }
}

const navigateToShow = (showId: number) => {
  router.push(`/show/${showId}`)
}

const handleEdit = (event: Event, showId: number) => {
  event.stopPropagation()
  router.push(`/show/${showId}/edit`)
}

const handleDelete = async (event: Event, showId: number) => {
  event.stopPropagation()
  if (confirm('Are you sure you want to delete this show?')) {
    try {
      await showService.deleteShow(showId)
      await fetchShows()
    } catch (e) {
      error.value = 'Failed to delete show'
      console.error(e)
    }
  }
}

onMounted(() => {
  fetchShows()
})
</script>

<template>
    <div class="shows-container">
        <div class="header">
            <h2>TV Shows</h2>
            <router-link to="/create" class="add-show-link">+ Add Show</router-link>
        </div>
        
        <div v-if="loading" class="loading">
            Loading shows...
        </div>
        
        <div v-else-if="error" class="error">
            {{ error }}
            <button @click="fetchShows" class="retry-button">Retry</button>
        </div>
        
        <div v-else class="shows-list">
            <div 
              v-for="show in shows" 
              :key="show.id" 
              class="show-card"
              @click="navigateToShow(show.id)"
            >
                <div class="show-content">
                    <h3>{{ show.showTitle }}</h3>
                    <div v-if="show.gameTitle" class="game-title">
                        {{ show.gameTitle }}
                    </div>
                </div>
                <div class="show-controls">
                    <button 
                        class="control-btn edit-btn" 
                        @click="(e) => handleEdit(e, show.id)"
                        title="Edit show"
                    >
                        ✏️
                    </button>
                    <button 
                        class="control-btn delete-btn" 
                        @click="(e) => handleDelete(e, show.id)"
                        title="Delete show"
                    >
                        🗑️
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.shows-container {
    padding: 20px;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.add-show-link {
    text-decoration: none;
    color: #4CAF50;
    font-weight: bold;
    padding: 8px 16px;
    border-radius: 4px;
    background-color: #e8f5e9;
}

.shows-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;
}

.show-card {
    background-color: rgb(191, 122, 216);
    border-radius: 8px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.show-content {
    flex: 1;
}

.show-controls {
    display: flex;
    gap: 8px;
}

.control-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: all 0.2s;
}

.control-btn:hover {
    background-color: rgba(255, 255, 255, 0.2);
}

.edit-btn {
    font-size: 1.2em;
}

.delete-btn {
    font-size: 1.2em;
}

.show-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.show-card h3 {
    margin: 0 0 12px 0;
    color: #2c3e50;
    font-size: 1.4em;
}

.show-card h4 {
    color: #2c3e50;
    margin: 16px 0 8px;
    font-size: 1.1em;
}

.game-title {
    color: #666;
    font-size: 0.95em;
    margin: 8px 0;
    font-style: italic;
}

.loading {
    text-align: center;
    padding: 40px;
    color: #666;
}

.error {
    text-align: center;
    padding: 40px;
    color: #f44336;
}

.retry-button {
    margin-top: 16px;
    padding: 8px 16px;
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.retry-button:hover {
    background-color: #d32f2f;
}
</style>
