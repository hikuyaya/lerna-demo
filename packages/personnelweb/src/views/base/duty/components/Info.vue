<!--
 * @Author: wqy
 * @Date: 2022-06-22 17:40:23
 * @LastEditors: wqy
 * @LastEditTime: 2022-06-22 17:49:51
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
        <yid-table-column label="机构编码" prop="date">
          <template slot-scope="scope">
            <el-link type="primary" @click="onShowDetail(scope.row)"
              >编辑</el-link
            >
          </template>
        </yid-table-column>
        <yid-table-column label="机构名称" prop="name"></yid-table-column>
        <yid-table-column label="上级机构" prop="name"></yid-table-column>
        <yid-table-column label="机构电话" prop="name"></yid-table-column>
        <yid-table-column label="负责人" prop="name"></yid-table-column>
        <yid-table-column label="状态" prop="name"></yid-table-column>
        <yid-table-column label="是否子公司" prop="name"></yid-table-column>
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
      <add-comp v-if="addCompVisible" :value="selectRow" :treeData="treeData" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit">确 定</el-button>
        <el-button @click="onCancel">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import SearchTop from '@src/components/base/SearchTop'
import AddComp from './InfoAddComp'
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
          label: '职务编码', // 标签
          prop: 'text1', // 绑定的字段
          // label宽度
          type: 'input',
          width: '16%' // 整个组件占的宽度
          // widgetWidth: '200px', // 控件的宽度
          // required: true // 是否必填
        },
        {
          label: '职务名称',
          prop: 'text2',
          type: 'input', // 搜索类型
          width: '16%'
        },
        {
          label: '状态',
          prop: 'text5',
          type: 'select',
          labelWidth: '0.8rem',
          options: [
            { label: '所有', value: '' },
            { label: '正常', value: 1 },
            { label: '停用', value: 0 }
          ],
          width: '16%'
        }
      ],
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ],
      treeData: []
    }
  },
  created() {
    this.initData()
  },
  methods: {
    async initData() {
      const { data, resp_code } = await service.chain.region.treeAll({})
      if (resp_code !== 200) {
        return
      }
      this.treeData = data
    },
    onOpenAdvance() {},
    onAdd() {
      this.operateType = 'add'
      this.addCompVisible = true
    },
    onSearch() {
      const params = this.$refs.searchTop.getSearchParams()
      console.log('params', params)
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
