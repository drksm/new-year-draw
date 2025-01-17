import axios from 'axios'

// 创建 axios 实例
const api = axios.create({
  baseURL: '/',
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
    const response = await api.post('/api/token/', {
      username: 'tarot',
      password: 'PnTJQgX150&jQ69A'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    console.log('Login response:', response)
    
    if (response && response.access) {
      return response.access
    } else {
      console.error('Invalid response format:', response)
      throw new Error('登录失败：无效的响应格式')
    }
  } catch (error) {
    console.error('Login error details:', error.response || error)
    throw new Error(error.response?.data?.message || '网络请求失败')
  }
} 