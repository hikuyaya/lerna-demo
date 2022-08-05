<!--
 * @Author: wqy
 * @Date: 2022-08-01 15:27:41
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-05 16:06:40
 * @FilePath: \personnelweb\src\views\study-fund\refund\refund.vue
 * @Description: 学习金退费名单
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
            <el-button type="primary" @click="onReset">重置</el-button>
            <!-- <el-button type="primary" @click="onAdd">新增</el-button> -->
            <!-- <el-button type="primary" @click="onImport">导入</el-button> -->
            <el-button type="primary" @click="onExport">导出</el-button>
          </div>
        </template>
      </search-top>
      <yid-table pagination :data="tableData" ref="table" class="mg-t-12">
        <yid-table-column label="门店编码" prop="shopCode" width="100px" fixed>
        </yid-table-column>
        <yid-table-column label="门店名称" prop="shopName" width="120px" fixed>
        </yid-table-column>
        <yid-table-column
          label="员工编码"
          prop="eeCode"
          width="80px"
          fixed></yid-table-column>
        <yid-table-column
          label="员工姓名"
          prop="eeName"
          width="100px"
          fixed></yid-table-column>
        <yid-table-column
          label="性别"
          prop="sex"
          width="100px"
          fixed></yid-table-column>
        <yid-table-column
          label="职务"
          prop="psName"
          width="120px"
          fixed></yid-table-column>

        <yid-table-column
          label="退费历史"
          prop="betutjeRet"
          width="100px"></yid-table-column>
        <yid-table-column
          label="证件号"
          prop="remark"
          width="200px"></yid-table-column>
        <yid-table-column
          label="银行卡号"
          prop="remark"
          width="200px"></yid-table-column>
        <yid-table-column
          label="银行"
          prop="bandCode"
          width="120px"></yid-table-column>

        <yid-table-column
          label="学习金金额"
          prop="betutje"
          width="100px"></yid-table-column>
        <yid-table-column
          label="已缴纳学习金"
          prop="betutjeCom"
          width="120px"></yid-table-column>

        <yid-table-column
          label="入职日期"
          prop="createdTime"
          width="150px"></yid-table-column>
        <yid-table-column
          label="离职日期"
          prop="approvalTime"
          width="150px"></yid-table-column>
        <yid-table-column
          label="联系电话"
          prop="approvalTime"
          width="120px"></yid-table-column>
        <yid-table-column
          label="汇款账户名"
          prop="approvalTime"
          width="120px"></yid-table-column>
      </yid-table>
    </div>

    <el-dialog
      title="新增状态维护"
      :visible.sync="addCompVisible"
      :close-on-click-modal="false"
      append-to-body
      width="1200px">
      <add-comp v-if="addCompVisible" ref="addCompRef" :value="selectRow" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit">确 定</el-button>
        <el-button @click="addCompVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import SearchTop from '@src/components/base/SearchTop'
// import RemoveComp from '@src/components/business/RemoveComp.vue'
import service from '@src/service'
export default {
  components: { SearchTop },
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
          label: '离职创建日期',
          prop: 'time',
          type: 'daterange',
          width: '34%',
          labelWidth: '1.4rem',
          required: true
        },
        {
          label: '门店类型',
          prop: 'type',
          type: 'select',
          options: [
            { label: '美发门店', value: '1' },
            { label: '美容门店', value: '2' }
          ],
          width: '15%'
        },
        {
          label: '门店编码',
          prop: 'eeCode',
          type: 'input',
          width: '18%'
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
          width: '15%'
        }
      ],
      defaultParams: {
        // approvalStatus: 2
      },
      tableData: [],
      salcompData: []
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
    async onExport() {
      await service.studyFund.refund.expEesaltk()
    },
    async onReset() {
      this.$refs.searchTop.reset()
      this.onSearch()
    },
    onSearch() {
      let params = this.$refs.searchTop.getSearchParams()
      if (!params.time?.length) {
        this.$message.error('请选择离职创建时间！')
        return
      }
      const [startTime, endTime] = params.time
      params.startTime = startTime
      params.endTime = endTime
      delete params.time
      params.limit = this.$refs.table.Pagination.internalPageSize
      const fetch = service.studyFund.refund.list
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
