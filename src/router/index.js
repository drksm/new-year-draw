import { createRouter, createWebHistory } from 'vue-router'
import LoadingScreen from '@/components/LoadingScreen.vue'
import DrawLotView from '@/views/DrawLotView.vue'
import { useMusicStore } from '@/stores/musicStore'

const routes = [
  {
    path: '/',
    name: 'loading',
    component: LoadingScreen
  },
  {
    path: '/draw',
    name: 'draw',
    component: DrawLotView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 简化路由守卫逻辑
router.beforeEach((to, from, next) => {
  const store = useMusicStore()
  // 音乐控制按钮始终显示
  store.setShowMusicControl(true)
  
  // 如果是刷新页面或直接访问非根路径
  if (!from.name && to.path !== '/') {
    next('/')
  } else {
    next()
  }
})

export default router 