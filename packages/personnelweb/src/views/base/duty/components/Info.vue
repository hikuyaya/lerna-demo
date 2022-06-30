<!--
 * @Author: wqy
 * @Date: 2022-06-22 17:40:23
 * @LastEditors: wqy
 * @LastEditTime: 2022-06-30 11:13:01
 * @FilePath: \personnelweb\src\views\base\duty\components\Info.vue
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
        <yid-table-column label="职务编码" prop="pscode"></yid-table-column>
        <yid-table-column label="职务名称" prop="name">
          <template slot-scope="scope">
            <el-link type="primary" @click="onShowDetail(scope.row)">{{
              scope.row.psname
            }}</el-link>
          </template>
        </yid-table-column>
        <yid-table-column label="组织名称" prop="bname"></yid-table-column>
        <yid-table-column label="同步业务组" prop="bbnames"></yid-table-column>
        <yid-table-column label="状态" prop="status">
          <template slot-scope="scope">
            {{
              scope.row.status === '1'
                ? '正常'
                : scope.row.status === '2'
                ? '停用'
                : '未知'
            }}
          </template>
        </yid-table-column>
        <yid-table-column label="级别操作" prop="name">
          <template slot-scope="scope">
            <el-link
              type="primary"
              class="mg-r-16"
              @click="onShowDetail(scope.row)"
              >查看</el-link
            >
            <el-link type="primary" @click="onShowDetail(scope.row)"
              >维护</el-link
            >
          </template>
        </yid-table-column>
        <yid-table-column label="操作" min-width="100">
          <template slot-scope="scope">
            <el-link type="primary" @click="onEdit(scope.row)">编辑</el-link>
          </template>
        </yid-table-column>
      </yid-table>
    </div>
    <el-dialog
      :title="operateType === 'add' ? '新增' : '修改'"
      :visible.sync="addCompVisible"
      :close-on-click-modal="false"
      append-to-body
      width="600px">
      <info-add-comp v-if="addCompVisible" :value="selectRow" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit">确 定</el-button>
        <el-button @click="onCancel">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import SearchTop from '@src/components/base/SearchTop'
import InfoAddComp from './InfoAddComp'
// import AddComp from './components/test.vue'
import service from '@src/service'
export default {
  components: { SearchTop, InfoAddComp },
  data() {
    return {
      addCompVisible: false,
      operateType: 'add',
      selectRow: {},
      conditions: [
        {
          label: '职务编码', // 标签
          prop: 'pscode', // 绑定的字段
          // label宽度
          type: 'input',
          width: '16%' // 整个组件占的宽度
          // widgetWidth: '200px', // 控件的宽度
          // required: true // 是否必填
        },
        {
          label: '职务名称',
          prop: 'psname',
          type: 'input', // 搜索类型
          width: '16%'
        },
        {
          label: '状态',
          prop: 'status',
          type: 'select',
          labelWidth: '0.8rem',
          options: [
            { label: '所有', value: '' },
            { label: '正常', value: '1' },
            { label: '停用', value: '2' }
          ],
          width: '16%'
        }
      ],
      tableData: [],
      total: 0
    }
  },
  mounted() {
    this.queryPositionList()
  },
  methods: {
    queryPositionList() {
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
      const fetch = service.base.duty.list
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
    onSubmit(row) {},
    onCancel(row) {
      this.addCompVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  height: 100%;
  .content {
    flex: 1;
  }
}
</style>
