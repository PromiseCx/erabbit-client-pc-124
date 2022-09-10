<template>
  <div class="container">
    <AppMemberAside />
    <article class="article">
        <!-- 三级路由 -->
      <RouterView />
    </article>
  </div>
</template>

<script>
import AppMemberAside from '@/components/app-member-aside'
export default {
  name: 'MemberLayout',
  components: {
    AppMemberAside
  }
}
</script>

<style scoped lang="less">
.container {
  display: flex;
  padding-top: 20px;
  .article {
    width: 1000px;
  }
}
</style>
