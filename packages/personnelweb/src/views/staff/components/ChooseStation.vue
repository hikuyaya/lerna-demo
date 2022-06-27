<!--
 * @Author: wqy
 * @Date: 2022-06-24 13:46:47
 * @LastEditors: wqy
 * @LastEditTime: 2022-06-24 14:11:00
 * @FilePath: \personnelweb\src\views\staff\components\ChooseStation.vue
 * @Description: 
-->
<template>
  <div>
    <search-top ref="searchTop" :options="conditions">
      <template #inlineBtn>
        <div class="flex flex-alignitems__center mg-l-12">
          <el-button type="primary" @click="onSearch">查询</el-button>
        </div>
      </template>
    </search-top>
    <yid-table
      :data="tableData"
      highlight-current-row
      @current-change="handleCurrentChange"
      ref="table"
      class="mg-t-12">
      <yid-table-column label="岗位名称" prop="date"></yid-table-column>
      <yid-table-column label="岗位编码" prop="name"></yid-table-column>
      <yid-table-column label="机构编码" prop="address"></yid-table-column>
      <yid-table-column label="机构名称" prop="name"></yid-table-column>
      <yid-table-column label="职务名称" prop="name"></yid-table-column>
      <yid-table-column label="职务编码" prop="name"></yid-table-column>
    </yid-table>
  </div>
</template>

<script>
import SearchTop from '@src/components/base/SearchTop.vue'
export default {
  components: { SearchTop },
  props: {
    value: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data() {
    return {
      info: {},
      selectRow: null,
      conditions: [
        {
          label: '机构编码', // 标签
          prop: 'text1', // 绑定的字段
          // label宽度
          type: 'input',
          width: '30%' // 整个组件占的宽度
          // widgetWidth: '200px', // 控件的宽度
          // required: true // 是否必填
        },
        {
          label: '机构名称',
          prop: 'text2',
          type: 'input', // 搜索类型
          width: '30%'
        },
        {
          label: '岗位名称',
          prop: 'text3',
          type: 'input',
          width: '30%'
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
    handleCurrentChange(val) {
      this.selectRow = val
      this.$emit('select', this.selectRow)
    },
    onOpenAdvance() {},
    onSearch() {
      const params = this.$refs.searchTop.getSearchParams()
      console.log('params', params)
    },
    onEdit(row) {
      this.selectRow = row
    },
    onSubmit(row) {}
  },
  watch: {
    value: {
      immediate: true,
      handler: function (val) {
        this.info = JSON.parse(JSON.stringify(val))
      }
    }
  }
}
</script>
