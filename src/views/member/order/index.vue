<template>
  <div class="member-order">
    <XtxTabs v-model="activeName" @tab-click="tabClick">
      <XtxTabsPanel v-for="item in orderStatus" :key="item.name" :label="item.label" :name="item.name">{{item.label}}</XtxTabsPanel>
    </XtxTabs>
     <div class="order-list">
      <div v-if="loading" class="loading"></div>
      <div class="none" v-if="!loading && orderList.length === 0">暂无数据</div>
      <OrderItem @on-logistics="handlerLogistics"  @on-confirm="handlerConfirm" @on-delete="handlerDelete" @on-cancel="handlerCancel" v-for="item in orderList" :key="item.id" :order="item" />
    </div>
    <!-- 分页组件 -->
    <XtxPagination v-if="total>0" @current-change="reqParams.page=$event" :current-page="reqParams.page" :page-size="reqParams.pageSize" :total="total" />
    <!-- 取消原因 -->
    <OrderCancel ref="orderCancelCom" />
    <!-- 查看物流 -->
    <OrderLogistics ref="orderLogisticsCom" />
  </div>
</template>

<script>
import { reactive, ref, watch } from 'vue'
import { orderStatus } from '@/api/constants'
import OrderItem from './components/order-item.vue'
import { confirmOrder, deleteOrder, findOrderList } from '@/api/order'
import OrderCancel from './components/order-cancel.vue'
import Message from '@/components/library/Message'
import Confirm from '@/components/library/confirm'
import OrderLogistics from './components/order-logistics.vue'

export default {
  name: 'MemberOrder',
  components: { OrderItem, OrderCancel, OrderLogistics },
  setup () {
    const activeName = ref('all')
    const orderList = ref([])
    const reqParams = reactive({
      page: 1,
      pageSize: 5,
      orderState: 0
    })
    const loading = ref(false)
    const total = ref(0)

    const getOrderList = () => {
      loading.value = true
      findOrderList(reqParams).then(data => {
        orderList.value = data.result.items
        total.value = data.result.counts
        loading.value = false
      })
    }

    watch(reqParams, () => {
      getOrderList()
    }, { immediate: true })

    const tabClick = ({ index }) => {
      reqParams.page = 1
      reqParams.orderState = index
    }

    const handlerDelete = (order) => {
      Confirm({ text: '亲，您确认删除该订单吗？' }).then(() => {
        deleteOrder(order.id).then(() => {
          Message({ type: 'success', text: '删除订单成功！' })
          getOrderList()
        })
      }).catch(() => {})
    }

    return { activeName, orderStatus, orderList, tabClick, loading, total, reqParams, ...useCancel(), handlerDelete, ...useConfirm(), ...useLogistics() }
  }
}

// cancel order
const useCancel = () => {
  const orderCancelCom = ref(null)
  const handlerCancel = (order) => {
    orderCancelCom.value.open(order)
  }
  return { handlerCancel, orderCancelCom }
}

// confirm order
const useConfirm = () => {
  const handlerConfirm = (order) => {
    Confirm({ text: '您确认收到货吗？确认后货款将会打给卖家。' }).then(() => {
      confirmOrder(order.id).then(() => {
        Message({ text: '确认收货成功', type: 'success' })
        order.orderState = 4
      })
    }).catch(() => {})
  }
  return { handlerConfirm }
}

// logistics order
const useLogistics = () => {
  const orderLogisticsCom = ref(null)
  const handlerLogistics = (order) => {
    orderLogisticsCom.value.open(order)
  }
  return { handlerLogistics, orderLogisticsCom }
}

</script>

<style scoped lang="less">
.member-order {
  height: 100%;
  background-color: #fff;
}
.order-list {
  padding: 20px;
  position: relative;
  min-height: 400px;
}
.loading {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255,255,255,.9) url(../../../assets/images/loading.gif) no-repeat center;
}
.none {
  height: 400px;
  text-align: center;
  line-height: 400px;
  color: #999;
}

</style>
