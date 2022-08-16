<!--
 * @Author: wqy
 * @Date: 2022-07-05 14:41:52
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-16 15:20:52
 * @FilePath: \personnelweb\src\views\staff\status\status.vue
 * @Description: 员工状态维护
-->

<template>
  <div class="container">
    <div class="content">
      <search-top
        ref="searchTop"
        :options="conditions"
        :defaultParams="defaultParams">
        <template #inlineBtn>
          <div class="flex flex-alignitems__center mg-l-12">
            <el-button type="primary" @click="onSearch">查询</el-button>
            <el-button type="primary" @click="onAdd">新增</el-button>
            <el-button type="primary" @click="onImport">导入</el-button>
            <el-button type="primary" @click="onApprove">审核</el-button>
            <el-button type="primary" @click="onRemove">删除</el-button>
          </div>
        </template>
      </search-top>
      <yid-table pagination :data="tableData" ref="table" class="mg-t-12">
        <yid-table-column
          label="单号"
          prop="billNo"
          width="130px"
          fixed></yid-table-column>
        <yid-table-column label="员工姓名" prop="eeName" width="80px" fixed>
        </yid-table-column>
        <yid-table-column
          label="员工编码"
          prop="eeCode"
          width="80px"
          fixed></yid-table-column>

        <yid-table-column label="原状态" prop="beStatus" width="80px" fixed>
          <template slot-scope="scope">
            {{
              scope.row.beStatus == 1
                ? '在职'
                : scope.row.beStatus == 2
                ? '离职'
                : scope.row.beStatus == 3
                ? '长假'
                : '其他'
            }}
          </template>
        </yid-table-column>
        <yid-table-column label="新状态" prop="afStatus" width="80px" fixed>
          <template slot-scope="scope">
            {{
              scope.row.afStatus == 1
                ? '在职'
                : scope.row.afStatus == 2
                ? '离职'
                : scope.row.afStatus == 3
                ? '长假'
                : '其他'
            }}
          </template>
        </yid-table-column>
        <yid-table-column label="离职原因" prop="maintenanceLeave" fixed>
          <template slot-scope="scope">
            {{
              scope.row.maintenanceLeave == '01'
                ? '正常离职'
                : scope.row.maintenanceLeave == '02'
                ? '无业绩离职'
                : scope.row.maintenanceLeave == '03'
                ? '分店报离'
                : ''
            }}
          </template>
        </yid-table-column>
        <yid-table-column label="批次" prop="batchNo" fixed></yid-table-column>

        <yid-table-column label="状态" prop="approvalStatus" width="80px" fixed>
          <template slot-scope="scope">
            {{
              scope.row.approvalStatus == 1
                ? '未审核'
                : scope.row.approvalStatus == 1
                ? '已审核'
                : scope.row.approvalStatus
            }}
          </template>
        </yid-table-column>
        <yid-table-column
          label="变动日期"
          prop="changeDate"
          width="150px"></yid-table-column>

        <yid-table-column
          label="机构编码"
          prop="bbCode"
          width="80px"></yid-table-column>
        <yid-table-column label="机构名称" prop="bbName"></yid-table-column>

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
          prop="approvalEeName"
          width="100px"></yid-table-column>
        <yid-table-column
          label="审批时间"
          prop="approvalTime"
          width="150px"></yid-table-column>
      </yid-table>
    </div>
    <el-dialog
      title="新增状态维护"
      :visible.sync="addCompVisible"
      :close-on-click-modal="false"
      append-to-body
      width="1200px">
      <add-comp
        v-if="addCompVisible"
        ref="addCompRef"
        :value="selectRow"
        :statusReasonList="statusReasonList" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit">确 定</el-button>
        <el-button @click="addCompVisible = false">取 消</el-button>
      </span>
    </el-dialog>
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
        :importAction="`${$yid.config.API.BASE}api-pers/employeestatemaintenance/convertSystem`"
        :downloadUrl="`${$yid.config.API.BASE}api-pers/employeestatemaintenance/downSysTemplate`"
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
          width: '14%' // 整个组件占的宽度
          // widgetWidth: '200px', // 控件的宽度
          // required: true // 是否必填
        },
        {
          label: '批次号',
          prop: 'batchNo',
          type: 'input',
          width: '15%'
        },
        {
          label: '机构编码',
          prop: 'bbCode',
          type: 'input',
          width: '15%'
        },
        {
          label: '离职原因',
          prop: 'maintenanceLeave',
          type: 'select',
          options: [
            { label: '正常离职', value: '01' },
            { label: '无业绩离职', value: '02' },
            { label: '分店报离', value: '03' }
          ],
          width: '14%'
        },
        {
          label: '审核状态',
          prop: 'approvalStatus',
          type: 'select',
          options: [
            { label: '未审核', value: 1 },
            { label: '已审核', value: 2 }
          ],
          width: '13%'
        }
      ],
      defaultParams: {
        approvalStatus: 1
      },
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
      statusReasonList: []
    }
  },
  created() {
    this.queryStatusReasonList()
  },
  mounted() {
    this.queryList()
  },
  methods: {
    async queryStatusReasonList() {
      const { data } = await service.dic.getStatusReasonList()
      this.statusReasonList = data
    },
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
    onApprove() {
      this.type = 'approve'
      this.removeCompVisible = true
    },
    onDelete() {},
    onSearch() {
      const params = this.$refs.searchTop.getSearchParams()
      params.limit = this.$refs.table.Pagination.internalPageSize
      const fetch = service.staff.status.billList
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
      await service.staff.status.saveBillsAndCensor({
        employeeStateMaintenanceVOS: params
      })
      this.handleImportSuccess()
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
    handleRemoveSuccess() {
      this.removeCompVisible = false
      this.queryList()
    },
    // 移除确定
    async onRemoveSubmit() {
      const result = await this.$refs.removeCompRef.getData()
      if (!result) {
        return
      }
      await service.staff.black.remove({
        removeRemark: result.reason,
        id: this.selectRow.id
      })
      this.$message.success('操作成功')
      this.removeCompVisible = false
      // 刷新列表
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
