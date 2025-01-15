<template>
  <div class="button-container">
    <div class="button-wrapper">
      <button 
        v-if="!drawnNumber" 
        class="lot-button draw-button"
        :disabled="isShaking"
        @click="$emit('start')"
      >
        开始抽签
      </button>
      <template v-else>
        <button 
          class="lot-button interpret-button"
          @click="$emit('interpret')"
        >
          解签
        </button>
        <button 
          class="lot-button reset-button"
          :disabled="isResetting"
          @click="$emit('reset')"
        >
          再抽一次
        </button>
      </template>
    </div>
  </div>
</template>

<script setup>
defineProps({
  drawnNumber: Number,
  isShaking: Boolean,
  isResetting: Boolean
})

defineEmits(['start', 'interpret', 'reset'])
</script>

<style scoped>
.button-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
}

.button-wrapper {
  display: flex;
  gap: 30px;
  justify-content: center;
}

.lot-button {
  min-width: 140px;
  padding: 15px 30px;
  border: none;
  border-radius: 25px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.3s, box-shadow 0.3s;
  background: linear-gradient(135deg, #8B4513, #A0522D);
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.lot-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, #A0522D, #8B4513);
}

.lot-button:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.lot-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style> 