
// 提供和商品相关的api函数

import request from '@/utils/request'

/**
 * 获取商品详情
 * @param {*} id 商品id
 * @returns
 */
export const findGoods = (id) => request('/goods', 'get', { id })
