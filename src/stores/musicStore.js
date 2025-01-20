import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMusicStore = defineStore('music', () => {
  const isMusicEnabled = ref(false)
  let bgmAudio = null
  let isDrawing = false
  let drawSound = null
  let shakeSound = null

  const setMusicEnabled = (enabled) => {
    isMusicEnabled.value = enabled
    if (!enabled && bgmAudio) {
      bgmAudio.pause()
    }
  }

  const playBackgroundMusic = () => {
    if (!isMusicEnabled.value || isDrawing) return
    
    if (!bgmAudio) {
      bgmAudio = new Audio('/audio/background.mp3')
      bgmAudio.loop = true
    }
    
    bgmAudio.play().catch(error => {
      console.error('Failed to play background music:', error)
    })
  }

  const pauseBackgroundMusic = () => {
    if (bgmAudio) {
      bgmAudio.pause()
    }
  }

  const resumeBackgroundMusic = () => {
    if (isMusicEnabled.value && bgmAudio && !isDrawing) {
      bgmAudio.play().catch(error => {
        console.error('Failed to resume background music:', error)
      })
    }
  }

  const playDrawSound = () => {
    if (!isMusicEnabled.value) return
    
    isDrawing = true
    pauseBackgroundMusic()

    // 创建新的音频实例
    if (!drawSound) {
      drawSound = new Audio('/audio/draw.mp3')
    }

    // 重置音频
    drawSound.currentTime = 0
    
    // 播放第一次
    const playFirst = () => {
      drawSound.play().then(() => {
        // 第一次播放完成后，立即播放第二次
        drawSound.currentTime = 0
        return drawSound.play()
      }).then(() => {
        // 第二次播放完成后，恢复背景音乐
        isDrawing = false
        resumeBackgroundMusic()
      }).catch(error => {
        console.error('Failed to play draw sound:', error)
        isDrawing = false
        resumeBackgroundMusic()
      })
    }

    playFirst()
  }

  const playShakeSound = () => {
    if (!isMusicEnabled.value || isDrawing) return
    
    if (!shakeSound) {
      shakeSound = new Audio('/audio/shake.mp3')
    }

    // 重置音频
    shakeSound.currentTime = 0
    shakeSound.play().catch(error => {
      console.error('Failed to play shake sound:', error)
    })
  }

  return {
    isMusicEnabled,
    setMusicEnabled,
    playBackgroundMusic,
    pauseBackgroundMusic,
    resumeBackgroundMusic,
    playDrawSound,
    playShakeSound
  }
}) 