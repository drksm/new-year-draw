<template>
  <div class="draw-lot-view">
    <LotTube 
      :onSelect="handleLotSelect"
      :isStarted="isStarted"
      @reset="handleReset"
      @start="handleStart"
    />
    
    <Transition name="fade">
      <div v-if="selectedLot" class="action-buttons">
        <button class="action-button interpret" @click="handleShowInterpretation">解签</button>
        <button class="action-button redraw" @click="handleReset">再抽一次</button>
      </div>
    </Transition>
    
    <Transition name="fade">
      <LotDetailModal
        v-if="showDetail"
        :lot="selectedLot"
        @close="handleCloseDetail"
      />
    </Transition>
    
    <Transition name="fade">
      <InterpretationModal
        v-if="showInterpretation"
        :lot="selectedLot"
        :interpretation="interpretation"
        @close="handleCloseInterpretation"
      />
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LotTube from '../components/LotTube.vue'
import LotDetailModal from '../components/LotDetailModal.vue'
import InterpretationModal from '../components/InterpretationModal.vue'
import { drawLot, interpretLot } from '../api/lotService'

const showDetail = ref(false)
const showInterpretation = ref(false)
const selectedLot = ref(null)
const interpretation = ref(null)
const isStarted = ref(false)

const handleLotSelect = async (index) => {
  try {
    isStarted.value = false  // 隐藏黄纸
    // 调用抽签接口
    const result = await drawLot()
    selectedLot.value = result
    showDetail.value = true
  } catch (error) {
    console.error('Failed to draw lot:', error)
  }
}

const handleCloseDetail = () => {
  showDetail.value = false
}

const handleShowInterpretation = async () => {
  try {
    const result = await interpretLot(selectedLot.value.id)
    interpretation.value = result
    showInterpretation.value = true
  } catch (error) {
    console.error('Failed to get interpretation:', error)
  }
}

const handleCloseInterpretation = () => {
  showInterpretation.value = false
  interpretation.value = null
}

const handleStart = () => {
  isStarted.value = true
  selectedLot.value = null
  interpretation.value = null
  showDetail.value = false
  showInterpretation.value = false
}

const handleReset = () => {
  isStarted.value = true
  selectedLot.value = null
  interpretation.value = null
  showDetail.value = false
  showInterpretation.value = false
}
</script>

<style scoped>
.draw-lot-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #fff5e6 0%, #fff9f0 100%);
}

.action-buttons {
  display: flex;
  gap: 16px;
  margin-top: 20px;
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