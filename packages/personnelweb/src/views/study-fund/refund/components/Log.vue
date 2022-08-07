<!--
 * @Author: wqy
 * @Date: 2022-08-07 10:28:30
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-07 11:11:54
 * @FilePath: \personnelweb\src\views\study-fund\refund\components\Log.vue
 * @Description: 
-->
<template>
  <div>
    <yid-table pagination :data="tableData" ref="table" class="mg-t-12">
      <yid-table-column label="工资方案ID" prop="salId" width="120px">
      </yid-table-column>
      <yid-table-column
        label="员工编码"
        prop="eeCode"
        width="80px"></yid-table-column>
      <yid-table-column
        label="员工姓名"
        prop="eeName"
        width="100px"></yid-table-column>

      <yid-table-column
        label="改变前金额"
        prop="betutje"
        width="100px"></yid-table-column>
      <yid-table-column label="改变前已交" prop="betutjeCom" width="120px">
      </yid-table-column>
      <yid-table-column label="缴纳金额" prop="xxj" width="120px">
      </yid-table-column>
      <yid-table-column
        label="改变后金额"
        prop="aftutje"
        width="100px"></yid-table-column>
      <yid-table-column label="改变后已交" prop="aftutjeCom" width="120px">
      </yid-table-column>
      <yid-table-column label="改变日期" prop="updatedTime" width="120px">
      </yid-table-column>

      <yid-table-column label="备注" prop="remark"></yid-table-column>
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
    }
  },
  components: {},
  computed: {},
  mounted() {
    this.queryDetail()
  },
  data() {
    return {
      info: {},
      tableData: []
    }
  },
  methods: {
    async queryDetail() {
      let params = {
        eeCode: this.value.eeCode
      }
      params.limit = this.$refs.table.Pagination.internalPageSize
      const fetch = service.studyFund.query.eexxjlogList
      this.$refs.table.reloadData({
        fetch,
        params
      })
    }
  },

  watch: {
    value: {
      immediate: true,
      handler: function (val) {
        this.info = JSON.parse(JSON.stringify(val))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.font-size-22px {
  font-size: 22px;
}
</style>
