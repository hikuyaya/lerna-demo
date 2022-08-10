<!--
 * @Author: wqy
 * @Date: 2022-07-21 14:33:21
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-10 11:14:32
 * @FilePath: \personnelweb\src\views\salary-business\special-approve\specialApprove.vue
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
              <el-button type="primary" @click="onApproveAll"
                >一键审核</el-button
              >
            </div>
          </template>
        </search-top>
        <yid-table pagination :data="tableData" ref="table" class="mg-t-12">
          <yid-table-column label="单号" prop="billCode" width="150px" fixed>
            <template slot-scope="scope">
              <el-link type="primary" @click="onShowDetail(scope.row)">{{
                scope.row.billCode
              }}</el-link>
            </template>
          </yid-table-column>
          <yid-table-column
            label="门店名称"
            prop="shopName"
            width="120px"
            fixed></yid-table-column>
          <yid-table-column
            label="门店编码"
            prop="shopCode"
            width="100px"
            fixed></yid-table-column>
          <yid-table-column label="年" prop="year" fixed></yid-table-column>
          <yid-table-column label="月" prop="month" fixed></yid-table-column>
          <yid-table-column
            label="合计金额"
            prop="moneyTotal"
            width="100px"
            fixed></yid-table-column>
          <yid-table-column
            label="合计人数"
            prop="employeeTotal"
            fixed></yid-table-column>

          <yid-table-column
            label="状态"
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
                  : scope.row.approvalStatu
              }}
            </template>
          </yid-table-column>

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
            prop="approvalEename"
            width="100px"></yid-table-column>
          <yid-table-column
            label="审批时间"
            prop="approvalTime"
            width="150px"></yid-table-column>
          <yid-table-column label="操作" width="100" fixed="right">
            <template slot-scope="scope">
              <!-- 待审核（只显示撤回按钮）、 -->
              <el-tooltip
                v-if="scope.row.approvalStatus == 2"
                effect="dark"
                content="操作"
                placement="top">
                <i
                  class="el-icon-s-claim c-pointer mg-r-8 font-size-16rem"
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
        :salcompSpecList="salcompSpecList"
        @back="addCompVisible = false"
        @success="handleSaveSuccess" />
    </el-collapse-transition>

    <el-dialog
      title="一键审核"
      :visible.sync="approveCompVisible"
      :close-on-click-modal="false"
      append-to-body
      width="500px">
      <approve-comp v-if="approveCompVisible" ref="approveCompRef" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onApproveSubmit">一键审核</el-button>
        <el-button @click="approveCompVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import SearchTop from '@src/components/base/SearchTop'
import ApproveComp from './components/ApproveComp'
import AddComp from './components/AddComp'
import service from '@src/service'
export default {
  components: { SearchTop, AddComp, ApproveComp },
  data() {
    return {
      addCompVisible: false,
      importCompVisible: false,
      approveCompVisible: false,
      operateType: 'add',
      type: '', // approve 或者 remove
      selectRow: {},
      conditions: [
        {
          label: '门店类型',
          prop: 'shopType',
          type: 'select', // 搜索类型
          width: '14%',
          options: [
            { label: '美发门店', value: 1 },
            { label: '美容门店', value: 2 }
          ]
        },
        {
          label: '门店名称',
          prop: 'shopName',
          type: 'input',
          width: '15%',
          placeholder: '门店名称'
        },
        {
          label: '门店编码',
          prop: 'shopCode',
          type: 'input',
          width: '15%',
          placeholder: '门店编码'
        },
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
          label: '状态',
          prop: 'approvalStatus',
          type: 'select', // 搜索类型
          labelWidth: '0.8rem',
          width: '13%',
          options: [
            { label: '待审核', value: 2 },
            { label: '已审核', value: 3 }
          ]
        }
      ],
      tableData: [],
      salcompSpecList: []
    }
  },
  created() {},
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
    onApproveAll() {
      this.approveCompVisible = true
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
    async onReset() {
      this.$refs.searchTop.reset()
      this.onSearch()
    },
    onDelete(row) {
      this.$confirm(`确认要删除此条申请信息吗？`, `删除确认`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn-custom-cancel',
        type: 'warning'
      })
        .then(async () => {
          await service.salaryBusiness.specialRequest.remove({
            billCode: row.billCode
          })
          this.$message.success('操作成功')
          // 刷新列表
          await this.queryList()
        })
        .catch(() => {})
    },
    onReject(row) {
      this.$confirm(`您确认要对此单据进行撤回修改操作吗？`, `确认撤回`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn-custom-cancel',
        type: 'warning'
      })
        .then(async () => {
          await service.salaryBusiness.specialRequest.revoke({
            billCode: row.billCode
          })
          this.$message.success('操作成功')
          // 刷新列表
          await this.queryList()
        })
        .catch(() => {})
    },
    async onApproveSubmit() {
      const result = await this.$refs.approveCompRef.getData()
      if (!result) {
        return
      }
      await service.salaryBusiness.specialApprove.approveAll(result)
      this.$message.success('操作成功')
      this.approveCompVisible = false
      // 刷新列表
      await this.queryList()
    },
    onSearch() {
      let params = this.$refs.searchTop.getSearchParams()
      params.isDel = 0
      params.limit = this.$refs.table.Pagination.internalPageSize

      const fetch = service.salaryBusiness.specialApprove.list
      this.$refs.table.reloadData({
        fetch,
        params
      })
    },
    async handleSaveSuccess() {
      this.addCompVisible = false
      await this.queryList()
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  // display: flex;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  .content {
    // flex: 1;
  }
}
</style>
