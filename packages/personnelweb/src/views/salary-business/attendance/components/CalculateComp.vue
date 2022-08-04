<!--
 * @Author: wqy
 * @Date: 2022-07-26 17:42:08
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-04 10:03:17
 * @FilePath: \personnelweb\src\views\salary-business\attendance\components\CalculateComp.vue
 * @Description: 
-->

<template>
  <el-form ref="form" :model="info" :rules="rules" label-width="80px">
    <p class="orange mg-b-12">
      *请选择需要重新计算的月份，重新计算月份需要先导入实际出勤天数*
    </p>
    <el-form-item label="月份" prop="date" :required="true">
      <el-date-picker
        v-model="info.date"
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
import moment from 'moment'
export default {
  data() {
    const validateDate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择'))
      } else if (value > this.now) {
        callback(new Error('选择日期不能大于当前日期'))
      }
      callback()
    }
    return {
      info: {},
      now: {},
      rules: {
        // date: [{ required: true, message: '请选择月份' }]
        date: [{ validator: validateDate }]
      }
    }
  },
  created() {
    this.initDate()
  },
  methods: {
    initDate() {
      let date = moment(new Date()).subtract(1, 'months').format('YYYY-MM')
      const [year, month] = date.split('-')
      this.info = {
        year,
        month,
        date
      }
      this.now = date
    },
    async getData() {
      const result = await this.$refs.form
        .validate()
        .catch(err => console.error(err))
      if (result) {
        return this.info.date
      }
    }
  }
}
</script>
