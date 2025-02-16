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

const navigateToShow = (showTitle: string) => {
  router.push(`/show/${encodeURIComponent(showTitle)}`)
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
              :key="show.showTitle" 
              class="show-card"
              @click="navigateToShow(show.showTitle)"
            >
                <h3>{{ show.showTitle }}</h3>
                <div v-if="show.gameTitle" class="game-title">
                    Also known as: {{ show.gameTitle }}
                </div>
                <div v-if="show.centerSquare" class="center-square">
                    Center Square: {{ show.centerSquare }}
                </div>
                <div class="phrases">
                    <h4>Famous Phrases:</h4>
                    <ul>
                        <li v-for="phrase in show.phrases" :key="phrase">{{ phrase }}</li>
                    </ul>
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
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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

.game-title, .center-square {
    color: #666;
    font-size: 0.9em;
    margin: 8px 0;
    font-style: italic;
}

.phrases {
    margin-top: 16px;
}

.phrases ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.phrases li {
    color: #666;
    font-size: 0.9em;
    padding: 4px 0;
    margin: 4px 0;
    border-bottom: 1px solid #eee;
}

.phrases li:last-child {
    border-bottom: none;
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
