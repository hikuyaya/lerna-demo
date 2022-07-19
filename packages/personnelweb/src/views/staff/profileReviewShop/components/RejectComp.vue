<!--
 * @Author: wqy
 * @Date: 2022-07-19 10:22:19
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-19 10:39:48
 * @FilePath: \personnelweb\src\views\staff\profileReviewShop\components\RejectComp.vue
 * @Description: 驳回
-->
<template>
  <el-form ref="form" :model="info" :rules="rules" label-width="80px">
    <el-row class="mg-b-12">
      <el-col :span="24">您确定要对选择项进行驳回吗？</el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="驳回原因" prop="message">
          <el-input v-model="info.message"></el-input>
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
        message: ''
      },
      rules: {
        message: [{ required: true, message: '请输入驳回原因' }]
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
