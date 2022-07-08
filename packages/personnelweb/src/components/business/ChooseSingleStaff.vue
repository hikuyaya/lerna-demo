<!--
 * @Author: wqy
 * @Date: 2022-07-04 14:30:12
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-07 17:05:49
 * @FilePath: \personnelweb\src\components\business\ChooseSingleStaff.vue
 * @Description: 业务相关——选择人员
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
      <yid-table-column label="员工姓名" prop="eename"></yid-table-column>
      <yid-table-column
        label="员工编码"
        prop="eecode"
        width="90px"></yid-table-column>
      <yid-table-column label="职务" prop="psname"></yid-table-column>
      <yid-table-column label="身份证号" prop="idno"></yid-table-column>
      <yid-table-column label="状态" prop="status" width="60px">
        <template slot-scope="scope">
          {{
            scope.row.status == '1'
              ? '在职'
              : scope.row.status == '2'
              ? '离职'
              : '其他'
          }}
        </template>
      </yid-table-column>
      <yid-table-column label="离职原因" prop="quitReason"></yid-table-column>
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
          prop: 'eename', // 绑定的字段
          // label宽度
          type: 'input',
          width: '30%' // 整个组件占的宽度
          // widgetWidth: '200px', // 控件的宽度
          // required: true // 是否必填
        },
        {
          label: '员工编码',
          prop: 'eecode',
          type: 'input', // 搜索类型
          width: '30%'
        },
        {
          label: '身份证号',
          prop: 'idno',
          type: 'input',
          width: '30%'
        }
      ],
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
      // 身份证号转大写
      params.idno = params.idCard?.toUpperCase()
      params.status = '2'
      params.isDel = 0
      params.limit = this.$refs.table.Pagination.internalPageSize
      const fetch = service.chain.employee.list
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
