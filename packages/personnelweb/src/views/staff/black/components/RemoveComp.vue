<!--
 * @Author: wqy
 * @Date: 2022-07-04 15:35:00
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-04 16:02:41
 * @FilePath: \personnelweb\src\views\staff\black\components\RemoveComp.vue
 * @Description: 移除黑名单
-->
<template>
  <el-form ref="form" :model="info" :rules="rules" label-width="80px">
    <el-row>
      <el-col :span="24">
        <el-form-item label="移除原因" prop="reason">
          <el-input v-model="info.reason"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      info: {
        reason: ''
      },
      rules: {
        reason: [{ required: true, message: '请输入移除原因' }]
      }
    }
  },
  methods: {
    async getData() {
      const result = await this.$refs.form
        .validate()
        .catch(err => console.error(err))
      if (result) {
        return this.info
      }
    }
  }
}
</script>
