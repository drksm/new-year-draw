<template>
  <div class="home-container">
    <div class="title">新年抽签</div>
    <button 
      class="enter-button" 
      @click="handleEnter"
    >
      进入祈福
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleEnter = () => {
  router.push('/draw')
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: linear-gradient(to bottom, #FFE4B5, #FFB6C1);
}

.title {
  color: #8B4513;
  font-size: 2rem;
  margin: 20px 0;
}

.temple-entrance {
  width: 80%;
  max-width: 300px;
  margin: 20px 0;
}

.temple-entrance img {
  width: 100%;
  height: auto;
}

.start-button {
  background: #8B4513;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 25px;
  font-size: 1.2rem;
  margin-top: 20px;
  cursor: pointer;
  transition: transform 0.2s;
}

.start-button:active {
  transform: scale(0.95);
}
</style> 