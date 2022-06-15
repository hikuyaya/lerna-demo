<template>
  <div class="hyrefund">
    <el-collapse-transition>
      <div v-if="showList">
        <el-button type="primary" @click="importBill">导出</el-button>
        <el-button type="primary" @click="censorforM">免回访</el-button>
        <el-form inline style="margin-top: 20px">
          <el-form-item label="制单人：">
            <el-input
              v-model.trim="searchForm.createdBy"
              placeholder=""
              style="width: 150px"></el-input>
          </el-form-item>
          <el-form-item label="制单时间：">
            <el-date-picker
              style="width: 240px"
              v-model="searchForm.createdTimeRange"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="单据状态：">
            <el-select
              clearable
              filterable
              placeholder="请选择"
              style="width: 180px"
              v-model.trim="searchForm.status">
              <el-option
                :key="'s_' + item.value"
                v-for="item in selectStatusList"
                :value="item.value"
                :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="处理人：">
            <el-input
              clearable
              v-model.trim="searchForm.updatedBy"
              placeholder=""
              style="width: 150px"></el-input>
          </el-form-item>
          <el-form-item label="变更时间：">
            <el-date-picker
              style="width: 240px"
              v-model="searchForm.updatedTimeRange"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="单据编码：">
            <el-input
              clearable
              v-model.trim="searchForm.billcode"
              placeholder=""
              style="width: 180px"></el-input>
          </el-form-item>
          <el-form-item label="会员：">
            <el-select
              clearable
              filterable
              placeholder="请选择"
              style="width: 110px"
              v-model.trim="searchForm.type">
              <el-option key="01" label="会员姓名" value="01"> </el-option>
              <el-option key="02" label="会员id" value="02"> </el-option>
              <el-option key="03" label="手机号" value="03"> </el-option>
            </el-select>
            <el-input
              clearable
              v-model.trim="searchForm.hyinfo"
              placeholder=""
              style="width: 150px"></el-input>
          </el-form-item>
          <el-form-item label="退款方式：">
            <el-select
              clearable
              filterable
              placeholder="请选择"
              style="width: 160px"
              v-model.trim="searchForm.tkway">
              <el-option
                :key="'c_' + item.id"
                v-for="item in tkLists"
                :value="item.id"
                :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="跨店承担：">
            <el-select
              clearable
              filterable
              placeholder="请选择"
              style="width: 160px"
              v-model.trim="searchForm.isKd">
              <el-option key="'c_'+1" value="1" label="是"></el-option>
              <el-option key="'c_'+0" value="0" label="否"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="门店编码：">
                        <el-input clearable v-model.trim="searchForm.shopcode" placeholder=""  style="width: 180px;"></el-input>
                    </el-form-item>-->
          <el-form-item>
            <el-button @click="search()" type="primary">查询</el-button>
          </el-form-item>
        </el-form>
        <yid-table
          pagination
          ref="table"
          :data="tableData"
          width="2200"
          @selection-change="handleSelectionChange">
          <yid-table-column type="selection" width="55"></yid-table-column>
          <yid-table-column
            label="单据编码"
            min-width="140"
            prop="billcode"></yid-table-column>
          <yid-table-column label="回访状态" min-width="120" prop="status">
            <template slot-scope="scope">
              {{
                scope.row.status == 1
                  ? '未回访'
                  : scope.row.status == 2
                  ? '回访中'
                  : scope.row.status == 3
                  ? '已回访'
                  : scope.row.status == 4
                  ? '免回访'
                  : scope.row.status == 9
                  ? '已作废'
                  : ''
              }}
            </template>
          </yid-table-column>
          <yid-table-column
            label="会员姓名"
            min-width="120"
            prop="memname"></yid-table-column>
          <yid-table-column
            label="手机号码"
            min-width="105"
            prop="mobile"></yid-table-column>
          <yid-table-column
            label="退款时间"
            min-width="150"
            prop="checkdate"></yid-table-column>
          <yid-table-column
            label="实退金额"
            min-width="80"
            prop="totalMoney"></yid-table-column>
          <yid-table-column
            label="门店编码"
            min-width="80"
            prop="shopcode"></yid-table-column>
          <yid-table-column
            label="门店名称"
            min-width="80"
            prop="shopname"></yid-table-column>
          <yid-table-column label="退卡属性" min-width="80" prop="tkattr">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 1">仅注销无退款</span>
              <span v-if="scope.row.status == 2">员工离职</span>
              <span v-if="scope.row.status == 3">个人原因</span>
              <span v-if="scope.row.status == 4">技术原因</span>
              <span v-if="scope.row.status == 5">消费原因</span>
              <span v-if="scope.row.status == 6">服务及接待</span>
              <span v-if="scope.row.status == 7">关店原因</span>
              <span v-if="scope.row.status == 8">其他</span>
            </template>
          </yid-table-column>
          <yid-table-column label="退款方式" min-width="80" prop="tkway">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 1">营业款</span>
              <span v-if="scope.row.status == 2">预留款</span>
              <span v-if="scope.row.status == 3">退卡保证金</span>
              <span v-if="scope.row.status == 4">风险金</span>
              <span v-if="scope.row.status == 5">关店退款</span>
            </template>
          </yid-table-column>
          <yid-table-column
            label="回访人"
            min-width="80"
            prop="hfBy"></yid-table-column>
          <yid-table-column
            label="回访时间"
            min-width="150"
            prop="hfTime"></yid-table-column>

          <yid-table-column label="操作" min-width="140" fixed="right">
            <template slot-scope="scope">
              <el-link
                type="primary"
                style="margin: 5px"
                @click="showDetail(scope.row)"
                >详情</el-link
              >
              <el-link
                type="primary"
                style="margin: 5px"
                @click="changeLog(scope.row.billcode)"
                >变更记录</el-link
              >
            </template>
          </yid-table-column>
        </yid-table>
      </div>
    </el-collapse-transition>
    <el-collapse-transition>
      <div v-if="!showList">
        <hyrefundHfDetail
          :visible.sync="showList"
          ref="detailPage"></hyrefundHfDetail>
      </div>
    </el-collapse-transition>

    <!--变更记录-->
    <cardtkbilllogs ref="cardtkbilllogs"></cardtkbilllogs>
  </div>
</template>
<script>
import yid from '@src/library'
import hyrefundHfDetail from './hyrefundHfDetail'
import cardtkbilllogs from './components/cardtkbilllogs'
import { mapGetters } from 'vuex'
import service from '@src/service'
import cache from '@src/library/helper/cache'
import type from '@src/type'
import download from '@src/library/http/download'

export default {
  name: 'hyrefund',
  components: { hyrefundHfDetail, cardtkbilllogs },
  data() {
    return {
      pageInfo: { page: 1, limit: 10, isDel: '0' },
      showList: true,
      billcodes: '',
      selectedNum: '0',
      ids: '',
      searchForm: {
        createdBy: '',
        status: '',
        updatedBy: '',
        billcode: '',
        shopcode: '',
        type: '',
        tkway: '',
        isKd: '',
        hyinfo: '',
        createdTimeRange: [],
        updatedTimeRange: []
      },
      tkattrlist: [
        { value: '1', label: '服务' },
        { value: '2', label: '技术' },
        { value: '3', label: '服务及技术' },
        { value: '4', label: '其他' },
        { value: '5', label: '消费' },
        { value: '6', label: '接待' },
        { value: '7', label: '顾客个人原因' },
        { value: '8', label: '换卡（电子卡换实体卡）' },
        { value: '9', label: '员工离职' },
        { value: '10', label: '充错卡（pos机多刷、卡号充值错误）' },
        { value: '11', label: '0元退卡' }
      ],
      //回访状态 1-未回访2-回访中3-已回访4-免回访9-已作废
      selectStatusList: [
        { value: '1', label: '未回访' },
        { value: '2', label: '回访中' },
        { value: '3', label: '已回访' },
        { value: '4', label: '免回访' },
        { value: '9', label: '已作废' }
      ],
      tkLists: [
        { id: '1', label: '营业款' },
        { id: '2', label: '预留款' },
        { id: '3', label: '退卡保证金' },
        { id: '4', label: '风险金' },
        { id: '5', label: '关店退款' }
      ],
      tableData: [],
      awardValidateForm: {
        title: '查询会员',
        visible: false,
        name: ''
      },

      detailInitData: {} // 传入明细组件的初始值
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'user/userInfo'
    }),
    searchFormReq: function () {
      let reqObj = {}

      let auditTimeRange = this.searchForm.updatedTimeRange
      if (auditTimeRange != null && auditTimeRange.length > 0) {
        reqObj.sSTimeStart = this.searchForm.updatedTimeRange[0]
        reqObj.sSTimeEnd = this.searchForm.updatedTimeRange[1]
        reqObj.sCreatedTimeStart = this.getcreateDate(
          new Date(reqObj.sSTimeStart)
        )
      } else {
        reqObj.sSTimeStart = ''
        reqObj.sSTimeEnd = ''
        reqObj.sCreatedTimeStart = this.getcreateDate(new Date())
      }
      reqObj.sCreatedTimeEnd = this.getnowDate()
      let createdTimeRange = this.searchForm.createdTimeRange
      if (createdTimeRange != null && createdTimeRange.length > 0) {
        reqObj.sCreatedTimeStart = this.searchForm.createdTimeRange[0]
        reqObj.sCreatedTimeEnd = this.searchForm.createdTimeRange[1]
      }

      reqObj.updatedBy = this.searchForm.updatedBy
      reqObj.status = this.searchForm.status
      reqObj.createdBy = this.searchForm.createdBy
      reqObj.status = this.searchForm.status
      reqObj.billcode = this.searchForm.billcode
      reqObj.shopcode = this.searchForm.shopcode
      reqObj.tkway = this.searchForm.tkway
      reqObj.isKd = this.searchForm.isKd
      if (this.searchForm.type == '01') {
        reqObj.memname = this.searchForm.hyinfo
      } else if (this.searchForm.type == '02') {
        reqObj.memid = this.searchForm.hyinfo
      } else if (this.searchForm.type == '03') {
        reqObj.mobile = this.searchForm.hyinfo
      }

      return reqObj
    }
  },
  mounted() {},
  methods: {
    getData(reqParams) {
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize
      const fetch = service.finance.hyrefundhf.list
      const params = { ...this.pageInfo, ...reqParams }
      params.isDel = '0'
      this.$refs.table.reloadData({
        fetch,
        params
      })
    },
    search() {
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize
      this.getData(this.searchFormReq)
    },

    backsearch() {
      this.pageInfo.page = this.$refs.table.Pagination.internalCurrentPage
      this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize
      const fetch = service.finance.hyrefundhf.list
      const params = { ...this.pageInfo, ...this.searchFormReq }
      params.isDel = '0'
      this.$refs.table.reloadData({
        fetch,
        params
      })
    },

    handleSelectionChange(selection) {
      //获取所有选中项数组的长度
      this.selectedNum = selection.length
      //获取所有选中项的值
      this.billcodes = selection.map(item => item.billcode)
      this.ids = selection.map(item => item.id)
    },
    showDetail(row) {
      this.showList = false
      this.detailInitData.headData = row
      this.$nextTick(() => {
        this.$refs.detailPage.initData(this.detailInitData)
      })
    },
    changeLog(billcode) {
      this.$refs.cardtkbilllogs.logDialog.visible = true
      this.$refs.cardtkbilllogs.billlogs = []
      service.finance.hyrefund
        .findstatuslovVOs({ billcode: billcode, isDel: '0' })
        .then(res => {
          this.$refs.cardtkbilllogs.billlogs = res.data
        })
    },

    //免回访
    censorforM() {
      if (this.selectedNum == 0) {
        yid.util.error('请先选中需要免回访的单据')
        return
      }
      let id = this.ids
      let billcode = this.billcodes
      if (!yid.util.isEmpty(billcode)) {
        //调用免回访接口
        service.finance.hyrefundhf
          .censorforM({ ids: id, billcodes: billcode })
          .then(res => {
            if (res.resp_code == '200') {
              yid.util.success('免回访成功')
              this.search()
            } else {
              yid.util.error(res.resp_msg)
            }
          })
      } else {
        yid.util.error('请先选中需要免回访的单据')
        return
      }
    },
    importBill() {
      //查询是否有数据
      const params = { ...this.pageInfo, ...this.searchFormReq }
      service.finance.hyrefundhf.list(params).then(res => {
        if (res.resp_code == '200') {
          if (res.data.length > 0) {
            download(
              $yid.config.API.BASE + 'api-finance/cardtkhfhead/billHfExport',
              this.searchFormReq
            )
          } else {
            yid.util.error('查询数据为空!')
            return
          }
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
.hyrefund {
  height: 100%;
}
</style>
