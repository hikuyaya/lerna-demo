<!--
 * @Author: wqy
 * @Date: 2022-07-05 14:41:00
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-13 15:10:52
 * @FilePath: \personnelweb\src\views\staff\transferPosition\transferPosition.vue
 * @Description: 员工调岗
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
          </div>
        </template>
      </search-top>
      <yid-table pagination :data="tableData" ref="table" class="mg-t-12">
        <yid-table-column label="单号" prop="billCode" width="140px" fixed>
        </yid-table-column>
        <yid-table-column label="员工姓名" prop="eeName" width="100px" fixed>
        </yid-table-column>
        <yid-table-column label="员工编码" prop="eeCode" width="100px" fixed>
        </yid-table-column>
        <yid-table-column label="状态" prop="approvalStatus">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.approvalStatus == 1 ? 'primary' : 'success'"
              >{{ scope.row.approvalStatus == 1 ? '待审核' : '已审核' }}</el-tag
            >
          </template>
        </yid-table-column>
        <yid-table-column label="原机构编码" prop="sourceRegionCode">
        </yid-table-column>
        <yid-table-column
          label="原机构"
          prop="sourceRegionName"></yid-table-column>
        <yid-table-column
          label="原岗位"
          prop="sourcePostName"></yid-table-column>
        <yid-table-column
          label="新机构编码"
          prop="targetPositionCode"></yid-table-column>
        <yid-table-column
          label="新机构"
          prop="targetRegionName"
          width="150px"></yid-table-column>
        <yid-table-column
          label="新岗位"
          prop="targetPositionName"></yid-table-column>

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
        <yid-table-column label="操作" min-width="100" fixed="right">
          <!-- <template slot-scope="scope"> -->
          <template v-if="scope.row.approvalStatus == 1" slot-scope="scope">
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
      :title="
        operateType === 'add'
          ? `新增员工调岗`
          : operateType === 'edit'
          ? '编辑员工调岗'
          : '查看员工调岗'
      "
      :visible.sync="addCompVisible"
      :close-on-click-modal="false"
      append-to-body
      width="1050px">
      <add-comp
        v-if="addCompVisible"
        ref="addCompRef"
        :value="selectRow"
        :operateType="operateType"
        @cancel="addCompVisible = false" />
      <span v-if="operateType === 'detail'" slot="footer" class="dialog-footer">
        <el-button @click="onCancel">关 闭</el-button>
      </span>
      <span v-else slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit">确 定</el-button>
        <el-button @click="onCancel">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import SearchTop from '@src/components/base/SearchTop'
import AddComp from './components/AddComp.vue'
// import AddComp from './components/test.vue'
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
          width: '15%' // 整个组件占的宽度
          // widgetWidth: '200px', // 控件的宽度
          // required: true // 是否必填
        },
        {
          label: '员工编码',
          prop: 'eeCode',
          width: '15%'
        },
        {
          label: '状态',
          prop: 'approvalStatus',
          type: 'select', // 搜索类型
          width: '15%',
          options: [
            { label: '所有', value: '' },
            { label: '待审核', value: 1 },
            { label: '已审核', value: 3 }
          ]
        }
      ],
      defaultParams: {
        approvalStatus: 1
      },
      tableData: []
    }
  },
  created() {},
  mounted() {
    // this.queryList()
  },
  methods: {
    onOpenAdvance() {},
    onAdd() {
      this.operateType = 'add'
      this.selectRow = {}
      this.addCompVisible = true
    },
    queryList() {
      this.onSearch()
    },
    onSearch() {
      let params = this.$refs.searchTop.getSearchParams()
      params.limit = this.$refs.table.Pagination.internalPageSize
      params = {
        ...params
      }
      const fetch = service.staff.transferPosition.list
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
      this.$confirm(`确认要删除此条调岗信息吗？`, `删除确认`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn-custom-cancel',
        type: 'warning'
      })
        .then(async () => {
          await service.staff.transferPosition.remove(row.id)
          this.$message.success('操作成功')
          // 刷新列表
          await this.queryList()
        })
        .catch(() => {})
    },
    // 审核
    async onApprove(row) {
      this.$confirm(`您确认要审核此条信息吗？`, `审核确认`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn-custom-cancel',
        type: 'warning'
      })
        .then(async () => {
          await service.staff.transferPosition.approval(row.id)
          this.$message.success('操作成功')
          // 刷新列表
          await this.queryList()
        })
        .catch(() => {})
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
      if (this.operateType === 'add') {
        await service.staff.transferPosition.save(result)
      } else {
        await service.staff.transferPosition.update(result)
      }
      this.$message.success('操作成功')
      this.addCompVisible = false
      // 刷新列表
      await this.queryList()
    },
    onCancel(row) {
      this.addCompVisible = false
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
