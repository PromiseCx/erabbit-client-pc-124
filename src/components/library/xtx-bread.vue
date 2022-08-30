
<script>
import { h } from 'vue'

export default {
  name: 'XtxBread',
  render () {
    // 使用render就不需要template了 ，单文件组件
    // 返回值就是组件内容
    // vue2.0的render函数时传参进来的，vue3.0的函数时导入进来的
    // h的第一个参数：标签名称，第二个参数：标签属性对象，第三个参数：字节点
    /*
     1.创建xtx-bread父容器，
     2.获取默认插槽内容
     3.去除xtx-bread-item组件的i标签，应该由render函数创建
     4.遍历插槽中的item，得到一个动态创建的节点，最后一个item不加i标签
     5.将动态创建好的节点，渲染在xtx-bread组件中
    */
    const items = this.$slots.default()
    const dymanicItems = []
    items.forEach((item, i) => {
      dymanicItems.push(item)
      if (i < (items.length - 1)) {
        dymanicItems.push(h('i', { class: 'iconfont icon-angle-right' }))
      }
    })
    return h('div', { class: 'xtx-bread' }, dymanicItems)
  }
}
</script>

<style lang='less'>
// 去除scoped 作用到xtx-bread-item中
.xtx-bread{
  display: flex;
  padding: 25px 10px;
  &-item {
    a {
      color: #666;
      transition: all .4s;
      &:hover {
        color: @xtxColor;
      }
    }
  }
  i {
    font-size: 12px;
    margin-left: 5px;
    margin-right: 5px;
    line-height: 22px;
    &:last-child {
      display: none;
    }
  }
}
</style>
