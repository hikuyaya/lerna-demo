<template>
  <div class="csadjBill">
    <el-collapse-transition>
      <div v-show="showList">
        <el-form ref="searchForm" inline :model="searchForm">
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
          <el-form-item label="调整单号：" prop="billcode">
            <el-input
              v-model="searchForm.billcode"
              clearable
              style="width: 180px"></el-input>
          </el-form-item>
          <el-form-item label="充值单号：" prop="refbillcode">
            <el-input
              v-model="searchForm.refbillcode"
              clearable
              style="width: 180px"></el-input>
          </el-form-item>
          <el-form-item label="创建时间：" prop="createTimeRange">
            <div class="block">
              <el-date-picker
                :clearable="false"
                v-model="searchForm.createTimeRange"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="审核日期：" prop="sTimeRange">
            <div class="block">
              <el-date-picker
                :clearable="true"
                v-model="searchForm.sTimeRange"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="状态：" prop="status">
            <el-select
              style="width: 100px"
              v-model="searchForm.status"
              clearable
              placeholder="请选择">
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-button @click="search" type="primary">查询</el-button>
          </el-form-item>
        </el-form>
        <yid-table ref="table" pagination style="width: 100%; margin-top: 20px">
          <yid-table-column
            prop="billcode"
            label="调整单单号"
            width="150"></yid-table-column>
          <yid-table-column
            prop="shopname"
            label="门店"
            width="100"></yid-table-column>
          <yid-table-column
            prop="refbillcode"
            label="充值单号"
            width="150"></yid-table-column>
          <yid-table-column
            prop="createdBy"
            label="创建人"
            width="100"></yid-table-column>
          <yid-table-column prop="createdTime" label="创建时间" width="150">
            <template slot-scope="scope">
              {{ $yid.util.formatTime(scope.row.createdTime) }}
            </template>
          </yid-table-column>
          <yid-table-column
            prop="auditedBy"
            label="审核人"
            width="100"></yid-table-column>
          <yid-table-column prop="auditedTime" label="审核时间" width="150">
            <template slot-scope="scope">
              {{ $yid.util.formatTime(scope.row.auditedTime) }}
            </template>
          </yid-table-column>
          <yid-table-column prop="status" label="状态" width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 0">未审核</span>
              <span v-if="scope.row.status == 1">已审核</span>
            </template>
          </yid-table-column>
          <yid-table-column label="操作" min-width="120" fixed="right">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="showBill(scope.row)"
                style="margin-left: 6px"
                >明细</el-button
              >
            </template>
          </yid-table-column>
        </yid-table>
      </div>
    </el-collapse-transition>
    <el-collapse-transition>
      <div v-show="!showList">
        <el-button @click="back">返回</el-button
        >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

        <el-form
          ref="billForm"
          :model="billForm"
          style="margin-top: 20px"
          label-width="100px"
          label-position="right">
          <div id="container">
            <div style="width: 200px; display: inline-block">
              门店：{{ billForm.shopcode }}&nbsp;&nbsp;{{ billForm.shopname }}
            </div>
            <div style="width: 210px; display: inline-block">
              调整单号：{{ billForm.billcode }}
            </div>
            <div style="width: 220px; display: inline-block">
              创建时间：{{ billForm.createdTime }}
            </div>
            <div style="width: 150px; display: inline-block">
              创建人：{{ billForm.createdBy }}
            </div>
            <div style="width: 220px; display: inline-block">
              审核时间：{{ billForm.auditedTime }}
            </div>
            <div style="width: 150px; display: inline-block">
              审核人：{{ billForm.auditedBy }}
            </div>
          </div>
        </el-form>
        <div>
          <el-divider />
          <div style="width: 40%; height: 20px; display: inline-block">
            原单据信息：
          </div>
          <div style="width: 10%; height: 20px; display: inline-block"></div>
          <div style="width: 40%; height: 20px; display: inline-block">
            调整单据：
          </div>
        </div>
        <div id="billdetail">
          <div
            style="
              width: 40%;
              height: 380px;
              display: inline-block;
              border: 1px solid rgba(0, 0, 0, 0.25);
            ">
            <el-form
              ref="oldDetailForm"
              :model="oldDetailForm"
              style="margin-top: 5px; margin-left: 10px"
              label-width="100px"
              label-position="right">
              <div>
                <div style="width: 350px">
                  原单据编码：<el-input
                    v-model="oldDetailForm.refbillcode"
                    :disabled="refbillcodediv"
                    style="width: 180px"></el-input>
                  &nbsp;&nbsp;<el-link
                    :disabled="refbillcodediv"
                    type="primary"
                    @click="queryCardBill"
                    >查询</el-link
                  >
                </div>
                <div style="width: 300px">
                  会员姓名：{{ oldDetailForm.memName }}
                </div>
                <div style="width: 300px">
                  会员卡号：{{ oldDetailForm.cardno }}
                </div>
                <div style="width: 300px">
                  付款金额：{{ oldDetailForm.ysje }}
                </div>
                <div style="width: 300px">
                  充值门店：{{ oldDetailForm.refshopcode
                  }}{{ oldDetailForm.refshopname }}
                </div>
                <div style="width: 300px">
                  付款方式：
                  <span v-for="pays in oldDetailForm.csadjPayolds"
                    >{{ pays.payname }}|{{ pays.payje }}<br
                  /></span>
                </div>
              </div>
              <div>
                <el-divider />
              </div>
              <div>
                调整前：<br />
                <template v-for="station in stations">
                  <div>
                    {{ station.name }}<br />
                    <template
                      :index="index"
                      v-for="(ees, index) in oldDetailForm.csadjYjolds">
                      <div
                        v-if="station.postion === ees.postion"
                        style="margin: 5px 0 5px 0">
                        <el-select
                          placeholder="请选择"
                          disabled="disabled"
                          v-model="oldDetailForm.csadjYjolds[index].eeid"
                          style="width: 120px">
                          <template v-for="psls in station.pslist">
                            <template v-for="emp in employeeList">
                              <div v-if="emp.pscode === psls.pscode">
                                <el-option
                                  :key="emp.id"
                                  :label="emp.eename"
                                  :value="emp.id"></el-option>
                              </div>
                            </template>
                          </template>
                          <el-option
                            label="公单"
                            value="-1"></el-option> </el-select
                        >&nbsp;
                        <el-input
                          disabled="disabled"
                          v-model="oldDetailForm.csadjYjolds[index].je"
                          style="width: 150px"></el-input
                        >&nbsp;
                      </div>
                    </template>
                  </div>
                </template>
              </div>
            </el-form>
          </div>
          <div style="width: 10%; height: 380px; display: inline-block"></div>
          <div
            style="
              width: 40%;
              height: 380px;
              display: inline-block;
              border: 1px solid rgba(0, 0, 0, 0.25);
            ">
            <template v-for="station in stations">
              <div style="margin-top: 5px; margin-left: 10px">
                {{ station.name }}<br />
                <template
                  :index="index"
                  v-for="(ees, index) in oldDetailForm.csadjYjs">
                  <div
                    v-if="station.postion === ees.postion"
                    style="margin: 5px 0 5px 0">
                    <el-select
                      placeholder="请选择"
                      :disabled="showNewDetail"
                      v-model="oldDetailForm.csadjYjs[index].eeid"
                      style="width: 120px">
                      <template v-for="psls in station.pslist">
                        <template v-for="emp in employeeList">
                          <div v-if="emp.pscode === psls.pscode">
                            <el-option
                              :key="emp.id"
                              :label="emp.eename"
                              :value="emp.id"></el-option>
                          </div>
                        </template>
                      </template>
                      <el-option
                        label="公单"
                        value="-1"></el-option> </el-select
                    >&nbsp;&nbsp;
                    <el-input
                      :disabled="showNewDetail"
                      v-model="oldDetailForm.csadjYjs[index].je"
                      style="width: 150px"></el-input
                    >&nbsp;&nbsp;
                    <el-link
                      type="primary"
                      :disabled="showNewDetail"
                      @click="delEmployee(station, ees, index)"
                      >删除</el-link
                    >
                  </div>
                </template>
                <div>
                  <el-link
                    type="primary"
                    :disabled="showNewDetail"
                    @click="addEmployee(station)"
                    >添加</el-link
                  >
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
import service from '@src/service'
import yid from '@src/library'

export default {
  components: {},
  name: 'csadjBill',
  data() {
    return {
      showList: true,
      refbillcodediv: true,
      showNewDetail: true,
      searchForm: {
        billcode: '',
        refbillcode: '',
        createTimeRange: [],
        sTimeRange: [],
        status: ''
      },
      statusList: [
        {
          value: '0',
          label: '未审核'
        },
        {
          value: '1',
          label: '已审核'
        }
      ],
      billForm: {
        id: '',
        billcode: '',
        shopid: '',
        shopcode: '',
        shopname: '',
        createdTime: '',
        createdBy: '',
        auditedTime: '',
        auditedBy: '',
        status: ''
      },
      oldDetailForm: {
        memid: '',
        memName: '',
        sex: '',
        mobile: '',
        cardid: '',
        cardno: '',
        cardname: '',
        cardmemo: '',
        ysje: '',
        refbillid: '',
        refbillcode: '',
        refshopid: '',
        refshopcode: '',
        refshopname: '',
        csadjPayolds: [],
        csadjPays: [],
        csadjYjs: [],
        csadjYjolds: []
      },
      stations: [],
      employeeList: [],
      pageInfo: { page: 0, limit: 10 },
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
    this.searchForm.createTimeRange.push(date1)
    this.searchForm.createTimeRange.unshift(date1)
    this.getShopList({ status: '1' })
  },
  computed: {
    searchFormReq: function () {
      let reqObj = {}
      let createTimeRange = this.searchForm.createTimeRange
      let sTimeRange = this.searchForm.sTimeRange
      if (createTimeRange) {
        reqObj.createdTimeStart = this.searchForm.createTimeRange[0]
        reqObj.createdTimeEnd = this.searchForm.createTimeRange[1]
      } else {
        reqObj.createdTimeStart = ''
        reqObj.createdTimeEnd = ''
      }
      if (sTimeRange) {
        reqObj.auditedTimeStart = this.searchForm.sTimeRange[0]
        reqObj.auditedTimeEnd = this.searchForm.sTimeRange[1]
      } else {
        reqObj.auditedTimeStart = ''
        reqObj.auditedTimeEnd = ''
      }
      reqObj.billcode = this.searchForm.billcode
      reqObj.refbillcode = this.searchForm.refbillcode
      reqObj.status = this.searchForm.status
      reqObj.shopid = this.searchForm.shopid
      return reqObj
    }
  },
  methods: {
    search() {
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize
      let arg = this.DateMinus(
        this.searchFormReq.createdTimeStart,
        this.searchFormReq.createdTimeEnd
      )
      if (Number(arg) > 30) {
        $yid.util.error('创建时间间隔请选择30天之内!')
        return
      }
      this.getData(this.searchFormReq)
    },
    getData(reqParams) {
      const fetch = service.cashier.csadjBill.csadjRecordList
      const params = { ...this.pageInfo, ...reqParams }
      this.$refs.table.reloadData({
        fetch,
        params
      })
    },
    back() {
      this.showList = true
      this.search()
    },
    clearBillForm() {
      //清空表头信息
      this.billForm.id = ''
      this.billForm.billcode = ''
      this.billForm.shopid = ''
      this.billForm.shopcode = ''
      this.billForm.shopname = ''
      this.billForm.createdTime = ''
      this.billForm.createdBy = ''
      this.billForm.auditedTime = ''
      this.billForm.auditedBy = ''
      this.billForm.status = '0'
    },
    clearOldDetailForm() {
      //清空表单数据
      this.oldDetailForm.memid = ''
      this.oldDetailForm.memName = ''
      this.oldDetailForm.sex = ''
      this.oldDetailForm.mobile = ''
      this.oldDetailForm.cardid = ''
      this.oldDetailForm.cardno = ''
      this.oldDetailForm.cardname = ''
      this.oldDetailForm.cardmemo = ''
      this.oldDetailForm.ysje = ''
      this.oldDetailForm.refshopid = ''
      this.oldDetailForm.refshopid = ''
      this.oldDetailForm.refshopcode = ''
      this.oldDetailForm.refshopname = ''
      this.oldDetailForm.csadjPayolds = []
      this.oldDetailForm.csadjPays = []
      this.oldDetailForm.csadjYjolds = []
      this.oldDetailForm.csadjYjs = []
    },
    queryCardBill() {
      let billcode = this.oldDetailForm.refbillcode
      if (yid.util.isEmpty(billcode)) {
        yid.util.error('请输入充值单单号进行查询!')
        return
      }
      this.clearOldDetailForm()
      service.cashier.cardRecords.getCardBillForSaas(billcode).then(res => {
        if (res.resp_code == 200) {
          const cardBill = res.data
          const billhead = cardBill.billhead
          const billpays = cardBill.billpays
          const billyjolds = cardBill.billyjs
          const billyjs = []
          let target = JSON.parse(JSON.stringify(billyjolds))
          if (target.length > 0) {
            target.forEach(yj => {
              billyjs.push(yj)
            })
          }
          this.oldDetailForm.refbillid = billhead.id
          this.oldDetailForm.memid = billhead.memid
          this.oldDetailForm.memName = billhead.memName
          this.oldDetailForm.sex = billhead.sex
          this.oldDetailForm.mobile = billhead.mobile
          this.oldDetailForm.cardid = billhead.cardid
          this.oldDetailForm.cardno = billhead.cardno
          this.oldDetailForm.cardname = billhead.cardname
          this.oldDetailForm.cardmemo = billhead.cardmemo
          this.oldDetailForm.ysje = billhead.ysje
          this.oldDetailForm.refshopid = billhead.shopid
          this.oldDetailForm.refshopcode = billhead.shopcode
          this.oldDetailForm.refshopname = billhead.shopname
          this.oldDetailForm.csadjPayolds = billpays
          this.oldDetailForm.csadjPays = billpays
          this.oldDetailForm.csadjYjolds = billyjolds
          this.oldDetailForm.csadjYjs = billyjs
          //禁用单据填写输入框
          this.refbillcodediv = true
        }
      })
    },
    getStations(shopid, code) {
      //获取工位信息
      service.wheelRest
        .station({ shopid: Number(shopid), code: code })
        .then(res => {
          this.stations = res.data.desc
        })
    },
    getEmployeeList(shopid) {
      service.employee.listAll({ shopid: shopid, isDel: '0' }).then(res => {
        this.employeeList = res.data
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
    },
    showBill(row) {
      this.clearBillForm()
      this.clearOldDetailForm()
      this.oldDetailForm.refbillcode = ''
      this.refbillcodediv = true
      this.showNewDetail = true
      this.showList = false
      this.getStations(row.shopid, '002')
      this.getEmployeeList(row.shopid)
      //进行赋值
      this.billForm.id = row.id
      this.billForm.billcode = row.billcode
      this.billForm.shopid = row.shopid
      this.billForm.shopcode = row.shopcode
      this.billForm.shopname = row.shopname
      this.billForm.createdTime = row.createdTime
      this.billForm.createdBy = row.createdBy
      this.billForm.auditedTime = row.auditedTime
      this.billForm.auditedBy = row.auditedBy
      this.billForm.status = row.status
      this.oldDetailForm.refbillcode = row.refbillcode
      this.oldDetailForm.refbillid = row.id
      this.oldDetailForm.memid = row.memid
      this.oldDetailForm.memName = row.memName
      this.oldDetailForm.sex = row.sex
      this.oldDetailForm.mobile = row.mobile
      this.oldDetailForm.cardid = row.cardid
      this.oldDetailForm.cardno = row.cardno
      this.oldDetailForm.cardname = row.cardname
      this.oldDetailForm.cardmemo = row.cardmemo
      this.oldDetailForm.ysje = row.ysje
      this.oldDetailForm.refshopid = row.shopid
      this.oldDetailForm.refshopcode = row.shopcode
      this.oldDetailForm.refshopname = row.shopname
      //查询单据详情进行赋值
      service.cashier.csadjBill.getCsadjBillForSaas(row.billcode).then(res => {
        if (res.resp_code == 200) {
          var bill = res.data
          this.oldDetailForm.csadjPayolds = bill.csadjPayolds
          this.oldDetailForm.csadjPays = bill.csadjPays
          this.oldDetailForm.csadjYjolds = bill.csadjYjolds
          this.oldDetailForm.csadjYjs = bill.csadjYjs
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
    }
  }
}
</script>

<style scoped>
#container {
  width: 100%;
  height: 20px;
  /*overflow: auto;*/
  white-space: nowrap;
}
#billdetail {
  width: 100%;
  height: 420px;
  overflow: auto;
  display: flex;
}
</style>
