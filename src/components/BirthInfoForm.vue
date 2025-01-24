<template>
  <div class="birth-info-form">
    <h3>请选择您的八字信息</h3>
    <div class="form-group">
      <label>出生年</label>
      <select v-model="birthYear">
        <option v-for="year in years" :key="year" :value="year">{{ year }}年</option>
      </select>
    </div>
    <div class="form-group">
      <label>出生月</label>
      <select v-model="birthMonth">
        <option v-for="month in 12" :key="month" :value="month">{{ month }}月</option>
      </select>
    </div>
    <div class="form-group">
      <label>出生日</label>
      <select v-model="birthDay">
        <option v-for="day in days" :key="day" :value="day">{{ day }}日</option>
      </select>
    </div>
    <div class="form-group">
      <label>出生时辰</label>
      <select v-model="birthHour">
        <option v-for="(hour, index) in chineseHours" :key="index" :value="index">{{ hour }}</option>
      </select>
    </div>
    <div class="form-group">
      <label>性别</label>
      <select v-model="gender">
        <option value="male">男</option>
        <option value="female">女</option>
      </select>
    </div>
    <button class="submit-button" @click="handleSubmit" :disabled="!isFormValid">提交</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useBirthInfoStore } from '../stores/birthInfoStore'

const birthInfoStore = useBirthInfoStore()
const birthYear = ref('')
const birthMonth = ref('')
const birthDay = ref('')
const birthHour = ref('')
const gender = ref('')

// 生成年份选项（1950-2024）
const years = Array.from({ length: 75 }, (_, i) => 1950 + i)

// 根据年月计算天数
const days = computed(() => {
  if (!birthYear.value || !birthMonth.value) return Array.from({ length: 31 }, (_, i) => i + 1)
  
  const daysInMonth = new Date(birthYear.value, birthMonth.value, 0).getDate()
  return Array.from({ length: daysInMonth }, (_, i) => i + 1)
})

// 十二时辰
const chineseHours = [
  '子时 (23:00-1:00)',
  '丑时 (1:00-3:00)',
  '寅时 (3:00-5:00)',
  '卯时 (5:00-7:00)',
  '辰时 (7:00-9:00)',
  '巳时 (9:00-11:00)',
  '午时 (11:00-13:00)',
  '未时 (13:00-15:00)',
  '申时 (15:00-17:00)',
  '酉时 (17:00-19:00)',
  '戌时 (19:00-21:00)',
  '亥时 (21:00-23:00)'
]

// 表单验证
const isFormValid = computed(() => {
  return birthYear.value && 
         birthMonth.value && 
         birthDay.value && 
         birthHour.value !== '' && 
         gender.value
})

// 提交表单
const emit = defineEmits(['submit'])
const handleSubmit = () => {
  if (!isFormValid.value) return
  
  emit('submit', {
    year: birthYear.value,
    month: birthMonth.value,
    day: birthDay.value,
    hour: birthHour.value,
    gender: gender.value
  })
}

// 预填充缓存的数据
onMounted(() => {
  if (birthInfoStore.hasBirthInfo) {
    const info = birthInfoStore.birthInfo
    birthYear.value = info.year
    birthMonth.value = info.month
    birthDay.value = info.day
    birthHour.value = info.hour
    gender.value = info.gender
  }
})
</script>

<style scoped>
.birth-info-form {
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 90%;
  margin: 0 auto;
}

h3 {
  text-align: center;
  color: #8B4513;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  color: #333;
  background-color: white;
}

select:focus {
  outline: none;
  border-color: #8B4513;
}

.submit-button {
  width: 100%;
  padding: 0.8rem;
  background-color: #8B4513;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.3s;
}

.submit-button:hover:not(:disabled) {
  background-color: #704012;
}

.submit-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style> 