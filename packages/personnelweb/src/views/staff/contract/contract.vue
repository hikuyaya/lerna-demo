<!--
 * @Author: wqy
 * @Date: 2022-07-05 14:44:45
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-16 15:21:43
 * @FilePath: \personnelweb\src\views\staff\contract\contract.vue
 * @Description: 合同状态维护
-->
<template>
  <div class="container">
    <div class="content">
      <search-top ref="searchTop" :options="conditions">
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
                ? '有效'
                : scope.row.beStatus == 2
                ? '无效'
                : scope.row.beStatus == 3
                ? '到期'
                : scope.row.beStatus == 4
                ? '其他'
                : ''
            }}
          </template>
        </yid-table-column>
        <yid-table-column label="新状态" prop="status2" width="80px" fixed>
          <template slot-scope="scope">
            {{
              scope.row.status2 == 1
                ? '有效'
                : scope.row.status2 == 2
                ? '无效'
                : scope.row.status2 == 3
                ? '到期'
                : scope.row.status2 == 4
                ? '其他'
                : ''
            }}
          </template>
        </yid-table-column>
        <yid-table-column
          label="批次号"
          prop="batchNo"
          width="80px"
          fixed></yid-table-column>
        <yid-table-column label="状态" prop="approvalStatus" width="80px" fixed>
          <template slot-scope="scope">
            {{
              scope.row.approvalStatus == 1
                ? '未审核'
                : scope.row.approvalStatus == 2
                ? '已审核'
                : scope.row.approvalStatus
            }}
          </template>
        </yid-table-column>
        <yid-table-column
          label="合同生效日"
          prop="contdatestart"
          width="100px"></yid-table-column>
        <yid-table-column
          label="合同有效期"
          prop="htdate"
          width="100px"></yid-table-column>
        <yid-table-column
          label="机构编码"
          prop="regionCode"
          width="100px"></yid-table-column>
        <yid-table-column
          label="机构名称"
          prop="regionName"
          width="100px"></yid-table-column>

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
        <yid-table-column label="报备原因" prop="remark"></yid-table-column>
      </yid-table>
    </div>
    <el-dialog
      title="员工合同状态维护"
      :visible.sync="addCompVisible"
      :close-on-click-modal="false"
      append-to-body
      width="1300px">
      <add-comp
        v-if="addCompVisible"
        ref="addCompRef"
        :value="selectRow"
        :operateType="operateType" />
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
        :importAction="`${$yid.config.API.BASE}api-pers/employeecontractmaintenance/convertSystem`"
        :downloadUrl="`${$yid.config.API.BASE}api-pers/employeecontractmaintenance/downSysTemplate`"
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
          width: '15%' // 整个组件占的宽度
          // widgetWidth: '200px', // 控件的宽度
          // required: true // 是否必填
        },
        {
          label: '员工编码',
          prop: 'eeCode',
          type: 'input', // 搜索类型
          width: '15%'
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
          label: '状态',
          prop: 'approvalStatus',
          type: 'select',
          labelWidth: '0.8rem',
          options: [
            { label: '未审核', value: '1' },
            { label: '已审核', value: '2' }
          ],
          width: '12%'
        }
      ],
      tableData: [],
      importCompColumns: [
        { prop: 'eeName', label: '员工姓名' },
        { prop: 'eeCode', label: '员工编码' },
        {
          prop: 'beStatus',
          label: '原状态',
          render: row => {
            if (row.beStatus == 1) {
              return '有效'
            } else if (row.beStatus == 2) {
              return '无效'
            } else if (row.beStatus == 3) {
              return '到期'
            } else {
              return ''
            }
          }
        },
        {
          prop: 'status2',
          label: '新状态',
          render: row => {
            if (row.status2 == 1) {
              return '有效'
            } else if (row.status2 == 2) {
              return '无效'
            } else if (row.status2 == 3) {
              return '到期'
            } else {
              return ''
            }
          }
        },
        {
          prop: 'remark',
          label: '备注'
        },
        {
          prop: 'htdate',
          label: '合同结束日期'
        }
      ],
      importCompFailColumns: [
        { prop: 'eeName', label: '员工姓名' },
        { prop: 'eeCode', label: '员工编码' },
        {
          prop: 'beStatus',
          label: '原状态'
        },
        {
          prop: 'status2',
          label: '新状态'
        },
        {
          prop: 'remark',
          label: '备注'
        },
        {
          prop: 'htdate',
          label: '合同结束日期'
        },
        { label: '失败原因', prop: 'failwhy' }
      ]
    }
  },
  mounted() {
    this.queryContractList()
  },
  methods: {
    queryContractList() {
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
      params.isDel = '0'
      params.limit = this.$refs.table.Pagination.internalPageSize
      const fetch = service.staff.contract.list
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
      await service.staff.contract.save({
        employeeContractMaintenances: result
      })
      this.$message.success('操作成功')
      this.addCompVisible = false
      // 刷新列表
      await this.queryContractList()
    },
    onRemove() {
      this.type = 'remove'
      this.removeCompVisible = true
    },
    async handleImportSuccess() {
      this.importCompVisible = false
      await this.queryContractList()
    },
    async handleImportApprove(successData) {
      const params = successData.map(v => {
        return {
          ...v,
          regionCode: v.regionCode
        }
      })
      await service.staff.contract.saveBillsAndCensor({
        employeeContractMaintenances: params
      })
      this.handleImportSuccess()
    },
    async handleImportSave(successData) {
      const params = successData.map(v => {
        return {
          ...v,
          regionCode: v.regionCode
        }
      })
      await service.staff.contract.save({
        employeeContractMaintenances: params
      })
      this.handleImportSuccess()
    },
    handleRemoveSuccess() {
      this.removeCompVisible = false
      this.queryContractList()
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
      this.queryContractList()
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
