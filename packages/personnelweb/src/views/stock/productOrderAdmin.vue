<template>
  <div class="productOrderAdmin">
    <el-collapse-transition>
      <div v-show="showList">
        <el-form ref="searchForm" inline :model="searchForm">
          <el-form-item label="申请单号：" prop="billcode">
            <el-input
              v-model="searchForm.billcode"
              clearable
              style="width: 150px"></el-input>
          </el-form-item>
          <el-form-item label="申请日期：" prop="createTimeRange">
            <div class="block">
              <el-date-picker
                :clearable="true"
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
            label="申请单号"
            width="180"></yid-table-column>
          <yid-table-column
            prop="shopname"
            label="申请门店"
            width="150"></yid-table-column>
          <yid-table-column
            prop="createdBy"
            label="申请人"
            width="120"></yid-table-column>
          <yid-table-column prop="createdTime" label="申请时间" width="180">
            <template slot-scope="scope">
              {{ $yid.util.formatTime(scope.row.createdTime) }}
            </template>
          </yid-table-column>
          <yid-table-column
            prop="memo"
            label="备注"
            width="200"></yid-table-column>
          <yid-table-column prop="status" label="状态" width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 1">未提交</span>
              <span v-if="scope.row.status == 2">待审核</span>
              <span v-if="scope.row.status == 3">已审核</span>
            </template>
          </yid-table-column>
          <yid-table-column
            prop="check"
            label="审核人"
            width="100"></yid-table-column>
          <yid-table-column prop="checkDate" label="审核时间" width="180">
            <template slot-scope="scope">
              {{ $yid.util.formatTime(scope.row.checkDate) }}
            </template>
          </yid-table-column>
          <yid-table-column label="操作" min-width="150" fixed="right">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.status != '1'"
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
        <el-button @click="back">返回</el-button>
        <el-button v-show="showButton" @click="auditBill" type="primary"
          >审核</el-button
        >
        <el-button
          v-show="showButton"
          @click="rejectBill"
          style="background-color: red; color: white"
          >驳回</el-button
        >
        <el-button @click="excel" style="background-color: green; color: white"
          >导出</el-button
        >
        <el-form
          ref="billForm"
          :model="billForm"
          style="margin-top: 16px"
          :rules="rules"
          label-width="100px"
          label-position="right">
          <span style="width: 150px">申请单号：{{ billForm.billcode }}</span
          >&nbsp;&nbsp;&nbsp;&nbsp;
          <span style="width: 200px"
            >订货门店：{{ billForm.shopcode }}&nbsp;&nbsp;{{
              billForm.shopname
            }}</span
          >&nbsp;&nbsp;&nbsp;&nbsp;
          <span style="width: 200px">申请时间：{{ billForm.createdTime }}</span
          >&nbsp;&nbsp;&nbsp;&nbsp;
          <span style="width: 200px"
            >申请人：{{ billForm.opercode }} {{ billForm.oper }}</span
          ><br />&nbsp;&nbsp;&nbsp;&nbsp;
          <span
            >备注：<el-input
              :disabled="true"
              v-model="billForm.memo"
              type="textarea"
              :rows="1"
              placeholder="备注"
              style="width: 60%" />
          </span>
        </el-form>
        <yid-table
          v-show="showTable"
          ref="itemTable"
          style="margin-top: 15px"
          :data="orderitemData">
          <yid-table-column
            label="产品编码"
            min-width="120"
            prop="pcode"></yid-table-column>
          <yid-table-column
            label="产品名称"
            min-width="200"
            prop="pname"></yid-table-column>
          <yid-table-column
            label="规格"
            min-width="100"
            prop="norms"></yid-table-column>
          <yid-table-column
            label="单位"
            min-width="100"
            prop="unit"></yid-table-column>
          <yid-table-column
            label="门店当前库存"
            min-width="100"
            prop="stock"></yid-table-column>
          <yid-table-column
            label="要货数量"
            min-width="100"
            prop="num"></yid-table-column>
          <yid-table-column label="发货数量" min-width="100" prop="sendnum">
            <template slot-scope="scope">
              <el-input
                :disabled="isSendNum"
                onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                type="number"
                v-model="scope.row.sendnum"></el-input>
            </template>
          </yid-table-column>
        </yid-table>

        <yid-table
          v-show="!showTable"
          ref="showTable"
          style="margin-top: 15px"
          :data="orderitemData">
          <yid-table-column
            label="产品编码"
            min-width="120"
            prop="pcode"></yid-table-column>
          <yid-table-column
            label="产品名称"
            min-width="200"
            prop="pname"></yid-table-column>
          <yid-table-column
            label="规格"
            min-width="100"
            prop="norms"></yid-table-column>
          <yid-table-column
            label="单位"
            min-width="100"
            prop="unit"></yid-table-column>
          <yid-table-column
            label="门店当前库存"
            min-width="100"
            prop="stock"></yid-table-column>
          <yid-table-column
            label="要货数量"
            min-width="100"
            prop="num"></yid-table-column>
        </yid-table>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
import service from '@src/service'
import yid from '@src/library'
import download from '@src/library/http/download'

export default {
  name: 'productOrderAdmin',
  data() {
    return {
      categoryData: [],
      showList: true,
      showButton: true,
      isSendNum: true,
      showTable: true,
      searchForm: {
        billcode: '',
        createTimeRange: [],
        sTimeRange: []
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      billForm: {
        id: '',
        billcode: '',
        shopid: '',
        shopcode: '',
        shopname: '',
        createdTime: '',
        oper: '',
        opercode: '',
        memo: ''
      },
      pageInfo: { page: 0, limit: 10 },
      orderitemData: [],
      statusList: [
        {
          value: '2',
          label: '待审核'
        },
        {
          value: '3',
          label: '已审核'
        }
      ],
      selectProducts: []
    }
  },
  mounted() {
    this.getData({ status: '2' })
    //this.getUserInfo();
  },
  computed: {
    searchFormReq: function () {
      let reqObj = {}
      reqObj.billcode = this.searchForm.billcode
      reqObj.status = this.searchForm.status
      let createTimeRange = this.searchForm.createTimeRange
      if (createTimeRange) {
        reqObj.sCreatedTimeStart = this.searchForm.createTimeRange[0]
        reqObj.sCreatedTimeEnd = this.searchForm.createTimeRange[1]
      } else {
        reqObj.sCreatedTimeStart = ''
        reqObj.sCreatedTimeEnd = ''
      }
      let sTimeRange = this.searchForm.sTimeRange
      if (sTimeRange) {
        reqObj.sSTimeStart = this.searchForm.sTimeRange[0]
        reqObj.sSTimeEnd = this.searchForm.sTimeRange[1]
      } else {
        reqObj.sSTimeStart = ''
        reqObj.sSTimeEnd = ''
      }
      return reqObj
    }
  },
  methods: {
    getData(reqParams) {
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize
      const fetch = service.chain.productOrder.orderAdminList
      const params = { ...this.pageInfo, ...reqParams }
      this.$refs.table.reloadData({
        fetch,
        params
      })
    },
    back() {
      this.search()
      this.showList = true
    },
    search() {
      this.getData(this.searchFormReq)
    },
    auditBill() {
      if (this.billForm.id == '' || this.billForm.id.length == 0) {
        yid.util.alert('单据id为空!')
        return false
      }
      for (let n = 0; n < this.orderitemData.length; n++) {
        let sendnum = this.orderitemData[n].sendnum
        let num = this.orderitemData[n].num
        if (
          sendnum == null ||
          sendnum == '' ||
          sendnum.length == 0 ||
          sendnum <= 0
        ) {
          yid.util.alert('发货数量为必填大于0的整数')
          return false
        }
        if (sendnum > num) {
          yid.util.alert('发货数量不能大于要货数量')
          return false
        }
      }
      //调用接口进行审核单据
      let order = {}
      order.id = this.billForm.id
      order.billcode = this.billForm.billcode
      order.shopid = this.billForm.shopid
      order.shopcode = this.billForm.shopcode
      order.shopname = this.billForm.shopname
      order.oper = this.billForm.oper
      order.memo = this.billForm.memo
      const details = []
      for (let i = 0; i < this.orderitemData.length; i++) {
        let item = this.orderitemData[i]
        let detail = {}
        detail.id = item.id
        detail.pid = item.pid
        detail.pcode = item.pcode
        detail.pname = item.pname
        detail.num = item.num
        detail.sendnum = item.sendnum
        detail.cost = item.cost
        details.push(detail)
      }
      order.details = details
      console.log(order)
      service.chain.productOrder.auditBill(order).then(res => {
        if (res.resp_code == 200) {
          this.search()
          yid.util.alert('审核成功!')
          this.showList = true
        }
      })
    },
    showBill(row) {
      if (row.status == '1') {
        yid.util.alert('未提交的单据不能查看明细')
        return false
      }
      if (row.status == '2') {
        this.showButton = true
        this.showTable = true
        this.isSendNum = false
      }

      if (row.status == '3') {
        this.showButton = false
        this.showTable = true
        this.isSendNum = true
      }

      if (row.status == '4') {
        this.showButton = false
        this.showTable = false
      }

      //给from和列表设置值
      this.orderitemData = row.details
      this.billForm.id = row.id
      this.billForm.billcode = row.billcode
      this.billForm.shopcode = row.shopcode
      this.billForm.shopid = row.shopid
      this.billForm.shopname = row.shopname
      this.billForm.oper = row.oper
      this.billForm.opercode = row.opercode
      this.billForm.createdTime = row.createdTime
      this.billForm.memo = row.memo
      this.showList = false
    },
    excel() {
      if (this.billForm.id == '' || this.billForm.id.length == 0) {
        yid.util.alert('为保存的单据不允许导出!')
        return false
      }
      download(yid.config.API.BASE + 'api-chain/productorderitem/list/excel', {
        poid: this.billForm.id
      })
    },
    rejectBill() {
      yid.util.confirm(
        '驳回后，门店可以再次修改并提交，确认驳回吗？',
        '',
        '',
        () => {
          if (this.billForm.id == '' || this.billForm.id.length == 0) {
            yid.util.alert('单据id为空!')
            return false
          }
          const billrow = {}
          billrow.id = this.billForm.id
          billrow.billcode = this.billForm.billcode
          service.chain.productOrder.rejectBill(billrow).then(res => {
            if (res.resp_code == 200) {
              this.search()
              yid.util.alert('驳回成功!')
              this.showList = true
            }
          })
        }
      )
    }
  }
}
</script>

<style scoped></style>
