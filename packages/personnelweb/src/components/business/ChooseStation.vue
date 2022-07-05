<!--
 * @Author: wqy
 * @Date: 2022-06-24 13:46:47
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-05 16:05:38
 * @FilePath: \personnelweb\src\components\business\ChooseStation.vue
 * @Description: 业务相关——选择岗位
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
      <yid-table-column label="岗位名称" prop="postName"></yid-table-column>
      <yid-table-column
        label="岗位编码"
        prop="postCode"
        width="80px"></yid-table-column>
      <yid-table-column label="机构编码" prop="bbCode"></yid-table-column>
      <yid-table-column label="机构名称" prop="bbName"></yid-table-column>
      <yid-table-column label="职务名称" prop="positionName"></yid-table-column>
      <yid-table-column label="职务编码" prop="positionCode"></yid-table-column>
    </yid-table>
  </div>
</template>

<script>
import SearchTop from '@src/components/base/SearchTop.vue'
import service from '@src/service'

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
          prop: 'reginCode', // 绑定的字段
          // label宽度
          type: 'input',
          width: '30%' // 整个组件占的宽度
          // widgetWidth: '200px', // 控件的宽度
          // required: true // 是否必填
        },
        {
          label: '机构名称',
          prop: 'reginName',
          type: 'input', // 搜索类型
          width: '30%'
        },
        {
          label: '岗位名称',
          prop: 'postName',
          type: 'input',
          width: '30%'
        }
      ],
      tableData: []
    }
  },
  mounted() {
    this.queryStationList()
  },
  methods: {
    queryStationList() {
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
      const fetch = service.base.station.list
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
