<template>
  <div class="member-order-detail" v-if="order">
    <!-- 头部 -->
    <DetailAction :order="order"/>
    <!-- 进度 -->
    <DetailStep :order="order" />
    <!-- 物流  -->
    <!-- 订单信息 -->
  </div>
</template>

<script>
import { ref } from 'vue'
import DetailAction from './components/detail-action.vue'
import { findOrderDetail } from '@/api/order'
import { useRoute } from 'vue-router'
import DetailStep from './components/detail-step.vue'

export default {
  name: 'MemberDetail',
  components: { DetailAction, DetailStep },
  setup () {
    const order = ref(null)
    const route = useRoute()
    findOrderDetail(route.params.id).then(data => {
      order.value = data.result
    })
    return { order }
  }
}
</script>

<style scoped lang="less">
.member-order-detail {
  background-color: #fff;
}
</style>
