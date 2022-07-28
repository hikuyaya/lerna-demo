<!--
 * @Author: wqy
 * @Date: 2022-07-05 14:39:40
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-28 14:24:39
 * @FilePath: \personnelweb\src\views\staff\level\level.vue
 * @Description: 员工级别维护
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
          prop="billCode"
          width="130px"
          fixed></yid-table-column>
        <yid-table-column label="员工姓名" prop="eeName" width="80px" fixed>
        </yid-table-column>
        <yid-table-column
          label="员工编码"
          prop="eeCode"
          width="80px"
          fixed></yid-table-column>
        <yid-table-column
          label="机构编码"
          prop="regionCode"
          width="80px"
          fixed></yid-table-column>
        <yid-table-column
          label="机构名称"
          prop="regionName"
          fixed></yid-table-column>
        <yid-table-column label="职务名称" prop="positionName" fixed>
        </yid-table-column>
        <yid-table-column
          label="批次号"
          prop="batchNo"
          width="80px"
          fixed></yid-table-column>
        <yid-table-column label="状态" prop="approvalStatus" width="80px" fixed>
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
                  : '其他'
              }}</el-tag
            >
          </template>
        </yid-table-column>
        <yid-table-column
          label="原职务级别"
          prop="bePslName"
          width="100px"></yid-table-column>
        <yid-table-column
          label="新职务级别"
          prop="afPslName"
          width="100px"></yid-table-column>
        <yid-table-column
          label="原职务级别1"
          prop="bePslcode1Name"
          width="100px"></yid-table-column>
        <yid-table-column
          label="新职务级别1"
          prop="afPslcode1Name"
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
          prop="approvalEeName"
          width="100px"></yid-table-column>
        <yid-table-column
          label="审批时间"
          prop="approvalTime"
          width="150px"></yid-table-column>
      </yid-table>
    </div>
    <el-dialog
      title="级别维护"
      :visible.sync="addCompVisible"
      :close-on-click-modal="false"
      append-to-body
      width="1300px">
      <add-comp v-if="addCompVisible" ref="addCompRef" :value="selectRow" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit(0)">保 存</el-button>
        <el-button type="primary" @click="onSubmit(1)">保存并审核</el-button>
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
        :importAction="`${$yid.config.API.BASE}api-pers/employeeLevelMaintenance/validate`"
        :downloadUrl="`${$yid.config.API.BASE}api-pers/template/downExcel`"
        :downloadParams="{
          templateName: '员工级别维护模板.xls'
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
          prop: 'regionCode',
          type: 'input',
          width: '15%'
        },
        {
          label: '状态',
          prop: 'approvalStatus',
          type: 'select',
          labelWidth: '0.8rem',
          options: [
            { label: '所有', value: '' },
            { label: '待审核', value: 2 },
            { label: '已审核', value: 3 }
          ],
          width: '12%'
        }
      ],
      importCompColumns: [
        { label: '员工编码', prop: 'eeCode' },
        { label: '员工姓名', prop: 'eeName' },
        { label: '组织编码', prop: 'regionCode' },
        { label: '职务编码', prop: 'positionCode' },
        { label: '新级别等级', prop: 'afPslLevel' },
        { label: '新级别1等级', prop: 'afPsllevel1' }
      ],
      tableData: []
    }
  },
  computed: {
    importCompFailColumns: function () {
      return this.importCompColumns.concat([
        { label: '失败原因', prop: 'errorMessageList' }
      ])
    }
  },
  mounted() {
    this.queryLevelList()
  },
  methods: {
    queryLevelList() {
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
      const fetch = service.staff.level.list
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
    async onSubmit(isApproval) {
      const result = this.$refs.addCompRef.getData()
      console.log(result)
      if (!result.length) {
        this.$message.error('请选择员工')
        return
      }
      await service.staff.level.save({
        isApproval,
        employeeLevelMaintenanceList: result
      })
      this.$message.success('操作成功')
      this.addCompVisible = false
      // 刷新列表
      await this.queryLevelList()
    },
    onRemove() {
      this.type = 'remove'
      this.removeCompVisible = true
    },
    async handleImportSuccess() {
      this.importCompVisible = false
      await this.queryLevelList()
    },
    async handleImportSave(successData, file) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('isApproval', 0)
      await service.staff.level.importData(formData)
      this.handleImportSuccess()
    },
    async handleImportApprove(successData, file) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('isApproval', 1)
      await service.staff.level.importData(formData)
      this.handleImportSuccess()
    },
    handleRemoveSuccess() {
      this.removeCompVisible = false
      this.queryLevelList()
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
      this.queryLevelList()
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
