import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLotStore = defineStore('lot', () => {
  // 当前选中的签
  const currentLot = ref(null)
  // 抽签历史记录
  const lotHistory = ref([])
  
  // 设置当前签
  const setCurrentLot = (lot) => {
    currentLot.value = lot
    // 将新抽的签添加到历史记录中
    if (lot) {
      lotHistory.value.push({
        ...lot,
        drawTime: new Date().toISOString()
      })
    }
  }
  
  // 清除当前签
  const clearCurrentLot = () => {
    currentLot.value = null
  }
  
  // 获取历史记录
  const getLotHistory = () => {
    return lotHistory.value
  }
  
  return {
    currentLot,
    lotHistory,
    setCurrentLot,
    clearCurrentLot,
    getLotHistory
  }
}) 