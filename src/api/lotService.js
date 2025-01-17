import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

// 创建 axios 实例
const api = axios.create({
  baseURL: '/',
  timeout: 5000
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => response.data,
  error => Promise.reject(error)
)

export const drawLot = async () => {
  try {
    const response = await api.post('/api/lot/draw')
    if (response.code === 200) {
      return response.data
    } else {
      throw new Error(response.message || '抽签失败')
    }
  } catch (error) {
    throw new Error('网络请求失败')
  }
}

// 修改解签接口
export const interpretLot = async (lotContent, onProgress) => {
  try {
    const response = await api.post('/api/aigc/stream/chat/', {
      messages: [
        { role: "system", content: "你是一个ai道士，现在请解签" },
        { role: "user", content: lotContent }
      ]
    }, {
      responseType: 'text',
      onDownloadProgress: (progressEvent) => {
        console.log('Progress event:', progressEvent)
        const text = progressEvent.event?.target?.responseText
        if (text) {
          onProgress(text)
        }
      }
    })
    
    if (response) {
      onProgress(response)
    }
    return response
  } catch (error) {
    console.error('Interpretation error details:', error)
    if (error.response?.status === 401) {
      throw new Error('登录已过期，请重新登录')
    }
    throw new Error(error.response?.data?.message || error.message || '解签请求失败')
  }
} 