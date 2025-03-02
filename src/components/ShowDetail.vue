<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Show } from '../types/Show'
import { showService } from '../services/showService'

const props = defineProps<{
  id: string
}>()

const router = useRouter()
const show = ref<Show | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const loadedShow = await showService.getShowById(parseInt(props.id))
    if (loadedShow) {
      show.value = { ...loadedShow }
    } else {
      error.value = 'Show not found'
      router.push('/')
    }
  } catch (e) {
    error.value = 'Failed to load show'
    console.error(e)
  } finally {
    loading.value = false
  }
})
const newPhrase = ref('')

const phraseCount = computed(() => show.value?.phrases?.length || 0)

const addPhrase = () => {
  if (!show.value || !newPhrase.value.trim()) return
  
  show.value.phrases.push(newPhrase.value)
  newPhrase.value = ''
}

const removePhrase = (index: number) => {
  if (!show.value) return
  
  show.value.phrases.splice(index, 1)
}

const saveShow = async () => {
  if (!show.value) return
  
  try {
    // Create a plain JavaScript object copy without reactive proxies
    const plainShow = JSON.parse(JSON.stringify(show.value))
    await showService.updateShow(plainShow)
    router.push('/')
  } catch (e) {
    error.value = 'Failed to save show'
    console.error(e)
  }
}
</script>

<template>
  <div class="show-detail">
    <div v-if="loading" class="loading">
      Loading show...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else>
      <h2>Edit TV Show</h2>
    <form v-if="show" @submit.prevent="saveShow" class="edit-form">
      <div class="form-group">
        <label>Show Title:</label>
        <input v-model="show.showTitle" required />
      </div>
      
      <div class="form-group">
        <label>Game Title:</label>
        <input v-model="show.gameTitle" />
      </div>
      
      <div class="form-group">
        <label>Center Square:</label>
        <input v-model="show.centerSquare" />
      </div>

      <div class="form-group">
        <label>Phrases ({{ phraseCount }}):</label>
        <div class="phrases-list">
          <div v-for="(phrase, index) in show.phrases" :key="index" class="phrase-item">
            <span>{{ phrase }}</span>
            <button type="button" @click="removePhrase(index)" class="remove-btn">×</button>
          </div>
        </div>
        <div class="add-phrase">
          <input v-model="newPhrase" placeholder="New phrase" />
          <button type="button" @click="addPhrase">Add</button>
        </div>
      </div>

      <div class="buttons">
        <button type="button" @click="router.push('/')" class="cancel-btn">Cancel</button>
        <button type="submit" class="save-btn">Save</button>
      </div>
    </form>
    </div>
  </div>
</template>

<style scoped>
.show-detail {
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.edit-form {
  background-color: #1a1a1a;
  padding: 2rem;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #888;
}

input {
  width: 100%;
  padding: 0.5rem;
  background-color: #2c2c2c;
  border: 1px solid #444;
  border-radius: 4px;
  color: #fff;
}

.phrases-list {
  margin: 1rem 0;
}

.phrase-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background-color: #2c2c2c;
  margin-bottom: 0.5rem;
  border-radius: 4px;
}

.remove-btn {
  background: none;
  border: none;
  color: #ff4444;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 0.5rem;
}

.add-phrase {
  display: flex;
  gap: 0.5rem;
}

.add-phrase input {
  flex: 1;
}

.buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.cancel-btn {
  background-color: #444;
}

.save-btn {
  background-color: #646cff;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: white;
}

button:hover {
  opacity: 0.9;
}
</style>