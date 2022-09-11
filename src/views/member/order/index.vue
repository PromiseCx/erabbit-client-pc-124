<template>
  <div class="member-order">
    <XtxTabs v-model="activeName">
      <XtxTabsPanel v-for="item in orderStatus" :key="item.name" :label="item.label" :name="item.name">{{item.label}}</XtxTabsPanel>
    </XtxTabs>
      <div class="order-list">
        <OrderItem v-for="item in orderList" :key="item.id" :order="item"/>
    </div>
    <!-- 分页组件 -->
  <XtxPagination />
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
import { orderStatus } from '@/api/constants'
import OrderItem from './components/order-item.vue'
import { findOrderList } from '@/api/order'

export default {
  name: 'MemberOrder',
  components: { OrderItem },
  setup () {
    const activeName = ref('all')
    const orderList = ref([])
    const reqParams = reactive({
      page: 1,
      pageSize: 10,
      orderStatus: 0
    })
    findOrderList(reqParams).then(data => {
      orderList.value = data.result.items
    })
    return { activeName, orderStatus, orderList }
  }
}
</script>

<style scoped lang="less">
.member-order {
  height: 100%;
  background-color: #fff;
}
.order-list {
  background: #fff;
  padding: 20px;
}

</style>
