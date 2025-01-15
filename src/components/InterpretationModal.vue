<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2>解签详解</h2>
        <button class="close-button" @click="$emit('close')">×</button>
      </div>
      <div class="modal-body">
        <div class="section">
          <h3>总述</h3>
          <p>{{ interpretation.overview }}</p>
        </div>
        <div class="section">
          <h3>运势</h3>
          <pre>{{ interpretation.fortune }}</pre>
        </div>
        <div class="section">
          <h3>建议</h3>
          <p>{{ interpretation.advice }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  interpretation: {
    type: Object,
    required: true
  }
})

defineEmits(['close'])
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
  background: #FFF5EE;
  border-radius: 15px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #8B4513;
}

.modal-header h2 {
  color: #8B4513;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  color: #8B4513;
  cursor: pointer;
}

.section {
  margin-bottom: 20px;
}

.section h3 {
  color: #8B4513;
  margin-bottom: 10px;
}

.section p, .section pre {
  color: #5C4033;
  line-height: 1.6;
  white-space: pre-wrap;
  margin: 0;
}
</style> 