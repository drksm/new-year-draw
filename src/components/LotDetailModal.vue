<template>
  <div class="lot-detail-modal">
    <div class="modal-content">
      <h2 class="lot-title">{{ lot.title }}</h2>
      
      <div v-if="lot.img" class="lot-image">
        <img :src="lot.img" alt="签文图片" @load="handleImageLoad">
        <div v-if="!imageLoaded" class="loading-spinner"></div>
      </div>
      
      <div class="lot-content">{{ formatContent(lot.content) }}</div>
      
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

      <div v-if="!interpretation" class="action-buttons">
        <button class="action-button interpret" @click="handleShowInterpretation">
          解签
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { interpretLot } from '../api/lotService'

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

const emit = defineEmits(['update:interpretation'])

const imageLoaded = ref(false)
const currentRequest = ref(null)

const handleImageLoad = () => {
  imageLoaded.value = true
}

const formatContent = (content) => {
  if (!content) return ''
  // 先替换所有标点符号为标点+换行，然后通过 split 和 filter 去除空行，最后用单个换行符重新连接
  return content.replace(/[，。；！]/g, '$&\n').split('\n').filter(line => line.trim()).join('\n')
}

const handleShowInterpretation = async () => {
  // 如果有正在进行的请求，先中止它
  if (currentRequest.value) {
    currentRequest.value.abort()
    currentRequest.value = null
  }

  // 立即设置加载状态
  emit('update:interpretation', '正在解签中...')
  
  // 构建完整的签文内容
  const lot = props.lot
  const descriptions = [
    lot.description1,
    lot.description2,
    lot.description3
  ].filter(Boolean).join('\n')
  
  const content = `我这次抽的签是，${lot.title}\n${lot.content}\n参考如下：\n${descriptions}`
  
  // 设置超时处理
  const timeoutId = setTimeout(() => {
    if (props.interpretation === '正在解签中...') {  // 只有在还在加载状态时才显示超时
      emit('update:interpretation', '解签超时，请稍后重试。\n\n可能的原因：\n1. 网络连接不稳定\n2. 服务器响应较慢\n\n您可以点击"重新解签"再次尝试。')
      if (currentRequest.value) {
        currentRequest.value.abort()
        currentRequest.value = null
      }
    }
  }, 30000)

  try {
    // 发起解签请求
    currentRequest.value = await interpretLot(content, (text) => {
      clearTimeout(timeoutId)
      // 确保新的文本内容不为空再更新
      if (text && text.trim()) {
        emit('update:interpretation', text)
      }
    })
  } catch (error) {
    clearTimeout(timeoutId)
    emit('update:interpretation', `解签失败：${error.message}\n\n您可以点击"重新解签"再次尝试。`)
  }
}
</script>

<style scoped>
.lot-detail-modal {
  width: 100%;
  max-width: 800px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-height: 80vh;
  overflow-y: auto;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.modal-content {
  position: relative;
  width: 100%;
}

.lot-title {
  color: #8B4513;
  margin: 0 0 20px 0;
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
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

.lot-content {
  font-size: 2rem;
  line-height: 1.8;
  color: #333;
  margin: 20px 0;
  padding: 25px;
  background: #fff9f0;
  border-radius: 8px;
  border-left: 4px solid #8B4513;
  font-weight: bold;
  text-align: center;
  white-space: pre-line;
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
  margin: 20px 0 15px 0;
  font-size: 1.8rem;
  font-weight: bold;
}

@media (max-width: 768px) {
  .lot-detail-modal {
    width: 95%;
    max-height: 75vh;
  }
  
  .lot-title {
    font-size: 1.8rem;
  }
  
  .lot-content {
    font-size: 1.6rem;
    padding: 20px;
  }
  
  h3 {
    font-size: 1.6rem;
  }
  
  .lot-description, 
  .lot-interpretation,
  .interpretation-text,
  .loading-text {
    font-size: 1.2rem;
  }
}

.lot-description, .lot-interpretation {
  margin-top: 20px;
  padding: 20px;
  background: #fff9f0;
  border-radius: 8px;
  border: 1px solid #e0d5c1;
  font-size: 1.4rem;
  line-height: 1.8;
}

.interpretation-content {
  white-space: pre-wrap;
  line-height: 1.8;
}

.loading-text {
  color: #666;
  font-style: italic;
  font-size: 1.4rem;
}

.interpretation-text {
  color: #333;
  font-size: 1.4rem;
  line-height: 1.8;
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

.action-buttons {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding: 20px 0;
}

.action-button {
  padding: 10px 30px;
  font-size: 1.2rem;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #8B4513, #A0522D);
  color: white;
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, #A0522D, #8B4513);
}

.action-button:active {
  transform: translateY(0);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}
</style> 