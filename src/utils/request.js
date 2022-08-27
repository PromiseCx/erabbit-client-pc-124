import axios from 'axios'
import store from '@/store'
import router from '@/router'

// 1.创建一个新的axios实例
// 2. 请求拦截器:携带token
// 3.响应拦截器：剥离无效数据，处理token失效
// 4.导出一个函数，调用当前的axios实例发请求，返回值为promise对象

// 导出基准地址，因为有些地方不是axios发起的请求
export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net/'
const instance = axios.create({
  baseURL,
  timeout: 5000
})

instance.interceptors.request.use(config => {
  // 拦截业务逻辑代码
  const { profile } = store.state.user
  if (profile.token) {
    config.headers.Authorization = `Bearer ${profile.token}`
  }
  return config
}, err => {
  return Promise.reject(err)
})

instance.interceptors.response.use(res => res.data
  , err => {
    if (err.response && err.response.status === 401) {
      // 1.清空本地无效的用户信息
      // 2.跳转到登录页
      // 3.跳转需要传参（当前路由地址）给登录页
      store.commit('user/setUser', {})
      // 当前路由地址
      // 组件中获取：
      //     $route.path (这种拿不到地址中的查询字符串参数)
      //     $route.fullPath (拿到完整的路由地址)
      // js中获取： router.currentRoute => 是ref响应式数据,
      //           所以拿到他的值要加value，router.currentRoute.value.fullPath
      // encodeURIComponent转化url编码，防止解析地址出问题
      const fullPath = encodeURIComponent(router.currentRoute.value.fullPath)
      router.push('/login?redirectUrl=' + fullPath)
    }
    return Promise.reject(err)
  })

// 请求工具函数
export default (url, method, submitData) => {
  return instance({
    url,
    method,
    // const a= {name:100},对象取值方法： 1：a.name , 2：a['name'],
    // []中可以使用js表达式，设置一个动态的key，js表达式结果当作key
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}
