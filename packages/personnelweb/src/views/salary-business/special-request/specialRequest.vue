<!--
 * @Author: wqy
 * @Date: 2022-07-21 14:36:13
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-02 16:32:48
 * @FilePath: \personnelweb\src\views\salary-business\special-request\specialRequest.vue
 * @Description: 
-->

<template>
  <div class="container">
    <el-collapse-transition>
      <div v-show="!addCompVisible" class="content">
        <search-top
          ref="searchTop"
          :options="conditions"
          :defaultParams="defaultParams">
          <template #inlineBtn>
            <div class="flex flex-alignitems__center mg-l-12">
              <el-button type="primary" @click="onSearch">查询</el-button>
              <el-button type="primary" @click="onReset">重置</el-button>
              <el-button type="primary" @click="onAdd">新增</el-button>
            </div>
          </template>
        </search-top>
        <yid-table pagination :data="tableData" ref="table" class="mg-t-12">
          <yid-table-column label="单号" prop="billCode" width="130px" fixed>
            <template slot-scope="scope">
              <el-link type="primary" @click="onShowDetail(scope.row)">{{
                scope.row.billCode
              }}</el-link>
            </template>
          </yid-table-column>
          <yid-table-column label="年" prop="year" width="80px" fixed>
          </yid-table-column>
          <yid-table-column label="月" prop="month" width="80px" fixed>
          </yid-table-column>
          <yid-table-column label="合计金额" prop="month" width="80px" fixed>
          </yid-table-column>
          <yid-table-column
            label="合计人数"
            prop="eeCode"
            width="80px"
            fixed></yid-table-column>
          <yid-table-column
            label="状态"
            prop="approvalStatus"
            width="80px"
            fixed>
            <template slot-scope="scope">
              {{
                scope.row.approvalStatus == 0
                  ? '已驳回'
                  : scope.row.approvalStatus == 1
                  ? '待提交'
                  : scope.row.approvalStatus == 2
                  ? '已提交'
                  : scope.row.approvalStatus == 3
                  ? '已审核'
                  : scope.row.approvalStatus == 4
                  ? '已复核'
                  : scope.row.approvalStatus
              }}
            </template>
          </yid-table-column>

          <yid-table-column label="驳回原因" prop="shopCode"></yid-table-column>

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
          <yid-table-column
            label="复核人"
            prop="updatedBy"
            width="100px"></yid-table-column>
          <yid-table-column
            label="复核时间"
            prop="approvalTime"
            width="150px"></yid-table-column>
          <yid-table-column label="操作" min-width="100" fixed="right">
            <!-- <template slot-scope="scope"> -->
            <!-- 待审核（只显示撤回、审核按钮） -->
            <template v-if="scope.row.approvalStatus == 2" slot-scope="scope">
              <el-tooltip effect="dark" content="撤回" placement="top">
                <i
                  class="el-icon-s-check c-pointer font-size-16rem"
                  @click="onReject(scope.row)"></i>
              </el-tooltip>
              <el-tooltip effect="dark" content="审核" placement="top">
                <i
                  class="el-icon-s-check c-pointer font-size-16rem"
                  @click="onApprove(scope.row)"></i>
              </el-tooltip>
            </template>
            <!-- 待提交（只显示编辑、删除按钮）-->
            <template v-if="scope.row.approvalStatus == 1" slot-scope="scope">
              <el-tooltip effect="dark" content="编辑" placement="top">
                <i
                  class="el-icon-edit c-pointer font-size-16rem mg-r-8"
                  @click="onEdit(scope.row)"></i>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除" placement="top">
                <i
                  class="el-icon-delete c-pointer font-size-16rem mg-r-8"
                  @click="onDelete(scope.row)"></i>
              </el-tooltip>
            </template>
            <!-- 已审核（不显示任何按钮） -->
            <!-- 已驳回（显示编辑、删除按钮） -->
            <template v-if="scope.row.approvalStatus == 0" slot-scope="scope">
              <el-tooltip effect="dark" content="编辑" placement="top">
                <i
                  class="el-icon-edit c-pointer font-size-16rem mg-r-8"
                  @click="onEdit(scope.row)"></i>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除" placement="top">
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
        :salcompData="salcompData"
        :asetofbooksData="asetofbooksData"
        :operateType="operateType"
        @back="addCompVisible = false" />
    </el-collapse-transition>
  </div>
</template>
<script>
import SearchTop from '@src/components/base/SearchTop'
import AddComp from './components/AddComp.vue'
// import RemoveComp from '@src/components/business/RemoveComp.vue'
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
          prop: 'mouth',
          type: 'input-number',
          labelWidth: '0.6rem',
          width: '12%',
          controls: false,
          min: 1,
          max: 12
        },
        {
          label: '开始创建时间',
          type: 'date',
          prop: 'createdTimeStart',
          width: '22%',
          labelWidth: '1.3rem',
          placeholder: '请选择',
          format: 'yyyy年MM月dd日',
          'value-format': 'yyyy-MM-dd'
        },
        {
          label: '结束创建时间',
          type: 'date',
          prop: 'createdTimeEnd',
          width: '22%',
          labelWidth: '1.3rem',
          placeholder: '请选择',
          format: 'yyyy年MM月dd日',
          'value-format': 'yyyy-MM-dd'
        },
        {
          label: '状态',
          prop: 'approvalStatus',
          type: 'select',
          labelWidth: '0.8rem',
          options: [
            { label: '已驳回', value: 0 },
            { label: '待提交', value: 1 },
            { label: '待审核', value: 2 },
            { label: '已审核', value: 3 },
            { label: '已复核', value: 4 }
          ],
          width: '12%'
        }
      ],
      defaultParams: {
        // approvalStatus: 1
      },
      tableData: [],
      salcompData: [],
      asetofbooksData: []
    }
  },
  created() {},
  mounted() {
    this.queryList()
  },
  computed: {},
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
    onReject(row) {
      this.$confirm(`您确认要对此单据进行撤回修改操作吗？`, `确认撤回`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn-custom-cancel',
        type: 'warning'
      })
        .then(async () => {
          // TODO
          return
          await service.staff.entry.remove(row.id)
          this.$message.success('操作成功')
          // 刷新列表
          await this.queryList()
        })
        .catch(() => {})
    },
    onApprove(row) {
      this.$confirm(`您确认要审核此条单据吗？`, `确认审核`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn-custom-cancel',
        type: 'warning'
      })
        .then(async () => {
          // TODO
          return
          await service.staff.entry.remove(row.id)
          this.$message.success('操作成功')
          // 刷新列表
          await this.queryList()
        })
        .catch(() => {})
    },
    onDelete() {},
    onSearch() {
      const params = this.$refs.searchTop.getSearchParams()
      params.isDel = '0'
      params.limit = this.$refs.table.Pagination.internalPageSize
      const fetch = service.salaryBusiness.specialRequest.list
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
    async onSubmit() {
      const result = await this.$refs.addCompRef.getData()
      console.log(result)
      if (!result) {
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
  .content {
    // flex: 1;
  }
}
</style>
