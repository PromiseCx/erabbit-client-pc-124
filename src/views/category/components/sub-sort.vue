<template>
  <div class='sub-sort'>
    <div class="sort">
      <a :class="{active:sortParams.sortField === null}" @click="changeSort(null)" href="javascript:;">默认排序</a>
      <a @click="changeSort('publishTime')" :class="{active:sortParams.sortField === 'publishTime'}" href="javascript:;">最新商品</a>
      <a @click="changeSort('orderNum')" :class="{active:sortParams.sortField === 'orderNum'}" href="javascript:;">最高人气</a>
      <a @click="changeSort('evaluateNum')" :class="{active:sortParams.sortField === 'evaluateNum'}" href="javascript:;">评论最多</a>
      <a  @click="changeSort('price')" href="javascript:;">
        价格排序
        <i class="arrow up" :class="{active:sortParams.sortField === 'price' && sortParams.sortMethod === 'asc'}" />
        <i class="arrow down" :class="{active:sortParams.sortField === 'price' && sortParams.sortMethod === 'desc'}" />
      </a>
    </div>
    <div class="check">
      <XtxCheckbox v-model="sortParams.inventory">仅显示有货商品</XtxCheckbox>
      <XtxCheckbox v-model="sortParams.onlyDiscount">仅显示特惠商品</XtxCheckbox>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'
export default {
  name: 'SubSort',
  setup () {
    // 实现交互
    // 交互的数据
    const sortParams = reactive({
      inventory: false,
      onlyDiscount: false,
      sortField: null,
      sortMethod: null
    })

    const changeSort = (sortField) => {
      if (sortField === 'price') {
        sortParams.sortField = sortField
        // 处理排序
        if (sortParams.sortMethod === null) {
          sortParams.sortMethod = 'desc'
        } else {
          sortParams.sortMethod = sortParams.sortMethod === 'desc' ? 'asc' : 'desc'
        }
      } else {
        if (sortParams.sortField === sortField) return
        sortParams.sortField = sortField
        sortParams.sortMethod = null
      }
    }

    return { sortParams, changeSort }
  }
}
</script>

<style scoped lang='less'>
.sub-sort {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .sort {
    display: flex;
    a {
      height: 30px;
      line-height: 28px;
      border: 1px solid #e4e4e4;
      padding: 0 20px;
      margin-right: 20px;
      color: #999;
      border-radius: 2px;
      position: relative;
      transition: all .3s;
      &.active {
        background: @xtxColor;
        border-color: @xtxColor;
        color: #fff;
      }
      .arrow {
        position: absolute;
        border: 5px solid transparent;
        right: 8px;
        &.up {
          top: 3px;
          border-bottom-color: #bbb;
            &.active {
            border-bottom-color: @xtxColor;
          }
        }
        &.down {
          top: 15px;
          border-top-color: #bbb;
          &.active {
            border-top-color: @xtxColor;
          }
        }
      }
    }
  }
  .check {
    .xtx-checkbox {
      margin-left: 20px;
      color: #999;
    }
  }
}
</style>
