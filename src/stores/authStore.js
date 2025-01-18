import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('auth_token') || '')

  const setToken = (newToken) => {
    console.log('Setting new token:', newToken)
    token.value = newToken
    if (newToken) {
      localStorage.setItem('auth_token', newToken)
    } else {
      localStorage.removeItem('auth_token')
    }
    console.log('Token after set:', token.value)
  }

  const clearToken = () => {
    token.value = ''
    localStorage.removeItem('auth_token')
  }

  return {
    token,
    setToken,
    clearToken
  }
}) 