// 扩展vue原有的功能：全局组件，自定义指令，挂载原型方法，vue3.0没有过滤器

// vue2.0插件写法要素：导出一个对象，有install函数，且默认传入了Vue构造函数，在Vue基础上扩展东西

// vue3.0插件写法要素：导出一个对象，有install函数，且默认传入了app应用实例，在app上扩展东西

// import XtxSkeleton from './xtx-skeleton.vue'
// import XtxCarousel from './Xtx-carousel.vue'
// import XtxMore from './xtx-more.vue'
import defaultImg from '@/assets/images/200.png'
// import XtxBread from './xtx-bread.vue'
// import XtxBreadItem from './xtx-bread-item.vue'
import Message from './Message'
import confirm from './confirm'

/**
 * 自动的批量注册组件:
 *大致步骤：
    1.使用 require 提供的函数 context 加载某一个目录下的所有 .vue 后缀的文件。
    2.然后 context 函数会返回一个导入函数 importFn
    3.它又一个属性 keys() 获取所有的文件路径
    4.通过文件路径数组，通过遍历数组，再使用 importFn 根据路径导入组件对象
    5.遍历的同时进行全局注册即可
 */

// 导入library文件夹下的所有组件
// 批量导入需要使用一个函数 require.context(dir,deep,matching)
// 参数：1. 目录  2. 是否加载子目录  3. 加载的正则匹配
const importFn = require.context('./', false, /\.vue$/)
// console.dir(importFn.keys()) 文件名称数组

export default {
  install (app) {
    // 挂载原型方法： app.config.globalProperties
    // app.component(XtxSkeleton.name, XtxSkeleton)
    // app.component(XtxCarousel.name, XtxCarousel)
    // app.component(XtxMore.name, XtxMore)
    // app.component(XtxBread.name, XtxBread)
    // app.component(XtxBreadItem.name, XtxBreadItem)

    // 根据keys进行批量注册
    importFn.keys().forEach(path => {
      // 导入组件
      const component = importFn(path).default
      app.component(component.name, component)
    })

    // 定义指令
    defineDirective(app)

    // 定义一个原型函数
    app.config.globalProperties.$message = Message
    app.config.globalProperties.$confirm = confirm
  }
}

const defineDirective = (app) => {
  // 图片懒加载指令 v-lazy
  // 原理：先存储图片地址，不能在src上，当图片进入可视区，将你所存储图片地址设置给图片元素即可
  app.directive('lazy', {
    // vue2.0监听使用指令的dom是否创建好：钩子函数-》 inserted
    // vue3.0的指令拥有的钩子函数和组件一样，使用指令的dom是否创建好： 钩子函数：mounted
    mounted (el, binding) {
      // 创建一个观察者对象，来观察使用指令的元素
      const observe = new IntersectionObserver(([{ isIntersecting }]) => {
        if (isIntersecting) {
          // 停止观察
          observe.unobserve(el)
          el.onerror = () => {
            el.src = defaultImg
          }
          // 把指令的值设置给src,binding.value就是指令的值
          el.src = binding.value
        }
      }, {
        threshold: 0
      })
      // 开启观察
      observe.observe(el)
    }
  })
}
