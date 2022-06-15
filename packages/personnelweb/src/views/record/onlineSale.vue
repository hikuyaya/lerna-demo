<template>
  <div class="member-relation">
    <el-collapse-transition>
      <div v-show="!detailShow">
        <el-form ref="searchForm" inline :model="searchForm">
          <el-form-item label="日期：">
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
          <el-form-item label="业务类型：">
            <el-select
              clearable
              v-model="searchForm.brandCode"
              @change="changeShop"
              style="width: 100px">
              <el-option label="美发" value="1"></el-option>
              <el-option label="美容" value="2"></el-option>
            </el-select>
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
          <el-form-item style="margin-bottom: 0">
            <el-button @click="search" type="primary">查询</el-button>
            <!-- <el-button @click="seniorSearch" type="primary">高级查询</el-button> -->
          </el-form-item>
        </el-form>
        <el-alert v-model="viewTotal" :title="viewTotal.title" type="info">
        </el-alert>

        <!-- 线上客装销售记录 -->
        <yid-table
          class="onlinetable"
          pagination
          ref="table"
          style="margin-top: 15px">
          <yid-table-column
            label="线上客装销售单号"
            min-width="200"
            prop="billcode"></yid-table-column>
          <yid-table-column
            label="店名"
            min-width="150"
            prop="shopname"></yid-table-column>
          <yid-table-column
            label="提货时间"
            min-width="200"
            prop="updatedTime"></yid-table-column>
          <yid-table-column label="顾客" min-width="200" prop="memname">
            <template slot-scope="scope">
              <!-- {{scope.row.memname + ' '+scope.row.sex + ' ' + scope.row.mobile}} -->
              {{ scope.row.memname }}
              {{
                scope.row.sex == null ? '' : scope.row.sex == 1 ? '男' : '女'
              }}
              {{ scope.row.mobile }}
            </template>
          </yid-table-column>
          <yid-table-column label="客装" min-width="200" prop="pid">
            <template slot-scope="scope">
              {{
                scope.row.pcode + ' ' + scope.row.pname + ' * ' + scope.row.num
              }}
            </template>
          </yid-table-column>
          <yid-table-column
            label="单据金额"
            min-width="200"
            prop="hjbillje"></yid-table-column>
          <yid-table-column label="提货方式" min-width="200" prop="pickWay">
            <template slot-scope="scope">
              {{
                scope.row.pickWay == 0
                  ? '物流部邮寄'
                  : scope.row.pickWay == 1
                  ? '到店自提'
                  : ''
              }}
            </template>
          </yid-table-column>
          <yid-table-column
            label="操作人"
            min-width="150"
            prop="createdBy"></yid-table-column>
          <yid-table-column
            label="详情"
            min-width="150"
            prop="content"
            fixed="right">
            <template slot-scope="scope">
              <el-link type="primary" @click="checkDetail(scope.row)"
                >详情</el-link
              >
            </template>
          </yid-table-column>
        </yid-table>
      </div>
    </el-collapse-transition>

    <el-collapse-transition>
      <div v-show="detailShow">
        <billDetail
          ref="billDetailPage"
          :pageName="pageName"
          @onClose="closeDetailPage"></billDetail>
      </div>
    </el-collapse-transition>

    <!-- 高级查询 -->
    <!-- <yid-dialog :title="searchDialog.title" :visible.sync="searchDialog.visible" width="450px">
            <el-form label-width="140px" ref="copyForm">
                <el-form-item label="优惠券：" prop="cpname">
                    <el-input  v-model="searchForm.cpname"  style="width: 180px;"></el-input>
                </el-form-item>
                <el-form-item label="操作人：" prop="createdBy">
                        <el-input  v-model="searchForm.createdBy" style="width: 180px;"></el-input>
                </el-form-item>
                <el-form-item label="服务员工：" prop="eeid">
                        <el-input  v-model="searchForm.eename" style="width: 180px;"></el-input>

                </el-form-item>
                <el-form-item label="项目：" prop="sid">
                    <el-select v-model="searchForm.sid" filterable placeholder="请选择" clearable>
                        <el-option
                                v-for="item in sers"
                                :key="item.servcode"
                                :label="item.servname"
                                :value="item.servcode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="营销活动：" prop="maid">
                    <el-select v-model="searchForm.maid" filterable placeholder="请选择" clearable>
                        <el-option
                                v-for="item in mktInfos"
                                :key="item.billcode"
                                :label="item.name"
                                :value="item.billcode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button @click="cancel">取消</el-button>
                    <el-button @click="searchgj" type="primary">提交</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog> -->
  </div>
</template>

<script>
import service from '@src/service'
import billDetail from './billDetail'

export default {
  components: {
    billDetail
  },
  data() {
    return {
      pageName: 'onlineSale',
      detailShow: false,
      searchForm: {
        updatedTimeRange: [],
        // isDel : '0',
        // isHc : '0',
        // status : '1',
        billcode: '',
        mobile: '',
        // paycode : '',
        memName: '',
        // mktbillcode : '',
        cmcode: '',
        // isOpen : '',
        eeid: '',
        shopid: '',
        eename: '',
        // mktname:"",
        // ismkt : "",
        cpname: '', //优惠券
        brandCode: '',
        maid: '', //营销活动
        sid: '', //项目
        createdBy: '' //操作人
      },
      filterShopList: [], //门店列表
      viewTotal: {
        title: '本次查询共  0 条记录    合计总金额：￥0'
      },
      // searchDialog: {
      //     title: '高级查询',
      //     visible: false,
      // },
      sers: [],
      mktInfos: [],
      pageInfo: { page: 1, limit: 10 },
      detailInitData: {} // 传入明细组件的初始值
    }
  },
  computed: {
    searchFormReq: function () {
      let reqObj = {}
      let updatedTimeRange = this.searchForm.updatedTimeRange
      if (updatedTimeRange) {
        reqObj.updatedTimeStart = this.searchForm.updatedTimeRange[0]
        reqObj.updatedTimeEnd = this.searchForm.updatedTimeRange[1]
      } else {
        reqObj.updatedTimeStart = ''
        reqObj.updatedTimeEnd = ''
      }
      reqObj.billcode = this.searchForm.billcode
      reqObj.mobile = this.searchForm.mobile
      // reqObj.paycode = this.searchForm.paycode
      reqObj.memName = this.searchForm.memName
      reqObj.cmcode = this.searchForm.cmcode
      // reqObj.isOpen = this.searchForm.isOpen
      reqObj.eeid = this.searchForm.eeid
      // reqObj.isDel = this.searchForm.isDel
      // reqObj.status = this.searchForm.status
      // reqObj.isHc = this.searchForm.isHc
      reqObj.shopid = this.searchForm.shopid
      reqObj.eename = this.searchForm.eename
      // reqObj.mktname = this.searchForm.mktname
      // reqObj.mktbillcode = this.searchForm.mktbillcode
      // reqObj.ismkt = this.searchForm.ismkt
      reqObj.brandCode = this.searchForm.brandCode
      reqObj.maid = this.searchForm.maid
      reqObj.sid = this.searchForm.sid
      reqObj.createdBy = this.searchForm.createdBy
      reqObj.cpname = this.searchForm.cpname
      return reqObj
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
    this.getServs()
    this.getShopList({ status: '1' })
    this.getMktInfos()
  },
  methods: {
    getData(reqParams) {
      const fetch = service.cashier.onlineSale.getOnlineSaleList
      const params = { ...this.pageInfo, ...reqParams }
      this.$refs.table.reloadData({
        fetch,
        params
      })
      // console.log(temp)
      //显示总条数和金额
      service.cashier.onlineSale.xxwFindProductNum(params).then(res => {
        if (res.resp_code == 200) {
          let date = res.data
          if (date != null) {
            this.viewTotal.title =
              '本次查询共  ' +
              date.totalNum +
              ' 条记录    合计总金额：￥' +
              date.totalMoney
          }
        }
      })
    },
    //打开详情
    checkDetail(row) {
      console.log(row)
      this.detailShow = true
      this.detailInitData.billid = row.id
      this.detailInitData.entryData = row

      this.$refs.billDetailPage.initData(this.detailInitData)
    },
    //关闭详情
    closeDetailPage() {
      this.detailInitData = {}
      this.detailShow = false
      this.search()
    },
    //业务类型change
    changeShop() {
      const param = {}
      let type = this.searchForm.brandCode
      param.status = '1'
      param.type = type
      service.chain.shop.shopList(param).then(res => {
        if (res.resp_code == 200) {
          this.filterShopList = res.data
          this.allShopList = Object.assign(this.filterShopList) //保留原数据
        }
      })
    },
    //清除门店内容
    clearFormShop() {
      setTimeout(() => {
        if (this.searchForm.shopid == '') {
          this.searchForm.shopid = ''
          this.filterShopList = Object.assign(this.allShopList)
        }
      }, 300)
    },
    filterShop(v) {
      this.filterShopList = this.allShopList.filter(item => {
        // 如果直接包含输入值直接返回true
        if (item.shopname.indexOf(v) !== -1) return true
        if (item.shopcode.indexOf(v) !== -1) return true
      })
    },
    getShopList(params) {
      service.chain.shop.shopList(params).then(res => {
        if (res.resp_code == 200) {
          this.filterShopList = res.data
          this.allShopList = Object.assign(this.filterShopList) //保留原数据
        }
      })
    },
    //查询
    search() {
      this.$refs['searchForm'].validate(valid => {
        if (valid) {
          this.pageInfo.page = 1
          this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize
          if (
            $yid.util.isEmpty(this.searchFormReq.updatedTimeStart) ||
            $yid.util.isEmpty(this.searchFormReq.updatedTimeEnd)
          ) {
            $yid.util.alert('请选择日期再进行查询!')
            return
          }
          let arg = this.DateMinus(
            this.searchFormReq.updatedTimeStart,
            this.searchFormReq.updatedTimeEnd
          )
          if (Number(arg) > 30) {
            $yid.util.error('时间间隔请选择30天之内!')
            return
          }
          this.cleanSearch()
          this.getData(this.searchFormReq)
        }
      })
    },
    //高级查询
    gjsearch() {
      this.$refs['searchForm'].validate(valid => {
        if (valid) {
          this.pageInfo.page = 1
          this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize
          if (
            $yid.util.isEmpty(this.searchFormReq.updatedTimeStart) ||
            $yid.util.isEmpty(this.searchFormReq.updatedTimeEnd)
          ) {
            $yid.util.alert('请选择日期再进行查询!')
            return
          }
          let arg = this.DateMinus(
            this.searchFormReq.updatedTimeStart,
            this.searchFormReq.updatedTimeEnd
          )
          if (Number(arg) > 30) {
            $yid.util.error('时间间隔请选择30天之内!')
            return
          }
          this.getData(this.searchFormReq)
        }
      })
    },
    DateMinus(date1, date2) {
      //date1:小日期   date2:大日期
      var sdate = new Date(date1)
      var now = new Date(date2)
      var days = now.getTime() - sdate.getTime()
      var day = parseInt(days / (1000 * 60 * 60 * 24))
      return day
    },
    cleanSearch() {
      this.searchForm.billcode = ''
      this.searchForm.mobile = ''
      // this.searchForm.paycode = '';
      this.searchForm.memName = ''
      this.searchForm.cmcode = ''
      // this.searchForm.isOpen = '';
      this.searchForm.eeid = ''
      // this.searchForm.minmoney = '';
      // this.searchForm.maxmoney = '';
      // this.searchForm.ismkt = '';
      // this.searchForm.mktbillcode = '';
      this.searchForm.eename = ''
      this.searchForm.maid = ''
      this.searchForm.sid = ''
      this.searchForm.createdBy = ''
      this.searchForm.cpname = ''
    },
    seniorSearch() {
      this.searchDialog.visible = true
    },
    getServs() {
      service.member.memberinfo
        .selectServiceschain({ isDel: '0', status: '1' })
        .then(res => {
          if (res.resp_code == 200) {
            this.sers = res.data
          }
        })
    },
    getMktInfos() {
      service.cashier.mktInfo.listAll({ status: '2' }).then(res => {
        if (res.resp_code == 200) {
          this.mktInfos = res.data
        }
      })
    },
    cancel() {
      this.searchDialog.visible = false
    },
    searchgj() {
      // console.log(this.searchFormReq);
      this.gjsearch()
      this.searchDialog.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-date-editor .el-range-separator {
  width: 10%;
}
.onlinetable {
  /deep/ .el-table__cell {
    text-align: center;
  }
}
</style>
