<template>
  <div class="reserveAdjBill">
    <el-collapse-transition>
      <div v-show="showList">
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
              style="width: 120px"></el-input>
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
          <el-form-item label="单据状态：" prop="status">
            <el-select
              clearable
              style="width: 100px"
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
          <el-form-item label="">
            <el-button @click="search" type="primary">查询</el-button>
          </el-form-item>
        </el-form>
        <yid-table ref="table" pagination style="width: 100%; margin-top: 10px">
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
              <span v-if="scope.row.status == 3">已审批</span>
              <span v-if="scope.row.status == 4">已复核</span>
              <span v-if="scope.row.status == 0">已驳回</span>
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
        <el-button v-show="showButton" @click="openRejectDialog" type="primary"
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
            <div style="width: 220px; display: inline-block">
              单据编码：{{ billForm.billcode }}
            </div>
            <div style="width: 200px; display: inline-block">
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
            <div style="width: 150px; display: inline-block">
              审核人：{{ billForm.auditor }}
            </div>
            <div style="width: 250px; display: inline-block">
              审核时间：{{ billForm.auditdate }}
            </div>
            <div style="width: 150px; display: inline-block">
              合计金额：{{ billForm.money }}
            </div>
            <div style="display: inline-block">
              门店编码：{{ billForm.shopcode }}
            </div>
          </div>
        </el-form>

        <div style="margin-top: -5px">
          <el-divider />
        </div>

        <el-row :gutter="20">
          <el-col :span="13">
            <yid-table
              ref="showTable"
              style="margin-top: 10px"
              :data="billForm.details">
              <yid-table-column label="转出类型" min-width="150" prop="ormcode">
                <template slot-scope="scope">
                  <el-select
                    v-model.trim="scope.row.ormcode"
                    placeholder="请选择"
                    style="width: 150px"
                    disabled="disabled">
                    <el-option
                      :key="item.id"
                      :label="item.name"
                      :value="item.code"
                      v-for="item in reserveList"></el-option>
                  </el-select>
                </template>
              </yid-table-column>
              <yid-table-column label="余额" min-width="100" prop="ormmoney">
                <template slot-scope="scope">
                  {{ scope.row.ormmoney }}
                </template>
              </yid-table-column>
              <yid-table-column label="转入类型" min-width="150" prop="nrmcode">
                <template slot-scope="scope">
                  <el-select
                    v-model.trim="scope.row.nrmcode"
                    placeholder="请选择"
                    style="width: 150px"
                    disabled="disabled">
                    <el-option
                      :key="item.id"
                      :label="item.name"
                      :value="item.code"
                      v-for="item in reserveList"></el-option>
                  </el-select>
                </template>
              </yid-table-column>
              <yid-table-column label="转换金额" min-width="100" prop="money">
                <template slot-scope="scope">
                  {{ scope.row.money }}
                </template>
              </yid-table-column>
            </yid-table>
          </el-col>
          <el-col :span="5">
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

export default {
  components: { ElButton },
  name: 'reserveAdjBill',
  data() {
    return {
      excelConvertUrl: '',
      myheaders: {},
      pageInfo: { page: 1, limit: 10, isDel: '0' },
      searchForm: {
        billcode: '',
        auditor: '',
        //status : "3",
        status: '',
        shopType: '',
        shopid: '',
        auditdateRange: [],
        type: 'fh'
      },
      statusList: [
        {
          value: '3',
          label: '已审批'
        },
        {
          value: '4',
          label: '已复核'
        },
        {
          value: '0',
          label: '已驳回'
        }
      ],
      billForm: {
        id: '',
        billcode: '',
        createdBy: '',
        createdTime: '',
        status: '',
        auditor: '',
        auditdate: '',
        money: '',
        shopcode: '',
        details: []
      },
      rejectDialog: {
        title: '',
        visible: false
      },
      rejectForm: {
        rejectmemo: ''
      },
      showList: true,
      showButton: true,
      rules: {},
      reserveList: [],
      shopReserveMoneys: [],
      allShopList: [],
      filterShopList: []
    }
  },
  mounted() {
    this.getReserveList()
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
      reqObj.type = this.searchForm.type
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
    getData(reqParams) {
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize
      const fetch = service.finance.reserveAdjBill.billListForChain
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
    getShopReseveMoney(code) {
      this.shopReserveMoneys = []
      service.finance.reserveMoney
        .getShopReseveMoney({ shopcode: code })
        .then(res => {
          if (res.resp_code == 200) {
            this.shopReserveMoneys = res.data
          }
        })
    },
    getReserveList() {
      service.finance.dicReserve
        .listAll({ isDel: '0', status: '1' })
        .then(res => {
          if (res.resp_code == 200) {
            this.reserveList = res.data
          }
        })
    },
    back() {
      this.search()
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
      this.billForm.money = row.money
      this.billForm.shopid = row.shopid
      this.billForm.shopcode = row.shopcode
      this.billForm.shopname = row.shopname
      this.billForm.shopType = row.type
      this.billForm.brandId = row.brandId
      this.billForm.brandCode = row.brandCode
      this.billForm.details = row.details
      this.showList = false
      if (row.status == '3') {
        this.showButton = true
      } else {
        this.showButton = false
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
            if (status == '1') {
              yid.util.error('[未提交]的单据不能进行复核')
              return
            } else if (status == '2') {
              yid.util.error('[已提交]的单据不能再次进行复核')
            } else if (status == '4') {
              yid.util.error('[已复核]的单据不能进行复核')
            } else if (status == '0') {
              yid.util.error('[已驳回]的单据不能进行复核')
            } else {
              //调用审核单据接口
              service.finance.reserveAdjBill
                .auditBillfh({ id: id, billcode: billcode })
                .then(res => {
                  if (res.resp_code == '200') {
                    yid.util.success('复核成功')
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
        yid.util.error('单据保存后再进行复核!')
        return
      }
    },
    openRejectDialog() {
      this.rejectForm.rejectmemo = ''
      this.rejectDialog.visible = true
    },
    closeRejectDialog() {
      this.rejectDialog.visible = false
    },
    rejectBill() {
      if (!yid.util.isEmpty(this.billForm.billcode)) {
        if (yid.util.isEmpty(this.rejectForm.rejectmemo)) {
          yid.util.error('驳回原因不能为空!')
          return
        }
        if (this.billForm.status == '1') {
          yid.util.error('单据状态为【未提交】不能进行驳回!')
          return
        } else if (this.billForm.status == '2') {
          yid.util.error('单据状态为【已提交】不能进行驳回!')
          return
        } else if (this.billForm.status == '0') {
          yid.util.error('单据状态为【已驳回】不能进行驳回!')
          return
        } else if (this.billForm.status == '4') {
          yid.util.error('单据状态为【已复核】不能进行驳回!')
          return
        }
        this.billForm.rejectmemo = this.rejectForm.rejectmemo
        service.finance.reserveAdjBill.rejectBill(this.billForm).then(res => {
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
</style>
