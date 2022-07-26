<!--
 * @Author: wqy
 * @Date: 2022-07-26 17:33:33
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-26 17:33:36
 * @FilePath: \personnelweb\src\components\business\RemoveComp.vue
 * @Description: 
-->

<template>
  <el-form ref="form" :model="info" :rules="rules" label-width="80px">
    <el-row>
      <el-col :span="24">
        <el-form-item :label="label" prop="reason">
          <el-input v-model="info.reason"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  props: {
    label: String
  },
  data() {
    return {
      info: {
        reason: ''
      },
      rules: {
        reason: [{ required: true, message: '请输入' }]
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
