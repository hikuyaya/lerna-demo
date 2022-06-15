<template>
  <div>
    <el-alert title="" type="info" :closable="false">
      总部短信余量<span style="color: red; font-size: 16px">{{
        msgAllowanceObj && msgAllowanceObj.num ? msgAllowanceObj.num : 0
      }}</span
      >条

      <el-button
        type="primary"
        @click="showMsgPriceDialog"
        style="margin-left: 16px"
        >充值</el-button
      >
    </el-alert>

    <el-form
      ref="searchForm"
      inline
      :model="searchForm"
      style="margin-top: 8px">
      <el-form-item label="充值记录：" prop="sTimeRange">
        <div class="block">
          <el-date-picker
            :clearable="false"
            v-model="searchForm.sTimeRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item style="margin-bottom: 0">
        <el-button @click="search" type="primary">查询</el-button>
      </el-form-item>
    </el-form>
    <yid-table pagination ref="table">
      <yid-table-column
        label="订单号"
        min-width="100"
        prop="billcode"></yid-table-column>
      <yid-table-column
        label="短信条数"
        min-width="100"
        prop="rechargenum"></yid-table-column>
      <yid-table-column
        label="订单金额"
        min-width="100"
        prop="payje"></yid-table-column>
      <yid-table-column label="支付方式" min-width="100" prop="ptype">
        <template slot-scope="scope">
          {{ scope.row.ptype == '1' ? '微信' : '支付宝' }}
        </template>
      </yid-table-column>
      <yid-table-column
        label="支付时间"
        min-width="100"
        prop="payTime"></yid-table-column>
    </yid-table>

    <yid-dialog
      :title="msgPriceDialogInfo.title"
      :visible.sync="msgPriceDialogInfo.visible"
      @close=""
      width="750px">
      <el-row :gutter="12">
        <el-col :span="6" v-for="(p, index) in msgPriceList">
          <div class="grid-content" @click="showPayDialog(p)">
            <div class="b">{{ p.price }}</div>
            <div>{{ p.num }}条</div>
            <div>{{ p.singel }}元／条</div>
          </div>
        </el-col>
      </el-row>
    </yid-dialog>

    <yid-dialog
      :title="payDialogInfo.title"
      :visible.sync="payDialogInfo.visible"
      @close="closePayDialog"
      width="750px">
      <el-row gutter="12">
        <el-col :span="6">购买服务:</el-col>
        <el-col :span="6">{{ selectMsgPriceObj.cname }}</el-col>
      </el-row>
      <el-row gutter="12">
        <el-col :span="6">订单金额:</el-col>
        <el-col :span="6">{{ selectMsgPriceObj.price }}元</el-col>
      </el-row>
      <el-row>应付金额：¥{{ selectMsgPriceObj.price }}</el-row>
      <el-row gutter="12">
        <!--//1微信2支付宝-->
        <el-col :span="6">
          <div @click="showQrCodeDialog('1')" style="background-color: #00aaee">
            微信支付
          </div>
        </el-col>
        <el-col :span="6">
          <div @click="showQrCodeDialog('2')" style="background-color: #55a532">
            支付宝支付
          </div></el-col
        >
      </el-row>
    </yid-dialog>

    <yid-dialog
      :title="qrCodeDialogInfo.title"
      :visible.sync="qrCodeDialogInfo.visible"
      @close="closePayDialog"
      width="500">
      <el-row gutter="8">
        <el-col :span="6">订单号:</el-col>
        <el-col :span="6">{{ orderInfo.billcode }}</el-col>
      </el-row>
      <el-row>应付金额：¥{{ selectMsgPriceObj.price }}</el-row>
      <el-row gutter="12">
        <el-col>
          <VueQrcode :value="orderInfo.qrcode" :size="250" />
        </el-col>
      </el-row>
    </yid-dialog>
  </div>
</template>

<script>
import service from '@src/service'
import VueQrcode from '@chenfengyuan/vue-qrcode'
import { mapGetters } from 'vuex'

export default {
  name: 'msgPay',
  components: {
    VueQrcode
  },
  data() {
    return {
      msgPriceDialogInfo: {
        visible: false,
        title: '短信充值'
      },
      payDialogInfo: {
        visible: false,
        title: '订单支付'
      },
      qrCodeDialogInfo: {
        visible: false,
        title: '支付二维码'
      },
      msgPriceList: [],
      selectMsgPriceObj: {},
      orderInfo: {},
      msgAllowanceObj: {},
      searchForm: {
        sTimeRange: []
      },
      pageInfo: { page: 1, limit: 10 }
    }
  },
  mounted() {
    this.getMsgConfigPriceList()
    this.getMsgAllowance()
    this.getRechargeData()
  },
  computed: {
    ...mapGetters({
      payOrder: 'msg/msgPay'
    })
  },
  watch: {
    payOrder() {
      if (this.orderInfo.billcode == this.payOrder.billcode) {
        if (
          this.payOrder.resp_code == 200 &&
          this.payOrder.data.status == '2'
        ) {
          this.getMsgAllowance()
        } else {
          $yid.util.error('支付失败：' + this.payOrder.resp_msg)
        }
        this.qrCodeDialogInfo.visible = false
        this.payDialogInfo.visible = false
        this.msgPriceDialogInfo.visible = false
        this.selectMsgPriceObj = {}
      }
    }
  },
  methods: {
    search() {
      this.pageInfo = { page: 1, limit: 10 }
      let reqObj = {}
      let sTimeRange = this.searchForm.sTimeRange
      if (sTimeRange) {
        reqObj.pTimeStart = this.searchForm.sTimeRange[0]
        reqObj.pTimeEnd = this.searchForm.sTimeRange[1]
      }
      this.getRechargeData(reqObj)
    },
    getRechargeData(reqParams) {
      const fetch = service.chain.msgOrder.pageList
      const params = { ...this.pageInfo, ...reqParams, status: '2' }
      this.$refs.table.reloadData({
        fetch,
        params
      })
    },
    showMsgPriceDialog() {
      this.msgPriceDialogInfo.visible = true
      this.selectMsgPriceObj = {}
    },
    closePayDialog() {
      this.payDialogInfo.visible = false
    },
    getMsgConfigPriceList() {
      let that = this
      service.chain.msgConfig.listAll({ isDel: '0' }).then(res => {
        if (res.resp_code == 200) {
          that.msgPriceList = res.data
        }
      })
    },
    getMsgAllowance() {
      let that = this
      service.chain.smsAllowance.getSmsAllowanceByTenement().then(res => {
        if (res.resp_code == 200) {
          that.msgAllowanceObj = res.data
        }
      })
    },
    showPayDialog(data) {
      let that = this
      that.selectMsgPriceObj = data
      that.msgPriceDialogInfo.visible = false
      that.payDialogInfo.visible = true
    },
    showQrCodeDialog(payType) {
      let that = this
      let payParams = {}
      payParams.payje = that.selectMsgPriceObj.price
      payParams.scid = that.selectMsgPriceObj.id
      payParams.ptype = payType // 1微信2支付宝
      that.qrCodeDialogInfo.title =
        '1' == payType ? '请使用微信扫码' : '请使用支付宝扫码'
      service.chain.msgOrder.create(payParams).then(res => {
        if (res.resp_code == 200) {
          that.orderInfo = res.data
          that.qrCodeDialogInfo.visible = true
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.grid-content {
  border-radius: 4px;
  min-height: 36px;
  background: #e5e9f2;
  padding: 15px 20px;
  text-align: center;
  font-size: 16px;
  color: #969896;
  .b {
    font-size: 20px;
    color: #1e2332;
  }
}
</style>
