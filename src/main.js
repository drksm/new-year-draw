import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// 在开发环境下引入 mock
if (process.env.NODE_ENV === 'development') {
  import('./mock')
}

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app') 