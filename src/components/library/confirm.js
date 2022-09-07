// 函数式组件，通过方法调用一个组件，和Message一样

import { createVNode, render } from 'vue'
import XtxConfirm from './xtx-confirm.vue'

// 准备一个dom
const div = document.createElement('div')
div.setAttribute('class', 'xtx-confirm-container')
document.body.appendChild(div)

// 返回一个promise对象，点取消和确认都会销毁组件
export default ({ title, text }) => {
  // 1.导入创建的组件
  // 2. createVNode创建虚拟节点
  // 3. 准备一个容器装载节点
  // 4.render函数渲染组件到容器中
  return new Promise((resolve, reject) => {
    const cancelCallback = () => {
      render(null, div)
      reject(new Error('点击取消'))
    }
    const submitCallback = () => {
      render(null, div)
      resolve()
    }
    const vnode = createVNode(XtxConfirm, { title, text, cancelCallback, submitCallback })
    render(vnode, div)
  })
}
