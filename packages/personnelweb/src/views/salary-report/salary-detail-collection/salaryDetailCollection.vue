<!--
 * @Author: wqy
 * @Date: 2022-08-19 10:48:20
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-19 14:09:30
 * @FilePath: \personnelweb\src\views\salary-report\salary-detail-collection\salaryDetailCollection.vue
 * @Description: 
-->
<template>
  <div class="container">
    <div class="content">
      <search-top
        ref="searchTop"
        :options="conditions"
        :advanceOptions="advanceConditions"
        :defaultParams="params">
        <template #inlineBtn>
          <div class="flex flex-alignitems__center mg-l-12">
            <el-button type="primary" @click="onSearch">查询</el-button>
            <el-button type="primary" @click="onReset">重置</el-button>
            <el-button type="primary" @click="onExport">导出</el-button>
          </div>
        </template>
      </search-top>
      <yid-table pagination :data="tableData" ref="table" class="mg-t-12">
        <yid-table-column
          label="门店编码"
          prop="shopCode"
          width="100px"></yid-table-column>
        <yid-table-column
          label="门店名称"
          prop="shopName"
          width="100px"></yid-table-column>
        <yid-table-column
          label="员工姓名"
          prop="eeName"
          width="100px"
          fixed></yid-table-column>
        <yid-table-column
          label="员工编码"
          prop="eeCode"
          width="120px"
          fixed></yid-table-column>

        <yid-table-column
          label="职务"
          prop="psName"
          width="100px"
          fixed></yid-table-column>
        <yid-table-column
          label="级别"
          prop="pslName"
          width="100px"></yid-table-column>
        <yid-table-column
          label="级别1"
          prop="psl1Name"
          width="100px"></yid-table-column>
        <yid-table-column
          label="年"
          prop="year"
          width="80px"></yid-table-column>
        <yid-table-column
          label="月"
          prop="month"
          width="80px"></yid-table-column>
        <yid-table-column label="审核状态" prop="approvalStatus" width="100px">
          <template slot-scope="scope">
            {{
              scope.row.approvalStatus == 1
                ? '待提交'
                : scope.row.approvalStatus == 2
                ? '待审核'
                : scope.row.approvalStatus == 3
                ? '已审核'
                : scope.row.approvalStatus == 0
                ? '已驳回'
                : scope.row.approvalStatu
            }}
          </template>
        </yid-table-column>
        <yid-table-column label="计算状态" prop="isCalc" width="100px">
          <template slot-scope="scope">
            {{
              scope.row.isCalc == 1
                ? '已计算'
                : scope.row.isCalc == 0
                ? '未计算'
                : scope.row.isCalc
            }}
          </template>
        </yid-table-column>
        <yid-table-column
          label="实发工资"
          prop="actualMoney"
          width="100px"></yid-table-column>
        <yid-table-column
          label="应发工资"
          prop="addMoney"
          width="100px"></yid-table-column>
        <yid-table-column
          label="支出合计"
          prop="subMoney"
          width="100px"></yid-table-column>
        <yid-table-column
          v-for="column in dynamicColumns"
          :key="column.eeCode"
          :label="column.label"
          :prop="column.label"></yid-table-column>
      </yid-table>
    </div>
  </div>
</template>
<script>
import SearchTop from '@src/components/base/SearchTop'
import download from '@src/library/http/download'
import service from '@src/service'
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
  components: { SearchTop },
  data() {
    return {
      type: '', // remove or approve
      operateType: 'add',
      selectRow: {},
      params: {},
      conditions: [
        {
          label: '门店类型',
          prop: 'shopType',
          type: 'select', // 搜索类型
          width: '20%',
          labelWidth: '1.2rem',
          options: [
            { label: '美发门店', value: 1 },
            { label: '美容门店', value: 2 }
          ],
          required: true
        },

        {
          label: '年月',
          prop: 'date',
          type: 'date',
          dateType: 'month',
          width: '20%',
          format: 'yyyy年M月',
          'value-format': 'yyyy-M',
          required: true
        }
      ],
      advanceConditions: [
        {
          label: '门店编码',
          prop: 'shopCode',
          type: 'input',
          width: '20%'
        },
        {
          label: '员工姓名',
          prop: 'eeName',
          type: 'input',
          width: '20%'
        },
        {
          label: '员工编码',
          prop: 'eeCode',
          type: 'input',
          width: '20%'
        },
        {
          label: '审核状态',
          prop: 'approvalStatus',
          type: 'select',
          width: '20%',
          options: [
            { label: '待审核', value: '2' },
            { label: '已审核', value: '3' }
          ]
        },
        {
          label: '计算状态',
          prop: 'isCalc',
          type: 'select',
          width: '20%',
          options: [
            { label: '已计算', value: '1' },
            { label: '未计算', value: '0' }
          ]
        }
      ],
      tableData: [],
      dynamicColumns: [],
      count: 0
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'user/userInfo',
      salCompMenus: 'user/salaryBusinessMenu'
    })
  },
  created() {},
  mounted() {
    this.initDate()
    // this.queryList()
  },
  methods: {
    initDate() {
      this.params = {
        date: moment(new Date()).subtract(1, 'months').format('yyyy-M')
      }
    },
    queryList() {
      this.onSearch()
    },
    onExport() {
      const data = this.$refs.table.getCurData()
      if (!data.length) {
        this.$message.error('暂无数据可以导出')
        return
      }
      let params = this.$refs.searchTop.getSearchParams()
      const [year, month] = params.date.split('-')
      params = {
        ...params,
        year,
        month
      }
      delete params.date

      download(
        `${this.$yid.config.API.BASE}api-pers/salary/reportForm/down/salaryList`,
        params
      )
    },
    async onSearch() {
      if (!this.$refs.searchTop.requiredValidate()) {
        this.$message.error('查询必填项或必选项不能为空')
        return
      }
      let params = this.$refs.searchTop.getSearchParams()
      params.limit = this.$refs.table.Pagination.internalPageSize

      const [year, month] = params.date.split('-')
      params = {
        ...params,
        year,
        month
      }
      this.params = {
        date: params.date
      }
      delete params.date

      const fetch = service.salaryReport.salaryDetailCollection.list
      await this.$refs.table.reloadData({
        fetch,
        params
      })
      await this.$nextTick()
      const data = this.$refs.table.getCurData()

      const { data: tableData, columns } = this.buildDynamic(
        data || [],
        'salaryItemVOList'
      )
      this.dynamicColumns = columns
      this.tableData = tableData
    },
    // 构造动态数据、列
    buildDynamic(data, key) {
      let columns = []
      for (let i = 0; i < data.length; i++) {
        const d = data[i]
        for (let j = 0; j < d[key].length; j++) {
          const salItem = d[key][j]
          const label = salItem.scName
          const value = salItem.money
          const code = salItem.scCode
          d[label] = value
          if (i === 0) {
            columns.push({
              label,
              value,
              code,
              inputType: salItem.inputtype
            })
          }
        }
      }
      columns.sort((prev, next) => prev.inputType - next.inputType)
      return {
        columns,
        data
      }
    },
    async onReset() {
      this.$refs.searchTop.reset()
      //   this.onSearch()
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  // display: flex;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  .content {
    // flex: 1;
  }
}
</style>
