<!--
 * @Author: wqy
 * @Date: 2022-07-21 14:47:01
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-29 16:26:04
 * @FilePath: \personnelweb\src\views\salary-business\point-to-point\pointToPoint.vue
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
            label="合计打款金额"
            prop="totalMoney"
            width="120px"
            fixed></yid-table-column>
          <yid-table-column
            label="合计门店数"
            prop="totalShop"
            width="100px"
            fixed></yid-table-column>
          <yid-table-column
            label="打款次数"
            prop="payCount"
            width="120px"
            fixed></yid-table-column>
          <yid-table-column
            label="状态"
            prop="approvalStatus"
            width="100px"
            fixed>
            <template slot-scope="scope">
              {{
                scope.row.approvalStatus == 1
                  ? '待审核'
                  : scope.row.approvalStatus == 2
                  ? '已审核'
                  : scope.row.approvalStatus
              }}
            </template>
          </yid-table-column>

          <yid-table-column
            label="创建人"
            prop="createdBy"
            width="100px"></yid-table-column>
          <yid-table-column
            label="创建时间"
            prop="createdTime"></yid-table-column>
          <yid-table-column
            label="修改人"
            prop="updatedBy"
            width="100px"></yid-table-column>
          <yid-table-column
            label="修改时间"
            prop="updatedTime"></yid-table-column>
          <yid-table-column
            label="审批人"
            prop="approvalEename"
            width="100px"></yid-table-column>
          <yid-table-column
            label="审批时间"
            prop="approvalTime"></yid-table-column>

          <yid-table-column label="操作" width="120" fixed="right">
            <!-- 待审核（删除、编辑、审核按钮）、已审核（不显示任何按钮） -->
            <template slot-scope="scope">
              <el-tooltip
                v-if="scope.row.approvalStatus == 1"
                effect="dark"
                content="审核"
                placement="top">
                <i
                  class="el-icon-s-check c-pointer font-size-16rem mg-r-8"
                  @click="onApprove(scope.row)"></i>
              </el-tooltip>
              <el-tooltip
                v-if="scope.row.approvalStatus == 1"
                effect="dark"
                content="删除"
                placement="top">
                <i
                  class="el-icon-delete c-pointer font-size-16rem mg-r-8"
                  @click="onDelete(scope.row)"></i>
              </el-tooltip>
              <el-tooltip
                v-if="scope.row.approvalStatus == 1"
                effect="dark"
                content="编辑"
                placement="top">
                <i
                  class="el-icon-edit c-pointer font-size-16rem"
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
          label: '单号',
          prop: 'billCode',
          type: 'input',
          width: '15%',
          labelWidth: '0.8rem'
        },
        {
          label: '状态',
          prop: 'approvalStatus',
          labelWidth: '0.8rem',
          type: 'select', // 搜索类型
          width: '14%',
          options: [
            { label: '待审核', value: 1 },
            { label: '已审核', value: 2 }
          ]
        },
        {
          label: '创建人',
          prop: 'createdBy',
          type: 'input',
          width: '17%'
        },
        {
          label: '创建日期',
          prop: 'date',
          type: 'daterange',
          width: '30%'
        }
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
    onDelete(row) {
      this.$confirm(`您确认要删除此单据吗？`, `删除确认`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn-custom-cancel',
        type: 'warning'
      })
        .then(async () => {
          await service.salaryBusiness.pointToPoint.remove({
            billCode: row.billCode
          })
          this.$message.success('操作成功')
          // 刷新列表
          await this.queryList()
        })
        .catch(() => {})
    },
    onSearch() {
      let params = this.$refs.searchTop.getSearchParams()
      params.isDel = 0
      params.limit = this.$refs.table.Pagination.internalPageSize
      if (params.date && params.date.length) {
        const [createdTimeStart, createdTimeEnd] = params.date
        params.createdTimeStart = createdTimeStart + ' 00:00:00'
        params.createdTimeEnd = createdTimeEnd + ' 23:59:59'
      } else {
        params.createdTimeStart = undefined
        params.createdTimeEnd = undefined
      }
      delete params.date
      const fetch = service.salaryBusiness.pointToPoint.list
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
    onApprove(row) {
      if (row) {
        this.$confirm(`确认要对选择单据进行审核吗？`, `审核确认`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'btn-custom-cancel',
          type: 'warning'
        })
          .then(async () => {
            await service.salaryBusiness.pointToPoint.approve({
              billCode: row.billCode
            })
            this.$message.success('操作成功')
            // 刷新列表
            await this.queryList()
          })
          .catch(() => {})
      } else {
        this.type = 'approve'
        this.removeCompVisible = true
      }
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
