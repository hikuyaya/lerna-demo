<!--
 * @Author: wqy
 * @Date: 2022-07-05 14:46:22
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-12 14:46:19
 * @FilePath: \personnelweb\src\views\staff\workingage\workingage.vue
 * @Description: 
-->
<template>
  <div class="container">
    <div class="content">
      <search-top ref="searchTop" :options="conditions">
        <template #inlineBtn>
          <div class="flex flex-alignitems__center mg-l-12">
            <el-button type="primary" @click="onSearch">查询</el-button>
            <el-button type="primary" @click="onAdd">新增</el-button>
          </div>
        </template>
      </search-top>
      <yid-table pagination :data="tableData" ref="table" class="mg-t-12">
        <yid-table-column
          label="单号"
          prop="billNo"
          width="150px"
          fixed></yid-table-column>
        <yid-table-column label="员工姓名" prop="eeName" width="100px" fixed>
        </yid-table-column>
        <yid-table-column
          label="员工编码"
          prop="eeCode"
          width="80px"
          fixed></yid-table-column>
        <yid-table-column label="状态" prop="approvalStatus" width="70px" fixed>
          <template slot-scope="scope">
            {{
              scope.row.approvalStatus == 1
                ? '待审核'
                : scope.row.approvalStatus == 2
                ? '已审核'
                : '其他'
            }}
          </template>
        </yid-table-column>
        <yid-table-column
          label="机构编码"
          prop="bbCode"
          width="100px"></yid-table-column>
        <yid-table-column
          label="机构名称"
          prop="bbName"
          width="150px"></yid-table-column>
        <yid-table-column
          label="原延续工龄"
          prop="beServyear"
          width="100px"></yid-table-column>
        <yid-table-column
          label="原延续工龄备注"
          prop="beCurservyear"
          width="150px"></yid-table-column>
        <yid-table-column
          label="新延续工龄"
          prop="afServyear"
          width="100px"></yid-table-column>
        <yid-table-column
          label="新延续工龄备注"
          prop="afCurservyear"
          width="150px"></yid-table-column>
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
          prop="updatedTime"
          width="150px"></yid-table-column>
        <yid-table-column
          label="审批人"
          prop="approvalEename"
          width="100px"></yid-table-column>
        <yid-table-column
          label="审批时间"
          prop="approvalTime"
          width="150px"></yid-table-column>
        <yid-table-column label="操作" width="100" fixed="right">
          <template v-if="scope.row.approvalStatus == 1" slot-scope="scope">
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
      title="员工延续工龄维护"
      :visible.sync="addCompVisible"
      :close-on-click-modal="false"
      append-to-body
      width="800px">
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
  </div>
</template>
<script>
import SearchTop from '@src/components/base/SearchTop'
import AddComp from './components/AddComp.vue'
import service from '@src/service'
export default {
  components: { SearchTop, AddComp },
  data() {
    return {
      addCompVisible: false,
      operateType: 'add',
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
          type: 'input', // 搜索类型
          width: '20%'
        },
        {
          label: '机构编码',
          prop: 'idCard',
          type: 'input',
          width: '20%'
        },
        {
          label: '状态',
          prop: 'approvalStatus',
          type: 'select',
          labelWidth: '0.8rem',
          options: [
            { label: '所有', value: '' },
            { label: '待审核', value: '1' },
            { label: '已审核', value: '2' }
          ],
          width: '20%'
        }
      ],
      tableData: []
    }
  },
  mounted() {
    this.queryWorkingageList()
  },
  methods: {
    queryWorkingageList() {
      this.onSearch()
    },
    onOpenAdvance() {},
    onAdd() {
      this.operateType = 'add'
      this.selectRow = {}
      this.addCompVisible = true
    },
    onSearch() {
      const params = this.$refs.searchTop.getSearchParams()
      params.isDel = 0
      params.limit = this.$refs.table.Pagination.internalPageSize
      const fetch = service.staff.workingage.list
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
    async onDelete(row) {
      this.$confirm(`确认要对单据进行删除吗？`, `删除确认`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn-custom-cancel',
        type: 'warning'
      })
        .then(async () => {
          await service.staff.workingage.deleteBill(row)
          this.$message.success('操作成功')
          // 刷新列表
          await this.queryWorkingageList()
        })
        .catch(() => {})
    },
    // 审核
    async onApprove(row) {
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
          await service.staff.workingage.censorBill(row)
          this.$message.success('操作成功')
          // 刷新列表
          await this.queryWorkingageList()
        })
        .catch(() => {})
    },
    async onSubmit() {
      const result = await this.$refs.addCompRef.getData()
      if (!result) {
        return
      }
      await service.staff.workingage.save({
        employeeWorkYearMaintenances: result
      })
      this.$message.success('操作成功')
      this.addCompVisible = false
      // 刷新列表
      await this.queryWorkingageList()
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
