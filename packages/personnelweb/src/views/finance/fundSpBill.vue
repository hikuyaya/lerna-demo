<template>
  <div class="Rq">
    <el-collapse-transition>
      <div v-show="showList">
        <el-button @click="auditSpBilllBatch" type="primary"
          >批量审批</el-button
        >
        <el-button @click="openRject(2)" type="primary">批量驳回</el-button>
        <el-button @click="importBill" type="primary">导出</el-button>
        <div style="margin-top: -5px">
          <el-divider />
        </div>
        <el-form ref="searchForm" inline :model="searchForm">
          <el-form-item label="门店：" prop="shopcode" label-width="100px">
            <el-input
              clearable
              v-model="searchForm.shopcode"
              placeholder="门店编码或门店名称"
              style="width: 180px"></el-input>
          </el-form-item>
          <el-form-item label="区：" prop="shopType" label-width="100px">
            <el-select
              clearable
              v-model="searchForm.reginCode"
              style="width: 180px">
              <el-option label="美发部北区" value="2001"></el-option>
              <el-option label="美发部中区" value="2002"></el-option>
              <el-option label="美发部南区" value="2003"></el-option>
              <el-option label="美发直管区" value="9001"></el-option>
              <el-option label="美容一区" value="3005"></el-option>
              <el-option label="美容二区" value="3006"></el-option>
              <el-option label="美容三区" value="3007"></el-option>
              <el-option label="美容直管区" value="3010"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单据编码：" prop="billcode" label-width="100px">
            <el-input
              clearable
              v-model="searchForm.billcode"
              placeholder="单据编码"
              style="width: 180px"></el-input>
          </el-form-item>
          <el-form-item label="业务类型：" prop="shopType" label-width="100px">
            <el-select
              clearable
              v-model="searchForm.shopType"
              style="width: 180px">
              <el-option label="美发" value="1"></el-option>
              <el-option label="美容" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单据状态：" prop="status">
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
          <el-form-item label="审批部门：" prop="orgcode" label-width="100px">
            <el-select
              clearable
              v-model="searchForm.orgcode"
              style="width: 180px">
              <el-option label="财务部" value="0"></el-option>
              <el-option label="信息部" value="1"></el-option>
              <el-option label="美发部" value="2"></el-option>
              <el-option label="美容部" value="3"></el-option>
              <el-option label="工程部" value="4"></el-option>
              <el-option label="物流部" value="5"></el-option>
              <el-option label="市场部" value="6"></el-option>
              <el-option label="拓展部" value="7"></el-option>
              <el-option label="安全督查部" value="8"></el-option>
              <el-option label="行政部" value="9"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="门店提交时间："
            prop="sTimeRange"
            label-width="120px">
            <div class="block">
              <el-date-picker
                :clearable="true"
                v-model="searchForm.commitRange"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </div>
          </el-form-item>

          <el-form-item label="">
            <el-button @click="search" type="primary">查询</el-button>
            <el-button @click="rest" type="primary">重置</el-button>
          </el-form-item>
        </el-form>
        <yid-table
          ref="table"
          pagination
          style="width: 100%; margin-top: 10px"
          @selection-change="handleSelectionChange">
          <yid-table-column type="selection" width="55"></yid-table-column>
          <yid-table-column
            prop="billcode"
            label="单据编码"
            width="180"></yid-table-column>
          <yid-table-column prop="status" label="审批状态" width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 1">未提交</span>
              <span v-if="scope.row.status == 2">已提交</span>
              <span v-if="scope.row.status == 3">已审批</span>
              <span v-if="scope.row.status == 4">已复核</span>
              <span v-if="scope.row.status == 5">已驳回</span>
              <span v-if="scope.row.status == 9">已作废</span>
            </template>
          </yid-table-column>
          <yid-table-column
            prop="auditor"
            label="审批人"
            width="120"></yid-table-column>
          <yid-table-column
            prop="auditdate"
            label="审批时间"
            width="150"></yid-table-column>
          <yid-table-column prop="orgcode" label="审批部门" width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.orgcode == 0">财务部</span>
              <span v-if="scope.row.orgcode == 1">信息部</span>
              <span v-if="scope.row.orgcode == 2">美发部</span>
              <span v-if="scope.row.orgcode == 3">美容部</span>
              <span v-if="scope.row.orgcode == 4">工程部</span>
              <span v-if="scope.row.orgcode == 5">物流部</span>
              <span v-if="scope.row.orgcode == 6">市场部</span>
              <span v-if="scope.row.orgcode == 7">拓展部</span>
              <span v-if="scope.row.orgcode == 8">安全督查部</span>
              <span v-if="scope.row.orgcode == 9">行政部</span>
            </template>
          </yid-table-column>
          <yid-table-column
            prop="checkor"
            label="复核人"
            width="120"></yid-table-column>
          <yid-table-column
            prop="checkdate"
            label="复核时间"
            width="150"></yid-table-column>
          <yid-table-column prop="shopcode" label="门店" width="120">
            <template slot-scope="scope">{{
              scope.row.shopcode + ' ' + scope.row.shopname
            }}</template>
          </yid-table-column>
          <yid-table-column prop="type" label="备用金类型" width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.type == 1">日常备用金</span>
              <span v-if="scope.row.type == 2">大额备用金</span>
            </template>
          </yid-table-column>
          <yid-table-column
            prop="money"
            label="金额"
            width="100"></yid-table-column>
          <yid-table-column
            prop="ioitemName"
            label="支出项目"
            width="100"></yid-table-column>
          <yid-table-column
            prop="reason"
            label="申请原因"
            width="100"></yid-table-column>
          <yid-table-column
            prop="rejectmemo"
            label="审批/驳回原因"
            width="100"></yid-table-column>
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
        <el-button v-show="showbutton" @click="auditBill" type="primary"
          >审核</el-button
        >
        <el-button v-show="showbutton" @click="openRject(1)" type="primary"
          >驳回</el-button
        >
        <el-form
          ref="billForm"
          :model="billForm"
          style="margin-top: 16px"
          :rules="rules"
          label-width="100px"
          label-position="right">
          <div class="container">
            <div style="width: 210px; display: inline-block">
              单据编码：{{ billForm.billcode }}
            </div>
            <div style="width: 210px; display: inline-block">
              创建人：{{ billForm.createdBy }}
            </div>
            <div style="width: 250px; display: inline-block">
              创建时间：{{ billForm.createdTime }}
            </div>
            <div style="width: 250px; display: inline-block"></div>
          </div>
          <div class="container">
            <div style="width: 210px; display: inline-block">
              审核状态：{{
                billForm.status == '2'
                  ? '已提交'
                  : billForm.status == '3'
                  ? '已审批'
                  : billForm.status == '9'
                  ? '已作废'
                  : billForm.status == '4'
                  ? '已复核'
                  : billForm.status == '5'
                  ? '已驳回'
                  : '未提交'
              }}
            </div>
            <div style="width: 210px; display: inline-block">
              审核人：{{ billForm.auditor }}
            </div>
            <div style="width: 250px; display: inline-block">
              审核时间：{{ billForm.auditdate }}
            </div>
          </div>
        </el-form>
        <div style="margin-top: -5px">
          <el-divider />
        </div>
        <el-form ref="billForm" :model="billForm" label-width="130px">
          <el-row :gutter="20">
            <el-col :span="16">
              <el-form-item
                label="门店编码："
                prop="shopcode"
                :disabled="!isEdit">
                {{ billForm.shopcode }}
              </el-form-item>

              <el-form-item
                label="备用金类型："
                prop="type"
                style="display: inline-block"
                :disabled="!isEdit"
                :rules="[{ required: true, message: '请选择备用金类型' }]">
                <el-select
                  value-key="id"
                  placeholder="请选择"
                  :disabled="!isEdit"
                  v-model.trim="billForm.type">
                  <el-option label="日常备用金" value="1"></el-option>
                  <el-option label="大额备用金" value="2"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item
                label="申请金额："
                width="150"
                style="display: inline-block"
                prop="money"
                :disabled="!isEdit"
                :rules="[{ required: true, message: '申请金额为空' }]">
                <el-input
                  type="number"
                  v-model="billForm.money"
                  :disabled="!isEdit"></el-input>
              </el-form-item>
              <el-form-item
                label="一级科目："
                width="150"
                style="display: inline-block"
                prop="ioitemPcode"
                :disabled="!isEdit"
                v-show="typeCheck"
                :rules="[{ required: true, message: '请选择一级科目' }]">
                <el-select
                  value-key="ioitemPcode"
                  placeholder="请选择"
                  :disabled="!isEdit"
                  v-model="billForm.ioitemPcode">
                  <el-option
                    :key="item.id"
                    :value="item.code"
                    :label="item.name"
                    v-for="item in ioitemPDataAll" />
                </el-select>
              </el-form-item>
              <el-form-item
                label="二级科目："
                width="150"
                style="display: inline-block"
                prop="ioitemCode"
                v-show="typeCheck"
                :rules="[{ required: true, message: '请选择二级科目' }]">
                <el-select
                  value-key="ioitemCode"
                  placeholder="请选择"
                  :disabled="!isEdit"
                  v-model="billForm.ioitemCode">
                  <el-option
                    :key="item.id"
                    :value="item.code"
                    :label="item.name"
                    v-for="item in ioitemDataAll" />
                </el-select>
              </el-form-item>
              <el-form-item
                label="二级科目备注："
                prop="reason"
                v-show="typeCheck"
                :disabled="true">
                <el-input
                  :disabled="true"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  v-model="billForm.ioitemCMemo">
                </el-input>
              </el-form-item>

              <el-form-item
                label="申请费所属周期："
                prop="sTimeRange"
                :disabled="true"
                v-show="typeCheck"
                width="150">
                <el-date-picker
                  :clearable="true"
                  :disabled="true"
                  v-model="billForm.applyDateRange"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item
                label="申请原因："
                prop="reason"
                :disabled="!isEdit"
                :rules="[{ required: true, message: '申请原因为空' }]">
                <el-input
                  :disabled="!isEdit"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  placeholder="请输入内容"
                  v-model="billForm.reason">
                </el-input>
              </el-form-item>
              <el-form-item
                label="备注："
                prop="reason"
                v-show="!typeCheck"
                :disabled="!isEdit">
                <el-input
                  :disabled="!isEdit"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  placeholder="请输入内容"
                  v-model="billForm.memo">
                </el-input>
              </el-form-item>
              <el-form-item
                label="收款账户人："
                width="150"
                style="display: inline-block"
                prop="payee"
                :disabled="!isbankEdit"
                v-show="typeCheck">
                <el-input
                  v-model="billForm.payee"
                  :disabled="!isEdit"></el-input>
              </el-form-item>

              <el-form-item
                label="收款银行账号："
                width="150"
                prop="bankno"
                :disabled="!isbankEdit"
                v-show="typeCheck">
                <el-input
                  v-model="billForm.bankno"
                  :disabled="!isEdit"></el-input>
              </el-form-item>
              <el-form-item
                label="收款开户银行："
                width="150"
                prop="bank"
                :disabled="!isbankEdit"
                v-show="typeCheck">
                <el-input
                  v-model="billForm.bank"
                  :disabled="!isEdit"></el-input>
              </el-form-item>
              <el-form-item
                label="收款银行支行："
                width="150"
                prop="branchbank"
                :disabled="!isbankEdit"
                v-show="typeCheck">
                <el-input
                  v-model="billForm.branchbank"
                  :disabled="!isEdit"></el-input>
              </el-form-item>
              <el-form-item
                label="审批部门："
                prop="orgcode"
                disabled="true"
                v-show="typeCheck">
                <el-select
                  value-key="id"
                  placeholder="请选择"
                  disabled="true"
                  v-model.trim="billForm.orgcode">
                  <el-option label="财务部" value="0"></el-option>
                  <el-option label="信息部" value="1"></el-option>
                  <el-option label="美发部" value="2"></el-option>
                  <el-option label="美容部" value="3"></el-option>
                  <el-option label="工程部" value="4"></el-option>
                  <el-option label="物流部" value="5"></el-option>
                  <el-option label="市场部" value="6"></el-option>
                  <el-option label="拓展部" value="7"></el-option>
                  <el-option label="安全督查部" value="8"></el-option>
                  <el-option label="行政部" value="9"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="收款人是否匹配："
                prop="isMatched"
                :disabled="!isEdit"
                v-show="typeCheck">
                <el-select
                  value-key="id"
                  placeholder="请选择"
                  :disabled="true"
                  v-model.trim="billForm.isMatched">
                  <el-option label="否" value="0"></el-option>
                  <el-option label="是" value="1"></el-option>
                  <el-option label="未设置" value="2"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="上传图片：" prop="photo">
                <div
                  v-if="billForm.fundImages && billForm.fundImages.length > 0"
                  class="block"
                  style="width: 360px; margin-top: 16px">
                  <el-image
                    v-for="item in billForm.fundImages"
                    :key="item"
                    style="width: 100px; height: 100px"
                    :src="item.photopath"
                    :preview-src-list="photosrcList">
                  </el-image>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="8"> </el-col>
          </el-row>
        </el-form>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
import service from '@src/service'
import yid from '@src/library'
import ElButton from '../../library/components/button/button'
import download from '@src/library/http/download'
export default {
  components: { ElButton },
  name: 'fundSpBill',
  data() {
    return {
      upload: yid.config.API.UPLOAD,
      myheaders: {},
      pageInfo: { page: 1, limit: 10, isDel: '0' },

      searchForm: {
        billcode: '',
        auditBy: '',
        status: '',
        auditTimeRange: [],
        shopcode: '',
        shopType: '',
        type: '',
        gathertype: '',
        orgcode: '',
        isphoto: '',
        reason: '',
        startmoney: '',
        endmoney: '',
        areacode: '',
        outcode: [],
        checkTimeRange: [],
        checkor: '',
        createdBy: '',
        createdTimeRange: [],
        commitRange: [],
        reginCode: ''
      },
      statusList: [
        {
          value: '1',
          label: '未提交'
        },
        {
          value: '2',
          label: '已提交'
        },
        {
          value: '3',
          label: '已审核'
        },
        {
          value: '4',
          label: '已复核'
        },
        {
          value: '5',
          label: '已驳回'
        },
        {
          value: '9',
          label: '已作废'
        }
      ],
      billForm: {
        id: '',
        shopid: '',
        shopcode: '',
        shopname: '',
        shopType: '',
        brandId: '',
        brandCode: '',
        billcode: '',
        status: '',
        gathertype: '',
        money: '',
        type: '',
        reason: '',
        ioitemPid: '',
        ioitemPcode: '',
        ioitemPname: '',
        ioitemId: '',
        ioitemCode: '',
        ioitemName: '',
        startdate: '',
        enddate: '',
        contcode: '',
        payee: '',
        bank: '',
        bankno: '',
        branchbank: '',
        isMatched: '',
        orgcode: '',
        createdBy: '',
        createdTime: '',
        auditor: '',
        auditdate: '',
        rejectmemo: '',
        applyDateRange: [],
        fundImages: [],
        landCode: '',
        ioitemCMemo: '',
        memo: ''
      },
      initsreservfund: '',
      sreservfund: '',
      ioitemPDataAll: [],
      ioitemDataAll: [],

      accountDataAll: [],
      fundshop: {},
      showList: true,
      isEdit: true,
      showbutton: false,
      isbankEdit: true,
      typeCheck: false,
      rules: {},
      billcodes: '',
      ids: '',
      selectedNum: '0',
      photosrcList: []
    }
  },
  mounted() {
    /*this.myheaders={
                authorization:'Bearer ' + $yid.cache.get($yid.type.USER.TOKEN)
            };*/

    this.getioitemListAll()
    this.getioitemPListAll()
  },
  computed: {
    searchFormReq: function () {
      let reqObj = {}
      reqObj.billcode = this.searchForm.billcode
      reqObj.auditBy = this.searchForm.auditBy
      reqObj.createdBy = this.searchForm.createdBy
      reqObj.status = this.searchForm.status
      reqObj.checkor = this.searchForm.checkor
      reqObj.orgcode = this.searchForm.orgcode
      reqObj.shopcode = this.searchForm.shopcode
      reqObj.type = this.searchForm.type
      reqObj.shopType = this.searchForm.shopType
      reqObj.reason = this.searchForm.reason
      reqObj.reginCode = this.searchForm.reginCode
      //reqObj.outcode= this.searchForm.outcode;

      if (this.searchForm.outcode && this.searchForm.outcode.length > 0) {
        reqObj.outcode = this.searchForm.outcode.toString()
      } else {
        reqObj.outcode = null
      }

      let commitRange = this.searchForm.commitRange
      if (commitRange != null && commitRange.length > 0) {
        reqObj.commitStart = this.searchForm.commitRange[0]
        reqObj.commitEnd = this.searchForm.commitRange[1]
        reqObj.sCreatedTimeStart = this.getcreateDate(
          new Date(reqObj.commitStart)
        )
      } else {
        reqObj.commitStart = ''
        reqObj.commitEnd = ''
        reqObj.sCreatedTimeStart = this.getcreateDate(new Date())
      }
      reqObj.sCreatedTimeEnd = this.getnowDate()

      let auditTimeRange = this.searchForm.auditTimeRange
      if (auditTimeRange != null && auditTimeRange.length > 0) {
        reqObj.auditTimeStart = this.searchForm.auditTimeRange[0]
        reqObj.auditTimeEnd = this.searchForm.auditTimeRange[1]
        // reqObj.sCreatedTimeStart =  this.getcreateDate(new Date(reqObj.auditTimeStart));
      } else {
        reqObj.auditTimeStart = ''
        reqObj.auditTimeEnd = ''
        //  reqObj.sCreatedTimeStart =  this.getcreateDate(new Date);
      }

      let checkTimeRange = this.searchForm.checkTimeRange
      if (checkTimeRange != null && checkTimeRange.length > 0) {
        reqObj.sCheckStart = this.searchForm.checkTimeRange[0]
        reqObj.sCheckEnd = this.searchForm.checkTimeRange[1]
        reqObj.sCreatedTimeStart = this.getcreateDate(
          new Date(reqObj.sCheckStart)
        )
      } else {
        reqObj.sCheckStart = ''
        reqObj.sCheckEnd = ''
        reqObj.sCreatedTimeStart = this.getcreateDate(new Date())
      }

      let createdTimeRange = this.searchForm.createdTimeRange
      if (createdTimeRange != null && createdTimeRange.length > 0) {
        reqObj.sCreatedTimeStart = this.searchForm.createdTimeRange[0]
        reqObj.sCreatedTimeEnd = this.searchForm.createdTimeRange[1]
      }

      return reqObj
    }
  },
  methods: {
    rest() {
      this.$refs['searchForm'].resetFields()
    },
    getData(reqParams) {
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize
      const fetch = service.finance.fundSpBill.billListForchainSp
      const params = { ...this.pageInfo, ...reqParams }
      params.isDel = '0'
      this.$refs.table.reloadData({
        fetch,
        params
      })
    },
    search() {
      /*if(yid.util.isEmpty(this.searchForm.auditTimeRange)){
                    yid.util.error("审核时间为必填");
                    return;
                }*/
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize
      this.getData(this.searchFormReq)
    },
    queryFundshopData(shopcode) {
      service.finance.fundSpBill
        .queryFundShop({ shopcode: shopcode })
        .then(res => {
          if (res.resp_code == '200') {
            this.fundshop = res.data
            this.billForm.breservfund = this.fundshop.breservfund
            this.billForm.sreservfund = this.fundshop.sreservfund
            this.billForm.initsreservfund = this.fundshop.initsreservfund
          } else {
            yid.util.error(res.resp_msg)
          }
        })
    },

    back() {
      this.search()
      this.showList = true
    },

    editBill(row) {
      this.billForm.id = row.id
      this.billForm.shopcode = row.shopcode
      this.billForm.billcode = row.billcode
      this.billForm.type = row.type
      this.billForm.createdBy = row.createdBy
      this.billForm.createdTime = row.createdTime
      this.billForm.status = row.status
      this.billForm.auditor = row.auditor
      this.billForm.auditdate = row.auditdate
      this.billForm.money = row.money
      ;(this.billForm.reason = row.reason),
        (this.billForm.rejectmemo = row.rejectmemo),
        (this.billForm.ioitemPid = row.ioitemPid),
        (this.billForm.ioitemPcode = row.ioitemPcode),
        (this.billForm.ioitemPname = row.ioitemPname),
        (this.billForm.ioitemId = row.ioitemId),
        (this.billForm.ioitemCode = row.ioitemCode),
        (this.billForm.ioitemName = row.ioitemName),
        (this.billForm.startdate = row.startdate),
        (this.billForm.enddate = row.enddate),
        (this.billForm.payee = row.payee),
        (this.billForm.bank = row.bank),
        (this.billForm.bankno = row.bankno),
        (this.billForm.branchbank = row.branchbank),
        (this.billForm.isMatched = row.isMatched),
        (this.billForm.orgcode = row.orgcode),
        (this.billForm.fundImages = row.fundImages),
        (this.billForm.memo = row.memo),
        (this.showList = false)
      this.isEdit = false
      this.isbankEdit = false
      this.showbutton = row.status == '2'
      if (this.billForm.type == '1') {
        this.typeCheck = false
      } else if (this.billForm.type == '2') {
        this.typeCheck = true
      }

      this.photosrcList = []
      this.billForm.fundImages.find(item => {
        this.photosrcList.push(item.photopath)
      })
      this.billForm.applyDateRange = []
      if (!yid.util.isEmpty(this.billForm.startdate)) {
        this.billForm.applyDateRange.push(this.billForm.startdate)
      }
      if (!yid.util.isEmpty(this.billForm.enddate)) {
        this.billForm.applyDateRange.push(this.billForm.enddate)
      }
    },

    auditBill() {
      let id = this.billForm.id
      let billcode = this.billForm.billcode
      let status = this.billForm.status
      if (!yid.util.isEmpty(billcode)) {
        yid.util.confirm(
          '您确定要审核[' + billcode + ']的单据?',
          '',
          '',
          () => {
            if (status == '3') {
              yid.util.error('已审核的单据不能再次进行审核')
              return
            } else if (status == '1') {
              yid.util.error('未提交的单据不能进行审核')
              return
            } else if (status == '5') {
              yid.util.error('已驳回的单据不能进行审核')
              return
            } else if (status == '4') {
              yid.util.error('已复核的单据不能进行审核')
              return
            } else {
              //调用审核单据接口
              service.finance.fundSpBill
                .auditSpBill({ id: id, billcode: billcode })
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

    handleSelectionChange(selection) {
      //获取所有选中项数组的长度
      this.selectedNum = selection.length
      //获取所有选中项的值
      this.billcodes = selection.map(item => item.billcode)
      this.ids = selection.map(item => item.id)
    },

    //批量审批
    auditSpBilllBatch() {
      if (this.selectedNum == 0) {
        yid.util.error('请先选中需要批量审批的单据')
        return
      }
      let id = this.ids
      let billcode = this.billcodes
      if (!yid.util.isEmpty(billcode)) {
        //调用审核单据接口
        service.finance.fundSpBill
          .auditSpBilllBatch({ ids: id, billcodes: billcode })
          .then(res => {
            if (res.resp_code == '200') {
              yid.util.success('审核成功')
              this.search()
            } else {
              yid.util.error(res.resp_msg)
            }
          })
      } else {
        yid.util.error('请先选中需要批量审批的单据')
        return
      }
    },

    openRject(type) {
      if (type == 2 && this.selectedNum == 0) {
        yid.util.error('请先选中需要批量驳回的单据')
        return
      }

      this.$prompt('', '请输入驳回原因', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
        // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        // inputErrorMessage: '邮箱格式不正确'
      })
        .then(({ value }) => {
          if (!yid.util.isEmpty(value)) {
            this.billForm.rejectmemo = value
            //驳回
            if (type == 1) {
              this.rejectBill()
              //批量驳回
            } else if (type == 2) {
              this.rejectBillBatch()
            }
          } else {
            yid.util.error('请先填写驳回原因')
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
    },

    rejectBill() {
      let id = this.billForm.id
      let billcode = this.billForm.billcode
      let status = this.billForm.status
      let rejectmemo = this.billForm.rejectmemo

      if (status == '3') {
        yid.util.error('已审核的单据不能驳回')
        return
      }
      if (status == '4') {
        yid.util.error('已复核的单据不能驳回')
        return
      }
      //调用驳回单据接口
      service.finance.fundSpBill
        .rejectBill({ id: id, billcode: billcode, rejectmemo: rejectmemo })
        .then(res => {
          if (res.resp_code == '200') {
            yid.util.success('驳回成功')
            this.showList = true
            this.search()
          } else {
            yid.util.error(res.resp_msg)
          }
        })
    },
    rejectBillBatch() {
      if (this.selectedNum == 0) {
        yid.util.error('请先选中需要批量驳回的单据')
        return
      }
      let id = this.ids
      let billcode = this.billcodes
      let rejectmemo = this.billForm.rejectmemo

      //调用批量驳回单据接口
      service.finance.fundSpBill
        .rejectBillBatch({
          ids: id,
          billcodes: billcode,
          rejectmemo: rejectmemo
        })
        .then(res => {
          if (res.resp_code == '200') {
            yid.util.success('驳回成功')
            this.showList = true
            this.search()
          } else {
            yid.util.error(res.resp_msg)
          }
        })
    },

    importBill() {
      //查询是否有数据
      const params = { ...this.pageInfo, ...this.searchFormReq }
      service.finance.fundSpBill.billListForchainSp(params).then(res => {
        if (res.resp_code == '200') {
          if (res.data.length > 0) {
            download(
              yid.config.API.BASE + 'api-finance/fundbillhead/expRecordsList',
              this.searchFormReq
            )
          } else {
            yid.util.error('查询数据为空!')
            return
          }
        }
      })
    },

    getioitemListAll() {
      service.finance.ioitem.jobAll({ status: '1', type: '2' }).then(res => {
        if (res.resp_code == 200) {
          this.ioitemDataAll = res.data
        }
      })
    },
    getioitemPListAll() {
      service.finance.pioitem.listAll({ status: '1', type: '2' }).then(res => {
        if (res.resp_code == 200 && res.data.length > 0) {
          this.ioitemPDataAll = res.data
        }
      })
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
    getcreateDate(d) {
      d.setMonth(d.getMonth() - 3)
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

<style scoped lang="scss">
.container {
  width: 100%;
  height: 30px;
  /*overflow: auto;*/
  white-space: nowrap;
}
</style>
