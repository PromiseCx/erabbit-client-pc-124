// 给vee-validate的校验函数

import { userCheckAccount } from '@/api/user'

export default {
  // 用户名校验
  account (value) {
    // value：出发校验时，表单绑定的值
    if (!value) return '请输入用户名'
    // 规定字母开头，6-20字符之间
    if (!/^[a-zA-Z]\w{5,19}$/.test(value)) return '字母开头且6-20个字符'
    return true
  },
  // 用户校验唯一
  async accountApi (value) {
    if (!value) return '请输入用户名'
    if (!/^[a-zA-Z]\w{5,19}$/.test(value)) return '字母开头且6-20个字符'
    const data = await userCheckAccount(value)
    if (data.result.valid) return '用户名已存在'
    return true
  },
  password (value) {
    if (!value) return '请输入密码'
    //  密码6-24个字符
    if (!/^\w{6,24}$/.test(value)) return '密码6-24个字符'
    // if (!/^\w{6,24}$/.test(value)) return '密码是6-24个字符'
    return true
  },
  rePassword (value, { form }) {
    if (!value) return '请输入密码'
    if (!/^\w{6,24}$/.test(value)) return '密码是6-24个字符'
    // 校验密码是否一致  form表单数据对象
    if (value !== form.password) return '两次输入的密码不一致'
    return true
  },
  mobile (value) {
    if (!value) return '请输入手机号'
    if (!/^1[3-9]\d{9}$/.test(value)) return '手机号格式输入不正确'
    return true
  },
  code (value) {
    if (!value) return '请输入验证码'
    if (!/^\d{6}$/.test(value)) return '验证码格式不正确'
    return true
  },
  isAgree (value) {
    if (!value) return '请勾选同意用户协议'
    return true
  }
}
