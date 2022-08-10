<!--
 * @Author: wqy
 * @Date: 2022-07-21 14:32:44
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-10 16:37:40
 * @FilePath: \personnelweb\src\views\salary-business\salary-request\salaryRequest.vue
 * @Description: 
-->

<template>
  <div class="container">
    <el-collapse-transition>
      <div v-show="!addCompVisible" class="content">
        <search-top ref="searchTop" :options="conditions">
          <template #inlineBtn>
            <div class="flex flex-alignitems__center mg-l-12">
              <el-button type="primary" @click="onSearch">查询</el-button>
              <el-button type="primary" @click="onReset">重置</el-button>
              <el-button type="primary" @click="onAdd">新增</el-button>
            </div>
          </template>
        </search-top>
        <yid-table pagination :data="tableData" ref="table" class="mg-t-12">
          <yid-table-column label="单号" prop="billCode" width="140px" fixed>
            <template slot-scope="scope">
              <el-link type="primary" @click="onShowDetail(scope.row)">{{
                scope.row.billCode
              }}</el-link>
            </template>
          </yid-table-column>
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
            label="合计金额"
            prop="moneyTotal"
            width="120px"
            fixed></yid-table-column>
          <yid-table-column
            label="收入合计"
            prop="addTotal"
            width="100px"
            fixed></yid-table-column>
          <yid-table-column
            label="支出合计"
            prop="subTotal"
            width="100px"
            fixed></yid-table-column>
          <yid-table-column
            label="审核锁定"
            prop="approvalLockStatus"
            width="100px"
            fixed>
            <template slot-scope="scope">
              {{
                scope.row.approvalLockStatus == 1
                  ? '已锁定'
                  : scope.row.approvalLockStatus == 0
                  ? '未锁定'
                  : scope.row.approvalLockStatus
              }}
            </template>
          </yid-table-column>
          <yid-table-column
            label="审核状态"
            prop="approvalStatus"
            width="100px"
            fixed>
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
                  : scope.row.approvalStatus
              }}
            </template>
          </yid-table-column>

          <yid-table-column
            label="驳回原因"
            prop="backReason"></yid-table-column>

          <yid-table-column
            label="创建人"
            prop="createdBy"
            width="100px"></yid-table-column>
          <yid-table-column
            label="创建时间"
            prop="createdTime"
            width="150px"></yid-table-column>

          <yid-table-column label="操作" width="120" fixed="right">
            <!-- 已审核（不显示任何按钮）、已驳回（显示编辑按钮） -->
            <template slot-scope="scope">
              <!-- 待审核（只显示撤回：需要判断审核锁定状态为已锁定时不出现此按钮） -->
              <el-tooltip
                v-if="
                  scope.row.approvalStatus == 2 &&
                  scope.row.approvalLockStatus == 0
                "
                effect="dark"
                content="撤回"
                placement="top">
                <i
                  class="el-icon-s-release c-pointer mg-r-8 font-size-16rem"
                  @click="onReject(scope.row)"></i>
              </el-tooltip>

              <!-- 待提交（只显示编辑按钮）、已驳回（显示编辑按钮） -->
              <el-tooltip
                v-if="[0, 1].includes(scope.row.approvalStatus)"
                effect="dark"
                content="编辑"
                placement="top">
                <i
                  class="el-icon-edit c-pointer font-size-16rem mg-r-8"
                  @click="onEdit(scope.row)"></i>
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
        :salCompMenus="salCompMenus"
        @back="handleBack"
        @success="handleSuccess" />
    </el-collapse-transition>
  </div>
</template>
<script>
import SearchTop from '@src/components/base/SearchTop'
import AddComp from './components/AddComp.vue'
import service from '@src/service'
export default {
  components: { SearchTop, AddComp },
  data() {
    return {
      addCompVisible: false,
      importCompVisible: false,
      operateType: 'add',
      type: '', // approve 或者 remove
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
          prop: 'month',
          type: 'input-number',
          labelWidth: '0.6rem',
          width: '12%',
          controls: false,
          min: 1,
          max: 12
        },
        {
          label: '创建日期',
          prop: 'date',
          type: 'daterange',
          width: '30%'
        },
        {
          label: '审核状态',
          prop: 'approvalStatus',
          type: 'select', // 搜索类型
          width: '15%',
          options: [
            { label: '所有', value: '' },
            { label: '待提交', value: 1 },
            { label: '待审核', value: 2 },
            { label: '已审核', value: 3 },
            { label: '已驳回', value: 0 }
          ]
        }
      ],
      importCompColumns: [
        { label: '员工编码', prop: 'eeCode' },
        { label: '员工姓名', prop: 'eeName' },
        {
          label: '原状态',
          prop: 'beStatus',
          render: row => {
            if (row.beStatus == 1) {
              return '在职'
            } else if (row.beStatus == 2) {
              return '离职'
            } else if (row.beStatus == 3) {
              return '长假'
            } else {
              return '其他'
            }
          }
        },
        {
          label: '新状态',
          prop: 'afStatus',
          render: row => {
            if (row.afStatus == 1) {
              return '在职'
            } else if (row.afStatus == 2) {
              return '离职'
            } else if (row.afStatus == 3) {
              return '长假'
            } else {
              return '其他'
            }
          }
        },
        {
          label: '离职原因',
          prop: 'maintenanceLeave',
          render: row => {
            if (row.maintenanceLeave == '01') {
              return '正常离职'
            } else if (row.maintenanceLeave == '02') {
              return '无业绩离职'
            } else if (row.maintenanceLeave == '03') {
              return '分店报离'
            }
          }
        }
      ],
      importCompFailColumns: [
        { label: '员工编码', prop: 'eeCode' },
        { label: '员工姓名', prop: 'eeName' },
        {
          label: '原状态',
          prop: 'beStatus'
        },
        {
          label: '新状态',
          prop: 'afStatus'
        },
        {
          label: '离职原因',
          prop: 'maintenanceLeave',
          render: row => {
            if (row.maintenanceLeave == '01') {
              return '正常离职'
            } else if (row.maintenanceLeave == '02') {
              return '无业绩离职'
            } else if (row.maintenanceLeave == '03') {
              return '分店报离'
            }
          }
        },
        { label: '失败原因', prop: 'failwhy' }
      ],
      tableData: [],
      salCompMenus: []
    }
  },
  created() {},
  mounted() {
    this.queryList()
  },
  methods: {
    async onReset() {
      this.$refs.searchTop.reset()
      this.onSearch()
    },
    queryList() {
      this.onSearch()
    },
    onAdd() {
      this.operateType = 'add'
      this.selectRow = {}
      this.addCompVisible = true
    },
    onDelete() {},
    onSearch() {
      const params = this.$refs.searchTop.getSearchParams()
      params.limit = this.$refs.table.Pagination.internalPageSize
      const fetch = service.salaryBusiness.salaryRequest.list
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
    onShowDetail(row) {
      this.selectRow = row
      this.operateType = 'detail'
      this.addCompVisible = true
    },
    onReject(row) {
      this.$confirm(`您确认要对此单据进行撤回吗？`, `确认撤回`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn-custom-cancel',
        type: 'warning'
      })
        .then(async () => {
          await service.salaryBusiness.salaryRequest.revoke(row.id)
          this.$message.success('操作成功')
          // 刷新列表
          await this.queryList()
        })
        .catch(() => {})
    },
    handleBack() {
      this.addCompVisible = false
    },
    async handleSuccess() {
      this.handleBack()
      this.$message.success('操作成功')
      await this.queryList()
    },
    async onSubmit() {
      const result = this.$refs.addCompRef.getData()
      console.log(result)
      if (!result.length) {
        this.$message.error('请选择员工')
        return
      }
      await service.staff.status.save({
        employeeStateMaintenanceVOS: result
      })
      this.$message.success('操作成功')
      this.addCompVisible = false
      // 刷新列表
      await this.queryList()
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  // display: flex;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  .content {
    // flex: 1;
  }
}
</style>
