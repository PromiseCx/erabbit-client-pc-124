<template>
  <div class="sub-category">
    <div class="container">
      <!-- 面包屑 -->
      <sub-bread></sub-bread>
      <!-- 筛选区 -->
      <sub-filter></sub-filter>
      <!-- 商品面板 -->
      <div class="goods-list">
        <SubSort />
      </div>
    </div>
  </div>
</template>

<script>
import SubBread from './components/sub-bread.vue'
import SubFilter from './components/sub-filter.vue'
import SubSort from './components/sub-sort.vue'

import { ref } from 'vue'

export default {
  name: 'SubCategory',
  components: {
    SubBread,
    SubFilter,
    SubSort
  },
  setup () {
    const isAllChecked = ref(true)
    return { isAllChecked }
  }
}
</script>

<style>

</style>
