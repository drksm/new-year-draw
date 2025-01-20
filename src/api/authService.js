import axios from 'axios'

// 创建 axios 实例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,  // 使用环境变量
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 响应拦截器
api.interceptors.response.use(
  response => response.data,
  error => {
    console.error('API Error:', error.response || error)
    return Promise.reject(error)
  }
)

export const login = async () => {
  try {
    const response = await api.post('/token/', {
      username: 'tarot',
      password: 'PnTJQgX150&jQ69A'
    })
    
    // 检查响应中是否包含 access token
    if (response && response.access) {
      return {
        code: 0,
        message: 'success',
        data: {
          token: response.access,
          refreshToken: response.refresh
        }
      }
    }
    
    throw new Error('Invalid token response')
  } catch (error) {
    console.error('Login request failed:', error)
    throw error
  }
} 