<template>
  <div class="lot-detail-modal">
    <div class="modal-content">
      <h2 class="lot-title">{{ lot.title }}</h2>
      
      <div v-if="lot.img" class="lot-image">
        <img :src="lot.img" alt="签文图片" @load="handleImageLoad">
        <div v-if="!imageLoaded" class="loading-spinner"></div>
      </div>
      
      <div class="lot-content">{{ lot.content }}</div>
      
      <div v-if="lot.description3" class="lot-description">
        <h3>圣意</h3>
        <div>{{ lot.description3 }}</div>
      </div>

      <div v-if="interpretation" class="lot-interpretation">
        <h3>解签</h3>
        <div class="interpretation-content">
          <div v-if="interpretation === '正在解签中...'" class="loading-text">
            {{ interpretation }}
          </div>
          <div v-else class="interpretation-text">
            {{ interpretation }}
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
  },
  interpretation: {
    type: String,
    default: null
  }
})

const imageLoaded = ref(false)

const handleImageLoad = () => {
  imageLoaded.value = true
}
</script>

<style scoped>
.lot-detail-modal {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-height: 80vh;
  overflow-y: auto;
}

.modal-content {
  position: relative;
  width: 100%;
}

.lot-title {
  color: #8B4513;
  margin: 0 0 20px 0;
  font-size: 1.5rem;
  text-align: center;
  position: sticky;
  top: 0;
  background: white;
  padding: 10px 0;
  z-index: 1;
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
  .lot-detail-modal {
    width: 95%;
    max-height: 75vh;
  }
  
  .lot-content {
    font-size: 1.1rem;
  }
}

.lot-description {
  margin-top: 20px;
  padding: 15px;
  background: #fff9f0;
  border-radius: 8px;
  border: 1px solid #e0d5c1;
}

.lot-interpretation {
  margin-top: 20px;
  padding: 15px;
  background: #fff9f0;
  border-radius: 8px;
  border: 1px solid #e0d5c1;
}

.interpretation-content {
  white-space: pre-wrap;
  line-height: 1.6;
}

.loading-text {
  color: #666;
  font-style: italic;
}

.interpretation-text {
  color: #333;
}

/* 自定义滚动条样式 */
.lot-detail-modal::-webkit-scrollbar {
  width: 8px;
}

.lot-detail-modal::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.lot-detail-modal::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.lot-detail-modal::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style> 