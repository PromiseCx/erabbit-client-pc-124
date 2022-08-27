<template>
  <!-- vue2.0 需要根元素，vue3.0可以是代码根片段 Fragment -->
  <router-view></router-view>
</template>

<script>
import request from '@/utils/request'

export default {
  name: 'App',
  setup () {
    const fn = () => {
      request('/member/profile', 'get')
    }
    return { fn }
  }
}
</script>
