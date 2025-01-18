<template>
  <div class="lot-detail">
    <div class="lot-content">
      <h2 class="lot-title">{{ lot.title }}</h2>
      <div class="lot-image" v-if="lot.img">
        <img :src="lot.img" alt="签文图片" @load="handleImageLoad" />
        <div v-if="isLoading" class="image-loading">
          <div class="loading-spinner"></div>
        </div>
      </div>
      <div class="lot-text">
        <h3>签文内容：</h3>
        <p class="content">{{ lot.content }}</p>
        
        <div class="descriptions">
          <div v-if="lot.description3" class="description-item">
            <h4>圣意：</h4>
            <p>{{ lot.description3 }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  lot: {
    type: Object,
    required: true
  }
})

const isLoading = ref(true)

const handleImageLoad = () => {
  isLoading.value = false
}
</script>

<style scoped>
.lot-detail {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.lot-title {
  color: #8B4513;
  margin: 0 0 20px 0;
  font-size: 1.5rem;
  text-align: center;
}

.lot-image {
  position: relative;
  width: 100%;
  margin-bottom: 20px;
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f5f5;
  border-radius: 4px;
}

.lot-image img {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
}

.image-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.8);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #8B4513;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.lot-text {
  margin-bottom: 20px;
}

.content {
  font-size: 1.2rem;
  line-height: 1.8;
  color: #333;
  margin: 20px 0;
  padding: 15px;
  background: #fff9f0;
  border-radius: 8px;
  border-left: 4px solid #8B4513;
}

.descriptions {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.description-item {
  padding: 15px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.description-item h4 {
  color: #8B4513;
  margin: 0 0 10px 0;
  font-size: 1.1rem;
}

.description-item p {
  margin: 0;
  line-height: 1.6;
  white-space: pre-wrap;
  color: #444;
}

h3 {
  color: #8B4513;
  margin-bottom: 10px;
}

@media (max-width: 768px) {
  .lot-detail {
    width: 95%;
  }
  
  .content {
    font-size: 1.1rem;
  }
}
</style> 