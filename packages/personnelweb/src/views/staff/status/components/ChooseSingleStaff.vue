<!--
 * @Author: wqy
 * @Date: 2022-07-11 13:36:56
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-22 09:25:48
 * @FilePath: \personnelweb\src\views\staff\status\components\ChooseSingleStaff.vue
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
      <yid-table-column label="员工姓名" prop="eeName"></yid-table-column>
      <yid-table-column label="员工编码" prop="eeCode"></yid-table-column>
      <yid-table-column label="机构编码" prop="bbCode"></yid-table-column>
      <yid-table-column label="机构名称" prop="bbName"></yid-table-column>
      <yid-table-column label="职务" prop="positionName"></yid-table-column>
      <yid-table-column label="状态" prop="status">
        <template slot-scope="scope">
          {{
            scope.row.status === 1
              ? '在职'
              : scope.row.status === 2
              ? '离职'
              : scope.row.status === 2
              ? '长假'
              : '其他'
          }}
        </template>
      </yid-table-column>
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
          label: '员工姓名', // 标签
          prop: 'eeName', // 绑定的字段
          // label宽度
          type: 'input',
          width: '20%' // 整个组件占的宽度
          // widgetWidth: '200px', // 控件的宽度
          // required: true // 是否必填
        },
        {
          label: '员工编码',
          prop: 'eeCode',
          type: 'input', // 搜索类型
          width: '20%'
        },
        {
          label: '机构编码',
          prop: 'bbCode',
          type: 'input',
          width: '20%'
        },
        {
          label: '机构名称',
          prop: 'bbName',
          type: 'input',
          width: '20%'
        }
      ],
      tableData: [],
      multipleSelection: []
    }
  },
  mounted() {
    // this.queryStaffList()
  },
  methods: {
    queryStaffList() {
      this.onSearch()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    onSearch() {
      const params = this.$refs.searchTop.getSearchParams()
      params.limit = this.$refs.table.Pagination.internalPageSize
      const fetch = service.staff.profile.list
      this.$refs.table.reloadData({
        fetch,
        params
      })
    },
    handleCurrentChange(val) {
      this.selectRow = val
      this.$emit('select', this.selectRow)
    }
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
