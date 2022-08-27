// 扩展vue原有的功能：全局组件，自定义指令，挂载原型方法，vue3.0没有过滤器

// vue2.0插件写法要素：导出一个对象，有install函数，且默认传入了Vue构造函数，在Vue基础上扩展东西

// vue3.0插件写法要素：导出一个对象，有install函数，且默认传入了app应用实例，在app上扩展东西

import XtxSkeleton from './xtx-skeleton.vue'
import XtxCarousel from './Xtx-carousel.vue'
import XtxMore from './xtx-more.vue'

export default {
  install (app) {
    // 挂载原型方法： app.config.globalProperties
    app.component(XtxSkeleton.name, XtxSkeleton)
    app.component(XtxCarousel.name, XtxCarousel)
    app.component(XtxMore.name, XtxMore)
  }
}
