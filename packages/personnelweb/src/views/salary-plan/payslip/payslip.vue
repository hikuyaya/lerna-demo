<!--
 * @Author: wqy
 * @Date: 2022-07-21 14:27:23
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-24 10:12:53
 * @FilePath: \personnelweb\src\views\salary-plan\payslip\payslip.vue
 * @Description: 
-->

<template>
  <div class="container">
    <el-collapse-transition>
      <div v-show="!addCompVisible" class="content">
        <search-top ref="searchTop" :options="conditions">
          <template #inlineBtn>
            <div class="flex flex-alignitems__center mg-l-12">
              <el-button type="primary" @click="onSearch">查询</el-button>
              <el-button type="primary" @click="onAdd">新增</el-button>
            </div>
          </template>
        </search-top>
        <yid-table pagination :data="tableData" ref="table" class="mg-t-12">
          <yid-table-column label="门店编码" prop="shopCode"></yid-table-column>
          <yid-table-column label="门店名称" prop="shopName"></yid-table-column>
          <yid-table-column
            label="员工姓名"
            prop="eeName"
            width="100px"></yid-table-column>
          <yid-table-column label="员工编码" prop="eeCode"></yid-table-column>

          <yid-table-column label="工资年月" width="100px">
            <template slot-scope="scope">
              {{ scope.row.year }}-{{ scope.row.month }}
            </template>
          </yid-table-column>

          <yid-table-column
            label="职务"
            prop="psName"
            width="120px"></yid-table-column>
          <yid-table-column
            label="员工状态"
            prop="employeeStatus"
            width="120px">
            <template slot-scope="scope">
              {{
                scope.row.employeeStatus == 1
                  ? '正常'
                  : scope.row.employeeStatus == 2
                  ? '离职'
                  : scope.row.employeeStatus
              }}
            </template>
          </yid-table-column>
          <yid-table-column label="岗位类型" prop="type" width="120px">
            <template slot-scope="scope">
              {{
                scope.row.type == 1
                  ? '主职'
                  : scope.row.type == 2
                  ? '兼职'
                  : scope.row.type
              }}
            </template>
          </yid-table-column>

          <yid-table-column label="备注" prop="remark"></yid-table-column>

          <yid-table-column
            label="创建人"
            prop="createdBy"
            width="100px"></yid-table-column>
          <yid-table-column
            label="创建时间"
            prop="createdTime"
            width="150px"></yid-table-column>
        </yid-table>
      </div>
    </el-collapse-transition>
    <el-collapse-transition>
      <add-comp
        v-if="addCompVisible"
        ref="addCompRef"
        :value="selectRow"
        :operateType="operateType"
        @back="addCompVisible = false"
        @success="handleSaveSuccess" />
    </el-collapse-transition>
  </div>
</template>
<script>
import SearchTop from '@src/components/base/SearchTop'
import AddComp from './components/AddComp.vue'
import service from '@src/service'
export default {
  components: { SearchTop, AddComp },
  data() {
    return {
      addCompVisible: false,
      importCompVisible: false,
      operateType: 'add',
      type: '', // approve 或者 remove
      selectRow: {},
      conditions: [
        {
          label: '门店编码',
          prop: 'shopCode',
          type: 'input',
          width: '18%'
        },
        {
          label: '门店名称',
          prop: 'shopName',
          type: 'input',
          width: '18%'
        },
        {
          label: '工资年月',
          prop: 'date',
          type: 'date',
          dateType: 'month',
          width: '20%',
          format: 'yyyy年MM月',
          'value-format': 'yyyy-MM'
        }
      ],
      tableData: []
    }
  },
  created() {},
  mounted() {
    this.queryList()
  },
  methods: {
    queryList() {
      this.onSearch()
    },
    onAdd() {
      this.operateType = 'add'
      this.selectRow = {}
      this.addCompVisible = true
    },
    onSearch() {
      let params = this.$refs.searchTop.getSearchParams()
      params.limit = this.$refs.table.Pagination.internalPageSize
      let dateParams = {
        year: null,
        month: null
      }
      if (params.date) {
        const [year, month] = params.date.split('-')
        dateParams = {
          year,
          month
        }
      }
      params = {
        ...params,
        ...dateParams
      }
      const fetch = service.salaryPlan.payslip.list
      this.$refs.table.reloadData({
        fetch,
        params
      })
    },
    async handleSaveSuccess() {
      this.addCompVisible = false
      await this.queryList()
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  // display: flex;
  height: 100%;
  .content {
    // flex: 1;
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
  }
}
</style>
