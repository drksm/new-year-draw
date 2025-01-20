import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

// 创建 axios 实例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,  // 使用环境变量
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 响应拦截器
api.interceptors.response.use(
  response => response.data,
  error => Promise.reject(error)
)

export const drawLot = async () => {
  const authStore = useAuthStore()
  try {
    const response = await api.get('/tarot/draw/lots', {
      headers: {
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
    const controller = new AbortController()
    const signal = controller.signal

    const url = `${import.meta.env.VITE_API_BASE_URL}/aigc/stream/chat/`
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({
        messages: [
          {"role": "system", "content": "你是一位专业的解签师，请根据抽到的签文内容为用户解签"},
          {"role": "user", "content": lotContent}
        ]
      }),
      signal
    })
    .then(response => {
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired
          if (!authStore.handleTokenError()) {
            throw new Error('请稍后再试')
          }
        }
        throw new Error('网络请求失败')
      }
      
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      function readStream() {
        reader.read().then(({done, value}) => {
          if (done) {
            if (buffer) {
              onProgress(buffer)
            }
            resolve()
            return
          }

          buffer += decoder.decode(value, {stream: true})
          onProgress(buffer)
          readStream()
        }).catch(error => {
          reject(error)
        })
      }

      readStream()
    })
    .catch(error => {
      reject(error)
    })

    return controller
  })
} 