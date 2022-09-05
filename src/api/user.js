import request from '@/utils/request'

export const userAccountLogin = ({ account, password }) => request('/login', 'post', { account, password })

export const userMobileLoginMsg = (mobile) => request('/login/code', 'get', { mobile })

// 短信验证码默认123456
export const userMobileLogin = ({ mobile, code }) => {
  return request('/login/code', 'post', { mobile, code })
}
