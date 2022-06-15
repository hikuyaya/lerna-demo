<template>
  <div class="member-relation">
    <el-tabs v-model="activeName" @tab-click="handleClick" v-show="!detailShow">
      <el-tab-pane label="服务单记录" name="analyze">
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
        <yid-table pagination ref="table">
          <!--<yid-table-column label="序" min-width="60" prop="billindex"></yid-table-column>-->
          <yid-table-column
            label="服务单号"
            min-width="150"
            prop="billcode"></yid-table-column>
          <yid-table-column
            label="店名"
            min-width="120"
            prop="shopname"></yid-table-column>
          <yid-table-column
            label="消费时间"
            min-width="160"
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
          <yid-table-column
            label="顾客"
            min-width="180"
            prop="cardInfo"
            class="titlelabel">
            <template slot-scope="scope">
              <span
                >{{
                  scope.row.custname ? scope.row.custname : scope.row.memName
                }}
                |{{
                  getSexName(
                    scope.row.custsex ? scope.row.custsex : scope.row.sex
                  )
                }}</span
              ><br />
              <span>计客次：{{ scope.row.isCompute == '1' ? '是' : '否' }}</span
              ><br />
              <span>{{
                scope.row.custtel ? scope.row.custtel : scope.row.mobile
              }}</span
              ><br />
            </template>
          </yid-table-column>
          <yid-table-column
            label="项目/客装"
            min-width="200"
            prop="servs"
            align="left">
            <template slot-scope="scope">
              <span v-for="servs in scope.row.servVOList"
                >{{ servs.sname }}*{{ servs.num }} [{{
                  getServType(servs.stype)
                }}]<br
              /></span>
            </template>
          </yid-table-column>
          <yid-table-column
            label="第一工位"
            min-width="180"
            prop="royaltys"
            align="left">
            <template slot-scope="scope">
              <span v-for="royaltys in scope.row.royaltyList">
                <span v-if="Number(royaltys.postion) == 1">
                  {{ royaltys.eename }}|{{ royaltys.yj }}|{{
                    Number(royaltys.isApppoint) == 1 ? '指定' : '不指定'
                  }}<br />
                </span>
              </span>
            </template>
          </yid-table-column>
          <yid-table-column
            label="第二工位"
            min-width="180"
            prop="royaltys"
            align="left">
            <template slot-scope="scope">
              <span v-for="royaltys in scope.row.royaltyList">
                <span v-if="Number(royaltys.postion) == 2">
                  {{ royaltys.eename }}|{{ royaltys.yj }}|{{
                    Number(royaltys.isApppoint) == 1 ? '指定' : '不指定'
                  }}<br />
                </span>
              </span>
            </template>
          </yid-table-column>
          <yid-table-column
            label="营销活动"
            min-width="200"
            prop="serviceActivity"
            align="left">
            <template slot-scope="scope">
              <span v-for="activ in scope.row.serviceActivity">
                {{ activ.popname }}<br />
              </span>
            </template>
          </yid-table-column>
          <yid-table-column label="单据金额" min-width="150" prop="totalMoney">
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
          <!-- <yid-table-column label="支付方式" min-width="150" prop="pays">
                         <template slot-scope="scope">
                             <span v-for="pays in scope.row.payList">￥{{pays.money}} {{pays.payname}}<br></span>
                         </template>
                     </yid-table-column>-->
          <yid-table-column label="总业绩" min-width="150" prop="sumyj">
            <template slot-scope="scope"> ￥{{ scope.row.sumyj }} </template>
          </yid-table-column>
          <!--<yid-table-column label="员工" min-width="250" prop="members" align="left">
                        <template slot-scope="scope">
                            <span v-for="royaltys in scope.row.royaltyList">第{{royaltys.postion}}工位：{{royaltys.eecode}} {{royaltys.eename}}<br></span>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="员工业绩" min-width="200" prop="yjs">
                        <template slot-scope="scope">
                            <span v-for="royaltys in scope.row.royaltyList">业绩：￥{{royaltys.yj}} {{getisAppoint(royaltys.isApppoint)}}<br></span>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="提成" min-width="150" prop="royaltys">
                        <template slot-scope="scope">
                            <span v-for="royaltys in scope.row.royaltyList">提成：￥{{royaltys.royalty}}<br></span>
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
      </el-tab-pane>
      <el-tab-pane label="已过期" name="expired">
        <el-form ref="searchFormOver" inline :model="searchFormOver">
          <el-form-item label="日期：">
            <el-date-picker
              :clearable="false"
              v-model="searchFormOver.saleTimeRange"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="门店：">
            <el-select
              clearable
              v-model.trim="searchFormOver.shopid"
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
            <el-button @click="searchOver" type="primary">查询</el-button>
          </el-form-item>
        </el-form>
        <div style="margin-top: -20px">
          <el-divider />
        </div>
        <yid-table pagination ref="tableOver" style="margin-top: 15px">
          <yid-table-column
            label="牌号"
            min-width="150"
            prop="billNo"></yid-table-column>
          <yid-table-column label="顾客/手机号" min-width="200" prop="cardInfo">
            <template slot-scope="scope">
              <span>{{ scope.row.memName }} {{ scope.row.mobile }}</span>
            </template>
          </yid-table-column>
          <yid-table-column
            label="服务单号"
            min-width="200"
            prop="billcode"></yid-table-column>
          <yid-table-column
            label="店名"
            min-width="150"
            prop="shopname"></yid-table-column>
          <yid-table-column
            label="开单时间"
            min-width="150"
            prop="createdTime"></yid-table-column>
          <yid-table-column label="项目" min-width="200" prop="servs">
            <template slot-scope="scope">
              <span v-for="servs in scope.row.servVOList"
                >￥{{ servs.sname }}*{{ servs.num }} [{{
                  getServType(servs.stype)
                }}]<br
              /></span>
            </template>
          </yid-table-column>
          <yid-table-column label="总价" min-width="150" prop="totalMoney">
            <template slot-scope="scope">
              ￥{{ scope.row.totalMoney }}
            </template>
          </yid-table-column>
          <yid-table-column label="服务人员" min-width="200" prop="members">
            <template slot-scope="scope">
              <span v-for="royaltys in scope.row.royaltyList"
                >{{ royaltys.eecode }} {{ royaltys.eename }}
                {{ getisAppoint(royaltys.isApppoint) }}<br
              /></span>
            </template>
          </yid-table-column>
          <yid-table-column
            label="操作"
            min-width="120"
            prop="content"
            fixed="right">
            <template slot-scope="scope">
              <el-link type="primary" @click="cancelBill(scope.row)"
                >作废</el-link
              >
            </template>
          </yid-table-column>
        </yid-table>
      </el-tab-pane>
      <el-tab-pane label="已作废" name="invalid">
        <el-form ref="searchFormZf" inline :model="searchFormZf">
          <el-form-item label="日期：">
            <el-date-picker
              :clearable="false"
              v-model="searchFormZf.saleTimeRange"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
            <el-form-item label="门店：">
              <el-select
                clearable
                v-model.trim="searchFormZf.shopid"
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
          </el-form-item>
          <el-form-item style="margin-bottom: 0">
            <el-button @click="searchZf" type="primary">查询</el-button>
          </el-form-item>
        </el-form>
        <div style="margin-top: -20px">
          <el-divider />
        </div>
        <yid-table pagination ref="tableZf" style="margin-top: 15px">
          <yid-table-column
            label="牌号"
            min-width="150"
            prop="billNo"></yid-table-column>
          <yid-table-column label="顾客/手机号" min-width="200" prop="cardInfo">
            <template slot-scope="scope">
              <span>{{ scope.row.memName }} {{ scope.row.mobile }}</span>
            </template>
          </yid-table-column>
          <yid-table-column
            label="服务单号"
            min-width="200"
            prop="billcode"></yid-table-column>
          <yid-table-column
            label="店名"
            min-width="150"
            prop="shopname"></yid-table-column>
          <yid-table-column
            label="开单时间"
            min-width="200"
            prop="createdTime"></yid-table-column>
          <yid-table-column label="项目" min-width="200" prop="servs">
            <template slot-scope="scope">
              <span v-for="servs in scope.row.servVOList"
                >￥{{ servs.sname }}*{{ servs.num }} [{{
                  getServType(servs.stype)
                }}]<br
              /></span>
            </template>
          </yid-table-column>
          <yid-table-column label="总价" min-width="150" prop="totalMoney">
            <template slot-scope="scope">
              ￥{{ scope.row.totalMoney == null ? 0 : scope.row.totalMoney }}
            </template>
          </yid-table-column>
          <yid-table-column label="服务人员" min-width="200" prop="members">
            <template slot-scope="scope">
              <span v-for="royaltys in scope.row.royaltyList"
                >{{ royaltys.eecode }} {{ royaltys.eename }}
                {{ getisAppoint(royaltys.isApppoint) }}<br
              /></span>
            </template>
          </yid-table-column>
          <yid-table-column
            label="作废时间"
            min-width="200"
            prop="cancelTime"></yid-table-column>
          <yid-table-column
            label="作废理由"
            min-width="200"
            prop="cancelReason"></yid-table-column>
          <yid-table-column
            label="操作人"
            min-width="150"
            prop="cancelOper"></yid-table-column>
          <yid-table-column
            label="操作"
            min-width="120"
            prop="content"
            fixed="right">
            <template slot-scope="scope">
              <el-link type="primary" @click="deleteZfBill(scope.row)"
                >删除</el-link
              >
            </template>
          </yid-table-column>
        </yid-table>
      </el-tab-pane>
    </el-tabs>

    <el-collapse-transition>
      <div v-show="detailShow">
        <billDetail
          ref="billDetailPage"
          @onClose="closeDetailPage"></billDetail>
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
        <el-form-item label="支付方式：" prop="cardpay">
          <el-select
            clearable
            value-key="id"
            filterable
            placeholder="请选择"
            v-model.trim="searchForm.cardpay">
            <el-option
              :key="item.paycode"
              :label="item.payname"
              :value="item.paycode"
              v-for="item in cardpays"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="优惠券：" prop="cpname">
          <el-input v-model="searchForm.cpname" style="width: 180px"></el-input>
        </el-form-item>
        <el-form-item label="顾客姓名：" prop="memName">
          <el-input
            v-model="searchForm.memName"
            style="width: 180px"></el-input>
        </el-form-item>
        <el-form-item label="会员卡号：" prop="channel">
          <el-input v-model="searchForm.cmcode" style="width: 180px"></el-input>
        </el-form-item>
        <el-form-item label="操作人：" prop="createdBy">
          <!--<el-select value-key="id" filterable placeholder="请选择" v-model.trim="searchForm.createdBy">-->
          <!--<el-option :key="item.id" :label="item.eename" :value="item.id" v-for="item in employeeList"></el-option>-->
          <el-input
            v-model="searchForm.createdBy"
            style="width: 180px"></el-input>
          <!--</el-select>-->
        </el-form-item>
        <el-form-item label="服务员工：" prop="eeid">
          <!--<el-select value-key="id" filterable placeholder="请选择" v-model.trim="searchForm.eeid">-->
          <!--<el-option :key="item.id" :label="item.eename" :value="item.id" v-for="item in employeeList"></el-option>-->
          <el-input v-model="searchForm.eename" style="width: 180px"></el-input>
          <!--</el-select>-->
        </el-form-item>
        <el-form-item label="开单方式：" prop="isread">
          <el-select
            clearable
            value-key="id"
            filterable
            placeholder="请选择"
            v-model.trim="searchForm.isread">
            <el-option
              :key="item.id"
              :label="item.name"
              :value="item.id"
              v-for="item in isreadList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客装：" prop="tid">
          <el-select
            v-model="searchForm.tid"
            filterable
            placeholder="请选择"
            clearable>
            <el-option
              v-for="item in prods"
              :key="item.pcode"
              :label="item.pname"
              :value="item.pcode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目：" prop="sid">
          <el-select
            v-model="searchForm.sid"
            filterable
            placeholder="请选择"
            clearable>
            <el-option
              v-for="item in sers"
              :key="item.servcode"
              :label="item.servname"
              :value="item.servcode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="营销活动：" prop="maid">
          <el-select
            v-model="searchForm.maid"
            filterable
            placeholder="请选择"
            clearable>
            <el-option
              v-for="item in mktInfos"
              :key="item.billcode"
              :label="item.name"
              :value="item.billcode">
            </el-option>
          </el-select>
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
    <yid-dialog
      :title="cancelDialog.title"
      :visible.sync="cancelDialog.visible"
      width="450px">
      <el-form label-width="140px" ref="cancelForm">
        <el-form-item label="请输入作废原因：" prop="cancelReason">
          <el-input
            v-model="cancelForm.cancelReason"
            type="textarea"
            :rows="4"
            style="width: 80%"
            placeholder="请输入0-30个字符" />
        </el-form-item>
        <el-form-item>
          <el-button @click="cancelCancel">取消</el-button>
          <el-button @click="cancelSale" type="primary">提交</el-button>
        </el-form-item>
      </el-form>
    </yid-dialog>
  </div>
</template>

<script>
import billDetail from './billDetail'
import service from '@src/service'
import download from '@src/library/http/download'
export default {
  name: 'member-relation',
  components: {
    billDetail
  },
  data() {
    return {
      value1: '',
      detailShow: false,
      activeName: 'analyze',
      model: {
        startTime: '',
        endTime: ''
      },
      tableData: [],
      detailInitData: {}, // 传入明细组件的初始值
      searchForm: {
        saleTimeRange: [],
        isDel: '0',
        isHc: '0',
        status: '4',
        billcode: '',
        mobile: '',
        cpname: '',
        cardpay: '',
        memName: '',
        cmcode: '',
        createdBy: '',
        eeid: '',
        shopid: '',
        eename: '',
        isread: '',
        sid: '',
        tid: '',
        maid: '',
        shoptype: ''
      },
      revokeForm: {
        id: '',
        billcode: '',
        hcMemo: ''
      },
      cancelForm: {
        id: '',
        billcode: '',
        cancelReason: '',
        revision: ''
      },
      searchFormOver: {
        saleTimeRange: [],
        isDel: '0',
        isHc: '0',
        status: '2',
        shopid: ''
      },
      searchFormZf: {
        saleTimeRange: [],
        isDel: '0',
        isHc: '0',
        status: '3',
        shopid: ''
      },
      pageInfo: { page: 1, limit: 10 },
      searchDialog: {
        title: '高级查询',
        visible: false
      },
      revokeDialog: {
        title: '撤单',
        visible: false
      },
      cancelDialog: {
        title: '作废',
        visible: false
      },
      isreadList: [
        {
          id: '0',
          name: '未读卡'
        },
        {
          id: '1',
          name: '读卡'
        },
        {
          id: '2',
          name: '扫码'
        }
      ],
      employeeList: [],
      cardpays: [],
      allShopList: [],
      filterShopList: [],
      prods: [],
      sers: [],
      mktInfos: []
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
    this.searchFormOver.saleTimeRange.push(date1)
    this.searchFormOver.saleTimeRange.unshift(date1)
    this.searchFormZf.saleTimeRange.push(date1)
    this.searchFormZf.saleTimeRange.unshift(date1)
    //this.getCraftsmans();
    this.getCardpays()
    //this.search();
    this.getProducts()
    this.getServs()
    this.getMktInfos()
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
      reqObj.cpname = this.searchForm.cpname
      reqObj.cardpay = this.searchForm.cardpay
      reqObj.memName = this.searchForm.memName
      reqObj.cmcode = this.searchForm.cmcode
      reqObj.createdBy = this.searchForm.createdBy
      reqObj.eeid = this.searchForm.eeid
      reqObj.isDel = this.searchForm.isDel
      reqObj.isHc = this.searchForm.isHc
      reqObj.status = this.searchForm.status
      reqObj.shopid = this.searchForm.shopid
      reqObj.shoptype = this.searchForm.shoptype
      reqObj.eename = this.searchForm.eename
      reqObj.isread = this.searchForm.isread
      reqObj.tid = this.searchForm.tid
      reqObj.sid = this.searchForm.sid
      reqObj.maid = this.searchForm.maid
      return reqObj
    },
    searchFormReqOver: function () {
      let reqObj = {}
      let saleTimeRangeOver = this.searchFormOver.saleTimeRange
      if (saleTimeRangeOver) {
        reqObj.updatedTimeStart = this.searchFormOver.saleTimeRange[0]
        reqObj.updatedTimeEnd = this.searchFormOver.saleTimeRange[1]
      } else {
        reqObj.updatedTimeStart = ''
        reqObj.updatedTimeEnd = ''
      }
      reqObj.isDel = this.searchFormOver.isDel
      reqObj.isHc = this.searchFormOver.isHc
      reqObj.status = this.searchFormOver.status
      reqObj.shopid = this.searchFormOver.shopid
      return reqObj
    },
    searchFormReqZf: function () {
      let reqObj = {}
      let saleTimeRangeZf = this.searchFormZf.saleTimeRange
      if (saleTimeRangeZf) {
        reqObj.cancelTimeStart = this.searchFormZf.saleTimeRange[0]
        reqObj.cancelTimeEnd = this.searchFormZf.saleTimeRange[1]
      } else {
        reqObj.cancelTimeStart = ''
        reqObj.cancelTimeEnd = ''
      }
      reqObj.isDel = this.searchFormZf.isDel
      reqObj.isHc = this.searchFormZf.isHc
      reqObj.status = this.searchFormZf.status
      reqObj.shopid = this.searchFormZf.shopid
      return reqObj
    }
  },
  methods: {
    getData(reqParams) {
      const fetch = service.cashier.serviceRecords.servicerecordList
      const params = { ...this.pageInfo, ...reqParams }
      params.status = '4'
      this.$refs.table.reloadData({
        fetch,
        params
      })
    },
    getDataOver(reqParams) {
      const fetch = service.cashier.serviceRecords.servicerecordList
      const params = { ...this.pageInfo, ...reqParams }
      params.status = '2'
      this.$refs.tableOver.reloadData({
        fetch,
        params
      })
    },
    getDataZf(reqParams) {
      const fetch = service.cashier.serviceRecords.servicerecordList
      const params = { ...this.pageInfo, ...reqParams }
      params.status = '3'
      this.$refs.tableZf.reloadData({
        fetch,
        params
      })
    },
    //获取服务人员列表
    /*getCraftsmans(){
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
    getProducts() {
      service.member.memberinfo
        .selectProductschain({ status: '1' })
        .then(res => {
          if (res.resp_code == 200) {
            this.prods = res.data
          }
        })
    },
    getServs() {
      service.member.memberinfo
        .selectServiceschain({ isDel: '0', status: '1' })
        .then(res => {
          if (res.resp_code == 200) {
            this.sers = res.data
          }
        })
    },
    getMktInfos() {
      service.cashier.mktInfo.listAll({ status: '2' }).then(res => {
        if (res.resp_code == 200) {
          this.mktInfos = res.data
        }
      })
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
    searchOver() {
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs.tableOver.Pagination.internalPageSize
      console.log(this.searchFormReqOver)
      if (
        $yid.util.isEmpty(this.searchFormReqOver.updatedTimeStart) ||
        $yid.util.isEmpty(this.searchFormReqOver.updatedTimeEnd)
      ) {
        $yid.util.alert('请选择日期再进行查询!')
        return
      }
      let arg = this.DateMinus(
        this.searchFormReqOver.updatedTimeStart,
        this.searchFormReqOver.updatedTimeEnd
      )
      if (Number(arg) > 30) {
        $yid.util.error('时间间隔请选择30天之内!')
        return
      }
      this.getDataOver(this.searchFormReqOver)
    },
    searchZf() {
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs.tableZf.Pagination.internalPageSize
      console.log(this.searchFormReqZf)
      if (
        $yid.util.isEmpty(this.searchFormReqZf.cancelTimeStart) ||
        $yid.util.isEmpty(this.searchFormReqZf.cancelTimeEnd)
      ) {
        $yid.util.alert('请选择日期再进行查询!')
        return
      }
      let arg = this.DateMinus(
        this.searchFormReqZf.cancelTimeStart,
        this.searchFormReqZf.cancelTimeEnd
      )
      if (Number(arg) > 30) {
        $yid.util.error('时间间隔请选择30天之内!')
        return
      }
      this.getDataZf(this.searchFormReqZf)
    },
    cleanSearch() {
      this.searchForm.billcode = ''
      this.searchForm.mobile = ''
      this.searchForm.cpname = ''
      this.searchForm.cardpay = ''
      this.searchForm.memName = ''
      this.searchForm.cmcode = ''
      this.searchForm.createdBy = ''
      this.searchForm.eeid = ''
      this.searchForm.eename = ''
      this.searchForm.isread = ''
      this.searchForm.tid = ''
      this.searchForm.sid = ''
      this.searchForm.maid = ''
    },
    checkDetail(row) {
      this.detailShow = true
      this.detailInitData.billid = row.id
      this.detailInitData.entryData = row
      this.$refs.billDetailPage.initData(this.detailInitData)
    },
    revokeBill(row) {
      this.revokeForm.id = row.id
      this.revokeForm.billcode = row.billcode
      this.revokeForm.hcMemo = ''
      this.revokeDialog.visible = true
    },
    closeDetailPage() {
      this.detailInitData = {}
      this.detailShow = false
      this.search()
    },
    seniorSearch() {
      this.searchDialog.visible = true
    },
    searchgj() {
      console.log(this.searchFormReq)
      this.gjsearch()
      this.searchDialog.visible = false
    },
    cancel() {
      this.searchDialog.visible = false
    },
    cancelCancel() {
      this.cancelDialog.visible = false
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
      service.cashier.serviceRecords.revokeBill(this.revokeForm).then(res => {
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
    handleClick(tab) {
      if (tab.name == 'analyze') {
        this.search()
      } else if (tab.name == 'expired') {
        this.searchOver()
      } else if (tab.name == 'invalid') {
        this.searchZf()
      }
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
    getisAppoint(isApppoint) {
      let res = ''
      if (isApppoint === '0') {
        res = '非指定'
      } else if (isApppoint === '1') {
        res = '指定'
      }
      return res
    },
    getServType(stype) {
      let res = ''
      if (stype === '1') {
        res = '项目'
      } else if (stype === '2') {
        res = '产品'
      }
      return res
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
    deleteZfBill(row) {
      if (row.status != '3') {
        $yid.util.alert('已作废的单据才可以删除')
        return false
      }
      $yid.util.confirm('确定删除服务单' + row.billcode + '?', '', '', () => {
        const billrow = {}
        billrow.id = row.id
        billrow.isDel = '1'
        service.cashier.serviceRecords.saveOrUpdate(billrow).then(res => {
          if (res.resp_code == 200) {
            this.searchZf()
          }
        })
      })
    },
    cancelBill(row) {
      this.cancelForm.id = row.id
      this.cancelForm.billcode = row.billcode
      this.cancelForm.cancelReason = ''
      this.cancelForm.revision = row.revision
      this.cancelDialog.visible = true
    },
    cancelSale(row) {
      if (this.cancelForm.id == null || this.cancelForm.id.length == 0) {
        $yid.util.alert('单据id为空，不允许作废')
        return
      }
      if (
        this.cancelForm.cancelReason != null &&
        this.cancelForm.cancelReason.length > 0
      ) {
        if (this.cancelForm.cancelReason.length > 30) {
          $yid.util.alert('作废原因不能超过30个字')
          return
        }
      }
      let reasonArr = []
      reasonArr.push({
        id: this.cancelForm.id,
        revision: this.cancelForm.revision,
        cancelReason: this.cancelForm.cancelReason
      })
      service.cashier.serviceRecords.cancel(reasonArr).then(res => {
        if (res.resp_code == 200) {
          $yid.util.success('操作成功')
          this.cancelDialog.visible = false
          this.searchOver()
        } else {
          $yid.util.error(res.resp_msg)
          return
        }
      })
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
          'api-cashier/servicerecords/servicerecordsExportForChain',
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
.member-relation {
}
</style>
