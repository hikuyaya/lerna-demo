<template>
  <div class="member-relation">
    <el-form ref="searchForm" inline :model="searchForm">
      <el-form-item label="日期：">
        <el-date-picker
          :clearable="false"
          v-model="searchForm.createdTimeRange"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-form-item
          label="门店："
          prop="shopid1"
          :rules="[{ required: true, message: '请选择一个门店' }]">
          <el-select
            clearable
            v-model.trim="searchForm.shopid1"
            filterable
            :filter-method="filterShop1"
            placeholder="请选择门店"
            style="width: 160px">
            <el-option
              :key="item.id"
              :label="item.shopname"
              :value="item.id"
              v-for="item in filterShopList1">
              <span style="float: left">{{ item.shopcode }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                item.shopname
              }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form-item>
      <el-form-item style="margin-bottom: 0">
        <el-button @click="searchPt" type="primary">查询</el-button>
        <el-button @click="seniorSearch" type="primary">高级查询</el-button>
      </el-form-item>
    </el-form>
    <yid-table pagination ref="table" style="margin-top: 15px">
      <yid-table-column label="类型" min-width="90" prop="type">
        <template slot-scope="scope">
          {{
            scope.row.type == '2'
              ? '团购'
              : scope.row.type == '3'
              ? '外卖-邮寄'
              : scope.row.type == '4'
              ? '外卖-自提'
              : ''
          }}
        </template>
      </yid-table-column>
      <yid-table-column
        label="骁骁网订单号"
        min-width="170"
        prop="billcode"></yid-table-column>
      <yid-table-column
        label="券号"
        min-width="150"
        prop="sgcode"></yid-table-column>
      <yid-table-column
        label="商品名称"
        min-width="180"
        prop="sgname"></yid-table-column>
      <yid-table-column
        label="券金额"
        min-width="80"
        prop="paymoney"></yid-table-column>
      <yid-table-column
        label="使用门店"
        min-width="100"
        prop="shopname"></yid-table-column>
      <yid-table-column
        label="核销时间"
        min-width="150"
        prop="rqsj"></yid-table-column>
      <yid-table-column
        label="顾客"
        min-width="90"
        prop="name"></yid-table-column>
      <yid-table-column label="使用状态" min-width="80" prop="status">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 'N'">未核销</span>
          <span v-if="scope.row.status == 'Y'">已核销</span>
        </template>
      </yid-table-column>
      <yid-table-column
        label="关联订单"
        min-width="150"
        prop="refbillcode"></yid-table-column>
      <yid-table-column
        label="操作人"
        min-width="90"
        prop="updatedBy"></yid-table-column>
    </yid-table>

    <yid-dialog
      :title="searchDialog.title"
      :visible.sync="searchDialog.visible"
      width="450px">
      <el-form label-width="140px" ref="copyForm">
        <el-form-item label="使用门店：">
          <el-select
            clearable
            v-model.trim="searchForm.shopid2"
            filterable
            :filter-method="filterShop2"
            placeholder="请选择门店"
            style="width: 160px">
            <el-option
              :key="item.id"
              :label="item.shopname"
              :value="item.id"
              v-for="item in filterShopList2">
              <span style="float: left">{{ item.shopcode }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                item.shopname
              }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="券号：" prop="sgcode">
          <el-input v-model="searchForm.sgcode" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="商品名称：" prop="sgname">
          <el-input v-model="searchForm.sgname" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="核销时间：" prop="rqsjTime">
          <el-date-picker
            :clearable="false"
            v-model="searchForm.rqsjRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="使用状态：" prop="status">
          <el-select
            value-key="id"
            filterable
            placeholder="请选择"
            v-model.trim="searchForm.status"
            style="width: 200px">
            <el-option
              :key="item.id"
              :label="item.name"
              :value="item.id"
              v-for="item in statusList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联订单：" prop="refbillcode">
          <el-input
            v-model="searchForm.refbillcode"
            style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="操作人：" prop="updatedBy">
          <el-input
            v-model="searchForm.updatedBy"
            style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancel">取消</el-button>
          <el-button @click="searchgj" type="primary">提交</el-button>
        </el-form-item>
      </el-form>
    </yid-dialog>
  </div>
</template>

<script>
import service from '@src/service'
import { isEmpty } from '../../library/helper/validate'

export default {
  name: 'xxwOrderList',
  components: {},
  data() {
    return {
      value1: '',
      activeName: 'analyze',
      searchForm: {
        model: 'pt',
        shopid: '',
        shopid1: '',
        shopid2: '',
        createdTimeRange: [],
        sgcode: '',
        sgname: '',
        rqsjRange: [],
        status: '',
        refbillcode: '',
        updatedBy: '',
        rqsjStart: '',
        rqsjEnd: ''
      },
      pageInfo: { page: 1, limit: 10 },
      searchDialog: {
        title: '高级查询',
        visible: false
      },
      statusList: [
        {
          id: 'Y',
          name: '已使用'
        },
        {
          id: 'N',
          name: '未使用'
        }
      ],
      filterShopList1: [],
      filterShopList2: []
    }
  },
  mounted() {
    let d = new Date()
    let year = d.getFullYear()
    let month = d.getMonth() + 1
    if (Number(month) < 10) {
      month = '0' + month
    }
    let day = d.getDate()
    if (Number(day) < 10) {
      day = '0' + day
    }
    let date1 = year + '-' + month + '-' + day
    this.searchForm.createdTimeRange.push(date1)
    this.searchForm.createdTimeRange.unshift(date1)
    //this.search();
    this.getShopList({ status: '1' })
  },
  computed: {
    searchFormReq: function () {
      let reqObj = {}
      let saleTimeRange = this.searchForm.createdTimeRange
      let rqsjRange = this.searchForm.rqsjRange
      reqObj.rqsjStart = ''
      reqObj.rqsjEnd = ''
      if (
        this.searchForm.model == 'pt' &&
        saleTimeRange &&
        saleTimeRange.length > 0
      ) {
        reqObj.rqsjStart = this.searchForm.createdTimeRange[0]
        reqObj.rqsjEnd = this.searchForm.createdTimeRange[1]
      }
      if (this.searchForm.model == 'gj' && rqsjRange && rqsjRange.length > 0) {
        reqObj.rqsjStart = this.searchForm.rqsjRange[0]
        reqObj.rqsjEnd = this.searchForm.rqsjRange[1]
      }
      reqObj.shopid = ''
      if (this.searchForm.model == 'pt' && !isEmpty(this.searchForm.shopid1)) {
        reqObj.shopid = this.searchForm.shopid1
      }
      if (this.searchForm.model == 'gj' && !isEmpty(this.searchForm.shopid2)) {
        reqObj.shopid = this.searchForm.shopid2
      }
      reqObj.sgcode = this.searchForm.sgcode
      reqObj.sgname = this.searchForm.sgname
      reqObj.status = this.searchForm.status
      reqObj.refbillcode = this.searchForm.refbillcode
      reqObj.updatedBy = this.searchForm.updatedBy
      return reqObj
    }
  },
  methods: {
    getData(reqParams) {
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize

      const fetch = service.cashier.xxworder.xxworderList
      const params = { ...this.pageInfo, ...reqParams }
      this.$refs.table.reloadData({
        fetch,
        params
      })
    },
    search() {
      this.$refs['searchForm'].validate(valid => {
        if (valid) {
          let arg = this.DateMinus(
            this.searchFormReq.rqsjStart,
            this.searchFormReq.rqsjEnd
          )
          if (Number(arg) > 30) {
            $yid.util.error('时间间隔请选择30天之内!')
            return
          }
          this.getData(this.searchFormReq)
        }
      })
    },
    seniorSearch() {
      this.searchDialog.visible = true

      this.searchForm.rqsjRange = []
      this.searchForm.sgcode = ''
      this.searchForm.sgname = ''
      this.searchForm.status = ''
      this.searchForm.refbillcode = ''
      this.searchForm.updatedBy = ''
    },
    cancel() {
      this.searchDialog.visible = false
    },
    searchPt() {
      this.searchForm.model = 'pt'
      this.searchForm.rqsjRange = []
      this.searchForm.shopid2 = ''
      this.searchForm.sgcode = ''
      this.searchForm.sgname = ''
      this.searchForm.status = ''
      this.searchForm.refbillcode = ''
      this.searchForm.updatedBy = ''
      console.log(this.searchFormReq)
      this.search()
    },
    searchgj() {
      this.searchForm.model = 'gj'
      console.log(this.searchFormReq)
      this.search()
      this.searchDialog.visible = false
    },
    getShopList(params) {
      service.chain.shop.shopList(params).then(res => {
        if (res.resp_code == 200) {
          this.filterShopList1 = res.data
          this.filterShopList2 = res.data
          this.allShopList = Object.assign(this.filterShopList1) //保留原数据
        }
      })
    },
    filterShop1(v) {
      this.filterShopList1 = this.allShopList.filter(item => {
        // 如果直接包含输入值直接返回true
        if (item.shopname.indexOf(v) !== -1) return true
        if (item.shopcode.indexOf(v) !== -1) return true
      })
    },
    filterShop2(v) {
      this.filterShopList2 = this.allShopList.filter(item => {
        // 如果直接包含输入值直接返回true
        if (item.shopname.indexOf(v) !== -1) return true
        if (item.shopcode.indexOf(v) !== -1) return true
      })
    },
    DateMinus(date1, date2) {
      //date1:小日期   date2:大日期
      var sdate = new Date(date1)
      var now = new Date(date2)
      var days = now.getTime() - sdate.getTime()
      var day = parseInt(days / (1000 * 60 * 60 * 24))
      return day
    }
  }
}
</script>

<style scoped lang="scss">
.member-relation {
}
</style>
