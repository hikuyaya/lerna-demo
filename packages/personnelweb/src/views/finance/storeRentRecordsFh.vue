<template>
  <div class="storeRentRecords">
    <el-collapse-transition>
      <div v-show="showList">
        <el-button v-if="isCancel" @click="cancelAuditBill" type="primary"
          >取消审批</el-button
        >
        <el-button @click="importBill" type="primary">导出</el-button>
        <div style="margin-top: -5px">
          <el-divider />
        </div>
        <el-form ref="searchForm" inline :model="searchForm">
          <el-form-item label="单据编码：" prop="billcode" label-width="100px">
            <el-input
              clearable
              v-model="searchForm.billcode"
              placeholder="单据编码"
              style="width: 180px"></el-input>
          </el-form-item>
          <el-form-item label="审核人：" prop="code" label-width="100px">
            <el-input
              clearable
              v-model="searchForm.auditor"
              placeholder="审核人"
              style="width: 160px"></el-input>
          </el-form-item>
          <el-form-item
            label="审核日期："
            prop="sTimeRange"
            label-width="100px">
            <div class="block">
              <el-date-picker
                :clearable="true"
                v-model="searchForm.auditdateRange"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="单据状态：" prop="status" label-width="100px">
            <el-select
              clearable
              style="width: 120px"
              v-model="searchForm.status"
              placeholder="请选择">
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <br />
          <el-form-item label="业务类型：" prop="shopType" label-width="100px">
            <el-select
              clearable
              v-model="searchForm.shopType"
              @change="changeShop"
              style="width: 180px">
              <el-option label="美发" value="1"></el-option>
              <el-option label="美容" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="门店：" prop="shopid" label-width="100px">
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
          <el-form-item label="汇总类型：" prop="sumtype" label-width="100px">
            <el-select
              style="width: 120px"
              v-model="searchForm.sumtype"
              clearable
              placeholder="请选择">
              <el-option
                v-for="item in sumtypeList"
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
        <yid-table
          ref="table"
          pagination
          style="width: 100%; margin-top: 10px"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <yid-table-column
            prop="billcode"
            label="单据编码"
            width="150"></yid-table-column>
          <yid-table-column
            prop="createdBy"
            label="制单人"
            width="100"></yid-table-column>
          <yid-table-column prop="createdTime" label="制单日期" width="150">
            <template slot-scope="scope">
              {{ $yid.util.formatTime(scope.row.createdTime) }}
            </template>
          </yid-table-column>
          <yid-table-column prop="status" label="审核状态" width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 2">已提交</span>
              <span v-if="scope.row.status == 3">已审批</span>
              <span v-if="scope.row.status == 0">已驳回</span>
              <span v-if="scope.row.status == 9">已作废</span>
            </template>
          </yid-table-column>
          <yid-table-column
            prop="auditor"
            label="审核人"
            width="100"></yid-table-column>
          <yid-table-column prop="auditdate" label="审核日期" width="150">
            <template slot-scope="scope">
              {{ $yid.util.formatTime(scope.row.auditdate) }}
            </template>
          </yid-table-column>
          <yid-table-column
            prop="shopcode"
            label="门店编码"
            width="100"></yid-table-column>
          <yid-table-column
            prop="shopname"
            label="门店名称"
            width="120"></yid-table-column>
          <yid-table-column
            prop="totalmoney"
            label="金额"
            width="80"></yid-table-column>
          <yid-table-column
            prop="rejectmemo"
            label="驳回原因"
            width="150"></yid-table-column>
          <yid-table-column label="操作" min-width="150" fixed="right">
            <template slot-scope="scope">
              <el-link type="primary" @click="editBill(scope.row)"
                >查看</el-link
              >
            </template>
          </yid-table-column>
        </yid-table>
      </div>
    </el-collapse-transition>
    <el-collapse-transition>
      <div v-show="!showList">
        <el-button @click="back" type="primary">返回</el-button>
        <el-button v-show="showButton" @click="auditBill" type="primary"
          >审核</el-button
        >
        <el-button
          v-show="showButtonS"
          @click="cancelAuditButton"
          type="primary"
          >取消审批</el-button
        >
        <el-button v-show="showButton" @click="openRejectDialog" type="primary"
          >驳回</el-button
        >
        <el-button style="margin-left: 25px" @click="$Print('#printId')"
          >打印</el-button
        >
        <!--                <el-button style="margin-left:25px;" v-print="printObj">打印</el-button>-->
        <div
          ref="printId"
          id="printId"
          cellspacing="0"
          cellpadding="0"
          border="0">
          <el-form
            ref="billForm"
            :model="billForm"
            style="margin-top: 16px"
            :rules="rules"
            label-width="100px"
            label-position="right">
            <div class="container">
              <div style="width: 250px; display: inline-block">
                单据编码：{{ billForm.billcode }}
              </div>
              <div style="width: 250px; display: inline-block">
                单据状态：
                <el-select
                  style="width: 100px"
                  v-model="billForm.status"
                  disabled="disabled">
                  <el-option
                    v-for="item in statusList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div style="width: 210px; display: inline-block">
                审核人：{{ billForm.auditor }}
              </div>
              <div style="display: inline-block">
                审核时间：{{ billForm.auditdate }}
              </div>
            </div>
            <div class="container">
              <div style="width: 250px; display: inline-block">
                门店编码：
                {{ billForm.shopcode }}
              </div>
              <div style="width: 250px; display: inline-block">
                门店名称：{{ billForm.shopname }}
              </div>
            </div>
            <div class="container" style="color: green">
              <div style="width: 250px; display: inline-block">
                房东编码：{{ billForm.dcode }}
              </div>
              <div style="width: 250px; display: inline-block">
                房东名称：{{ billForm.name }}
              </div>
              <div style="width: 250px; display: inline-block">
                合同开始日期：{{ billForm.dlstartdateStr }}
              </div>
              <div style="width: 210px; display: inline-block">
                合同结束日期：{{ billForm.dlenddateStr }}
              </div>
            </div>
            <div class="container" style="color: green">
              <div style="width: 250px; display: inline-block">
                收款人姓名：{{ billForm.payee }}
              </div>
              <div style="width: 250px; display: inline-block">
                银行账号：{{ billForm.bankno }}
              </div>
              <div style="width: 250px; display: inline-block">
                开户行：{{ billForm.bank }}
              </div>
              <div style="width: 210px; display: inline-block">
                合同类型：
                <font v-if="billForm.type == '1'">正常</font>
                <font v-if="billForm.type == '2'">临时</font>
              </div>
            </div>
          </el-form>

          <div style="margin-top: -5px">
            <el-divider />
          </div>

          <el-row type="flex" justify="start">
            <el-col :span="12">
              <el-row :gutter="24">
                <el-col :span="10">
                  <div
                    style="
                      width: 250px;
                      display: inline-block;
                      color: red;
                      margin-top: 10px;
                    ">
                    开始年月日：
                    <el-date-picker
                      placeholder
                      disabled="disabled"
                      style="width: 150px"
                      v-model="billForm.startdateStr"
                      value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </div>
                  <div
                    style="
                      width: 250px;
                      display: inline-block;
                      margin-top: 10px;
                    ">
                    缴纳天数：{{ this.billForm.cdays }}
                  </div>
                  <div
                    style="
                      width: 250px;
                      display: inline-block;
                      margin-top: 10px;
                      color: red;
                    ">
                    总额：
                    <el-input
                      type="number"
                      v-model="billForm.totalmoney"
                      placeholder="总额"
                      style="width: 150px"
                      disabled="disabled"></el-input>
                  </div>
                  <div
                    style="
                      width: 250px;
                      display: inline-block;
                      margin-top: 10px;
                      color: red;
                    ">
                    营业款：
                    <el-input
                      type="number"
                      v-model="billForm.yyk"
                      placeholder="营业款"
                      style="width: 150px"
                      disabled="disabled"></el-input>
                  </div>
                  <div
                    style="
                      width: 250px;
                      display: inline-block;
                      margin-top: 10px;
                      color: red;
                    ">
                    预留房租：
                    <el-input
                      type="number"
                      v-model="billForm.ylfz"
                      placeholder="预留房租"
                      style="width: 150px"
                      disabled="disabled"></el-input>
                  </div>
                  <div
                    style="
                      width: 250px;
                      display: inline-block;
                      margin-top: 10px;
                    ">
                    汇总类型：
                    <el-select
                      style="width: 150px"
                      v-model="billForm.sumtype"
                      placeholder="请选择"
                      :disabled="!showButton"
                      @change="changeSumType">
                      <el-option
                        v-for="item in sumtypeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                </el-col>
                <el-col :span="10">
                  <div
                    style="
                      width: 250px;
                      display: inline-block;
                      color: red;
                      margin-top: 10px;
                    ">
                    结束年月日：
                    <el-date-picker
                      placeholder
                      disabled="disabled"
                      style="width: 150px"
                      v-model="billForm.enddateStr"
                      value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </div>
                  <div
                    style="
                      width: 250px;
                      display: inline-block;
                      margin-top: 10px;
                    ">
                    缴纳月数：{{ this.billForm.cmonths }}
                  </div>
                  <div
                    style="
                      width: 250px;
                      display: inline-block;
                      margin-top: 10px;
                      color: red;
                    ">
                    汇款方式：
                    <el-select
                      style="width: 150px"
                      v-model="billForm.remittype"
                      placeholder="请选择"
                      disabled="disabled">
                      <el-option
                        v-for="item in remittypeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                  <div
                    style="
                      width: 250px;
                      display: inline-block;
                      margin-top: 10px;
                      color: red;
                    ">
                    风险金或其他借款：
                    <el-input
                      type="number"
                      v-model="billForm.otherOne"
                      placeholder="风险金或其他借款"
                      style="width: 100px"
                      disabled="disabled"></el-input>
                  </div>
                  <div
                    style="
                      width: 250px;
                      display: inline-block;
                      margin-top: 10px;
                      color: red;
                    ">
                    预留其他：
                    <el-input
                      type="number"
                      v-model="billForm.ylqt"
                      placeholder="预留其他"
                      style="width: 150px"
                      disabled="disabled"></el-input>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="20">
                  <div
                    style="
                      width: 600px;
                      display: inline-block;
                      margin-top: 10px;
                    ">
                    说明：<el-input
                      v-model="billForm.memo"
                      disabled="disabled"
                      type="textarea"
                      :rows="2"
                      style="width: 500px; resize: none"></el-input>
                  </div>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="6" :offset="1">
              <yid-table
                ref="shopReserveTable"
                style="margin-top: 10px"
                :data="this.shopReserveMoneys">
                <yid-table-column
                  label="款项"
                  min-width="120"
                  prop="reservename"></yid-table-column>
                <yid-table-column
                  label="余额"
                  min-width="100"
                  prop="money"></yid-table-column>
              </yid-table>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-collapse-transition>
    <yid-dialog
      :title="rejectDialog.title"
      :visible.sync="rejectDialog.visible"
      width="450px">
      <el-form ref="rejectForm" :model="rejectForm" label-width="140px">
        <el-form-item
          label="驳回原因："
          prop="rejectmemo"
          :rules="[{ required: true, message: '驳回原因不能为空' }]">
          <el-input
            clearable
            v-model="rejectForm.rejectmemo"
            style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="rejectBill" type="primary">确定</el-button>
          <el-button @click="closeRejectDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </yid-dialog>
  </div>
</template>

<script>
import service from '@src/service'
import yid from '@src/library'
import ElButton from '../../library/components/button/button'
import download from '@src/library/http/download'

export default {
  components: { ElButton },
  name: 'storeRentRecords',
  data() {
    return {
      excelConvertUrl: '',
      myheaders: {},
      pageInfo: { page: 1, limit: 10, isDel: '0' },
      searchForm: {
        billcode: '',
        auditor: '',
        //status : "2",
        status: '',
        sumtype: '',
        shopid: '',
        shopoType: '',
        auditdateRange: []
      },
      statusList: [
        {
          value: '2',
          label: '已提交'
        },
        {
          value: '3',
          label: '已审批'
        },
        {
          value: '0',
          label: '已驳回'
        },
        {
          value: '9',
          label: '已作废'
        }
      ],
      sumtypeList: [
        {
          value: '1',
          label: '单笔汇款'
        },
        {
          value: '2',
          label: '汇总汇款'
        }
      ],
      remittypeList: [
        {
          value: '1',
          label: '汇房东账号'
        },
        {
          value: '2',
          label: '汇店内支出卡'
        }
      ],
      printObj: {
        id: 'printId',
        popTitle: '',
        extraHead:
          '<meta http-equiv="Content-Language"content="zh-cn"/>,<style>  #printId { width: 100%;} <style>'
      },
      rejectDialog: {
        title: '',
        visible: false
      },
      rejectForm: {
        rejectmemo: ''
      },
      billForm: {
        id: '',
        billcode: '',
        createdBy: '',
        createdTime: '',
        status: '',
        auditor: '',
        auditdate: '',
        shopid: '',
        shopcode: '',
        shopname: '',
        shopType: '',
        brandId: '',
        brandCode: '',
        dlid: '',
        dlcode: '',
        type: '',
        dcode: '',
        name: '',
        dlstartdate: '',
        dlstartdateStr: '',
        dlenddate: '',
        dlenddateStr: '',
        payee: '',
        bank: '',
        bankno: '',
        remittype: '',
        startdate: '',
        enddate: '',
        startdateStr: '',
        enddateStr: '',
        cdays: '',
        cmonths: '',
        memo: '',
        totalmoney: '',
        lastdate: '',
        yyk: '',
        ylfz: '',
        ylqt: '',
        otherOne: '',
        otherTwo: '',
        refbillcode: ''
      },
      showList: true,
      showButton: false,
      showButtonS: false,
      rules: {},
      shopReserveMoneys: [],
      yyk: 0,
      ylfz: 0,
      ylqt: 0,
      otherOne: 0,
      otherTwo: 0,
      allShopList: [],
      filterShopList: [],
      billSelection: [],
      isCancel: false
    }
  },
  mounted() {
    this.getShopList()
  },
  computed: {
    searchFormReq: function () {
      let reqObj = {}
      reqObj.billcode = this.searchForm.billcode
      reqObj.auditor = this.searchForm.auditor
      reqObj.status = this.searchForm.status
      reqObj.shopType = this.searchForm.shopType
      reqObj.shopid = this.searchForm.shopid
      reqObj.sumtype = this.searchForm.sumtype
      let auditdateRange = this.searchForm.auditdateRange
      if (auditdateRange) {
        reqObj.auditdateStart = this.searchForm.auditdateRange[0]
        reqObj.auditdateEnd = this.searchForm.auditdateRange[1]
      } else {
        reqObj.auditdateStart = ''
        reqObj.auditdateEnd = ''
      }
      return reqObj
    }
  },
  methods: {
    printDom() {
      // if(re==1){
      //   window.location.reload();
      // }
      // var re= window.showModalDialog(page,null,'dialogWidth:'+width+'mm;dialogHeight:'+height+'mm;edge:Raised;center:yes;help:no;resizable:no;status:no;scroll:no')
      // if(re==1){
      //   window.location.reload();
      // }
    },
    getData(reqParams) {
      const fetch = service.finance.storeRentRecords.billListForChain
      const params = { ...this.pageInfo, ...reqParams }
      params.isDel = '0'
      this.$refs.table.reloadData({
        fetch,
        params
      })
    },
    search() {
      if (this.searchFormReq.status == '3') {
        this.isCancel = true
      } else {
        this.isCancel = false
      }
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize
      this.getData(this.searchFormReq)
    },
    getDataNoChangePage(reqParams) {
      const fetch = service.finance.storeRentRecords.billListForChain
      const params = { ...this.pageInfo, ...reqParams }
      params.isDel = '0'
      this.$refs.table.reloadDataNoChangePage({
        fetch,
        params
      })
    },
    searchNoChangePage() {
      this.pageInfo.page = this.$refs.table.Pagination.internalCurrentPage
      this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize
      this.getDataNoChangePage(this.searchFormReq)
    },
    getShopList() {
      service.chain.shop.shopList({ status: '1' }).then(res => {
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
    changeShop() {
      const param = {}
      let type = this.searchForm.shopType
      param.status = '1'
      param.type = type
      service.chain.shop.shopList(param).then(res => {
        if (res.resp_code == 200) {
          this.filterShopList = res.data
          this.allShopList = Object.assign(this.filterShopList) //保留原数据
        }
      })
    },
    handleSelectionChange(val) {
      this.billSelection = val
    },
    importBill() {
      //查询是否有数据
      const params = { ...this.pageInfo, ...this.searchFormReq }
      service.finance.storeRentRecords.billListForChain(params).then(res => {
        if (res.resp_code == '200') {
          if (res.data.length > 0) {
            download(
              $yid.config.API.BASE +
                'api-finance/storerentrecords/billExportForChain',
              this.searchFormReq
            )
          } else {
            yid.util.error('查询数据为空!')
            return
          }
        }
      })
    },
    openRejectDialog() {
      this.rejectForm.rejectmemo = ''
      this.rejectDialog.visible = true
    },
    closeRejectDialog() {
      this.rejectDialog.visible = false
    },
    getShopReseveMoney(shopcode) {
      this.shopReserveMoneys = []
      let d = new Date()
      let year = d.getFullYear()
      let month = d.getMonth() + 1
      if (Number(month) < 10) {
        month = '0' + month
      }
      let srq = year + '-' + month + '-01'
      let erq = year + '-' + month + '-31'
      service.finance.reserveMoney
        .getShopReseveMoney({ shopcode: shopcode })
        .then(res => {
          if (res.resp_code == 200) {
            this.shopReserveMoneys = res.data
            //获取当前月的营业款数据
            service.finance.dayshoppay
              .shopRcjy({ shopcode: shopcode, srq: srq, erq: erq })
              .then(res => {
                if (res.resp_code == 200) {
                  this.yyk = res.data
                  const yyklist = {
                    reserveid: '0',
                    reservecode: '00',
                    reservename: '营业款',
                    money: res.data,
                    shopcode: shopcode
                  }
                  this.shopReserveMoneys.push(yyklist)
                }
              })
          }
        })
    },
    rejectBill() {
      if (!yid.util.isEmpty(this.billForm.billcode)) {
        if (yid.util.isEmpty(this.rejectForm.rejectmemo)) {
          yid.util.error('驳回原因不能为空!')
          return
        }
        if (this.billForm.status == '3') {
          yid.util.error('单据状态为【已审批】不能进行驳回!')
          return
        } else if (this.billForm.status == '0') {
          yid.util.error('单据状态为【已驳回】不能进行驳回!')
          return
        } else if (this.billForm.status == '9') {
          yid.util.error('单据状态为【已作废】不能进行驳回!')
          return
        }
        this.billForm.rejectmemo = this.rejectForm.rejectmemo
        service.finance.storeRentRecords.rejectBill(this.billForm).then(res => {
          if (res.resp_code == '200') {
            yid.util.success('驳回成功!')
            this.showList = true
            this.closeRejectDialog()
            this.search()
          } else {
            yid.util.error(res.resp_msg)
          }
        })
      } else {
        yid.util.error('单据编码为空!')
        return
      }
    },
    changeSumType() {
      if (!yid.util.isEmpty(this.billForm.billcode)) {
        service.finance.storeRentRecords
          .changeSumType(this.billForm)
          .then(res => {
            if (res.resp_code == '200') {
              yid.util.success('更新成功!')
            } else {
              yid.util.error(res.resp_msg)
            }
          })
      } else {
        yid.util.error('单据编码为空!')
        return
      }
    },
    back() {
      this.searchNoChangePage()
      this.showList = true
    },
    editBill(row) {
      this.getShopReseveMoney(row.shopcode)
      this.billForm.id = row.id
      this.billForm.billcode = row.billcode
      this.billForm.createdBy = row.createdBy
      this.billForm.createdTime = row.createdTime
      this.billForm.status = row.status
      this.billForm.auditor = row.auditor
      this.billForm.auditdate = row.auditdate
      this.billForm.shopid = row.shopid
      this.billForm.shopcode = row.shopcode
      this.billForm.shopname = row.shopname
      this.billForm.shopType = row.shopType
      this.billForm.brandId = row.brandId
      this.billForm.brandCode = row.brandCode
      this.billForm.dlid = row.dlid
      this.billForm.dlcode = row.dlcode
      this.billForm.name = row.name
      this.billForm.dlstartdate = row.dlstartdate
      this.billForm.dlenddate = row.dlenddate
      this.billForm.dlstartdateStr = $yid.util.formatDate(row.dlstartdate)
      this.billForm.dlenddateStr = $yid.util.formatDate(row.dlenddate)
      this.billForm.payee = row.payee
      this.billForm.bank = row.bank
      this.billForm.bankno = row.bankno
      this.billForm.remittype = row.remittype
      this.billForm.startdate = row.startdate
      this.billForm.enddate = row.enddate
      this.billForm.startdateStr = $yid.util.formatDate(row.startdate)
      this.billForm.enddateStr = $yid.util.formatDate(row.enddate)
      this.billForm.cdays = row.cdays
      this.billForm.cmonths = row.cmonths
      this.billForm.memo = row.memo
      this.billForm.totalmoney = row.totalmoney
      this.billForm.dcode = row.dcode
      this.billForm.type = row.type
      this.billForm.yyk = row.yyk
      this.billForm.ylfz = row.ylfz
      this.billForm.ylqt = row.ylqt
      this.billForm.otherOne = row.otherOne
      this.billForm.otherTwo = row.otherTwo
      this.billForm.refbillcode = row.refbillcode
      this.billForm.sumtype = row.sumtype
      this.billForm.revision = row.revision
      this.showList = false
      if (row.status == '2') {
        this.showButton = true
        this.showButtonS = false
      } else {
        this.showButton = false
        if (row.status == '3') {
          this.showButtonS = true
        } else {
          this.showButtonS = false
        }
      }
    },
    deleteBill() {
      if (!yid.util.isEmpty(this.billForm.billcode)) {
        yid.util.confirm(
          '您确定要删除[' + this.billForm.billcode + ']的单据?',
          '',
          '',
          () => {
            service.finance.storeRentRecords
              .deleteBill(this.billForm)
              .then(res => {
                if (res.resp_code == '200') {
                  yid.util.success('删除成功!')
                  this.showList = true
                  this.search()
                } else {
                  yid.util.error(res.resp_msg)
                }
              })
          }
        )
      } else {
        yid.util.error('单据保存后再进行删除!')
        return
      }
    },
    auditBill() {
      let id = this.billForm.id
      let billcode = this.billForm.billcode
      let status = this.billForm.status
      let memo = this.billForm.memo
      if (!yid.util.isEmpty(billcode)) {
        yid.util.confirm(
          '您确定要审核[' + billcode + ']的单据?',
          '',
          '',
          () => {
            if (status == '1') {
              yid.util.error('[未提交]的单据不能进行审核')
              return
            } else if (status == '3') {
              yid.util.error('[已审批]的单据不能进行审核')
            } else if (status == '0') {
              yid.util.error('[已驳回]的单据不能进行审核')
            } else if (status == '9') {
              yid.util.error('[已作废]的单据不能进行审核')
            } else {
              //调用审核单据接口
              service.finance.storeRentRecords
                .auditBill({ id: id, billcode: billcode, memo: memo })
                .then(res => {
                  if (res.resp_code == '200') {
                    yid.util.success('审核成功')
                    this.showList = true
                    this.search()
                  } else {
                    yid.util.error(res.resp_msg)
                  }
                })
            }
          }
        )
      } else {
        yid.util.error('单据保存后再进行审核!')
        return
      }
    },
    cancelAuditButton() {
      this.billSelection = []
      this.billSelection.push(this.billForm)
      this.cancelAuditBill()
    },
    cancelAuditBill() {
      if (this.billSelection.length == 0) {
        yid.util.error('请先选择要取消审核的对象!')
        return
      }
      let billids = ''
      for (var i = 0; i < this.billSelection.length; i++) {
        billids = billids + this.billSelection[i].id + ','
      }
      if (billids.length > 0) {
        billids = billids.substring(0, billids.length - 1)
        yid.util.confirm('您确定要取消审批所选的单据?', '', '', () => {
          //调用取消审核单据接口
          service.finance.storeRentRecords
            .cancelAuditBill({ billids: billids })
            .then(res => {
              if (res.resp_code == '200') {
                yid.util.success('取消审批成功')
                //this.search();
                this.back()
              } else {
                yid.util.error(res.resp_msg)
              }
            })
        })
      } else {
        yid.util.error('请先选择要取消审核的对象!')
        return
      }
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
.container {
  width: 100%;
  height: 30px;
  /*overflow: auto;*/
  white-space: nowrap;
}
.store-table {
  /deep/ .el-table__header-wrapper .el-table-column--selection .cell {
    display: none;
  }
}
</style>
