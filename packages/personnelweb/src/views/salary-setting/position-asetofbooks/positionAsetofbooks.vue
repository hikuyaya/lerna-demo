<!--
 * @Author: wqy
 * @Date: 2022-07-21 14:08:25
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-29 12:52:24
 * @FilePath: \personnelweb\src\views\salary-setting\position-asetofbooks\positionAsetofbooks.vue
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
        <yid-table-column label="职务编码" prop="psCode" width="100px">
        </yid-table-column>
        <yid-table-column
          label="职务名称"
          prop="psName"
          width="150px"></yid-table-column>
        <yid-table-column label="工资账套" prop="ssName"></yid-table-column>
        <yid-table-column label="学习金额度" prop="tutje"></yid-table-column>
        <yid-table-column
          label="每月扣除额度"
          prop="tutjeMon"></yid-table-column>
        <yid-table-column label="状态" prop="status" width="70px">
          <template slot-scope="scope">
            {{
              scope.row.status == 1
                ? '正常'
                : scope.row.status == 2
                ? '停用'
                : scope.row.status
            }}
          </template>
        </yid-table-column>
        <yid-table-column label="操作" width="80px">
          <template slot-scope="scope">
            <el-link type="primary" @click="onEdit(scope.row)">修改</el-link>
          </template>
        </yid-table-column>
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
      <add-comp
        v-if="addCompVisible"
        ref="addCompRef"
        :value="selectRow"
        :positionAll="positionAll"
        :salaryCompAll="salaryCompAll"
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
          label: '职务编码', // 标签
          prop: 'psCode', // 绑定的字段
          // label宽度
          type: 'input',
          width: '20%' // 整个组件占的宽度
          // widgetWidth: '200px', // 控件的宽度
          // required: true // 是否必填
        },
        {
          label: '职务名称',
          prop: 'psName',
          type: 'input', // 搜索类型
          width: '20%'
        },
        {
          label: '状态',
          prop: 'status',
          type: 'select',
          labelWidth: '0.8rem',
          options: [
            { label: '正常', value: '1' },
            { label: '停用', value: '2' }
          ],
          width: '15%'
        }
      ],
      tableData: [],
      positionAll: [],
      salaryCompAll: []
    }
  },
  created() {
    this.queryPostionAll()
    this.querySalaryCompAll()
  },
  mounted() {
    this.queryList()
  },
  methods: {
    async queryPostionAll() {
      const { data } = await service.chain.position.all()
      this.positionAll = data
    },
    async querySalaryCompAll() {
      const { data } = await service.salarySetting.asetofbooks.list({
        page: 1,
        limit: 1000
      })
      this.salaryCompAll = data
    },
    queryList() {
      this.onSearch()
    },
    onAdd() {
      this.operateType = 'add'
      this.selectRow = {}
      this.addCompVisible = true
    },
    onSearch() {
      const params = this.$refs.searchTop.getSearchParams()
      params.limit = this.$refs.table.Pagination.internalPageSize
      const fetch = service.salarySetting.positionAsetofbooks.list
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

      this.$confirm(`您确认要保存此信息吗？`, `确认保存`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn-custom-cancel',
        type: 'warning'
      })
        .then(async () => {
          await service.salarySetting.positionAsetofbooks.save(result)
          this.$message.success('操作成功')
          this.addCompVisible = false
          // 刷新列表
          this.queryList()
        })
        .catch(() => {})
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
