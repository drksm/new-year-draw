<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2>解签结果</h2>
        <button class="close-button" @click="$emit('close')">&times;</button>
      </div>
      <div class="modal-body">
        <div class="interpretation-content" ref="contentRef">
          {{ displayText }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  lot: {
    type: Object,
    required: true
  },
  interpretation: {
    type: String,
    default: ''
  }
})

const contentRef = ref(null)
const displayText = ref('')

// 监听解签内容变化
watch(() => props.interpretation, (newValue) => {
  if (newValue) {
    displayText.value = newValue
    // 如果内容更新，滚动到底部
    setTimeout(() => {
      if (contentRef.value) {
        contentRef.value.scrollTop = contentRef.value.scrollHeight
      }
    }, 0)
  }
}, { immediate: true })
</script>

<style scoped>
.modal-overlay {
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
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.modal-body {
  flex: 1;
  overflow: hidden;
}

.interpretation-content {
  max-height: 60vh;
  overflow-y: auto;
  padding: 10px;
  white-space: pre-wrap;
  line-height: 1.6;
  font-size: 1.1rem;
  color: #333;
}

@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    margin: 10px;
  }
  
  .interpretation-content {
    font-size: 1rem;
  }
}
</style>

<script>
export default {
  name: 'InterpretationModal',
  mounted() {
    try {
      window.clarity?.("set", "InterpretationModal", new Date().toISOString());
      console.log('Clarity PV tracked: InterpretationModal');
    } catch (error) {
      console.warn('Clarity PV tracking failed:', error);
    }
  },
}
</script> 