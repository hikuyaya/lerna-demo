<template>
  <div class="no-auth">
    <div>没有权限访问，你可以选择</div>

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
.no-auth {
  display: flex;
  justify-content: center;
  align-items: center;

  flex-direction: column;
}
</style>
