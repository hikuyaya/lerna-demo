<!--
 * @Author: wqy
 * @Date: 2022-07-21 14:44:23
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-12 10:12:32
 * @FilePath: \personnelweb\src\views\salary-business\pay-request\payRequest.vue
 * @Description: 
-->
<template>
  <div class="container">
    <el-collapse-transition>
      <div v-if="!addCompVisible" class="content">
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
            label="合计工资"
            prop="totalMoney"
            width="100px"
            fixed></yid-table-column>
          <yid-table-column
            label="打款工资"
            prop="payMoney"
            width="100px"
            fixed></yid-table-column>
          <yid-table-column
            label="剩余工资"
            prop="surplusMoney"
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
          <yid-table-column label="是否锁定" prop="isLock">
            <template slot-scope="scope">
              {{
                scope.row.isLock == 1
                  ? '是'
                  : scope.row.isLock == 0
                  ? '否'
                  : scope.row.isLock
              }}
            </template>
          </yid-table-column>
          <yid-table-column label="是否打款" prop="isPay">
            <template slot-scope="scope">
              {{
                scope.row.isPay == 1
                  ? '是'
                  : scope.row.isPay == 0
                  ? '否'
                  : scope.row.isPay
              }}
            </template>
          </yid-table-column>
          <yid-table-column label="打款类型" prop="billType" width="150px">
            <template slot-scope="scope">
              {{
                scope.row.billType == 1
                  ? '预留款申请'
                  : scope.row.billType == 2
                  ? '营业款申请'
                  : scope.row.billType == 3
                  ? '营业款和预留款共同申请'
                  : scope.row.billType
              }}
            </template>
          </yid-table-column>
          <yid-table-column
            label="驳回原因"
            prop="backReason"
            width="150px"></yid-table-column>
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
            <!-- 待提交（只显示编辑按钮）、待审核（未锁定时显示撤回按钮，锁定后不显示撤回按钮）、已驳回（显示编辑按钮）、已审核（不显示任何按钮） -->
            <template slot-scope="scope">
              <el-tooltip
                v-if="scope.row.approvalStatus == 2 && scope.row.isLock == 0"
                effect="dark"
                content="撤回"
                placement="top">
                <i
                  class="el-icon-s-release c-pointer mg-r-8 font-size-16rem"
                  @click="onReject(scope.row)"></i>
              </el-tooltip>

              <el-tooltip
                v-if="[0, 1].includes(scope.row.approvalStatus)"
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
          labelWidth: '0.8rem',
          width: '15%',
          options: [
            { label: '待提交', value: 1 },
            { label: '待审核', value: 2 },
            { label: '已审核', value: 3 },
            { label: '已驳回', value: 0 }
          ]
        },
        {
          label: '打款类型',
          prop: 'billType',
          type: 'select', // 搜索类型
          width: '22%',
          options: [
            { label: '预留款申请', value: '1' },
            { label: '营业款申请', value: '2' },
            { label: '营业款和预留款共同申请', value: '3' }
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
  created() {},
  mounted() {
    this.queryList()
  },
  methods: {
    queryList() {
      this.onSearch()
    },
    async onReset() {
      this.$refs.searchTop.reset()
      this.onSearch()
    },
    onAdd() {
      this.operateType = 'add'
      this.selectRow = {}
      this.addCompVisible = true
    },
    onSearch() {
      let params = this.$refs.searchTop.getSearchParams()
      params.limit = this.$refs.table.Pagination.internalPageSize
      const fetch = service.salaryBusiness.payRequest.list
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
      // 保存
      this.$confirm(`您确认要对此单据进行撤回吗？`, `确认撤回`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn-custom-cancel',
        type: 'warning'
      })
        .then(async () => {
          await service.salaryBusiness.payRequest.revoke({
            billCode: row.billCode
          })
          this.$message.success('操作成功')
          // 刷新列表
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
