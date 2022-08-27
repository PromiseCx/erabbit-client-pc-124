// 定义分类相关的api接口

import request from '@/utils/request'

// 获取所有分类
export const findAllCategory = () => request('/home/category/head', 'get')
