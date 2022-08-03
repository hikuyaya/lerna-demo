<!--
 * @Author: wqy
 * @Date: 2022-07-21 14:31:36
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-02 11:27:30
 * @FilePath: \personnelweb\src\views\salary-business\attendance\attendance.vue
 * @Description: 出勤天数录入
-->

<template>
  <div class="container">
    <el-collapse-transition>
      <div v-if="!addCompVisible" class="content">
        <search-top ref="searchTop" :options="conditions">
          <template #inlineBtn>
            <div class="flex flex-alignitems__center mg-l-12">
              <el-button type="primary" @click="onSearch">查询</el-button>
              <el-button type="primary" @click="onAdd">新增</el-button>
              <el-button type="primary" @click="onCalculate"
                >重新计算</el-button
              >
            </div>
          </template>
        </search-top>
        <yid-table pagination :data="tableData" ref="table" class="mg-t-12">
          <yid-table-column label="单号" prop="batchNo" width="100px" fixed>
            <template slot-scope="scope">
              <el-link type="primary" @click="onShowDetail(scope.row)">{{
                scope.row.batchNo
              }}</el-link>
            </template>
          </yid-table-column>
          <yid-table-column
            label="门店编码"
            prop="shopCode"
            width="150px"
            fixed></yid-table-column>
          <yid-table-column
            label="门店名称"
            prop="shopName"
            width="120px"
            fixed></yid-table-column>
          <yid-table-column
            label="年"
            prop="year"
            width="80px"
            fixed></yid-table-column>
          <yid-table-column
            label="月"
            prop="month"
            width="80px"
            fixed></yid-table-column>
          <yid-table-column
            label="合计人数"
            prop="count"
            width="100px"
            fixed></yid-table-column>
          <yid-table-column label="状态" prop="approvalStatus" fixed>
            <template slot-scope="scope">
              {{
                scope.row.approvalStatus == 1
                  ? '待提交'
                  : scope.row.approvalStatus == 2
                  ? '待审核'
                  : scope.row.approvalStatus == 3
                  ? '已审核'
                  : scope.row.approvalStatus == 0
                  ? '已驳回'
                  : '其他'
              }}
            </template>
          </yid-table-column>
          <yid-table-column
            label="驳回原因"
            prop="createdBy"
            width="100px"></yid-table-column>
          <yid-table-column
            label="创建人"
            prop="createdBy"
            width="100px"></yid-table-column>
          <yid-table-column
            label="创建时间"
            prop="createdTime"
            width="150px"></yid-table-column>
          <yid-table-column
            label="审批人"
            prop="removeBy"
            width="100px"></yid-table-column>
          <yid-table-column
            label="审批时间"
            prop="removeDate"
            width="150px"></yid-table-column>
          <yid-table-column label="操作" width="100" fixed="right">
            <template slot-scope="scope">
              <el-tooltip effect="dark" content="驳回" placement="top">
                <i
                  class="el-icon-s-release c-pointer mg-r-8 font-size-16rem"
                  @click="onReject(scope.row)"></i>
              </el-tooltip>
              <el-tooltip effect="dark" content="审核" placement="top">
                <i
                  class="el-icon-s-check c-pointer font-size-16rem"
                  @click="onApprove(scope.row)"></i>
              </el-tooltip>
            </template>
          </yid-table-column>
        </yid-table>
      </div>
    </el-collapse-transition>

    <el-collapse-transition>
      <add-comp
        v-if="addCompVisible"
        ref="addCompRef"
        :value="selectRow"
        :operateType="operateType"
        @back="addCompVisible = false" />
    </el-collapse-transition>

    <el-dialog
      :title="
        operateType === 'add'
          ? '新增'
          : operateType === 'edit'
          ? '修改'
          : '详情'
      "
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
      title="重新计算"
      :visible.sync="calculateCompVisible"
      :close-on-click-modal="false"
      append-to-body
      width="480px">
      <calculate-comp v-if="calculateCompVisible" ref="calculateCompRef" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onCalculateSubmit">确 定</el-button>
        <el-button @click="calculateCompVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="导入数据到页面"
      :visible.sync="importCompVisible"
      :close-on-click-modal="false"
      append-to-body
      width="800px">
      <import-comp
        v-if="importCompVisible"
        ref="importCompRef"
        :importAction="`${$yid.config.API.BASE}api-pers/employeestatemaintenance/convertSystem`"
        @save="handleImportSave">
        <!-- <import-comp
        v-if="importCompVisible"
        ref="importCompRef"
        :columns="importCompColumns"
        :failColumns="importCompFailColumns"
        :importAction="`${$yid.config.API.BASE}api-pers/employeestatemaintenance/convertSystem`"
        :downloadUrl="`${$yid.config.API.BASE}api-pers/employeestatemaintenance/downSysTemplate`"
        @save="handleImportSave"
        @approve="handleImportApprove"> -->
        <el-button type="primary" @click="handleSave">保存</el-button>
      </import-comp>
      <span slot="footer" class="dialog-footer">
        <el-button @click="importCompVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import SearchTop from '@src/components/base/SearchTop'
import AddComp from './components/AddComp.vue'
import RejectComp from '@src/components/business/RejectComp'
import CalculateComp from './components/CalculateComp'
import ImportComp from '@src/components/business/ImportComp'
import service from '@src/service'
export default {
  components: { SearchTop, AddComp, RejectComp, CalculateComp, ImportComp },
  data() {
    return {
      addCompVisible: false,
      rejectCompVisible: false,
      calculateCompVisible: false,
      importCompVisible: false,
      operateType: 'add',
      selectRow: {},
      conditions: [
        {
          label: '年',
          prop: 'year',
          type: 'input-number',
          labelWidth: '0.6rem',
          controls: false,
          min: 1970,
          max: new Date().getFullYear(),
          width: '12%'
        },
        {
          label: '月',
          prop: 'mouth',
          type: 'input-number',
          labelWidth: '0.6rem',
          width: '12%',
          controls: false,
          min: 1,
          max: 12
        },
        {
          label: '状态',
          prop: 'approvalStatus',
          type: 'select', // 搜索类型
          width: '20%',
          options: [
            { label: '所有', value: '' },
            { label: '待审核', value: 2 },
            { label: '已审核', value: 3 },
            { label: '已驳回', value: 0 }
          ]
        }
      ],
      tableData: []
    }
  },
  mounted() {
    this.queryList()
  },
  methods: {
    queryList() {
      this.onSearch()
    },
    onAdd() {
      this.operateType = 'add'
      this.selectRow = {}
      this.addCompVisible = true
    },
    onCalculate() {
      this.calculateCompVisible = true
    },
    onSearch() {
      let params = this.$refs.searchTop.getSearchParams()
      params.limit = this.$refs.table.Pagination.internalPageSize
      let dateParams = {
        year: null,
        month: null
      }
      if (params.date) {
        const [year, month] = params.date.split('-')
        dateParams = {
          year,
          month
        }
      }
      params = {
        ...params,
        ...dateParams
      }
      const fetch = service.salaryBusiness.attendance.list
      this.$refs.table.reloadData({
        fetch,
        params
      })
    },
    onEdit(row) {
      this.selectRow = row
      this.operateType = 'edit'
      this.addCompVisible = true
    },
    onReject() {
      this.rejectCompVisible = true
    },
    onApprove() {
      this.$confirm(`您确认要审核此条单据吗？`, `确认审核`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn-custom-cancel',
        type: 'warning'
      })
        .then(async () => {
          await service.staff.contract.deleteBillByBatchNo({
            batchNo: this.batchNo
          })
          this.$message.success('操作成功')
          this.$emit('refresh')
        })
        .catch(() => {})
    },
    onShowDetail(row) {
      this.selectRow = row
      this.operateType = 'detail'
      this.addCompVisible = true
    },
    async handleImportSave(successData) {
      const params = successData.map(v => {
        return {
          eeCode: v.eeCode,
          bbCode: v.bbCode,
          eeName: v.eeName,
          beStatus: v.beStatus,
          afStatus: v.afStatus,
          maintenanceLeave: v.maintenanceLeave,
          changeDate: v.changeDate,
          remark: v.remark
        }
      })
      await service.staff.status.save({
        employeeStateMaintenanceVOS: params
      })
      this.handleImportSuccess()
    },
    async handleImportSuccess() {
      this.importCompVisible = false
      await this.queryList()
    },
    async onSubmit() {
      // const result = await this.$refs.addCompRef.getData()
      // console.log(264, result)
      // if (!result) {
      //   return
      // }
      // await service.staff.black.save(result)
      this.$message.success('操作成功')
      this.addCompVisible = false
      // 刷新列表
      this.queryList()
    },
    handleSave() {},
    async onRejectSubmit() {
      const result = await this.$refs.rejectCompRef.getData()
      if (!result) {
        return
      }
      // TODO
      return
      const idList = this.multipleSelection.map(v => v.id)
      await service.staff.shop.approve({
        idList,
        status: 0,
        message: result.message
      })
      this.$message.success('操作成功')
      this.rejectCompVisible = false
      // 刷新列表
      await this.queryList()
    },
    async onCalculateSubmit() {
      const result = await this.$refs.calculateCompRef.getData()
      if (!result) {
        return
      }
      this.calculateCompVisible = false
      await this.queryList()
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  // display: flex;
  height: 100%;
  .content {
    // flex: 1;
  }
}
</style>
