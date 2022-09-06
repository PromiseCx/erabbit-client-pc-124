// 封装购物车相关的api

import request from '@/utils/request'

// skuid 商品库存是否有效
export const getNewCartGoods = (skuId) => request(`/goods/stock/${skuId}`, 'get')
