// 购物车模块

import { getNewCartGoods } from '@/api/cart'

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
    },
    // 修改购物车商品
    updateCart (state, goods) {
      // goods信息：nowPrice,isEffective,stock
      // goods对象字段不固定(但是必须有skuId)，有那些字段就改那些字段，字段的值合理才改
      const updateGoods = state.list.find(item => item.skuId === goods.skuId)
      for (const key in goods) {
        if (goods[key] !== undefined && goods[key] !== null && goods[key] !== '') {
          updateGoods[key] = goods[key]
        }
      }
    },
    // 删除商品
    deleteCart (state, skuId) {
      const index = state.list.findIndex(item => item.skuId === skuId)
      state.list.splice(index, 1)
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
      return getters.validList.reduce((p, c) => p + Math.round(c.nowPrice * 100) * c.count, 0) / 100
    },
    // 无效商品列表
    invalidList (state) {
      return state.list.filter(item => item.stock <= 0 || !item.isEffective)
    },
    // 已选商品列表
    selectedList (state, getters) {
      return getters.validList.filter(item => item.selected)
    },
    // 已选商品总件数
    selectedTotal (state, getters) {
      return getters.selectedList.reduce((p, c) => p + c.count, 0)
    },
    // 已选商品总金额
    selectedAmount (state, getters) {
      return getters.selectedList.reduce((p, c) => p + Math.round(c.nowPrice * 100) * c.count, 0) / 100
    },
    // 是否全选
    isCheckAll (state, getters) {
      return getters.validList.length !== 0 && getters.selectedList.length === getters.validList.length
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
    },
    // 获取商品列表
    findCart (context) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // aleady login
        } else {
          // not login
          // 同时发送所有商品请求，等所有请求成功，一起修改本地数据
          // Promise.all([promise Array]).then(dataList=>{})

          // promise数组
          const promiseArr = context.state.list.map(goods => {
            return getNewCartGoods(goods.skuId)
          })
          Promise.all(promiseArr).then(dataList => {
            dataList.forEach((data, i) => {
              context.commit('updateCart', { skuId: context.state.list[i].skuId, ...data.result })
            })
            resolve()
          })
        }
      })
    },
    deleteCart (context, payload) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // aleady login
        } else {
          // not login
          context.commit('deleteCart', payload)
          resolve()
        }
      })
    }
  }
}
