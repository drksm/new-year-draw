<template>
  <div class="loading-container">
    <div class="mountain-background">
      <img src="../../public/img/splash.jpg" alt="Mountain Background" class="mountains">
    </div>
    <h1 class="main-title">慧心签语</h1>
    <div v-if="error" class="error-container">
      <div class="error-message">{{ error }}</div>
      <button class="retry-button" @click="retryLogin">重试</button>
    </div>
    <template v-else>
      <div v-if="progress < 100" class="loading-progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <div v-else>
        <!-- 八字收集表单 -->
        <Transition name="fade">
          <BirthInfoForm 
            v-if="showBirthForm"
            @submit="handleBirthInfoSubmit"
          />
        </Transition>
        
        <!-- 引导文字 -->
        <div v-if="!showBirthForm && isFirstLineTyped" class="guidance-container">
          <div class="guidance-text">
            <p v-for="(char, index) in firstLine" 
               :key="`first-${index}`"
               :style="{ 
                 animationDelay: `${index * 0.1}s`,
                 opacity: 0
               }"
               class="char"
            >
              {{ char }}
            </p>
          </div>
          <div class="guidance-text" v-if="isSecondLineTyped">
            <p v-for="(char, index) in secondLine" 
               :key="`second-${index}`"
               :style="{ 
                 animationDelay: `${index * 0.1}s`,
                 opacity: 0
               }"
               class="char"
            >
              {{ char }}
            </p>
          </div>
          <div class="hint-text fade-in" v-if="isSecondLineTyped" @click="enterSite">
            点击继续
          </div>
        </div>
      </div>
    </template>
    
    <AudioConfirmModal 
      :show="showAudioModal"
      @confirm="handleAudioConfirm"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useMusicStore } from '@/stores/musicStore'
import { useAuthStore } from '../stores/authStore'
import { useBirthInfoStore } from '../stores/birthInfoStore'
import { login } from '../api/authService'
import AudioConfirmModal from './AudioConfirmModal.vue'
import BirthInfoForm from './BirthInfoForm.vue'

const router = useRouter()
const progress = ref(0)
const store = useMusicStore()
const authStore = useAuthStore()
const birthInfoStore = useBirthInfoStore()
const isLoading = ref(true)
const error = ref(null)
const showAudioModal = ref(false)
const showBirthForm = ref(false)
const isFirstLineTyped = ref(false)
const isSecondLineTyped = ref(false)
const firstLine = "在这里，你可以沉浸于宁静的抽签与祈愿之旅，感受心灵的慰藉与希望的曙光。"
const secondLine = "点击任意键，开启你的专属祈愿时刻。"

const handleLogin = async () => {
  try {
    const response = await login()
    if (response.code === 0 && response.data?.token) {
      authStore.setToken(response.data.token, response.data.refreshToken)
      authStore.startAutoRefresh()
      showAudioModal.value = true
      startLoading()
      return true
    } else {
      throw new Error('Login failed: Invalid response format')
    }
  } catch (error) {
    console.error('Login error:', error)
    error.value = '登录失败，请刷新页面重试'
    return false
  }
}

const handleAudioConfirm = (allowed) => {
  showAudioModal.value = false
  if (allowed) {
    store.setMusicEnabled(true)
    store.playBackgroundMusic()
  }
  // 加载缓存的生辰八字信息
  birthInfoStore.loadBirthInfo()
  // 始终显示表单，让用户确认或修改
  showBirthForm.value = true
}

const handleBirthInfoSubmit = (birthInfo) => {
  console.log('Birth info submitted:', birthInfo)
  // 保存生辰八字信息
  birthInfoStore.setBirthInfo(birthInfo)
  
  // 隐藏表单，开始显示引导文字
  showBirthForm.value = false
  startGuidanceText()
}

const startGuidanceText = () => {
  setTimeout(() => {
    isFirstLineTyped.value = true
    setTimeout(() => {
      isSecondLineTyped.value = true
    }, firstLine.length * 100 + 500)
  }, 500)
}

const startLoading = () => {
  progress.value = 0
  const totalTime = 3000
  const intervalTime = 50
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

const retryLogin = async () => {
  const success = await handleLogin()
  if (!success) {
    error.value = '登录失败，请刷新页面重试'
  }
}

const enterSite = () => {
  router.replace({ name: 'guidance' })
}

onMounted(async () => {
  const success = await handleLogin()
  if (success) {
    startLoading()
  }
  try {
    window.clarity?.("set", "LoadingScreen", new Date().toISOString());
    console.log('Clarity PV tracked: LoadingScreen');
  } catch (error) {
    console.warn('Clarity PV tracking failed:', error);
  }
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

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  z-index: 1;
}

.error-message {
  color: #D32F2F;
  background: rgba(255, 255, 255, 0.9);
  padding: 15px 25px;
  border-radius: 8px;
  font-size: 1.1rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.retry-button {
  background: #8B4513;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.retry-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.retry-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  animation-delay: 0.5s;
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

.button-container {
  position: fixed;
  bottom: 15%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.enter-button {
  background: #8B4513;
  color: white;
  border: none;
  padding: 20px 40px;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  max-width: 80%;
  width: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.button-text {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  align-items: center;
}

.typing-text span {
  display: inline-block;
  opacity: 0;
  animation: typing 0.5s forwards;
  animation-play-state: paused;
}

.typing-text.typing-done span {
  animation-play-state: running;
}

@keyframes typing {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.button-text p {
  margin: 0;
  line-height: 1.6;
  text-align: center;
  width: 100%;
  padding: 0 20px;
  min-height: 1.6em; /* 防止文字出现时的跳动 */
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

.loading-text,
.loading-progress,
.enter-button {
  position: relative;
  z-index: 1;
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
  transition: opacity 0.5s ease;
}

.guidance-text {
  font-size: 1.2rem;
  line-height: 1.8;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 15px;
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
  cursor: pointer;
}

@keyframes charFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
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

.main-title {
  position: absolute;
  z-index: 2;
  color: #8B4513;
  font-size: 2.8rem;
  font-weight: normal;
  left: 50%;
  transform: translateX(-50%);
  top: 80px;
  text-shadow: 2px 2px 8px rgba(255, 215, 0, 0.3);
  font-family: "华文行楷", "楷体", "STKaiti", "KaiTi", sans-serif;
  margin: 0;
  letter-spacing: 4px;
  -webkit-text-stroke: 1px #4a2410;
  background: linear-gradient(to bottom, #8B4513, #654321);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  white-space: nowrap;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 确保表单在引导文字容器之上 */
.birth-info-form {
  position: relative;
  z-index: 3;
}
</style> 