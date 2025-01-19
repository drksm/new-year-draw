<template>
  <div class="lot-tube" @click="handleScreenClick">
    <div class="papers-container">
      <!-- 后半部分筒子 -->
      <svg class="barrel-back" :class="{ shaking: isShaking }" viewBox="-20 -20 240 440" width="660" height="380">
        <!-- 后半部分筒身 -->
        <path class="barrel-body" d="M10,20 C10,-15 190,-15 190,20 L190,360 C190,380 10,380 10,360 Z" 
              fill="#8B2500" stroke="#3E2723" stroke-width="2"/>
        <!-- 后半部分上边缘 -->
        <path d="M10,20 C10,-15 190,-15 190,20" 
              fill="none" stroke="#3E2723" stroke-width="2"/>
        <!-- 后半部分下边缘 -->
        <path d="M10,360 C10,380 190,380 190,360" 
              fill="none" stroke="#3E2723" stroke-width="2"/>
      </svg>

      <!-- 前半部分筒子 -->
      <svg class="barrel-front" :class="{ shaking: isShaking }" viewBox="-20 30 240 420" width="770" height="380">
        <!-- 前半部分筒身 -->
        <path class="barrel-body" d="M10,20 C10,55 190,55 190,20 L190,360 C190,380 10,380 10,360 Z" 
              fill="#8B2500"/>
        <!-- 前半部分上边缘 -->
        <path d="M10,20 C10,55 190,55 190,20" 
              fill="none"/>
        <!-- 前半部分下边缘 -->
        <path d="M10,360 C10,380 190,380 190,360" 
              fill="none"/>
      </svg>

      <!-- 签子 -->
      <div v-for="i in 8" :key="i-1"
           :class="['paper', `paper-${i}`, { 
             shaking: isShaking && selectedIndex !== i-1, 
             selected: selectedIndex === i-1 
           }]"
           @click="handleSelect(i-1)">
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  onSelect: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['reset'])
const selectedIndex = ref(null)
const isShaking = ref(false)

const handleSelect = (index) => {
  if (selectedIndex.value !== null || isShaking.value) return
  isShaking.value = true
  
  setTimeout(() => {
    isShaking.value = false
    setTimeout(() => {
      selectedIndex.value = index
      setTimeout(() => {
        props.onSelect(index)
      }, 1500)
    }, 100)
  }, 1000)
}

const handleScreenClick = () => {
  if (selectedIndex.value !== null || isShaking.value) return
  const randomIndex = Math.floor(Math.random() * 8)
  handleSelect(randomIndex)
}
</script>

<style scoped>
.lot-tube {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 20px;
  min-height: 800px;
  margin-top: 20%;
}

.papers-container {
  position: relative;
  width: 1000px;
  height: 1000px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(-50%);
}

.barrel-back {
  position: absolute;
  bottom: -100px;
  left: 50%;
  transform: translateX(-50%) scale(1.1);
  z-index: 0;
  opacity: 1;
  margin-bottom: 20px;
}

.barrel-front {
  position: absolute;
  bottom: -100px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.barrel-body {
  filter: none;
}

.paper {
  position: absolute;
  width: 80px;
  height: 320px;
  background-color: #FFE4B5;
  border: 1px solid #DEB887;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.3s ease;
  bottom: 120px;
  transform: var(--initial-transform);
  z-index: var(--z-index, 1);
  will-change: transform;
}

.paper:hover {
  transform: var(--hover-transform);
}

.paper-1 { --initial-transform: translateX(-35px) rotate(-12deg); --hover-transform: translateX(-35px) rotate(-12deg) translateY(-20px); z-index: 1; }
.paper-2 { --initial-transform: translateX(-25px) rotate(-8deg); --hover-transform: translateX(-25px) rotate(-8deg) translateY(-20px); z-index: 2; }
.paper-3 { --initial-transform: translateX(-15px) rotate(-4deg); --hover-transform: translateX(-15px) rotate(-4deg) translateY(-20px); z-index: 3; }
.paper-4 { --initial-transform: translateX(-5px) rotate(-2deg); --hover-transform: translateX(-5px) rotate(-2deg) translateY(-20px); z-index: 4; }
.paper-5 { --initial-transform: translateX(5px) rotate(2deg); --hover-transform: translateX(5px) rotate(2deg) translateY(-20px); z-index: 5; }
.paper-6 { --initial-transform: translateX(15px) rotate(4deg); --hover-transform: translateX(15px) rotate(4deg) translateY(-20px); z-index: 6; }
.paper-7 { --initial-transform: translateX(25px) rotate(8deg); --hover-transform: translateX(25px) rotate(8deg) translateY(-20px); z-index: 7; }
.paper-8 { --initial-transform: translateX(35px) rotate(12deg); --hover-transform: translateX(35px) rotate(12deg) translateY(-20px); z-index: 8; }

@keyframes shakeBarrel {
  0%, 100% { transform: translateX(-50%) scale(1.1) translateY(0); }
  25% { transform: translateX(-50%) scale(1.1) translateY(-15px); }
  75% { transform: translateX(-50%) scale(1.1) translateY(15px); }
}

@keyframes shakeBarrelFront {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  25% { transform: translateX(-50%) translateY(-15px); }
  75% { transform: translateX(-50%) translateY(15px); }
}

@keyframes shakePapers {
  0%, 100% { transform: var(--initial-transform) translateY(0); }
  25% { transform: var(--initial-transform) translateY(-40px); }
  75% { transform: var(--initial-transform) translateY(40px); }
}

@keyframes flyAway {
  0% { transform: var(--initial-transform); }
  15% { transform: var(--initial-transform) translateY(-50px); }
  30% { transform: var(--initial-transform) translateY(-150px); }
  100% { transform: var(--initial-transform) translateY(-2000px); }
}

.barrel-back.shaking {
  animation: shakeBarrel 0.2s ease-in-out infinite;
}

.barrel-front.shaking {
  animation: shakeBarrelFront 0.2s ease-in-out infinite;
}

.paper.shaking {
  animation: shakePapers 0.2s ease-in-out infinite;
}

.paper.selected {
  animation: flyAway 2s ease-out forwards !important;
  z-index: 500 !important;
  opacity: 1 !important;
  animation-delay: 0s !important;
}

.paper.selected.shaking {
  animation: flyAway 2s ease-out forwards !important;
}
</style> 