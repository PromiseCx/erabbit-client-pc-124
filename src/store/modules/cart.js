// 购物车模块

import { getNewCartGoods, mergeCart, findCartList, insertCart, deleteCart, updateCart, checkAllCart } from '@/api/cart'

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
    },
    setCart (state, payload) {
      // payload为空数组，则是清空数组
      state.list = payload
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
    // 修改购物车(选中状态，数量)
    updateCart (context, payload) {
      // payload 需要：必要skuId，可能selected，count
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // aleady login
          updateCart(payload).then(() => {
            return findCartList()
          }).then(data => {
            context.commit('setCart', data.result)
            resolve()
          })
        } else {
          // not login
          context.commit('updateCart', payload)
          resolve()
        }
      })
    },
    // 全选与取消全选
    checkAllCart (context, selected) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // aleady login
          const ids = context.getters.validList.map(item => item.skuId)
          checkAllCart({ selected, ids }).then(() => {
            return findCartList()
          }).then(data => {
            context.commit('setCart', data.result)
            resolve()
          })
        } else {
          // not login
          context.getters.validList.forEach(goods => {
            context.commit('updateCart', { skuId: goods.skuId, selected })
          })
          resolve()
        }
      })
    },
    // 加入购物车
    insertCart (context, payload) {
      return new Promise((resolve, reject) => {
        /**
         * context.state:为当前模块的状态
         * context.rootState:为所有模块的状态
         */
        if (context.rootState.user.profile.token) {
        // 已登录
          insertCart({ skuId: payload.skuId, count: payload.count }).then(() => {
            return findCartList()
          }).then(data => {
            context.commit('setCart', data.result)
            resolve()
          })
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
          findCartList().then(data => {
            context.commit('setCart', data.result)
          })
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
          deleteCart([payload]).then(() => {
            return findCartList()
          }).then(data => {
            context.commit('setCart', data.result)
            resolve()
          })
        } else {
          // not login
          context.commit('deleteCart', payload)
          resolve()
        }
      })
    },
    // 批量删除购物车
    batchDeleteCart (context, isClear) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // aleady login
          const ids = context.getters[isClear ? 'invalidList' : 'selectedList'].map(item => item.skuId)
          deleteCart(ids).then(() => {
            return findCartList()
          }).then(data => {
            context.commit('setCart', data.result)
            resolve()
          })
        } else {
          // not login
          // 找出选中的商品
          context.getters[isClear ? 'invalidList' : 'selectedList'].forEach(item => {
            context.commit('deleteCart', item.skuId)
          })
          resolve()
        }
      })
    },
    // 修改规格
    updateCartSku (context, { oldSkuId, newSku }) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // aleady login
          // 1.找出旧的的商品信息
          // 2.删除旧的商品数据
          // 3.需要商品原先的数量的新的skuId，进行添加和删除
          // 4. 添加新的商品
          const oldGoods = context.state.list.find(item => item.skuId === oldSkuId)
          deleteCart([oldGoods.skuId]).then(() => {
            return insertCart({ skuId: newSku.skuId, count: oldGoods.count })
          }).then(() => {
            return findCartList()
          }).then(data => {
            context.commit('setCart', data.result)
            resolve()
          })
        } else {
          // not login
          // 1.找出旧的的商品信息
          // 2.删除旧的商品数据
          // 3.根据新的sku信息，和旧的商品信息合并为一个新的购物车商品信息
          // 4. 添加新的商品
          const oldGoods = context.state.list.find(item => item.skuId === oldSkuId)
          context.commit('deleteCart', oldGoods.skuId)
          const { skuId, price: nowPrice, specsText: attrsText, inventory: stock } = newSku
          const newGoods = { ...oldGoods, skuId, nowPrice, attrsText, stock }
          context.commit('insertCart', newGoods)
          resolve()
        }
      })
    },
    // 合并购物车
    async mergeCart (context) {
      const cartList = context.state.list.map(goods => {
        return {
          skuId: goods.skuId,
          selected: goods.selected,
          count: goods.count
        }
      })
      await mergeCart(cartList)
      // 合并成功，清空本地
      context.commit('setCart', [])
    }
  }
}
