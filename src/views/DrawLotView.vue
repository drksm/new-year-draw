<template>
  <div class="draw-lot-view">
    <div class="mountain-background">
      <img src="../../public/img/lotview.jpg" alt="Mountain Background" class="mountains blur">
    </div>

    <Transition name="fade">
      <div v-if="!lotStore.currentLot" class="draw-section">
        <div class="guidance-text" v-if="!isStarted">
          <div class="text-line">诚心抽一支签，</div>
          <div class="text-line">让我为您解开心中疑惑。</div>
        </div>
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
          v-model:interpretation="interpretation"
        />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useLotStore } from '../stores/lotStore'
import LotTube from '../components/LotTube.vue'
import LotDetailModal from '../components/LotDetailModal.vue'
import { drawLot } from '../api/lotService'

const lotStore = useLotStore()
const interpretation = ref(null)
const isStarted = ref(false)

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

const handleStart = () => {
  isStarted.value = true
  lotStore.clearCurrentLot()
  interpretation.value = null
}

const handleReset = () => {
  isStarted.value = true
  lotStore.clearCurrentLot()
  interpretation.value = null
}

// 监听当前签文变化，当有签文时上报抽签结果页面 PV
watch(() => lotStore.currentLot, (newLot) => {
  if (newLot) {
    try {
      window.clarity?.("set", "DrawLotResult", new Date().toISOString());
      console.log('Clarity PV tracked: DrawLotResult');
    } catch (error) {
      console.warn('Clarity PV tracking failed:', error);
    }
  }
})

onMounted(() => {
  try {
    // 上报抽签筒子页面 PV
    window.clarity?.("set", "DrawLotTube", new Date().toISOString());
    console.log('Clarity PV tracked: DrawLotTube');
  } catch (error) {
    console.warn('Clarity PV tracking failed:', error);
  }
})
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

.guidance-text {
  text-align: center;
  margin-bottom: 2rem;
  position: absolute;
  top: 5%;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 10;
  width: 100%;
}

.text-line {
  font-size: 1.8rem;
  color: #FFD700;
  margin: 0.5rem 0;
  font-weight: 500;
  text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.9);
  opacity: 0;
  transform: translateY(20px);
  padding: 5px 15px;
  border-radius: 20px;
  display: inline-block;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.text-line:nth-child(1) {
  animation: fadeInUp 1.5s ease forwards, float 3s ease-in-out 1.5s infinite;
}

.text-line:nth-child(2) {
  animation: fadeInUp 1.5s ease forwards 0.5s, float 3s ease-in-out 2s infinite;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 