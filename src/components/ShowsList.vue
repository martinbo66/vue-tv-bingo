<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showService } from '../services/showService'
import type { Show } from '../services/showService'

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

const navigateToShow = (id: number) => {
  router.push(`/show/${id}`)
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
                <h3>{{ show.title }}</h3>
                <p class="description">{{ show.description }}</p>
                <p class="genre">{{ show.genre }}</p>
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
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
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
}

.description {
    color: #666;
    font-size: 0.9em;
    margin: 8px 0;
    line-height: 1.4;
}

.genre {
    color: #4CAF50;
    font-size: 0.8em;
    font-weight: 600;
    margin-top: 12px;
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
