import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMusicStore = defineStore('music', () => {
  const isMusicEnabled = ref(false)
  let bgmAudio = null

  const setMusicEnabled = (enabled) => {
    isMusicEnabled.value = enabled
    if (!enabled && bgmAudio) {
      bgmAudio.pause()
    }
  }

  const playBackgroundMusic = () => {
    if (!isMusicEnabled.value) return
    
    if (!bgmAudio) {
      bgmAudio = new Audio('/audio/background.mp3')
      bgmAudio.loop = true
    }
    
    bgmAudio.play().catch(error => {
      console.error('Failed to play background music:', error)
    })
  }

  const playDrawSound = () => {
    if (!isMusicEnabled.value) return
    
    const drawSound = new Audio('/audio/draw.mp3')
    drawSound.play().catch(error => {
      console.error('Failed to play draw sound:', error)
    })
  }

  const playShakeSound = () => {
    if (!isMusicEnabled.value) return
    
    const shakeSound = new Audio('/audio/shake.mp3')
    shakeSound.play().catch(error => {
      console.error('Failed to play shake sound:', error)
    })
  }

  return {
    isMusicEnabled,
    setMusicEnabled,
    playBackgroundMusic,
    playDrawSound,
    playShakeSound
  }
}) 