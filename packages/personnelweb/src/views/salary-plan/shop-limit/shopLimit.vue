<!--
 * @Author: wqy
 * @Date: 2022-07-21 14:22:23
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-25 11:11:11
 * @FilePath: \personnelweb\src\views\salary-plan\shop-limit\shopLimit.vue
 * @Description: 门店对公额度
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
          </div>
        </template>
      </search-top>
      <yid-table pagination :data="tableData" ref="table" class="mg-t-12">
        <yid-table-column
          label="门店编码"
          prop="batchNo"
          width="100px"></yid-table-column>
        <yid-table-column label="门店名称" prop="batchNo"></yid-table-column>

        <yid-table-column
          label="年"
          prop="year"
          width="60px"></yid-table-column>
        <yid-table-column
          label="月"
          prop="month"
          width="60px"></yid-table-column>
        <yid-table-column
          label="对公打款额度"
          prop="month"
          width="120px"></yid-table-column>
        <yid-table-column label="备注" prop="month"></yid-table-column>

        <yid-table-column
          label="创建人"
          prop="createdBy"
          width="100px"></yid-table-column>
        <yid-table-column
          label="创建时间"
          prop="createdTime"
          width="150px"></yid-table-column>
      </yid-table>
    </div>
    <el-dialog
      title="新增"
      :visible.sync="addCompVisible"
      :close-on-click-modal="false"
      append-to-body
      width="800px">
      <add-comp v-if="addCompVisible" ref="addCompRef" :value="selectRow" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit">确 定</el-button>
        <el-button @click="addCompVisible = false">取 消</el-button>
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
import ImportComp from '@src/components/business/ImportComp.vue'
import service from '@src/service'
export default {
  components: { SearchTop, AddComp, ImportComp },
  data() {
    return {
      addCompVisible: false,
      importCompVisible: false,
      operateType: 'add',
      type: '', // approve 或者 remove
      selectRow: {},
      conditions: [
        {
          label: '门店编码',
          prop: 'bbCode',
          type: 'input',
          width: '15%'
        },
        {
          label: '门店名称',
          prop: 'bbCode',
          type: 'input',
          width: '15%'
        },
        {
          label: '年',
          prop: 'year',
          type: 'input',
          labelWidth: '0.6rem',
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
      tableData: []
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
    onImport() {
      this.importCompVisible = true
    },
    onDelete() {},
    onSearch() {
      const params = this.$refs.searchTop.getSearchParams()
      params.limit = this.$refs.table.Pagination.internalPageSize
      const fetch = service.staff.status.list
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
