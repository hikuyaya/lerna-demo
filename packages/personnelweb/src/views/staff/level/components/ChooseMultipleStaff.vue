<!--
 * @Author: wqy
 * @Date: 2022-07-11 13:36:56
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-22 17:41:09
 * @FilePath: \personnelweb\src\views\staff\level\components\ChooseMultipleStaff.vue
 * @Description: 
-->
<template>
  <div>
    <search-top ref="searchTop" :options="conditions">
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
      pagination
      ref="table"
      class="mg-t-12"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="48"> </el-table-column>
      <yid-table-column label="员工姓名" prop="eeName"></yid-table-column>
      <yid-table-column label="岗位" prop="postName"></yid-table-column>
      <yid-table-column label="编码" prop="postCode"></yid-table-column>
      <yid-table-column label="机构编码" prop="bbCode"></yid-table-column>
      <yid-table-column label="机构名称" prop="bbName"></yid-table-column>
      <yid-table-column label="职务" prop="positionName"></yid-table-column>
      <yid-table-column
        label="职务级别"
        prop="positionLevelName"></yid-table-column>
      <yid-table-column label="职务级别1" prop="level1Name"></yid-table-column>
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
          label: '岗位名称',
          prop: 'postName',
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
      const fetch = service.staff.level.getByEeCode
      this.$refs.table.reloadData({
        fetch,
        params
      })
    },
    onSure() {
      if (!this.multipleSelection.length) {
        this.$message.error('请选择人员')
        return
      }
      this.$emit('select', this.multipleSelection)
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
