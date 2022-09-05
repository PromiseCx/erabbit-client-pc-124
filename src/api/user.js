import request from '@/utils/request'

export const userAccountLogin = ({ account, password }) => request('/login', 'post', { account, password })

export const userMobileLoginMsg = (mobile) => request('/login/code', 'get', { mobile })

// 短信验证码默认123456
export const userMobileLogin = ({ mobile, code }) => {
  return request('/login/code', 'post', { mobile, code })
}

/**
 *
 * @param {String} unionId qq唯一标识，openId
 * @param {*} source 客户端类型 1代表pc端
 * @returns
 */
export const userQQLogin = (unionId, source = 1) => request('/login/social', 'post', { unionId, source })

export const userQQBindCode = (mobile) => request('/login/social/code', 'get', { mobile })

export const userQQBindLogin = ({ unionId, mobile, code }) => request('/login/social/bind', 'post', { unionId, mobile, code })

export const userQQPatchCode = (mobile) => request('https://apipc-xiaotuxian-front.itheima.net/register/code', 'get', { mobile })

export const userCheckAccount = (account) => request('/register/check', 'get', { account })

export const userQQPatchLogin = ({ unionId, mobile, code, account, password }) => {
  return request(`/login/social/${unionId}/complement`, 'post', { mobile, code, account, password })
}
