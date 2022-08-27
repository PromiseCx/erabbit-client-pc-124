<template>
  <!-- 顶部通栏 -->
  <AppNavBar />
  <!-- 头部组件 -->
  <AppHeader></AppHeader>
   <!-- 吸顶头部 -->
  <AppHeaderSticky></AppHeaderSticky>
  <!-- 内容 -->
  <!-- 二级路由 -->
  <div class="app-body">
    <RouterView></RouterView>
  </div>
  <!-- 底部组件 -->
  <AppFooter></AppFooter>
</template>

<script>
import AppNavBar from '@/components/app-navbar.vue'
import AppHeader from '@/components/app-header.vue'
import AppFooter from '@/components/app-footer.vue'
import AppHeaderSticky from '@/components/app-header-sticky.vue'
import { useStore } from 'vuex'

export default {
  name: 'lay-out',
  components: {
    AppNavBar,
    AppHeader,
    AppFooter,
    AppHeaderSticky
  },
  // 获取分类数据
  setup () {
    const store = useStore()
    store.dispatch('category/getList')
  }
}
</script>

<style scoped lang="less">
.app-body {
min-height: 600px;
}
</style>
