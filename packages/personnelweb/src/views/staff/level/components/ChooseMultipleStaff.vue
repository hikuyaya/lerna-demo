<!--
 * @Author: wqy
 * @Date: 2022-07-11 13:36:56
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-12 16:53:45
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
      <yid-table-column label="员工编码" prop="eeCode"></yid-table-column>
      <yid-table-column label="职务" prop="positionName"></yid-table-column>
      <yid-table-column label="身份证号" prop="cardNumber"></yid-table-column>
      <yid-table-column label="状态" prop="status">
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
      <yid-table-column label="合同状态" prop="contractStatus">
        <template slot-scope="scope">
          {{
            scope.row.contractStatus == 1
              ? '有效'
              : scope.row.contractStatus == 2
              ? '无效'
              : scope.row.contractStatus == 3
              ? '到期'
              : scope.row.contractStatus == 4
              ? '其他'
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
