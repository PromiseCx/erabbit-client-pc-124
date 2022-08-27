// 首页相关的api
import request from '@/utils/request'

// 获取品牌
export const findBrand = (limit = 6) => request('/home/brand', 'get', { limit })

// 获取轮播广告图
export const findBanner = () => request('/home/banner', 'get')

// 获取新鲜好物
export const findNew = () => request('/home/new', 'get')

// 获取人气推荐
export const findHot = () => request('/home/hot', 'get')
