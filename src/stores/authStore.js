import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login } from '../api/authService'

export const useAuthStore = defineStore('auth', () => {
  const token = ref('')
  const refreshToken = ref('')
  const isFirstLogin = ref(true)
  let refreshTimer = null

  const setToken = (accessToken, newRefreshToken = null) => {
    console.log('Setting new access token:', accessToken)
    token.value = accessToken
    if (newRefreshToken) {
      console.log('Setting new refresh token:', newRefreshToken)
      refreshToken.value = newRefreshToken
    }
  }

  const refreshAccessToken = async () => {
    try {
      const response = await login()
      if (response.code === 0 && response.data?.token) {
        setToken(response.data.token, response.data.refreshToken)
        return true
      }
      return false
    } catch (error) {
      console.error('Token refresh failed:', error)
      return false
    }
  }

  const startAutoRefresh = () => {
    // Clear any existing timer
    if (refreshTimer) {
      clearInterval(refreshTimer)
    }
    
    // Set up new timer to refresh every 8 minutes (token usually expires in 10 minutes)
    refreshTimer = setInterval(async () => {
      const success = await refreshAccessToken()
      if (!success) {
        stopAutoRefresh()
      }
    }, 8 * 60 * 1000)
  }

  const stopAutoRefresh = () => {
    if (refreshTimer) {
      clearInterval(refreshTimer)
      refreshTimer = null
    }
  }

  const handleTokenError = () => {
    if (isFirstLogin.value) {
      isFirstLogin.value = false
      return true // Let the first error pass through
    }
    
    // Try to refresh token first
    refreshAccessToken().then(success => {
      if (!success) {
        alert('网络错误，请稍后再试')
      }
    })
    
    return false
  }

  return {
    token,
    refreshToken,
    setToken,
    refreshAccessToken,
    startAutoRefresh,
    stopAutoRefresh,
    handleTokenError,
    isFirstLogin
  }
}) 