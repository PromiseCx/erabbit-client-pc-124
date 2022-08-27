// 首页相关的api
import request from '@/utils/request'

// 获取品牌
export const findBrand = (limit = 6) => request('/home/brand', 'get', { limit })

// 获取轮播广告图
export const findBanner = () => request('/home/banner', 'get')
