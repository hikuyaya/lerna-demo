<template>
  <div class="member-relation">
    <el-collapse-transition>
      <div v-show="!detailShow">
        <el-form ref="searchForm" inline :model="searchForm">
          <el-form-item label="日期：">
            <el-date-picker
              :clearable="false"
              v-model="searchForm.saleTimeRange"
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
              v-model="searchForm.shoptype"
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
            <el-button @click="seniorSearch" type="primary">高级查询</el-button>
            <el-button @click="importBill" type="primary">导出记录</el-button>
          </el-form-item>
        </el-form>
        <el-alert v-model="viewTotal" :title="viewTotal.title" type="info">
        </el-alert>
        <yid-table pagination ref="table" style="margin-top: 15px">
          <yid-table-column
            label="单号"
            min-width="150"
            prop="billcode"></yid-table-column>
          <yid-table-column
            label="店名"
            min-width="120"
            prop="shopname"></yid-table-column>
          <yid-table-column
            label="销售时间"
            min-width="180"
            prop="saleTime"></yid-table-column>
          <yid-table-column label="卡号" min-width="150" prop="cmcode">
            <template slot-scope="scope">
              <!--<span>{{scope.row.cardInfo == null ? '' : '【'+scope.row.cardInfo+' '+scope.row.cmcode+'】'}}</span>-->
              <span
                >{{ scope.row.cmcode }}<br />{{
                  scope.row.isgx == '1' ? '(共享卡)' : ''
                }}</span
              >
            </template>
          </yid-table-column>
          <yid-table-column label="顾客信息" min-width="200" prop="cardInfo">
            <template slot-scope="scope">
              <span
                >{{ scope.row.memName }} {{ getSexName(scope.row.sex) }}</span
              ><br />
              <span>{{ scope.row.mobile }}</span
              ><br />
            </template>
          </yid-table-column>
          <yid-table-column label="消费内容" min-width="200" prop="snames">
            <template slot-scope="scope">
              <span v-for="infos in scope.row.infoVOList"
                >{{ infos.spname }}*{{ 1 }}<br
              /></span>
            </template>
          </yid-table-column>
          <yid-table-column label="单据金额" min-width="200" prop="payments">
            <template slot-scope="scope">
              ￥{{ scope.row.totalMoney }}
            </template>
          </yid-table-column>
          <yid-table-column label="合计折扣" min-width="150" prop="zkeTotal">
            <template slot-scope="scope">
              -￥{{ scope.row.zkeTotal }}
            </template>
          </yid-table-column>
          <yid-table-column label="消费金额" min-width="150" prop="hjbillje">
            <template slot-scope="scope"> ￥{{ scope.row.hjbillje }} </template>
          </yid-table-column>
          <el-table-column prop="eename" min-width="180" label="服务人员">
            <template slot-scope="scope">
              <span v-for="royaltys in scope.row.royaltyList"
                >{{ royaltys.eename }}|{{ royaltys.yj }}<br
              /></span>
            </template>
          </el-table-column>
          <!-- <yid-table-column label="员工" min-width="200" prop="members">
                         <template slot-scope="scope">
                             <span v-for="yjs in scope.row.royaltyList">{{yjs.eecode}} {{yjs.eename}}<br></span>
                             <span><el-link type="primary" :underline="false" @click="editBill">编辑</el-link></span>
                         </template>
                     </yid-table-column>
                     <yid-table-column label="业绩" min-width="200" prop="eeyjs">
                         <template slot-scope="scope">
                             <span v-for="yjs in scope.row.royaltyList">￥{{yjs.yjje== null ? 0 :yjs.yjje}}<br></span>
                         </template>
                     </yid-table-column>
                     <yid-table-column label="提成" min-width="200" prop="royaltys">
                         <template slot-scope="scope">
                             <span v-for="yjs in scope.row.royaltyList">￥{{yjs.royalty== null ? 0 :yjs.royalty}}<br></span>
                         </template>
                     </yid-table-column>-->
          <yid-table-column
            label="操作人"
            min-width="150"
            prop="updatedBy"></yid-table-column>
          <yid-table-column
            label="操作"
            min-width="200"
            prop="content"
            fixed="right">
            <template slot-scope="scope">
              <el-link type="primary" @click="checkDetail(scope.row)"
                >查看详情</el-link
              >
              <el-link type="primary" style="margin: 0 10px 0 10px"
                >打印小票</el-link
              >
              <el-link type="primary" @click="revokeBill(scope.row)"
                >撤单</el-link
              >
            </template>
          </yid-table-column>
        </yid-table>
      </div>
    </el-collapse-transition>

    <el-collapse-transition>
      <div v-show="detailShow">
        <packagebillDetail
          ref="billDetailPage"
          @onClose="closeDetailPage"></packagebillDetail>
      </div>
    </el-collapse-transition>

    <yid-dialog
      :title="searchDialog.title"
      :visible.sync="searchDialog.visible"
      width="450px">
      <el-form label-width="140px" ref="copyForm">
        <el-form-item label="服务单号：" prop="billcode">
          <el-input
            v-model="searchForm.billcode"
            style="width: 180px"></el-input>
        </el-form-item>
        <el-form-item label="电话号码：" prop="mobile">
          <el-input v-model="searchForm.mobile" style="width: 180px"></el-input>
        </el-form-item>
        <el-form-item label="支付方式：" prop="paycode">
          <el-select
            clearable
            value-key="id"
            filterable
            placeholder="请选择"
            v-model.trim="searchForm.paycode">
            <el-option
              :key="item.paycode"
              :label="item.payname"
              :value="item.paycode"
              v-for="item in cardpays"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="顾客姓名：" prop="memName">
          <el-input
            v-model="searchForm.memName"
            style="width: 180px"></el-input>
        </el-form-item>
        <el-form-item label="会员卡号：" prop="channel">
          <el-input v-model="searchForm.cmcode" style="width: 180px"></el-input>
        </el-form-item>
        <el-form-item label="项目/套餐名称：" prop="isOpen">
          <el-select
            clearable
            value-key="id"
            filterable
            placeholder="请选择"
            v-model.trim="searchForm.spcode">
            <el-option
              :key="item.spcode"
              :label="item.spname"
              :value="item.spcode"
              v-for="item in packages"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提成员工：" prop="eeid">
          <!--<el-select value-key="id" filterable placeholder="请选择" v-model.trim="searchForm.eeid">
                        <el-option :key="item.id" :label="item.eename" :value="item.id" v-for="item in employeeList"></el-option>
                    </el-select>-->
          <el-input v-model="searchForm.eename" style="width: 180px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancel">取消</el-button>
          <el-button @click="searchgj" type="primary">提交</el-button>
        </el-form-item>
      </el-form>
    </yid-dialog>

    <yid-dialog
      :title="revokeDialog.title"
      :visible.sync="revokeDialog.visible"
      width="450px">
      <el-form label-width="140px" ref="revokeForm">
        <el-form-item label="请输入撤单备注：" prop="hcMemo">
          <el-input
            v-model="revokeForm.hcMemo"
            type="textarea"
            :rows="4"
            style="width: 80%"
            placeholder="请输入0-30个字符" />
        </el-form-item>
        <el-form-item>
          <el-button @click="revokeCancel">取消</el-button>
          <el-button @click="revoke" type="primary">提交</el-button>
        </el-form-item>
      </el-form>
    </yid-dialog>
  </div>
</template>

<script>
import service from '@src/service'
import packagebillDetail from './packagebillDetail'
import download from '@src/library/http/download'
export default {
  name: 'member-relation',
  components: {
    packagebillDetail
  },
  data() {
    return {
      value1: '',
      detailShow: false,
      activeName: 'analyze',
      searchForm: {
        saleTimeRange: [],
        isDel: '0',
        isHc: '0',
        status: '4',
        billcode: '',
        mobile: '',
        paycode: '',
        memName: '',
        cmcode: '',
        spcode: '',
        eeid: '',
        shopid: '',
        eename: '',
        shoptype: ''
      },
      revokeForm: {
        id: '',
        billcode: '',
        hcMemo: ''
      },
      pageInfo: { page: 1, limit: 10 },
      detailInitData: {}, // 传入明细组件的初始值
      searchDialog: {
        title: '高级查询',
        visible: false
      },
      revokeDialog: {
        title: '撤单',
        visible: false
      },
      totalNum: '',
      totalMoney: '',
      viewTotal: {
        title: '本次查询共  0 条记录    合计总金额：￥0'
      },
      packages: [],
      employeeList: [],
      cardpays: [],
      allShopList: [],
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
    this.searchForm.saleTimeRange.push(date1)
    this.searchForm.saleTimeRange.unshift(date1)
    //this.getCraftsmans();
    this.getCardpays()
    this.getPackages()
    //this.search();
    this.getShopList({ status: '1' })
  },
  computed: {
    searchFormReq: function () {
      let reqObj = {}
      let saleTimeRange = this.searchForm.saleTimeRange
      if (saleTimeRange) {
        reqObj.saleTimeStart = this.searchForm.saleTimeRange[0]
        reqObj.saleTimeEnd = this.searchForm.saleTimeRange[1]
      } else {
        reqObj.saleTimeStart = ''
        reqObj.saleTimeEnd = ''
      }
      reqObj.billcode = this.searchForm.billcode
      reqObj.mobile = this.searchForm.mobile
      reqObj.paycode = this.searchForm.paycode
      reqObj.memName = this.searchForm.memName
      reqObj.cmcode = this.searchForm.cmcode
      reqObj.spcode = this.searchForm.spcode
      reqObj.eeid = this.searchForm.eeid
      reqObj.isDel = this.searchForm.isDel
      reqObj.isHc = this.searchForm.isHc
      reqObj.status = this.searchForm.status
      reqObj.shopid = this.searchForm.shopid
      reqObj.eename = this.searchForm.eename
      reqObj.shoptype = this.searchForm.shoptype
      return reqObj
    }
  },
  methods: {
    getData(reqParams) {
      const fetch = service.cashier.packageRecords.packagerecordList
      const params = { ...this.pageInfo, ...reqParams }
      this.$refs.table.reloadData({
        fetch,
        params
      })
      //显示总条数和金额
      service.cashier.packageRecords.packagerecordListSum(params).then(res => {
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
    //获取服务人员列表
    /* getCraftsmans(){
                service.employee.listAll({isDel:'0',status:'1'}).then(res=> {
                    if(res.resp_code == 200) {
                        this.employeeList = res.data;
                    }
                })
            },*/
    getCardpays() {
      service.cashier.payType.listAll({}).then(res => {
        if (res.resp_code == 200) {
          this.cardpays = res.data
        }
      })
    },
    getPackages() {
      service.servicepackage.findAll({ isDel: '0' }).then(res => {
        if (res.resp_code == 200) {
          this.packages = res.data
        }
      })
    },
    seniorSearch() {
      this.searchDialog.visible = true
    },
    search() {
      this.$refs['searchForm'].validate(valid => {
        if (valid) {
          this.pageInfo.page = 1
          this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize
          if (
            $yid.util.isEmpty(this.searchFormReq.saleTimeStart) ||
            $yid.util.isEmpty(this.searchFormReq.saleTimeEnd)
          ) {
            $yid.util.alert('请选择日期再进行查询!')
            return
          }
          let arg = this.DateMinus(
            this.searchFormReq.saleTimeStart,
            this.searchFormReq.saleTimeEnd
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
    gjsearch() {
      this.$refs['searchForm'].validate(valid => {
        if (valid) {
          this.pageInfo.page = 1
          this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize
          if (
            $yid.util.isEmpty(this.searchFormReq.saleTimeStart) ||
            $yid.util.isEmpty(this.searchFormReq.saleTimeEnd)
          ) {
            $yid.util.alert('请选择日期再进行查询!')
            return
          }
          let arg = this.DateMinus(
            this.searchFormReq.saleTimeStart,
            this.searchFormReq.saleTimeEnd
          )
          if (Number(arg) > 30) {
            $yid.util.error('时间间隔请选择30天之内!')
            return
          }
          this.getData(this.searchFormReq)
        }
      })
    },
    cleanSearch() {
      this.searchForm.billcode = ''
      this.searchForm.mobile = ''
      this.searchForm.paycode = ''
      this.searchForm.memName = ''
      this.searchForm.cmcode = ''
      this.searchForm.spcode = ''
      this.searchForm.isOpen = ''
      this.searchForm.eeid = ''
      this.searchForm.eename = ''
    },
    searchgj() {
      console.log(this.searchFormReq)
      this.gjsearch()
      this.searchDialog.visible = false
    },
    cancel() {
      this.searchDialog.visible = false
    },
    getSexName(sex) {
      let res = ''
      if (sex === '1') {
        res = '男'
      } else if (sex === '2') {
        res = '女'
      }
      return res
    },
    checkDetail(row) {
      this.detailShow = true
      this.detailInitData.billid = row.id
      this.detailInitData.entryData = row
      this.$refs.billDetailPage.initData(this.detailInitData)
    },
    closeDetailPage() {
      this.detailInitData = {}
      this.detailShow = false
      this.search()
    },
    revokeBill(row) {
      this.revokeForm.id = row.id
      this.revokeForm.billcode = row.billcode
      this.revokeForm.hcMemo = ''
      this.revokeDialog.visible = true
    },
    revokeCancel() {
      this.revokeDialog.visible = false
    },
    revoke() {
      if (this.revokeForm.id == null || this.revokeForm.id.length == 0) {
        $yid.util.alert('单据id为空，不允许撤单')
        return
      }
      if (this.revokeForm.hcMemo != null && this.revokeForm.hcMemo.length > 0) {
        if (this.revokeForm.hcMemo.length > 30) {
          $yid.util.alert('撤单备注不能超过30个字')
          return
        }
      }
      service.cashier.packageRecords.revokeBill(this.revokeForm).then(res => {
        if (res.resp_code == 200) {
          $yid.util.success('操作成功')
          this.revokeDialog.visible = false
          this.search()
        } else {
          $yid.util.error(res.resp_msg)
          return
        }
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
    importBill() {
      let saleTimeStart = this.searchFormReq.saleTimeStart
      let saleTimeEnd = this.searchFormReq.saleTimeEnd
      /*let shopid = this.searchFormReq.shopid;
                if($yid.util.isEmpty(shopid)){
                    $yid.util.error("请选择门店");
                    return;
                }*/
      if ($yid.util.isEmpty(saleTimeStart) || $yid.util.isEmpty(saleTimeEnd)) {
        $yid.util.error('请选择日期')
        return
      }
      let arg = this.DateMinus(saleTimeStart, saleTimeEnd)
      if (Number(arg) > 30) {
        $yid.util.error('时间间隔请选择30天之内!')
        return
      }
      download(
        $yid.config.API.BASE +
          'api-cashier/packagerecords/packagerecordsExportForChain',
        this.searchFormReq
      )
    },
    DateMinus(date1, date2) {
      //date1:小日期   date2:大日期
      var sdate = new Date(date1)
      var now = new Date(date2)
      var days = now.getTime() - sdate.getTime()
      var day = parseInt(days / (1000 * 60 * 60 * 24))
      return day
    },
    changeShop() {
      const param = {}
      let type = this.searchForm.shoptype
      param.status = '1'
      param.type = type
      service.chain.shop.shopList(param).then(res => {
        if (res.resp_code == 200) {
          this.filterShopList = res.data
          this.allShopList = Object.assign(this.filterShopList) //保留原数据
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.member-relation {
}
</style>
