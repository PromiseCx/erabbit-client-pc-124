<template>
  <div class="goods-sku">
    <dl v-for="item in goods.specs" :key="item.id">
      <dt>{{item.name}}</dt>
      <dd>
        <template v-for="val in item.values" :key="val.name">
            <img :class="{selected:val.selected,disabled:val.disabled}" @click="changeSku(item,val)" v-if="val.picture" :src="val.picture" :title="val.name">
            <span :class="{selected:val.selected}"  @click="changeSku(item,val)" v-else>{{val.name}}</span>
        </template>
      </dd>
    </dl>
  </div>
</template>

<script>

import powerSet from '@/vender/power-set'

const spliter = '★'

// 得到一个路径字典对象
const getPathMap = (skus) => {
  // 1. 得到一个所有的sku集合，props.goods.skus
  // 2. 从所有的sku中筛选出有效的sku
  // 3. 根据有效的sku使用power-set算法得到子集
  // 4. 根据子集，往路径字典中存储 key：value
  const pathMap = {}
  skus.forEach(sku => {
    if (sku.inventory > 0) {
      // 计算有库存的sku的子集
      // 可选值数组
      const valueArr = sku.specs.map(val => val.valueName)
      // 可选值数组子集
      const valueArrPowerSet = powerSet(valueArr)
      // 遍历子集,往pathMap插入数据
      valueArrPowerSet.forEach(arr => {
        // 根据arr得到字符串key
        const key = arr.join(spliter)
        // 往字典中设置数据
        if (pathMap[key]) {
          pathMap[key].push(sku.id)
        } else {
          pathMap[key] = [sku.id]
        }
      })
    }
  })
  return pathMap
}

const getSelectValues = (specs) => {
  const arr = []
  specs.forEach(item => {
    const selectedVal = item.values?.find(val => val.selected)
    arr.push(selectedVal ? selectedVal.name : undefined)
  })
  return arr
}

// 更新按钮的禁用状态
const updateDisabledStatus = (specs, pathMap) => {
  // 1.规定每一个按钮的状态由本身的disabled控制
  specs.forEach((item, i) => {
    const selectedValues = getSelectValues(specs)
    item.values.forEach(val => {
      // 2.判断当前按钮是否选中
      if (val.selected) return
      // 3.拿当前的值按照顺序套入选中的值数组
      selectedValues[i] = val.name
      const key = selectedValues.filter(value => value).join(spliter)
      val.disabled = !pathMap[key]
    })
  })
}

// 默认选中
const initDefaultSelected = (goods, skuId) => {
  // 1.找出sku的信息
  // 2. 遍历每一个按钮，按钮的值和sku记录相同，就选中
  const sku = goods.skus.find(sku => sku.id === skuId)
  goods.specs.forEach((item, i) => {
    const val = item.values.find(val => val.name === sku.specs[i].valueName)
    val.selected = true
  })
}

export default {
  name: 'GoodsSku',
  props: {
    goods: {
      type: Object,
      default: () => ({})
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    const pathMap = getPathMap(props.goods.skus)

    // 根据skuId初始化选中
    if (props.skuId) {
      initDefaultSelected(props.goods, props.skuId)
    }

    // 组件初始化，点击按钮，更新按钮的状态
    updateDisabledStatus(props.goods.specs, pathMap)

    // 1.选中与取消选中，约定每一个按钮都有自己的选中状态数据：selected
    const changeSku = (item, val) => {
      // 当按钮是禁用的，阻止程序的进行
      if (item.disabled) return
      if (val.selected) {
        val.selected = false
      } else {
        item.values?.forEach(valItem => {
          valItem.selected = false
        })
        val.selected = true
      }
      // 点击按钮，更新按钮的状态
      updateDisabledStatus(props.goods.specs, pathMap)
      // 选择的sku信息传递给父组件
      // 传递完整的sku信息，提交给父组件，不完整，提交空对象
      const validSelectedValues = getSelectValues(props.goods.specs).filter(v => v)
      if (validSelectedValues.length === props.goods.specs.length) {
        const skuIds = pathMap[validSelectedValues.join(spliter)]
        const sku = props.goods.skus.find(sku => sku.id === skuIds[0])
        emit('change', {
          skuId: sku.id,
          price: sku.price,
          oldPrice: sku.oldPrice,
          inventory: sku.inventory,
          // 属性：属性值 属性：属性值.....
          /**
           * reduce((p，c)=>{},0)
           * 第一个参数，回调函数： p：上一个值，c：当前值
           * 第二个参数，初始的累加和
           */
          specsText: sku.specs.reduce((p, c) => `${p} ${c.name}: ${c.valueName}`, '').trim()
        })
      } else {
        // 数据不完整
        emit('change', {})
      }
    }
    return { changeSku }
  }
}
</script>

<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
