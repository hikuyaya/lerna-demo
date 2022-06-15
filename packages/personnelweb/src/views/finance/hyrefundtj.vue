<template>
  <div class="hyrefund">
    <el-collapse-transition>
      <div v-if="showList">
        <el-button type="primary" @click="importBill">导出</el-button>
        <el-form inline style="margin-top: 20px">
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
          <el-form-item label="退款时间：">
            <el-date-picker
              style="width: 240px"
              v-model="searchForm.checkTimeRange"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="退款门店：">
            <el-input
              v-model.trim="searchForm.shopcode"
              placeholder=""
              style="width: 150px"></el-input>
          </el-form-item>
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
          <el-form-item label="回访状态：">
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
          <el-form-item label="回访时间：">
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

          <el-form-item label="回访人：">
            <el-input
              v-model.trim="searchForm.updatedBy"
              placeholder=""
              style="width: 150px"></el-input>
          </el-form-item>

          <el-form-item
            label="实退金额："
            prop="totalMoney"
            label-width="100px">
            <el-input
              clearable
              v-model="searchForm.totalMoneys"
              style="width: 80px"></el-input>
            至
            <el-input
              clearable
              v-model="searchForm.totalMoneye"
              style="width: 80px"></el-input>
          </el-form-item>

          <el-form-item label="退款类型：" prop="isprint" label-width="100px">
            <el-select
              clearable
              v-model="searchForm.isprint"
              @change="changeShop"
              style="width: 180px">
              <el-option label="线上" value="1"></el-option>
              <el-option label="线下" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="search()" type="primary">查询</el-button>
          </el-form-item>
        </el-form>
        <yid-table pagination ref="table" :data="tableData" width="2200">
          <yid-table-column
            label="店号"
            min-width="80"
            prop="shopcode"></yid-table-column>
          <yid-table-column
            label="店名"
            min-width="80"
            prop="shopname"></yid-table-column>
          <yid-table-column
            label="门店状态"
            min-width="120"
            prop="isClosed"></yid-table-column>
          <yid-table-column
            label="退款总数"
            min-width="140"
            prop="tknum"></yid-table-column>
          <yid-table-column
            label="0元退款例数"
            min-width="80"
            prop="zeronum"></yid-table-column>
          <yid-table-column
            label="实际退款例数"
            min-width="120"
            prop="stnum"></yid-table-column>
          <yid-table-column
            label="退为卡金例数"
            min-width="140"
            prop="cardnum"></yid-table-column>
          <yid-table-column
            label="退款总金额"
            min-width="105"
            prop="totalmoney"></yid-table-column>
          <yid-table-column
            label="退为卡金总金额"
            min-width="80"
            prop="cardmoney"></yid-table-column>
          <yid-table-column
            label="关店原因退款金额"
            min-width="80"
            prop="closemoney"></yid-table-column>
          <yid-table-column
            label="员工离职退款金额"
            min-width="150"
            prop="leavemoney"></yid-table-column>
          <yid-table-column
            label="个人原因退款金额"
            min-width="80"
            prop="gerenmoney"></yid-table-column>
          <yid-table-column
            label="技术原因退款金额"
            min-width="150"
            prop="jishumoney"></yid-table-column>
          <yid-table-column
            label="消费原因退款金额"
            min-width="150"
            prop="xiaofeimoney"></yid-table-column>
          <yid-table-column
            label="服务及接待退款金额"
            min-width="150"
            prop="fuwumoney"></yid-table-column>
          <yid-table-column
            label="其他退款金额"
            min-width="150"
            prop="qitamoney"></yid-table-column>
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
  </div>
</template>
<script>
import yid from '@src/library'
import hyrefundHfDetail from './hyrefundHfDetail'
import { mapGetters } from 'vuex'
import service from '@src/service'
import cache from '@src/library/helper/cache'
import type from '@src/type'
import download from '@src/library/http/download'
export default {
  name: 'hyrefund',
  components: { hyrefundHfDetail },
  data() {
    return {
      pageInfo: { page: 1, limit: 10, isDel: '0' },
      showList: true,
      billcodes: '',
      selectedNum: '0',
      ids: '',
      searchForm: {
        isprint: '',
        shopType: '',
        createdBy: '',
        status: '',
        updatedBy: '',
        billcode: '',
        shopcode: '',
        type: '',
        tkway: '',
        tkattr: '',
        isKd: '',
        hyinfo: '',
        totalMoneys: '',
        totalMoneye: '',
        createdTimeRange: [],
        updatedTimeRange: [],
        checkTimeRange: []
      },
      selectStatusList: [
        { value: '1', label: '未回访' },
        { value: '2', label: '回访中' },
        { value: '3', label: '已回访' },
        { value: '4', label: '免回访' }
      ],
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
      let checkTimeRange = this.searchForm.checkTimeRange
      if (checkTimeRange != null && checkTimeRange.length > 0) {
        reqObj.sCheckStart = this.searchForm.createdTimeRange[0]
        reqObj.sCheckEnd = this.searchForm.createdTimeRange[1]
        reqObj.sCreatedTimeStart = this.getcreateDate(
          new Date(reqObj.sCheckStart)
        )
      } else {
        reqObj.sCheckStart = ''
        reqObj.sCheckEnd = ''
        reqObj.sCreatedTimeStart = this.getcreateDate(new Date())
      }
      reqObj.shopType = this.searchForm.shopType
      reqObj.updatedBy = this.searchForm.updatedBy
      reqObj.status = this.searchForm.status
      reqObj.createdBy = this.searchForm.createdBy
      reqObj.status = this.searchForm.status
      reqObj.billcode = this.searchForm.billcode
      reqObj.shopcode = this.searchForm.shopcode
      reqObj.tkway = this.searchForm.tkway
      reqObj.totalMoneys = this.searchForm.totalMoneys
      reqObj.totalMoneye = this.searchForm.totalMoneye

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
    importBill() {
      //查询是否有数据
      const params = { ...this.pageInfo, ...this.searchFormReq }
      service.finance.hyrefundhf.listtj(params).then(res => {
        if (res.resp_code == '200') {
          if (res.data.length > 0) {
            download(
              $yid.config.API.BASE + 'api-finance/cardtkhfhead/billExport',
              this.searchFormReq
            )
          } else {
            yid.util.error('查询数据为空!')
            return
          }
        }
      })
    },
    getData(reqParams) {
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize
      const fetch = service.finance.hyrefundhf.listtj
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
