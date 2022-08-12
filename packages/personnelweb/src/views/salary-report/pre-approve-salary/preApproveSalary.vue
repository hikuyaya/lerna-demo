<!--
 * @Author: wqy
 * @Date: 2022-08-12 15:02:18
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-12 16:18:59
 * @FilePath: \personnelweb\src\views\salary-report\pre-approve-salary\preApproveSalary.vue
 * @Description: 
-->
<template>
  <div class="container">
    <div class="content">
      <search-top ref="searchTop" :options="conditions">
        <template #inlineBtn>
          <div class="flex flex-alignitems__center mg-l-12">
            <el-button type="primary" @click="onSearch">查询</el-button>
            <el-button type="primary" @click="onPrint">打印</el-button>
          </div>
        </template>
      </search-top>
      <yid-table :data="tableData" ref="table" class="mg-t-12">
        <yid-table-column label="员工姓名" prop="eeName" width="100px" fixed>
        </yid-table-column>
        <yid-table-column
          label="员工编码"
          prop="eeCode"
          width="80px"
          fixed></yid-table-column>
        <yid-table-column
          label="门店名称"
          prop="shopCode"
          width="150px"
          fixed></yid-table-column>
        <yid-table-column
          label="职务"
          prop="psName"
          width="150px"
          fixed></yid-table-column>
        <yid-table-column
          label="级别"
          prop="psName"
          width="150px"
          fixed></yid-table-column>
        <yid-table-column
          v-for="column in dynamicColumns"
          :key="column.eeCode"
          :label="column.label"
          :prop="column.label">
          <template slot-scope="scope">
            <span v-if="operateType === 'detail'">{{
              scope.row[column.label]
            }}</span>
            <el-input-number
              v-else
              v-model="scope.row[column.label]"
              :controls="false"
              :min="0"
              class="w100">
            </el-input-number>
          </template>
        </yid-table-column>
      </yid-table>
    </div>
  </div>
</template>
<script>
import SearchTop from '@src/components/base/SearchTop'
import service from '@src/service'
export default {
  components: { SearchTop },
  data() {
    return {
      addCompVisible: false,
      removeCompVisible: false,
      operateType: 'add',
      selectRow: {},
      conditions: [
        {
          label: '年',
          prop: 'year',
          type: 'input-number',
          labelWidth: '0.6rem',
          controls: false,
          min: 1970,
          max: new Date().getFullYear(),
          width: '12%',
          required: true
        },
        {
          label: '月',
          prop: 'month',
          type: 'input-number',
          labelWidth: '0.6rem',
          width: '12%',
          controls: false,
          min: 1,
          max: 12,
          required: true
        }
      ],
      tableData: [],
      dynamicColumns: []
    }
  },
  mounted() {
    // this.queryList()
  },
  methods: {
    queryList() {
      this.onSearch()
    },
    async onSearch() {
      if (!this.$refs.searchTop.requiredValidate()) {
        this.$message.error('查询必填项或必选项不能为空')
        return
      }
      const params = this.$refs.searchTop.getSearchParams()
      delete params.page
      delete params.limit
      const { data } = await service.salaryReport.preApproveSalary.list(params)
      const { data: tableData, columns } = this.buildDynamic(
        data || [],
        'salaryApplyBillItemVOList'
      )

      this.tableData = tableData
      this.dynamicColumns = columns
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
          d[label] = value
          if (i === 0) {
            columns.push({
              label,
              value
            })
          }
        }
      }
      return {
        columns,
        data
      }
    },
    onPrint() {
      // TODO
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
  }
}
</style>
