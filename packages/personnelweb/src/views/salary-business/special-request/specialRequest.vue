<!--
 * @Author: wqy
 * @Date: 2022-07-21 14:36:13
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-07 17:37:30
 * @FilePath: \personnelweb\src\views\salary-business\special-request\specialRequest.vue
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
          <yid-table-column label="单号" prop="billCode" width="150px" fixed>
            <template slot-scope="scope">
              <el-link type="primary" @click="onShowDetail(scope.row)">{{
                scope.row.billCode
              }}</el-link>
            </template>
          </yid-table-column>
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
            label="驳回原因"
            prop="backReason"
            width="120px"></yid-table-column>

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
                content="撤回"
                placement="top">
                <i
                  class="el-icon-s-release c-pointer mg-r-8 font-size-16rem"
                  @click="onReject(scope.row)"></i>
              </el-tooltip>

              <!-- 待提交（只显示编辑、删除按钮）、已驳回（显示编辑、删除按钮） -->
              <el-tooltip
                v-if="[0, 1].includes(scope.row.approvalStatus)"
                effect="dark"
                content="编辑"
                placement="top">
                <i
                  class="el-icon-edit c-pointer mg-r-8 font-size-16rem"
                  @click="onEdit(scope.row)"></i>
              </el-tooltip>
              <el-tooltip
                v-if="[0, 1].includes(scope.row.approvalStatus)"
                effect="dark"
                content="删除"
                placement="top">
                <i
                  class="el-icon-delete c-pointer font-size-16rem mg-r-8"
                  @click="onDelete(scope.row)"></i>
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
  </div>
</template>
<script>
import SearchTop from '@src/components/base/SearchTop'
import AddComp from './components/AddComp'
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
          prop: 'time',
          type: 'daterange',
          width: '34%',
          labelWidth: '1.4rem'
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
        }
      ],
      tableData: [],
      salcompSpecList: []
    }
  },
  created() {},
  mounted() {
    this.querySalcompSpecList()
    this.queryList()
  },
  methods: {
    async querySalcompSpecList() {
      const { data } =
        await service.salaryBusiness.specialRequest.getSalcompSpecList()
      this.salcompSpecList = data
    },
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
      params.limit = this.$refs.table.Pagination.internalPageSize
      if (params.time?.length) {
        const [createdTimeStart, createdTimeEnd] = params.time
        params.createdTimeStart = createdTimeStart
        params.createdTimeEnd = createdTimeEnd
        delete params.time
      }
      const fetch = service.salaryBusiness.specialRequest.list
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
