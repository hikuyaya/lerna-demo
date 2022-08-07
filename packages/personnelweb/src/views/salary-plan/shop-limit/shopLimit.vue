<!--
 * @Author: wqy
 * @Date: 2022-07-21 14:22:23
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-07 17:31:49
 * @FilePath: \personnelweb\src\views\salary-plan\shop-limit\shopLimit.vue
 * @Description: 门店对公额度
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
          </div>
        </template>
      </search-top>
      <yid-table pagination :data="tableData" ref="table" class="mg-t-12">
        <yid-table-column
          label="门店编码"
          prop="shopCode"
          width="100px"></yid-table-column>
        <yid-table-column label="门店名称" prop="shopName"></yid-table-column>

        <yid-table-column
          label="年"
          prop="effectYear"
          width="60px"></yid-table-column>
        <yid-table-column
          label="月"
          prop="effectMonth"
          width="60px"></yid-table-column>
        <yid-table-column
          label="对公打款额度"
          prop="money"
          width="120px"></yid-table-column>
        <yid-table-column label="备注" prop="remark"></yid-table-column>

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
      :title="
        operateType === 'add'
          ? '新增'
          : operateType === 'edit'
          ? '修改'
          : '详情'
      "
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
        :importAction="`${$yid.config.API.BASE}api-pers/shoppublicsalary/validation`"
        :downloadUrl="`${$yid.config.API.BASE}api-pers/template/downExcel`"
        :downloadParams="{
          templateName: '门店对公额度模板.xls'
        }">
        <el-button type="primary" @click="handleImportSave">保存</el-button>
      </import-comp>
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
          label: '年',
          prop: 'effectYear',
          type: 'input-number',
          labelWidth: '0.6rem',
          controls: false,
          min: 1970,
          max: new Date().getFullYear(),
          width: '12%'
        },
        {
          label: '月',
          prop: 'effectMonth',
          type: 'input-number',
          labelWidth: '0.6rem',
          width: '12%',
          controls: false,
          min: 1,
          max: 12
        }
      ],
      importCompColumns: [
        { label: '门店编码', prop: 'shopCode' },
        { label: '门店名称', prop: 'shopName' },
        { label: '年', prop: 'effectYear' },
        { label: '月', prop: 'effectMonth' },
        { label: '对公打款额度', prop: 'money' }
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
    onSearch() {
      const params = this.$refs.searchTop.getSearchParams()
      params.limit = this.$refs.table.Pagination.internalPageSize
      const fetch = service.salaryPlan.shopLimit.list
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

      this.$confirm(`您确认要保存此信息吗？`, `确认保存`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn-custom-cancel',
        type: 'warning'
      })
        .then(async () => {
          await service.salaryPlan.shopLimit.save(result)
          this.$message.success('操作成功')
          this.addCompVisible = false
          // 刷新列表
          await this.queryList()
        })
        .catch(() => {})
    },
    async handleImportSuccess() {
      this.importCompVisible = false
      this.$message.success('操作成功')
      await this.queryList()
    },
    async handleImportSave() {
      const flag = this.$refs.importCompRef.validateSave()
      if (!flag) {
        return
      }
      const params = new FormData()
      params.append('file', this.$refs.importCompRef.file)
      await service.salaryPlan.shopLimit.importExcel(params)
      this.handleImportSuccess()
    }
  },
  computed: {
    importCompFailColumns: function () {
      return this.importCompColumns.concat([
        { label: '失败原因', prop: 'errorMessage' }
      ])
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
