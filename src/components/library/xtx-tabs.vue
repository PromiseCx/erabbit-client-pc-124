<script>
import { useVModel } from '@vueuse/core'
import { provide } from 'vue'

export default {
  name: 'XtxTabs',
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    }
  },
  setup (props, { emit }) {
    const activeName = useVModel(props, 'modelValue', emit)
    const tabClick = (name, index) => {
      activeName.value = name
      emit('tab-click', { name, index })
    }
    provide('activeName', activeName)
    return { activeName, tabClick }
  },
  render () {
    // render返回的内容会进行渲染
    /**
     * 在babel帮助下，在vue中可以写jsx的语法
     *  1.数据的使用：
     *   const name = 'tom'
     *   const title = 'tom1'
     *
     * 2.事件绑定
     *   const say =()=>{}
     *
     * 3. 定义一个jsx对象
     *  const sub = [<sub>123</sub>,<sub>456</sub>]
     *
     *  <h1 title={title} onClick={say}> {name} {sub}</h1>
     *
     */
    // 1.tabs组件的大容器
    // 2.选项卡的标签结构
    // 3.每个选项卡所对应的内容

    const panels = this.$slots.default()

    // 动态panels组件集合
    const dynamicPanels = []
    panels.forEach(item => {
      if (item.type.name === 'XtxTabsPanel') {
        dynamicPanels.push(item)
      } else {
        item.children.forEach(item => {
          dynamicPanels.push(item)
        })
      }
    })

    const nav = <nav>{
      dynamicPanels.map((item, i) => {
        return <a onClick={() => this.tabClick(item.props.name, i)} class={{ active: item.props.name === this.activeName }} href="javascript:;">{item.props.label}</a>
      })
    }
    </nav>
    return <div class="xtx-tabs">{[nav]}</div>
  }
}
</script>

<style lang="less">
.xtx-tabs {
  background: #fff;
  > nav {
    height: 60px;
    line-height: 60px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    > a {
      width: 110px;
      border-right: 1px solid #f5f5f5;
      text-align: center;
      font-size: 16px;
      &.active {
        border-top: 2px solid @xtxColor;
        height: 60px;
        background: #fff;
        line-height: 56px;
      }
    }
  }
}
</style>
