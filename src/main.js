/**
 * 指定组件显示的内容：new Vue({选项})
     el 选项，通过一个选择器找到容器，容器内容就是组件内容
     template 选项，<div>组件内容</div> 作为组件内容
     render选项，它是一个函数，函数回默认传人createElement的函数（h），
     这个函数用来创建结构，再render函数返回渲染为组件内容。它的优先级更高。

 * import App from './App.vue'
    new Vue({
        render:h=>h(App)
    }).mount('#app')
     h() =====>  createElement()
     h(App) =====>  根据APP组件创建html结构
     render的返回值就是html结构，渲染到#app容器
     h() 函数参数，1.节点名称  2. 属性|数据 是对象  3. 子节点
 */

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

// 模拟mock.js
import '@/mock'

createApp(App).use(store).use(router).use(UI).mount('#app')
