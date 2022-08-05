<!--
 * @Author: wqy
 * @Date: 2022-08-05 10:41:35
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-05 16:21:44
 * @FilePath: \personnelweb\src\views\study-fund\leave\components\AddComp.vue
 * @Description: 
-->

<template>
  <div>
    <div>
      <el-button type="primary" @click="$emit('back')" class="mg-b-24"
        >返回</el-button
      >
    </div>

    <div class="flex info-row">
      <div>
        状态：<span class="red bold">{{
          info.approvalStatus == 1
            ? '待提交'
            : info.approvalStatus == 2
            ? '待审核'
            : info.approvalStatus == 3
            ? '已审核'
            : info.approvalStatus == 0
            ? '已驳回'
            : info.approvalStatu
        }}</span>
      </div>
      <div>批次号：{{ info.batchNo || '--' }}</div>
      <div>创建人：{{ info.createdBy || '--' }}</div>
      <div>创建时间：{{ info.createdTime || '--' }}</div>
      <div>审核人：{{ info.approvalEename || '--' }}</div>
      <div>审核时间：{{ info.approvalTime || '--' }}</div>
    </div>
    <yid-table pagination :data="tableData" ref="table" class="mg-t-12">
      <yid-table-column label="单号" prop="billCode"> </yid-table-column>
      <yid-table-column label="员工姓名" prop="eeName"> </yid-table-column>
      <yid-table-column label="员工编码" prop="eeCode"></yid-table-column>

      <yid-table-column label="状态" prop="approvalStatus">
        <template slot-scope="scope">
          <el-tag
            :type="
              scope.row.approvalStatus === 2
                ? 'primary'
                : scope.row.approvalStatus === 3
                ? 'success'
                : 'info'
            "
            >{{
              scope.row.approvalStatus === 2
                ? '待审核'
                : scope.row.approvalStatus == 3
                ? '已审核'
                : scope.row.approvalStatus
            }}</el-tag
          >
        </template>
      </yid-table-column>

      <yid-table-column label="学习金金额" prop="betutje"></yid-table-column>
      <yid-table-column
        label="已完成缴纳金额"
        prop="betutjeCom"></yid-table-column>
      <yid-table-column label="已退学习金" prop="betutjeRet"></yid-table-column>
      <yid-table-column label="备注" prop="remark"></yid-table-column>
    </yid-table>
  </div>
</template>

<script>
import moment from 'moment'
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
    }
  },
  components: {},
  mounted() {
    this.queryDetail()
  },
  data() {
    return {
      info: {},
      defaultParams: {
        searchType: 1
      },
      targetMonthDays: 0, // 当月
      importCompVisible: false,
      tableData: []
    }
  },

  methods: {
    async queryDetail() {
      this.onSearch()
    },
    async onSearch() {
      const params = {
        batchNo: this.info.batchNo
      }
      params.limit = this.$refs.table.Pagination.internalPageSize
      const fetch = service.studyFund.leave.list
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
        if (this.operateType === 'add') {
          return
        }
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
