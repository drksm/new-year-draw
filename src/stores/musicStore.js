import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMusicStore = defineStore('music', () => {
  const bgMusic = ref(null)
  const isPlaying = ref(false)
  const showMusicControl = ref(true)

  const setAudioElement = (element) => {
    bgMusic.value = element
    bgMusic.value.volume = 0.3
  }

  const playMusic = async () => {
    if (bgMusic.value) {
      try {
        await bgMusic.value.load()
        const playPromise = bgMusic.value.play()
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              isPlaying.value = true
            })
            .catch(error => {
              console.log('Auto-play was prevented:', error)
              isPlaying.value = false
            })
        }
      } catch (error) {
        console.log('Error playing audio:', error)
        isPlaying.value = false
      }
    }
  }

  const toggleMusic = () => {
    if (bgMusic.value) {
      if (isPlaying.value) {
        bgMusic.value.pause()
        isPlaying.value = false
      } else {
        playMusic()
      }
    }
  }

  const setShowMusicControl = (show) => {
    showMusicControl.value = show
  }

  return {
    bgMusic,
    isPlaying,
    showMusicControl,
    setAudioElement,
    playMusic,
    toggleMusic,
    setShowMusicControl
  }
}) 