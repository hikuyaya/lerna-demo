<!--
 * @Author: wqy
 * @Date: 2022-07-21 14:09:38
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-04 15:17:07
 * @FilePath: \personnelweb\src\views\salary-setting\special\special.vue
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
        <yid-table-column label="编码" prop="speCode" width="100px">
        </yid-table-column>
        <yid-table-column
          label="名称"
          prop="speName"
          width="150px"></yid-table-column>
        <yid-table-column label="适用门店" prop="type">
          <template slot-scope="scope">
            {{
              scope.row.type == '1'
                ? '美发门店'
                : scope.row.type == '2'
                ? '美容门店'
                : scope.row.type == '3'
                ? '所有门店'
                : scope.row.type
            }}
          </template>
        </yid-table-column>
        <yid-table-column label="备注" prop="remark"></yid-table-column>
        <!-- <yid-table-column label="状态" prop="status" width="70px">
          <template slot-scope="scope">
            {{
              scope.row.status == 1
                ? '正常'
                : scope.row.status == 2
                ? '停用'
                : scope.row.status
            }}
          </template>
        </yid-table-column> -->
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
          label: '名称', // 标签
          prop: 'speName', // 绑定的字段
          // label宽度
          type: 'input',
          width: '20%' // 整个组件占的宽度
          // widgetWidth: '200px', // 控件的宽度
          // required: true // 是否必填
        },
        {
          label: '适用门店',
          prop: 'type',
          type: 'select',
          options: [
            { label: '美发门店', value: '1' },
            { label: '美容门店', value: '2' },
            { label: '所有门店', value: '3' }
          ],
          width: '15%'
        }
        // {
        //   label: '状态',
        //   prop: 'status',
        //   type: 'select',
        //   labelWidth: '0.8rem',
        //   options: [
        //     { label: '正常', value: '1' },
        //     { label: '停用', value: '2' }
        //   ],
        //   width: '15%'
        // }
      ],
      tableData: [],
      positionAll: [],
      salaryCompAll: []
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
    onSearch() {
      const params = this.$refs.searchTop.getSearchParams()
      params.limit = this.$refs.table.Pagination.internalPageSize
      const fetch = service.salarySetting.special.list
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
          await service.salarySetting.special.save(result)
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
