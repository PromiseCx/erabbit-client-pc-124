import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  // 一级路由布局容器
  {
    path: '/',
    component: () => import('@/views/Layout'),
    children: [
      { path: '/', component: () => import('@/views/home') },
      { path: '/category/:id', component: () => import('@/views/category/index') },
      { path: '/category/sub/:id', component: () => import('@/views/category/sub') }
    ]
  }
]

// vue2.0创建路由  new VueRouter({routes})
// vue3.0创建路由  createRouter({})
const router = createRouter({
  // mode:hash
  history: createWebHashHistory(),
  routes
})

export default router
