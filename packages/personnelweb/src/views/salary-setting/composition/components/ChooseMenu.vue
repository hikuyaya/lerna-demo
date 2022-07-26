<!--
 * @Author: wqy
 * @Date: 2022-07-26 10:28:20
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-26 11:27:36
 * @FilePath: \personnelweb\src\views\salary-setting\composition\components\ChooseMenu.vue
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
      ref="table"
      class="mg-t-12"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="48"> </el-table-column>
      <yid-table-column label="菜单名" prop="name"></yid-table-column>
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
    },
    initData: {
      type: Array
    }
  },
  data() {
    return {
      info: {},
      selectRow: null,
      conditions: [
        {
          label: '菜单名', // 标签
          prop: 'eeName', // 绑定的字段
          // label宽度
          type: 'input',
          labelWidth: '0.8rem',
          width: '50%' // 整个组件占的宽度
        }
      ],
      tableData: [
        { name: '薪酬申报单' },
        { name: '薪酬调整单' },
        { name: '薪酬审核单' },
        { name: '扣款录入单' },
        { name: '奖金录入单' },
        { name: '出勤天数录入' }
      ],
      multipleSelection: []
    }
  },
  created() {},
  mounted() {
    // this.queryStaffList()
    this.queryMenu()
  },
  methods: {
    async queryMenu() {},
    queryStaffList() {
      this.onSearch()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    onSearch() {
      const params = this.$refs.searchTop.getSearchParams()
      params.limit = this.$refs.table.Pagination.internalPageSize
      // 身份证号转大写
      params.cardNumber = params.cardNumber?.toUpperCase()
      const fetch = service.staff.profile.list
      this.$refs.table.reloadData({
        fetch,
        params
      })
    },
    onSure() {
      if (!this.multipleSelection.length) {
        this.$message.error('请选择菜单')
        return
      }
      this.$emit('select', this.multipleSelection)
      this.$refs.table.clearSelection()
    }
  },
  watch: {
    value: {
      immediate: true,
      handler: function (val) {
        this.info = JSON.parse(JSON.stringify(val))
      }
    },
    initData: {
      immediate: true,
      handler: async function (val) {
        if (!val.length) {
          return
        }
        await this.$nextTick
        this.tableData.forEach(row => {
          if (val.includes(row.name)) {
            this.$refs.table.toggleRowSelection(row, true)
          }
        })
      }
    }
  }
}
</script>
