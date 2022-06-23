<!--
 * @Author: wqy
 * @Date: 2022-06-22 17:41:05
 * @LastEditors: wqy
 * @LastEditTime: 2022-06-22 18:00:53
 * @FilePath: \personnelweb\src\views\base\duty\components\level.vue
 * @Description: 
-->
<template>
  <div class="container">
    <div class="content">
      <search-top ref="searchTop" :options="conditions">
        <template #inlineBtn>
          <div class="flex flex-alignitems__center mg-l-12">
            <el-button type="primary" @click="onSearch">查询</el-button>
          </div>
        </template>
      </search-top>
      <yid-table pagination :data="tableData" ref="table" class="mg-t-12">
        <yid-table-column label="机构编码" prop="date"> </yid-table-column>
        <yid-table-column label="级别编码" prop="name"></yid-table-column>
        <yid-table-column label="级别名称" prop="name"></yid-table-column>
        <yid-table-column label="所属职务" prop="name"></yid-table-column>
        <yid-table-column label="职务编码" prop="name"></yid-table-column>
      </yid-table>
    </div>
  </div>
</template>
<script>
import SearchTop from '@src/components/base/SearchTop'
import service from '@src/service'
export default {
  components: { SearchTop },
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
          label: '级别名称',
          prop: 'text3',
          type: 'input', // 搜索类型
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
  methods: {
    onSearch() {
      const params = this.$refs.searchTop.getSearchParams()
      console.log('params', params)
    },
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
