<template>
  <div class="loading-container">
    <div class="mountain-background">
      <svg 
        class="mountains" 
        viewBox="0 0 100 50" 
        preserveAspectRatio="xMidYMax slice"
      >
        <path 
          fill="#FFD7BA" 
          opacity="0.6"
          d="M0,50 L10,30 Q12,28 15,30 L25,20 Q28,18 30,20 L40,12 Q43,10 45,12 
             L55,18 Q58,20 60,18 L70,25 Q73,27 75,25 L85,15 Q88,13 90,15 L100,50 L0,50"
        />
        <path 
          fill="#FFCBA4" 
          opacity="0.7"
          d="M-10,50 L5,25 Q8,23 10,25 L20,15 Q23,13 25,15 L35,8 Q38,6 40,8 
             L50,18 Q53,20 55,18 L65,22 Q68,24 70,22 L80,12 Q83,10 85,12 L95,20 Q98,22 100,20 L110,50 L-10,50"
        />
        <path 
          fill="#FFB6C1" 
          opacity="0.8"
          d="M-20,50 L0,35 Q3,33 5,35 L15,25 Q18,23 20,25 L30,15 Q33,13 35,15 
             L45,28 Q48,30 50,28 L60,18 Q63,16 65,18 L75,28 Q78,30 80,28 L90,20 Q93,18 95,20 L105,30 Q108,32 110,30 L120,50 L-20,50"
        />
        
        <path
          fill="none"
          stroke="#FFD7BA"
          stroke-width="0.2"
          opacity="0.3"
          d="M25,20 L28,50 M40,12 L42,50 M60,18 L58,50 M75,25 L78,50"
        />
        
        <path
          fill="none"
          stroke="#FFCBA4"
          stroke-width="0.2"
          opacity="0.3"
          d="M20,15 L22,50 M35,8 L38,50 M55,18 L52,50 M70,22 L73,50"
        />
        
        <path
          fill="none"
          stroke="#FFB6C1"
          stroke-width="0.2"
          opacity="0.3"
          d="M15,25 L18,50 M30,15 L32,50 M50,28 L48,50 M65,18 L68,50 M80,28 L82,50"
        />
      </svg>
    </div>
    <div class="loading-text" :class="{ 'fade-out': progress >= 100 }">
      {{ progress >= 100 ? '加载完成' : '祈福加载中...' }}
    </div>
    <div v-if="progress < 100" class="loading-progress">
      <div class="progress-bar" :style="{ width: progress + '%' }"></div>
    </div>
    <button 
      v-else 
      class="enter-button"
      @click="enterSite"
    >
      进入祈福
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMusicStore } from '@/stores/musicStore'

const router = useRouter()
const progress = ref(0)
const store = useMusicStore()

const startLoading = () => {
  const totalTime = 3000 // 3秒
  const intervalTime = 50 // 每50ms更新一次
  const steps = totalTime / intervalTime
  const increment = 100 / steps

  const loadingInterval = setInterval(() => {
    progress.value += increment
    progress.value = Math.min(progress.value, 100)
    
    if (progress.value >= 100) {
      clearInterval(loadingInterval)
    }
  }, intervalTime)
}

const enterSite = () => {
  router.replace({ name: 'draw' })
}

onMounted(() => {
  startLoading()
})
</script>

<style scoped>
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to bottom, rgba(255, 228, 181, 0.8), rgba(255, 182, 193, 0.8));
}

.loading-text {
  font-size: 1.5rem;
  color: #8B4513;
  margin-bottom: 15px;
  font-family: "Microsoft YaHei", sans-serif;
  transition: opacity 0.5s ease;
}

.loading-text.fade-out {
  animation: textFadeOut 2s forwards;
  animation-delay: 0.5s; /* 等待半秒后开始淡出 */
}

@keyframes textFadeOut {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-10px);
  }
}

.loading-progress {
  width: 80%;
  max-width: 300px;
  height: 10px;
  background: rgba(139, 69, 19, 0.2);
  border-radius: 5px;
  overflow: hidden;
}

.progress-bar {
  width: 0%;
  height: 100%;
  background: #8B4513;
  border-radius: 5px;
  transition: width 0.3s ease;
}

.enter-button {
  background: #8B4513;
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 25px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease-out;
}

.enter-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
}

.enter-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

@keyframes fadeIn {
  from { 
    opacity: 0;
  }
  to { 
    opacity: 1;
  }
}

.mountain-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.mountains {
  width: 100%;
  height: 100%;
}

.loading-text,
.loading-progress,
.enter-button {
  position: relative;
  z-index: 1;
}
</style> 