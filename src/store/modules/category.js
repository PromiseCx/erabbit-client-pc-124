// 商品分类

import { topCategory } from '@/api/constants'
import { findAllCategory } from '@/api/category'

export default {
  namespaced: true,
  state () {
    return {
      // 分类信息，依赖topCategory，数据初始化就要数据，避免白屏
      List: topCategory.map(item => ({ name: item }))
    }
  },
  mutations: {
    setList (state, payload) {
      // payload所有分类集合
      state.list = payload
    },
    show (state, id) {
      const currCategory = state.list.find(item => item.id === id)
      currCategory.open = true
    },
    hide (state, id) {
      const currCategory = state.list.find(item => item.id === id)
      currCategory.open = false
    }
  },
  actions: {
    async getList ({ commit }) {
      const data = await findAllCategory()
      data.result.forEach(top => {
        top.open = false
      })
      commit('setList', data.result)
    }
  }
}
