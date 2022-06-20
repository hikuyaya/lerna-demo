<!--
 * @Author: wqy
 * @Date: 2022-06-16 14:57:05
 * @LastEditors: wqy
 * @LastEditTime: 2022-06-17 17:58:27
 * @FilePath: \personnelweb\src\views\base\test\test.vue
 * @Description: 
-->
<template>
  <div>
    <search-top
      ref="searchTop"
      :options="conditions"
      :advanceOptions="advanceConditions"
      advance>
      <template #inlineBtn>
        <div class="flex flex-alignitems__center mg-l-12">
          <el-button type="primary" @click="onSearch">查询</el-button>
          <el-button type="default" @click="onAdd">新增</el-button>
        </div>
      </template>
    </search-top>
    <yid-table pagination :data="tableData" ref="table" class="mg-t-12">
      <yid-table-column
        label="渠道编码"
        min-width="100"
        prop="date"></yid-table-column>
      <yid-table-column
        label="渠道名称"
        min-width="150"
        prop="name"></yid-table-column>
      <yid-table-column label="操作" min-width="100" prop="content">
        <template slot-scope="scope">
          <el-link type="primary" @click="onEdit(scope.row)">编辑</el-link>
        </template>
      </yid-table-column>
    </yid-table>
    <el-dialog
      :title="operateType === 'add' ? '新增' : '修改'"
      :visible.sync="addCompVisible"
      :close-on-click-modal="false"
      width="800px">
      <add-comp :value="selectRow" v-if="addCompVisible" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit">确 定</el-button>
        <el-button @click="onCancel">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import SearchTop from '@src/components/base/SearchTop'
import AddComp from './components/AddComp.vue'

export default {
  components: { SearchTop, AddComp },
  data() {
    return {
      addCompVisible: false,
      operateType: 'add',
      selectRow: {},
      conditions: [
        {
          label: '内容1', // 标签
          prop: 'text1', // 绑定的字段
          labelWidth: '80px', // label宽度
          // width: '10%', // 整个组件占的宽度
          widgetWidth: '200px', // 控件的宽度
          required: true // 是否必填
        },
        {
          label: '内容2',
          prop: 'text2',
          type: 'select' // 搜索类型
        },
        {
          label: '内容3',
          prop: 'text3',
          width: '10%'
        },
        {
          label: '内容4',
          prop: 'text4',
          width: '10%'
        },
        {
          label: '内容5',
          prop: 'text5',
          width: '10%'
        }
      ],
      advanceConditions: [
        {
          label: '高级1',
          prop: 'davance1',
          width: '25%'
        },
        {
          label: '高级2',
          prop: 'davance2',
          width: '25%'
        },
        {
          label: '高级3',
          prop: 'davance3',
          width: '25%'
        },
        {
          label: '高级4',
          prop: 'davance4',
          width: '25%'
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
      ]
    }
  },
  methods: {
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
    onSubmit(row) {},
    onCancel(row) {
      this.addCompVisible = false
    }
  }
}
</script>
