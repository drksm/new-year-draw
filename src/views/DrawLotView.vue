<template>
  <div class="draw-lot-view">
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
        <LotDetailModal :lot="lotStore.currentLot" />
        <div class="action-buttons">
          <button class="action-button interpret" @click="handleShowInterpretation">解签</button>
          <button class="action-button redraw" @click="handleReset">再抽一次</button>
        </div>
        
        <div class="history-section" v-if="lotStore.lotHistory.length > 1">
          <h3>抽签历史</h3>
          <div class="history-list">
            <div v-for="(lot, index) in lotStore.lotHistory.slice().reverse()" 
                 :key="lot.drawTime"
                 class="history-item"
                 v-if="index < 5">
              <span class="history-time">{{ formatTime(lot.drawTime) }}</span>
              <span class="history-title">{{ lot.title }}</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
    
    <Transition name="fade">
      <InterpretationModal
        v-if="showInterpretation"
        :lot="lotStore.currentLot"
        :interpretation="interpretation"
        @close="handleCloseInterpretation"
      />
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useLotStore } from '../stores/lotStore'
import LotTube from '../components/LotTube.vue'
import LotDetailModal from '../components/LotDetailModal.vue'
import InterpretationModal from '../components/InterpretationModal.vue'
import { drawLot, interpretLot } from '../api/lotService'

const lotStore = useLotStore()
const showInterpretation = ref(false)
const interpretation = ref(null)
const isStarted = ref(false)
const interpretationCache = ref(new Map())

const handleLotSelect = async (index) => {
  try {
    isStarted.value = false  // 隐藏黄纸
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
  try {
    const lotId = lotStore.currentLot.id
    
    // 检查缓存
    if (interpretationCache.value.has(lotId)) {
      interpretation.value = interpretationCache.value.get(lotId)
      showInterpretation.value = true
      return
    }

    // 首次请求
    interpretation.value = ''
    showInterpretation.value = true
    
    // 构建完整的签文内容
    const lot = lotStore.currentLot
    const descriptions = [
      lot.description1,
      lot.description2,
      lot.description3
    ].filter(Boolean).join('\n')
    
    const content = `我这次抽的签是，${lot.title}\n${lot.content}\n参考如下：\n${descriptions}`
    
    await interpretLot(content, (text) => {
      interpretation.value = text
    })

    // 缓存结果
    interpretationCache.value.set(lotId, interpretation.value)
  } catch (error) {
    console.error('Failed to get interpretation:', error)
    interpretation.value = '解签失败，请稍后重试'
  }
}

const handleCloseInterpretation = () => {
  showInterpretation.value = false
}

const handleStart = () => {
  isStarted.value = true
  lotStore.clearCurrentLot()
  interpretation.value = null
  showInterpretation.value = false
}

const handleReset = () => {
  isStarted.value = true
  lotStore.clearCurrentLot()
  interpretation.value = null
  showInterpretation.value = false
  interpretationCache.value.clear()
}

const formatTime = (isoString) => {
  const date = new Date(isoString)
  return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
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
  background: linear-gradient(135deg, #fff5e6 0%, #fff9f0 100%);
}

.draw-section, .result-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.action-buttons {
  display: flex;
  gap: 16px;
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

.history-section {
  width: 100%;
  max-width: 800px;
  margin-top: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.history-section h3 {
  color: #8B4513;
  margin-bottom: 15px;
  font-size: 1.2rem;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px;
  background: #fff9f0;
  border-radius: 4px;
  font-size: 0.9rem;
}

.history-time {
  color: #666;
  min-width: 120px;
}

.history-title {
  color: #333;
  font-weight: 500;
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