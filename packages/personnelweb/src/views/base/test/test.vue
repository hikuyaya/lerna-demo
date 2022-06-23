<!--
 * @Author: wqy
 * @Date: 2022-06-16 14:57:05
 * @LastEditors: wqy
 * @LastEditTime: 2022-06-20 17:28:19
 * @FilePath: \personnelweb\src\views\base\test\test.vue
 * @Description: 
-->
<template>
  <div>
    <div class="container">
      <div class="left-side">
        <left-tree />
      </div>
      <div class="right-content">
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
      </div>
    </div>
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
import LeftTree from './components/LeftTree.vue'
export default {
  components: { SearchTop, AddComp, LeftTree },
  data() {
    return {
      addCompVisible: false,
      operateType: 'add',
      selectRow: {},
      conditions: [
        {
          label: '员工姓名', // 标签
          prop: 'text1', // 绑定的字段
          labelWidth: '1rem', // label宽度
          type: 'input',
          width: '20%' // 整个组件占的宽度
          // widgetWidth: '200px', // 控件的宽度
          // required: true // 是否必填
        },
        {
          label: '员工编码',
          prop: 'text2',
          type: 'input', // 搜索类型
          width: '20%'
        }
      ],
      advanceConditions: [
        {
          label: '机构编码',
          prop: 'advance1',
          type: 'input', // 搜索类型
          width: '20%'
        },
        {
          label: '机构名称',
          prop: 'advance2',
          type: 'input', // 搜索类型
          width: '20%'
        },
        {
          label: '手机号',
          prop: 'advance3',
          type: 'input', // 搜索类型
          width: '20%'
        },
        {
          label: '身份证号',
          prop: 'advance4',
          type: 'input', // 搜索类型
          width: '20%'
        },
        {
          label: '状态',
          prop: 'advance5',
          type: 'select', // 搜索类型
          width: '20%'
        },
        {
          label: '转正日期',
          prop: 'advance6',
          type: 'daterange',
          widgetWidth: '3.1rem'
        },
        {
          label: '连续工龄>',
          prop: 'advance7',
          type: 'number',
          labelWidth: '1rem',
          width: 'calc((100% - 4.1rem) / 4)'
        },
        {
          label: '延续工龄>',
          prop: 'advance8',
          type: 'number',
          labelWidth: '1rem',
          width: 'calc((100% - 4.1rem) / 4)'
        },
        {
          label: '是否股东',
          prop: 'advance9',
          type: 'select',
          width: 'calc((100% - 4.1rem) / 4)',
          options: [
            { label: '所有', value: '' },
            { label: '是', value: 1 },
            { label: '否', value: 0 }
          ]
        },
        {
          label: '合同状态',
          prop: 'advance10',
          type: 'select',
          width: 'calc((100% - 4.1rem) / 4)',
          options: [
            { label: '所有', value: '' },
            { label: '有效', value: 1 },
            { label: '无效', value: 0 }
          ]
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
<style lang="scss" scoped>
.container {
  display: flex;
  height: 100%;
  .left-side {
    flex-basis: 2.8rem;
    padding-right: 0.12rem;
    border-right: 1px solid #dcdfe6;
  }
  .right-content {
    flex: 1;
    padding-left: 0.12rem;
  }
}
</style>
