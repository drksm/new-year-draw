<template>
  <div class="loading-container">
    <div class="mountain-background">
      <img src="../../public/img/splash.jpg" alt="Mountain Background" class="mountains">
    </div>
    <div v-if="error" class="error-container">
      <div class="error-message">{{ error }}</div>
      <button class="retry-button" @click="retryLogin">重试</button>
    </div>
    <template v-else>
      <div v-if="progress < 100" class="loading-progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <div v-else class="button-container">
        <button 
          class="enter-button"
          @click="enterSite"
        >
          点击继续
        </button>
      </div>
    </template>
    
    <AudioConfirmModal 
      :show="showAudioModal"
      @confirm="handleAudioConfirm"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMusicStore } from '@/stores/musicStore'
import { useAuthStore } from '../stores/authStore'
import { login } from '../api/authService'
import AudioConfirmModal from './AudioConfirmModal.vue'

const router = useRouter()
const progress = ref(0)
const store = useMusicStore()
const authStore = useAuthStore()
const isLoading = ref(true)
const error = ref(null)
const showAudioModal = ref(false)

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
  router.replace({ name: 'draw' })
}

onMounted(async () => {
  const success = await handleLogin()
  if (success) {
    startLoading()
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
}

.enter-button {
  background: transparent;
  background: #8B4513;
  color: white;

  border: none;
  padding: 12px 36px;
  border-radius: 25px;
  font-size: 1.3rem;
  font-weight: 500;
  cursor: pointer;
  letter-spacing: 1px;
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
</style> 