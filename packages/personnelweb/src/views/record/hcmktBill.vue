<template>
  <div class="member-relation">
    <el-tabs v-model="activeName" @tab-click="handleClick" v-show="!detailShow">
      <el-tab-pane label="开卡充值" name="assignment">
        <el-form ref="searchForm" inline :model="searchForm">
          <el-form-item label="查询时间：">
            <el-date-picker
              :clearable="false"
              v-model="searchForm.updatedTimeRange"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="门店：" prop="shopid">
            <el-select
              clearable
              v-model.trim="searchForm.shopid"
              @clear="clearFormShop"
              @blur="clearFormShop"
              filterable
              :filter-method="filterShop"
              placeholder="请选择门店"
              style="width: 160px">
              <el-option
                :key="item.id"
                :label="item.shopname"
                :value="item.id"
                v-for="item in filterShopList">
                <span style="float: left">{{ item.shopcode }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{
                  item.shopname
                }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="主题活动：">
            <el-input
              clearable
              v-model="searchForm.mktname"
              placeholder="活动编码/名称"
              style="width: 180px"></el-input>
          </el-form-item>
          <el-form-item label="会员：">
            <el-input
              clearable
              v-model="searchForm.memInfo"
              placeholder="姓名/手机/卡号"
              style="width: 180px"></el-input>
          </el-form-item>
          <el-form-item style="margin-bottom: 0">
            <el-button @click="search" type="primary">查询</el-button>
          </el-form-item>
        </el-form>
        <yid-table pagination ref="table" style="margin-top: 15px">
          <yid-table-column
            label="原参加活动单号"
            min-width="180"
            prop="billcode"></yid-table-column>
          <yid-table-column
            label="会员卡号"
            min-width="150"
            prop="cardno"></yid-table-column>
          <yid-table-column label="会员信息" min-width="150" prop="cardInfo">
            <template slot-scope="scope">
              <span
                >{{ scope.row.memName }} {{ getSexName(scope.row.sex) }}</span
              ><br />
              <span>{{ scope.row.mobile }}</span
              ><br />
            </template>
          </yid-table-column>
          <yid-table-column
            label="撤销活动"
            min-width="180"
            prop="mktname"></yid-table-column>
          <yid-table-column label="赠送内容" min-width="180" prop="zsinfo">
            <template slot-scope="scope">
              <span>{{ getZsInfo(scope.row) }}</span
              ><br />
            </template>
          </yid-table-column>
          <yid-table-column
            label="撤销时间"
            min-width="160"
            prop="hcTime"></yid-table-column>
          <yid-table-column
            label="操作人"
            min-width="120"
            prop="hcBy"></yid-table-column>
          <yid-table-column
            label="门店编码"
            min-width="120"
            prop="shopcode"></yid-table-column>
          <yid-table-column
            label="门店名称"
            min-width="150"
            prop="shopname"></yid-table-column>
        </yid-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import service from '@src/service'
export default {
  name: 'member-relation',
  data() {
    return {
      value1: '',
      detailShow: false,
      activeName: 'assignment',
      searchForm: {
        updatedTimeRange: [],
        shopid: '',
        isDel: '0',
        isHc: '0',
        status: '1',
        isHcMkt: '1',
        mktname: '',
        memInfo: ''
      },
      pageInfo: { page: 1, limit: 10 },
      allShopList: [],
      filterShopList: []
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
    this.searchForm.updatedTimeRange.push(date1)
    this.searchForm.updatedTimeRange.unshift(date1)
    this.getShopList({ status: '1' })
  },
  computed: {
    searchFormReq: function () {
      let reqObj = {}
      let updatedTimeRange = this.searchForm.updatedTimeRange
      if (updatedTimeRange) {
        reqObj.hcTimeStart = this.searchForm.updatedTimeRange[0]
        reqObj.hcTimeEnd = this.searchForm.updatedTimeRange[1]
      } else {
        reqObj.hcTimeStart = ''
        reqObj.hcTimeEnd = ''
      }
      reqObj.isDel = this.searchForm.isDel
      reqObj.isHc = this.searchForm.isHc
      reqObj.status = this.searchForm.status
      reqObj.isHcMkt = this.searchForm.isHcMkt
      reqObj.shopid = this.searchForm.shopid
      reqObj.memInfo = this.searchForm.memInfo
      reqObj.mktname = this.searchForm.mktname
      return reqObj
    }
  },
  methods: {
    getData(reqParams) {
      const fetch = service.cashier.cardRecords.cardRecordList
      const params = { ...this.pageInfo, ...reqParams }
      this.$refs.table.reloadData({
        fetch,
        params
      })
    },
    search() {
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize
      if (
        $yid.util.isEmpty(this.searchFormReq.hcTimeStart) ||
        $yid.util.isEmpty(this.searchFormReq.hcTimeEnd)
      ) {
        $yid.util.alert('请选择日期再进行查询!')
        return
      }
      let arg = this.DateMinus(
        this.searchFormReq.hcTimeStart,
        this.searchFormReq.hcTimeEnd
      )
      if (Number(arg) > 30) {
        $yid.util.error('时间间隔请选择30天之内!')
        return
      }
      this.getData(this.searchFormReq)
    },
    getSexName(sex) {
      let res = ''
      if (sex === '1') {
        res = '男'
      } else if (sex === '2') {
        res = '女'
      }
      return res
    },
    DateMinus(date1, date2) {
      //date1:小日期   date2:大日期
      var sdate = new Date(date1)
      var now = new Date(date2)
      var days = now.getTime() - sdate.getTime()
      var day = parseInt(days / (1000 * 60 * 60 * 24))
      return day
    },
    getZsInfo(row) {
      const zsinfo = {}
      if (row.cardZsInfoVOS && row.cardZsInfoVOS.length > 0) {
        let walletsArr = []
        let zqArr = []
        let sersArr = []
        let productsArr = []
        row.cardZsInfoVOS.filter(a => {
          if (a.btype == 1) {
            walletsArr.push(a.name)
          }
        })
        row.cardZsInfoVOS.filter(a => {
          if (a.btype == 2) {
            zqArr.push(a.name)
          }
        })
        row.cardZsInfoVOS.filter(a => {
          if (a.btype == 3) {
            if (a.num > 1) {
              sersArr.push(a.name + '*' + a.num)
            } else {
              sersArr.push(a.name)
            }
          }
        })
        row.cardZsInfoVOS.filter(a => {
          if (a.btype == 4) {
            if (a.num > 1) {
              productsArr.push(a.name + '*' + a.num)
            } else {
              productsArr.push(a.name)
            }
          }
        })
        zsinfo.name = row.mktname
        zsinfo.walletname = walletsArr.join(',')
        zsinfo.zqname = zqArr.join(',')
        zsinfo.sername = sersArr.join(',')
        zsinfo.productname = productsArr.join(',')
      }
      let result = ''
      if (Number(row.gmoney) > 0) {
        result = result + '赠送金：￥' + row.gmoney + '/'
      }
      if (!$yid.util.isEmpty(zsinfo.walletname)) {
        result = result + '赠送红包：' + zsinfo.walletname + '/'
      }
      if (!$yid.util.isEmpty(zsinfo.sername)) {
        result = result + '赠送服务项目：' + zsinfo.sername + '/'
      }
      if (!$yid.util.isEmpty(zsinfo.productname)) {
        result = result + '赠送产品：' + zsinfo.productname + '/'
      }
      if (!$yid.util.isEmpty(zsinfo.zqname)) {
        result = result + '赠送优惠券：' + zsinfo.zqname + '/'
      }
      if (!$yid.util.isEmpty(result)) {
        return result.substr(0, result.length - 1)
      } else {
        return result
      }
    },
    getShopList(params) {
      service.chain.shop.shopList(params).then(res => {
        if (res.resp_code == 200) {
          this.filterShopList = res.data
          this.allShopList = Object.assign(this.filterShopList) //保留原数据
        }
      })
    },
    filterShop(v) {
      this.filterShopList = this.allShopList.filter(item => {
        // 如果直接包含输入值直接返回true
        if (item.shopname.indexOf(v) !== -1) return true
        if (item.shopcode.indexOf(v) !== -1) return true
      })
    },
    clearFormShop() {
      setTimeout(() => {
        if (this.searchForm.shopid == '') {
          this.searchForm.shopid = ''
          this.filterShopList = Object.assign(this.allShopList)
        }
      }, 300)
    }
  }
}
</script>

<style scoped lang="scss">
.member-relation {
}
</style>
