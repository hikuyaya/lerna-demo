<!--
 * @Author: wqy
 * @Date: 2022-08-01 15:28:26
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-25 15:48:44
 * @FilePath: \personnelweb\src\views\study-fund\leave\leave.vue
 * @Description: 离职学习金调整
-->
<template>
  <div class="container">
    <el-collapse-transition>
      <div v-if="!addCompVisible" class="content">
        <search-top
          ref="searchTop"
          :options="conditions"
          :defaultParams="defaultParams">
          <template #inlineBtn>
            <div class="flex flex-alignitems__center mg-l-12">
              <el-button type="primary" @click="onSearch">查询</el-button>
              <!-- <el-button type="primary" @click="onReset">重置</el-button> -->
              <!-- <el-button type="primary" @click="onAdd">新增</el-button> -->
              <el-button type="primary" @click="onImport">导入</el-button>
              <el-button type="primary" @click="onApprove()">审核</el-button>
              <el-button type="primary" @click="onRemove()">删除</el-button>
            </div>
          </template>
        </search-top>
        <yid-table pagination :data="tableData" ref="table" class="mg-t-12">
          <yid-table-column label="单号" prop="billCode" width="134px" fixed>
          </yid-table-column>
          <yid-table-column label="员工姓名" prop="eeName" width="100px" fixed>
          </yid-table-column>
          <yid-table-column
            label="员工编码"
            prop="eeCode"
            width="80px"
            fixed></yid-table-column>
          <yid-table-column label="批次号" prop="batchNo" width="100px" fixed>
            <template slot-scope="scope">
              <el-link type="primary" @click="onShowDetail(scope.row)">{{
                scope.row.batchNo
              }}</el-link>
            </template>
          </yid-table-column>
          <yid-table-column
            label="状态"
            prop="approvalStatus"
            width="80px"
            fixed>
            <template slot-scope="scope">
              <el-tag
                :type="
                  scope.row.approvalStatus === 2
                    ? 'primary'
                    : scope.row.approvalStatus === 3
                    ? 'success'
                    : 'info'
                "
                >{{
                  scope.row.approvalStatus === 2
                    ? '待审核'
                    : scope.row.approvalStatus == 3
                    ? '已审核'
                    : scope.row.approvalStatus
                }}</el-tag
              >
            </template>
          </yid-table-column>

          <yid-table-column
            label="学习金金额"
            prop="betutje"
            width="100px"></yid-table-column>
          <yid-table-column
            label="已完成缴纳金额"
            prop="betutjeCom"
            width="120px"></yid-table-column>
          <yid-table-column
            label="已退学习金"
            prop="betutjeRet"
            width="100px"></yid-table-column>
          <yid-table-column
            label="剩余缴纳学习金"
            prop="aftutjeCom"
            width="120px"></yid-table-column>
          <yid-table-column
            label="备注"
            prop="remark"
            width="200px"></yid-table-column>
          <yid-table-column label="学习金ID" prop="salId"></yid-table-column>

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
        :operateType="operateType"
        @back="handleBack"
        @success="handleAddSuccess" />
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
    <el-dialog
      title="批量导入"
      :visible.sync="importCompVisible"
      :close-on-click-modal="false"
      append-to-body
      width="800px">
      <import-comp
        v-if="importCompVisible"
        ref="importCompRef"
        :columns="importCompColumns"
        :failColumns="importCompFailColumns"
        :importAction="`${$yid.config.API.BASE}api-pers/eexxjadjbill/impData`"
        :downloadUrl="`${$yid.config.API.BASE}api-pers/template/downExcel`"
        :downloadParams="{
          templateName: '离职学习金调整模板.xls'
        }"
        @save="handleImportSave"
        @approve="handleImportApprove" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="importCompVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import SearchTop from '@src/components/base/SearchTop'
import AddComp from './components/AddComp.vue'
import RemoveComp from './components/RemoveComp.vue'
// import RemoveComp from '@src/components/business/RemoveComp.vue'
import ImportComp from '@src/components/business/ImportComp.vue'
import service from '@src/service'
export default {
  components: { SearchTop, AddComp, RemoveComp, ImportComp },
  data() {
    return {
      addCompVisible: false,
      removeCompVisible: false,
      importCompVisible: false,
      operateType: 'add',
      type: '', // approve 或者 remove
      selectRow: {},
      conditions: [
        {
          label: '员工姓名', // 标签
          prop: 'eeName', // 绑定的字段
          // label宽度
          type: 'input',
          width: '20%' // 整个组件占的宽度
          // widgetWidth: '200px', // 控件的宽度
          // required: true // 是否必填
        },
        {
          label: '员工编码',
          prop: 'eeCode',
          type: 'input',
          width: '20%'
        }
      ],
      defaultParams: {
        // approvalStatus: 2
      },
      importCompColumns: [
        { label: '员工编码', prop: 'eeCode' },
        { label: '员工姓名', prop: 'eeName' },
        {
          label: '学习金金额',
          prop: 'betutje'
        },
        {
          label: '已完成缴纳金额',
          prop: 'betutjeCom'
        },
        {
          label: '已退学习金',
          prop: 'betutjeRet'
        },
        {
          label: '备注',
          prop: 'remark'
        }
      ],

      tableData: [],
      salcompData: [],
      asetofbooksData: [
        {
          ssName: '美发工资帐套',
          ssCode: 'ZT0002'
        },
        {
          ssName: '美容工资帐套',
          ssCode: 'ZT0003'
        }
      ]
    }
  },
  created() {},
  mounted() {
    this.queryList()
  },
  computed: {
    importCompFailColumns: function () {
      return this.importCompColumns.concat([
        {
          label: '失败原因',
          prop: 'failmsg'
        }
      ])
    }
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
    onImport() {
      this.importCompVisible = true
    },
    async onReset() {
      this.$refs.searchTop.reset()
      this.onSearch()
    },
    onApprove(row) {
      if (row) {
        this.$confirm(
          `确认要对选择单据进行审核吗？审核后会立即生效`,
          `审核确认`,
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            cancelButtonClass: 'btn-custom-cancel',
            type: 'warning'
          }
        )
          .then(async () => {
            await service.salaryPlan.adjust.audSalBill({ id: row.id })
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
    onDelete(row) {
      if (row) {
        this.$confirm(`确认要对单据进行删除吗？`, `删除确认`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'btn-custom-cancel',
          type: 'warning'
        })
          .then(async () => {
            await service.salaryPlan.adjust.remove(row.id)
            this.$message.success('操作成功')
            // 刷新列表
            await this.queryList()
          })
          .catch(() => {})
      } else {
        this.type = 'remove'
        this.removeCompVisible = true
      }
    },
    onSearch() {
      const params = this.$refs.searchTop.getSearchParams()
      params.limit = this.$refs.table.Pagination.internalPageSize
      const fetch = service.studyFund.leave.list
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

      this.$confirm(`您确认保存此调整单信息吗？`, `确认保存`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn-custom-cancel',
        type: 'warning'
      })
        .then(async () => {
          await service.salaryPlan.adjust.save(result)
          this.$message.success('操作成功')
          this.addCompVisible = false
          // 刷新列表
          await this.queryList()
        })
        .catch(() => {})
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
    },
    onRemove() {
      this.type = 'remove'
      this.removeCompVisible = true
    },
    async handleImportSuccess() {
      this.importCompVisible = false
      await this.queryList()
    },
    async handleImportApprove(successData) {
      const params = this.$refs.importCompRef.successData
      await service.studyFund.leave.saveSudBill(successData)
      this.handleImportSuccess()
    },
    async handleImportSave(successData) {
      const params = this.$refs.importCompRef.successData
      await service.studyFund.leave.save(successData)
      this.handleImportSuccess()
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
  .content {
    // flex: 1;
  }
}
</style>
