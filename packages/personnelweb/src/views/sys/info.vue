<template>
  <div>
    <el-form ref="form" :model="sizeForm" size="mini">
      <el-form-item label="商户名称："> WAKEUP时尚造型 </el-form-item>
      <el-form-item label="商户编号："> 32625452 </el-form-item>
      <el-form-item label="软件版本："> 尊享版-美发 </el-form-item>
      <el-form-item label="到期时间："> 2020-12-08 </el-form-item>
      <hr />
      <el-form-item label="登录用户："> wakeupzhangy </el-form-item>
      <el-form-item label="登录用户姓名："> 张扬 </el-form-item>
      <el-form-item label="登录用户手机号："> 18650214514 </el-form-item>
      <el-form-item label="微信号："> 未绑定 </el-form-item>
    </el-form>
  </div>
</template>

<script>
import yid from '@src/library'

export default {
  name: 'info',
  components: {},
  data() {
    return {}
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style scoped lang="scss"></style>
