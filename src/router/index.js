import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  // 一级路由布局容器
  {
    path: '/',
    component: () => import('@/views/Layout'),
    children: [
      { path: '/', component: () => import('@/views/home') },
      { path: '/category/:id', component: () => import('@/views/category/index') },
      { path: '/category/sub/:id', component: () => import('@/views/category/sub') },
      { path: '/product/:id', component: () => import('@/views/goods/index') }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login')
  }
]

// vue2.0创建路由  new VueRouter({routes})
// vue3.0创建路由  createRouter({})
const router = createRouter({
  // mode:hash
  history: createWebHashHistory(),
  routes,
  scrollBehavior () {
    // 路由跳转时，跳转到页面的顶部
    // vue2.0 是通过 x，y，vue3.0是 left，top
    return { left: 0, top: 0 }
  }
})

export default router
