<template>
  <div class="not-found">
    <div>404， 走到了外太空</div>

    <div>
      <el-button @click="$router.go(-1)" type>返回上一级</el-button>
      <el-button @click="$router.push('/login')" type>重新登录</el-button>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;

  flex-direction: column;
}
</style>
