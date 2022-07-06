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
            <el-button type="primary" @click="onDelete">删除</el-button>
          </div>
        </template>
      </search-top>
      <yid-table pagination :data="tableData" ref="table" class="mg-t-12">
        <yid-table-column label="单号" prop="eeName" fixed></yid-table-column>
        <yid-table-column label="员工姓名" prop="eeName" width="100px" fixed>
        </yid-table-column>
        <yid-table-column
          label="员工编码"
          prop="eeCode"
          width="80px"
          fixed></yid-table-column>
        <yid-table-column
          label="原状态"
          prop="idCard"
          width="150px"
          fixed></yid-table-column>
        <yid-table-column
          label="新状态"
          prop="idCard"
          width="150px"
          fixed></yid-table-column>
        <yid-table-column
          label="批次号"
          prop="idCard"
          width="150px"
          fixed></yid-table-column>
        <yid-table-column label="状态" prop="status" width="70px" fixed>
          <template slot-scope="scope">
            {{
              scope.row.status == 1
                ? '有效'
                : scope.row.status == 2
                ? '无效'
                : '未知'
            }}
          </template>
        </yid-table-column>
        <yid-table-column
          label="合同生效日"
          prop="createdBy"
          width="100px"></yid-table-column>
        <yid-table-column
          label="合同结束日"
          prop="createdBy"
          width="100px"></yid-table-column>
        <yid-table-column
          label="机构编码"
          prop="createdBy"
          width="100px"></yid-table-column>
        <yid-table-column
          label="机构名称"
          prop="createdBy"
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
          prop="removeBy"
          width="100px"></yid-table-column>
        <yid-table-column
          label="审批时间"
          prop="removeDate"
          width="150px"></yid-table-column>
        <yid-table-column label="报备原因" prop="addRemark"></yid-table-column>
      </yid-table>
    </div>
    <el-dialog
      title="员工合同状态维护"
      :visible.sync="addCompVisible"
      :close-on-click-modal="false"
      append-to-body
      width="1200px">
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
      title="移除黑名单确认"
      :visible.sync="removeCompVisible"
      :close-on-click-modal="false"
      append-to-body
      width="380px">
      <!-- <remove-comp v-if="removeCompVisible" ref="removeCompRef" /> -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onRemoveSubmit">确 定</el-button>
        <el-button @click="removeCompVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import SearchTop from '@src/components/base/SearchTop'
import AddComp from './components/AddComp.vue'
// import RemoveComp from './components/RemoveComp.vue'
import service from '@src/service'
export default {
  components: { SearchTop, AddComp },
  data() {
    return {
      addCompVisible: false,
      removeCompVisible: false,
      operateType: 'add',
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
          prop: 'idCard',
          type: 'input',
          width: '15%'
        },
        {
          label: '机构编码',
          prop: 'e',
          type: 'input',
          width: '15%'
        },
        {
          label: '状态',
          prop: 'status',
          type: 'select',
          labelWidth: '0.8rem',
          options: [
            { label: '所有', value: '' },
            { label: '有效', value: '1' },
            { label: '无效', value: '2' }
          ],
          width: '12%'
        }
      ],
      tableData: []
    }
  },
  mounted() {
    this.queryBlackList()
  },
  methods: {
    queryBlackList() {
      this.onSearch()
    },
    onOpenAdvance() {},
    onAdd() {
      this.operateType = 'add'
      this.selectRow = {}
      this.addCompVisible = true
    },
    onImport() {},
    onApprove() {},
    onDelete() {},
    onSearch() {
      const params = this.$refs.searchTop.getSearchParams()
      // 身份证号转大写
      params.idCard = params.idCard?.toUpperCase()
      params.isDel = 0
      params.limit = this.$refs.table.Pagination.internalPageSize
      const fetch = service.staff.black.list
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
      if (!result) {
        return
      }
      await service.staff.black.save(result)
      this.$message.success('操作成功')
      this.addCompVisible = false
      // 刷新列表
      this.queryBlackList()
    },
    onRemove(row) {
      this.selectRow = row
      this.removeCompVisible = true
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
      this.queryBlackList()
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
