import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'
import { h } from 'vue'

const routes = [
  // 一级路由布局容器
  {
    path: '/',
    component: () => import('@/views/Layout'),
    children: [
      { path: '/', component: () => import('@/views/home') },
      { path: '/category/:id', component: () => import('@/views/category/index') },
      { path: '/category/sub/:id', component: () => import('@/views/category/sub') },
      { path: '/product/:id', component: () => import('@/views/goods/index') },
      { path: '/cart', component: () => import('@/views/cart/index') },
      { path: '/member/checkout', component: () => import('@/views/member/pay/checkout') },
      { path: '/member/pay', component: () => import('@/views/member/pay/index') },
      { path: '/pay/callback', component: () => import('@/views/member/pay/result.vue') },
      {
        path: '/member',
        component: () => import('@/views/member/Layout.vue'),
        children: [
          { path: '/member', component: () => import('@/views/member/home') },
          {
            path: '/member/order',
            component: { render: () => h(<RouterView />) },
            children: [
              // vue3.0要使用模糊胡匹配，必须形成一个嵌套关系
              { path: '', component: () => import('@/views/member/order/index.vue') },
              { path: ':id', component: () => import('@/views/member/order/detail.vue') }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login')
  },
  {
    path: '/login/callback',
    component: () => import('@/views/login/callback.vue')
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

// 前置导航守卫
router.beforeEach((to, from, next) => {
  // 需要登录的路由地址以 /member 开头
  const { profile } = store.state.user
  if (!profile.token && to.path.startsWith('/member')) {
    return next('/login?redirectUrl=' + encodeURIComponent(to.fullPath))
  }
  next()
})

export default router
