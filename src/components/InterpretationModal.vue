<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2>解签结果</h2>
        <button class="close-button" @click="$emit('close')">&times;</button>
      </div>
      <div class="modal-body">
        <div class="lot-content">
          <h3>签文内容：</h3>
          <p>{{ lot.content }}</p>
        </div>
        <div class="interpretation">
          <h3>解签：</h3>
          <p class="interpretation-text" v-html="formattedInterpretation"></p>
          <div v-if="isTyping && !isFromCache" class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

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

const displayText = ref('')
const isTyping = ref(true)
const isFromCache = ref(false)
const typeDelay = 30 // 打字速度
let typingQueue = Promise.resolve()

const formattedInterpretation = computed(() => {
  return displayText.value.replace(/\n/g, '<br>')
})

const typeCharacter = async (char) => {
  await new Promise(resolve => setTimeout(resolve, typeDelay))
  displayText.value += char
}

watch(() => props.interpretation, async (newText, oldText) => {
  if (!newText) {
    displayText.value = ''
    isTyping.value = true
    isFromCache.value = false
    return
  }

  // 检查是否是从缓存加载
  if (oldText !== null && oldText.length > 0) {
    isFromCache.value = true
    displayText.value = newText
    isTyping.value = false
    return
  }

  // 获取新增的文本
  const newContent = newText.slice(displayText.value.length)
  
  // 将新字符加入打字队列
  for (let char of newContent) {
    typingQueue = typingQueue.then(() => typeCharacter(char))
  }

  // 如果是完整的响应，标记打字完成
  if (newText.endsWith('。') || newText.endsWith('！') || newText.endsWith('？')) {
    typingQueue.then(() => {
      isTyping.value = false
    })
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
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.lot-content, .interpretation {
  margin-bottom: 20px;
}

h3 {
  color: #8B4513;
  margin-bottom: 10px;
}

.interpretation-text {
  line-height: 1.6;
  white-space: pre-wrap;
  min-height: 100px;
}

.typing-indicator {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
}

.typing-indicator span {
  width: 4px;
  height: 4px;
  background: #8B4513;
  border-radius: 50%;
  animation: typing 1s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}
</style> 