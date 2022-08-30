// 定义分类相关的api接口

import request from '@/utils/request'

// 获取所有分类
export const findAllCategory = () => request('/home/category/head', 'get')

/**
 * 获取顶级类目信息
 * @param {String} id 顶级类目id
 * @returns
 */
export const findTopCategory = (id) => request('/category', 'get', { id })

/**
 * 获取二级类目的筛选数据
 * @param {*} id  二级类目的id
 * @returns
 */
export const findSubCategoryFilter = (id) => request('/category/sub/filter', 'get', { id })
