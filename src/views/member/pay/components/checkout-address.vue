<template>
  <div class="checkout-address">
     <div class="text">
      <div v-if="!showAddress" class="none">您需要先添加收货地址才可提交订单。</div>
      <ul v-if="showAddress">
        <li><span>收<i/>货<i/>人：</span>{{showAddress.receiver}}</li>
        <li><span>联系方式：</span>{{showAddress.contact.replace(/^(\d{3})(\d{4})(\d{4})/,'$1****$2')}}</li>
        <li><span>收货地址：</span>{{showAddress.fullLocation.replace(/ /g,'')+showAddress.address}}</li>
      </ul>
      <a v-if="showAddress" href="javascript:;" @click="openAddressEdit(showAddress)">修改地址</a>
    </div>
    <div class="action">
      <XtxButton class="btn" @click="openDailog">切换地址</XtxButton>
      <XtxButton class="btn" @click="openAddressEdit({})">添加地址</XtxButton>
    </div>
  </div>
  <XtxDialog title="切换收货地址" v-model:visible="visibleDialog">
     <div @click="selectedAddress=item" :class="{active:selectedAddress&&selectedAddress.id===item.id}" class="text item" v-for="item in list" :key="item.id">
        <ul>
          <li><span>收<i/>货<i/>人：</span>{{item.receiver}}</li>
          <li><span>联系方式：</span>{{item.contact}}</li>
          <li><span>收货地址：</span>{{item.fullLocation.replace(/ /g,'')+item.address}}</li>
        </ul>
      </div>
    <template v-slot:footer>
        <XtxButton @click="visibleDialog=false" type="gray" style="margin-right:20px">取消</XtxButton>
        <XtxButton @click="confirmAddressFn" type="primary">确认</XtxButton>
    </template>
  </XtxDialog>
  <!-- 编辑组件 -->
  <AddressEdit @on-success="successHandler" ref="addressEditCom" />
</template>

<script>
import { ref } from 'vue'
import AddressEdit from './address-edit.vue'

export default {
  name: 'CheckoutAddress',
  components: { AddressEdit },
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  /**
   * 在有根元素的组件中，触发自定义事件，有没有emits无所谓，
   * 如果组件是一个代码片段，触发自定义事件需要，emits选项中，表明你的自定义事件
   */
  emits: ['change'],
  setup (props, { emit }) {
    // 1.找到默认的收获地址
    // 2. 没有默认的地址，使用第一条地址
    // 3. 如果没有数据，显示请添加一条收货地址
    const showAddress = ref(null)
    const defaultAddress = props.list.find(item => item.isDefault === 0)
    if (defaultAddress) {
      showAddress.value = defaultAddress
    } else {
      if (props.list.length) {
        /**
         * 这里报错的原因是：
         * props属性一般只读不写，想用的话，这里建议我们写成计算属性，
         * props  eslint不让我们赋给响应式数据，因为响应式数据改变了，props数据也改变
         * 但是，props数据是可以改变的，这里加一句注释，忽略eslint检测
         */
        // eslint-disable-next-line vue/no-setup-props-destructure
        showAddress.value = props.list[0]
      }
    }

    // 默认通知父组件一个收货id
    emit('change', showAddress.value && showAddress.value.id)

    //  切换地址对话框显示和隐藏
    const visibleDialog = ref(false)
    // 记录当前已选中的地址
    const selectedAddress = ref(null)

    // 点击确认
    const confirmAddressFn = () => {
      // 显示的地址切换为选中的地址
      showAddress.value = selectedAddress.value
      // 把选中的地址id通知结算组件
      emit('change', selectedAddress.value?.id)
      visibleDialog.value = false
    }

    const openDailog = () => {
      selectedAddress.value = null
      visibleDialog.value = true
    }

    const addressEditCom = ref(null)
    const openAddressEdit = (address) => {
      addressEditCom.value.open(address)
    }

    const successHandler = (formData) => {
      // 根据formData中的id和当前的地址列表中查找，有就是修改，否则是添加
      const address = props.list.find(item => item.id === formData.id)
      if (address) {
        // 修改
        for (const key in address) {
          address[key] = formData[key]
        }
      } else {
        // 添加
        // 如果是添加，就往list前面追加一条数据
      // 修改formData的时候，数组中的数据也会修改，因为是同一个引用地址
      // 打开对话框之前需要清空之前的输入信息
        const jsonStr = JSON.stringify(formData)
        // eslint-disable-next-line vue/no-mutating-props
        props.list.unshift(JSON.parse(jsonStr))
      }
    }

    return { showAddress, visibleDialog, selectedAddress, confirmAddressFn, openDailog, openAddressEdit, addressEditCom, successHandler }
  }
}
</script>

<style scoped lang="less">
.xtx-dialog {
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    &.item {
      border: 1px solid #f5f5f5;
      margin-bottom: 10px;
      cursor: pointer;
      &.active,&:hover {
        border-color: @xtxColor;
        background: lighten(@xtxColor,50%);
      }
      > ul {
        padding: 10px;
        font-size: 14px;
        line-height: 30px;
      }
    }
  }
}
.checkout-address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }
    > ul {
      flex: 1;
      padding: 20px;
      li {
        line-height: 30px;
        span {
          color: #999;
          margin-right: 5px;
          > i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }
    > a {
      color: @xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }
  .action {
    width: 420px;
    text-align: center;
    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
</style>
