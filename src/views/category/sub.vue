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
         <ul>
          <li v-for="goods in goodsList" :key="goods.id" >
            <GoodsItem :goods="goods" />
          </li>
        </ul>
        <!-- 无限加载组件 -->
        <XtxInfiniteLoading :loading="loading" :finished="finished" @infinite="getData"/>
      </div>
    </div>
  </div>
</template>

<script>
import SubBread from './components/sub-bread.vue'
import SubFilter from './components/sub-filter.vue'
import SubSort from './components/sub-sort.vue'
import GoodsItem from './components/good-item.vue'
import { findSubCategoryGoods } from '@/api/category'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'SubCategory',
  components: {
    SubBread,
    SubFilter,
    SubSort,
    GoodsItem
  },
  setup () {
    const route = useRoute()
    const loading = ref(false)
    const finished = ref(false)
    const goodsList = ref([])
    let reqParams = {
      page: 1,
      pageSize: 20
    }
    const getData = () => {
      loading.value = true
      reqParams.categoryId = route.params.id
      findSubCategoryGoods(reqParams).then(({ result }) => {
        if (result.items.length) {
          goodsList.value?.push(...result.items)
          reqParams.page++
        } else {
          // 没有数据，加载完成
          finished.value = true
        }
        loading.value = false
      })
    }

    // 更改了二级路由之后，要重新加载数据
    watch(() => route.params.id, (newVal) => {
      if (newVal && route.path === `/category/sub/${newVal}`) {
        finished.value = false
        goodsList.value = []
        reqParams = {
          page: 1,
          pageSize: 20
        }
      }
    })

    return { getData, loading, finished, goodsList }
  }
}
</script>

<style scoped lang='less'>
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    li {
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
