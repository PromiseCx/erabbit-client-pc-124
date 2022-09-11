import request from '@/utils/request'

/**
 * 获取结算信息
 */
export const createOrder = () => {
  return request('/member/order/pre', 'get')
}

/**
 * 添加收货地址信息
 * @param {Object} address - 地址对象
 */
export const addAddress = (address) => {
  return request('/member/address', 'post', address)
}

/**
 * 修改收货地址信息
 * @param {Object} address - 地址对象
 */
export const editAddress = (form) => {
  return request(`/member/address/${form.id}`, 'put', form)
}

/**
 * 提交订单
 * @param {Object} order - 订单信息对象
 */
export const submitOrder = (order) => {
  return request('/member/order', 'post', order)
}

/**
 * 获取订单详情
 * @param {String} id - 订单ID
 */
export const findOrderDetail = (orderId) => {
  return request(`/member/order/${orderId}`, 'get')
}

/**
 * 查询订单列表
 * @param {Number} orderState - 订单状态，1为待付款、2为待发货、3为待收货、4为待评价、5为已完成、6为已取消，未传该参数或0为全部
 * @param {Number} page - 页码
 * @param {Number} pageSize - 每页条数
 * @returns
 */
export const findOrderList = ({ orderState, page, pageSize }) => {
  return request('/member/order', 'get', { orderState, page, pageSize })
}
