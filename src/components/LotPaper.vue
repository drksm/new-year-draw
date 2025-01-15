<template>
  <div class="lot-paper-container">
    <div class="lot-paper" :style="paperStyle">
      <div class="lot-content">
        <img 
          src="/img/lot-paper.jpg" 
          alt="签纸背景" 
          class="lot-background" 
          @load="updateDimensions"
        />
        <div class="lot-text">
          <slot></slot>
        </div>
        <BurnEffect 
          :active="isBurning"
          :width="width"
          :height="height"
          @burn-progress="updateBurnProgress"
          @burn-complete="handleBurnComplete"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import BurnEffect from './BurnEffect.vue'

const props = defineProps({
  isBurning: Boolean
})

const emit = defineEmits(['burn-complete'])

const width = ref(0)
const height = ref(0)
const burnProgress = ref(0)
const isVisible = ref(true)

const paperStyle = computed(() => ({
  clipPath: `inset(${burnProgress.value * 100}% 0 0 0)`,
  opacity: Math.max(0, 1 - burnProgress.value * 1.2),
  transform: `scale(${1 - burnProgress.value * 0.1})`,
  visibility: isVisible.value ? 'visible' : 'hidden'
}))

const updateDimensions = () => {
  const paper = document.querySelector('.lot-paper')
  if (paper) {
    width.value = paper.offsetWidth
    height.value = paper.offsetHeight
  }
}

const updateBurnProgress = (progress) => {
  console.log('3. updateBurnProgress:', progress)
  burnProgress.value = progress
}

const handleBurnComplete = () => {
  console.log('3.5 LotPaper handleBurnComplete')
  // 等待动画完全结束后再隐藏
  setTimeout(() => {
    console.log('3.8 LotPaper setTimeout - 设置 isVisible 为 false')
    isVisible.value = false
    emit('burn-complete')
  }, 300)
}

// 重置状态
watch(() => props.isBurning, (newVal) => {
  console.log('2. watch isBurning:', newVal)
  if (newVal) {
    isVisible.value = true
    burnProgress.value = 0
  }
})
</script>

<style scoped>
.lot-paper-container {
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -100%);
  width: 60%;
  max-width: 400px;
  transition: opacity 0.016s ease-out, transform 0.016s ease-out;
  will-change: opacity, transform;
}

.lot-paper {
  position: relative;
  width: 100%;
  transform-origin: center;
  transition: clip-path 0.016s ease-out;
  will-change: clip-path;
}

.lot-content {
  position: relative;
  width: 100%;
  padding-bottom: 133.33%;
}

.lot-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.lot-text {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style> 