import axios from 'axios'

// 创建 axios 实例
const api = axios.create({
  baseURL: '/',
  timeout: 5000
})

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

// 添加解签接口
export const interpretLot = async (lotId) => {
  try {
    const response = await api.get(`/api/lot/interpret/${lotId}`)
    if (response.code === 200) {
      return response.data
    } else {
      throw new Error(response.message || '解签失败')
    }
  } catch (error) {
    throw new Error('网络请求失败')
  }
} 