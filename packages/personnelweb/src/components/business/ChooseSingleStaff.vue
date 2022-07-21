<!--
 * @Author: wqy
 * @Date: 2022-07-18 09:45:59
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-21 10:30:30
 * @FilePath: \personnelweb\src\components\business\ChooseSingleStaff.vue
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
      pagination
      ref="table"
      class="mg-t-12">
      <yid-table-column
        v-for="column in columns"
        :key="column.prop"
        :label="column.label"
        :width="column.width"
        :prop="column.prop">
        <template slot-scope="scope">
          <span v-if="column.render">
            {{ column.render(scope.row) }}
          </span>
          <span v-else>
            {{ scope.row[column.prop] }}
          </span>
        </template>
      </yid-table-column>
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
    },
    actionUrl: Function,
    columns: {
      type: Array
    },
    conditions: {
      type: Array
    }
  },
  data() {
    return {
      info: {},
      selectRow: null,
      tableData: []
    }
  },
  mounted() {
    this.queryStaffList()
  },
  methods: {
    queryStaffList() {
      this.onSearch()
    },
    handleCurrentChange(val) {
      this.selectRow = val
      this.$emit('select', this.selectRow)
    },
    onOpenAdvance() {},
    onSearch() {
      const params = this.$refs.searchTop.getSearchParams()
      params.limit = this.$refs.table.Pagination.internalPageSize
      const fetch = this.actionUrl
      this.$refs.table.reloadData({
        fetch,
        params
      })
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
