import { createRouter, createWebHistory } from 'vue-router'
import { useMusicStore } from '../stores/musicStore'
import GuidanceView from '../views/GuidanceView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'loading',
      component: () => import('../components/LoadingScreen.vue')
    },
    {
      path: '/draw',
      name: 'draw',
      component: () => import('../views/DrawLotView.vue')
    },
    {
      path: '/guidance',
      name: 'guidance',
      component: GuidanceView
    }
  ]
})

router.beforeEach((to, from, next) => {
  const store = useMusicStore()
  
  // 如果是刷新页面或直接访问非根路径，重定向到加载页面
  if (!from.name && to.path !== '/') {
    next('/')
    return
  }
  
  // 只在进入抽签页面时播放背景音乐
  if (to.name === 'draw' && store.isMusicEnabled) {
    store.playBackgroundMusic()
  }
  
  next()
})

export default router 