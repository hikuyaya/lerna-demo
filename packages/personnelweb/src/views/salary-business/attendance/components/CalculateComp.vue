<!--
 * @Author: wqy
 * @Date: 2022-07-26 17:42:08
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-26 18:01:34
 * @FilePath: \personnelweb\src\views\salary-business\attendance\components\CalculateComp.vue
 * @Description: 
-->

<template>
  <el-form ref="form" :model="info" :rules="rules">
    <p class="orange mg-b-12">
      *请选择需要重新计算的月份，重新计算月份需要先导入实际出勤天数*
    </p>
    <el-form-item label="月份" prop="time">
      <el-date-picker
        v-model="info.time"
        type="month"
        placeholder="请选择"
        format="yyyy年MM月"
        placement="bottom"
        value-format="yyyy-MM">
      </el-date-picker>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      info: {},
      rules: {
        time: [{ required: true, message: '请选择月份' }]
      }
    }
  },
  methods: {
    async getData() {
      const result = await this.$refs.form
        .validate()
        .catch(err => console.error(err))
      if (result) {
        return this.info.time
      }
    }
  }
}
</script>
