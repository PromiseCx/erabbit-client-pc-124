<template>
  <div class="cart-sku" ref="target">
    <div class="attrs" @click="toggle()">
      <span class="ellipsis">{{attrsText}}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="layer" v-if="visible">
      <div class="loading" v-if="loading"></div>
        <GoodsSku @change="changeSku"  v-else :skuId="skuId" :goods="goods" />
        <XtxButton @click="submit" v-if="!loading" type="primary" size="mini" style="margin-left:60px">确认</XtxButton>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { getGoodsSku } from '@/api/cart'
import GoodsSku from '@/views/goods/components/goods-sku.vue'

export default {
  name: 'CartSku',
  components: { GoodsSku },
  props: {
    attrsText: {
      type: String,
      default: ''
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    const visible = ref(false)
    const goods = ref(null)
    const loading = ref(false)
    // 打开
    const open = () => {
      visible.value = true
      loading.value = true
      getGoodsSku(props.skuId).then(data => {
        goods.value = data.result
        loading.value = false
      })
    }
    // 关闭
    const close = () => {
      visible.value = false
    }
    const toggle = () => {
      visible.value ? close() : open()
    }
    const target = ref(null)
    //  点击目标元素或组件外执行的函数
    onClickOutside(target, () => {
      close()
    })

    // 监听sku改变
    const currSku = ref(null)
    const changeSku = (sku) => {
      // 记录你所选择的sku信息
      currSku.value = sku
    }
    // 点击确认的时候，需要将更改后的sku信息提交给父组件（购物车）
    const submit = () => {
      // 当currSku有值，且skuId和默认的skuId不同
      if (currSku.value && currSku.value.skuId && currSku.value.skuId !== props.skuId) {
        emit('change', currSku.value)
        close()
      }
    }
    return { visible, toggle, target, goods, loading, changeSku, submit }
  }
}
</script>

<style scoped lang="less">
.cart-sku {
  height: 28px;
  border: 1px solid #f5f5f5;
  padding: 0 6px;
  position: relative;
  margin-top: 10px;
  display:inline-block;
  .attrs {
    line-height: 24px;
    display: flex;
    span {
      max-width: 230px;
      font-size: 14px;
      color: #999;
    }
    i {
      margin-left: 5px;
      font-size: 14px;
    }
  }
  .layer {
    position: absolute;
    left: -1px;
    top: 40px;
    z-index: 10;
    width: 400px;
    border: 1px solid @xtxColor;
    box-shadow: 2px 2px 4px lighten(@xtxColor,50%);
    background: #fff;
    border-radius: 4px;
    font-size: 14px;
    padding: 20px;
    &::before {
      content: "";
      width: 12px;
      height: 12px;
      border-left: 1px solid @xtxColor;
      border-top: 1px solid @xtxColor;
      position: absolute;
      left: 12px;
      top: -8px;
      background: #fff;
      transform: scale(.8,1) rotate(45deg);
    }
    .loading {
      height: 224px;
      background: url(../../../assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>
