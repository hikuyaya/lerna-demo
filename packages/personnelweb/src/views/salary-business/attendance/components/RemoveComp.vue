<!--
 * @Author: wqy
 * @Date: 2022-07-26 17:05:41
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-26 17:05:50
 * @FilePath: \personnelweb\src\views\salary-business\attendance\components\RemoveComp.vue
 * @Description: 
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
