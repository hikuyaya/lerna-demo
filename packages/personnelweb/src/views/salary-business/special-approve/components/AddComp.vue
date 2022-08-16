<!--
 * @Author: wqy
 * @Date: 2022-08-10 09:54:41
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-16 10:53:23
 * @FilePath: \personnelweb\src\views\salary-business\special-approve\components\AddComp.vue
 * @Description: 
-->

<template>
  <div>
    <div>
      <el-button type="primary" @click="$emit('back')" class="mg-b-24"
        >返回</el-button
      >
      <el-button
        type="primary"
        v-if="operateType !== 'detail' && tableData.length"
        @click="onApprove()"
        class="mg-b-24"
        >审核</el-button
      >
      <el-button
        type="primary"
        v-if="operateType !== 'detail' && tableData.length"
        @click="onReject()"
        class="mg-b-24"
        >驳回</el-button
      >
    </div>

    <div class="flex info-row">
      <div>门店：{{ info.shopName }}</div>
      <div>编码：{{ info.shopCode }}</div>
      <div>申请月份：{{ info.year }}-{{ info.month }}</div>
      <div>合计金额：{{ info.moneyTotal }}</div>
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
            : info.approvalStatus
        }}</span>
      </div>
      <div>单号：{{ info.billCode }}</div>
    </div>
    <yid-table :data="tableData" ref="table" class="mg-t-12">
      <yid-table-column
        label="员工姓名"
        prop="eeName"
        width="100px"></yid-table-column>
      <yid-table-column label="员工编码" prop="eeCode"></yid-table-column>
      <yid-table-column label="职务" prop="psName"></yid-table-column>
      <yid-table-column label="级别" prop="psLevelName"></yid-table-column>
      <yid-table-column label="级别1" prop="psLevel1Name"></yid-table-column>
      <yid-table-column
        label="提成合计"
        prop="actualCommission"></yid-table-column>
      <yid-table-column label="保底提成" prop="expectCommission">
        <template slot-scope="scope">
          <el-link type="primary" @click="onShowDetail(scope.row)">{{
            scope.row.expectCommission
          }}</el-link>
        </template>
      </yid-table-column>
      <yid-table-column label="理论保底差额" prop="theoryCommission">
        <template slot-scope="scope">
          <span class="red">{{ scope.row.theoryCommission }}</span>
        </template>
      </yid-table-column>
      <yid-table-column label="特殊工资项" prop="speName"> </yid-table-column>
      <yid-table-column label="申请金额" prop="money"> </yid-table-column>
      <yid-table-column label="申请原因及计算描述" prop="remark">
      </yid-table-column>
    </yid-table>

    <el-dialog
      title="确认驳回"
      :visible.sync="rejectCompVisible"
      :close-on-click-modal="false"
      append-to-body
      width="400px">
      <reject-comp v-if="rejectCompVisible" ref="rejectCompRef" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onRejectSubmit">确 定</el-button>
        <el-button @click="rejectCompVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="计算详细"
      :visible.sync="detailCompVisible"
      :close-on-click-modal="false"
      append-to-body
      width="800px">
      <detail
        v-if="detailCompVisible"
        :value="{
          ...selectRow,
          ...info
        }"></detail>
    </el-dialog>
  </div>
</template>

<script>
import Detail from './Detail.vue'
import RejectComp from '@src/components/business/RejectComp'
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
    },
    salcompSpecList: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  components: {
    Detail,
    RejectComp
  },
  created() {
    if (this.operateType === 'add') {
      this.initDate()
    } else if (this.operateType === 'edit') {
      this.defaultParams = {
        year: this.value.year,
        month: this.value.month
      }
    }
  },
  data() {
    return {
      info: {},
      defaultParams: {},
      rejectCompVisible: false,
      detailCompVisible: false,
      selectRow: {},
      tableData: [],
      rules: {
        shopCode: [{ required: true, message: '请输入门店编码' }],
        year: [{ required: true, message: '请输入' }],
        month: [{ required: true, message: '请输入' }],
        actualDayCount: [{ required: true, message: '请输入' }]
      },
      dynamicColumns: []
    }
  },
  computed: {},
  methods: {
    // 新增时初始化年月
    initDate() {
      let date = moment(new Date()).subtract(1, 'months').format('YYYY-M')
      const [year, month] = date.split('-')
      this.info = {
        year,
        month
      }
      this.defaultParams = {
        year,
        month
      }
    },
    onApprove() {
      this.$confirm(`您确认要审核此单据申吗？`, `确认审核`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn-custom-cancel',
        type: 'warning'
      })
        .then(async () => {
          await service.salaryBusiness.specialApprove.approve({
            billCode: this.value.billCode
          })
          this.$message.success('操作成功')
          this.$emit('success')
        })
        .catch(() => {})
    },
    onReject() {
      this.rejectCompVisible = true
    },
    onShowDetail(row) {
      this.selectRow = row
      this.detailCompVisible = true
    },
    getData() {
      return this.tableData
    },
    validate() {
      const item = this.tableData.find(
        v => !v.speCode || (!v.money && v.money !== 0)
      )
      if (item) {
        this.$message.error(`员工：${item.eeName} 录入信息存在空项，请补齐！`)
        return false
      }
      return true
    },
    async onRejectSubmit() {
      const result = await this.$refs.rejectCompRef.getData()
      if (!result) {
        return
      }
      await service.salaryBusiness.specialApprove.reject({
        billCode: this.value.billCode,
        backReason: result.message
      })
      this.$message.success('操作成功')
      this.rejectCompVisible = false
      this.$emit('success')
    }
  },

  watch: {
    value: {
      immediate: true,
      handler: function (val) {
        const copyVal = JSON.parse(JSON.stringify(val))
        this.info = copyVal
        if (this.operateType !== 'add') {
          this.tableData = copyVal.details
        }
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
