<template>
  <div class="checkProducts">
    <el-row type="flex" justify="space-between">
      <el-form inline>
        <el-form-item
          label="支付时间："
          prop="payTimeRange"
          label-width="100px">
          <div class="block">
            <el-date-picker
              :clearable="true"
              v-model="searchForm.payTimeRange"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </el-form-item>

        <el-form-item label="">
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-col>
        <yid-table
          pagination
          ref="table"
          style="margin-top: 15px"
          @selection-change="handleSelectionChange">
          <yid-table-column
            label="支付类型"
            prop="payname"
            width="100"></yid-table-column>
          <yid-table-column
            label="系统单号"
            prop="billcode"
            width="200"></yid-table-column>
          <yid-table-column
            label="支付金额"
            prop="money"
            width="100"></yid-table-column>
          <yid-table-column
            label="未使用金额"
            prop="verMoney"
            width="100"></yid-table-column>
          <yid-table-column label="时间" prop="payTime" width="200">
          </yid-table-column>
          <yid-table-column label="付款状态" prop="status">
            <template slot-scope="scope">
              {{ getStatusName(scope.row.status) }}
            </template>
          </yid-table-column>

          <yid-table-column label="操作" min-width="80" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="closedialogPay(scope.row)"
                >选择</el-button
              >
            </template>
          </yid-table-column>
        </yid-table>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import service from '@src/service'

export default {
  // name: "checkProducts",
  props: {
    ysje: {
      type: [String, Number],
      default: 0
    }
  },
  data: function () {
    return {
      searchForm: {
        status: '1',
        paycode: '',
        payTimeRange: []
      },
      pageInfo: { page: 0, limit: 10 },

      selectProducts: [],
      productList: [],
      statusList: [
        {
          id: 0,
          name: '未支付'
        },
        {
          id: 1,
          name: '未使用完毕'
        },
        {
          id: 2,
          name: '已使用'
        },
        {
          id: 3,
          name: '交易失败'
        },
        {
          id: 4,
          name: '已退款'
        },
        {
          id: 9,
          name: '营业外收入'
        }
      ]
    }
  },
  mounted() {
    // this.getData();
  },
  computed: {
    searchFormReq: function () {
      let reqObj = {}
      reqObj.status = this.searchForm.status
      reqObj.paycode = this.searchForm.paycode
      let payTimeRange = this.searchForm.payTimeRange
      if (payTimeRange != null && payTimeRange.length > 0) {
        reqObj.payTimeStart = this.searchForm.payTimeRange[0]
        reqObj.payTimeEnd = this.searchForm.payTimeRange[1]
      } else {
        reqObj.payTimeStart = this.getcreateDate()
        reqObj.payTimeEnd = this.getnowDate()
      }
      return reqObj
    }
  },
  methods: {
    async initData(paycode) {
      this.searchForm.paycode = paycode
      this.searchForm.status = '1'
      this.searchForm.payTimeRange = []
      this.searchForm.payTimeRange.push(this.getcreateDate())
      this.searchForm.payTimeRange.push(this.getnowDate())
      ;(this.pageInfo = { page: 0, limit: 10 }), (this.selectProducts = [])

      if (this.$refs.table != null) {
        this.$refs.table.clearData()
      }
      this.getData(this.searchFormReq)
    },
    getStatusName(key) {
      for (let i = 0; i < this.statusList.length; i++) {
        let statusObj = this.statusList[i]
        if (statusObj.id == key) {
          return statusObj.name
        }
      }
    },
    closedialogPay(row) {
      // this.$refs.table.clearSelection();
      console.log(this.ysje)
      if (row.money == this.ysje) {
        this.selectProducts = row
        this.$emit('onClose', this.selectProducts)
      } else {
        return yid.util.error('请选择与付款金额相等的流水!')
      }
    },
    getData(reqParams) {
      const fetch = service.cashier.prepaidorder.orderList
      const params = { ...this.pageInfo, ...reqParams }
      this.$refs.table.reloadData({
        fetch,
        params
      })
    },

    search() {
      this.pageInfo.page = 0
      this.getData(this.searchFormReq)
    },
    handleSelectionChange(rows) {
      this.selectProducts = rows
    },
    getnowDate() {
      let d = new Date()
      let year = d.getFullYear()
      let month = d.getMonth() + 1
      let day = d.getDate()
      if (Number(month) < 10) {
        month = '0' + month
      }
      if (Number(day) < 10) {
        day = '0' + day
      }
      let datenow = year + '-' + month + '-' + day

      return datenow
    },
    getcreateDate() {
      let d = new Date(new Date().getTime() - 15 * 24 * 3600 * 1000)
      let year = d.getFullYear()
      let month = d.getMonth() + 1
      let day = d.getDate()
      if (Number(month) < 10) {
        month = '0' + month
      }
      if (Number(day) < 10) {
        day = '0' + day
      }
      let datenow = year + '-' + month + '-' + day

      return datenow
    }
  }
}
</script>
<style></style>
