<script setup lang="ts">
</script>

<template>
  <div class="app-container">
    <header class="header">
      <img src="./assets/tvo-show-biingo.webp" alt="TV Show Bingo" 
      class="header-image" width="200" />
    </header>
    <router-view></router-view>
  </div>
</template>

<style scoped>
.app-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.header-image {
  max-width: 100%;
  height: auto;
}
</style>