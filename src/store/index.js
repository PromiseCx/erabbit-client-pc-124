// vue2.0创建仓库 new Vuex.Store()
// vue3.0创建仓库 createStore()

/**
 * vue3.0--vuex
 * 组件中：创建vuex实例
 * 1.import {useStore} from 'vuex'
 * 2.setup() {
 *  const store = useStore()
 * 3. 模板中使用state数据：$store.state
 * 4. js中使用：store.state.变量
 * 5.使用getters：store.getters.方法
 * 6.模板中使用getters: $store.getters['方法名']
 * 7.使用mutations：store.commit('方法名')
 * 8.使用actions： store.dispatch('方法名')
 * }
 *
 * vue3.0 --- vuex模块用法：(模块(例：moduleA,modeuleB)有两种：namespaced：true/false)
 *  1.模板中使用state：$store.state.moduleA.username
 *  2.模板中使用getters：(没有命名空间相当于挂载到全局)
 *       有namespaced (moduleB)： $store.getters['moduleB/newName'].
 *       没有namesapaced(moduleA)： $store.getters.newName
 * 3.使用mutations：
 *       有namespaced：store.commit('moduleB/udpateName')
 * 4.使用actions：
 *       有namespaced：store.dispatch('moduleB/updateName')
 */

import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

// 三个子模块
import user from './modules/user'
import cart from './modules/cart'
import category from './modules/category'

export default createStore({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    user,
    cart,
    category
  },
  plugins: [
    createPersistedState({
      // 本地存储的名字
      key: 'erabbit-client-pc-store',
      paths: ['user', 'cart']
    })
  ]
})
