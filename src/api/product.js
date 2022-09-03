
// 提供和商品相关的api函数

import request from '@/utils/request'

/**
 * 获取商品详情
 * @param {*} id 商品id
 * @returns
 */
export const findGoods = (id) => request('/goods', 'get', { id })

/**
 *
 * @param {String} id 商品id，传入为商品相关推荐，不传猜你喜欢
 * @param {*} limit
 * @returns
 */
export const findRelevantGoods = ({ id, limit = 16 }) => request('/goods/relevant', 'get', { id, limit })

/**
 *
 * @param {object} param0  type商品类型
 * @returns
 */
export const findGoodsHot = ({ id, limit = 3, type = 1 }) => request('/goods/hot', 'get', { id, limit, type })

/**
 *
 * @param {*} id
 * @returns
 * axios遇到https协议，就不会加上baseURL
 */
// export const findGoodsCommentInfo = (id) => request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate`, 'get')
export const findGoodsCommentInfo = (id) => request(`/goods/${id}/evaluate`, 'get')

export const findGoodsCommentList = (id, params) => request(`/goods/${id}/evaluate/page`, 'get', params)
