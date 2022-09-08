// 提供复用逻辑的函数（钩子）

import { useIntersectionObserver, useIntervalFn } from '@vueuse/core'
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'

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

/**
 * 倒计时
 * @param {Number} countdown 倒计时
 */
export const usePayTime = () => {
  const time = ref(0)
  const timeText = ref('')
  const { pause, resume } = useIntervalFn(() => {
    time.value--
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')
    if (time.value <= 0) pause()
  }, 1000, false)

  onMounted(() => {
    pause()
  })
  const start = (countdown) => {
    time.value = countdown
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')
    resume()
  }
  return { start, timeText }
}
