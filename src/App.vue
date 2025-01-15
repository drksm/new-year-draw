<template>
  <div class="app-container">
    <!-- 音频播放器 -->
    <audio 
      ref="bgMusic" 
      loop 
      preload="auto"
      src="/audio/background.mp3"
    ></audio>

    <!-- 音乐控制按钮 -->
    <LoadingClock v-if="store.showMusicControl" />

    <!-- 路由视图 -->
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useMusicStore } from '@/stores/musicStore'
import LoadingClock from '@/components/LoadingClock.vue'

const bgMusic = ref(null)
const store = useMusicStore()

onMounted(() => {
  nextTick(() => {
    store.setAudioElement(bgMusic.value)
    store.playMusic()
  })
})
</script>

<style>
body {
  margin: 0;
  padding: 0;
  background: #FFE4B5;
}

.app-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 