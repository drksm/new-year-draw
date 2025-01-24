import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

// 创建 axios 实例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,  // 使用环境变量
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// 响应拦截器
api.interceptors.response.use(
  response => response.data,
  error => {
    console.error('API Error:', error.response || error)
    if (error.response) {
      console.error('Error Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      })
    }
    return Promise.reject(error)
  }
)

export const drawLot = async () => {
  const authStore = useAuthStore()
  try {
    console.log('Drawing lot with token:', authStore.token)
    console.log('Request URL:', import.meta.env.VITE_API_BASE_URL + '/tarot/draw/lots/')
    const response = await api.get('/tarot/draw/lots/', {  // 添加末尾斜杠
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      validateStatus: function (status) {
        return status < 500  // 不要自动拒绝 500 错误
      }
    })
    console.log('Draw lot response:', response)
    return response
  } catch (error) {
    console.error('Draw lot error:', error)
    console.error('Request config:', error.config)
    if (error.response) {
      console.error('Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      })
    }
    if (error.response?.status === 401) {
      // Token expired
      if (!authStore.handleTokenError()) {
        throw new Error('请稍后再试')
      }
    } else if (error.response?.status === 500) {
      console.error('Server error details:', error.response.data)
      throw new Error('服务器错误，请稍后再试')
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
        'Accept': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({
        messages: [
          {"role": "system", "content": "你是一位专业的解签师，请根据抽到的签文内容为用户解签，我需要你根据用户的八字和参考信息来分析，但是不要直接转述参考内容，需要用口语口气来回答"},
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