<template>
  <Suspense>
    <template #default>
      <div class="draw-lot-view">
        <LotTube :is-shaking="isShaking" />
        <LotDetailModal 
          v-if="showDetail"
          :should-burn="false"
          @burn-complete="handleBurnComplete"
        >
          <div class="lot-content">
            <div class="lot-number">{{ currentLot?.number }}</div>
            <div class="lot-text">{{ currentLot?.content }}</div>
          </div>
        </LotDetailModal>
        <LotButtons 
          :drawn-number="currentLot?.id"
          :is-shaking="isShaking"
          :is-resetting="false"
          @start="startDraw"
          @interpret="showInterpretation"
          @reset="handleReset"
        />
        <InterpretationModal
          v-if="showInterpretationModal"
          :interpretation="interpretation"
          @close="showInterpretationModal = false"
        />
      </div>
    </template>
    <template #fallback>
      <div class="loading">
        Loading...
      </div>
    </template>
  </Suspense>
</template>

<script setup>
import { ref } from 'vue'
import LotTube from '../components/LotTube.vue'
import LotButtons from '@/components/LotButtons.vue'
import LotDetailModal from '@/components/LotDetailModal.vue'
import InterpretationModal from '@/components/InterpretationModal.vue'
import { drawLot, interpretLot } from '@/api/lotService'

const isShaking = ref(false)
const currentLot = ref(null)
const showDetail = ref(false)
const showInterpretationModal = ref(false)
const interpretation = ref(null)

const startDraw = async () => {
  if (isShaking.value) return
  isShaking.value = true
  
  try {
    const result = await drawLot()
    currentLot.value = result
    showDetail.value = true
  } catch (error) {
    console.error('抽签失败:', error)
  } finally {
    isShaking.value = false
  }
}

const handleReset = () => {
  // 只重置状态，不自动开始新的抽签
  showDetail.value = false
  currentLot.value = null
}

const showInterpretation = async () => {
  if (!currentLot.value?.id) return
  
  try {
    const result = await interpretLot(currentLot.value.id)
    interpretation.value = result
    showInterpretationModal.value = true
  } catch (error) {
    console.error('解签失败:', error)
    alert('解签失败，请稍后重试')
  }
}
</script>

<style scoped>
.draw-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to bottom, #FFE4B5, #FFB6C1);
  overflow: hidden;
}

.lot-content {
  text-align: center;
  color: #8B4513;
  padding: 20px;
}

.lot-number {
  font-size: 1.5rem;
  margin-bottom: 15px;
  font-weight: bold;
}

.lot-text {
  font-size: 1.2rem;
  line-height: 1.6;
}
</style> 