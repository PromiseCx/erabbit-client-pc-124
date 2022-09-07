<template>
  <div class="xtx-numbox">
    <div class="label" v-if="label">{{label}}</div>
    <div class="numbox">
      <a href="javascript:;" @click="changeNum(-1)">-</a>
      <input type="text" readonly :value="modelValue">
      <a href="javascript:;" @click="changeNum(1)">+</a>
    </div>
  </div>
</template>
<script>
// import { ref } from 'vue'
import { useVModel } from '@vueuse/core'

export default {
  name: 'XtxNumbox',
  props: {
    label: {
      type: String,
      default: ''
    },
    // props中的数据是单向数据流，只能用不能改，所以不能v-model
    modelValue: {
      type: Number,
      default: 1
    },
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 10
    }
  },
  setup (props, { emit }) {
    // 1.原生写法：
    // const count = ref(1)
    // const changeNum = (step) => {
    //   count.value += step
    //   if (count.value < props.min || count.value > props.max) {
    //     return
    //   }
    //   emit('update:modelValue', count.value)
    // }
    // 2.vueuse方法：
    const count = useVModel(props, 'modelValue', emit)
    const changeNum = (step) => {
      const newValue = count.value + step
      if (newValue < props.min || newValue > props.max) return
      count.value = newValue
      // ?为什么返回count.value不行？
      /**
       * 应该是；useVModel返回的是计算属性，不是ref，不能直接修改，
       * 直接修改其实相当于直接修改了props属性，vuex中不允许
       * 本组件的值在函数结束前并不会立即变化，count.value = newValue 这句应该只是单纯的告诉父组件值变化
       */
      emit('change', newValue)
    }
    return { changeNum }
  }
}
</script>
<style scoped lang="less">
.xtx-numbox {
  display: flex;
  align-items: center;
  .label {
    width: 60px;
    color: #999;
    padding-left: 10px;
  }
  .numbox {
    width: 120px;
    height: 30px;
    border: 1px solid #e4e4e4;
    display: flex;
    > a {
      width: 29px;
      line-height: 28px;
      text-align: center;
      background: #f8f8f8;
      font-size: 16px;
      color: #666;
      &:first-of-type {
        border-right:1px solid #e4e4e4;
      }
      &:last-of-type {
        border-left:1px solid #e4e4e4;
      }
    }
    > input {
      width: 60px;
      padding: 0 5px;
      text-align: center;
      color: #666;
    }
  }
}
</style>
