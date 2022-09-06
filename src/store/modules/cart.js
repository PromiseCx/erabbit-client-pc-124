// 购物车模块

export default {
  namespaced: true,
  state () {
    return {
      // 购物车商品列表
      list: []
    }
  },
  // payload:
  // 本地：id skuId name picture price nowPrice count attrsText selected stock isEffective
  // 线上：比上面多 isCollect 有用 discount 无用 两项项信息
  mutations: {
    insertCart (state, payload) {
      /**
       *加入购物车规则：
       *  首先查找是否有相同的产品
       *  如果有相同的商品，首先记下该商品的数量，删除原来的商品信息,
       *  然后在合并payload在保存在最新的位置
       *  如果没有相同的商品，则直接保存在最新的位置
       */
      const sameIndex = state.list.findIndex(goods => goods.skuId === payload.skuId)
      if (sameIndex > -1) {
        const count = state.list[sameIndex].count
        payload.count += count
        state.list.splice(sameIndex, 1)
      }
      state.list.unshift(payload)
    }
  },
  getters: {
    // 有效商品列表(stock>0,isEffective=true)
    validList (state) {
      return state.list.filter(item => item.stock > 0 && item.isEffective)
    },
    // 有效商品总件数
    validTotal (state, getters) {
      return getters.validList.reduce((p, c) => p + c.count, 0)
    },
    // 有效商品总金额
    validAmount (state, getters) {
      return getters.validList.reduce((p, c) => p + parseInt(c.nowPrice * 100) * c.count, 0) / 100
    }
  },
  actions: {
    insertCart (context, payload) {
      return new Promise((resolve, reject) => {
        /**
         * context.state:为当前模块的状态
         * context.rootState:为所有模块的状态
         */
        if (context.rootState.user.profile.token) {
        // 已登录

        } else {
        // 未登录
          context.commit('insertCart', payload)
          resolve()
        }
      })
    }
  }
}
