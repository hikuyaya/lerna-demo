<!--
 * @Author: wqy
 * @Date: 2022-08-19 14:39:59
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-30 15:58:25
 * @FilePath: \lerna-demod:\project\personnelweb\src\views\salary-report\shop-payment-detail\shopPaymentDetail.vue
 * @Description: 
-->
<template>
  <div class="container">
    <div class="content">
      <search-top ref="searchTop" :options="conditions">
        <template #inlineBtn>
          <div class="flex flex-alignitems__center mg-l-12">
            <el-button type="primary" @click="onSearch">查询</el-button>
            <!-- <el-button type="primary" @click="onReset">重置</el-button> -->
            <el-button type="primary" @click="onExport">导出</el-button>
            <p>
              <span class="mg-l-12">导出次数</span
              ><span class="mg-l-12">{{ exportTimes }}</span>
            </p>
          </div>
        </template>
      </search-top>
      <yid-table pagination :data="tableData" ref="table" class="mg-t-12">
        <yid-table-column
          label="员工编码"
          prop="eeCode"
          width="120px"></yid-table-column>
        <yid-table-column
          label="收款账户"
          prop="bankAccount"
          width="160px"></yid-table-column>
        <yid-table-column
          label="收款账户名称"
          prop="accountname"
          width="120px"></yid-table-column>
        <yid-table-column
          label="身份证号"
          prop="cardNumber"
          width="160px"></yid-table-column>
        <yid-table-column
          label="职务"
          prop="psName"
          width="100px"></yid-table-column>
        <yid-table-column
          label="交易金额"
          prop="payMoney"
          width="100px"></yid-table-column>

        <yid-table-column
          label="门店编码"
          prop="shopCode"
          width="100px"></yid-table-column>
        <yid-table-column
          label="开户银行"
          prop="bankCode"
          width="100px"></yid-table-column>
        <yid-table-column
          label="年"
          prop="year"
          width="100px"></yid-table-column>
        <yid-table-column
          label="月"
          prop="month"
          width="100px"></yid-table-column>
        <yid-table-column
          label="工资总额"
          prop="actualMoney"
          width="100px"></yid-table-column>

        <yid-table-column
          label="对公打款金额"
          prop="publicMoney"></yid-table-column>
        <yid-table-column
          label="对私打款金额"
          prop="privateMoney"></yid-table-column>
      </yid-table>
    </div>
  </div>
</template>
<script>
import SearchTop from '@src/components/base/SearchTop'
import download from '@src/library/http/download'
import service from '@src/service'
import { mapGetters } from 'vuex'

export default {
  components: { SearchTop },
  data() {
    return {
      type: '', // remove or approve
      operateType: 'add',
      selectRow: {},
      conditions: [
        {
          label: '点对点打款单号',
          prop: 'billCode',
          type: 'input',
          width: '24%',
          required: true,
          labelWidth: '1.5rem'
        },
        {
          label: '银行类型',
          prop: 'bankCode',
          type: 'select',
          width: '20%',
          options: []
        }
      ],
      tableData: [],
      exportTimes: null
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'user/userInfo'
    })
  },
  created() {},
  mounted() {
    this.queryBankDic()
    this.queryExportTimes()
    // this.queryList()
  },
  methods: {
    async queryBankDic() {
      const { data } = await service.dic.getBankList()
      this.buildConditionSelectOptions(this.conditions, 'bankCode', data, {
        label: 'name',
        value: 'code'
      })
    },
    async queryExportTimes() {
      let params = this.$refs.searchTop.getSearchParams()
      if (!params.billCode) {
        return
      }
      const { data } =
        await service.salaryReport.shopPaymentDetail.getPayCountByBillCode({
          billCode: params.billCode
        })

      this.exportTimes = data
    },
    buildConditionSelectOptions(searchConditions, field, data, property) {
      const conditions = searchConditions.find(v => v.prop === field)
      const conditionsIndex = searchConditions.findIndex(v => v.prop === field)
      this.$set(searchConditions, conditionsIndex, {
        ...conditions,
        options: data.map(v => {
          return {
            label: v[property.label],
            value: v[property.value]
          }
        })
      })
    },
    queryList() {
      this.onSearch()
    },
    async onExport() {
      const data = this.$refs.table.getCurData()
      if (!data.length) {
        this.$message.error('暂无数据可以导出')
        return
      }
      let params = this.$refs.searchTop.getSearchParams()
      await download(
        `${this.$yid.config.API.BASE}api-pers/paysalarylogbilldetail/expPaySalaryReport`,
        params,
        'get'
      )
      await this.queryExportTimes()
    },
    onSearch() {
      if (!this.$refs.searchTop.requiredValidate()) {
        this.$message.error('查询必填项或必选项不能为空')
        return
      }
      const params = this.$refs.searchTop.getSearchParams()
      params.limit = this.$refs.table.Pagination.internalPageSize
      const fetch = service.salaryReport.shopPaymentDetail.list
      this.$refs.table.reloadData({
        fetch,
        params
      })
      this.queryExportTimes()
    },
    async onReset() {
      this.$refs.searchTop.reset()
      this.onSearch()
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
