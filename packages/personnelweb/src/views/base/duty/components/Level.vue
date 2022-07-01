<!--
 * @Author: wqy
 * @Date: 2022-06-22 17:41:05
 * @LastEditors: wqy
 * @LastEditTime: 2022-06-30 11:17:53
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
        <yid-table-column label="级别编码" prop="pslcode"></yid-table-column>
        <yid-table-column label="级别名称" prop="pslname"></yid-table-column>
        <yid-table-column label="所属职务" prop="psname"></yid-table-column>
        <yid-table-column label="职务编码" prop="pscode"></yid-table-column>
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
          label: '级别名称',
          prop: 'pslname',
          type: 'input', // 搜索类型
          width: '16%'
        }
      ],
      tableData: []
    }
  },
  mounted() {
    this.queryList()
  },
  methods: {
    queryList() {
      this.onSearch()
    },
    onSearch() {
      const params = this.$refs.searchTop.getSearchParams()
      params.limit = this.$refs.table.Pagination.internalPageSize
      const fetch = service.base.duty.positionLevelList
      this.$refs.table.reloadData({
        fetch,
        params
      })
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
