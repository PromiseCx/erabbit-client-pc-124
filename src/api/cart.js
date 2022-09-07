// 封装购物车相关的api

import request from '@/utils/request'

// skuid 商品库存是否有效
export const getNewCartGoods = (skuId) => request(`/goods/stock/${skuId}`, 'get')

// 获取商品的对应sku数据
export const getGoodsSku = (skuId) => request(`/goods/sku/${skuId}`, 'get')
