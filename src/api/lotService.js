import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

// 创建 axios 实例
const api = axios.create({
  baseURL: '/',
  timeout: 30000
})

// 响应拦截器
api.interceptors.response.use(
  response => response.data,
  error => Promise.reject(error)
)

export const drawLot = async () => {
  const authStore = useAuthStore()
  try {
    const response = await api.get('/api/tarot/draw/lots', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    return response
  } catch (error) {
    console.error('Draw lot error:', error)
    if (error.response?.status === 401) {
      // Token expired
      if (!authStore.handleTokenError()) {
        throw new Error('请稍后再试')
      }
    }
    throw error
  }
}

export const interpretLot = (lotContent, onProgress) => {
  const authStore = useAuthStore()
  
  return new Promise((resolve, reject) => {
    // 创建 Web Worker
    const worker = new Worker('/src/workers/interpretWorker.js')
    
    worker.onmessage = (event) => {
      const { type, data } = event.data
      if (type === 'progress') {
        onProgress && onProgress(data)
      } else if (type === 'error') {
        reject(new Error(data))
      }
    }
    
    worker.onerror = (error) => {
      reject(new Error('Worker error: ' + error.message))
    }
    
    // 发送数据到 Worker
    worker.postMessage({
      url: '/api/aigc/stream/chat/',
      token: authStore.token,
      data: {
        system: "你是一位专业的解签师，请根据抽到的签文内容为用户解签",
        content: lotContent
      }
    })
  })
} 