<!--
 * @Author: wqy
 * @Date: 2022-07-21 14:31:36
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-10 17:05:48
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
          <yid-table-column label="单号" prop="billCode" width="140px" fixed>
            <template slot-scope="scope">
              <el-link type="primary" @click="onShowDetail(scope.row)">{{
                scope.row.billCode
              }}</el-link>
            </template>
          </yid-table-column>
          <yid-table-column
            label="门店编码"
            prop="shopCode"
            width="100px"
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
            prop="employeeCount"
            width="100px"
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
            label="驳回原因"
            prop="backMessage"></yid-table-column>
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
              <!-- 待审核（只显示驳回、复核按钮） -->
              <el-tooltip
                v-if="scope.row.approvalStatus == 2"
                effect="dark"
                content="驳回"
                placement="top">
                <i
                  class="el-icon-s-release c-pointer mg-r-8 font-size-16rem"
                  @click="onReject(scope.row)"></i>
              </el-tooltip>
              <el-tooltip
                v-if="scope.row.approvalStatus == 2"
                effect="dark"
                content="审核"
                placement="top">
                <i
                  class="el-icon-s-check c-pointer font-size-16rem"
                  @click="onApprove(scope.row)"></i>
              </el-tooltip>
              <!-- 已驳回（只显示编辑按钮） -->
              <el-tooltip
                v-if="scope.row.approvalStatus == 0"
                effect="dark"
                content="编辑"
                placement="top">
                <i
                  class="el-icon-edit c-pointer mg-r-8 font-size-16rem"
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
        :menuId="menuId"
        @back="handleBack"
        @success="handleAddSuccess" />
    </el-collapse-transition>

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
  </div>
</template>
<script>
import SearchTop from '@src/components/base/SearchTop'
import AddComp from './components/AddComp.vue'
import RejectComp from '@src/components/business/RejectComp'
import service from '@src/service'
import { mapGetters } from 'vuex'
export default {
  components: { SearchTop, AddComp, RejectComp },
  data() {
    return {
      addCompVisible: false,
      rejectCompVisible: false,
      type: '', // remove or approve
      menuId: '',
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
  computed: {
    ...mapGetters({
      salCompMenus: 'user/salaryBusinessMenu'
    })
  },
  created() {
    const menu = this.salCompMenus.find(
      v => window.location.href.indexOf(v.url) !== -1
    )
    if (!menu) {
      this.$message.error('无对应菜单信息')
      return
    }
    this.menuId = menu.id
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
      this.$confirm(`您确认要重新计算吗？`, `重新计算`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn-custom-cancel',
        type: 'warning'
      })
        .then(async () => {
          await service.salaryBusiness.attendance.recalculate({
            menuId: this.menuId
          })
          this.$message.success('操作成功')
          await this.queryList()
        })
        .catch(() => {})
    },
    onSearch() {
      let params = this.$refs.searchTop.getSearchParams()
      params.limit = this.$refs.table.Pagination.internalPageSize
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
    onReject(row) {
      this.type = 'approve'
      this.selectRow = row
      this.rejectCompVisible = true
    },
    onApprove(row) {
      this.$confirm(`您确认要审核此条单据吗？`, `确认审核`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn-custom-cancel',
        type: 'warning'
      })
        .then(async () => {
          await service.salaryBusiness.attendance.approve({
            id: row.id,
            status: 3
          })
          this.$message.success('操作成功')
          await this.queryList()
        })
        .catch(() => {})
    },
    onShowDetail(row) {
      this.selectRow = row
      this.operateType = 'detail'
      this.addCompVisible = true
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
    async onRejectSubmit() {
      const result = await this.$refs.rejectCompRef.getData()
      if (!result) {
        return
      }
      await service.salaryBusiness.attendance.approve({
        id: this.selectRow.id,
        status: 0,
        backMessage: result.message
      })
      this.$message.success('操作成功')
      this.rejectCompVisible = false
      // 刷新列表
      await this.queryList()
    },
    async handleAddSuccess() {
      this.addCompVisible = false
      await this.$nextTick()
      await this.queryList()
    },
    async handleBack() {
      this.addCompVisible = false
      await this.$nextTick()
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
