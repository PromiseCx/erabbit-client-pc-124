// 提供复用逻辑的函数（钩子）

import { useIntersectionObserver } from '@vueuse/core'
import { ref } from 'vue'

/**
 *     数据懒加载
 *
 * @param {object} target ---dom对象
 * @param {Function} apiFn ---发送请求的api函数
 */
export const useLazyData = (apiFn) => {
  const result = ref([])
  const target = ref(null)
  // stop 停止观察
  const { stop } = useIntersectionObserver(
    target,
    // isIntersecting是否进入可视区，observerElement目标对象
    ([{ isIntersecting }], observerElement) => {
      if (isIntersecting) {
        stop()
        // 调用API获取数据
        apiFn().then(data => {
          result.value = data.result
        })
      }
    },
    // 配置选项,只要相交的比例大于0，就会触发函数
    {
      threshold: 0
    }
  )
  return { result, target }
}
