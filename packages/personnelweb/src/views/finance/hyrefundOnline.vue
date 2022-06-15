<template>
  <div class="hyrefund">
    <el-collapse-transition>
      <div v-if="showList">
        <el-button @click="importBill" type="primary">导出</el-button>
        <el-button @click="auditBillZeor" type="primary"
          >自动审批零元退卡单</el-button
        >
        <el-form inline style="margin-top: 20px">
          <el-form-item label="门店：">
            <el-input
              clearable
              v-model.trim="searchForm.shopcode"
              placeholder=""
              style="width: 180px"></el-input>
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
          <el-form-item label="审批状态：">
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
          <el-form-item label="退款属性：">
            <el-select
              clearable
              filterable
              placeholder="请选择"
              style="width: 160px"
              v-model.trim="searchForm.tkattr">
              <el-option
                v-for="item in tkattrlist"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
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
          <el-form-item label="打款方式：">
            <el-select
              clearable
              filterable
              placeholder="请选择"
              style="width: 160px"
              v-model.trim="searchForm.tktype">
              <el-option
                v-for="item in tktypeLists"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="实退金额为0：">
            <el-select
              clearable
              filterable
              placeholder="请选择"
              style="width: 160px"
              v-model.trim="searchForm.isZero">
              <el-option key="'c_'+1" value="1" label="是"></el-option>
              <el-option key="'c_'+0" value="0" label="否"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="有无备注：">
            <el-select
              clearable
              filterable
              placeholder="请选择"
              style="width: 160px"
              v-model.trim="searchForm.isMemo">
              <el-option key="'c_'+1" value="1" label="有"></el-option>
              <el-option key="'c_'+0" value="0" label="无"></el-option>
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

          <el-form-item label="审批人：">
            <el-input
              clearable
              v-model.trim="searchForm.auditor"
              placeholder=""
              style="width: 150px"></el-input>
          </el-form-item>
          <el-form-item label="审批时间：">
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

          <el-form-item label="业务类型：" prop="shopType" label-width="100px">
            <el-select
              clearable
              v-model="searchForm.shopType"
              style="width: 150px">
              <el-option label="美发" value="1"></el-option>
              <el-option label="美容" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否关店：" prop="isClosed" label-width="100px">
            <el-select
              clearable
              v-model="searchForm.isClosed"
              style="width: 150px">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="更新人：">
            <el-input
              v-model.trim="searchForm.updatedBy"
              placeholder=""
              style="width: 150px"></el-input>
          </el-form-item>
          <el-form-item label="更新时间：">
            <el-date-picker
              style="width: 240px"
              v-model="searchForm.updatedTimeRange1"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button @click="search()" type="primary">查询</el-button>
          </el-form-item>
        </el-form>
        <yid-table pagination ref="table" :data="tableData" width="2200">
          <yid-table-column
            label="单据编码"
            min-width="140"
            prop="billcode"></yid-table-column>
          <yid-table-column
            label="店号"
            min-width="80"
            prop="shopcode"></yid-table-column>
          <yid-table-column
            label="店号"
            min-width="80"
            prop="shopname"></yid-table-column>
          <yid-table-column
            label="制单人"
            min-width="80"
            prop="createdBy"></yid-table-column>
          <yid-table-column
            label="制单时间"
            min-width="150"
            prop="createdTime"></yid-table-column>
          <yid-table-column
            label="联系人姓名"
            min-width="120"
            prop="tkname"></yid-table-column>
          <yid-table-column
            label="手机号码"
            min-width="140"
            prop="tkmobile"></yid-table-column>
          <yid-table-column label="合计注销金额" min-width="120">
            <template slot-scope="scope">
              {{
                scope.row.cardMoney +
                scope.row.packageMoney +
                scope.row.productMoney
              }}
            </template>
          </yid-table-column>
          <yid-table-column
            label="合计实退金额"
            min-width="120"
            prop="totalMoney"></yid-table-column>
          <yid-table-column
            label="审批人"
            min-width="80"
            prop="auditor"></yid-table-column>
          <yid-table-column
            label="审批时间"
            min-width="150"
            prop="auditdate"></yid-table-column>
          <yid-table-column label="审批状态" min-width="120" prop="status">
            <template slot-scope="scope">
              {{
                scope.row.status == 1
                  ? '未提交'
                  : scope.row.status == 2
                  ? '已提交'
                  : scope.row.status == 3
                  ? '已审批'
                  : scope.row.status == 4
                  ? '已复核'
                  : scope.row.status == 5
                  ? '已驳回'
                  : scope.row.status == 9
                  ? '已作废'
                  : ''
              }}
            </template>
          </yid-table-column>
          <yid-table-column
            label="备注"
            min-width="150"
            prop="hsmemo"></yid-table-column>
          <yid-table-column
            label="驳回原因"
            min-width="150"
            prop="rejectmemo"></yid-table-column>
          <yid-table-column label="是否跨店" min-width="120" prop="isKd">
            <template slot-scope="scope">
              {{
                scope.row.isKd == 1 ? '是' : scope.row.status == 0 ? '否' : ''
              }}
            </template>
          </yid-table-column>
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
        <hyrefundDetail
          ref="detailPage"
          :visible.sync="showList"></hyrefundDetail>
      </div>
    </el-collapse-transition>

    <!--变更记录-->
    <cardtkbilllogs ref="cardtkbilllogs"></cardtkbilllogs>
  </div>
</template>
<script>
import yid from '@src/library'
import hyrefundDetail from './hyrefundDetail'
import cardtkbilllogs from './components/cardtkbilllogs'
import { mapGetters } from 'vuex'
import service from '@src/service'
import cache from '@src/library/helper/cache'
import type from '@src/type'
import download from '@src/library/http/download'

export default {
  name: 'hyrefund',
  components: { hyrefundDetail, cardtkbilllogs },
  data() {
    return {
      pageInfo: { page: 1, limit: 10, isDel: '0' },
      showList: true,
      searchForm: {
        isClosed: '',
        shopType: '',
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
        updatedTimeRange: [],
        updatedTimeRange1: [],
        auditor: '',
        isZero: '',
        isMemo: '',
        tktype: '',
        tkattr: ''
      },
      tkattrlist: [
        {
          value: '1',
          label: '仅注销无退款'
        },
        {
          value: '2',
          label: '员工离职'
        },
        {
          value: '3',
          label: '个人原因'
        },
        {
          value: '4',
          label: '技术原因'
        },
        {
          value: '5',
          label: '消费原因'
        },
        {
          value: '6',
          label: '服务及接待'
        },
        {
          value: '7',
          label: '关店原因'
        },
        {
          value: '8',
          label: '其它'
        }
      ],
      tktypeLists: [
        { value: '1', label: '店内支出卡' },
        { value: '2', label: '顾客银行卡' },
        { value: '3', label: '退为卡金' }
      ],
      selectStatusList: [
        { value: '1', label: '未提交' },
        { value: '2', label: '已提交' },
        { value: '3', label: '客服已审批' },
        { value: '4', label: '财务已复核' },
        { value: '5', label: '已驳回' },
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
        input: ''
      },
      logDialog: {
        title: '变更记录',
        visible: false
      },
      detailInitData: {},
      billlogs: []
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
      let updatedTimeRange = this.searchForm.updatedTimeRange1
      if (updatedTimeRange != null && updatedTimeRange.length > 0) {
        reqObj.sUpdateStart = this.searchForm.updatedTimeRange1[0]
        reqObj.sUpdateEnd = this.searchForm.updatedTimeRange1[1]
      } else {
        reqObj.sUpdateStart = ''
        reqObj.sUpdateEnd = ''
      }

      reqObj.isClosed = this.searchForm.isClosed
      reqObj.shopType = this.searchForm.shopType
      reqObj.updatedBy = this.searchForm.updatedBy
      reqObj.status = this.searchForm.status
      reqObj.createdBy = this.searchForm.createdBy
      reqObj.billcode = this.searchForm.billcode
      reqObj.shopcode = this.searchForm.shopcode
      reqObj.tkway = this.searchForm.tkway
      reqObj.isKd = this.searchForm.isKd
      reqObj.tktype = this.searchForm.tktype
      reqObj.tkattr = this.searchForm.tkattr
      reqObj.auditor = this.searchForm.auditor
      reqObj.isZero = this.searchForm.isZero
      reqObj.isMemo = this.searchForm.isMemo
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
      const fetch = service.finance.hyrefund.list
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
    //调用0元审核单据接口
    auditBillZeor() {
      service.finance.hyrefund.auditBillZeor().then(res => {
        if (res.resp_code == '200') {
          yid.util.success('审核成功')
          this.search()
        } else {
          yid.util.error(res.resp_msg)
        }
      })
    },
    importBill() {
      //查询是否有数据
      const params = { ...this.pageInfo, ...this.searchFormReq }
      service.finance.hyrefund.list(params).then(res => {
        if (res.resp_code == '200') {
          if (res.data.length > 0) {
            download(
              $yid.config.API.BASE +
                'api-finance/cardtkhead/billExportForChainsp',
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
    },
    remove() {
      Object.keys(this.model).forEach(key => (this.model[key] = ''))
    }
  }
}
</script>
<style scoped lang="scss">
.hyrefund {
  height: 100%;
}
</style>
