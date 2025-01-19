<template>
  <div v-if="show" class="audio-confirm-modal">
    <div class="modal-content">
      <h2>音效设置</h2>
      <p>是否允许播放背景音乐和音效？</p>
      <div class="button-group">
        <button @click="handleConfirm(true)" class="confirm-button">允许</button>
        <button @click="handleConfirm(false)" class="cancel-button">不允许</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMusicStore } from '../stores/musicStore'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['confirm'])
const musicStore = useMusicStore()

const handleConfirm = (allowed) => {
  musicStore.setMusicEnabled(allowed)
  if (allowed) {
    musicStore.playBackgroundMusic()
  }
  emit('confirm', allowed)
}
</script>

<style scoped>
.audio-confirm-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  max-width: 90%;
  width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

h2 {
  color: #8B4513;
  margin: 0 0 20px 0;
  font-size: 1.5rem;
}

p {
  color: #666;
  margin: 0 0 25px 0;
  font-size: 1.1rem;
  line-height: 1.5;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 20px;
}

button {
  padding: 12px 30px;
  border-radius: 25px;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.confirm-button {
  background: #8B4513;
  color: white;
}

.cancel-button {
  background: #f0f0f0;
  color: #666;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

button:active {
  transform: translateY(0);
}
</style> 