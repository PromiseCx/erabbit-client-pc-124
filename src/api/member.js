import request from '@/utils/request'

export const findCollect = ({ page = 1, pageSize = 10, collectType = 1 }) => request('/member/collect', 'get', { page, pageSize, collectType })

export const findLike = ({ page = 1, pageSize = 10 }) => request('/member/collect', 'get', { page, pageSize })
