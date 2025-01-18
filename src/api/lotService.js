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
  try {
    const authStore = useAuthStore()
    const response = await api.get('/api/tarot/draw/lots', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    return response
  } catch (error) {
    console.error('Failed to draw lot:', error)
    throw new Error('抽签失败：' + (error.response?.data?.message || '网络请求失败'))
  }
}

export const interpretLot = (content, onProgress) => {
  const authStore = useAuthStore()
  
  // 创建一个新的 Worker 来处理 XHR 请求
  const worker = new Worker(new URL('../workers/interpretWorker.js', import.meta.url))
  
  worker.onmessage = (event) => {
    const { type, data } = event.data
    if (type === 'progress') {
      onProgress(data)
    } else if (type === 'error') {
      console.error('解签请求失败:', data)
      onProgress('解签失败：' + data)
    }
  }

  // 发送请求数据到 Worker
  worker.postMessage({
    url: '/api/aigc/stream/chat/',
    token: authStore.token,
    data: {
      messages: [
        {
          role: "system",
          content: "你是一位专业的解签师，擅长解读签文并给出详细的解释。请根据用户提供的签文内容，从多个角度进行分析，并给出具体的建议。"
        },
        {
          role: "user",
          content: content
        }
      ]
    }
  })

  // 返回控制对象
  return {
    abort: () => {
      worker.terminate()
      onProgress('解签已取消')
    }
  }
} 