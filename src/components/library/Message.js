// 实现使用函数调用xtx-message组件的逻辑
// 这个函数：导入可以直接使用，也可以挂载到vue实例上
// import Message from 'Message.js' => 使用：
// 1.Message({type:'error',text:'提示文字'})
// 2.this.$message({type:'error',text:'提示文字'})

import { createVNode, render } from 'vue'
import XtxMessage from './xtx-message.vue'

// 容器放在函数外边，避免每次调用都会创建一个容器
const div = document.createElement('div')
div.setAttribute('class', 'xtx-message-container')
document.body.appendChild(div)

// 定时器
let timer = null

export default ({ type, text }) => {
  /**
     * 渲染组件：
     * 1. 导入消息提示组件
     * 2. 将导入的消息提示组件编译为虚拟节点
     * 3. 准备一个装载消息提示组件的容器
     * 4. 将虚拟节点渲染在容器中
     */
  // createVNode(组件，属性对象（props）)
  const vnode = createVNode(XtxMessage, { type, text })
  // 将虚拟节点渲染在容器中
  render(vnode, div)
  // 3s后销毁组件
  clearTimeout(timer)
  timer = setTimeout(() => {
    render(null, div)
  }, 3000)
}
