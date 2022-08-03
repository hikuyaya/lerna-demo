<!--
 * @Author: wqy
 * @Date: 2022-07-21 14:18:48
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-02 17:27:46
 * @FilePath: \personnelweb\src\views\salary-plan\adjust\adjust.vue
 * @Description: 
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
        <yid-table-column label="单号" prop="billCode" width="130px" fixed>
          <template slot-scope="scope">
            <el-link type="primary" @click="onShowDetail(scope.row)">{{
              scope.row.billCode
            }}</el-link>
          </template>
        </yid-table-column>
        <yid-table-column label="员工姓名" prop="eeName" width="80px" fixed>
        </yid-table-column>
        <yid-table-column
          label="员工编码"
          prop="eeCode"
          width="80px"
          fixed></yid-table-column>
        <yid-table-column
          label="批次号"
          prop="batchNo"
          width="100px"
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
                  : scope.row.approvalStatus
              }}</el-tag
            >
          </template>
        </yid-table-column>

        <yid-table-column
          label="门店编码"
          prop="shopCode"
          width="80px"></yid-table-column>
        <yid-table-column
          label="门店名称"
          prop="shopName"
          width="80px"></yid-table-column>
        <yid-table-column label="来源" prop="sourceType" width="60px">
          <template slot-scope="scope">
            {{
              scope.row.sourceType == 1
                ? '手动'
                : scope.row.sourceType == 2
                ? '同步'
                : scope.row.sourceType
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
          label="修改人"
          prop="updatedBy"
          width="100px"></yid-table-column>
        <yid-table-column
          label="修改时间"
          prop="approvalTime"
          width="150px"></yid-table-column>
        <yid-table-column
          label="审批人"
          prop="approvalEename"
          width="100px"></yid-table-column>
        <yid-table-column
          label="审批时间"
          prop="approvalTime"
          width="150px"></yid-table-column>
        <yid-table-column label="操作" min-width="100" fixed="right">
          <template slot-scope="scope">
            <!-- <template v-if="scope.row.approvalStatus === 2" slot-scope="scope"> -->
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
            <el-tooltip effect="dark" content="审核" placement="top">
              <i
                class="el-icon-s-check c-pointer font-size-16rem"
                @click="onApprove(scope.row)"></i>
            </el-tooltip>
          </template>
        </yid-table-column>
      </yid-table>
    </div>
    <el-dialog
      title="新增"
      :visible.sync="addCompVisible"
      :close-on-click-modal="false"
      append-to-body
      width="1200px">
      <add-comp
        v-if="addCompVisible"
        ref="addCompRef"
        :value="selectRow"
        :salcompData="salcompData"
        :asetofbooksData="asetofbooksData"
        :operateType="operateType" />
      <span slot="footer" class="dialog-footer" v-if="operateType === 'detail'">
        <el-button @click="addCompVisible = false">关 闭</el-button>
      </span>
      <span slot="footer" class="dialog-footer" v-else>
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
      width="1200px">
      <import-comp
        v-if="importCompVisible"
        ref="importCompRef"
        :columns="importCompColumns"
        :failColumns="importCompFailColumns"
        :importAction="`${$yid.config.API.BASE}api-pers/employeesalbill/checkSalBill`"
        :downloadUrl="`${$yid.config.API.BASE}api-pers/template/downExcel`"
        :downloadParams="{
          templateName: '薪酬调整单模板.xls'
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
          width: '15%' // 整个组件占的宽度
          // widgetWidth: '200px', // 控件的宽度
          // required: true // 是否必填
        },
        {
          label: '员工编码',
          prop: 'eeCode',
          type: 'input',
          width: '15%'
        },
        {
          label: '门店编码',
          prop: 'shopCode',
          type: 'input',
          width: '15%'
        },
        {
          label: '门店名称',
          prop: 'shopName',
          type: 'input',
          width: '15%'
        },
        {
          label: '状态',
          prop: 'approvalStatus',
          type: 'select',
          labelWidth: '0.8rem',
          options: [
            { label: '待审核', value: 2 },
            { label: '已审核', value: 3 }
          ],
          width: '12%'
        }
      ],
      defaultParams: {
        approvalStatus: 2
      },
      importCompColumns: [
        { label: '员工编码', prop: 'eeCode' },
        { label: '员工姓名', prop: 'eeName' },
        {
          label: '类型',
          prop: 'scName'
        },
        {
          label: '申请金额',
          prop: 'money'
        },
        {
          label: '时效',
          prop: 'typename'
        },
        {
          label: '执行开始',
          prop: 'startTime'
        },
        {
          label: '执行结束',
          prop: 'endTime'
        },
        {
          label: '备注',
          prop: 'memo'
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
  created() {
    this.querySalcomp()
    // this.queryAsetofbooks()
  },
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
    async querySalcomp() {
      // 查询固定项
      const { data } = await service.salarySetting.composition.all({
        inputType: 1
      })
      this.salcompData = data
    },
    async queryAsetofbooks() {
      const { data } = await service.salarySetting.asetofbooks.list({
        page: 1,
        limit: 1000
      })
      this.asetofbooksData = data
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
    onDelete() {
      this.type = 'remove'
      this.removeCompVisible = true
    },
    onSearch() {
      const params = this.$refs.searchTop.getSearchParams()
      params.limit = this.$refs.table.Pagination.internalPageSize
      const fetch = service.salaryPlan.adjust.list
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
