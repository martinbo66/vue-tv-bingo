<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Show } from '../types/Show'
import CreateShow from './CreateShow.vue'

const router = useRouter()
const shows = ref<Show[]>([
    {
        showTitle: "Hollywood Squares",
        gameTitle: "The Hollywood Squares",
        centerSquare: "Paul Lynde",
        phrases: ["I'll take the center square to block", "X gets the square!", "Circle gets the square!"]
    },
    {
        showTitle: "Match Game",
        phrases: ["Blank blank", "Good answer!", "Survey says..."]
    },
    {
        showTitle: "Password",
        phrases: ["The password is...", "No help!", "Pass the word!"]
    }
])

const navigateToShow = (index: number) => {
  router.push(`/show/${index}`)
}

const addShow = (newShow: Show) => {
  shows.value.push(newShow)
}
</script>

<template>
    <div class="shows-container">
        <h2>TV Shows</h2>
        <CreateShow @show-created="addShow" />
        <div class="shows-list">
            <div 
              v-for="(show, index) in shows" 
              :key="show.showTitle" 
              class="show-card"
              @click="navigateToShow(index)"
            >
                <h3>{{ show.showTitle }}</h3>
                <p v-if="show.gameTitle" class="game-title">Also known as: {{ show.gameTitle }}</p>
                <p v-if="show.centerSquare" class="center-square">Center Square: {{ show.centerSquare }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.shows-container {
    padding: 2rem;
}

.shows-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
}

.show-card {
    background-color: #1a1a1a;
    border-radius: 8px;
    padding: 1.5rem;
    text-align: left;
    cursor: pointer;
    transition: transform 0.2s;
}

.show-card:hover {
    transform: translateY(-2px);
}

h2 {
    font-size: 2em;
    margin-bottom: 1rem;
}

h3 {
    color: #646cff;
    margin: 0 0 1rem 0;
}

.game-title, .center-square {
    color: #888;
    font-style: italic;
    margin: 0.5rem 0;
}
</style>
