import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// 检查 Clarity 是否正确初始化
console.log('Clarity initialization check:', {
  exists: typeof window.clarity !== 'undefined',
  timestamp: new Date().toISOString()
});

// 在开发环境下引入 mock
if (process.env.NODE_ENV === 'development') {
  import('./mock')
}

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 添加全局点击事件监听
document.addEventListener('click', (event) => {
  if (typeof window.clarity === 'undefined') {
    console.warn('Clarity is not initialized');
    return;
  }

  try {
    // 获取点击元素的有用信息
    const element = event.target;
    const tagName = element.tagName.toLowerCase();
    const className = element.className;
    const id = element.id;
    const text = element.textContent?.trim().substring(0, 50) || '';

    // 构建点击事件的描述
    const clickDescription = [
      tagName,
      className && `class:${className}`,
      id && `id:${id}`,
      text && `text:${text}`
    ].filter(Boolean).join('|');

    const timestamp = new Date().toISOString();
    // 上报点击事件
    window.clarity?.("set", "click_event", clickDescription);
    console.log(`Clarity click tracked [${timestamp}]:`, clickDescription);
  } catch (error) {
    console.warn('Clarity click tracking failed:', error);
  }
});

app.mount('#app') 