<template>
  <div class="detail-logistics">
    <p>
      <span>2016-09-14 15:00:32</span>
      <span>浦东转运中心公司 已收入</span>
    </p>
    <a href="javascript:;">查看物流</a>
  </div>
</template>

<script>
export default {
  name: 'DetailLogistics'
}
</script>

<style scoped lang="less">
.detail-logistics {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  background-color: #f5f5f5;
  margin: 30px 50px 0;
  > p {
    flex: 1;
    span {
      color: #999;
      &:first-child {
        margin-right: 30px;
      }
    }
  }
  > a {
    color: @xtxColor;
    text-align: center;
  }
}
</style>
