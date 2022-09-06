<template>
  <div class="xtx-checkbox" @click="changeChecked()">
    <i v-if="checked" class="iconfont icon-checked"></i>
    <i v-else class="iconfont icon-unchecked"></i>
    <span v-if="$slots.default"><slot /></span>
  </div>
</template>

<script>
// import { ref, watch } from 'vue'
import { useVModel } from '@vueuse/core'

// vue3.0 v-model为；  ：modelValue + @update-modelValue 的简写

export default {
  name: 'XtxCheckbox',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  setup (props, { emit }) {
    // 法一；
    // const checked = ref(false)
    // const changeChecked = () => {
    //   checked.value = !checked.value
    //   // 通知父组件数据的改变
    //   emit('update:modelValue', checked.value)
    // }
    // watch(() => props.modelValue, () => {
    //   checked.value = props.modelValue
    // }, { immediate: true })
    // return { checked, changeChecked }

    // 法二：@vueuse/core
    // useVModel()实现双向数据绑定v-model指令,
    // checked.value 就是父组件的数据
    const checked = useVModel(props, 'modelValue', emit)
    const changeChecked = () => {
      const newVal = !checked.value
      //   // 通知父组件数据的改变
      checked.value = newVal
      emit('change', newVal)
    }
    return { checked, changeChecked }
  }
}
</script>

<style scoped lang="less">
.xtx-checkbox {
  display: inline-block;
  margin-right: 2px;
  .icon-checked {
    color: @xtxColor;
    ~ span {
      color: @xtxColor;
    }
  }
  i {
    position: relative;
    top: 1px;
  }
  span {
    margin-left: 2px;
  }
}
</style>
