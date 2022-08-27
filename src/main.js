import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import UI from '@/components/library'

// 重置样式库
import 'normalize.css'
import '@/assets/iconfont/iconfont.css'
// 自己的重置样式
import '@/assets/styles/common.less'

createApp(App).use(store).use(router).use(UI).mount('#app')
