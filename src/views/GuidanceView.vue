<template>
  <div class="guidance-view" @click="handleClick">
    <div class="mountain-background">
      <img src="../../public/img/splash.jpg" alt="Mountain Background" class="mountains blur">
    </div>
    
    <div class="guidance-container">
      <div class="guidance-text" :class="{ 'fade-in': showGuidance }">
        <p v-for="(char, index) in guidanceText" 
           :key="index"
           :style="{ 
             animationDelay: `${index * 0.1}s`,
             opacity: 0
           }"
           class="char"
           @animationend="index === guidanceText.length - 1 && (isGuidanceFinished = true)"
        >
          {{ char }}
        </p>
      </div>
      <div v-if="isGuidanceFinished" class="hint-text fade-in">
        点击任意处继续
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const guidanceText = "踏入这宁静的寺庙，心灵已归于宁静。请闭紧双眼，将心中所求、所惑默念于心。让虔诚的祈愿化作一缕轻烟，飘向佛前。此刻，放下杂念，以纯净之心轻触签筒，佛祖的指引即将降临，为你的新年带来一份祥瑞与解答。"
const showGuidance = ref(false)
const isGuidanceFinished = ref(false)

const handleClick = () => {
  if (isGuidanceFinished.value) {
    router.replace({ name: 'draw' })
  }
}

onMounted(() => {
  setTimeout(() => {
    showGuidance.value = true
  }, 500)
})
</script>

<style scoped>
.guidance-view {
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
  object-fit: cover;
  object-position: center;
}

.mountains.blur {
  filter: blur(5px);
}

.guidance-container {
  position: relative;
  z-index: 2;
  max-width: 800px;
  padding: 20px;
  text-align: center;
  color: #fff;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 15px;
  margin: 0 20px;
}

.guidance-text {
  font-size: 1.2rem;
  line-height: 1.8;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.char {
  opacity: 0;
  animation: charFadeIn 1s forwards;
  margin: 0 1px;
}

.hint-text {
  margin-top: 30px;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  animation: breathing 2s infinite;
}

@keyframes charFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes breathing {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

.fade-in {
  animation: fadeIn 1s forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style> 