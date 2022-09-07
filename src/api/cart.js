// 封装购物车相关的api

import request from '@/utils/request'

// skuid 商品库存是否有效
export const getNewCartGoods = (skuId) => request(`/goods/stock/${skuId}`, 'get')

// 获取商品的对应sku数据
export const getGoodsSku = (skuId) => request(`/goods/sku/${skuId}`, 'get')

// 合并购物车
// cartList是购物车信息列表，每一项是一个对象包含商品信息 要传：skuid，selected，count
export const mergeCart = (cartList) => request('/member/cart/merge', 'post', cartList)

export const findCartList = () => request('/member/cart', 'get')

export const insertCart = ({ skuId, count }) => request('/member/cart', 'post', { skuId, count })

// 删除购物车商品（支持批量）
export const deleteCart = (ids) => request('/member/cart', 'delete', { ids })

// 修改购物车商品（状态，数量）
export const updateCart = ({ skuId, selected, count }) => request(`/member/cart/${skuId}`, 'put', { selected, count })

/**
 * 全选反选
 * @param {Boolean} selected - 选中状态
 * @param {Array<string>} ids - 有效商品skuId集合
 * @returns Promise
 */
export const checkAllCart = ({ selected, ids }) => {
  return request('/member/cart/selected', 'put', { selected, ids })
}
