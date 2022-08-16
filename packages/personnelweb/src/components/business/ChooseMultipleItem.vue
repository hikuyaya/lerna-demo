<!--
 * @Author: wqy
 * @Date: 2022-07-21 17:06:01
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-16 14:28:14
 * @FilePath: \personnelweb\src\components\business\ChooseMultipleItem.vue
 * @Description: 
-->
<template>
  <div>
    <search-top
      ref="searchTop"
      :options="conditions"
      :defaultParams="defaultParams">
      <template #inlineBtn>
        <div class="flex flex-alignitems__center mg-l-12">
          <el-button type="primary" @click="onSearch">查询</el-button>
          <el-button type="primary" @click="onSure">确认选择</el-button>
        </div>
      </template>
    </search-top>

    <yid-table
      :data="tableData"
      highlight-current-row
      @selection-change="handleSelectionChange"
      :pagination="pagination ? true : false"
      ref="table"
      class="mg-t-12">
      <yid-table-column type="selection" width="48px"></yid-table-column>
      <yid-table-column
        v-for="column in columns"
        :key="column.prop"
        :label="column.label"
        :width="column.width"
        :type="column.type"
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
  name: 'choose-multiple-item',
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
    },
    pagination: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    queryImmedicatly: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    defaultParams: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  components: {
    SearchTop
  },
  mounted() {
    if (this.queryImmedicatly) {
      this.queryList()
    }
  },
  data() {
    return {
      tableData: [],
      multipleSelection: []
    }
  },
  methods: {
    queryList() {
      this.onSearch()
    },
    onSearch() {
      if (!this.$refs.searchTop.requiredValidate()) {
        this.$message.error('查询必填项或必选项不能为空')
        return
      }
      let params = this.$refs.searchTop.getSearchParams()
      params.limit = this.$refs.table.Pagination?.internalPageSize
      // params = {
      //   ...params,
      //   ...this.defaultParams
      // }
      const fetch = this.actionUrl
      this.$refs.table.reloadData({
        fetch,
        params
      })
      this.$emit('query', params)
    },
    onSure() {
      if (!this.multipleSelection.length) {
        this.$message.error('请选择数据')
        return
      }
      this.$emit('select', this.multipleSelection)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  },
  defaultParams: {
    immediate: true,
    handler: function (val) {
      if (val) {
        this.params = {
          ...val
        }
      }
    }
  }
}
</script>
