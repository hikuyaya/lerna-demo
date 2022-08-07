<!--
 * @Author: wqy
 * @Date: 2022-08-07 09:31:05
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-07 10:00:40
 * @FilePath: \personnelweb\src\views\salary-business\salary-request\components\DetailComp.vue
 * @Description: 
-->

<template>
  <div>
    <div class="flex info-row">
      <div>员工姓名：{{ info.eeName }}</div>
      <div>员工编码：{{ info.eeCode }}</div>
    </div>
    <yid-table :data="tableData" ref="table" class="mg-t-12">
      <yid-table-column
        label="固定项"
        prop="eeName"
        width="100px"></yid-table-column>
      <yid-table-column label="固定金额" prop="money"></yid-table-column>
      <yid-table-column label="当月天数" prop="eeCode"></yid-table-column>
      <yid-table-column label="出勤天数" prop="eeCode"></yid-table-column>
      <yid-table-column label="实际金额" prop="eeCode"></yid-table-column>
      <yid-table-column label="有效时间" prop="eeCode"></yid-table-column>
    </yid-table>
  </div>
</template>

<script>
import service from '@src/service'
export default {
  props: {
    value: {
      type: Object,
      default: function () {
        return {}
      }
    },
    operateType: {
      type: String
    },
    column: {
      type: Object
    }
  },
  data() {
    return {
      info: {},
      tableData: []
    }
  },
  mounted() {
    this.queryDetail()
  },
  methods: {
    async queryDetail() {
      const { shopCode, eeCode, year, month } = this.value
      const { scCode } = this.column
      let params = {
        shopCode,
        eeCode,
        year,
        month,
        scCode
      }
      const { data } = await service.salaryBusiness.attendance.getByEeCode(
        params
      )
      this.tableData = data?.workAttendanceDayBillDetailVOList || []
    }
  },
  watch: {
    value: {
      immediate: true,
      handler: function (val) {
        const copyVal = JSON.parse(JSON.stringify(val))
        this.info = copyVal
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.info-row {
  display: flex;
  margin: 12px 24px;
  & > div {
    margin-right: 48px;
  }
}
</style>
