<template>
  <div class="draw-lot-view">
    <div class="mountain-background">
      <img src="../../public/img/lotview.jpg" alt="Mountain Background" class="mountains blur">
    </div>

    <Transition name="fade">
      <div v-if="!lotStore.currentLot" class="draw-section">
        <LotTube 
          :onSelect="handleLotSelect"
          :isStarted="isStarted"
          @reset="handleReset"
          @start="handleStart"
        />
      </div>
    </Transition>
    
    <Transition name="fade">
      <div v-if="lotStore.currentLot" class="result-section">
        <LotDetailModal 
          :lot="lotStore.currentLot" 
          :interpretation="interpretation"
        />
        <div v-if="!interpretation" class="action-buttons">
          <button class="action-button interpret" @click="handleShowInterpretation">
            解签
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useLotStore } from '../stores/lotStore'
import LotTube from '../components/LotTube.vue'
import LotDetailModal from '../components/LotDetailModal.vue'
import { drawLot, interpretLot } from '../api/lotService'

const lotStore = useLotStore()
const interpretation = ref(null)
const isStarted = ref(false)
const currentRequest = ref(null)

const handleLotSelect = async (index) => {
  try {
    // 调用抽签接口
    const result = await drawLot()
    console.log('Draw lot result:', result)
    
    if (result && result.code === 0 && result.message === 'success' && result.data) {
      lotStore.setCurrentLot(result.data)  // 使用 store 存储结果
    } else {
      throw new Error('抽签失败：服务器响应异常')
    }
  } catch (error) {
    console.error('Failed to draw lot:', error)
  }
}

const handleShowInterpretation = async () => {
  // 如果有正在进行的请求，先中止它
  if (currentRequest.value) {
    currentRequest.value.abort()
    currentRequest.value = null
  }

  // 立即设置加载状态
  interpretation.value = '正在解签中...'
  
  // 构建完整的签文内容
  const lot = lotStore.currentLot
  const descriptions = [
    lot.description1,
    lot.description2,
    lot.description3
  ].filter(Boolean).join('\n')
  
  const content = `我这次抽的签是，${lot.title}\n${lot.content}\n参考如下：\n${descriptions}`
  
  // 设置超时处理
  const timeoutId = setTimeout(() => {
    if (interpretation.value === '正在解签中...') {  // 只有在还在加载状态时才显示超时
      interpretation.value = '解签超时，请稍后重试。\n\n可能的原因：\n1. 网络连接不稳定\n2. 服务器响应较慢\n\n您可以点击"重新解签"再次尝试。'
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
        interpretation.value = text
      }
    })
  } catch (error) {
    clearTimeout(timeoutId)
    interpretation.value = `解签失败：${error.message}\n\n您可以点击"重新解签"再次尝试。`
  }
}

const handleStart = () => {
  isStarted.value = true
  lotStore.clearCurrentLot()
  interpretation.value = null
}

const handleReset = () => {
  // 如果有正在进行的请求，先中止它
  if (currentRequest.value) {
    currentRequest.value.abort()
    currentRequest.value = null
  }
  
  isStarted.value = true
  lotStore.clearCurrentLot()
  interpretation.value = null
}
</script>

<style scoped>
.draw-lot-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  position: relative;
}

.mountain-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.mountains {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}

.mountains.blur {
  filter: blur(2px);
}

.draw-section {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.result-section {
  position: fixed;
  z-index: 1;
  width: 100%;
  height: 100%;
  max-width: 800px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.action-buttons {
  display: flex;
  gap: 16px;
  width: 100%;
  margin-top: 20px;
  margin-bottom: 20px;
}

.action-button {
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-button.interpret {
  background-color: #4CAF50;
  border: 1px solid #388E3C;
  color: white;
}

.action-button.interpret:hover {
  background-color: #45a049;
}

.action-button.redraw {
  background-color: #2196F3;
  border: 1px solid #1976D2;
  color: white;
}

.action-button.redraw:hover {
  background-color: #1e88e5;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 