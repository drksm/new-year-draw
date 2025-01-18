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

export const interpretLot = async (content, onProgress) => {
  return new Promise((resolve, reject) => {
    const authStore = useAuthStore()
    const xhr = new XMLHttpRequest()
    
    xhr.open('POST', '/api/aigc/stream/chat/')
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.setRequestHeader('Authorization', `Bearer ${authStore.token}`)
    
    xhr.onprogress = (event) => {
      const newText = event.target.responseText
      if (newText) {
        onProgress(newText)
      }
    }
    
    xhr.onerror = () => {
      reject(new Error('解签失败：网络请求失败'))
    }
    
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.responseText)
      } else {
        reject(new Error('解签失败：' + xhr.statusText))
      }
    }
    
    const data = {
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
    
    xhr.send(JSON.stringify(data))
  })
} 