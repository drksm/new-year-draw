import { defineStore } from 'pinia'

export const useBirthInfoStore = defineStore('birthInfo', {
  state: () => ({
    birthInfo: {
      year: null,
      month: null,
      day: null,
      hour: null,
      gender: null
    }
  }),
  
  actions: {
    setBirthInfo(info) {
      this.birthInfo = {
        year: info.year,
        month: info.month,
        day: info.day,
        hour: info.hour,
        gender: info.gender
      }
      // 保存到 localStorage
      localStorage.setItem('birthInfo', JSON.stringify(this.birthInfo))
    },
    
    loadBirthInfo() {
      const savedInfo = localStorage.getItem('birthInfo')
      if (savedInfo) {
        this.birthInfo = JSON.parse(savedInfo)
      }
    },
    
    clearBirthInfo() {
      this.birthInfo = {
        year: null,
        month: null,
        day: null,
        hour: null,
        gender: null
      }
      localStorage.removeItem('birthInfo')
    }
  },
  
  getters: {
    hasBirthInfo: (state) => {
      return state.birthInfo.year !== null &&
             state.birthInfo.month !== null &&
             state.birthInfo.day !== null &&
             state.birthInfo.hour !== null &&
             state.birthInfo.gender !== null
    },
    
    // 获取中文时辰
    chineseHour: (state) => {
      if (state.birthInfo.hour === null) return ''
      
      const hours = [
        '子时', '丑时', '寅时', '卯时', '辰时', '巳时',
        '午时', '未时', '申时', '酉时', '戌时', '亥时'
      ]
      return hours[state.birthInfo.hour]
    },
    
    // 格式化的生辰八字信息
    formattedBirthInfo: (state) => {
      if (!state.birthInfo.year) return ''
      
      return `${state.birthInfo.year}年${state.birthInfo.month}月${state.birthInfo.day}日 ${state.chineseHour} ${state.birthInfo.gender === 'male' ? '男' : '女'}`
    }
  }
}) 