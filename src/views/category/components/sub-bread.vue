<template>
  <XtxBread>
    <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem :key="category.top.id" v-if="category.top" :to="`/category/${category.top.id}`">{{category.top.name}}</XtxBreadItem>
    <transition name="fade-right" mode="out-in">
        <XtxBreadItem :key="category.sub.id" v-if="category.sub">{{category.sub.name}}</XtxBreadItem>
    </transition>
  </XtxBread>
</template>

<script>
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
  name: 'SubBread',
  setup () {
    // 通过计算属性从vuex中拿到一二级类目
    const route = useRoute()
    const store = useStore()
    const category = computed(() => {
      const cate = {}
      store.state.category.list?.forEach(top => {
        if (top.children) {
          const sub = top.children?.find(sub => sub.id === route.params.id)
          if (sub) {
            cate.top = { id: top.id, name: top.name }
            cate.sub = { id: sub.id, name: sub.name }
          }
        }
      })

      return cate
    })

    return { category }
  }
}
</script>

<style>
</style>
