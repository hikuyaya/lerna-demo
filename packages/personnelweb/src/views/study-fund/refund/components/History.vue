<!--
 * @Author: wqy
 * @Date: 2022-08-07 10:28:24
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-10 08:53:46
 * @FilePath: \personnelweb\src\views\study-fund\refund\components\History.vue
 * @Description: 
-->
<template>
  <div>
    <yid-table :data="tableData" ref="table" class="mg-t-12">
      <yid-table-column
        label="员工编码"
        prop="eeCode"
        width="80px"></yid-table-column>
      <yid-table-column
        label="员工姓名"
        prop="eeName"
        width="100px"></yid-table-column>
      <yid-table-column
        label="学习金金额"
        prop="betutje"
        width="100px"></yid-table-column>
      <yid-table-column label="已缴纳学习金" prop="betutjeCom" width="120px">
      </yid-table-column>
      <yid-table-column label="已退学习金" prop="betutRet" width="120px">
      </yid-table-column>
      <yid-table-column label="工资方案ID" prop="salId" width="120px">
      </yid-table-column>
      <yid-table-column label="备注" prop="remark"></yid-table-column>

      <yid-table-column
        label="创建人"
        prop="createdBy"
        width="120px"></yid-table-column>
      <yid-table-column
        label="创建时间"
        prop="createdTime"
        width="150px"></yid-table-column>
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
      const { data } = await service.studyFund.refund.all({
        approvalStatus: 3,
        eeCode: this.value.eeCode
      })
      this.tableData = data
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
