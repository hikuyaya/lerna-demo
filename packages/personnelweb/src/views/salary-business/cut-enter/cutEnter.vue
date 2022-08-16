<!--
 * @Author: wqy
 * @Date: 2022-07-21 14:39:38
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-16 15:19:58
 * @FilePath: \personnelweb\src\views\salary-business\cut-enter\cutEnter.vue
 * @Description: 
-->

<template>
  <div class="container">
    <el-collapse-transition>
      <div v-show="!addCompVisible" class="content">
        <search-top
          ref="searchTop"
          :options="conditions"
          :advanceOptions="advanceConditions">
          <template #inlineBtn>
            <div class="flex flex-alignitems__center mg-l-12">
              <el-button type="primary" @click="onSearch">查询</el-button>
              <el-button type="primary" @click="onReset">重置</el-button>
              <el-button type="primary" @click="onAdd">新增</el-button>
              <el-button type="primary" @click="onApprove">审核</el-button>
              <el-button type="primary" @click="onRemove">删除</el-button>
            </div>
          </template>
        </search-top>
        <yid-table pagination :data="tableData" ref="table" class="mg-t-12">
          <yid-table-column label="单号" prop="billCode" width="140px" fixed>
          </yid-table-column>
          <yid-table-column
            label="门店编码"
            prop="shopCode"
            fixed></yid-table-column>
          <yid-table-column
            label="门店名称"
            prop="shopName"
            width="120px"
            fixed></yid-table-column>
          <yid-table-column label="年" prop="year" fixed></yid-table-column>
          <yid-table-column label="月" prop="month" fixed></yid-table-column>
          <yid-table-column
            label="员工姓名"
            prop="eeName"
            fixed></yid-table-column>
          <yid-table-column
            label="员工编码"
            prop="eeCode"
            fixed></yid-table-column>
          <yid-table-column
            label="合计金额"
            prop="moneyTotal"
            width="100px"
            fixed></yid-table-column>

          <yid-table-column label="批次号" prop="batchNo" fixed>
            <template slot-scope="scope">
              <el-link type="primary" @click="onShowDetail(scope.row)">{{
                scope.row.batchNo
              }}</el-link>
            </template>
          </yid-table-column>

          <yid-table-column label="状态" prop="approvalStatus" width="100px">
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
        </yid-table>
      </div>
    </el-collapse-transition>
    <el-collapse-transition>
      <add-comp
        v-if="addCompVisible"
        ref="addCompRef"
        :value="selectRow"
        :menuId="menuId"
        :operateType="operateType"
        :searchType="searchType"
        @back="addCompVisible = false"
        @success="handleSaveSuccess" />
    </el-collapse-transition>

    <el-dialog
      :title="`批量${type === 'approve' ? '审核' : '删除'}`"
      :visible.sync="removeCompVisible"
      :close-on-click-modal="false"
      append-to-body
      width="420px">
      <remove-comp
        v-if="removeCompVisible"
        ref="removeCompRef"
        :type="type"
        @refresh="handleRemoveSuccess" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="removeCompVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import SearchTop from '@src/components/base/SearchTop'
import AddComp from './components/AddComp'
import RemoveComp from './components/RemoveComp.vue'
import service from '@src/service'
import { mapGetters } from 'vuex'
export default {
  components: { SearchTop, AddComp, RemoveComp },
  data() {
    return {
      addCompVisible: false,
      importCompVisible: false,
      removeCompVisible: false,
      operateType: 'add',
      type: '', // approve 或者 remove
      searchType: 2,
      selectRow: {},
      menuId: '',
      conditions: [
        {
          label: '门店编码',
          prop: 'shopCode',
          type: 'input',
          width: '20%'
        },
        {
          label: '状态',
          prop: 'approvalStatus',
          type: 'select', // 搜索类型
          labelWidth: '0.8rem',
          width: '20%',
          options: [
            { label: '待审核', value: 1 },
            { label: '已审核', value: 2 }
          ]
        }
      ],
      advanceConditions: [
        {
          label: '年',
          prop: 'year',
          type: 'input-number',
          labelWidth: '1rem',
          controls: false,
          min: 1970,
          max: new Date().getFullYear(),
          width: '20%'
        },
        {
          label: '月',
          prop: 'month',
          type: 'input-number',
          labelWidth: '0.8rem',
          width: '20%',
          controls: false,
          min: 1,
          max: 12
        },
        {
          label: '员工姓名',
          prop: 'eeName',
          type: 'input', // 搜索类型
          labelWidth: '1.2rem',
          width: '20%'
        },
        {
          label: '员工编码',
          prop: 'eeCode',
          type: 'input', // 搜索类型
          labelWidth: '1.2rem',
          width: '20%'
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
    this.searchType = window.location.href.indexOf('bonus-enter') !== -1 ? 1 : 2
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
    onSearch() {
      let params = this.$refs.searchTop.getSearchParams()
      params.isDel = 0
      params.type = this.searchType // 1 奖金 2 扣款
      params.limit = this.$refs.table.Pagination.internalPageSize

      const fetch = service.salaryBusiness.cutEnter.list
      this.$refs.table.reloadData({
        fetch,
        params
      })
    },
    onApprove() {
      this.type = 'approve'
      this.removeCompVisible = true
    },
    onRemove() {
      this.type = 'remove'
      this.removeCompVisible = true
    },
    async handleSaveSuccess() {
      this.addCompVisible = false
      await this.queryList()
    },
    handleRemoveSuccess() {
      this.removeCompVisible = false
      this.queryList()
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
