<template>
  <!-- 首页的入口 （分类，广告区） -->
  <div class="home-entry">
    <div class="container">
      <!-- 左侧分类 -->
      <HomeCategory />
      <!-- 轮播图 -->
      <HomeBanner />
    </div>
  </div>
  <!-- 新鲜好物 -->
  <HomeNew />
  <!-- 人气推荐 -->
  <HomeHot />
</template>

<script>
import HomeCategory from './components/home-category.vue'
import HomeBanner from './components/home-banner.vue'
import HomeNew from './components/home-new.vue'
import HomeHot from './components/home-hot.vue'

export default {
  name: 'HomePage',
  components: {
    HomeCategory,
    HomeBanner,
    HomeNew,
    HomeHot
  }
}
</script>

<style scoped lang="less">

/**
   translation组件实现动画，一个元素或组件的（显示|隐藏，创建|删除）
   将需要做动画的元素或组件放在transition组件中

             vue2类名               vue3类名
进入前       v-enter                v-enter-from
进入中               v-enter-active
进入后                v-enter-to

离开前       v-leave               v-leave-from
离开中               v-leave-active
离开后               v-leave-to

例如：元素淡入
可以将v改为transition设置的name属性

.v-enter-from {
opcity:0
}
.v-enter-active {
  transition: all 2s
}
.v-enter-to {
  opcity:1
}
*/
</style>
